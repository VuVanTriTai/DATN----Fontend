import { ApiResponse } from "@/types/apiResponse";
import { LoginResponse, User } from "@/types/auth";
import {
  clearToken,
  getAccessToken,
  getRefreshToken,
  setToken,
} from "@/utils/authUtils";
import axios from "axios";

/**
 * API Configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

// Khởi tạo axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor: Tự động đính kèm Token vào Header
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Xử lý làm mới Token (Refresh Token) tự động
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearToken();
        window.location.href = "/auth";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = res.data.data;

        setToken(accessToken, newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearToken();
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

/**
 * API Service Object
 */
export const api = {
  // 1. Xác thực người dùng
  auth: {
    login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
      const response = await axiosInstance.post("/auth/login", { email, password });
      setToken(response.data.data.accessToken, response.data.data.refreshToken);
      return response.data;
    },
    register: async (name: string, email: string, password: string): Promise<ApiResponse<User>> => {
      const response = await axiosInstance.post("/auth/register", { fullName: name, email, password });
      return response.data;
    },
    getMe: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    }
  },

  // 2. Hệ thống Quiz (Tạo bằng Groq)
  quiz: {
    generate: async (data: any) => {
      const response = await axiosInstance.post("/quiz/generate", data);
      return response.data;
    },
    getById: async (id: string) => {
      const response = await axiosInstance.get(`/quiz/${id}`);
      return response.data;
    },
    getPublic: async (id: string) => {
      const response = await axiosInstance.get(`/quiz/public/${id}`);
      return response.data;
    },
    submit: async (id: string, answers: any, duration?: number) => {
      const response = await axiosInstance.post(`/quiz/submit/${id}`, {
        answers,
        duration: duration || 0,
      });
      return response.data;
    },
    getHistory: async () => {
      const response = await axiosInstance.get("/quiz/history/me");
      return response.data;
    },
    delete: async (id: string) => {
      const response = await axiosInstance.delete(`/quiz/${id}`);
      return response.data;
    },
    // Trong object api.quiz hoặc api.plan
    submitLessonQuiz: async (data: { planId: string; dayNumber: number; answers: any }) => {
    const response = await axiosInstance.post("/quiz/submit-lesson", data);
    return response.data;
},
  },

  // 3. Hệ thống Lộ trình học tập (Plan & Lesson)
  plan: {
    generateFromText: async (data: { title: string; extractedText: string; numDays: number }) => {
      const response = await axiosInstance.post("/plan/generate-from-text", data);
      return response.data;
    },
    getById: async (id: string) => {
      const response = await axiosInstance.get(`/plan/${id}`);
      return response.data;
    },
    getLessonDetail: async (planId: string, dayNumber: number | string) => {
      // Endpoint khớp với: router.get('/:id/lesson/:dayNumber', getLessonDetail)
      const response = await axiosInstance.get(`/plan/${planId}/lesson/${dayNumber}`);
      return response.data;
    }
  },

  // 4. Hệ thống tương tác AI (RAG - Groq)
  ai: {
    chatDoc: async (question: string, courseId: string) => {
      const response = await axiosInstance.post("/ai/chat-doc", { question, courseId });
      return response.data;
    },
    search: async (question: string, courseId: string) => {
      const response = await axiosInstance.post("/ai/search", { question, courseId });
      return response.data;
    }
  },

  // 5. Xử lý File & Tài liệu
  file: {
    extract: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosInstance.post("/file/extract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }
  },

  // 6. Xử lý Khóa học (Course - Pipeline xử lý file)
  course: {
    process: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosInstance.post("/course/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
   

    // 1. Hàm gọi AI phân tích tài liệu (mới)
    analyze: async (data: { text: string }) => {
      const response = await axiosInstance.post('/course/analyze', data);
      return response.data;
    },

    // 2. Hàm gọi AI chia lại lộ trình khi đổi số ngày (mới)
    regenerate: async (data: { rawText: string; days: number }) => {
      const response = await axiosInstance.post('/course/regenerate', data);
      return response.data;
    },

    // 3. Hàm tạo khóa học chính thức (mới)
    create: async (data: any) => {
      const response = await axiosInstance.post('/course/create', data);
      return response.data;
    }
  },
  

  // 7. Lịch sử làm bài (Attempts)
  attempt: {
    getUserAttempts: async () => {
      const response = await axiosInstance.get("/attempt");
      return response.data;
    },
    getById: async (id: string) => {
      const response = await axiosInstance.get(`/attempt/${id}`);
      return response.data;
    }
  }
};
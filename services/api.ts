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

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
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
 * Response Interceptor (Refresh Token)
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

export const api = {
  // 1. Xác thực
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

  // 2. Hệ thống Khóa học (Pipeline RAG & AI Analysis)
  course: {
    // BƯỚC 1: Phân tích tài liệu thô (để hiện trang Review)
    analyze: async (data: { text: string }) => {
      const response = await axiosInstance.post('/course/analyze', data);
      return response.data;
    },

    // BƯỚC 2: Chia lại lộ trình khi đổi số ngày
    regenerate: async (data: { rawText: string; days: number }) => {
      const response = await axiosInstance.post('/course/regenerate', data);
      return response.data;
    },

    // BƯỚC 3: Xác nhận tạo khóa học thật (Xử lý Chunking + Embedding + RAG)
    finalizeCreate: async (data: { 
      title: string; 
      extractedText: string; 
      numDays: number; 
      difficulty: string;
      previewPlan: any[]; 
    }) => {
      const response = await axiosInstance.post('/course/create', data);
      return response.data;
    }
  },

  // 3. Quản lý Lộ trình (Plan)
  plan: {
    getById: async (id: string) => {
      const response = await axiosInstance.get(`/plan/${id}`);
      return response.data;
    },
    // Lấy chi tiết bài học của 1 ngày cụ thể
    getLessonDetail: async (planId: string, dayNumber: number | string) => {
      const response = await axiosInstance.get(`/plan/${planId}/lesson/${dayNumber}`);
      return response.data;
    },
    // Lấy toàn bộ danh sách các Plan của tôi
    getMyPlans: async () => {
        const response = await axiosInstance.get("/plan/me");
        return response.data;
    },
     getDetail: async (id: string) => {
    const response = await axiosInstance.get(`/plan/${id}`);
    return response.data;
  },
  },

  // 4. Biên tập Bài học (Lesson Editor)
  lesson: {
    // Cập nhật nội dung Markdown, Summary, hoặc Quiz thủ công
    update: async (lessonId: string, data: any) => {
      const response = await axiosInstance.put(`/lesson/${lessonId}`, data);
      return response.data;
    },
    // Yêu cầu AI tạo bộ Quiz mới cho bài học này (Tính năng Sparkles AI)
    generateQuiz: async (lessonId: string, prompt?: string) => {
      const response = await axiosInstance.post(`/lesson/${lessonId}/generate-quiz`, { prompt });
      return response.data;
    },
    // Xóa bài học
    delete: async (lessonId: string) => {
        const response = await axiosInstance.delete(`/lesson/${lessonId}`);
        return response.data;
    }
  },

  // 5. Tương tác AI (RAG Chat)
  ai: {
    chatDoc: async (question: string, courseId: string) => {
      const response = await axiosInstance.post("/ai/chat-doc", { question, courseId });
      return response.data;
    }
  },

  // 6. Xử lý File
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

  // 7. Hệ thống Quiz & Lịch sử
  quiz: {
    submitLessonQuiz: async (data: { planId: string; dayNumber: number; answers: any }) => {
      const response = await axiosInstance.post("/quiz/submit-lesson", data);
      return response.data;
    },
    getHistory: async () => {
      const response = await axiosInstance.get("/quiz/history/me");
      return response.data;
    }
  },

  // 8. Kết quả & Tiến độ (Attempts)
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
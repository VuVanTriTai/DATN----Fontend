import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor: Gắn token vào mỗi request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor: Xử lý lỗi 401 (Hết hạn token)
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/auth";
    }
    return Promise.reject(err);
  }
);

export const api = {
  // 1. VAI TRÒ & TÀI KHOẢN (Auth & Profile)
  auth: {
    login: (data: any) => axiosInstance.post("/auth/login", data).then(res => res.data),
    register: (data: any) => axiosInstance.post("/auth/register", data).then(res => res.data),
    getMe: () => axiosInstance.get("/auth/me").then(res => res.data),
    getInstructors: () => axiosInstance.get("/auth/instructors").then(res => res.data), // Lấy ds giáo viên cho Learner chọn
    updateProfile: (data: any) => axiosInstance.put("/users/profile", data).then(res => res.data),
    changePassword: (data: any) => axiosInstance.post("/users/change-password", data).then(res => res.data),
  },

  // 2. QUY TRÌNH TẠO LỘ TRÌNH AI (Learner Only)
  course: {
    analyze: (text: string, learningGoals?: { focus: "theory" | "practice"; depth: "basic" | "deep" }) =>
      axiosInstance.post("/plan/analyze", { text, learningGoals }).then(res => res.data),
    regenerate: (data: any) => axiosInstance.post("/plan/regenerate", data).then(res => res.data),
    finalizeCreate: (data: any) => axiosInstance.post("/plan/create", data).then(res => res.data),
  },

  // 3. QUẢN LÝ LỘ TRÌNH & BÀI TẬP (Learner)
  // --- QUẢN LÝ LỘ TRÌNH (PLAN) ---
  plan: {
    getMyPlans: () => axiosInstance.get("/plan/me").then(res => res.data),
    getDetail: (id: string) => axiosInstance.get(`/plan/${id}`).then(res => res.data),
    getLesson: (id: string, day: string | number) => axiosInstance.get(`/plan/${id}/lesson/${day}`).then(res => res.data),
    delete: (id: string) => axiosInstance.delete(`/plan/${id}`).then(res => res.data),
    updateInstructor: (id: string, instructorId: string) => 
        axiosInstance.put(`/plan/${id}/instructor`, { instructorId }).then(res => res.data),
    share: (id: string) => axiosInstance.post(`/plan/${id}/share`).then(res => res.data),
  },

  // --- DÀNH CHO GIÁO VIÊN (INSTRUCTOR) ---
  instructor: {
    getStudents: () => axiosInstance.get("/enrollment/my-students").then(res => res.data),
    getStudentProgress: (studentId: string) => axiosInstance.get(`/instructor/student/${studentId}/progress`).then(res => res.data),
    gradeAssignment: (submissionId: string, data: { score: number, comment: string }) => 
        axiosInstance.post(`/assignment/grade/${submissionId}`, data).then(res => res.data),
  },
  // 5. TƯƠNG TÁC AI & FILE
  file: {
    extract: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return axiosInstance.post("/file/extract", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data);
    },
    getMyDocs: () => axiosInstance.get("/document").then(res => res.data),
  },
  ai: {
    chat: (question: string, planId: string) => axiosInstance.post("/ai/chat-doc", { question, planId }).then(res => res.data),
  },
  // 7. HỆ THỐNG TRẮC NGHIỆM (QUIZ)
  quiz: {
    /**
     * Chấm điểm Quiz trong bài học RAG 
     * HÀM QUAN TRỌNG NHẤT: Dùng để hoàn thành ngày học và mở khóa bài tiếp theo
     */
    submitLessonQuiz: async (data: { planId: string; dayNumber: number; answers: any }) => {
      const response = await axiosInstance.post("/quiz/submit-lesson", data);
      return response.data;
    },

    /**
     * Yêu cầu AI (Groq) tạo một bộ Quiz độc lập theo chủ đề
     */
    generate: async (data: { 
      title: string; 
      topic: string; 
      numQuestions: number; 
      difficulty: string; 
      questionType: string 
    }) => {
      const response = await axiosInstance.post("/quiz/generate", data);
      return response.data;
    },

    /**
     * Lấy toàn bộ danh sách Quiz do tôi tạo (Phân trang)
     */
    getMyQuizzes: async (page = 1, limit = 10) => {
      const response = await axiosInstance.get("/quiz", { params: { page, limit } });
      return response.data;
    },

    /**
     * Lấy chi tiết một bộ Quiz (Bao gồm cả đáp án - Dành cho chủ sở hữu)
     */
    getById: async (id: string) => {
      const response = await axiosInstance.get(`/quiz/${id}`);
      return response.data;
    },

    /**
     * Lấy bộ Quiz để làm bài (Ẩn đáp án - Dành cho người làm bài)
     */
    getPublic: async (id: string) => {
      const response = await axiosInstance.get(`/quiz/public/${id}`);
      return response.data;
    },

    /**
     * Nộp bài làm Quiz độc lập
     */
    submitStandalone: async (id: string, data: { answers: any; duration: number }) => {
      const response = await axiosInstance.post(`/quiz/submit/${id}`, data);
      return response.data;
    },

    /**
     * Lấy lịch sử tất cả các lần làm bài của tôi
     */
    getHistory: async () => {
      const response = await axiosInstance.get("/quiz/history/me");
      return response.data;
    },

    /**
     * Cập nhật nội dung bộ Quiz (Sửa câu hỏi, tiêu đề...)
     */
    update: async (id: string, data: any) => {
      const response = await axiosInstance.put(`/quiz/${id}`, data);
      return response.data;
    },

    /**
     * Xóa bộ Quiz (Soft delete)
     */
    delete: async (id: string) => {
      const response = await axiosInstance.delete(`/quiz/${id}`);
      return response.data;
    },

    /**
     * Tìm kiếm các bộ Quiz công khai trên hệ thống
     */
    search: async (keyword: string) => {
      const response = await axiosInstance.get("/quiz/search", { params: { keyword } });
      return response.data;
    }
  },
};
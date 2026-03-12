import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout"; // Bắt buộc phải có để hiện Sidebar/Topbar

// --- Import các trang bạn đã làm ---
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";     // Trang chủ mới
import MyCourses from "./pages/MyCourses";     // Khóa học của tôi
import AIChat from "./pages/AIChat";           // Chat với AI
import Marketplace from "./pages/Marketplace"; // Chợ khóa học
import CreatePlan from "./pages/CreatePlan";   // Tạo kế hoạch học tập mới
import Generator from "./pages/Generator";     // Trình tạo Quiz
import QuizPlay from "./pages/QuizPlay";       // Trang làm bài
import QuizEdit from "./pages/QuizEdit";       // Trang sửa Quiz
import QuizHistory from "./pages/QuizHistory"; // Lịch sử làm bài
import AttemptDetail from "./pages/AttemptDetail"; // Chi tiết kết quả
import CreatePlanFromDoc from "./pages/CreatePlanFromDoc";
import LessonView from "./pages/LessonView";
import StudyPlan from "./pages/StudyPlan";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        {/* Nền tối sâu Navy theo phong cách Study Assistant */}
        <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-purple-500/30">
          <Routes>
            
            {/* 1. TRANG CÔNG KHAI (Không có Sidebar) */}
            <Route path="/auth" element={<Auth />} />

            {/* 2. TRANG LÀM BÀI (Thường ẩn Sidebar để tập trung - Focus Mode) */}
            <Route path="/quiz/:id" element={
              <ProtectedRoute>
                <QuizPlay />
              </ProtectedRoute>
            } />

            {/* 3. CÁC TRANG DASHBOARD (Có Sidebar + Topbar thông qua MainLayout) */}
            
            {/* Trang chủ - Dashboard */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout><Dashboard /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Khóa học của tôi */}
            <Route path="/courses" element={
              <ProtectedRoute>
                <MainLayout><MyCourses /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Chat với trợ lý AI */}
            <Route path="/ai-chat" element={
              <ProtectedRoute>
                <MainLayout><AIChat /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Chợ khóa học */}
            <Route path="/market" element={
              <ProtectedRoute>
                <MainLayout><Marketplace /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Form tạo kế hoạch học tập mới */}
            <Route path="/create-plan" element={
              <ProtectedRoute>
                <MainLayout><CreatePlan /></MainLayout>
              </ProtectedRoute>
            } />
            <Route 
  path="/create-plan-from-doc" 
  element={<ProtectedRoute><MainLayout><CreatePlanFromDoc /></MainLayout></ProtectedRoute>} 
/>

            {/* Công cụ tạo Quiz/Tài liệu */}
            <Route path="/generate" element={
              <ProtectedRoute>
                <MainLayout><Generator /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Quản lý/Lịch sử học tập */}
            <Route path="/history" element={
              <ProtectedRoute>
                <MainLayout><QuizHistory /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Chi tiết từng lần làm bài */}
            <Route path="/history/detail/:quizId/:number" element={
              <ProtectedRoute>
                <MainLayout><AttemptDetail /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Chỉnh sửa nội dung học tập */}
            <Route path="/quiz/:id/edit" element={
              <ProtectedRoute>
                <MainLayout><QuizEdit /></MainLayout>
              </ProtectedRoute>
            } />

          </Routes>
          // Route cho trang Lộ trình (Ảnh 2 - Roadmap)
<Route path="/plan/:id" element={<ProtectedRoute><MainLayout><StudyPlan /></MainLayout></ProtectedRoute>} />

// Route cho trang Xem bài học (Ảnh 1 & 3 - Tab view)
<Route path="/plan/:id/lesson/:lessonId" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
        
        <Route path="/plan/:planId/lesson/:dayNumber" element={<ProtectedRoute><MainLayout><LessonView /></MainLayout></ProtectedRoute>} />
        






        
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
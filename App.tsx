import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

// --- Import các trang ---
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MyCourses from "./pages/MyCourses";
import AIChat from "./pages/AIChat";
import Marketplace from "./pages/Marketplace";
import CreatePlan from "./pages/CreatePlan";
import Generator from "./pages/Generator";
import QuizPlay from "./pages/QuizPlay";
import QuizEdit from "./pages/QuizEdit";
import QuizHistory from "./pages/QuizHistory";
import AttemptDetail from "./pages/AttemptDetail";
import CreatePlanFromDoc from "./pages/CreatePlanFromDoc";
import LessonView from "./pages/LessonView";
import StudyPlan from "./pages/StudyPlan";
import PlanDetail from './pages/PlanDetail';


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        {/* Nền tối theo phong cách AI Study Assistant */}
        <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <Routes>
            
            {/* 1. TRANG CÔNG KHAI */}
            <Route path="/auth" element={<Auth />} />

            {/* 2. TRANG LÀM BÀI (Focus Mode - Không Sidebar) */}
            <Route path="/quiz/:id" element={
              <ProtectedRoute>
                <QuizPlay />
              </ProtectedRoute>
            } />

            {/* 3. CÁC TRANG CÓ SIDEBAR & TOPBAR (Bọc trong MainLayout) */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              
              {/* Trang chủ / Dashboard */}
              <Route path="/" element={<Dashboard />} />

              {/* Khóa học & Lộ trình */}
              <Route path="/courses" element={<MyCourses />} />
              <Route path="/create-plan" element={<CreatePlan />} />
              <Route path="/create-plan-from-doc" element={<CreatePlanFromDoc />} />
              
              {/* HỆ THỐNG LỘ TRÌNH (PLAN) - QUAN TRỌNG NHẤT */}
              {/* Trang Roadmap (Các ô vuông Ngày 1, 2, 3...) */}
              <Route path="/plan/:id" element={<StudyPlan />} />
              
              {/* Trang chi tiết bài học (Học tập, Trắc nghiệm, Chat AI) */}
              <Route path="/plan/:id/lesson/:dayNumber" element={<LessonView />} />

              {/* Trí tuệ nhân tạo & Công cụ */}
              <Route path="/ai-chat" element={<AIChat />} />
              <Route path="/generate" element={<Generator />} />
              <Route path="/market" element={<Marketplace />} />

              {/* Quản lý & Lịch sử */}
              <Route path="/history" element={<QuizHistory />} />
              <Route path="/history/detail/:quizId/:number" element={<AttemptDetail />} />
              <Route path="/quiz/:id/edit" element={<QuizEdit />} />

            </Route>

            {/* Fallback - Có thể thêm trang 404 ở đây */}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
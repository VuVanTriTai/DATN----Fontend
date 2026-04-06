import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages - Auth & Profile
import Auth from './pages/auth/Auth';
import Profile from './pages/profile/Profile';

// Pages - Learner (Người học)
import LearnerDashboard from './pages/learner/Dashboard';
import MyPlans from './pages/learner/MyPlans';
import PlanDetail from './pages/learner/PlanDetail';
import Documents from './pages/learner/Documents';
import CreatePlanFromDoc from './pages/learner/CreateCourse/CreatePlanFromDoc'; 
import LessonView from './pages/learner/LessonView';

// Pages - Instructor (Người hướng dẫn)
import StudentList from './pages/instructor/StudentList';
import SharedPlans from './pages/instructor/SharedPlans';
import StudentPlanView from './pages/instructor/StudentPlanView';

/**
 * 1. Component Bảo vệ Tuyến đường (Hỗ trợ phân loại Learner/Instructor)
 */
const ProtectedRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: React.ReactNode, 
  allowedRole?: 'learner' | 'instructor' 
}) => {
  const { user, role } = useAuth();

  // Nếu chưa đăng nhập -> Đá về trang Auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Nếu yêu cầu vai trò cụ thể nhưng user không khớp vai trò -> Đá về trang chủ
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

/**
 * 2. Component chứa nội dung định tuyến (AppContent)
 * Tách riêng để có thể sử dụng hook useAuth() bên trong AuthProvider
 */
function AppRoutes() {
  const { role, user } = useAuth();

  return (
    <Routes>
      {/* ROUTE PUBLIC: TRANG LOGIN / REGISTER */}
      {/* Nếu đã login rồi mà vào /auth thì tự đá về trang chủ index */}
      <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" replace />} />

      {/* NHÓM ROUTE CẦN ĐĂNG NHẬP (Bọc trong MainLayout và ProtectedRoute) */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        
        {/* Trang Index: Tự động điều hướng theo Role ngay khi vào localhost:3000 */}
        <Route index element={
          role === 'instructor' 
            ? <Navigate to="/instructor/students" replace /> 
            : <Navigate to="/dashboard" replace />
        } />

        {/* Trang thông tin cá nhân (Dùng chung 2 role) */}
        <Route path="profile" element={<Profile />} />

        {/* --- NHÓM ROUTE DÀNH CHO NGƯỜI HỌC (LEARNER) --- */}
        <Route path="dashboard" element={
          <ProtectedRoute allowedRole="learner"><LearnerDashboard /></ProtectedRoute>
        } />
        <Route path="create-plan" element={
          <ProtectedRoute allowedRole="learner"><CreatePlanFromDoc /></ProtectedRoute>
        } />
        <Route path="my-plans" element={
          <ProtectedRoute allowedRole="learner"><MyPlans /></ProtectedRoute>
        } />
        <Route path="plan/:id" element={
          <ProtectedRoute allowedRole="learner"><PlanDetail /></ProtectedRoute>
        } />
        <Route path="plan/:id/lesson/:dayNumber" element={
          <ProtectedRoute allowedRole="learner"><LessonView /></ProtectedRoute>
        } />
        <Route path="documents" element={
          <ProtectedRoute allowedRole="learner"><Documents /></ProtectedRoute>
        } />

        {/* --- NHÓM ROUTE DÀNH CHO GIÁO VIÊN (INSTRUCTOR) --- */}
        <Route path="instructor/students" element={
          <ProtectedRoute allowedRole="instructor"><StudentList /></ProtectedRoute>
        } />
        <Route path="instructor/shared" element={
          <ProtectedRoute allowedRole="instructor"><SharedPlans /></ProtectedRoute>
        } />
        <Route path="instructor/student-plan/:planId" element={
          <ProtectedRoute allowedRole="instructor"><StudentPlanView /></ProtectedRoute>
        } />

      </Route>

      {/* Bẫy lỗi 404 hoặc đường dẫn lạ -> Quay về trang chủ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * 3. COMPONENT GỐC (Main Entry)
 */
function App() {
  return (
    <BrowserRouter>
      {/* 
          QUAN TRỌNG: AuthProvider phải nằm trong BrowserRouter 
          thì mới dùng được hook điều hướng bên trong nó (nếu cần).
      */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
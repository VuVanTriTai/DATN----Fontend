import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken } from '@/utils/authUtils'; // Đảm bảo đường dẫn này đúng với file utils của bạn
import { Outlet } from 'react-router-dom';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getAccessToken();

  if (!token) {
    // Nếu không có token, điều hướng về trang Auth
    return <Navigate to="/auth" replace />;
  }

  // Nếu đã đăng nhập, hiển thị nội dung trang đó
// Sửa chỗ này để hỗ trợ cả 2 cách dùng
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
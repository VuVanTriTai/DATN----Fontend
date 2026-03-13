import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom'; // 1. Import thêm Outlet

// 2. Thêm dấu "?" sau children để biến nó thành tùy chọn (optional)
const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0f172a] dark:bg-[#020617] text-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          {/* 3. Sử dụng {children || <Outlet />} */}
          {/* Nếu có children truyền vào thì hiện children, nếu không thì hiện nội dung Route (Outlet) */}
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
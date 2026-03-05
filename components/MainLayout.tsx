import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0f172a] dark:bg-[#020617] text-white">
      {/* Sidebar cố định bên trái */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar phía trên */}
        <Topbar />
        
        {/* Nội dung chính có thể cuộn */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

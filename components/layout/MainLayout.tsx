import React from 'react';
import { Outlet } from 'react-router-dom';
//import sidebar from './Sidebar';
import Sidebar from '@/components/layout/Sidebar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
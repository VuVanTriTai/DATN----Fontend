import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, Users, Award, BookMarked, ShoppingBag, LayoutGrid } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: <Home />, label: "Trang chủ", path: "/" },
    { icon: <BookOpen />, label: "Khóa học của tôi", path: "/courses" },
    { icon: <MessageSquare />, label: "Chat với AI", path: "/ai-chat" },
    { icon: <Users />, label: "Bạn bè", path: "/friends" },
    { icon: <Award />, label: "Chứng chỉ", path: "/certificates" },
    { icon: <BookMarked />, label: "Trạm đọc", path: "/reading" },
    { icon: <ShoppingBag />, label: "Marketplace", path: "/market" },
  ];

  return (
    <aside className="w-64 bg-[#1e293b] dark:bg-[#0f172a] flex flex-col border-r border-slate-800 hidden lg:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-500 p-2 rounded-xl">
           <LayoutGrid className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold">AI Buddy</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              location.pathname === item.path 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
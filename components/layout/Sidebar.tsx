import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, BookOpen, FilePlus, Users, 
  Settings, LogOut, Share2, FolderOpen 
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const learnerMenu = [
    { icon: <LayoutDashboard size={20}/>, label: 'Bảng điều khiển', path: '/dashboard' },
    { icon: <FilePlus size={20}/>, label: 'Tạo lộ trình AI', path: '/create-plan' },
    { icon: <BookOpen size={20}/>, label: 'Lộ trình của tôi', path: '/my-plans' },
    { icon: <FolderOpen size={20}/>, label: 'Tài liệu đã tải', path: '/documents' },
  ];

  const instructorMenu = [
    { icon: <Users size={20}/>, label: 'Quản lý học viên', path: '/instructor/students' },
    { icon: <Share2 size={20}/>, label: 'Lộ trình đã chia sẻ', path: '/instructor/shared' },
  ];

  const menuItems = role === 'instructor' ? instructorMenu : learnerMenu;

  return (
    <div className="w-72 h-screen bg-[#1e293b] border-r border-slate-800 flex flex-col p-6">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white">AI</div>
        <span className="text-xl font-black text-white tracking-tight">AI Buddy</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all
              ${location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-slate-800 space-y-2">
        <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 font-bold hover:text-white transition-colors">
          <Settings size={20}/> Cài đặt tài khoản
        </button>
        <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl transition-all">
          <LogOut size={20}/> Đăng xuất
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
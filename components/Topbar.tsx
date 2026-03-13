import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  ChevronDown, 
  LayoutDashboard, 
  History, 
  LogOut, 
  Sun, 
  Moon,
  Search,
  Bell,
  Star,
  Diamond
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { clearToken } from "@/utils/authUtils";

const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("user");
    setIsDropdownOpen(false);
    navigate("/auth");
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300">
      
      {/* 1. Phần tiêu đề (Breadcrumb ảo) */}
      <div className="flex items-center gap-6">
        <h2 className="font-bold text-slate-400 hidden md:block uppercase text-[10px] tracking-[0.2em]">
          ASB / Sirius
        </h2>
      </div>

      {/* 2. Phần bên phải: Stats, Theme, User */}
      <div className="flex items-center gap-4">
        
        {/* Chỉ số điểm & kim cương (Giống ảnh mẫu) */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700">
            <Star className="text-yellow-500 w-3.5 h-3.5 fill-yellow-500" />
            <span className="text-[10px] font-black text-yellow-600 dark:text-yellow-500">15 ĐIỂM</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700">
            <Diamond className="text-cyan-500 w-3.5 h-3.5 fill-cyan-500" />
            <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400">10 KIM CƯƠNG</span>
          </div>
        </div>

        {/* Nút đổi Theme */}
        <button 
          onClick={toggleTheme} 
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
        </button>

        {/* Thông báo */}
        <div className="relative p-2 text-slate-500 dark:text-slate-400 cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[8px] text-white flex items-center justify-center rounded-full border-2 border-white dark:border-[#0f172a]">
            12
          </span>
        </div>

        {/* --- PHẦN QUAN TRỌNG: LOGIN LOGIC --- */}
        {user ? (
          // Trường hợp 1: ĐÃ ĐĂNG NHẬP -> Hiện Nickname & Dropdown
          <div className="relative ml-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
            >
              <div className="w-7 h-7 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center overflow-hidden">
                <User size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-black text-gray-700 dark:text-slate-200 max-w-[100px] truncate">
                {user.name}
              </span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
                <Link to="/manage" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all">
                  <LayoutDashboard size={16} /> Quản lý nội dung
                </Link>
                <Link to="/history" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 transition-all">
                  <History size={16} /> Lịch sử rèn luyện
                </Link>
                <hr className="my-1 border-gray-50 dark:border-slate-800" />
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                  <LogOut size={16} /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          // Trường hợp 2: CHƯA ĐĂNG NHẬP -> Hiện nút "Sign In"
          <Link
            to="/auth"
            className="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-black text-sm transition-all shadow-lg shadow-purple-900/20 active:scale-95"
          >
            SIGN IN
          </Link>
        )}
      </div>
    </header>
  );
};

export default Topbar;
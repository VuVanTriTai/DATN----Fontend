import React from 'react';
import { Bell, Star, Diamond, Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const Topbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <header className="h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <h2 className="font-bold text-slate-400">ASB / Sirius</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Stat Badges */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
           <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" />
           <span className="text-xs font-bold text-yellow-500">15 điểm</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
           <Diamond className="text-cyan-400 w-4 h-4 fill-cyan-400" />
           <span className="text-xs font-bold text-cyan-400">10 kim cương</span>
        </div>
        
        <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="relative p-2 text-slate-400">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full border-2 border-[#0f172a]">6</span>
        </div>

        <img src="https://ui-avatars.com/api/?name=User" className="w-8 h-8 rounded-full border-2 border-blue-500" alt="avatar" />
      </div>
    </header>
  );
};

export default Topbar;
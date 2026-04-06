import React from 'react';
import { Book, Clock, Star, Zap } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Đang học', val: '04', color: 'text-blue-500', icon: <Book/> },
    { label: 'Hoàn thành', val: '12', color: 'text-emerald-500', icon: <Zap/> },
    { label: 'Giờ học', val: '48h', color: 'text-orange-500', icon: <Clock/> },
    { label: 'Điểm TB', val: '8.5', color: 'text-purple-500', icon: <Star/> },
  ];

  return (
    <div className="p-10 space-y-10">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tight">Chào mừng quay lại! 👋</h1>
        <p className="text-slate-500 font-medium">Hôm nay bạn muốn học thêm điều gì mới?</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#1e293b] p-6 rounded-[2rem] border border-slate-800 flex items-center gap-6">
            <div className={`p-4 rounded-2xl bg-slate-900 ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-black text-white">{s.val}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
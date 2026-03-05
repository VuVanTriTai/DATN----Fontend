import React from 'react';
import { BookOpen, RefreshCw, LogOut, CheckCircle2, Play, Lock } from 'lucide-react';

const StudyPlan: React.FC = () => {
  const days = [
    { id: 1, label: "Ngày 1", status: "completed" },
    { id: 2, label: "Ngày 2", status: "completed" },
    { id: 3, label: "Ngày 3", status: "active" },
    { id: 4, label: "Ngày 4", status: "locked" },
    { id: 5, label: "Ngày 5", status: "locked" },
    { id: 6, label: "Ngày 6", status: "locked" },
    { id: 7, label: "Ngày 7", status: "locked" },
  ];

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-[#1e293b]/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-blue-400">
            <BookOpen size={24} />
            <h2 className="text-xl font-bold text-white">Lộ trình học tập</h2>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold border border-slate-700">
              <RefreshCw size={16} /> Tải lại
            </button>
            <button className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-sm font-bold border border-red-500/20">
              <LogOut size={16} /> Thoát khóa học
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-800 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-blue-500 w-[30%] shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        </div>

        {/* Week Content */}
        <div className="bg-[#1e293b] border border-blue-500/30 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-blue-400 font-bold">Tuần 1: Chat GPT là gì? Đăng ký và sử dụng...</h3>
              <p className="text-slate-500 text-xs mt-1">7 ngày học</p>
            </div>
            <button className="text-slate-400"><Play size={20} /></button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {days.map((day) => (
              <div 
                key={day.id}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer
                ${day.status === 'completed' ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 
                  day.status === 'active' ? 'border-blue-500 bg-blue-600 text-white shadow-lg' : 
                  'border-slate-800 bg-slate-800/50 text-slate-600'}`}
              >
                {day.status === 'completed' ? <CheckCircle2 size={20} /> : 
                 day.status === 'active' ? <Plus size={20} /> : <Lock size={20} />}
                <span className="text-sm font-bold mt-2">{day.label}</span>
                <p className="text-[10px] mt-1 opacity-70">
                    {day.status === 'completed' ? 'Đã hoàn thành' : day.status === 'active' ? 'Bắt đầu học' : 'Chưa mở khóa'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;
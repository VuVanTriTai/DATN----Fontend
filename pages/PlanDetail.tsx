import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Trash2, Users, RefreshCw, 
  Video, Plus, Sparkles, CheckCircle2, AlertTriangle, 
  ChevronRight, Lock, Globe 
} from 'lucide-react';

const PlanDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState(true);

  // Dữ liệu mẫu khớp với ảnh
  const planInfo = {
    title: "lập trình backend",
    duration: "90 ngày",
    level: "Nâng cao",
    price: "Miễn phí",
    language: "vi"
  };

  const weeks = [
    {
      number: 1,
      title: "Giới thiệu Backend và Node.js",
      desc: "Tổng quan về backend, cài đặt Node.js và npm, làm quen với môi trường phát triển. Tìm hiểu về HTTP protocol, RESTful API.",
      isReady: false
    },
    {
      number: 2,
      title: "Express.js Framework",
      desc: "Tìm hiểu về Express.js, routing, middleware, xử lý request và response. Xây dựng API đơn giản với Express.",
      isReady: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto px-4 pt-10">
        
        {/* --- Section 1: Header Info Card --- */}
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-[2.5rem] p-8 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">vi</span>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
               <span className="w-3 h-3 border border-blue-400 rounded-xs flex items-center justify-center text-[8px]">90</span> 90 ngày
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{planInfo.level}</span>
            <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
               <Globe size={10} /> {planInfo.price}
            </span>
          </div>

          <h1 className="text-4xl font-black mb-6 tracking-tight">{planInfo.title}</h1>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-800/50">
            <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-800">
               {isPrivate ? <Lock size={16} className="text-slate-400" /> : <Globe size={16} className="text-emerald-400" />}
               <span className="text-sm font-bold text-slate-300">{isPrivate ? "Riêng tư" : "Công khai"}</span>
               <span className="text-xs text-slate-500 ml-2">Chỉ bạn có thể xem</span>
               <button 
                onClick={() => setIsPrivate(!isPrivate)}
                className={`w-10 h-5 rounded-full relative transition-all ${isPrivate ? 'bg-slate-700' : 'bg-blue-600'}`}
               >
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isPrivate ? 'left-1' : 'left-6'}`} />
               </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
               <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border border-blue-500/20">
                  <ArrowLeft size={14} /> Quay lại
               </button>
               <button className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border border-amber-500/20">
                  <Edit size={14} /> Chỉnh sửa
               </button>
               <button className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border border-red-500/20">
                  <Trash2 size={14} /> Xóa khóa học
               </button>
               <button className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border border-slate-600">
                  <Users size={14} /> Quản lý học viên
               </button>
               <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg shadow-emerald-900/20">
                  <Sparkles size={14} /> Tạo lại chương trình
               </button>
            </div>
          </div>
        </div>

        {/* --- Section 2: Video Demo Container --- */}
        <div className="bg-[#1e293b]/20 border-2 border-dashed border-slate-800 rounded-[2.5rem] p-20 mb-12 flex flex-col items-center justify-center text-center group hover:border-blue-500/50 transition-all cursor-pointer">
           <div className="bg-slate-800 p-6 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Video size={40} className="text-slate-500 group-hover:text-blue-400" />
           </div>
           <p className="font-bold text-slate-300">Chưa có video demo</p>
           <p className="text-sm text-slate-500">Thêm video giới thiệu để thu hút học viên</p>
        </div>

        {/* --- Section 3: Study Plan List --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-black">Chi tiết kế hoạch học tập</h2>
               <span className="bg-blue-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">13 tuần</span>
            </div>
            <div className="flex gap-3">
               <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all">
                  <Plus size={14} /> Thêm tuần thủ công
               </button>
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all">
                  <Plus size={14} /> Thêm & AI
               </button>
            </div>
          </div>

          {weeks.map((week) => (
            <div key={week.number} className="bg-[#1e293b]/60 border border-slate-800 rounded-[2rem] p-8 shadow-sm group hover:border-slate-700 transition-all">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-black text-sm">
                        {week.number}
                      </div>
                      <h3 className="text-xl font-bold text-slate-100">Tuần {week.number}: {week.title}</h3>
                   </div>
                   <p className="text-slate-400 text-sm leading-relaxed mb-6">
                     {week.desc}
                   </p>
                   
                   {/* Warning Box */}
                   <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3 text-amber-500">
                      <AlertTriangle size={18} />
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider">Chưa thể đánh dấu sẵn sàng</p>
                        <p className="text-[10px] opacity-70">Tuần chưa có câu hỏi trắc nghiệm</p>
                      </div>
                   </div>

                   <button className="mt-6 flex items-center gap-2 text-blue-400 text-xs font-bold hover:underline">
                      Xem chi tiết tuần <ChevronRight size={14} />
                   </button>
                </div>

                {/* Sidebar Buttons for Week */}
                <div className="flex flex-col gap-2 min-w-[140px]">
                   <button className="w-full flex items-center justify-between gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border border-slate-700">
                      <span>Chỉnh sửa</span> <Edit size={14} />
                   </button>
                   <button className="w-full flex items-center justify-between gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border border-emerald-500/20">
                      <span>Tạo AI</span> <Sparkles size={14} />
                   </button>
                   <button disabled className="w-full flex items-center justify-between gap-2 bg-slate-800/30 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-xs cursor-not-allowed border border-slate-800">
                      <span>Sẵn sàng</span> <CheckCircle2 size={14} />
                   </button>
                   <button className="w-full flex items-center justify-between gap-2 bg-red-500/5 hover:bg-red-500/10 text-red-500 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border border-red-500/10">
                      <span>Xóa tuần</span> <Trash2 size={14} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;
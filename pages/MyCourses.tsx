import React from 'react';
import { 
  BookOpen, 
  Plus, 
  FileText, 
  Clock, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  ChevronRight,
  ArrowUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyCourses: React.FC = () => {
  const navigate = useNavigate();

  // Dữ liệu mẫu khớp với ảnh của bạn
  const courses = [
    {
      id: 1,
      title: "lập trình backend",
      timePerDay: "3 giờ/ngày",
      totalDays: "Xem chi tiết",
      createdAt: "02/03/2026",
      status: "Đã tạo kế hoạch",
      flag: "🇻🇳"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 lg:p-8 animate-in fade-in duration-500 relative">
      
      {/* Header Section: Title and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold tracking-tight text-white">Khóa Học Của Tôi</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => navigate('/create-plan')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            <Plus size={18} />
            <span>Tạo Khóa Học</span>
          </button>
          
          {/* ĐÚNG */}
          <button 
  onClick={() => navigate('/create-plan-from-doc')}
  className="flex items-center gap-2 bg-[#7c3aed] text-white px-5 py-2.5 rounded-xl font-bold"
>
  <FileText size={18} />
  <span>Tạo từ Tài Liệu</span>
</button>


        </div>
      </div>

      {/* Grid Danh sách Khóa học */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="bg-[#1e293b]/50 border border-slate-700 rounded-[1.5rem] p-6 hover:border-blue-500/50 transition-all group relative cursor-pointer shadow-xl"
          >
            {/* Title & Flag */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-200 group-hover:text-white transition-colors capitalize">
                {course.title}
              </h2>
              <span className="text-xl">{course.flag}</span>
            </div>

            {/* Info List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <Clock size={18} className="text-blue-400" />
                <span className="text-sm font-medium">Thời gian:</span>
                <span className="text-sm text-slate-200">{course.timePerDay}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <Calendar size={18} className="text-blue-400" />
                <span className="text-sm font-medium">Tổng ngày:</span>
                <button className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold hover:bg-blue-500/20 transition-all border border-blue-500/20">
                  <Eye size={14} />
                  {course.totalDays}
                </button>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <Calendar size={18} className="text-blue-400" />
                <span className="text-sm font-medium">Ngày tạo:</span>
                <span className="text-sm text-slate-200">{course.createdAt}</span>
              </div>

              <div className="flex items-center gap-3 text-slate-400 pt-2">
                <CheckCircle2 size={18} className="text-blue-400" />
                <span className="text-sm font-medium">Trạng thái:</span>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 size={12} />
                  {course.status}
                </div>
              </div>
            </div>

            {/* Overlay hover effect - Button để vào học */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="bg-blue-600 p-2 rounded-lg text-white">
                  <ChevronRight size={20} />
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nút Scroll to Top (Góc dưới phải) */}
      <button className="fixed bottom-6 right-6 p-3 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-full text-slate-400 hover:text-white transition-all shadow-2xl">
        <ArrowUp size={24} />
      </button>

    </div>
  );
};

export default MyCourses;
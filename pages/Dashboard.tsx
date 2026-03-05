import React, { useState } from 'react';
import { Search, BookOpen, Plus, MoreVertical, LayoutGrid } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  const filters = ['Tất cả', 'Chưa bắt đầu', 'Đang học', 'Hoàn thành'];

  const courses = [
    {
      id: 1,
      title: "Giới thiệu về Chat GPT: Đăng ký và...",
      progress: 28.6,
      status: "Đang học",
      days: 0,
      iconColor: "bg-blue-600"
    },
    // Bạn có thể thêm dữ liệu thật từ API tại đây
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Filter Section */}
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <BookOpen className="text-purple-500" /> Khóa học của tôi
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Tìm kiếm khóa học..." 
              className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-[#0f172a] p-1 rounded-xl border border-slate-800">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeFilter === filter 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-[#1e293b] rounded-[2rem] p-6 border border-slate-800 hover:border-purple-500/50 transition-all group relative">
            <button className="absolute top-6 right-6 text-slate-500 hover:text-white">
              <MoreVertical size={20} />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className={`${course.iconColor} p-3 rounded-2xl shadow-lg`}>
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <div className="pr-6">
                <h3 className="font-bold text-lg leading-snug group-hover:text-purple-400 transition-colors">
                  {course.title}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400 font-medium">Tiến độ</span>
                <span className="text-blue-400 font-bold">{course.progress}%</span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-red-500 transition-all duration-1000" 
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-6">
                 <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="bg-slate-800 px-2 py-1 rounded-md">📅 Tổng số ngày: {course.days}</span>
                 </div>
                 <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                    {course.status}
                 </span>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Course Button */}
        <button className="bg-[#0f172a] border-2 border-dashed border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
          <div className="bg-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
            <Plus className="text-white" />
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">Tham gia thêm khóa học</p>
            <p className="text-slate-500 text-sm">Nhập mã để tham gia khóa học khác</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
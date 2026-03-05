import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  ShoppingBag, 
  BookOpen, 
  Diamond, 
  ChevronDown,
  Filter
} from 'lucide-react';

const Marketplace: React.FC = () => {
  const [isFreeOnly, setIsFreeOnly] = useState(false);

  // Dữ liệu mẫu (Mock data) khớp với ảnh
  const courses = [
    {
      id: 1,
      title: "Xác suất Thống kê",
      desc: "Học Xác suất Thống kê dựa trên danh sách phát YouTube 'Xác suất Thống kê...",
      level: "Trung bình",
      levelColor: "text-amber-400 bg-amber-400/10",
      image: "https://images.unsplash.com/photo-1509228626622-a617cb36680a?q=80&w=500&auto=format&fit=crop",
      isImage: true,
      ratio: "1/8"
    },
    {
      id: 2,
      title: "Học Python cho PHP Developer",
      desc: "Mục tiêu học tập cho Học Python cho PHP Developer: Nắm vững nền tảng và...",
      level: "Cơ bản",
      levelColor: "text-emerald-400 bg-emerald-400/10",
      image: <BookOpen className="w-12 h-12 text-indigo-400" />,
      isImage: false,
    },
    {
      id: 3,
      title: "Cẩm nang về Mô hình Ngôn ngữ Lớn (LLMs) và Trí tuệ nhân tạo",
      desc: "Nắm vững các khái niệm cơ bản và ứng dụng thực tiễn của LLMs...",
      level: "Trung bình",
      levelColor: "text-amber-400 bg-amber-400/10",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=500&auto=format&fit=crop",
      isImage: true,
    },
    {
      id: 4,
      title: "Hướng dẫn toàn diện về GPT-5 năm 2025: Cách sử dụng Chat GPT-5 c...",
      desc: "Nắm vững các kiến thức cơ bản và cách sử dụng thành thạo các tính năng mới...",
      level: "Trung bình",
      levelColor: "text-amber-400 bg-amber-400/10",
      image: <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-slate-500"/><div className="w-2 h-2 rounded-full bg-slate-500"/><div className="w-2 h-2 rounded-full bg-slate-500"/></div>,
      isImage: false,
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Marketplace - Học bá kiếm tiền</h1>
        <p className="text-slate-400 font-medium">Khám phá và mua các khóa học chất lượng cao từ các giảng viên xuất sắc</p>
      </div>

      {/* Filter Section */}
      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-[2rem] p-8 space-y-6 shadow-xl">
        
        {/* Toggle Free Only */}
        <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <span className="text-emerald-500 font-black text-xs">$</span>
            </div>
            <div>
              <p className="text-emerald-400 font-bold text-sm">Chỉ hiển thị khóa học miễn phí</p>
              <p className="text-emerald-500/60 text-xs">Lọc nhanh các khóa học không tốn phí</p>
            </div>
          </div>
          <button 
            onClick={() => setIsFreeOnly(!isFreeOnly)}
            className={`w-12 h-6 rounded-full transition-all relative ${isFreeOnly ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isFreeOnly ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tìm kiếm</label>
            <div className="relative mt-2">
              <input type="text" placeholder="Tên khóa học..." className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Danh mục</label>
            <div className="relative mt-2">
              <select className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none appearance-none cursor-pointer">
                <option>Tất cả danh mục</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ngôn ngữ</label>
            <div className="relative mt-2">
              <select className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none appearance-none cursor-pointer">
                <option>Tất cả ngôn ngữ</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cấp độ</label>
            <div className="relative mt-2">
              <select className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none appearance-none cursor-pointer">
                <option>Tất cả cấp độ</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Second Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Giá từ (<Diamond size={8} className="inline fill-blue-400 text-blue-400" />)</label>
            <input type="number" defaultValue={0} className="w-full mt-2 bg-[#0f172a] border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Giá đến (<Diamond size={8} className="inline fill-blue-400 text-blue-400" />)</label>
            <input type="number" defaultValue={999} className="w-full mt-2 bg-[#0f172a] border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sắp xếp theo</label>
            <div className="relative mt-2">
              <select className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none appearance-none cursor-pointer">
                <option>Mới nhất</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            </div>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              <RotateCcw size={18} /> Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-[#1e293b] rounded-[2.5rem] overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all group shadow-lg flex flex-col h-full cursor-pointer">
            {/* Thumbnail */}
            <div className="h-48 bg-slate-800 flex items-center justify-center relative overflow-hidden">
              {course.isImage ? (
                <img src={course.image as string} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={course.title} />
              ) : (
                <div className="p-10">{course.image}</div>
              )}
              {course.ratio && (
                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                  <span className="text-white font-black text-lg">{course.ratio}</span>
                </div>
              )}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${course.levelColor}`}>
                {course.level}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-white font-bold text-lg leading-tight mb-3 group-hover:text-blue-400 transition-colors">
                {course.title}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-6">
                {course.desc}
              </p>
              
              {/* Footer of Card */}
              <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Diamond size={14} className="text-blue-400 fill-blue-400" />
                  <span className="text-blue-400 font-black text-sm">Miễn phí</span>
                </div>
                <div className="bg-slate-700/50 p-2 rounded-xl group-hover:bg-blue-600 transition-colors">
                  <ShoppingBag size={16} className="text-slate-400 group-hover:text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
import React, { useState } from 'react';
import { 
  Book, 
  Info, 
  Layout, 
  Calendar, 
  Languages, 
  BarChart, 
  Video, 
  Plus, 
  X, 
  Sparkles, 
  ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreatePlan: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual');
  const [days, setDays] = useState<number | string>("");

  const handleAddWeek = () => {
    setDays((prev) => (Number(prev) || 0) + 7);
  };

  const handleClearDays = () => {
    setDays("");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="max-w-xl w-full bg-[#1e293b] rounded-[2.5rem] border-t-4 border-blue-500 shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 pb-4 flex items-center gap-4">
          <div className="bg-blue-500/20 p-3 rounded-2xl">
            <Book className="text-blue-500 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tạo Kế Hoạch Học Tập</h1>
        </div>

        {/* Tabs Section */}
        <div className="px-8 mb-6">
          <div className="bg-[#0f172a] p-1.5 rounded-2xl flex gap-1">
            <button 
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'manual' ? 'bg-[#1e293b] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Tạo thủ công
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'chat' ? 'bg-[#1e293b] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Tạo bằng Chat
            </button>
            <button 
              onClick={() => setActiveTab('fast')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'fast' ? 'bg-[#1e293b] text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Tạo nhanh
            </button>
          </div>
        </div>

        {/* Main Content / Form */}
        <div className="px-8 pb-10 space-y-8">
          
          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-blue-400">
              <Info size={18} />
              <p className="text-xs font-bold">
                Mẹo: <span className="underline cursor-pointer">Sự khác biệt giữa Tạo nhanh và Tạo thủ công</span>
              </p>
            </div>
            <button className="text-[10px] font-black text-blue-400/60 uppercase hover:text-blue-400">Ẩn</button>
          </div>

          <form className="space-y-6">
            {/* Subject Name */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Layout size={18} />
                <label className="text-sm font-bold text-slate-200">Tên môn học</label>
              </div>
              <input 
                type="text" 
                placeholder="Nhập tên môn học"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* Study Days */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Calendar size={18} />
                <label className="text-sm font-bold text-slate-200">Số ngày học</label>
              </div>
              <div className="relative">
                <input 
                  type="number" 
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="Tổng số ngày học"
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all pr-16"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">ngày</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium ml-1">Có thể tạo tới 180+ nhưng nên chia phần nếu quá dài.</p>
              
              <div className="flex gap-3 pt-1">
                <button 
                  type="button"
                  onClick={handleAddWeek}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-emerald-500/20 transition-all"
                >
                  <Plus size={14} /> Thêm 1 tuần (+7)
                </button>
                <button 
                  type="button"
                  onClick={handleClearDays}
                  className="bg-slate-700/50 border border-slate-700 text-slate-400 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-slate-700 transition-all"
                >
                  <X size={14} /> Xóa số ngày
                </button>
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Languages size={18} />
                <label className="text-sm font-bold text-slate-200">Ngôn ngữ</label>
              </div>
              <select className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none appearance-none cursor-pointer">
                <option>Tiếng Việt VN</option>
                <option>English US</option>
              </select>
            </div>

            {/* Level Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <BarChart size={18} />
                <label className="text-sm font-bold text-slate-200">Trình độ</label>
              </div>
              <select className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none appearance-none cursor-pointer">
                <option>Vỡ lòng: Thích hợp từ 10 đến 18 tuổi</option>
                <option>Cơ bản</option>
                <option>Nâng cao</option>
              </select>
            </div>

            {/* Intro Video URL */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-400">
                <Video size={18} />
                <label className="text-sm font-bold text-slate-200">Video giới thiệu (YouTube URL)</label>
              </div>
              <input 
                type="text" 
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-4">
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-900/30 transition-all active:scale-95"
              >
                <Sparkles size={20} />
                Tạo kế hoạch học tập
              </button>
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePlan;
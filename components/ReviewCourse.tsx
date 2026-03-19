import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  Sparkles, 
  Calendar, 
  BarChart, 
  ChevronRight, 
  Loader2, 
  Check, 
  ArrowLeft,
  Settings2,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu cho Props nhận vào
interface ReviewCourseProps {
  data: {
    analysis: {
      suggestedTitle: string;
      difficulty: string;
      suggestedDays: number;
      summary: string;
    };
    previewPlan: Array<{
      dayNumber: number;
      title: string;
    }>;
  };
  rawText: string;
  onBack: () => void;
}

const ReviewCourse: React.FC<ReviewCourseProps> = ({ data, rawText, onBack }) => {
  const navigate = useNavigate();
  
  const [days, setDays] = useState<number>(data.analysis.suggestedDays);
  const [previewPlan, setPreviewPlan] = useState(data.previewPlan);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // GIỚI HẠN NGÀY
  const MAX_ALLOWED_DAYS = 14;
  // Hàm gọi AI chia lại tiêu đề khi người dùng đổi số ngày
  const handleRegenerate = async (newDays: number) => {
    // Thêm check giới hạn 14 ngày
    if (newDays > MAX_ALLOWED_DAYS) {
        alert(`Hiện tại hệ thống chỉ hỗ trợ tối đa ${MAX_ALLOWED_DAYS} ngày để đảm bảo chất lượng bài học.`);
        return;
    }
    if (newDays === days || newDays < 1) return;
    
    setDays(newDays);
    setIsRegenerating(true);
    try {
      const res = await api.course.regenerate({ rawText, days: newDays });
      if (res.success === "true" || res.success === true) {
        setPreviewPlan(res.data);
      }
    } catch (error) {
      console.error("Lỗi cập nhật lộ trình:", error);
    } finally {
      setIsRegenerating(false);
    }
  };
  // Hàm xác nhận tạo toàn bộ nội dung khóa học và lưu vào Database
  const handleConfirmCreate = async () => {
    setIsCreating(true);
    try {
      const res = await api.course.finalizeCreate({
        title: data.analysis.suggestedTitle,
        extractedText: rawText,
        numDays: days,
        difficulty: data.analysis.difficulty,
        previewPlan: previewPlan 
      });

       if (res.success === "true" || res.success === true) {
        const planId = res.data?._id || res.data?.id;
        navigate(`/plan/${planId}`); 
      }
    } catch (error) {
      console.error("Lỗi tạo khóa học:", error);
      alert("Đã có lỗi xảy ra. Có thể tài liệu quá dài hoặc vượt hạn mức AI.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-3xl w-full bg-[#1e293b] rounded-[2.5rem] border border-slate-800 p-8 lg:p-10 shadow-2xl space-y-8">
      {/* --- Header & Back Button --- */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold"
        >
          <ArrowLeft size={18} /> Thay đổi tài liệu
        </button>
        <div className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full border border-purple-500/20">
          <Sparkles size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest text-nowrap">AI Optimized</span>
        </div>
      </div>

      {/* --- Course Title & Info --- */}
      <div className="space-y-3">
        <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
          {data.analysis.suggestedTitle}
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          {data.analysis.summary}
        </p>
      </div>

      {/* --- Config Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Độ khó card */}
        <div className="bg-[#0f172a] p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
              <BarChart size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase">Độ khó</p>
              <p className="text-lg font-bold text-white">{data.analysis.difficulty}</p>
            </div>
          </div>
          <Check className="text-emerald-500" size={20} />
        </div>

        {/* Thời gian học card */}
        <div className="bg-[#0f172a] p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase">Thời lượng</p>
              <p className="text-lg font-bold text-white">{days} ngày</p>
            </div>
          </div>
          <Settings2 className="text-slate-600" size={20} />
        </div>
      </div>

      {/* --- Customize Duration --- */}
      <div className="space-y-4">
        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
          <Calendar size={14} /> Chỉnh sửa thời gian học (Tối đa {MAX_ALLOWED_DAYS} ngày)
        </label>
        <div className="flex flex-wrap gap-2">
          {/* Thay đổi các mốc gợi ý cho phù hợp với 14 ngày */}
          {[3, 5, 7, 10, 14].map((val) => (
            <button
              key={val}
              onClick={() => handleRegenerate(val)}
              disabled={isRegenerating || isCreating}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 
                ${days === val 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
            >
              {val} Ngày
            </button>
          ))}
          {/* Input cho số ngày tùy chỉnh */}
          <div className="relative flex-1 min-w-[120px]">
             <input 
              type="number"
              max={MAX_ALLOWED_DAYS}
              placeholder="Khác..."
              className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-6 py-3 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all"
              onBlur={(e) => {
                const val = Number(e.target.value);
                if (val > 0) handleRegenerate(val);
              }}
             />
          </div>
        </div>
      </div>

      {/* --- Preview Section --- */}
      <div className="space-y-4 relative">
        <div className="flex items-center justify-between ml-2">
          <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Xem trước lộ trình chi tiết</p>
          <span className="text-[10px] text-blue-500 font-bold">{previewPlan.length} bài học</span>
        </div>

        {/* Màn che loading khi chia lại lộ trình */}
        {isRegenerating && (
          <div className="absolute inset-0 z-10 bg-[#1e293b]/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl animate-in fade-in">
             <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
             <p className="text-xs font-bold text-white animate-pulse">AI đang thiết kế lại...</p>
          </div>
        )}

        <div className="grid gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          {previewPlan.map((p: any) => (
            <div 
              key={p.dayNumber} 
              className="group flex items-center gap-4 bg-[#0f172a] p-4 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors border border-slate-700">
                {p.dayNumber}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-200 truncate">{p.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Nội dung sẽ được AI tạo chi tiết sau khi xác nhận</p>
              </div>
              <ChevronRight className="text-slate-700 group-hover:text-blue-500" size={18} />
            </div>
          ))}
        </div>
      </div>

      {/* --- Action Button --- */}
      <div className="pt-4">
        <button 
          onClick={handleConfirmCreate}
          disabled={isCreating || isRegenerating}
          className={`w-full py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-[0.98]
            ${isCreating || isRegenerating
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/30'
            }`}
        >
          {isCreating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Đang khởi tạo toàn bộ khóa học...</span>
            </>
          ) : (
            <>
              <Check size={24} />
              <span>Bắt đầu tạo lộ trình ngay</span>
            </>
          )}
        </button>
        <p className="text-center text-[10px] text-slate-500 mt-4 uppercase tracking-[0.1em] font-medium">
          Quá trình khởi tạo chi tiết có thể mất từ 10 - 20 giây tùy độ dài tài liệu
        </p>
      </div>

    </div>
  );
};

export default ReviewCourse;
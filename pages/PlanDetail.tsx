import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from "../services/api";
import { 
  ArrowLeft, Edit, Trash2, Users,
  Video, Plus, Sparkles, CheckCircle2, AlertTriangle, 
  ChevronRight, Lock, Globe, Loader2 
} from 'lucide-react';

const PlanDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States để quản lý dữ liệu thật từ Backend
  const [plan, setPlan] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);

  // Gọi API lấy dữ liệu khi trang vừa load
  useEffect(() => {
    const fetchPlanData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await api.plan.getById(id);
        
        // Kiểm tra success: "true" từ Backend của bạn
        if (response.success === "true") {
          setPlan(response.data.plan);
          setLessons(response.data.lessons);
        } else {
          console.error("Lỗi lấy dữ liệu:", response.message);
        }
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold animate-pulse">Đang tải lộ trình từ AI...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-black">Không tìm thấy lộ trình</h2>
        <button onClick={() => navigate(-1)} className="mt-6 text-blue-400 font-bold flex items-center gap-2">
          <ArrowLeft size={18} /> Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto px-4 pt-10">
        
        {/* --- Section 1: Header Info Card (Dùng dữ liệu thật) --- */}
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-[2.5rem] p-8 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">VN</span>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
               {plan.duration} ngày học
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{plan.level || "Cơ bản"}</span>
          </div>

          <h1 className="text-4xl font-black">{plan?.title || "Đang tải..."}</h1>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-800/50">
            <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-800">
               {isPrivate ? <Lock size={16} className="text-slate-400" /> : <Globe size={16} className="text-emerald-400" />}
               <span className="text-sm font-bold text-slate-300">{isPrivate ? "Riêng tư" : "Công khai"}</span>
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
               <button className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border border-red-500/20">
                  <Trash2 size={14} /> Xóa
               </button>
               <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg shadow-emerald-900/20">
                  <Sparkles size={14} /> Tạo lại bằng AI
               </button>
            </div>
          </div>
        </div>

        {/* --- Section 2: Study Plan List (Duyệt qua mảng lessons từ Groq) --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-black">Chi tiết lộ trình ({lessons.length} ngày)</h2>
            </div>
          </div>

          {lessons.map((lesson) => (
            <div 
              key={lesson._id} 
              onClick={() => navigate(`/plan/${id}/lesson/${lesson.dayNumber}`)}
              className="bg-[#1e293b]/60 border border-slate-800 rounded-[2rem] p-8 shadow-sm group hover:border-blue-500/50 hover:bg-[#1e293b]/80 transition-all cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center font-black text-sm border border-blue-500/20">
                        {lesson.dayNumber}
                      </div>
                      <h3 className="text-xl font-bold text-slate-100">{lesson.title}</h3>
                   </div>
                   <p className="text-slate-400 text-sm leading-relaxed mb-6">
                     {lesson.summary || "Bấm để xem nội dung bài học chi tiết từ AI."}
                   </p>
                   
                   {/* Status badge */}
                   <div className="flex gap-3">
                      {lesson.quiz && lesson.quiz.length > 0 ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase">
                          <CheckCircle2 size={14} /> Có bài tập AI
                        </div>
                      ) : (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase">
                          <AlertTriangle size={14} /> Chưa có Quiz
                        </div>
                      )}
                      <div className="text-blue-400 text-[10px] font-black uppercase flex items-center gap-1">
                        Chi tiết <ChevronRight size={14} />
                      </div>
                   </div>
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
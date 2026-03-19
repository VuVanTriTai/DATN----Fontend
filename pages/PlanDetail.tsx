import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Book, Calendar, ChevronRight, Settings, Trash2, 
  Plus, Sparkles, CheckCircle, Clock, Edit3, Share2
} from 'lucide-react';

const PlanDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.plan.getDetail(id!);
        if (res.success) {
          setPlan(res.data.plan);
          setLessons(res.data.lessons);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="h-screen bg-[#0f172a] flex items-center justify-center"><Sparkles className="animate-spin text-blue-500" /></div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20">
      {/* Header Profile - Giống hình bạn gửi */}
      <div className="bg-[#1e293b]/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-10 p-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <span className="bg-blue-500 text-[10px] font-black px-2 py-0.5 rounded">VN</span>
              <span className="bg-slate-800 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                <Calendar size={10}/> {plan?.duration} ngày
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">Miễn phí</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">{plan?.title}</h1>
            <div className="flex items-center gap-4 text-slate-400 text-sm">
               <span className="flex items-center gap-2"><Settings size={14}/> Riêng tư</span>
               <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
               <span>Chỉ bạn có thể xem</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 h-fit">
            <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border border-slate-700">
              <Edit3 size={16}/> Chỉnh sửa
            </button>
            <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border border-red-500/20">
              <Trash2 size={16}/> Xóa
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/20">
              <Plus size={18}/> Thêm nội dung
            </button>
          </div>
        </div>
      </div>

      {/* Course Content - Cấu trúc Tuần/Ngày */}
      <div className="max-w-5xl mx-auto mt-10 px-6 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-3">
             Chi tiết kế hoạch học tập 
             <span className="bg-blue-600 text-xs px-3 py-1 rounded-full">{Math.ceil(lessons.length / 7)} tuần</span>
          </h2>
          <div className="flex gap-2">
             <button className="bg-emerald-500 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2"><Plus size={14}/> Thêm tuần thủ công</button>
             <button className="bg-indigo-600 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2"><Sparkles size={14}/> Thêm & AI</button>
          </div>
        </div>

        {/* Lặp qua danh sách bài học */}
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div 
              key={lesson._id}
              className="bg-[#1e293b] border border-slate-800 rounded-[2rem] p-6 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {lesson.dayNumber}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">Ngày {lesson.dayNumber}: {lesson.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                      {lesson.summary || "Chưa có tóm tắt nội dung..."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[140px]">
                  <button 
                    onClick={() => navigate(`/plan/${id}/lesson/${lesson.dayNumber}`)}
                    className="bg-slate-800 hover:bg-slate-700 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-between border border-slate-700"
                  >
                    Biên tập <Edit3 size={14}/>
                  </button>
                  <button className="bg-emerald-500/10 text-emerald-500 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-between border border-emerald-500/20 opacity-50 cursor-not-allowed">
                    Sẵn sàng <CheckCircle size={14}/>
                  </button>
                </div>
              </div>
              
              {/* Cảnh báo chưa có nội dung (Giống hình bạn gửi) */}
              {!lesson.content && (
                <div className="mt-6 bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-center gap-3">
                  <Clock className="text-orange-500" size={18}/>
                  <p className="text-xs font-bold text-orange-200">Bài học này chưa được AI tạo nội dung chi tiết.</p>
                  <button className="ml-auto bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase">Tạo ngay</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;
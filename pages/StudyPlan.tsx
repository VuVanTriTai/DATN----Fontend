import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Thêm 2 cái này
import { api } from "../services/api"; // Import api service
import { BookOpen, RefreshCw, LogOut, CheckCircle2, Play, Lock, Plus, Loader2 } from 'lucide-react';

const StudyPlan: React.FC = () => {
  const { id } = useParams(); // Lấy ID lộ trình từ URL
  const navigate = useNavigate();

  const [plan, setPlan] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Gọi dữ liệu thật từ Backend
  const fetchPlan = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.plan.getById(id);
      if (res.success === "true") {
        setPlan(res.data.plan);
        setLessons(res.data.lessons);
      }
    } catch (error) {
      console.error("Lỗi lấy lộ trình:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center text-white">
      <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-[#1e293b]/50 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-blue-400">
            <BookOpen size={24} />
            <h2 className="text-xl font-bold text-white">Lộ trình: {plan?.title}</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchPlan} className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-all">
              <RefreshCw size={16} /> Tải lại
            </button>
            <button onClick={() => navigate('/courses')} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-xl text-sm font-bold border border-red-500/20">
              <LogOut size={16} /> Thoát
            </button>
          </div>
        </div>

        {/* Progress Bar (Tính % hoàn thành dựa trên lessons) */}
        <div className="h-2 w-full bg-slate-800 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-blue-500 w-[15%] shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        </div>

        {/* Roadmap Content */}
        <div className="bg-[#1e293b] border border-blue-500/30 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-blue-400 font-bold truncate max-w-[400px]">
                {plan?.title}
              </h3>
              <p className="text-slate-500 text-xs mt-1">{lessons.length} ngày học</p>
            </div>
            <button className="text-slate-400"><Play size={20} /></button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {lessons.map((lesson) => (
              <div 
                key={lesson._id}
                onClick={() => navigate(`/plan/${id}/lesson/${lesson.dayNumber}`)} // LỆNH ĐIỀU HƯỚNG QUAN TRỌNG
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer active:scale-95
                ${lesson.status === 'completed' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 
                  lesson.status === 'in-progress' ? 'border-blue-500 bg-blue-600 text-white shadow-lg' : 
                  'border-slate-800 bg-slate-800/50 text-slate-600 hover:border-slate-600'}`}
              >
                {lesson.status === 'completed' ? <CheckCircle2 size={20} /> : 
                 lesson.status === 'in-progress' ? <Plus size={20} /> : <Lock size={20} />}
                
                <span className="text-sm font-bold mt-2">Ngày {lesson.dayNumber}</span>
                
                <p className="text-[10px] mt-1 opacity-70">
                    {lesson.status === 'completed' ? 'Đã xong' : 
                     lesson.status === 'in-progress' ? 'Bắt đầu' : 'Khóa'}
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
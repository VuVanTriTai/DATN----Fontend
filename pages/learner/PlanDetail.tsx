import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  BookOpen, UploadCloud, Award, Share2, 
  ChevronRight, Calendar, CheckCircle, Lock, 
  PlayCircle, UserCheck, BarChart3, 
  FileText, Trash2, Download, RefreshCw, X
} from 'lucide-react';

const PlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('study');
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInstructorModal, setShowInstructorModal] = useState(false);

  useEffect(() => {
    loadData();
    fetchInstructors();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.plan.getDetail(id!);
      if (res.success) {
        setPlan(res.data.plan);
        setLessons(res.data.lessons);
      }
    } catch (err) {
      console.error("Lỗi lấy chi tiết lộ trình:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await api.auth.getInstructors();
      setInstructors(res.data);
    } catch (err) { console.error(err); }
  };

  // HÀM XÓA LỘ TRÌNH
  const handleDeletePlan = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lộ trình này và toàn bộ dữ liệu liên quan không?")) {
      setIsDeleting(true);
      try {
        await api.plan.delete(id!);
        navigate('/my-plans');
      } catch (err) {
        alert("Lỗi khi xóa lộ trình");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // HÀM ĐỔI NGƯỜI HƯỚNG DẪN
  const handleChangeInstructor = async (instructorId: string) => {
    try {
      const res = await api.plan.updateInstructor(id!, instructorId);
      if (res.success) {
        alert("Đã cập nhật người hướng dẫn thành công!");
        setShowInstructorModal(false);
        loadData(); // Tải lại dữ liệu
      }
    } catch (err) {
      alert("Lỗi khi cập nhật");
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-full animate-bounce"></div>
        <p className="text-slate-500 font-bold">Đang tải lộ trình...</p>
      </div>
    </div>
  );

  if (!plan) return <div className="p-10 text-white">Không tìm thấy lộ trình.</div>;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 text-white animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="relative p-10 rounded-[3rem] bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10"><BarChart3 size={120} /></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-6 flex-1">
            <div className="flex flex-wrap gap-3">
              <span className="bg-blue-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/40">{plan.level}</span>
              <span className="bg-slate-800/80 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black text-slate-300 flex items-center gap-2 border border-slate-700">
                <Calendar size={12}/> {plan.duration} NGÀY HỌC
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight max-w-3xl">{plan.title}</h1>
          </div>

          {/* NÚT XÓA & ĐỔI GIÁO VIÊN */}
          <div className="flex gap-2">
            <button 
              onClick={() => setShowInstructorModal(true)}
              className="p-4 bg-slate-800 hover:bg-slate-700 rounded-[1.5rem] border border-slate-700 transition-all"
              title="Đổi giáo viên"
            >
              <RefreshCw size={20} className="text-blue-400" />
            </button>
            <button 
              onClick={handleDeletePlan}
              disabled={isDeleting}
              className="p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-[1.5rem] border border-red-500/20 transition-all"
              title="Xóa lộ trình"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* TAB BAR */}
      <div className="flex flex-wrap gap-3 bg-[#1e293b]/50 p-2 rounded-[1.5rem] border border-slate-800 w-fit">
        {[
          { id: 'study', label: 'Bài học', icon: <BookOpen size={18}/> },
          { id: 'document', label: 'Tài liệu gốc', icon: <FileText size={18}/> },
          ...(plan.instructorId ? [{ id: 'assignment', label: 'Bài tập & Nộp bài', icon: <UploadCloud size={18}/> }] : []),
          { id: 'result', label: 'Thành tích', icon: <Award size={18}/> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all
              ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* NỘI DUNG CHI TIẾT */}
      <div className="min-h-[400px]">
        {activeTab === 'study' && (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-in slide-in-from-bottom-4">
           {lessons.map((lesson) => (
             <div 
               key={lesson._id}
               onClick={() => lesson.status !== 'locked' && navigate(`/plan/${id}/lesson/${lesson.dayNumber}`)}
               className={`group relative p-6 rounded-[2.5rem] border transition-all cursor-pointer h-56 flex flex-col justify-between
                 ${lesson.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/30' : 
                   lesson.status === 'locked' ? 'bg-slate-900/50 border-slate-800 opacity-50 grayscale cursor-not-allowed' : 
                   'bg-[#1e293b] border-slate-800 hover:border-blue-500/50'}`}
             >
                <div className="flex justify-between items-center">
                    <div className={`p-2.5 rounded-2xl ${lesson.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-blue-400'}`}>
                      {lesson.status === 'completed' ? <CheckCircle size={20}/> : lesson.status === 'locked' ? <Lock size={20}/> : <PlayCircle size={20}/>}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase">Ngày {lesson.dayNumber}</span>
                </div>
                <h3 className="font-bold text-sm line-clamp-2 group-hover:text-blue-400">{lesson.title}</h3>
                <div className="flex justify-end pt-2"><div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-all"><ChevronRight size={14}/></div></div>
             </div>
           ))}
         </div>
        )}

        {activeTab === 'document' && (
          <div className="bg-[#1e293b]/50 p-10 rounded-[3rem] border border-slate-800 space-y-6 animate-in fade-in">
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black">Tài liệu tham khảo gốc</h3>
                {plan.documentId?.fileUrl && (
                  <a href={plan.documentId.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 font-bold hover:underline bg-blue-400/10 px-4 py-2 rounded-xl">
                    <Download size={18}/> Tải tệp bản gốc
                  </a>
                )}
             </div>
             <div className="p-8 bg-slate-900/50 rounded-[2rem] border border-slate-800 text-slate-400 text-sm leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap custom-scrollbar">
                {plan.documentId?.content || "Không có nội dung văn bản."}
             </div>
          </div>
        )}

        {activeTab === 'assignment' && (
           <div className="bg-[#1e293b]/50 p-16 rounded-[3.5rem] border border-slate-800 text-center space-y-6">
              <UploadCloud className="text-indigo-500 mx-auto" size={48}/>
              <h3 className="text-2xl font-black">Nộp bài thực hành</h3>
              <p className="text-slate-400 max-w-md mx-auto">Tải bài tập lên Cloudinary để giáo viên hướng dẫn chấm điểm.</p>
              <button className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20">Chọn tệp nộp bài</button>
           </div>
        )}
      </div>

      {/* MODAL CHỌN GIÁO VIÊN */}
      {showInstructorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] p-8 border border-slate-700 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black">Chọn người hướng dẫn</h3>
              <button onClick={() => setShowInstructorModal(false)}><X/></button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              <button onClick={() => handleChangeInstructor("")} className="w-full p-4 bg-slate-900 rounded-2xl border border-slate-800 text-left text-sm font-bold text-slate-500 hover:border-blue-500 transition-all">-- Không chọn (Tự học) --</button>
              {instructors.map(ins => (
                <div key={ins._id} onClick={() => handleChangeInstructor(ins._id)} className="w-full p-4 bg-slate-800 hover:bg-blue-600 rounded-2xl border border-slate-700 text-left cursor-pointer transition-all flex items-center justify-between group">
                  <div>
                    <p className="font-bold text-white group-hover:text-white">{ins.fullName}</p>
                    <p className="text-xs text-slate-500 group-hover:text-blue-200">{ins.email}</p>
                  </div>
                  <UserCheck size={18} className="text-slate-600 group-hover:text-white"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PlanDetail;
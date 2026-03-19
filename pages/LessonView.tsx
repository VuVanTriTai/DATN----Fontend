import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from "../services/api";
import { 
  BookOpen, Sparkles, FileText, CheckSquare, AlignLeft, 
  MessageCircle, ArrowLeft, Loader2, Save, Trash2, Plus 
} from 'lucide-react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const LessonView: React.FC = () => {
  const { id, dayNumber } = useParams();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('study');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [id, dayNumber]);

  const fetchLesson = async () => {
    if (!id || !dayNumber) return;
    try {
      setLoading(true);
      const res = await api.plan.getLessonDetail(id, dayNumber);
      if (res.success === "true") setLesson(res.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.lesson.update(lesson._id, lesson);
      alert("Đã lưu thành công!");
    } catch (e) { alert("Lỗi khi lưu"); }
    finally { setIsSaving(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0f172a]"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Top Bar Editor */}
      <div className="border-b border-slate-800 bg-[#1e293b]/50 p-4 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-black">{lesson?.title} <span className="text-blue-500 ml-2">#Ngày {dayNumber}</span></h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-xl font-black flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex gap-8 p-8">
        {/* Left Side: Tabs Navigation */}
        <div className="w-64 space-y-2 sticky top-28 h-fit">
           {[
            { id: 'study', label: 'Nội dung học', icon: <BookOpen size={18}/> },
            { id: 'summary', label: 'Tóm tắt AI', icon: <AlignLeft size={18}/> },
            { id: 'quiz', label: 'Trắc nghiệm', icon: <CheckSquare size={18}/> },
            { id: 'chat', label: 'Hỗ trợ AI', icon: <MessageCircle size={18}/> },
           ].map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-blue-600 shadow-xl' : 'hover:bg-slate-800 text-slate-400'}`}
             >
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        {/* Right Side: Tab Content Editor */}
        <div className="flex-1 bg-[#1e293b]/30 rounded-[2.5rem] border border-slate-800 p-10 min-h-[70vh]">
          {activeTab === 'study' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-black flex items-center gap-3">Biên tập nội dung bài học</h2>
              <SimpleMDE 
                value={lesson?.content} 
                onChange={(val) => setLesson({...lesson, content: val})} 
              />
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-6 animate-in fade-in">
               <h2 className="text-2xl font-black flex items-center gap-3">Tóm tắt ngắn (Summary)</h2>
               <textarea 
                className="w-full h-40 bg-[#0f172a] border border-slate-700 rounded-3xl p-6 text-slate-300 outline-none focus:border-blue-500"
                value={lesson?.summary}
                onChange={(e) => setLesson({...lesson, summary: e.target.value})}
               />
               <button className="bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-indigo-500/20">
                 <Sparkles size={14}/> Yêu cầu AI viết lại tóm tắt
               </button>
            </div>
          )}

          {activeTab === 'quiz' && (
             <div className="space-y-8 animate-in fade-in">
                <div className="flex justify-between items-center">
                   <h2 className="text-2xl font-black">Quản lý câu hỏi</h2>
                   <button className="bg-blue-600 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2"><Plus size={14}/> Thêm câu hỏi</button>
                </div>
                
                {/* Khu vực tạo Quiz bằng AI (Giống hình bạn gửi) */}
                <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-[2rem] space-y-4">
                   <p className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                     <Sparkles size={14}/> Yêu cầu tạo trắc nghiệm bằng AI
                   </p>
                   <textarea 
                    placeholder="Ví dụ: 'tạo 3 câu hỏi khó về chủ đề này'..."
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 text-sm outline-none"
                   />
                   <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl text-xs font-black transition-all">Tạo trắc nghiệm</button>
                </div>

                {/* Danh sách các câu hỏi hiện có */}
                <div className="space-y-4">
                   {lesson?.quiz?.map((q: any, idx: number) => (
                     <div key={idx} className="bg-[#0f172a] p-6 rounded-[2rem] border border-slate-800 space-y-4 relative">
                        <button className="absolute top-6 right-6 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                        <p className="text-[10px] font-black text-blue-500 uppercase">Câu hỏi {idx + 1}</p>
                        <input className="w-full bg-transparent border-b border-slate-800 text-lg font-bold pb-2 outline-none focus:border-blue-500" value={q.question} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {q.options.map((opt: string, oIdx: number) => (
                             <div key={oIdx} className={`flex items-center gap-3 p-3 rounded-xl border ${oIdx === q.correctAnswer ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-900 border-slate-800'}`}>
                                <span className="text-xs font-black text-slate-500">{String.fromCharCode(65 + oIdx)}</span>
                                <input className="bg-transparent flex-1 text-sm outline-none" value={opt} />
                             </div>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonView;
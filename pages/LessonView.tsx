import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from "../services/api";
import { 
  BookOpen,Sparkles, FileText, CheckSquare, AlignLeft, 
  MessageCircle, ArrowLeft, Loader2, Search 
} from 'lucide-react';
import AIChat from './AIChat'; // Tái sử dụng component Chat
import QuizView from './QuizView';

const LessonView: React.FC = () => {
  const { id, dayNumber } = useParams();
  console.log("Params nhận được từ URL:", { id, dayNumber });
  const navigate = useNavigate();
  
  // States
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('study'); // Mặc định là tab Học tập


const fetchLesson = async (isSilent = false) => { // Thêm tham số isSilent
  if (!id || !dayNumber || dayNumber === "undefined") return;
  try {
    if (!isSilent) setLoading(true); // Chỉ hiện loading nếu không phải silent
    const res = await api.plan.getLessonDetail(id, dayNumber);
    if (res.success === "true") {
      setLesson(res.data);
    }
  } catch (error) {
    console.error("Lỗi lấy bài học:", error);
  } finally {
    if (!isSilent) setLoading(false);
  }
};

  // --- TRONG useEffect CHỈ CẦN GỌI NÓ ---
  useEffect(() => {
    fetchLesson();
  }, [id, dayNumber]);



  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        // Gọi API lấy chi tiết bài học của ngày cụ thể
        const res = await api.plan.getLessonDetail(id!, dayNumber!);
        if (res.success === "true") {
          setLesson(res.data);
        }
      } catch (error) {
        console.error("Lỗi lấy bài học:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id, dayNumber]);



useEffect(() => {
  const fetchLesson = async () => {
    // SỬA Ở ĐÂY: Nếu chưa có id hoặc dayNumber thì thoát ra, không gọi API
    if (!id || dayNumber === "undefined" || !dayNumber) return;

    try {
      setLoading(true);
      const res = await api.plan.getLessonDetail(id, dayNumber);
      if (res.success === "true") {
        setLesson(res.data);
      }
    } catch (error) {
      console.error("Lỗi lấy bài học:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchLesson();
}, [id, dayNumber]); // Chạy lại khi 1 trong 2 cái này thay đổi




  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a]">
      <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
    </div>
  );

  // Hàm render nội dung dựa trên Tab đang chọn
  const renderTabContent = () => {
    switch (activeTab) {
      case 'study':
        return (
          <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#1e293b]/50 p-8 rounded-3xl border border-slate-800 leading-relaxed text-slate-300 whitespace-pre-wrap">
              {lesson?.content}
            </div>
          </div>
        );
      
      case 'summary':
        return (
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-8 rounded-3xl border border-indigo-500/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="text-indigo-400" /> Tóm tắt bài học bởi AI
            </h3>
            <p className="text-slate-300 italic">{lesson?.summary}</p>
          </div>
        );

      // Trong LessonView.tsx
case 'quiz':
  return (
    <QuizView 
      planId={id!} 
      dayNumber={Number(dayNumber)} 
      questions={lesson?.quiz || []} 
      status={lesson?.status}
      onSuccess={() => {
          fetchLesson(true); // <--- TRUYỀN true ĐỂ CẬP NHẬT NGẦM
      }}
    />
  );

      case 'chat':
        // Truyền courseId vào để AI biết đang chat về tài liệu nào (RAG)
        return <AIChat courseId={id} />;

      default:
        return <div className="text-white">Tính năng đang phát triển...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      {/* Header Điều hướng */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black">{lesson?.title}</h1>
            <p className="text-sm text-slate-500">Ngày {dayNumber} • Khóa học đang học</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-bold uppercase">
             Ngày {dayNumber}
          </span>
        </div>
      </div>

      {/* Thanh Tabs (Giống ảnh mẫu của bạn) */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex gap-2 bg-[#1e293b]/50 p-2 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'study', label: 'Học tập', icon: <BookOpen size={18}/> },
            { id: 'docs', label: 'Tài liệu', icon: <FileText size={18}/> },
            { id: 'quiz', label: 'Trắc nghiệm', icon: <CheckSquare size={18}/> },
            { id: 'summary', label: 'Tóm tắt', icon: <AlignLeft size={18}/> },
            { id: 'chat', label: 'Phòng chat', icon: <MessageCircle size={18}/> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default LessonView;
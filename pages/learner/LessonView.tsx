import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  BookOpen, Sparkles, FileText, CheckSquare, Star, 
  MessageCircle, ArrowLeft, Loader2, ChevronRight, Check ,CheckCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import AIChatBox from '../../components/ai/AIChatBox';

const LessonView = () => {
  const { id, dayNumber } = useParams();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('study');



const [selectedAnswers, setSelectedAnswers] = useState<any>({});
const [quizResult, setQuizResult] = useState<any>(null);
const [submittingQuiz, setSubmittingQuiz] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const planRes = await api.plan.getDetail(id!);
        const lessonRes = await api.plan.getLesson(id!, dayNumber!);
        if (lessonRes.success) {
          setLesson(lessonRes.data);
          setPlan(planRes.data.plan);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, dayNumber]);


  if (loading) return (
    <div className="h-screen bg-[#0f172a] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
    </div>
  );

  const handleSelectAnswer = (qIdx: number, aIdx: number) => {
  if (quizResult) return; // Nếu đã nộp bài thì không cho chọn lại
  setSelectedAnswers({ ...selectedAnswers, [qIdx]: aIdx });
};

const handleSubmitQuiz = async () => {
  if (Object.keys(selectedAnswers).length < lesson.quiz.length) {
    alert("Vui lòng trả lời hết các câu hỏi!");
    return;
  }

  try {
    setSubmittingQuiz(true);
    const res = await api.quiz.submitLessonQuiz({
      planId: id!,
      dayNumber: Number(dayNumber),
      answers: selectedAnswers
    });

    if (res.success) {
      setQuizResult(res.data);
      // Có thể reload lại thông tin bài học để cập nhật trạng thái "Sẵn sàng" ở sidebar
    }
  } catch (err) {
    alert("Lỗi khi nộp bài");
  } finally {
    setSubmittingQuiz(false);
  }
};

  const renderContent = () => {
    switch (activeTab) {
      case 'study':
        return (
          <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-[#1e293b]/30 p-8 lg:p-12 rounded-[2.5rem] border border-slate-800 leading-relaxed text-slate-300">
               <ReactMarkdown>{lesson?.content}</ReactMarkdown>
            </div>
          </div>
        );
      
      case 'important':
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-black text-yellow-500 flex items-center gap-3">
              <Star fill="currentColor" /> Kiến thức trọng tâm & Công thức
            </h2>
            <div className="grid gap-4">
              {lesson?.importantNotes?.length > 0 ? (
                lesson.importantNotes.map((note: string, idx: number) => (
                  <div key={idx} className="bg-yellow-500/5 border-l-4 border-yellow-500 p-6 rounded-r-2xl font-mono text-yellow-100 shadow-xl leading-relaxed">
                    {note}
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic p-10 bg-slate-900/50 rounded-3xl text-center border border-dashed border-slate-800">
                    AI không tìm thấy lưu ý đặc biệt hoặc công thức nào trong bài học này.
                </p>
              )}
            </div>
          </div>
        );

      case 'quiz':
  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black italic">Kiểm tra kiến thức Ngày {dayNumber}</h2>
        {quizResult && (
          <div className="bg-blue-600 px-6 py-2 rounded-2xl font-black animate-bounce shadow-lg shadow-blue-900/40">
            Điểm số: {quizResult.score}/{quizResult.total} ({quizResult.percentage}%)
          </div>
        )}
      </div>

      <div className="space-y-6">
        {lesson?.quiz?.map((q: any, idx: number) => {
          const result = quizResult?.detailedResults[idx];
          return (
            <div key={idx} className={`bg-[#1e293b]/50 p-8 rounded-[2.5rem] border transition-all
              ${result ? (result.isCorrect ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-red-500/50 bg-red-500/5') : 'border-slate-800'}`}>
              
              <div className="flex gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black shrink-0 border border-slate-700">
                  {idx + 1}
                </span>
                <p className="text-lg font-bold">{q.question}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 pl-12">
                {q.options.map((opt: string, oIdx: number) => {
                  // Logic màu sắc hiển thị sau khi nộp bài
                  let btnClass = "bg-slate-900/50 border-slate-800 text-slate-400";
                  if (quizResult) {
                    if (oIdx === q.correctAnswer) btnClass = "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20";
                    else if (selectedAnswers[idx] === oIdx && !result.isCorrect) btnClass = "bg-red-600 text-white border-red-500";
                  } else if (selectedAnswers[idx] === oIdx) {
                    btnClass = "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-900/20";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectAnswer(idx, oIdx)}
                      disabled={!!quizResult}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${btnClass}`}
                    >
                      <span className="text-[10px] font-black uppercase opacity-60">{String.fromCharCode(65 + oIdx)}</span>
                      <span className="text-sm font-bold">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hiện giải thích sau khi nộp */}
              {quizResult && (
                <div className="mt-6 ml-12 p-4 bg-slate-900/80 rounded-2xl border border-slate-700 text-sm animate-in zoom-in">
                   <p className="text-blue-400 font-black uppercase text-[10px] mb-1 tracking-widest">Giải thích chi tiết</p>
                   <p className="text-slate-300 leading-relaxed italic">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!quizResult ? (
        <button
          onClick={handleSubmitQuiz}
          disabled={submittingQuiz}
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[1.5rem] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          {submittingQuiz ? <Loader2 className="animate-spin" /> : <CheckCircle size={24} />}
          Nộp bài & Hoàn thành Ngày {dayNumber}
        </button>
      ) : (
        <div className="space-y-4">
            <button
            onClick={() => navigate(`/plan/${id}`)}
            className="w-full py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-[1.5rem] font-black text-xl border border-slate-700 transition-all"
            >
            Quay lại Lộ trình
            </button>
            <p className="text-center text-emerald-500 font-bold animate-pulse text-sm">
                🎉 Tuyệt vời! Bạn đã hoàn thành bài học và mở khóa nội dung mới.
            </p>
        </div>
      )}
    </div>
  );

      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden">
      
      {/* LEFT: CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12">
        
        {/* Navigation Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(`/plan/${id}`)}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all border border-slate-700"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight">{lesson?.title}</h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
                Ngày {dayNumber} • {plan?.title}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Menu */}
        <div className="flex gap-2 bg-[#1e293b]/80 backdrop-blur-md p-1.5 rounded-2xl w-fit mb-10 border border-slate-800 sticky top-0 z-10 shadow-xl">
          {[
            { id: 'study', label: 'Học tập', icon: <BookOpen size={16}/> },
            { id: 'important', label: 'Nội dung chính', icon: <Star size={16}/> },
            { id: 'quiz', label: 'Trắc nghiệm', icon: <CheckSquare size={16}/> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Render nội dung */}
        <div className="max-w-4xl">
          {renderContent()}
        </div>
        
        <div className="h-20" /> {/* Spacer */}
      </div>

      {/* RIGHT: AI CHAT SIDEBAR */}
      <div className="w-[420px] border-l border-slate-800 bg-[#0f172a] hidden xl:flex flex-col">
         <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-[#1e293b]/20">
           <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="font-black text-xs uppercase tracking-widest text-slate-400">Trợ lý tài liệu AI</span>
           </div>
           <MessageCircle size={18} className="text-slate-600" />
         </div>
         <div className="flex-1 overflow-hidden p-4">
            <AIChatBox planId={id} />
         </div>
      </div>

    </div>
  );
};

export default LessonView;
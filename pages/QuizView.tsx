import React, { useState, useEffect } from 'react';
import { api } from "../services/api";
import { CheckCircle2, XCircle, Info, Loader2, Sparkles, ChevronRight, RotateCcw } from 'lucide-react';

interface Props {
  planId: string;
  dayNumber: number;
  questions: any[];
  status?: string; // Nhận trạng thái từ trang cha (LessonView)
  onSuccess: () => void;
}

const QuizView: React.FC<Props> = ({ planId, dayNumber, questions, status, onSuccess }) => {
  const [userAnswers, setUserAnswers] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState(status === 'completed');
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Nếu đã hoàn thành từ trước, chúng ta hiển thị trạng thái "Đã xong" 
  // (Lưu ý: Để hiện chi tiết kết quả cũ, bạn cần lưu 'attempt' vào DB, 
  // ở đây tôi tập trung vào việc hiển thị ngay sau khi nộp bài)

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers({ ...userAnswers, [qIdx]: optIdx });
  };

  const handleSubmit = async () => {
  if (Object.keys(userAnswers).length < questions.length) {
    alert("Vui lòng trả lời hết tất cả các câu hỏi!");
    return;
  }
  setSubmitting(true);
  try {
    const res = await api.quiz.submitLessonQuiz({ 
      planId, 
      dayNumber, 
      answers: userAnswers 
    });

    console.log("Dữ liệu trả về từ API:", res); // Debug để kiểm tra

    // Kiểm tra chính xác success từ Backend
    if (res.success === "true" || res.success === true) {
      // 1. Cập nhật kết quả vào State trước
      setResult(res.data);
      setIsSubmitted(true);
      
      // 2. Chỉ báo cho trang cha sau khi đã hiện kết quả
      // Việc gọi onSuccess(true) ở bước 1 sẽ giúp Roadmap (Sidebar/Header) cập nhật
      // mà không làm mất trang hiện tại của bạn.
      onSuccess(); 
    } else {
      alert("Nộp bài thất bại: " + res.message);
    }
  } catch (error) {
    console.error("Lỗi nộp bài:", error);
    alert("Có lỗi xảy ra khi nộp bài.");
  } finally {
    setSubmitting(false);
  }
};

  // GIAO DIỆN KẾT QUẢ SAU KHI NỘP
  if (isSubmitted && result) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Tổng điểm */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-[2.5rem] p-10 text-center shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
           <h2 className="text-3xl font-black text-white mb-2">Kết quả bài làm</h2>
           <p className="text-slate-400 font-medium">Bạn đã hoàn thành bài học Ngày {dayNumber}</p>
           
           <div className="flex items-center justify-center gap-12 mt-8">
              <div className="text-center">
                 <p className="text-4xl font-black text-blue-400">{result.score}/{result.totalQuestions}</p>
                 <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Số câu đúng</p>
              </div>
              <div className="w-px h-12 bg-slate-800"></div>
              <div className="text-center">
                 <p className="text-4xl font-black text-emerald-400">{result.percentage}%</p>
                 <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Tỷ lệ chính xác</p>
              </div>
           </div>
        </div>

        {/* Danh sách câu hỏi kèm giải thích chi tiết */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 px-2">
             <ChevronRight className="text-blue-500" /> Xem lại chi tiết
          </h3>
          
          {result.results.map((item: any, idx: number) => (
            <div key={idx} className={`p-8 rounded-[2rem] border-2 transition-all ${
              item.isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <p className="text-lg font-bold text-slate-100 flex-1">
                  Câu {idx + 1}: {item.question}
                </p>
                {item.isCorrect ? 
                  <CheckCircle2 className="text-emerald-500 shrink-0" size={28} /> : 
                  <XCircle className="text-red-500 shrink-0" size={28} />
                }
              </div>

              <div className="grid grid-cols-1 gap-3">
                {questions[idx].options.map((opt: string, i: number) => {
                  const isUserChoice = Number(item.userAnswer) === i;
                  const isCorrectChoice = Number(item.correctAnswer) === i;
                  
                  return (
                    <div key={i} className={`p-4 rounded-xl text-sm font-medium border-2 flex items-center justify-between ${
                      isCorrectChoice 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                        : (isUserChoice && !item.isCorrect) 
                        ? 'border-red-500 bg-red-500/10 text-red-400'
                        : 'border-slate-800 bg-slate-900/40 text-slate-500'
                    }`}>
                      <span>{opt}</span>
                      {isCorrectChoice && <span className="text-[10px] font-black uppercase bg-emerald-500 text-white px-2 py-0.5 rounded">Đáp án đúng</span>}
                      {isUserChoice && !item.isCorrect && <span className="text-[10px] font-black uppercase bg-red-500 text-white px-2 py-0.5 rounded">Bạn chọn</span>}
                    </div>
                  );
                })}
              </div>

              {/* PHẦN GIẢI THÍCH CỦA AI */}
              <div className={`mt-6 p-5 rounded-2xl flex gap-4 ${item.isCorrect ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                <div className={`p-2 rounded-lg h-fit ${item.isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                  <Sparkles size={18} className={item.isCorrect ? 'text-emerald-400' : 'text-red-400'} />
                </div>
                <div>
                  <p className={`text-xs font-black uppercase tracking-widest mb-1 ${item.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    Giải thích từ trợ lý AIBuddy
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{item.explanation}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => window.location.reload()} 
          className="w-full py-4 text-slate-500 hover:text-white font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw size={18} /> Làm lại bài trắc nghiệm
        </button>
      </div>
    );
  }

  // GIAO DIỆN LÀM BÀI
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black text-white">Kiểm tra kiến thức ngày {dayNumber}</h2>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
           {Object.keys(userAnswers).length} / {questions.length} Hoàn thành
        </span>
      </div>

      {questions.map((q, qIdx) => (
        <div key={qIdx} className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
          <p className="text-lg font-bold mb-6 text-slate-200">
            <span className="text-blue-500 mr-2">#{qIdx + 1}</span>
            {q.question}
          </p>
          <div className="grid grid-cols-1 gap-3">
            {q.options.map((opt: string, oIdx: number) => (
              <button
                key={oIdx}
                onClick={() => handleSelect(qIdx, oIdx)}
                className={`p-5 rounded-2xl text-left transition-all border-2 font-medium ${
                  userAnswers[qIdx] === oIdx 
                  ? 'border-blue-500 bg-blue-500/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                  : 'border-slate-800 bg-[#0f172a] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                     userAnswers[qIdx] === oIdx ? 'border-blue-500 bg-blue-500' : 'border-slate-700'
                  }`}>
                    {String.fromCharCode(65 + oIdx)}
                  </div>
                  {opt}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-900/30 flex items-center justify-center gap-3 transition-all active:scale-95 mt-10"
      >
        {submitting ? (
          <>
            <Loader2 className="animate-spin" />
            <span>Đang chấm điểm...</span>
          </>
        ) : (
          <>
            <Sparkles size={24} />
            <span>Nộp bài & Hoàn thành ngày học</span>
          </>
        )}
      </button>
    </div>
  );
};

export default QuizView;
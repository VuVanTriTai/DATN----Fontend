import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, FileText, CheckCircle, List, 
  BookOpen, Video, Info, Send, Loader2, User, Bot, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';

const LessonView: React.FC = () => {
  const { planId, dayNumber } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('study');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [lessonData, setLessonData] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: 'ai', content: 'Chào bạn! Tôi đã đọc kỹ tài liệu của bài học này. Bạn có thắc mắc gì cần giải đáp không?' }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'study', icon: <BookOpen />, label: "Học tập" },
    { id: 'summary', icon: <List />, label: "Tóm tắt" },
    { id: 'quiz', icon: <CheckCircle />, label: "Trắc nghiệm" },
    { id: 'chat', icon: <MessageSquare />, label: "Hỏi đáp AI" },
    { id: 'video', icon: <Video />, label: "Video", disabled: true },
  ];

  // 1. Lấy dữ liệu bài học từ Backend
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        // Giả sử API lấy chi tiết 1 bài học theo Plan và Ngày
        const response = await api.plan.getLessonDetail(planId!, dayNumber!);
        setLessonData(response.data);
      } catch (err) {
        console.error("Lỗi tải bài học:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [planId, dayNumber]);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // 2. Xử lý Chat RAG (Hỏi đáp trên tài liệu)
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;

    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    try {
      // Gọi API RAG thông minh đã viết ở Backend
      const res = await api.ai.chatDoc(chatInput, planId!);
      
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: res.data.answer,
        sources: res.data.sources 
      }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Xin lỗi, tôi gặp trục trặc khi truy xuất tài liệu này." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-4 lg:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Breadcrumb */}
        <div className="mb-8 flex justify-between items-center">
           <div>
              <h1 className="text-2xl font-black">{lessonData?.title || `Ngày ${dayNumber}`}</h1>
              <p className="text-slate-500 text-sm font-medium">Lộ trình: {lessonData?.planTitle}</p>
           </div>
           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white text-sm font-bold">Quay lại lộ trình</button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border
              ${tab.disabled ? 'opacity-20 cursor-not-allowed border-transparent' : 
                activeTab === tab.id ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/20' : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800'}`}
            >
              {React.cloneElement(tab.icon as React.ReactElement<any>, { size: 18 })}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
          
          {/* Tab Content Display */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
             
             {/* 1. Tab Học Tập */}
             {activeTab === 'study' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="prose prose-invert max-w-none">
                      <p className="text-slate-300 leading-loose text-lg whitespace-pre-line">
                         {lessonData?.content || "Nội dung bài học đang được AI biên soạn..."}
                      </p>
                   </div>
                </div>
             )}

             {/* 2. Tab Tóm tắt */}
             {activeTab === 'summary' && (
                <div className="space-y-6 animate-in zoom-in duration-300">
                   <div className="bg-blue-500/5 border border-blue-500/20 rounded-3xl p-8">
                      <h3 className="text-blue-400 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Sparkles size={18} /> Ghi chú quan trọng
                      </h3>
                      <p className="text-slate-200 leading-relaxed italic">
                        {lessonData?.summary || "AI đang tóm tắt các ý chính cho bạn..."}
                      </p>
                   </div>
                </div>
             )}

             {/* 3. Tab Trắc nghiệm (Sử dụng logic QuizAI cũ của bạn) */}
             {activeTab === 'quiz' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                   {lessonData?.quiz?.map((q: any, idx: number) => (
                      <div key={idx} className="bg-slate-800/30 p-6 rounded-3xl border border-slate-800">
                         <p className="text-blue-400 font-bold mb-4">Câu hỏi {idx + 1}</p>
                         <h4 className="text-lg font-bold mb-6">{q.question}</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((opt: string, i: number) => (
                               <button key={i} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-left text-sm transition-all border border-slate-700">
                                  {String.fromCharCode(65 + i)}. {opt}
                               </button>
                            ))}
                         </div>
                      </div>
                   ))}
                </div>
             )}

             {/* 4. Tab Hỏi đáp AI (RAG Chat) */}
             {activeTab === 'chat' && (
                <div className="flex flex-col h-full space-y-6">
                   {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                               {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'}`}>
                               {msg.content}
                               {msg.sources && (
                                  <div className="mt-3 pt-3 border-t border-slate-700 text-[10px] text-slate-500 italic">
                                     Nguồn: {msg.sources.length} đoạn trích dẫn từ tài liệu.
                                  </div>
                               )}
                            </div>
                         </div>
                      </div>
                   ))}
                   {isTyping && (
                      <div className="flex justify-start animate-pulse">
                         <div className="bg-slate-800 p-4 rounded-2xl text-xs text-slate-500">AI Buddy đang đọc tài liệu...</div>
                      </div>
                   )}
                   <div ref={scrollRef} />
                </div>
             )}
          </div>

          {/* Chat Input Bar (Chỉ hiện khi ở tab chat) */}
          {activeTab === 'chat' && (
            <div className="p-6 bg-slate-900/50 border-t border-slate-800">
               <div className="flex gap-3 bg-[#0b1120] border border-slate-700 rounded-2xl p-2 focus-within:border-blue-500 transition-all">
                  <input 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Hỏi AI về nội dung tài liệu này..." 
                    className="flex-1 bg-transparent px-4 py-2 outline-none text-sm"
                  />
                  <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl transition-all">
                    <Send size={18} />
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Footer Rules */}
        <div className="mt-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6">
           <div className="flex items-center gap-2 text-blue-400 font-bold mb-4 text-sm uppercase tracking-widest">
              <Info size={16} /> Quy tắc thảo luận
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-400 rounded-full"/> Thảo luận nội dung liên quan đến bài học</div>
              <div className="flex items-center gap-2"><div className="w-1 h-1 bg-red-400 rounded-full"/> Không spam hoặc gửi nội dung không phù hợp</div>
              <div className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-400 rounded-full"/> Hỗ trợ và chia sẻ kiến thức với nhau</div>
              <div className="flex items-center gap-2"><div className="w-1 h-1 bg-red-400 rounded-full"/> Không chia sẻ thông tin cá nhân</div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default LessonView;
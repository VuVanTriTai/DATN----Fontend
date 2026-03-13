import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Paperclip } from 'lucide-react';
//import { chatWithDoc } from '@/services/api';
import { api } from '../services/api'; // Đảm bảo bạn đã có API service để gọi



interface AIChatProps {
  courseId?: string; // Dấu ? nghĩa là có thể có hoặc không
}

const AIChat: React.FC<AIChatProps> = ({ courseId }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Chào bạn! Tôi là trợ lý học tập AI. Bạn cần tôi hỗ trợ gì về bài học hôm nay không?' }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  // Thêm dòng này vào
const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cần import thêm API service của bạn
// import { chatWithDoc } from '@/services/api'; 

const handleSend = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage = { role: 'user', content: input };
  setMessages(prev => [...prev, userMessage]);
  const currentInput = input; // Lưu lại input để xử lý
  setInput("");
  setIsLoading(true);

  try {
    // GỌI ĐÚNG HÀM NÀY: api.ai.chatDoc
    const response = await api.ai.chatDoc(currentInput, courseId || "");

    // Backend trả về success: "true" (chuỗi)
    if (response.success === "true") {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: response.data.answer // Truy cập vào data.answer theo cấu trúc Backend
      }]);
    } else {
      throw new Error(response.message);
    }
  } catch (error: any) {
    console.error("Chat Error:", error);
    setMessages(prev => [...prev, { 
      role: 'ai', 
      content: "Xin lỗi, AI đang bận hoặc có lỗi kết nối. Vui lòng thử lại sau." 
    }]);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-[#0f172a] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="p-6 border-b border-slate-800 bg-[#1e293b]/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-xl">
            <Bot className="text-white" />
          </div>
          <div>
            <h2 className="font-bold">AI Study Buddy</h2>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              Sẵn sàng hỗ trợ
            </div>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white flex items-center gap-2 text-sm bg-slate-800 px-4 py-2 rounded-xl transition-all">
          <Sparkles size={16} className="text-purple-400" /> Làm mới hội thoại
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-[#1e293b] text-slate-200 border border-slate-800 rounded-tl-none"
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#1e293b]/30 border-t border-slate-800">
        <div className="relative flex items-center gap-3 bg-[#0f172a] border border-slate-800 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
          


           {/* Thêm icon vào đây nếu muốn dùng */}
  <button className="p-2 text-slate-500 hover:text-slate-300">
    <Paperclip size={20} />
  </button>
          

          
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Đặt câu hỏi về bài học cho AI..."
            className="flex-1 bg-transparent py-3 px-4 outline-none text-sm"
          />
          <button 
            onClick={handleSend}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition-all active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-500 mt-3 uppercase tracking-widest">
          Trợ lý AI có thể cung cấp thông tin không chính xác. Hãy kiểm tra lại các nguồn tài liệu.
        </p>
      </div>
    </div>
  );
};

export default AIChat;
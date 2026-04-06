import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Trash2, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import ReactMarkdown from 'react-markdown'; // Cài đặt: npm install react-markdown

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface AIChatBoxProps {
  planId: string | undefined;
}

const AIChatBox: React.FC<AIChatBoxProps> = ({ planId }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      content: 'Chào bạn! Tôi là trợ lý học tập AI. Bạn có thắc mắc gì về nội dung tài liệu này không? Hãy đặt câu hỏi cho tôi nhé!' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !planId || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Gọi API RAG Chat
      const res = await api.ai.chat(userMessage, planId);
      
      // Giả sử API trả về { success: true, data: { answer: "..." } }
      // Hoặc tùy cấu trúc response của bạn, ở đây tôi dùng res.answer từ ragService
      const aiResponse = res.data?.answer || res.answer || "Xin lỗi, tôi không thể tìm thấy câu trả lời.";

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: '❌ Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Bạn có muốn xóa lịch sử chat này không?")) {
      setMessages([{ role: 'ai', content: 'Lịch sử đã được xóa. Tôi có thể giúp gì tiếp cho bạn?' }]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b]/50 rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header của Chatbox */}
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#1e293b]">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-300">AI Assistant</span>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Danh sách tin nhắn */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg
              ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-700'}`}
            >
              {msg.role === 'user' ? <User size={16}/> : <Bot size={16}/>}
            </div>
            
            <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-[#0f172a] text-slate-300 border border-slate-800 rounded-tl-none'}`}
            >
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <Bot size={16} className="text-slate-400"/>
            </div>
            <div className="bg-[#0f172a] p-4 rounded-[1.5rem] rounded-tl-none border border-slate-800">
              <Loader2 className="animate-spin text-blue-500" size={18} />
            </div>
          </div>
        )}
      </div>

      {/* Ô nhập liệu */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[#1e293b] border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi AI về bài học này..."
            disabled={isLoading}
            className="w-full bg-[#0f172a] border border-slate-700 text-white text-sm rounded-2xl py-4 pl-5 pr-14 outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 p-2.5 rounded-xl transition-all
              ${!input.trim() || isLoading 
                ? 'text-slate-600' 
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'}`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-600 mt-2 uppercase font-bold tracking-tighter">
          AI có thể nhầm lẫn, hãy kiểm tra lại thông tin quan trọng.
        </p>
      </form>
    </div>
  );
};

export default AIChatBox;
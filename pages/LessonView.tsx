import React, { useState } from 'react';
import { MessageSquare, FileText, CheckCircle, List, BookOpen, Video, Info } from 'lucide-react';

const LessonView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat'); // Mặc định là Phòng chat như ảnh

  const tabs = [
    { id: 'video', icon: <Video />, label: "Video", disabled: true },
    { id: 'study', icon: <BookOpen />, label: "Học tập" },
    { id: 'docs', icon: <FileText />, label: "Tài liệu" },
    { id: 'quiz', icon: <CheckCircle />, label: "Trắc nghiệm" },
    { id: 'summary', icon: <List />, label: "Tóm tắt" },
    { id: 'chat', icon: <MessageSquare />, label: "Phòng chat" },
  ];

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border
              ${tab.disabled ? 'opacity-30 cursor-not-allowed border-slate-800' : 
                activeTab === tab.id ? 'bg-blue-600 border-blue-500 shadow-lg' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
            >
              {React.cloneElement(tab.icon as React.ReactElement<any>, { size: 18 })}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-[#1e293b]/40 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
          
          {/* Day Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <div className="flex items-center gap-3 text-blue-400">
               <MessageSquare size={20} />
               <div>
                  <h3 className="font-bold text-white">Thảo luận - Ngày 3</h3>
                  <p className="text-xs text-slate-500">Real-time chat với các học viên khác</p>
               </div>
            </div>
            <div className="text-right text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
                Xin chào, siriuss1240@gmail.com <br />
                Room: study-plan-4fa5c0e2-da78-43f9-ad3b-3fe2b05b84c5-day-3
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="h-[500px] flex items-center justify-center relative">
             {activeTab === 'chat' && (
                <div className="flex flex-col items-center gap-4">
                   <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-slate-400 font-medium">Đang tải chat...</p>
                </div>
             )}
             {/* Bạn sẽ render nội dung khác (Quiz, Văn bản...) dựa vào activeTab tại đây */}
          </div>
        </div>

        {/* Rules Footer Section */}
        <div className="mt-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl p-6">
           <div className="flex items-center gap-2 text-blue-400 font-bold mb-4 text-sm">
              <Info size={16} /> Quy tắc thảo luận
           </div>
           <div className="grid grid-cols-2 gap-y-2 text-xs font-medium">
              <div className="flex items-center gap-2 text-emerald-400">✓ Thảo luận nội dung liên quan đến bài học</div>
              <div className="flex items-center gap-2 text-red-400">✗ Không spam hoặc gửi nội dung không phù hợp</div>
              <div className="flex items-center gap-2 text-emerald-400">✓ Hỗ trợ và chia sẻ kiến thức với nhau</div>
              <div className="flex items-center gap-2 text-red-400">✗ Không chia sẻ thông tin cá nhân</div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default LessonView;
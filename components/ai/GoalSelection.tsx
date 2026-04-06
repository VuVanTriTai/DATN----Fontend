import React from 'react';
import { Book, Hammer, GraduationCap, Microscope, ChevronRight } from 'lucide-react';

interface GoalSelectionProps {
  onConfirm: (goals: { focus: string; depth: string }) => void;
  onBack: () => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ onConfirm, onBack }) => {
  const [focus, setFocus] = React.useState('theory');
  const [depth, setDepth] = React.useState('basic');

  return (
    <div className="max-w-2xl w-full bg-[#1e293b] rounded-[3rem] p-10 border border-slate-800 space-y-10 animate-in zoom-in shadow-2xl">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white">Xác định mục tiêu học tập</h2>
        <p className="text-slate-400 mt-2 text-sm font-medium">AI sẽ dựa vào lựa chọn của bạn để thiết kế giáo trình phù hợp nhất.</p>
      </div>

      <div className="space-y-8">
        {/* Lựa chọn Thiên hướng */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] ml-2">Bạn muốn tập trung vào?</label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setFocus('theory')}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${focus === 'theory' ? 'bg-blue-600/10 border-blue-500 shadow-lg' : 'bg-slate-900 border-slate-800 opacity-60'}`}
            >
              <Book size={24} className={focus === 'theory' ? 'text-blue-400' : 'text-slate-500'} />
              <span className="font-bold text-sm">Lý thuyết chuyên sâu</span>
            </button>
            <button 
              onClick={() => setFocus('practical')}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${focus === 'practical' ? 'bg-indigo-600/10 border-indigo-500 shadow-lg' : 'bg-slate-900 border-slate-800 opacity-60'}`}
            >
              <Hammer size={24} className={focus === 'practical' ? 'text-indigo-400' : 'text-slate-500'} />
              <span className="font-bold text-sm">Thực hành ứng dụng</span>
            </button>
          </div>
        </div>

        {/* Lựa chọn Độ sâu */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] ml-2">Mức độ tiếp cận kiến thức?</label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setDepth('basic')}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${depth === 'basic' ? 'bg-emerald-600/10 border-emerald-500 shadow-lg' : 'bg-slate-900 border-slate-800 opacity-60'}`}
            >
              <GraduationCap size={24} className={depth === 'basic' ? 'text-emerald-400' : 'text-slate-500'} />
              <span className="font-bold text-sm">Tìm hiểu Cơ bản</span>
            </button>
            <button 
              onClick={() => setDepth('advanced')}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${depth === 'advanced' ? 'bg-purple-600/10 border-purple-500 shadow-lg' : 'bg-slate-900 border-slate-800 opacity-60'}`}
            >
              <Microscope size={24} className={depth === 'advanced' ? 'text-purple-400' : 'text-slate-500'} />
              <span className="font-bold text-sm">Nghiên cứu Chuyên sâu</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={onBack} className="flex-1 py-4 text-slate-500 font-bold hover:text-white transition-all underline">Quay lại</button>
        <button 
          onClick={() => onConfirm({ focus, depth })}
          className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          Tiến hành phân tích <ChevronRight size={20}/>
        </button>
      </div>
    </div>
  );
};

export default GoalSelection;
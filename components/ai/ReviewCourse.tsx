import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Check, UserCheck, Loader2, ArrowLeft, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const focusLabel = (f: string) => (f === 'practice' ? 'Thực hành' : 'Lý thuyết');
const depthLabel = (d: string) => (d === 'deep' ? 'Chuyên sâu' : 'Cơ bản');

const ReviewCourse = ({ data, rawText, onBack, learningGoals: goalsProp }: any) => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [selectedInId, setSelectedInId] = useState("");
  const learningGoals = goalsProp || data?.analysis?.learningGoals || { focus: 'theory', depth: 'basic' };

  useEffect(() => {
    // Lấy danh sách giáo viên từ hệ thống
    api.auth.getInstructors().then(res => setInstructors(res.data));
  }, []);

const handleFinalize = async () => {
    setIsCreating(true);
    try {
      const res = await api.course.finalizeCreate({
        title: data.analysis.suggestedTitle,
        extractedText: rawText,
        numDays: data.analysis.suggestedDays,
        instructorId: selectedInId || null,
        previewPlan: data.previewPlan,
        learningGoals
      });

      // Kiểm tra cả 2 trường hợp success là string "true" hoặc boolean true
      if (res.success === true || res.success === "true") {
        const planId = res.data?._id || res.data?.id;
        // Chuyển hướng sang trang chi tiết lộ trình
        navigate(`/plan/${planId}`); 
      } else {
        alert("Có lỗi: " + res.message);
      }
    } catch (e) {
      alert("Lỗi kết nối server.");
    } finally {
      setIsCreating(false);
    }
};

  return (
    <div className="max-w-3xl w-full bg-[#1e293b] rounded-[2.5rem] p-10 border border-slate-800 space-y-8">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold transition-colors"
        >
          <ArrowLeft size={18} /> Quay lại chọn mục tiêu & file
        </button>
      )}

      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white">{data.analysis.suggestedTitle}</h2>
        <p className="text-slate-400 text-sm">{data.analysis.summary}</p>
      </div>

      <div className="bg-[#0f172a] p-5 rounded-3xl border border-slate-800 flex flex-wrap items-center gap-3">
        <Target className="text-amber-400 shrink-0" size={22} />
        <div>
          <p className="text-xs font-black text-amber-500/90 uppercase tracking-widest">Mục tiêu đã chọn</p>
          <p className="text-white font-bold mt-1">
            {focusLabel(learningGoals.focus)} · {depthLabel(learningGoals.depth)}
          </p>
          <p className="text-slate-500 text-xs mt-1 max-w-xl">
            Lộ trình và quiz sẽ được tạo theo lựa chọn này (ví dụ thực hành + chuyên sâu: nhiều quiz hơn, độ khó cao hơn).
          </p>
        </div>
      </div>

      {/* CHỌN NGƯỜI HƯỚNG DẪN */}
      <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800 space-y-4">
        <label className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
          <UserCheck size={16}/> Đăng ký người hướng dẫn cho lộ trình này
        </label>
         <select 
        value={selectedInId}
        onChange={(e) => setSelectedInId(e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-blue-500"
    >
        <option value="">-- Để trống nếu muốn tự học --</option>
        {instructors.map(ins => (
            <option key={ins.id} value={ins.id}>GV. {ins.fullName}</option>
        ))}
    </select>
      </div>

      {/* PREVIEW PLAN (Giữ nguyên như cũ) */}
      <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {data.previewPlan.map((p: any, index: number) => (
          <div key={index} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-sm text-slate-300 font-bold">
            Ngày {p.day || p.dayNumber}: {p.topic || p.title}
          </div>
        ))}
      </div>

      <button 
        onClick={handleFinalize}
        disabled={isCreating}
        className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all"
      >
        {isCreating ? <Loader2 className="animate-spin"/> : <Check size={24}/>}
        Bắt đầu tạo lộ trình & Đăng ký học
      </button>
    </div>
  );
};
export default ReviewCourse;
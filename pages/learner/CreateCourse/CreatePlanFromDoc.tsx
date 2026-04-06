// src/pages/learner/CreateCourse/CreatePlanFromDoc.tsx
import React, { useState } from 'react';
import { UploadCloud, Loader2, FileText, CheckCircle } from 'lucide-react';
import { api } from '../../../services/api';
import ReviewCourse from '../../../components/ai/ReviewCourse';

type LearningFocus = "theory" | "practice";
type LearningDepth = "basic" | "deep";

const CreatePlanFromDoc = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [rawText, setRawText] = useState("");
  const [learningFocus, setLearningFocus] = useState<LearningFocus>("theory");
  const [learningDepth, setLearningDepth] = useState<LearningDepth>("basic");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      // 1. Trích xuất text từ file (PDF/Docx)
      const extractRes = await api.file.extract(file);
      const text = extractRes.content;
      setRawText(text);

      // 2. Gửi text + mục tiêu học cho AI phân tích Syllabus
      const analysisRes = await api.course.analyze(text, {
        focus: learningFocus,
        depth: learningDepth,
      });
      if (analysisRes.success) {
        setAnalysisData(analysisRes.data); // Chuyển sang màn hình Review
      }
    } catch (err) {
      alert("Lỗi xử lý file. Vui lòng thử lại!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (analysisData) {
    return (
      <ReviewCourse
        data={analysisData}
        rawText={rawText}
        learningGoals={{ focus: learningFocus, depth: learningDepth }}
        onBack={() => setAnalysisData(null)}
      />
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-10">
      <div className="max-w-2xl w-full bg-[#1e293b] rounded-[3rem] p-12 border border-slate-800 text-center space-y-8 shadow-2xl">
        <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto transition-transform hover:scale-110">
          {isProcessing ? <Loader2 className="animate-spin text-blue-500" size={40}/> : <UploadCloud className="text-blue-500" size={40}/>}
        </div>
        
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Thiết kế lộ trình với AI</h2>
          <p className="text-slate-400 mt-2">Hệ thống sẽ tự động phân tích và tạo bài giảng, bài tập dựa trên file của bạn.</p>
        </div>

        <div className="text-left space-y-4 bg-[#0f172a]/80 rounded-[2rem] p-6 border border-slate-800">
          <p className="text-xs font-black text-blue-500 uppercase tracking-widest">Mục tiêu học (trước khi phân tích)</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-slate-400 text-xs font-bold">Trọng tâm</span>
              <div className="flex rounded-2xl bg-slate-900 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLearningFocus("theory")}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    learningFocus === "theory" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Lý thuyết
                </button>
                <button
                  type="button"
                  onClick={() => setLearningFocus("practice")}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    learningFocus === "practice" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Thực hành
                </button>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                {learningFocus === "theory"
                  ? "Ưu tiên khái niệm, mô hình và luận giải trong tài liệu."
                  : "Ưu tiên bài tập, tình huống và quiz khó hơn, số lượng quiz nhiều hơn."}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-slate-400 text-xs font-bold">Mức độ</span>
              <div className="flex rounded-2xl bg-slate-900 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLearningDepth("basic")}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    learningDepth === "basic" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Cơ bản
                </button>
                <button
                  type="button"
                  onClick={() => setLearningDepth("deep")}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    learningDepth === "deep" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Chuyên sâu
                </button>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                {learningDepth === "basic"
                  ? "Nắm kiến thức nền, lộ trình gọn, quiz vừa phải."
                  : "Đào sâu liên kết kiến thức, nhiều ngày hơn nếu tài liệu dày, quiz khó hơn."}
              </p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <input type="file" id="doc-upload" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
          <label htmlFor="doc-upload" className="block p-8 border-2 border-dashed border-slate-700 rounded-[2rem] cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
            {file ? (
              <div className="flex items-center justify-center gap-3 text-emerald-400 font-bold">
                <CheckCircle size={20}/> {file.name}
              </div>
            ) : (
              <span className="text-slate-500 font-medium text-sm">Nhấn để chọn file PDF, DOCX hoặc TXT</span>
            )}
          </label>
        </div>

        <button 
          onClick={handleProcess}
          disabled={!file || isProcessing}
          className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-lg
            ${!file || isProcessing ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'}
          `}
        >
          {isProcessing ? 'AI đang nghiên cứu tài liệu...' : 'Tiến hành phân tích ngay'}
        </button>
      </div>
    </div>
  );
};

export default CreatePlanFromDoc;
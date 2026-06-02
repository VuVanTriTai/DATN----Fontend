// src/pages/learner/CreateCourse/CreatePlanFromDoc.tsx
import React, { useState } from 'react';
import { UploadCloud, Loader2, FileText, CheckCircle, Calendar, Target, Zap } from 'lucide-react';
import { api } from '../../../services/api';
import ReviewCourse from '../../../components/ai/ReviewCourse';

type LearningFocus = "theory" | "practice";
type LearningDepth = "basic" | "deep";

const CreatePlanFromDoc = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [rawText, setRawText] = useState("");
  
  // States cho mục tiêu và số ngày
  const [learningFocus, setLearningFocus] = useState<LearningFocus>("theory");
  const [learningDepth, setLearningDepth] = useState<LearningDepth>("basic");
  const [days, setDays] = useState<number>(7);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleProcess = async () => {
    if (!file) {
      alert("Vui lòng chọn tài liệu trước.");
      return;
    }
    
    setIsProcessing(true);
    try {
      // BƯỚC 1: Tải lên Cloudinary và trích xuất nội dung văn bản
      const extractRes = await api.file.extract(file);
      const text = extractRes.content;
      const cloudinaryUrl = extractRes.fileUrl; // Lấy link trả về từ Cloudinary
      const metadata = extractRes.metadata; // Lấy metadata từ backend trả về (nếu có)
      
      setRawText(text);

      // BƯỚC 2: Gửi văn bản + Mục tiêu học tập + Số ngày + Metadata xuống AI để phân tích Syllabus
      // Chúng ta sử dụng hàm api.plan.analyze (đã được sửa ở các bước trước)
      const analysisRes = await api.plan.analyze(
        text, 
        { focus: learningFocus, depth: learningDepth }, 
        days,
        metadata
      );

      if (analysisRes.success) {
        setAnalysisData({ ...analysisRes.data, fileUrl: cloudinaryUrl, metadata: metadata });  // Chuyển sang màn hình ReviewCourse
      } else {
        alert("AI không thể phân tích tài liệu: " + analysisRes.message);
      }

    } catch (err: any) {
      console.error("Lỗi quy trình:", err);
      alert(err.response?.data?.message || "Đã có lỗi xảy ra trong quá trình xử lý AI.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Nếu đã có dữ liệu phân tích, hiển thị component Review
  if (analysisData) {
    return (
      <ReviewCourse
        data={analysisData}
        rawText={rawText}
        // Truyền đúng các mục tiêu đã chọn sang trang Review để nộp lên bước cuối
        learningGoals={{ focus: learningFocus, depth: learningDepth }}
        onBack={() => setAnalysisData(null)}
      />
    );
  }

  return (
    <div className="h-full flex items-center justify-center p-6 lg:p-10 animate-in fade-in duration-500">
      <div className="max-w-4xl w-full bg-[#1e293b] rounded-[3rem] p-8 lg:p-12 border border-slate-800 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {isProcessing ? <Loader2 className="animate-spin text-blue-500" size={32}/> : <Zap className="text-blue-500" size={32}/>}
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Thiết kế lộ trình học tập AI</h2>
          <p className="text-slate-400 text-sm font-medium">Tùy chỉnh mục tiêu và tải tài liệu để bắt đầu</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* CỘT TRÁI: CẤU HÌNH MỤC TIÊU */}
          <div className="space-y-6 bg-[#0f172a]/60 rounded-[2rem] p-6 border border-slate-800">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Target size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Cấu hình học tập</span>
            </div>

            {/* Chọn Trọng tâm */}
            <div className="space-y-3">
              <label className="text-slate-400 text-[10px] font-black uppercase ml-1">Trọng tâm kiến thức</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLearningFocus("theory")}
                  className={`py-2.5 rounded-lg text-xs font-bold transition-all ${learningFocus === "theory" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                  Lý thuyết
                </button>
                <button
                  type="button"
                  onClick={() => setLearningFocus("practice")}
                  className={`py-2.5 rounded-lg text-xs font-bold transition-all ${learningFocus === "practice" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                  Thực hành
                </button>
              </div>
            </div>

            {/* Chọn Mức độ */}
            <div className="space-y-3">
              <label className="text-slate-400 text-[10px] font-black uppercase ml-1">Mức độ chuyên sâu</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLearningDepth("basic")}
                  className={`py-2.5 rounded-lg text-xs font-bold transition-all ${learningDepth === "basic" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                  Cơ bản
                </button>
                <button
                  type="button"
                  onClick={() => setLearningDepth("deep")}
                  className={`py-2.5 rounded-lg text-xs font-bold transition-all ${learningDepth === "deep" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                  Nghiên cứu
                </button>
              </div>
            </div>

            {/* Chọn Số ngày */}
            <div className="space-y-3">
              <label className="text-slate-400 text-[10px] font-black uppercase ml-1 flex justify-between">
                <span>Thời gian học</span>
                <span className="text-blue-500">{days} ngày</span>
              </label>
              <input 
                type="range" min="3" max="14" step="1"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[9px] text-slate-600 font-bold uppercase">
                <span>3 ngày</span>
                <span>14 ngày</span>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TẢI FILE */}
          <div className="flex flex-col">
             <div className="flex items-center gap-2 text-blue-500 mb-4">
              <FileText size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Tài liệu nguồn</span>
            </div>

            <div className="relative flex-1 group">
              <input type="file" id="doc-upload" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
              <label htmlFor="doc-upload" className={`h-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all
                ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 bg-slate-900/40 hover:border-blue-500/50 hover:bg-blue-500/5'}`}>
                {file ? (
                  <div className="text-center space-y-2">
                    <CheckCircle className="text-emerald-500 mx-auto" size={32}/>
                    <p className="text-emerald-400 font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                    <span className="text-[10px] text-slate-500 underline">Nhấn để thay đổi</span>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <UploadCloud className="text-slate-600 group-hover:text-blue-500 transition-colors mx-auto" size={40}/>
                    <p className="text-slate-500 text-xs font-medium">Chọn PDF, DOCX hoặc TXT</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Nút hành động chính */}
        <button 
          onClick={handleProcess}
          disabled={!file || isProcessing}
          className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95
            ${!file || isProcessing 
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/30'}
          `}
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={24}/>
              <span>AI đang xây dựng lộ trình...</span>
            </>
          ) : (
            <>
              <span>Tiến hành phân tích ngay</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePlanFromDoc;
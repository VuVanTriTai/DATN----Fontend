import React, { useState, useRef } from 'react';
import { api } from "../services/api";
import { 
  FileText, 
  UploadCloud, 
  X, 
  Sparkles, 
  ArrowLeft,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReviewCourse from '../components/ReviewCourse';

const CreatePlanFromDoc: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // STATE MỚI: Quản lý dữ liệu phân tích và văn bản gốc
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [extractedRawText, setExtractedRawText] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("File quá lớn. Vui lòng chọn file dưới 10MB");
        return;
      }
      setSelectedFile(file);
      setAnalysisData(null); // Reset dữ liệu cũ nếu chọn file mới
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      // BƯỚC 1: Trích xuất văn bản từ file
      const extractRes = await api.file.extract(selectedFile);
      const rawText = extractRes.data?.content || extractRes.content;

      if (!rawText) {
        throw new Error("Không tìm thấy nội dung văn bản trong file.");
      }
      setExtractedRawText(rawText);

      // BƯỚC 2: Gọi AI phân tích cấu trúc khóa học đề xuất (Chưa tạo thật trong DB)
      // Lưu ý: Bạn cần hàm api.course.analyze trong file api.ts
      const analysisRes = await api.course.analyze({ text: rawText });

      if (analysisRes.success === "true" || analysisRes.success === true) {
        // Chuyển sang chế độ Review
        setAnalysisData(analysisRes.data);
      } else {
        alert("AI không thể phân tích tài liệu: " + analysisRes.message);
      }

    } catch (err: any) {
      console.error("Lỗi phân tích:", err);
      alert("Lỗi xử lý tài liệu: " + (err.message || "Vui lòng thử lại."));
    } finally {
      setIsUploading(false);
    }
  };

  // NẾU ĐÃ PHÂN TÍCH XONG, HIỂN THỊ COMPONENT REVIEW
  if (analysisData) {
    return (
      <div className="min-h-screen bg-[#0f172a] p-4 lg:p-12 flex items-center justify-center">
        <ReviewCourse 
          data={analysisData} 
          rawText={extractedRawText} 
          onBack={() => setAnalysisData(null)} 
        />
      </div>
    );
  }

  // GIAO DIỆN UPLOAD BAN ĐẦU
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="max-w-2xl w-full bg-[#1e293b] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800">
        
        <div className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] p-10 text-center relative">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Course Creator</h1>
          <p className="text-indigo-100 text-sm mt-2 font-medium opacity-90">
            Tải lên tài liệu để AI thiết kế lộ trình học tập cho bạn
          </p>
        </div>

        <div className="p-8 lg:p-12 space-y-8">
          <div 
            onClick={handleUploadClick}
            className={`border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer group
              ${selectedFile 
                ? 'border-emerald-500/50 bg-emerald-500/5' 
                : 'border-slate-700 bg-slate-900/50 hover:border-blue-500/50 hover:bg-blue-500/5'
              }`}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />

            {selectedFile ? (
              <>
                <div className="bg-emerald-500/20 p-4 rounded-full mb-4">
                  <CheckCircle className="text-emerald-400 w-12 h-12" />
                </div>
                <p className="text-white font-bold text-lg truncate max-w-xs">{selectedFile.name}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="mt-4 text-slate-500 hover:text-red-400 flex items-center gap-1 text-xs font-bold transition-colors"
                >
                  <X size={14} /> Gỡ bỏ file
                </button>
              </>
            ) : (
              <>
                <div className="bg-slate-800 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <UploadCloud className="text-slate-500 group-hover:text-blue-400 w-12 h-12" />
                </div>
                <h3 className="text-white font-black text-xl mb-2 tracking-tight">Chọn file tài liệu</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em]">PDF, DOCX, TXT</p>
              </>
            )}
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleAnalyze}
              disabled={!selectedFile || isUploading}
              className={`w-full py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98]
                ${!selectedFile || isUploading
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>AI Đang phân tích...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Phân Tích Tài Liệu</span>
                </>
              )}
            </button>

            <button 
              onClick={() => navigate(-1)}
              className="w-full py-4 text-slate-400 font-bold flex items-center justify-center gap-2 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} /> Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlanFromDoc;
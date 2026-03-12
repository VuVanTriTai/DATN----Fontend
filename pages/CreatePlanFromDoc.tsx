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

const CreatePlanFromDoc: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("File quá lớn. Vui lòng chọn file dưới 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Trong CreatePlanFromDoc.tsx
const handleAnalyze = async () => {
  if (!selectedFile) return;
  setIsUploading(true);

  try {
    // Bước 1: Trích xuất văn bản từ file (PDF/Ảnh)
    const extractRes = await api.file.extract(selectedFile);
    const rawText = extractRes.data.content;

    // Bước 2: Gửi văn bản cho AI để thiết kế lộ trình 7 ngày
    const planRes = await api.plan.generateFromText({
      title: selectedFile.name.split('.')[0], // Lấy tên file làm tiêu đề
      extractedText: rawText,
      numDays: 7
    });

    if (planRes.success === "true" || planRes.success === true) {
      // Bước 3: Chuyển sang trang Roadmap (Ảnh 2 bạn gửi)
      navigate(`/plan/${planRes.data.planId}`);
    }
  } catch (err) {
    alert("Lỗi xử lý tài liệu. Vui lòng thử lại.");
  } finally {
    setIsUploading(false);
  }
};
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-500">
      <div className="max-w-2xl w-full bg-[#1e293b] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800">
        
        {/* --- Header Section (Màu tím xanh đặc trưng) --- */}
        <div className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] p-10 text-center relative">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Tạo Khóa Học Từ Tài Liệu</h1>
          <p className="text-indigo-100 text-sm mt-2 font-medium opacity-90">
            Tải lên giáo trình, sách hoặc bài giảng để AI tạo khóa học tự động
          </p>
        </div>

        {/* --- Body Section --- */}
        <div className="p-8 lg:p-12 space-y-8">
          
          {/* Upload Dropzone */}
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
                <p className="text-emerald-500/60 text-xs mt-1 font-black uppercase">Sẵn sàng phân tích</p>
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
                <h3 className="text-white font-black text-xl mb-2 tracking-tight">Chọn file để tải lên</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em]">
                  Hỗ trợ PDF, DOCX, TXT (Tối đa 10MB)
                </p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              onClick={handleAnalyze}
              disabled={!selectedFile || isUploading}
              className={`w-full py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98]
                ${!selectedFile || isUploading
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-[#8d94a5] hover:bg-[#9da4b5] text-[#1e293b]'
                }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Đang phân tích...</span>
                </>
              ) : (
                <>
                  <span>Phân Tích & Tạo Khóa Học</span>
                </>
              )}
            </button>

            <button 
              onClick={() => navigate(-1)}
              className="w-full py-4 text-slate-400 font-bold flex items-center justify-center gap-2 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              Quay lại
            </button>
          </div>
        </div>

        {/* Tip section */}
        <div className="bg-slate-900/50 p-6 border-t border-slate-800 flex items-center justify-center gap-3">
           <Sparkles size={16} className="text-purple-400" />
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
             AI sẽ tự động tách chương và tạo câu hỏi từ nội dung bạn nộp
           </p>
        </div>

      </div>
    </div>
  );
};

export default CreatePlanFromDoc;
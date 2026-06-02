import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  FileText, Download, Trash2, Clock, 
  Eye, X, FileSearch, Loader2, Sparkles 
} from 'lucide-react';

const Documents = () => {
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Trạng thái xem: 'text' (Văn bản AI đọc) hoặc 'original' (File gốc PDF/Word)
  const [viewMode, setViewMode] = useState<'text' | 'original'>('text');

  useEffect(() => { 
    fetchDocs(); 
  }, []);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await api.file.getMyDocs();
      if (res.success) setDocs(res.data);
    } catch (error) {
      console.error("Lỗi lấy tài liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Xóa tài liệu này sẽ làm mất dữ liệu hỗ trợ AI cho các câu hỏi liên quan. Xác nhận xóa?")) {
      try {
        const res = await api.file.deleteDocument(id);
        if (res.success) fetchDocs();
      } catch (error) {
        alert("Không thể xóa tài liệu lúc này.");
      }
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 text-white min-h-screen bg-[#0f172a] animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight flex items-center gap-3">
          <FileText className="text-blue-500" size={32} /> Kho tài liệu của tôi
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Quản lý các nguồn tri thức dùng để thiết kế lộ trình và huấn luyện trợ lý AI.
        </p>
      </header>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={40} />
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Đang truy xuất kho dữ liệu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          
          
          {docs.map((doc) => (
  <div 
    key={doc._id} 
    className="bg-[#1e293b] p-5 lg:p-6 rounded-[2rem] border border-slate-800 flex items-center justify-between group hover:border-blue-500/40 transition-all shadow-lg"
  >
    {/* ĐÂY CHÍNH LÀ NƠI BẠN CẦN SỬA: */}
    <div 
      className="flex items-center gap-5 cursor-pointer flex-1"
      onClick={() => {
        // --- THÊM DÒNG NÀY ĐỂ KIỂM TRA ---
        console.log("🔍 Dữ liệu tài liệu đang chọn:", doc); 
        console.log("🔗 Link file (fileUrl):", doc.fileUrl);
        // ---------------------------------

        setSelectedDoc(doc);
        setViewMode('text'); // Mặc định mở tab văn bản khi nhấn vào
      }}
    >



                <div className="p-4 bg-slate-800 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                  <FileText size={24}/>
                </div>
                <div>
                  <p className="text-lg font-bold group-hover:text-blue-400 transition-colors line-clamp-1">{doc.title}</p>

                  
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-slate-500 text-[10px] font-black uppercase flex items-center gap-1">
                      <Clock size={12}/> {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-blue-500/50 text-[10px] font-black uppercase tracking-tighter">
                      {doc.fileUrl?.split('.').pop()?.toUpperCase() || 'DOC'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleDownload(doc.fileUrl)}
                  className="p-3 bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all"
                  title="Tải về"
                >
                  <Download size={20}/>
                </button>
                <button 
                  onClick={() => handleDelete(doc._id)}
                  className="p-3 bg-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Xóa vĩnh viễn"
                >
                  <Trash2 size={20}/>
                </button>
              </div>
            </div>
          ))}






          {docs.length === 0 && (
            <div className="py-24 text-center bg-[#1e293b]/30 rounded-[3rem] border-2 border-dashed border-slate-800">
               <FileSearch className="mx-auto mb-4 text-slate-700" size={64} />
               <p className="text-slate-500 font-bold italic">Kho tài liệu đang trống.</p>
               <button onClick={() => window.location.href='/create-plan'} className="mt-4 text-blue-500 text-xs font-black uppercase tracking-widest hover:underline">
                 Tải tài liệu đầu tiên ngay
               </button>
            </div>
          )}
        </div>
      )}

      {/* --- MODAL XEM CHI TIẾT TÀI LIỆU --- */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#1e293b] w-full max-w-6xl h-full rounded-[3rem] border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            
            {/* Header Modal */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#1e293b]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
                  <FileText size={24} className="text-white"/>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white max-w-md truncate">{selectedDoc.title}</h3>
                  <div className="flex gap-6 mt-2">
                     <button 
                      onClick={() => setViewMode('text')}
                      className={`text-[10px] font-black uppercase tracking-[0.2em] pb-1 transition-all ${viewMode === 'text' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}
                     >
                       Văn bản trích xuất
                     </button>
                     <button 
                      onClick={() => setViewMode('original')}
                      className={`text-[10px] font-black uppercase tracking-[0.2em] pb-1 transition-all ${viewMode === 'original' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}
                     >
                       Tài liệu gốc (Bản in)
                     </button>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="p-3 hover:bg-slate-800 rounded-full text-slate-500 transition-all"><X size={24}/></button>
            </div>
            
            {/* NỘI DUNG HIỂN THỊ TRONG MODAL */}
<div className="flex-1 overflow-hidden bg-[#0f172a] relative">
  {viewMode === 'text' ? (
    <div className="h-full overflow-y-auto p-8 lg:p-16 custom-scrollbar">
       <div className="max-w-4xl mx-auto">
          <pre className="text-slate-300 whitespace-pre-wrap font-sans leading-relaxed text-base lg:text-lg">
            {selectedDoc.content || "Không có nội dung văn bản."}
          </pre>
       </div>
    </div>
  ) : (
    /* CHẾ ĐỘ XEM TÀI LIỆU GỐC */
    <div className="h-full w-full bg-slate-900">
      {/* 
         BẢO VỆ: Kiểm tra fileUrl tồn tại trước khi xử lý chuỗi để tránh màn hình trắng 
      */}
      {selectedDoc?.fileUrl ? (
        (() => {
          const url = selectedDoc.fileUrl.toLowerCase();
          
          // Trường hợp 1: File PDF
          if (url.includes('.pdf')) {
            return (
              <iframe 
                src={`${selectedDoc.fileUrl}#toolbar=0&navpanes=0`} 
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            );
          }
          
          // Trường hợp 2: File Word / Excel / PowerPoint
          if (url.match(/\.(docx|doc|pptx|xlsx)$/) || url.includes('/raw/upload/')) {
            return (
              <iframe 
                // Sử dụng Google Docs Viewer làm dự phòng nếu Microsoft Office Viewer bị chặn
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedDoc.fileUrl)}&embedded=true`}
                className="w-full h-full border-none"
                title="Office Preview"
              />
            );
          }

          // Trường hợp 3: Không nhận diện được định dạng
          return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <FileSearch size={48} className="text-slate-700" />
              <p className="text-slate-400">Định dạng này cần được tải về để xem.</p>
              <button 
                onClick={() => window.open(selectedDoc.fileUrl, '_blank')}
                className="text-blue-500 underline font-bold"
              >
                Mở trong tab mới
              </button>
            </div>
          );
        })()
      ) : (
        <div className="h-full flex items-center justify-center text-slate-500">
          Không tìm thấy liên kết tệp tin.
        </div>
      )}
    </div>
  )}
</div>

            {/* Footer Modal */}
            <div className="p-6 border-t border-slate-800 bg-[#1e293b] flex justify-between items-center px-10">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden md:block">
                  Hệ thống trích xuất tri thức AI Buddy
              </p>
              <div className="flex gap-3 w-full md:w-auto">
                <button onClick={() => setSelectedDoc(null)} className="flex-1 md:flex-none px-8 py-3 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition-all">Đóng</button>
                <button 
                  onClick={() => handleDownload(selectedDoc.fileUrl)}
                  className="flex-1 md:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                >
                  <Download size={18}/> Tải xuống bản gốc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
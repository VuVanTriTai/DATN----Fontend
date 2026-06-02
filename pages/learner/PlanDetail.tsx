import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  BookOpen, UploadCloud, Award, Share2, 
  ChevronRight, Calendar, CheckCircle, Lock, 
  PlayCircle, UserCheck, BarChart3, 
  FileText, Trash2, Download, RefreshCw, X, Search, Info, Star, Target, Loader2, GraduationCap
} from 'lucide-react';

const PlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States quản lý dữ liệu
  const [plan, setPlan] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [resultsData, setResultsData] = useState<any>(null);
  
  // States quản lý UI
  const [activeTab, setActiveTab] = useState('study');
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
    fetchInstructors();
  }, [id]);

  // Tự động tải dữ liệu Thành tích khi chuyển Tab
  useEffect(() => {
    if (activeTab === 'result') {
      fetchResults();
    }
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.plan.getDetail(id!);
      if (res.success) {
        setPlan(res.data.plan);
        setLessons(res.data.lessons);
      }
    } catch (err) {
      console.error("Lỗi lấy chi tiết lộ trình:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await api.auth.getInstructors();
      setInstructors(res.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchResults = async () => {
    try {
      const res = await api.plan.getResults(id!);
      if (res.success) setResultsData(res.data);
    } catch (err) { console.error("Lỗi tải thành tích:", err); }
  };

  const filteredInstructors = instructors.filter(ins => {
    const fullName = ins.fullName ? ins.fullName.toLowerCase() : "";
    const email = ins.email ? ins.email.toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  const handleDeletePlan = async () => {
    if (window.confirm("Xác nhận xóa lộ trình? Hành động này không thể hoàn tác.")) {
      setIsDeleting(true);
      try {
        await api.plan.delete(id!);
        navigate('/dashboard');
      } catch (err) {
        alert("Lỗi khi xóa");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleChangeInstructor = async (instructorId: string) => {
    try {
      const res = await api.plan.updateInstructor(id!, instructorId);
      if (res.success) {
        alert("Đã cập nhật người hướng dẫn!");
        setShowInstructorModal(false);
        setSearchTerm("");
        loadData();
      }
    } catch (err) { alert("Lỗi cập nhật"); }
  };

  const getFocusLabel = (f: string) => f === 'practical' ? 'Thực hành ứng dụng' : 'Lý thuyết hệ thống';
  const getDepthLabel = (d: string) => d === 'advanced' ? 'Nghiên cứu chuyên sâu' : 'Tiếp cận cơ bản';

  if (loading) return (
    <div className="h-screen bg-[#0f172a] flex items-center justify-center">
      <RefreshCw className="animate-spin text-blue-500 w-10 h-10" />
    </div>
  );

  if (!plan) return <div className="p-10 text-white text-center">Lộ trình không tồn tại.</div>;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 text-white animate-in fade-in duration-700">
      
      {/* --- HEADER: Thông tin tổng quan --- */}
      <div className="relative p-10 rounded-[3rem] bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10"><BarChart3 size={120} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-6 flex-1">
            <div className="flex flex-wrap gap-3">
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${plan.learningFocus === 'practical' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                {getFocusLabel(plan.learningFocus)}
              </span>
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${plan.learningDepth === 'advanced' ? 'bg-purple-600' : 'bg-emerald-600'}`}>
                {getDepthLabel(plan.learningDepth)}
              </span>
              <span className="bg-slate-800/80 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black text-slate-300 flex items-center gap-2 border border-slate-700">
                <Calendar size={12}/> {plan.duration} NGÀY HỌC
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight max-w-3xl">{plan.title}</h1>
            
            {/* Người hướng dẫn Card */}
            <div className="flex items-center gap-4 bg-white/5 w-fit p-3 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
                  {plan.instructorId?.fullName ? plan.instructorId.fullName[0].toUpperCase() : 'AI'}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Người hướng dẫn</p>
                  <p className="text-sm font-bold text-blue-400">
                    {plan.instructorId?.fullName ? `GV. ${plan.instructorId.fullName}` : "Chế độ Tự học"}
                  </p>
                </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowInstructorModal(true)} className="p-4 bg-slate-800 hover:bg-blue-600 rounded-2xl border border-slate-700 transition-all shadow-lg group">
              <RefreshCw size={20} className="text-blue-400 group-hover:text-white" />
            </button>
            <button onClick={handleDeletePlan} disabled={isDeleting} className="p-4 bg-red-500/10 hover:bg-red-600 rounded-2xl border border-red-500/20 transition-all shadow-lg group">
              <Trash2 size={20} className="text-red-500 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex flex-wrap gap-3 bg-[#1e293b]/50 p-2 rounded-[1.5rem] border border-slate-800 w-fit">
        {[
          { id: 'study', label: 'Bài học', icon: <BookOpen size={18}/> },
          { id: 'document', label: 'Tài liệu gốc', icon: <FileText size={18}/> },
          ...(plan.instructorId ? [{ id: 'assignment', label: 'Bài tập', icon: <UploadCloud size={18}/> }] : []),
          { id: 'result', label: 'Thành tích', icon: <Award size={18}/> },
          { id: 'share', label: 'Chia sẻ', icon: <Share2 size={18}/> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all
              ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* --- CONTENT --- */}
      <div className="min-h-[400px]">
        {/* TAB BÀI HỌC */}
        {activeTab === 'study' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            {/* Banner: Giáo viên đã gửi bản chỉnh sửa */}
            {plan.status === 'reviewed' && (
              <div className="relative p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 flex items-start gap-4 overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 80% 50%, #10b981, transparent)' }} />
                <div className="p-3 bg-emerald-500/20 rounded-2xl shrink-0">
                  <GraduationCap className="text-emerald-400" size={24} />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">✅ Giáo viên gửi</p>
                  <p className="font-bold text-white text-sm">Giáo viên đã xem xét và gửi bản chỉnh sửa hoàn chỉnh cho lộ trình học của bạn.</p>
                  <p className="text-xs text-slate-400 mt-1">Nội dung bài học dưới đây đã được cập nhật. Hãy tiếp tục học để khám phá các thay đổi mới!</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {lessons.map((lesson) => (
              <div 
                key={lesson._id}
                onClick={() => lesson.status !== 'locked' && navigate(`/plan/${id}/lesson/${lesson.dayNumber}`)}
                className={`group relative p-6 rounded-[2.5rem] border transition-all cursor-pointer h-56 flex flex-col justify-between
                  ${lesson.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/30' : 
                    lesson.status === 'locked' ? 'bg-slate-900/50 border-slate-800 opacity-50 grayscale cursor-not-allowed' : 
                    'bg-[#1e293b] border-slate-800 hover:border-blue-500/50'}`}
              >
                 <div className="flex justify-between items-center">
                     <div className={`p-2.5 rounded-2xl ${lesson.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-blue-400'}`}>
                       {lesson.status === 'completed' ? <CheckCircle size={20}/> : lesson.status === 'locked' ? <Lock size={20}/> : <PlayCircle size={20}/>}
                     </div>
                     <span className="text-[10px] font-black text-slate-500 uppercase">Ngày {lesson.dayNumber}</span>
                 </div>
                 <h3 className="font-bold text-sm line-clamp-2 group-hover:text-blue-400">{lesson.title}</h3>
                 <div className="flex justify-end pt-2"><div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-all"><ChevronRight size={14} className="text-white"/></div></div>
              </div>
            ))}
          </div>
          </div>
        )}

        {/* TAB TÀI LIỆU GỐC */}
        {activeTab === 'document' && (
          <div className="bg-[#1e293b]/50 p-10 rounded-[3rem] border border-slate-800 space-y-6 animate-in fade-in">
             <div className="flex items-center justify-between text-white">
                <h3 className="text-2xl font-black italic">Hồ sơ tài liệu trích xuất</h3>
                {plan.documentId?.fileUrl && (
                  <a href={plan.documentId.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 font-bold hover:underline bg-blue-400/10 px-4 py-2 rounded-xl border border-blue-400/20">
                    <Download size={18}/> Tải tệp bản gốc
                  </a>
                )}
             </div>
             <div className="p-8 bg-slate-900/50 rounded-[2rem] border border-slate-800 text-slate-400 text-sm leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap custom-scrollbar">
                {plan.documentId?.content || "Không có nội dung văn bản."}
             </div>
          </div>
        )}

        {/* TAB THÀNH TÍCH (BẢN ĐẦY ĐỦ) */}
        {activeTab === 'result' && (
          <div className="space-y-10 animate-in fade-in zoom-in duration-500 pb-20">
            {resultsData ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2rem] text-center space-y-2">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Tiến độ tổng quát</p>
                    <p className="text-4xl font-black">{resultsData.summary.overallProgress}%</p>
                  </div>
                  <div className="bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-[2rem] text-center space-y-2">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Điểm TB Quiz</p>
                    <p className="text-4xl font-black">{resultsData.summary.averageScore}</p>
                  </div>
                  <div className="bg-purple-600/10 border border-purple-500/20 p-6 rounded-[2rem] text-center space-y-2">
                    <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Đánh giá Trình độ</p>
                    <p className="text-xl font-black mt-2 text-purple-200">{resultsData.summary.currentLevel}</p>
                  </div>
                  <div className="bg-amber-600/10 border border-amber-500/20 p-6 rounded-[2rem] text-center space-y-2">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Số bài hoàn tất</p>
                    <p className="text-4xl font-black">{resultsData.summary.completedCount}/{resultsData.summary.totalLessons}</p>
                  </div>
                </div>

                <div className="bg-[#1e293b] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
                  <div className="p-8 border-b border-slate-800 flex items-center gap-3">
                    <Award className="text-yellow-500" />
                    <h3 className="text-xl font-black italic">Bảng theo dõi năng lực chi tiết</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                          <th className="p-6">Ngày</th>
                          <th className="p-6">Chủ đề kiến thức</th>
                          <th className="p-6">Kết quả đạt được</th>
                          <th className="p-6">AI Assessment</th>
                          <th className="p-6 text-center">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {resultsData.detailedResults.map((res: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-6 font-black text-slate-600">#{res.dayNumber}</td>
                            <td className="p-6 font-bold text-slate-200">{res.title}</td>
                            <td className="p-6">
                              <div className="flex items-center gap-3">
                                <div className="w-24 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                  <div className={`h-full transition-all ${res.score >= 80 ? 'bg-emerald-500' : res.score >= 50 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${res.score}%` }} />
                                </div>
                                <span className="text-xs font-black">{res.score}đ</span>
                              </div>
                            </td>
                            <td className="p-6 text-[10px] font-black uppercase">
                               <span className={`px-2 py-1 rounded-lg ${res.status === 'EXPERT' ? 'text-emerald-500 bg-emerald-500/10' : res.status === 'BEGINNER' ? 'text-red-400 bg-red-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                                  {res.status.replace("_", " ")}
                               </span>
                            </td>
                            <td className="p-6 text-center">
                              {res.isCompleted ? <CheckCircle className="mx-auto text-emerald-500" size={18}/> : <Lock className="mx-auto text-slate-700" size={18}/>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>
            )}
          </div>
        )}
      </div>

      {/* --- MODAL CHỌN GIÁO VIÊN --- */}
      {showInstructorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e293b] w-full max-w-md rounded-[3rem] p-10 border border-slate-700 shadow-2xl space-y-6 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center">
              <div><h3 className="text-2xl font-black">Tìm giảng viên</h3><p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Mentor Selection</p></div>
              <button onClick={() => setShowInstructorModal(false)}><X/></button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="text" placeholder="Nhập tên hoặc email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#0f172a] border border-slate-700 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" autoFocus />
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              <button onClick={() => handleChangeInstructor("")} className="w-full p-5 bg-slate-900/50 hover:bg-slate-800 rounded-3xl border border-dashed border-slate-700 text-left text-sm font-bold text-slate-500 flex items-center gap-3 transition-all"><X size={18}/> Không chọn (Tự học)</button>
              {filteredInstructors.map(ins => (
                <div key={ins._id} onClick={() => handleChangeInstructor(ins._id)} className="w-full p-5 bg-[#0f172a] hover:bg-blue-600/10 rounded-3xl border border-slate-800 hover:border-blue-500 cursor-pointer transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-black">{ins.fullName[0].toUpperCase()}</div>
                    <div><p className="font-bold">{ins.fullName}</p><p className="text-[10px] text-slate-500 font-bold">{ins.email}</p></div>
                  </div>
                  <UserCheck size={20} className="text-slate-700 group-hover:text-blue-500"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDetail;
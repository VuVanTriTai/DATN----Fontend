import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Save, Send, ArrowLeft, BookOpen,
  CheckCircle, Loader2, MessageSquare,
  Plus, Trash2, Star, ListChecks, Edit3, HelpCircle, Video, FileText
} from 'lucide-react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const StudentPlanView = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // Tab: content | important | quiz
  const [uploadingAssignment, setUploadingAssignment] = useState(false);
  const [uploadingSolution, setUploadingSolution] = useState(false);
  // --- MODAL LƯU ---
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [draftLessonIds, setDraftLessonIds] = useState<Set<string>>(new Set()); // Theo dõi bài đã tạo bản nháp

  useEffect(() => {
    fetchData();
  }, [planId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.instructor.getCourseStats(planId!);
      if (res.success) {
        setData(res.data);
        if (res.data.lessons?.length > 0) setSelectedLesson(res.data.lessons[0]);
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal chọn cách lưu
  const handleSaveLesson = () => {
    if (!selectedLesson) return;
    setShowSaveModal(true);
  };

  // Lựa chọn 1: Ghi đè lên khóa học cũ
  const handleOverwrite = async () => {
    if (!selectedLesson) return;
    setShowSaveModal(false);
    setIsSaving(true);
    try {
      await api.instructor.updateLesson(selectedLesson._id, selectedLesson);
      const updatedLessons = data.lessons.map((l: any) =>
        l._id === selectedLesson._id ? selectedLesson : l
      );
      setData({ ...data, lessons: updatedLessons });
      alert('✅ Đã ghi đè khóa học thành công!');
    } catch (e) {
      alert('❌ Lỗi khi ghi đè bài học');
    } finally {
      setIsSaving(false);
    }
  };

  // Lựa chọn 2: Lưu thành bản khác (Clone khóa học)
  const handleSaveAsNew = async () => {
    if (!selectedLesson) return;
    setShowSaveModal(false);
    setIsSaving(true);
    try {
      // Gọi API clone plan (sử dụng selectedLesson nhưng thêm planId rõ ràng)
      await (api.instructor as any).saveLessonDraft(selectedLesson._id, {
        ...selectedLesson,
        planId: planId
      });
      alert('💾 Đã tạo một bản sao khóa học mới với các thay đổi vào kho của bạn!');
    } catch (e) {
      alert('❌ Lỗi khi lưu bản sao');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendBack = async () => {
    if (window.confirm('🚀 Xác nhận gửi bản chỉnh sửa hoàn chỉnh cho học viên?\nTất cả bản nháp sẽ được hợp nhất vào lộ trình.')) {
      setIsSending(true);
      try {
        await api.instructor.sendBackToStudent(planId!);
        alert('✅ Đã gửi thành công! Học viên sẽ thấy bản chỉnh sửa trong mục lộ trình học.');
        navigate('/instructor/courses');
      } catch (e) {
        alert('❌ Lỗi khi gửi dữ liệu');
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, type: 'assignment' | 'solution') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (type === 'assignment') setUploadingAssignment(true);
      else setUploadingSolution(true);

      const res = await api.file.upload(file);
      if (res.success) {
        if (type === 'assignment') {
          setSelectedLesson({ ...selectedLesson, assignmentUrl: res.fileUrl });
        } else {
          setSelectedLesson({ ...selectedLesson, solutionUrl: res.fileUrl });
        }
      }
    } catch (err: any) {
      alert("Lỗi upload file: " + (err?.response?.data?.message || err.message));
    } finally {
      if (type === 'assignment') setUploadingAssignment(false);
      else setUploadingSolution(false);
    }
  };

  // Logic xử lý "Kiến thức trọng tâm"
  const handleUpdateNote = (index: number, val: string) => {
    const newNotes = [...(selectedLesson.importantNotes || [])];
    newNotes[index] = val;
    setSelectedLesson({ ...selectedLesson, importantNotes: newNotes });
  };

  const addNote = () => {
    const newNotes = [...(selectedLesson.importantNotes || []), ""];
    setSelectedLesson({ ...selectedLesson, importantNotes: newNotes });
  };

  const removeNote = (index: number) => {
    const newNotes = (selectedLesson.importantNotes || []).filter((_: any, i: number) => i !== index);
    setSelectedLesson({ ...selectedLesson, importantNotes: newNotes });
  };

  // ✅ FIX: Logic xử lý Quiz — dùng quizPool (trường học sinh thực tế dùng)
  const handleUpdateQuiz = (qIdx: number, field: string, value: any) => {
    const updatedPool = [...(selectedLesson.quizPool || [])];
    updatedPool[qIdx] = { ...updatedPool[qIdx], [field]: value };
    setSelectedLesson({ ...selectedLesson, quizPool: updatedPool });
  };

  const addQuiz = () => {
    const newQuestion = {
      question: "Câu hỏi mới là gì?",
      options: ["Lựa chọn 1", "Lựa chọn 2", "Lựa chọn 3", "Lựa chọn 4"],
      correctAnswer: 0,
      explanation: "Giải thích đáp án...",
      difficulty: "medium",
      bloomLevel: "Thông hiểu"
    };
    setSelectedLesson({
      ...selectedLesson,
      quizPool: [...(selectedLesson.quizPool || []), newQuestion]
    });
  };

  const removeQuiz = (index: number) => {
    const newPool = (selectedLesson.quizPool || []).filter((_: any, i: number) => i !== index);
    setSelectedLesson({ ...selectedLesson, quizPool: newPool });
  };


  if (loading) return (
    <div className="h-screen bg-[#0f172a] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden">

      {/* --- SIDEBAR TRÁI --- */}
      <div className="w-80 border-r border-slate-800 bg-[#1e293b]/30 flex flex-col p-6 space-y-6">
        <button
          onClick={() => navigate('/instructor/courses')}
          className="flex items-center gap-2 text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all"
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-blue-400 line-clamp-1">{data?.planTitle}</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Học viên: {data?.studentName}</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {data?.lessons?.map((l: any) => (
            <button
              key={l._id}
              onClick={() => setSelectedLesson(l)}
              className={`w-full p-4 rounded-2xl text-left transition-all border ${selectedLesson?._id === l._id ? 'bg-blue-600 border-blue-500 shadow-lg' : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-black uppercase opacity-60">Ngày {l.dayNumber}</p>
              </div>
              <p className="text-sm font-bold truncate">{l.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* --- VÙNG BIÊN TẬP PHẢI --- */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Editor Toolbar */}
        <div className="p-6 border-b border-slate-800 bg-[#1e293b]/20 flex justify-between items-center">
          <div className="flex gap-2">
            {[
              { id: 'content', label: '1. Soạn nội dung', icon: <Edit3 size={16} /> },
              { id: 'important', label: '2. Trọng tâm', icon: <Star size={16} /> },
              { id: 'quiz', label: '3. Trắc nghiệm', icon: <ListChecks size={16} /> },
              { id: 'video', label: '4. Video', icon: <Video size={16} /> },
              { id: 'assignment', label: '5. Bài tập', icon: <FileText size={16} /> },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === t.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleSaveLesson}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl font-black flex items-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50 relative"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Lưu bài học
          </button>
        </div>

        {/* Modal Lưu */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 max-w-sm w-full space-y-4">
              <h3 className="font-black text-xl">Lưu bài học</h3>
              <p className="text-sm text-slate-400">Bạn muốn lưu bài học này như thế nào?</p>
              <button onClick={handleOverwrite} className="w-full bg-blue-600 p-4 rounded-xl font-bold hover:bg-blue-500 transition-all">Ghi đè</button>
              <button onClick={handleSaveAsNew} className="w-full bg-slate-800 p-4 rounded-xl font-bold hover:bg-slate-700 transition-all">Lưu thành bản khác</button>
              <button onClick={() => setShowSaveModal(false)} className="w-full text-slate-500 py-2 hover:text-white transition-all">Hủy</button>
            </div>
          </div>
        )}

        {/* Editor Body */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {selectedLesson ? (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">

              {/* --- TAB: NỘI DUNG HỌC --- */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Tóm tắt ngắn (Summary)</label>
                    <textarea
                      className="w-full bg-[#1e293b] border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 outline-none focus:border-blue-500 transition-all"
                      rows={2}
                      value={selectedLesson.summary || ""}
                      onChange={(e) => setSelectedLesson({ ...selectedLesson, summary: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Bài giảng chi tiết (Markdown)</label>
                    <div className="rounded-2xl border border-slate-800 overflow-hidden bg-[#1e293b]">
                      <SimpleMDE
                        value={selectedLesson.content || ""}
                        onChange={(val: string) => setSelectedLesson({ ...selectedLesson, content: val })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB: KIẾN THỨC TRỌNG TÂM --- */}
              {activeTab === 'important' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black flex items-center gap-2"><Star className="text-yellow-500" size={20} /> Kiến thức then chốt</h3>
                    <button onClick={addNote} className="bg-slate-800 hover:bg-blue-600 p-2 rounded-lg text-blue-400 hover:text-white transition-all"><Plus size={20} /></button>
                  </div>
                  <div className="grid gap-3">
                    {selectedLesson.importantNotes?.map((note: string, idx: number) => (
                      <div key={idx} className="flex gap-3 group animate-in slide-in-from-right">
                        <div className="flex-1 relative">
                          <span className="absolute -left-8 top-4 text-[10px] font-black text-slate-600">{idx + 1}</span>
                          <input
                            className="w-full bg-[#1e293b] border border-slate-800 p-4 rounded-xl text-sm focus:border-yellow-500 outline-none transition-all"
                            value={note}
                            onChange={(e) => handleUpdateNote(idx, e.target.value)}
                          />
                        </div>
                        <button onClick={() => removeNote(idx)} className="p-4 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- TAB: TRẮC NGHIỆM --- */}
              {activeTab === 'quiz' && (
                <div className="space-y-8 pb-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-black flex items-center gap-2">
                        <ListChecks className="text-emerald-500" size={24} />
                        Hệ thống câu hỏi trắc nghiệm
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        ✅ Đang chỉnh sửa <strong className="text-emerald-400">quizPool</strong> — bộ câu hỏi học sinh thực tế đang dùng ({(selectedLesson.quizPool || []).length} câu)
                      </p>
                    </div>
                    <button
                      onClick={addQuiz}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-all"
                    >
                      <Plus size={18} /> Thêm câu hỏi
                    </button>
                  </div>

                  <div className="grid gap-8">
                    {(selectedLesson.quizPool || []).map((q: any, qIdx: number) => (
                      <div key={qIdx} className="bg-[#1e293b]/50 rounded-[2.5rem] border border-slate-800 p-8 space-y-6 relative group animate-in slide-in-from-bottom-4">
                        <button onClick={() => removeQuiz(qIdx)} className="absolute top-6 right-6 p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>

                        {/* Câu hỏi + badge độ khó */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Câu hỏi {qIdx + 1}</label>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${q.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                                q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-emerald-500/20 text-emerald-400'
                              }`}>{q.difficulty || 'medium'}</span>
                            {/* Độ khó selector */}
                            <select
                              value={q.difficulty || 'medium'}
                              onChange={(e) => handleUpdateQuiz(qIdx, 'difficulty', e.target.value)}
                              className="ml-auto text-[10px] bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2 py-1 outline-none"
                            >
                              <option value="easy">🟢 Dễ</option>
                              <option value="medium">🟡 Trung bình</option>
                              <option value="hard">🔴 Khó</option>
                            </select>
                          </div>
                          <textarea
                            className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl p-4 text-lg font-bold text-white outline-none focus:border-blue-500"
                            rows={2} value={q.question}
                            onChange={(e) => handleUpdateQuiz(qIdx, 'question', e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(q.options || []).map((opt: string, oIdx: number) => (
                            <div key={oIdx} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${q.correctAnswer === oIdx ? 'bg-emerald-500/5 border-emerald-500/50' : 'bg-[#0f172a] border-slate-800'}`}>
                              <button
                                onClick={() => handleUpdateQuiz(qIdx, 'correctAnswer', oIdx)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${q.correctAnswer === oIdx ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700'}`}
                              >
                                {q.correctAnswer === oIdx && <CheckCircle size={14} className="text-white" />}
                              </button>
                              <input
                                className="bg-transparent flex-1 text-sm font-medium outline-none"
                                value={opt}
                                onChange={(e) => {
                                  const newOptions = [...(q.options || [])];
                                  newOptions[oIdx] = e.target.value;
                                  handleUpdateQuiz(qIdx, 'options', newOptions);
                                }}
                              />
                              {q.correctAnswer === oIdx && <CheckCircle size={14} className="text-emerald-400 shrink-0" />}
                            </div>
                          ))}
                        </div>

                        <div className="p-4 bg-slate-900/50 rounded-xl space-y-2">
                          <label className="text-[10px] font-black text-amber-500 uppercase flex items-center gap-2"><Star size={12} fill="currentColor" /> Giải thích đáp án</label>
                          <textarea
                            className="w-full bg-transparent text-sm text-slate-400 outline-none italic"
                            rows={2} value={q.explanation || ""}
                            onChange={(e) => handleUpdateQuiz(qIdx, 'explanation', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    {(!selectedLesson.quizPool || selectedLesson.quizPool.length === 0) && (
                      <div className="py-10 text-center text-slate-600"><HelpCircle className="mx-auto mb-2 opacity-20" size={40} /><p>Chưa có câu hỏi nào trong quizPool.</p><p className="text-xs mt-1 opacity-60">Nhấn "Thêm câu hỏi" để bắt đầu hoặc đợi học sinh tạo khoá học.</p></div>
                    )}
                  </div>
                </div>
              )}

              {/* --- TAB: VIDEO --- */}
              {activeTab === 'video' && (
                <div className="space-y-8 pb-10 animate-in fade-in">
                  <h3 className="text-xl font-black flex items-center gap-2 text-purple-400">
                    <Video size={24} /> Video Bài Giảng
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Video Bài giảng (Link YouTube)</label>
                      <input
                        className="w-full bg-[#1e293b] border border-slate-800 p-4 rounded-xl text-sm outline-none focus:border-blue-500 transition-all text-white"
                        placeholder="Ví dụ: https://www.youtube.com/watch?v=..."
                        value={selectedLesson.videoUrl || ""}
                        onChange={(e) => setSelectedLesson({ ...selectedLesson, videoUrl: e.target.value })}
                      />
                      <p className="text-xs text-slate-500 ml-2 mt-1">Học viên có thể xem video này trực tiếp trong bài học.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB: BÀI TẬP --- */}
              {activeTab === 'assignment' && (
                <div className="space-y-8 pb-10 animate-in fade-in">
                  <h3 className="text-xl font-black flex items-center gap-2 text-blue-400">
                    <FileText size={24} /> Đề bài & Đáp án
                  </h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center justify-between">
                        <span>Link file Đề bài / Bài tập</span>
                        <label className="text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1">
                          {uploadingAssignment ? <Loader2 size={12} className="animate-spin" /> : null}
                          <input type="file" className="hidden" onChange={(e) => handleUploadFile(e, 'assignment')} />
                          Hoặc tải file lên
                        </label>
                      </label>
                      <input
                        className="w-full bg-[#1e293b] border border-slate-800 p-4 rounded-xl text-sm outline-none focus:border-blue-500 transition-all text-white"
                        placeholder="Ví dụ: Link Google Drive, Dropbox, hoặc dán link vào đây..."
                        value={selectedLesson.assignmentUrl || ""}
                        onChange={(e) => setSelectedLesson({ ...selectedLesson, assignmentUrl: e.target.value })}
                      />
                      <p className="text-xs text-slate-500 ml-2 mt-1">Học viên sẽ tải file này về để làm bài.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center justify-between">
                        <span>Link file Lời giải / Đáp án</span>
                        <label className="text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1">
                          {uploadingSolution ? <Loader2 size={12} className="animate-spin" /> : null}
                          <input type="file" className="hidden" onChange={(e) => handleUploadFile(e, 'solution')} />
                          Hoặc tải file lên
                        </label>
                      </label>
                      <input
                        className="w-full bg-[#1e293b] border border-slate-800 p-4 rounded-xl text-sm outline-none focus:border-blue-500 transition-all text-white"
                        placeholder="Ví dụ: Link file giải bài tập chi tiết..."
                        value={selectedLesson.solutionUrl || ""}
                        onChange={(e) => setSelectedLesson({ ...selectedLesson, solutionUrl: e.target.value })}
                      />
                      <p className="text-xs text-slate-500 ml-2 mt-1">Dùng để AI đối chiếu chấm điểm hoặc cho học viên xem sau khi nộp bài.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20">
              <BookOpen size={80} /><p className="font-black uppercase tracking-[0.3em] mt-4">Chọn bài học để bắt đầu</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#1e293b]/40 border-t border-slate-800 space-y-3">
          <button
            onClick={handleSendBack}
            disabled={isSending}
            className="w-full max-w-4xl mx-auto block py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
          >
            {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            Gửi bản chỉnh sửa hoàn chỉnh cho học viên
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPlanView;

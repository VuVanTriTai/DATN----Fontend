import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  LayoutGrid, UserPlus, Share2, Globe, 
  Trash2, X, Search, Send, User, Check, Loader2, UserCheck
} from 'lucide-react';
import { api } from '../../services/api';

const CATEGORIES = [
  { id: "lap_trinh", label: "Lập trình" },
  { id: "cntt", label: "CNTT & Phần mềm" },
  { id: "kinh_doanh", label: "Kinh doanh" },
  { id: "marketing", label: "Marketing" },
  { id: "thiet_ke", label: "Thiết kế" },
  { id: "ngoai_ngu", label: "Ngoại ngữ" },
  { id: "ky_nang_mem", label: "Kỹ năng mềm" },
  { id: "khoa_hoc", label: "Khoa học" },
  { id: "suc_khoe", label: "Y tế & Sức khỏe" },
  { id: "nghe_thuat", label: "Nghệ thuật" },
  { id: "khac", label: "Khác" }
];

const CourseActionMenu = ({ plan, onRefresh }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // States cho các Modals
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [showPrivateModal, setShowPrivateModal] = useState(false);
  const [showInstructorModal, setShowInstructorModal] = useState(false);

  // States cho Chọn giáo viên
  const [instructors, setInstructors] = useState<any[]>([]);
  const [instructorSearchTerm, setInstructorSearchTerm] = useState("");
  
  // States cho Chia sẻ cá nhân
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]); // Mảng chuỗi
  const [level, setLevel] = useState(plan.level || 'Medium');    // Chuỗi

  // States cho Market
  const [marketData, setMarketData] = useState({
    level: plan.level || 'Medium',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (catId: string) => {
    if (selectedCats.includes(catId)) {
      setSelectedCats(selectedCats.filter(id => id !== catId));
    } else {
      setSelectedCats([...selectedCats, catId]);
    }
  };

  // --- HÀM XỬ LÝ CHỌN GIÁO VIÊN ---
  React.useEffect(() => {
    if (showInstructorModal && instructors.length === 0) {
      api.auth.getInstructors().then(res => setInstructors(res.data)).catch(console.error);
    }
  }, [showInstructorModal]);

  const filteredInstructors = instructors.filter(i => 
    i.fullName.toLowerCase().includes(instructorSearchTerm.toLowerCase()) || 
    i.email.toLowerCase().includes(instructorSearchTerm.toLowerCase())
  );

  const handleChangeInstructor = async (instructorId: string) => {
    if (window.confirm("Lộ trình sẽ được sao chép và gửi cho Giáo viên mới. Bạn có muốn tiếp tục?")) {
      try {
        await api.plan.updateInstructor(plan._id, instructorId);
        alert("Đã gửi cho giáo viên thành công!");
        setShowInstructorModal(false);
        onRefresh();
      } catch (err) {
        alert("Có lỗi xảy ra khi cập nhật giáo viên.");
      }
    }
  };

  // --- HÀM XỬ LÝ CHIA SẺ CÁ NHÂN ---
  const handleSearchUser = async (e: React.MouseEvent) => {
  e.stopPropagation();
  // Xóa khoảng trắng thừa
  const cleanEmail = searchEmail.trim(); 
  if (!cleanEmail) return;

  setIsSearching(true);
  try {
    const res = await api.plan.searchUser(cleanEmail);
    if (res.success) setFoundUser(res.data);
    else setFoundUser(null);
  } catch (err) {
    alert("Không tìm thấy người dùng này!");
    setFoundUser(null);
  } finally {
    setIsSearching(false);
  }
};

  const handleSharePrivate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.plan.sharePrivate(plan._id, foundUser._id);
      alert(`Đã chia sẻ lộ trình cho ${foundUser.fullName}`);
      setShowPrivateModal(false);
      setFoundUser(null);
      setSearchEmail("");
    } catch (err) {
      alert("Lỗi khi chia sẻ.");
    }
  };

  // --- HÀM XỬ LÝ ĐĂNG MARKET ---
  const handlePostToMarket = async (e: any) => {
    e.stopPropagation();
    
    // Kiểm tra danh mục
    if (selectedCats.length === 0) {
      alert("Vui lòng chọn ít nhất 1 danh mục");
      return;
    }

    setIsSubmitting(true);
    try {
      // SỬA TẠI ĐÂY: Truy cập tags thông qua marketData.tags
      const tagArray = marketData.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== "");

      // Gọi API với cấu trúc dữ liệu chính xác
      const res = await api.plan.shareToMarket(plan._id, {
        categories: selectedCats, // Mảng danh mục đã chọn
        level: level,             // Mức độ đã chọn
        tags: tagArray            // Mảng tags đã xử lý
      });

      if (res.success) {
        alert("Đã đưa lên Market thành công!");
        setShowMarketModal(false);
        onRefresh();
      }
    } catch (error) {
      console.error("Lỗi đăng Market:", error);
      alert("Lỗi khi đăng bài, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- HÀM XỬ LÝ XÓA ---
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa lộ trình này không?")) {
      try {
        await api.plan.delete(plan._id);
        onRefresh();
      } catch (err) {
        alert("Lỗi khi xóa.");
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="p-3 bg-blue-600/20 hover:bg-blue-600 rounded-2xl text-blue-400 hover:text-white transition-all shadow-lg"
      >
        <LayoutGrid size={20}/>
      </button>

      {/* DROPDOWN MENU CHÍNH */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 mt-2 w-64 bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowInstructorModal(true); setIsOpen(false); }}
              className="w-full p-4 text-left text-sm font-bold flex items-center gap-3 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <UserPlus size={16} className="text-blue-400"/> Chọn giáo viên
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); setShowPrivateModal(true); setIsOpen(false); }}
              className="w-full p-4 text-left text-sm font-bold flex items-center gap-3 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <Share2 size={16} className="text-purple-400"/> Chia sẻ cho cá nhân
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); setShowMarketModal(true); setIsOpen(false); }}
              className="w-full p-4 text-left text-sm font-bold flex items-center gap-3 hover:bg-slate-800 text-slate-300 transition-colors border-b border-slate-700"
            >
              <Globe size={16} className="text-emerald-400"/> Đưa lên Market
            </button>

            <button 
              onClick={handleDelete}
              className="w-full p-4 text-left text-sm font-bold flex items-center gap-3 hover:bg-red-500/10 text-red-500 transition-colors"
            >
              <Trash2 size={16}/> Xóa lộ trình
            </button>
          </div>
        </>
      )}

      {/* --- MODAL CHỌN GIÁO VIÊN --- */}
      {showInstructorModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="bg-[#1e293b] w-full max-w-md rounded-[3rem] p-10 border border-slate-700 shadow-2xl space-y-6 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center">
              <div><h3 className="text-2xl font-black text-white">Tìm giảng viên</h3><p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Mentor Selection</p></div>
              <button onClick={() => setShowInstructorModal(false)} className="text-slate-400 hover:text-white"><X/></button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input type="text" placeholder="Nhập tên hoặc email..." value={instructorSearchTerm} onChange={(e) => setInstructorSearchTerm(e.target.value)} className="w-full bg-[#0f172a] border border-slate-700 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" autoFocus />
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              <button onClick={() => handleChangeInstructor("")} className="w-full p-5 bg-slate-900/50 hover:bg-slate-800 rounded-3xl border border-dashed border-slate-700 text-left text-sm font-bold text-slate-500 flex items-center gap-3 transition-all"><X size={18}/> Không chọn (Tự học)</button>
              {filteredInstructors.map(ins => (
                <div key={ins._id} onClick={() => handleChangeInstructor(ins._id)} className="w-full p-5 bg-[#0f172a] hover:bg-blue-600/10 rounded-3xl border border-slate-800 hover:border-blue-500 cursor-pointer transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-white">{ins.fullName[0].toUpperCase()}</div>
                    <div><p className="font-bold text-white">{ins.fullName}</p><p className="text-[10px] text-slate-500 font-bold">{ins.email}</p></div>
                  </div>
                  <UserCheck size={20} className="text-slate-700 group-hover:text-blue-500"/>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL CHIA SẺ CÁ NHÂN --- */}
      {showPrivateModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="bg-[#1e293b] w-full max-w-sm rounded-[2.5rem] p-10 border border-slate-700 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-white">Chia sẻ lộ trình</h3>
              <button onClick={() => {setShowPrivateModal(false); setFoundUser(null);}}><X size={20}/></button>
            </div>
            
            <div className="relative group">
              <input 
                type="text" placeholder="Nhập email bạn bè..."
                className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl text-white text-sm outline-none focus:border-blue-500"
                value={searchEmail} 
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <button 
                onClick={handleSearchUser}
                className="absolute right-2 top-2 p-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all"
              >
                {isSearching ? <Loader2 size={18} className="animate-spin"/> : <Search size={18} />}
              </button>
            </div>

            {foundUser && (
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex justify-between items-center animate-in zoom-in">
                <div className="flex items-center gap-3">
                  <User className="text-blue-400" size={20}/>
                  <span className="font-bold text-sm text-white">{foundUser.fullName}</span>
                </div>
                <button onClick={handleSharePrivate} className="bg-blue-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase">Gửi ngay</button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* --- MODAL ĐÓNG GÓI MARKET --- */}
      {showMarketModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] p-10 border border-slate-700 shadow-2xl space-y-8">
            <div className="flex justify-between items-center text-white">
              <h3 className="text-2xl font-black italic">Thiết lập Market</h3>
              <button onClick={() => setShowMarketModal(false)} className="p-2 hover:bg-slate-800 rounded-full"><X/></button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-2">Chọn danh mục</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3 rounded-xl text-[10px] font-bold border transition-all ${selectedCats.includes(cat.id) ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-white">
                <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Cấp độ khóa học</label>
                <div className="relative">
                  <select 
                    className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl text-white text-sm outline-none focus:border-blue-500 appearance-none cursor-pointer"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="Basic">Cơ bản</option>
                    <option value="Medium">Trung bình</option>
                    <option value="Advanced">Nâng cao</option>
                  </select>
                  {/* Custom Arrow for select */}
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-white">
                <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest ml-2">Gắn thẻ từ khóa (Tags)</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: AI, Python, Thực tập..."
                  className="w-full bg-[#0f172a] border border-slate-700 p-4 rounded-2xl text-white text-sm outline-none focus:border-blue-500"
                  value={marketData.tags}
                  onChange={(e) => setMarketData({...marketData, tags: e.target.value})}
                />
              </div>
            </div>

            <button 
              onClick={handlePostToMarket}
              disabled={isSubmitting}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 active:scale-95"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Check size={24}/>}
              Xác nhận đưa lên Market
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CourseActionMenu;
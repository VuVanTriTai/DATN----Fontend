import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Save, Shield, Loader2, CheckCircle, GraduationCap, School } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const Profile = () => {
  const { user, activeMode, updateUserAndToken } = useAuth();
  
  // State quản lý thông tin cá nhân
  const [fullName, setFullName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');
  const [teachingFields, setTeachingFields] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // State quản lý đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // State đăng ký giáo viên
  const [isRegisteringInstructor, setIsRegisteringInstructor] = useState(false);

  // Khởi tạo dữ liệu ban đầu từ user context
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      if (user.instructorProfile) {
        setSpecialization(user.instructorProfile.specialization || '');
        setBio(user.instructorProfile.bio || '');
        setTeachingFields(
          Array.isArray(user.instructorProfile.teachingFields)
            ? user.instructorProfile.teachingFields.join(', ')
            : ''
        );
      }
    }
  }, [user]);

  // Xử lý lưu thông tin cá nhân (và thông tin giảng viên nếu có)
  const handleUpdateProfile = async () => {
    if (!fullName.trim()) return alert("Họ tên không được để trống");
    
    setIsUpdatingProfile(true);
    try {
      const data: any = { fullName };
      if (user?.role.includes('instructor')) {
        data.instructorProfile = {
          specialization,
          bio,
          teachingFields: teachingFields.split(',').map(t => t.trim()).filter(Boolean)
        };
      }
      
      const res = await api.auth.updateProfile(data);
      if (res.success) {
        alert("Cập nhật thông tin thành công!");
        updateUserAndToken(res.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi cập nhật hồ sơ");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("Mật khẩu mới không trùng khớp");
    }
    if (passwordData.newPassword.length < 6) {
      return alert("Mật khẩu phải từ 6 ký tự trở lên");
    }

    setIsChangingPassword(true);
    try {
      const res = await api.auth.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      if (res.success) {
        alert("Đổi mật khẩu thành công!");
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi đổi mật khẩu");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Xử lý đăng ký làm Giảng viên
  const handleRegisterInstructor = async () => {
    setIsRegisteringInstructor(true);
    try {
      const payload = {
        specialization,
        bio,
        teachingFields: teachingFields.split(',').map(t => t.trim()).filter(Boolean)
      };
      
      const res = await api.auth.registerInstructor(payload);
      if (res.success) {
        alert("Đăng ký làm Giảng viên thành công! Bây giờ bạn đã có vai trò Giảng viên và có thể chuyển đổi chế độ xem ở menu bên trái.");
        updateUserAndToken(res.data.user, res.data.accessToken);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi đăng ký vai trò giảng viên");
    } finally {
      setIsRegisteringInstructor(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-10 text-white animate-in fade-in duration-500">
      <header className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight">Cài đặt tài khoản</h1>
        <p className="text-slate-500 text-sm">Quản lý thông tin cá nhân và cấu hình bảo mật</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* --- CỘT TRÁI: AVATAR & VAI TRÒ --- */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] p-10 rounded-[3rem] border border-slate-800 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="w-28 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-blue-900/20">
                {user?.fullName?.[0].toUpperCase() || "U"}
              </div>
              
              <h2 className="text-xl font-bold text-white line-clamp-1">{user?.fullName}</h2>
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                {user?.role.includes('instructor') ? (
                  <span className="flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
                    <School size={14}/> Giảng viên
                  </span>
                ) : null}
                {user?.role.includes('learner') && (
                  <span className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                    <GraduationCap size={14}/> Học viên
                  </span>
                )}
              </div>
              
              {user?.role.includes('instructor') && (
                <p className="text-[11px] text-slate-400 mt-3 italic">
                  * Bạn có thể chuyển đổi sang giao diện Giảng viên từ thanh menu bên trái.
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-600/5 p-6 rounded-[2rem] border border-blue-500/10 space-y-3">
             <div className="flex items-center gap-2 text-blue-400">
               <Shield size={16} />
               <span className="text-[10px] font-black uppercase">Trạng thái bảo mật</span>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed">
               Tài khoản của bạn đang được bảo vệ bởi hệ thống xác thực JWT và mã hóa mật khẩu cấp cao.
             </p>
          </div>
        </div>

        {/* --- CỘT PHẢI: FORM CHỈNH SỬA --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Thông tin cá nhân */}
          <div className="bg-[#1e293b] p-8 lg:p-10 rounded-[3rem] border border-slate-800 space-y-6 shadow-xl">
            <h2 className="text-xl font-black flex items-center gap-3 border-b border-slate-800 pb-4">
              <User className="text-blue-500" size={22}/> Thông tin cá nhân
            </h2>
            
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Họ và tên hiển thị</label>
                <div className="relative">
                   <User className="absolute left-4 top-4 text-slate-600" size={18} />
                   <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên..." 
                    className="w-full bg-[#0f172a] border border-slate-800 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-medium" 
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Địa chỉ Email (Không thể thay đổi)</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-4 text-slate-700" size={18} />
                   <input 
                    type="email" 
                    value={user?.email || ""} 
                    disabled 
                    className="w-full bg-[#0f172a]/50 border border-slate-800 p-4 pl-12 rounded-2xl text-slate-500 cursor-not-allowed italic" 
                   />
                </div>
              </div>

              {/* Thông tin bổ sung dành cho giảng viên */}
              {user?.role.includes('instructor') && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Lĩnh vực chuyên môn</label>
                    <input 
                      type="text" 
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="Ví dụ: Khoa học máy tính, Ngôn ngữ Anh..." 
                      className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-medium" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Lĩnh vực giảng dạy (Phân tách bằng dấu phẩy)</label>
                    <input 
                      type="text" 
                      value={teachingFields}
                      onChange={(e) => setTeachingFields(e.target.value)}
                      placeholder="Ví dụ: React, Node.js, Python..." 
                      className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-medium" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Tiểu sử / Giới thiệu bản thân</label>
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Mô tả kinh nghiệm, thế mạnh giảng dạy của bạn..." 
                      rows={3}
                      className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-medium resize-none" 
                    />
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50"
            >
              {isUpdatingProfile ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
              Lưu thay đổi
            </button>
          </div>

          {/* Section: Đăng ký Giảng viên (Nếu chưa là Giảng viên) */}
          {!user?.role.includes('instructor') && (
            <div className="bg-[#1e293b] p-8 lg:p-10 rounded-[3rem] border border-slate-800 space-y-6 shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-xl font-black flex items-center gap-3 border-b border-slate-800 pb-4 text-purple-400">
                  <School size={22}/> Đăng ký làm Giảng viên
                </h2>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  Mở rộng vai trò của bạn để tham gia xây dựng giáo trình học tập, quản lý bài tập học viên, chia sẻ các lộ trình chất lượng lên Market và tương tác giảng dạy.
                </p>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Lĩnh vực chuyên môn</label>
                    <input 
                      type="text" 
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="Ví dụ: Khoa học máy tính, Thiết kế đồ họa..." 
                      className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-purple-500 transition-all font-medium" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Lĩnh vực giảng dạy (Phân tách bằng dấu phẩy)</label>
                    <input 
                      type="text" 
                      value={teachingFields}
                      onChange={(e) => setTeachingFields(e.target.value)}
                      placeholder="Ví dụ: SQL, Python, UI/UX..." 
                      className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-purple-500 transition-all font-medium" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Tiểu sử / Giới thiệu bản thân</label>
                    <textarea 
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Mô tả ngắn về kinh nghiệm và định hướng giảng dạy của bạn..." 
                      rows={3}
                      className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-purple-500 transition-all font-medium resize-none" 
                    />
                  </div>
                </div>

                <button 
                  onClick={handleRegisterInstructor}
                  disabled={isRegisteringInstructor}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20 active:scale-95 disabled:opacity-50"
                >
                  {isRegisteringInstructor ? <Loader2 className="animate-spin" size={18}/> : <School size={18}/>}
                  Kích hoạt chức năng Giảng viên
                </button>
              </div>
            </div>
          )}

          {/* Section: Bảo mật */}
          <div className="bg-[#1e293b] p-8 lg:p-10 rounded-[3rem] border border-slate-800 space-y-6 shadow-xl">
            <h2 className="text-xl font-black flex items-center gap-3 border-b border-slate-800 pb-4">
              <Lock className="text-red-500" size={22}/> Bảo mật & Mật khẩu
            </h2>
            
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                  className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Xác nhận mật khẩu mới</label>
                  <input 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl text-white outline-none focus:border-blue-500 transition-all" 
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 transition-all border border-slate-700 active:scale-95 disabled:opacity-50"
            >
              {isChangingPassword ? <Loader2 className="animate-spin" size={18}/> : <Shield size={18}/>}
              Xác nhận đổi mật khẩu
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
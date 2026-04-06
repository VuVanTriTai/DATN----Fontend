import React from 'react';
import { User, Lock, Mail, Save, Shield } from 'lucide-react';

const Profile = () => {
  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-black text-white tracking-tight">Cài đặt tài khoản</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-800 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white">U</div>
          <p className="text-white font-bold text-xl">Người dùng</p>
          <p className="text-slate-500 text-sm">Học viên</p>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
            <h2 className="text-white font-bold flex items-center gap-2"><User size={18}/> Thông tin cá nhân</h2>
            <input type="text" placeholder="Họ và tên" className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500" />
            <input type="email" placeholder="Email" className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-xl text-white opacity-50 cursor-not-allowed" disabled />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"><Save size={18}/> Lưu thay đổi</button>
          </div>

          <div className="bg-[#1e293b] p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
            <h2 className="text-white font-bold flex items-center gap-2"><Shield size={18}/> Bảo mật</h2>
            <input type="password" placeholder="Mật khẩu hiện tại" className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500" />
            <input type="password" placeholder="Mật khẩu mới" className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500" />
            <button className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold">Đổi mật khẩu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
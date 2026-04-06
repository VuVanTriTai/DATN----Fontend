import React, { useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Sparkles } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '', role: 'learner' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = isLogin ? await api.auth.login(formData) : await api.auth.register(formData);
      if (res.success) login(res.data.user, res.data.accessToken);
    } catch (err) { alert("Lỗi xác thực!"); }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1e293b] rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/20">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white">{isLogin ? 'Chào mừng quay lại' : 'Tạo tài khoản mới'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-4 text-slate-500" size={20} />
              <input type="text" placeholder="Họ và tên" className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-500" size={20} />
            <input type="email" placeholder="Email" className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-500" size={20} />
            <input type="password" placeholder="Mật khẩu" className="w-full bg-[#0f172a] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          
          <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2">
            {isLogin ? <LogIn size={20}/> : <UserPlus size={20}/>}
            {isLogin ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-slate-400 text-sm font-bold hover:text-white">
          {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
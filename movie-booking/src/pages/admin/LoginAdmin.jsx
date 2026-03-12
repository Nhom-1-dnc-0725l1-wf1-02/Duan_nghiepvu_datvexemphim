import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Mật khẩu đơn giản để vào admin
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      alert('Sai mật khẩu rồi bạn ơi!');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-10 rounded-3xl border border-red-600/30 shadow-2xl">
        <h2 className="text-white text-3xl font-black italic mb-6 uppercase tracking-tighter">
          Noir <span className="text-red-600">Admin</span>
        </h2>
        <input
          type="password"
          placeholder="Nhập mật khẩu Admin..."
          className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white mb-4 focus:border-red-600 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all">
          XÁC NHẬN VÀO HỆ THỐNG
        </button>
      </form>
    </div>
  );
};

export default LoginAdmin;
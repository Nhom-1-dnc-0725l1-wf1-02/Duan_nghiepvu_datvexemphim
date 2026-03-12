import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [formData, setFormData] = useState({ account: '', password: '' });
  const navigate = useNavigate();

  // Đăng nhập thường
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        alert("Đăng nhập thành công!");
        navigate('/');
      }
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi đăng nhập!");
    }
  };

  // Đăng nhập Google thành công
  const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const decoded = jwtDecode(credentialResponse.credential);

    const res = await axios.post('http://localhost:5000/api/auth/google-login', {
      email: decoded.email,
      ten: decoded.name,
      googleId: decoded.sub
    });

    if (res.data.success) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert("Đăng nhập Google thành công!");
      navigate('/');
    }
  } catch (error) {
    console.error("Lỗi xác thực Google:", error);
    alert("Đăng nhập Google thất bại!");
  }
};


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black italic text-red-600 uppercase tracking-tighter">Chào mừng trở lại</h2>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Đăng nhập để trải nghiệm điện ảnh đỉnh cao</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <input 
            type="text" placeholder="Email hoặc số điện thoại" 
            className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-red-600 outline-none"
            onChange={(e) => setFormData({ ...formData, account: e.target.value })}
            required 
          />
          <input 
            type="password" placeholder="••••••••" 
            className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-red-600 outline-none"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required 
          />
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs transition-all">
            Đăng nhập ngay
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-950 px-2 text-zinc-500 font-bold">Hoặc</span></div>
        </div>

        {/* Nút Google chuẩn mới */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Login Failed')}
            theme="filled_black"
            shape="pill"
          />
        </div>

        <p className="mt-10 text-center text-zinc-500 text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-red-500 font-black hover:underline ml-1 uppercase italic">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
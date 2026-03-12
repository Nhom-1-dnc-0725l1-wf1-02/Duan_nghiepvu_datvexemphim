import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const navigate = useNavigate();

  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    ten: '',
    so_dien_thoai: '',
    email: '',
    mat_khau: ''
  });

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // ===== REGISTER NORMAL =====
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setUserId(res.data.userId);
      setIsVerifying(true);
      alert(res.data.message || "Mã OTP đã được gửi về Email!");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi đăng ký!");
    }
  };

  // ===== VERIFY OTP =====
  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) return alert("Vui lòng nhập đủ 6 số");

    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        userId,
        otp: otpCode
      });
      alert(res.data.message || "Đăng ký thành công!");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Mã OTP không chính xác!");
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  // ===== GOOGLE REGISTER / LOGIN =====
  const handleGoogleRegister = async (cred) => {
    const details = jwtDecode(cred.credential);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/google-login', {
        googleId: details.sub,
        email: details.email,
        ten: details.name
      });

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert(res.data.message || "Đăng nhập Google thành công!");
        navigate("/");
      }
    } catch (err) {
      alert("Lỗi đăng nhập Google!");
      console.error(err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">

        {!isVerifying ? (
          <>
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black italic text-red-600 uppercase tracking-tighter">
                Đăng ký tài khoản
              </h2>
              <p className="text-zinc-500 text-sm mt-2 font-medium">
                Nhận mã OTP qua Email để bảo mật tài khoản
              </p>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleRegister}>
              <div className="md:col-span-2">
                <label className="block text-zinc-400 text-xs font-black uppercase mb-1 ml-1">Họ và tên</label>
                <input required type="text" value={formData.ten}
                  onChange={(e) => handleChange(e, 'ten')}
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none" />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs font-black uppercase mb-1 ml-1">Số điện thoại</label>
                <input required type="text" value={formData.so_dien_thoai}
                  onChange={(e) => handleChange(e, 'so_dien_thoai')}
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none" />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs font-black uppercase mb-1 ml-1">Email nhận mã</label>
                <input required type="email" value={formData.email}
                  onChange={(e) => handleChange(e, 'email')}
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-zinc-400 text-xs font-black uppercase mb-1 ml-1">Mật khẩu</label>
                <input required type="password" placeholder="Tối thiểu 8 ký tự"
                  value={formData.mat_khau}
                  onChange={(e) => handleChange(e, 'mat_khau')}
                  className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-3 text-white focus:ring-2 focus:ring-red-600 outline-none" />
              </div>

              <button type="submit"
                className="md:col-span-2 bg-white text-black font-black py-4 rounded-2xl uppercase tracking-widest text-xs mt-4">
                Gửi mã xác nhận về Email
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#121214] px-2 text-zinc-500">Hoặc</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleRegister}
                onError={() => alert("Google Login Failed")}
                theme="dark"
                shape="pill"
              />
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-black italic text-white uppercase mb-2">Xác thực OTP</h2>
            <p className="text-zinc-500 text-sm mb-10">
              Mã 6 số đã được gửi tới <b>{formData.email}</b>
            </p>

            <div className="flex justify-center gap-2 mb-10">
              {otp.map((data, index) => (
                <input key={index} maxLength="1" type="text"
                  className="w-11 h-14 bg-black border border-zinc-800 rounded-xl text-center text-xl font-black text-red-600 outline-none"
                  value={data}
                  onChange={e => handleOtpChange(e.target, index)} />
              ))}
            </div>

            <button onClick={handleVerify}
              className="w-full bg-red-600 text-white font-black py-4 rounded-2xl uppercase text-xs">
              Xác nhận đăng ký
            </button>

            <button onClick={() => setIsVerifying(false)}
              className="mt-6 text-zinc-600 text-[10px] uppercase font-bold hover:text-white block w-full">
              Sửa lại thông tin
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Register;

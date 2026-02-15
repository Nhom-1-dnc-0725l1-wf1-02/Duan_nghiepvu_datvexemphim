import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    ten: '',
    email: '',
    so_dien_thoai: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

const handleSave = (e) => {
  e.preventDefault();
  
  // Lấy dữ liệu hiện tại từ localStorage để giữ lại các trường không sửa (như vai_tro_id, id)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Hợp nhất dữ liệu cũ và mới
  const updatedUser = { ...currentUser, ...user };
  
  // CẬP NHẬT LOCALSTORAGE
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  setMessage('Cập nhật thông tin thành công!');
  
  // Tùy chọn: Chuyển hướng về Home để Navbar load lại dữ liệu mới
  setTimeout(() => navigate('/'), 1500);
};

  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center">
      <div className="w-full max-w-md bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800 backdrop-blur-sm">
        <h2 className="text-2xl font-black mb-8 uppercase italic border-l-4 border-red-600 pl-4">
          Thông tin cá nhân
        </h2>

        {message && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-500 text-xs font-bold rounded-xl text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 ml-2">Họ và tên</label>
            <input
              type="text"
              name="ten"
              value={user.ten || ''}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-red-600 transition"
              placeholder="Nhập họ tên..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 ml-2">Email (Không thể sửa)</label>
            <input
              type="email"
              value={user.email || ''}
              disabled
              className="w-full bg-zinc-800/50 border border-zinc-800 rounded-xl py-3 px-4 text-zinc-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-zinc-500 mb-2 ml-2">Số điện thoại</label>
            <input
              type="text"
              name="so_dien_thoai"
              value={user.so_dien_thoai || ''}
              onChange={handleChange}
              className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-red-600 transition"
              placeholder="Nhập số điện thoại..."
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs transition shadow-lg shadow-red-600/20"
            >
              Lưu thay đổi
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 font-black py-4 rounded-xl uppercase tracking-widest text-xs transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
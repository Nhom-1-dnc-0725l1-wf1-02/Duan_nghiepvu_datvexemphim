import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalMovies: 0, todayShowtimes: 0, totalUsers: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // Bảo mật sơ cấp
    if (localStorage.getItem('isAdmin') !== 'true') navigate('/admin/login');

    // Lấy dữ liệu thực từ DB
    axios.get('http://localhost:5000/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar - Bạn nên tách Sidebar thành component riêng */}
      <div className="w-64 bg-zinc-900 p-6">
        <h3 className="text-2xl font-black text-red-600 italic mb-10">NOIR ADMIN</h3>
        <nav className="space-y-4">
          <button onClick={() => navigate('/admin/movies')} className="w-full text-left p-4 hover:bg-red-600 rounded-xl font-bold">Quản lý Phim</button>
          <button onClick={() => navigate('/admin/showtimes')} className="w-full text-left p-4 hover:bg-zinc-800 rounded-xl font-bold">Suất Chiếu</button>
          <button onClick={() => navigate('/admin/users')} className="w-full text-left p-4 hover:bg-zinc-800 rounded-xl font-bold">Người Dùng</button>
        </nav>
      </div>

      <div className="flex-1 p-10">
        <h1 className="text-4xl font-black mb-10 uppercase italic">Thống kê <span className="text-red-600">Hệ thống</span></h1>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-zinc-900 p-8 rounded-[2rem] border border-white/5">
            <div className="text-zinc-500 font-bold text-xs uppercase mb-2">Tổng số phim</div>
            <div className="text-5xl font-black italic">{stats.totalMovies}</div>
          </div>
          <div className="bg-zinc-900 p-8 rounded-[2rem] border border-white/5">
            <div className="text-zinc-500 font-bold text-xs uppercase mb-2">Suất chiếu hôm nay</div>
            <div className="text-5xl font-black italic text-red-600">{stats.todayShowtimes}</div>
          </div>
          <div className="bg-zinc-900 p-8 rounded-[2rem] border border-white/5">
            <div className="text-zinc-500 font-bold text-xs uppercase mb-2">Người dùng</div>
            <div className="text-5xl font-black italic">{stats.totalUsers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const RevenueStats = () => {
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Thêm State cho khoảng thời gian (Mặc định là tháng hiện tại)
  const today = new Date().toISOString().split('T')[0];
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const [filter, setFilter] = useState({ start: firstDay, end: today });

  useEffect(() => {
    fetchMovieStats();
  }, []);

  const fetchMovieStats = async () => {
    try {
      setLoading(true);
      // 2. Gửi params lên API
      const res = await axios.get('http://localhost:5000/api/admin/thong-ke-phim', {
        params: { startDate: filter.start, endDate: filter.end }
      });
      setMovieData(res.data);
    } catch (err) {
      console.error("Lỗi lấy thống kê phim:", err);
    } finally {
      setLoading(false);
    }
  };

  const pieData = {
    labels: movieData.map(m => m.ten_phim),
    datasets: [{
      label: 'Doanh thu (VNĐ)',
      data: movieData.map(m => m.doanh_thu),
      backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'],
      borderWidth: 0,
    }],
  };

  const barData = {
    labels: movieData.map(m => m.ten_phim),
    datasets: [{
      label: 'Số vé bán được',
      data: movieData.map(m => m.so_ve_ban_duoc),
      backgroundColor: '#dc2626',
      borderRadius: 8,
    }],
  };

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-red-600 border-l-4 border-red-600 pl-4">
          Phân tích <span className="text-white">Thị phần Phim</span>
        </h2>

        {/* 3. Bộ lọc thời gian */}
        <div className="flex bg-zinc-900 p-2 rounded-2xl border border-white/5 gap-2 items-center">
          <input 
            type="date" 
            className="bg-black p-2 rounded-xl border border-zinc-800 text-xs outline-none focus:border-red-600"
            value={filter.start}
            onChange={(e) => setFilter({...filter, start: e.target.value})}
          />
          <span className="text-zinc-500 font-bold">→</span>
          <input 
            type="date" 
            className="bg-black p-2 rounded-xl border border-zinc-800 text-xs outline-none focus:border-red-600"
            value={filter.end}
            onChange={(e) => setFilter({...filter, end: e.target.value})}
          />
          <button 
            onClick={fetchMovieStats}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all"
          >
            Lọc
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center text-red-600 font-black animate-pulse">ĐANG TẢI DỮ LIỆU...</div>
      ) : (
        <div className="grid grid-cols-12 gap-8">
          {/* BIỂU ĐỒ TRÒN */}
          <div className="col-span-12 lg:col-span-5 bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center shadow-2xl">
            <h3 className="text-sm font-black uppercase text-zinc-500 mb-6 tracking-widest">Tỷ lệ doanh thu</h3>
            <div className="w-full max-w-[300px]">
              <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#a1a1aa', font: { size: 10 } } } } }} />
            </div>
          </div>

          {/* BIỂU ĐỒ CỘT */}
          <div className="col-span-12 lg:col-span-7 bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
            <h3 className="text-sm font-black uppercase text-zinc-500 mb-6 tracking-widest">Lượng vé bán ra</h3>
            <div className="h-[300px]">
              <Bar 
                data={barData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: { 
                      y: { grid: { color: '#27272a' }, ticks: { color: '#71717a' } },
                      x: { grid: { display: false }, ticks: { color: '#71717a' } }
                  },
                  plugins: { legend: { display: false } }
                }} 
              />
            </div>
          </div>

          {/* BẢNG CHI TIẾT */}
          <div className="col-span-12 bg-zinc-900/30 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase font-black text-zinc-500">
                  <th className="p-6">Tên Phim</th>
                  <th className="p-6">Số vé đã bán</th>
                  <th className="p-6 text-right">Tổng doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {movieData.length > 0 ? movieData.map((item, i) => (
                  <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 font-bold text-zinc-200 uppercase tracking-tighter">{item.ten_phim}</td>
                    <td className="p-6 text-zinc-400">{item.so_ve_ban_duoc} vé</td>
                    <td className="p-6 text-right font-black text-red-500">
                      {Number(item.doanh_thu).toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="p-10 text-center text-zinc-600 italic">Không có dữ liệu trong khoảng thời gian này.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueStats;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminShowtimes = () => {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  // Tách ngày và giờ ra riêng để dễ thao tác
  const [form, setForm] = useState({ 
    phim_id: '', 
    phong_chieu_id: '', 
    ngay_chieu: '', 
    gio_chieu: '' 
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/phim').then(res => setMovies(res.data));
    fetchShowtimes();
  }, []);

  const fetchShowtimes = () => {
    axios.get('http://localhost:5000/api/lich-chieu').then(res => {
        const flatData = res.data.flatMap(m => m.showtimes.map(st => ({...st, ten_phim: m.ten})));
        setShowtimes(flatData);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kết hợp ngày và giờ thành định dạng ISO để gửi lên Backend
    const fullDateTime = `${form.ngay_chieu} ${form.gio_chieu}:00`;
    
    try {
      await axios.post('http://localhost:5000/api/admin/showtimes', {
        phim_id: form.phim_id,
        phong_chieu_id: form.phong_chieu_id,
        bat_dau: fullDateTime
      });
      alert("Thêm suất chiếu thành công!");
      fetchShowtimes();
    } catch (err) { 
      alert("Lỗi: " + (err.response?.data?.error || "Không thể kết nối Server")); 
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-6 md:p-10">
      <h2 className="text-3xl font-black mb-8 italic uppercase border-l-4 border-red-600 pl-4">Quản Lý Suất Chiếu</h2>

      {/* Form thêm suất chiếu tối ưu hóa */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-[2.5rem] mb-10 border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          {/* Chọn Phim */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-2">Phim</label>
            <select 
              className="bg-black p-4 rounded-2xl border border-zinc-800 focus:border-red-600 outline-none transition-all"
              value={form.phim_id} 
              onChange={e => setForm({...form, phim_id: e.target.value})} required
            >
              <option value="">Chọn phim...</option>
              {movies.map(m => <option key={m.id} value={m.id}>{m.ten}</option>)}
            </select>
          </div>

          {/* Chọn Phòng */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-2">Phòng chiếu</label>
            <select 
              className="bg-black p-4 rounded-2xl border border-zinc-800 focus:border-red-600 outline-none transition-all"
              value={form.phong_chieu_id} 
              onChange={e => setForm({...form, phong_chieu_id: e.target.value})} required
            >
              <option value="">Chọn phòng...</option>
              {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>Phòng {num}</option>)}
            </select>
          </div>

          {/* Chọn Ngày */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-2">Ngày chiếu</label>
            <input 
              type="date" 
              className="bg-black p-4 rounded-2xl border border-zinc-800 focus:border-red-600 outline-none transition-all"
              value={form.ngay_chieu} 
              onChange={e => setForm({...form, ngay_chieu: e.target.value})} required
            />
          </div>

          {/* Chọn Giờ */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase ml-2">Giờ chiếu</label>
            <input 
              type="time" 
              className="bg-black p-4 rounded-2xl border border-zinc-800 focus:border-red-600 outline-none transition-all"
              value={form.gio_chieu} 
              onChange={e => setForm({...form, gio_chieu: e.target.value})} required
            />
          </div>

          {/* Nút Submit */}
          <div className="flex items-end">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-red-600/20 uppercase tracking-tighter">
              Thêm Suất
            </button>
          </div>

        </div>
      </form>

      {/* Danh sách suất chiếu */}
      <div className="bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-800/50 text-zinc-400 text-xs uppercase tracking-widest">
              <th className="p-6">Phim</th>
              <th className="p-6 text-center">Ngày chiếu</th>
              <th className="p-6 text-center">Giờ chiếu</th>
              <th className="p-6 text-center">Phòng</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((st, index) => {
              const [d, t] = st.bat_dau.split(' ');
              return (
                <tr key={index} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-6 font-black text-white uppercase italic">{st.ten_phim}</td>
                  <td className="p-6 text-center text-zinc-400 font-bold">{d}</td>
                  <td className="p-6 text-center">
                    <span className="bg-zinc-800 px-4 py-2 rounded-lg text-red-500 font-black">
                      {t.substring(0, 5)}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <span className="text-zinc-500">Phòng</span> <span className="text-white font-bold">{st.phong_chieu_id}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminShowtimes;
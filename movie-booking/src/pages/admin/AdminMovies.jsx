import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ ten: '', hinh_anh: '', thoi_luong: '', the_loai: '' });

  const fetchMovies = () => {
    axios.get('http://localhost:5000/api/admin/movies')
      .then(res => setMovies(res.data))
      .catch(err => console.error("Lỗi tải phim:", err));
  };

  useEffect(() => fetchMovies(), []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/movies', newMovie);
      setNewMovie({ ten: '', hinh_anh: '', thoi_luong: '', the_loai: '' });
      fetchMovies();
      alert("Thêm phim thành công!");
    } catch (err) {
      alert("Lỗi khi thêm phim!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa phim này sẽ xóa toàn bộ suất chiếu liên quan. Bạn chắc chắn chứ?")) {
      await axios.delete(`http://localhost:5000/api/admin/movies/${id}`);
      fetchMovies();
    }
  };

  // Helper để hiển thị ảnh
  const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/100x150?text=No+Image';
    if (path.startsWith('http')) return path; // Nếu là link tuyệt đối
    return `http://localhost:5000/images/${path}`; // Nếu là tên file trong thư mục images
  };

  return (
    <div className="bg-black min-h-screen text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-black italic uppercase border-l-8 border-red-600 pl-6 tracking-tighter">
          Quản Lý <span className="text-red-600">Phim</span>
        </h2>
      </div>
      
      {/* Form Thêm Phim */}
      <form onSubmit={handleAdd} className="bg-zinc-900 p-8 rounded-[2rem] mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 border border-white/5">
        <input 
          placeholder="Tên phim" 
          className="bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-red-600" 
          value={newMovie.ten} 
          onChange={e => setNewMovie({...newMovie, ten: e.target.value})} 
          required 
        />
        <input 
          placeholder="Tên file ảnh (vd: latmat7.jpg)" 
          className="bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-red-600" 
          value={newMovie.hinh_anh} 
          onChange={e => setNewMovie({...newMovie, hinh_anh: e.target.value})} 
          required
        />
        <input 
          placeholder="Thời lượng (phút)" 
          className="bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-red-600" 
          value={newMovie.thoi_luong} 
          onChange={e => setNewMovie({...newMovie, thoi_luong: e.target.value})} 
        />
        <input 
          placeholder="Thể loại" 
          className="bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-red-600" 
          value={newMovie.the_loai} 
          onChange={e => setNewMovie({...newMovie, the_loai: e.target.value})} 
        />
        <button className="bg-red-600 text-white font-black py-4 rounded-xl hover:bg-red-700 transition-all uppercase italic">
          Thêm Phim
        </button>
      </form>

      {/* Danh sách phim */}
      <div className="bg-zinc-900/50 rounded-[3rem] overflow-hidden border border-white/5 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-800/50 text-zinc-400 text-xs uppercase tracking-widest">
              <th className="p-6">Hình ảnh</th>
              <th className="p-6">Thông tin phim</th>
              <th className="p-6">Thể loại</th>
              <th className="p-6">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(m => (
              <tr key={m.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-6">
                  <img 
                    src={getImageUrl(m.hinh_anh)} 
                    alt={m.ten} 
                    className="w-20 h-28 object-cover rounded-xl shadow-2xl border border-white/10"
                  />
                </td>
                <td className="p-6">
                  <div className="text-xl font-black uppercase italic">{m.ten}</div>
                  <div className="text-zinc-500 text-sm font-bold mt-1">{m.thoi_luong} phút</div>
                </td>
                <td className="p-6">
                  <span className="bg-zinc-800 px-4 py-1 rounded-full text-xs font-bold text-red-500 border border-red-600/20">
                    {m.the_loai}
                  </span>
                </td>
                <td className="p-6">
                  <button 
                    onClick={() => handleDelete(m.id)}
                    className="text-zinc-600 hover:text-red-600 font-black uppercase text-xs tracking-tighter transition-colors"
                  >
                    [ Xóa Phim ]
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMovies;
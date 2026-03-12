import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  if (!movie) return null;

  const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/300x450/222/white?text=No+Poster';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000/images/${path}`;
  };

  const handleBookingClick = () => {
    // Bấm thẳng vào phim là sang thẳng trang Booking
    navigate(`/booking/${movie.id}`, { state: { movie: movie } });
  };

  return (
    <div className="group cursor-pointer" onClick={handleBookingClick}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl mb-4 shadow-lg border border-zinc-800 bg-zinc-900">
        <img 
          src={getImageUrl(movie.hinh_anh)} 
          alt={movie.ten}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
        />
        
        <div className="absolute top-3 right-3 bg-red-600 text-[10px] font-black px-2 py-1 rounded text-white z-10">
          {movie.do_tuoi_gioi_han > 0 ? `T${movie.do_tuoi_gioi_han}` : 'P'}
        </div>

        {/* CHỈ HIỂN THỊ SAO, KHÔNG CẦN BẤM */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-yellow-500 border border-yellow-500/30 text-[10px] font-black px-2 py-1 rounded z-10 flex items-center gap-1 shadow-lg">
          ⭐ {Number(movie.diem_trung_binh || 0).toFixed(1)} <span className="text-zinc-400 font-medium">({movie.luot_danh_gia || 0})</span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 z-20">
          <button className="bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl uppercase text-[10px] tracking-widest shadow-xl transition-colors">
            Mua vé & Xem đánh giá
          </button>
        </div>
      </div>
      
      <h3 className="font-black text-lg truncate uppercase text-white group-hover:text-red-500 transition-colors">
        {movie.ten}
      </h3>
      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">
        {movie.the_loai} • {movie.thoi_luong} Phút
      </p>
    </div>
  );
};

export default MovieCard;
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

  // Hàm xử lý điều hướng
  const handleBookingClick = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click bị lặp
    // Chuyển hướng tới trang booking với ID của phim
    // Lưu ý: Nếu trang Booking của bạn cần suat_chieu_id, bạn nên truyền movie vào state
    navigate(`/booking/${movie.id}`, { state: { movie: movie } });
  };

  return (
    <div 
      className="group cursor-pointer" 
      onClick={handleBookingClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl mb-4 shadow-lg border border-zinc-800 bg-zinc-900">
        <img 
          src={getImageUrl(movie.hinh_anh)} 
          alt={movie.ten}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
        />
        
        <div className="absolute top-3 right-3 bg-red-600 text-[10px] font-black px-2 py-1 rounded text-white z-10">
          {movie.do_tuoi_gioi_han > 0 ? `T${movie.do_tuoi_gioi_han}` : 'P'}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 z-20">
          <button 
            className="bg-red-600 text-white font-black py-3 rounded-xl uppercase text-[10px] tracking-widest shadow-xl shadow-red-600/20"
          >
            Đặt vé ngay
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
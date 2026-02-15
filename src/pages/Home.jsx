import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGenre, setFilterGenre] = useState('Tất cả thể loại');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy từ khóa tìm kiếm từ URL (do Navbar gửi qua)
  const searchQuery = searchParams.get('search')?.toLowerCase() || "";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Gọi API lấy danh sách phim
        const res = await axios.get('http://localhost:5000/api/phim');
        
        // Lọc logic: Chỉ hiện phim đang trong thời gian chiếu
        const today = new Date();
        const activeMovies = res.data.filter(movie => {
          if (!movie.ngay_khoi_chieu || !movie.ngay_ket_thuc) return true; // Nếu chưa có data thì vẫn hiện
          const start = new Date(movie.ngay_khoi_chieu);
          const end = new Date(movie.ngay_ket_thuc);
          return today >= start && today <= end;
        });

        setMovies(activeMovies);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/1920x1080?text=No+Image';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000/images/${path}`; 
  };

  const fixedGenres = [
    'Tất cả thể loại', 'Anime', 'Hành động', 'Gia đình', 
    'Tâm lý', 'Kinh dị', 'Thể thao', 'Trinh thám', 'Phiêu lưu'
  ];

  // Logic lọc tổng hợp: Theo Thể loại AND Theo Từ khóa tìm kiếm
  const filteredMovies = movies.filter(movie => {
    const matchesGenre = filterGenre === 'Tất cả thể loại' || movie.the_loai.includes(filterGenre);
    const matchesSearch = movie.ten.toLowerCase().includes(searchQuery);
    return matchesGenre && matchesSearch;
  });

  if (loading) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <h2 className="text-white font-black italic animate-pulse uppercase">Đang tải phim...</h2>
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      {/* 1. Banner Hero - Hiển thị phim hot nhất hoặc phim đầu tiên */}
      {movies.length > 0 && !searchQuery && (
        <section className="relative h-[80vh] w-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url('${getImageUrl(movies[0]?.hinh_anh)}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-center px-12 max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-red-600 text-[10px] font-bold px-2 py-1 rounded">PHIM ĐANG CHIẾU</span>
              {movies[0].do_tuoi_gioi_han > 0 && (
                <span className="border border-red-600 text-red-600 text-[10px] font-bold px-2 py-1 rounded">T{movies[0].do_tuoi_gioi_han}</span>
              )}
            </div>
            <h1 className="text-7xl font-black leading-tight mb-6 uppercase italic">
              {movies[0]?.ten}<br/>
              <span className="text-red-600 text-5xl">{movies[0]?.the_loai.split(',')[0]}</span>
            </h1>
            <p className="text-zinc-300 text-lg mb-8 line-clamp-3 max-w-2xl font-medium">
              {movies[0]?.mo_ta}
            </p>
            <button 
              onClick={() => navigate('/lich-chieu')}
              className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-black transition transform hover:scale-105 uppercase tracking-widest text-sm w-fit"
            >
              MUA VÉ NGAY
            </button>
          </div>
        </section>
      )}

      {/* 2. Danh sách phim */}
      <section className="px-12 py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-black border-l-8 border-red-600 pl-4 mb-2 uppercase italic tracking-tighter">
              {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : "Phim đang chiếu"}
            </h2>
            <p className="text-zinc-500 font-medium italic">Trải nghiệm điện ảnh duy nhất tại NOIR Cinema</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Lọc thể loại</label>
            <select 
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-6 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-600 transition cursor-pointer min-w-[200px]"
            >
              {fixedGenres.map((genre, index) => (
                <option key={index} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid phim */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-zinc-800 rounded-3xl mt-10">
            <p className="text-zinc-500 font-black italic uppercase tracking-widest">
               Không tìm thấy phim phù hợp yêu cầu
            </p>
          </div>
        )}
      </section>

      {/* 3. Banner Khuyến mãi (Giữ lại theo logic của bạn) */}
      <div className="px-12 pb-24">
        <div className="w-full bg-gradient-to-r from-red-600 to-red-900 rounded-[2.5rem] p-12 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h3 className="text-4xl font-black mb-3 italic text-white uppercase tracking-tighter">Thành viên NOIR</h3>
            <p className="text-red-100 opacity-90 font-bold text-lg">Tích điểm mọi lần xem phim - Đổi vé miễn phí & Ưu đãi bắp nước</p>
          </div>
          <button onClick={() => navigate('/khuyen-mai')} className="bg-black text-white px-12 py-5 rounded-2xl font-black hover:bg-zinc-900 transition tracking-[0.2em] uppercase text-xs">
            XEM ƯU ĐÃI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
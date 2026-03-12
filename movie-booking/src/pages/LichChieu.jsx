import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LichChieu = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  // Hàm chuẩn hóa ngày
  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    // Nếu là string "2026-02-11 09:00:00" -> lấy "2026-02-11"
    if (typeof dateInput === 'string') return dateInput.split(' ')[0];
    const d = new Date(dateInput);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/lich-chieu');
        const movieData = Array.isArray(res.data) ? res.data : [];
        
        console.log("Dữ liệu nhận được:", movieData);

        const dateSet = new Set();
        movieData.forEach(movie => {
          movie.showtimes?.forEach(st => {
            const d = formatDate(st.bat_dau);
            if (d) dateSet.add(d);
          });
        });

        const sortedDates = Array.from(dateSet).sort();
        setDates(sortedDates);
        setMovies(movieData);
        
        // Tự động chọn ngày
        const today = formatDate(new Date());
        if (dateSet.has(today)) {
          setSelectedDate(today);
        } else if (sortedDates.length > 0) {
          setSelectedDate(sortedDates[0]);
        }
      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const showingMovies = movies.filter(movie =>
    movie.showtimes?.some(st => formatDate(st.bat_dau) === selectedDate)
  );

  if (loading) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="text-red-600 font-black text-2xl animate-pulse italic uppercase">Đang tải lịch chiếu...</div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-white p-6 md:p-10">
      <header className="mb-10">
        <h2 className="text-4xl font-black border-l-8 border-red-600 pl-6 uppercase italic tracking-tighter">
          Lịch Chiếu <span className="text-red-600">Noir Cinema</span>
        </h2>
      </header>

      {/* Thanh chọn ngày */}
      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
        {dates.map(dateStr => {
          const [y, m, d] = dateStr.split('-');
          const isActive = selectedDate === dateStr;
          return (
            <button
              key={dateStr} // Key chuẩn cho ngày
              onClick={() => setSelectedDate(dateStr)}
              className={`flex-shrink-0 min-w-[100px] p-4 rounded-[2rem] border transition-all duration-300 ${
                isActive ? 'bg-red-600 border-red-600' : 'bg-zinc-900 border-white/5'
              }`}
            >
              <div className="text-xs font-bold uppercase">Tháng {parseInt(m)}</div>
              <div className="text-3xl font-black italic">{d}</div>
            </button>
          );
        })}
      </div>

      {/* Danh sách phim */}
      <div className="grid gap-10">
        {showingMovies.map(movie => (
          <div key={`movie-${movie.id}`} className="group bg-zinc-900/40 p-6 rounded-[3rem] flex flex-col md:flex-row gap-8 border border-white/5">
            <div className="relative overflow-hidden rounded-2xl w-full md:w-48 h-72">
              <img 
                src={movie.hinh_anh ? `http://localhost:5000/images/${movie.hinh_anh}` : 'https://placehold.co/200x300'} 
                className="w-full h-full object-cover" 
                alt={movie.ten}
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-3xl font-black mb-2 uppercase italic">{movie.ten}</h3>
              <div className="flex gap-4 mb-6 text-zinc-500 font-bold">
                <span>{movie.the_loai}</span>
                <span className="text-red-600">{movie.thoi_luong} Phút</span>
              </div>

              <div className="flex gap-3 flex-wrap">
                {movie.showtimes
                  .filter(st => formatDate(st.bat_dau) === selectedDate)
                  .map(st => (
                    <button 
                      key={`st-${st.id}`} // FIX: Dùng st.id thay vì suat_chieu_id
                      onClick={() => navigate(`/booking/${st.id}`)} // Điều hướng bằng ID Suất chiếu thật
                      className="bg-zinc-800 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xl transition-all"
                    >
                      {/* Lấy giờ: "09:00" */}
                      {st.bat_dau.includes(' ') ? st.bat_dau.split(' ')[1].substring(0, 5) : "00:00"}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LichChieu;
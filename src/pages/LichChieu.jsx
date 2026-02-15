import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LichChieu = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  // Hàm chuẩn hóa ngày về YYYY-MM-DD
  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    if (typeof dateInput === 'string') {
      return dateInput.split(' ')[0]; // Lấy "2026-02-11" từ "2026-02-11 09:00:00"
    }
    const d = new Date(dateInput);
    return d.toLocaleDateString('sv-SE'); // Định dạng chuẩn ISO YYYY-MM-DD
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // Gọi API lấy lịch chiếu
        const res = await axios.get('http://localhost:5000/api/lich-chieu');
        const movieData = Array.isArray(res.data) ? res.data : [];
        
        console.log("Dữ liệu nhận được từ API:", movieData);

        if (movieData.length === 0) {
          setMovies([]);
          setDates([]);
          return;
        }

        // Trích xuất danh sách các ngày có suất chiếu (không trùng lặp)
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
        
        // Tự động chọn ngày hiển thị
        const today = formatDate(new Date());
        if (dateSet.has(today)) {
          setSelectedDate(today); // Ưu tiên hôm nay
        } else if (sortedDates.length > 0) {
          setSelectedDate(sortedDates[0]); // Nếu không có hôm nay, chọn ngày đầu tiên có phim
        }

      } catch (error) {
        console.error("Lỗi kết nối API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Lọc danh sách phim dựa trên ngày đã chọn
  const showingMovies = movies.filter(movie =>
    movie.showtimes?.some(st => formatDate(st.bat_dau) === selectedDate)
  );

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-red-600 font-black text-2xl animate-pulse italic uppercase">
          Đang tải lịch chiếu...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white p-6 md:p-10">
      <header className="mb-10">
        <h2 className="text-4xl font-black border-l-8 border-red-600 pl-6 uppercase italic tracking-tighter">
          Lịch Chiếu <span className="text-red-600">Noir Cinema</span>
        </h2>
      </header>

      {/* Thanh chọn ngày (Scroll ngang) */}
      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
        {dates.length > 0 ? (
          dates.map(dateStr => {
            const [y, m, d] = dateStr.split('-');
            const isActive = selectedDate === dateStr;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex-shrink-0 min-w-[100px] p-4 rounded-[2rem] border transition-all duration-300 ${
                  isActive 
                  ? 'bg-red-600 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]' 
                  : 'bg-zinc-900 border-white/5 hover:border-red-600/50'
                }`}
              >
                <div className={`text-xs font-bold uppercase ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                  Tháng {parseInt(m)}
                </div>
                <div className="text-3xl font-black italic">{d}</div>
              </button>
            );
          })
        ) : (
          <div className="text-zinc-600 italic">Không tìm thấy ngày chiếu nào trong hệ thống...</div>
        )}
      </div>

      {/* Danh sách phim theo ngày */}
      <div className="grid gap-10">
        {showingMovies.length > 0 ? (
          showingMovies.map(movie => (
            <div key={movie.id} className="group bg-zinc-900/40 p-6 rounded-[3rem] flex flex-col md:flex-row gap-8 border border-white/5 hover:border-red-600/20 transition-all">
              <div className="relative overflow-hidden rounded-2xl w-full md:w-48 h-72">
                <img 
                  src={movie.hinh_anh ? `http://localhost:5000/images/${movie.hinh_anh}` : 'https://placehold.co/200x300?text=No+Poster'} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={movie.ten}
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-3xl font-black mb-2 uppercase italic tracking-tight group-hover:text-red-600 transition-colors">
                  {movie.ten}
                </h3>
                <div className="flex gap-4 mb-6">
                  <span className="text-zinc-500 font-bold text-sm uppercase italic tracking-widest">
                    {movie.the_loai || 'Hành động'}
                  </span>
                  <span className="text-red-600 font-bold text-sm">
                    {movie.thoi_luong || '120'} Phút
                  </span>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {movie.showtimes
                    .filter(st => formatDate(st.bat_dau) === selectedDate)
                    .map(st => (
                      <button 
                        key={st.suat_chieu_id}
                        onClick={() => navigate(`/booking/${st.suat_chieu_id}`)}
                        className="bg-zinc-800 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xl transition-all hover:-translate-y-1 shadow-lg"
                      >
                        {/* Lấy giờ từ chuỗi YYYY-MM-DD HH:mm:ss */}
                        {st.bat_dau.split(' ')[1]?.substring(0, 5) || '00:00'}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          selectedDate && (
            <div className="text-center py-20 bg-zinc-900/20 rounded-[3rem] border-2 border-dashed border-zinc-800">
              <p className="text-zinc-500 font-bold uppercase italic">
                Rất tiếc, hiện không có suất chiếu nào cho ngày {selectedDate}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LichChieu;
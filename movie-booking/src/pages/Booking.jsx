import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Booking = () => {
  const { id } = useParams(); // Đây là suat_chieu_id từ URL
  const navigate = useNavigate();

  // 1. Khởi tạo State
  const [bookingInfo, setBookingInfo] = useState({ 
    info: { 
      ten_phim: '', 
      ten_phong: '', 
      bat_dau: null, 
      phim_id: null,
      phong_chieu_id: '' 
    }, 
    reservedSeats: [], 
    maintenanceSeats: [] 
  });
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userTickets, setUserTickets] = useState([]); 
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  // 2. Tải dữ liệu Suất chiếu + Ghế + Đánh giá
  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        console.log("🚀 Đang truy vấn suất chiếu ID:", id);
        const response = await axios.get(`http://localhost:5000/api/booking-details/${id}`);
        
        if (response.data) {
          console.log("✅ Dữ liệu phòng vé:", response.data);
          
          // Chuẩn hóa mảng ghế về chữ hoa và xóa khoảng trắng ngay khi nhận dữ liệu
          const cleanReserved = (response.data.reservedSeats || []).map(s => s.toString().trim().toUpperCase());
          const cleanMaint = (response.data.maintenanceSeats || []).map(s => s.toString().trim().toUpperCase());

          setBookingInfo({
            info: response.data.info || {},
            reservedSeats: cleanReserved,
            maintenanceSeats: cleanMaint
          });
          
          // Lấy đánh giá dựa trên phim_id nhận được từ suất chiếu
          const phimId = response.data.info?.phim_id;
          if (phimId) {
            const reviewRes = await axios.get(`http://localhost:5000/api/danh-gia/${phimId}`);
            setReviews(reviewRes.data || []);
          }
        }
      } catch (error) {
        console.error("❌ Lỗi tải dữ liệu:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  // 3. Lấy lịch sử vé của User để tính hạng thành viên
  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:5000/api/user-tickets/${user.id}`)
        .then(res => setUserTickets(res.data || []))
        .catch(err => console.error("Lỗi đồng bộ hạng:", err));
    }
  }, [user?.id]);

  const getMembershipInfo = () => {
    const totalTickets = userTickets.length;
    if (totalTickets >= 50) return { rank: 'Kim cương', discount: 0.2, color: 'text-cyan-400' };
    if (totalTickets >= 10) return { rank: 'Vàng', discount: 0.1, color: 'text-yellow-400' };
    return { rank: 'Bạc', discount: 0, color: 'text-zinc-400' };
  };

  const member = getMembershipInfo();
  const pricePerSeat = 90000;
  const rawTotal = selectedSeats.length * pricePerSeat;
  const finalTotal = rawTotal * (1 - member.discount);

  // 4. Xử lý chọn ghế
  const toggleSeat = (seatId) => {
    const upperSeat = seatId.toUpperCase();
    if (bookingInfo.reservedSeats.includes(upperSeat) || bookingInfo.maintenanceSeats.includes(upperSeat)) return;
    
    setSelectedSeats(prev => 
      prev.includes(upperSeat) ? prev.filter(s => s !== upperSeat) : [...prev, upperSeat]
    );
  };

  const handleConfirmSeats = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để tiếp tục!");
      navigate('/login');
      return;
    }
    const { info } = bookingInfo;
    navigate('/thanh-toan', {
      state: {
        suat_chieu_id: id,
        movie: { 
          ten: info?.ten_phim || 'Không rõ tên phim', 
          id: info?.phim_id,
          phong: info?.ten_phong || `Phòng ${info?.phong_chieu_id}`,
          ngay: info?.bat_dau ? new Date(info.bat_dau).toLocaleDateString('vi-VN') : '--',
          gio: info?.bat_dau ? new Date(info.bat_dau).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'
        },
        seats: selectedSeats,
        total: finalTotal,
        discountAmount: rawTotal - finalTotal,
        user_id: user.id
      }
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-black uppercase tracking-widest">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse text-xs text-zinc-500">Đang chuẩn bị phòng chiếu...</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-10 grid grid-cols-12 gap-8 text-white font-sans notranslate">
      
      {/* SƠ ĐỒ GHẾ */}
      <div className="col-span-12 lg:col-span-8 bg-zinc-900/30 p-10 rounded-[3rem] border border-white/5 backdrop-blur-sm shadow-2xl relative overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-red-600 font-black uppercase tracking-tighter text-3xl mb-4">
            {bookingInfo.info?.ten_phong || `Phòng ${bookingInfo.info?.phong_chieu_id || '...'}`}
          </h2>
          <div className="w-[80%] h-1.5 bg-zinc-700 mx-auto rounded-full shadow-[0_0_30px_rgba(255,255,255,0.05)]"></div>
          <p className="text-[10px] text-zinc-600 uppercase mt-3 tracking-[1em] font-bold">Màn hình</p>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-4 mb-12">
          {Array.from({ length: 60 }).map((_, i) => {
            const seatId = `G${i + 1}`;
            const isReserved = bookingInfo.reservedSeats.includes(seatId);
            const isMaintenance = bookingInfo.maintenanceSeats.includes(seatId); 
            const isSelected = selectedSeats.includes(seatId);

            return (
              <div
                key={seatId}
                role="button"
                onClick={() => toggleSeat(seatId)}
                className={`h-12 w-full rounded-t-2xl flex items-center justify-center text-[10px] font-black transition-all duration-300 transform
                  ${isReserved 
                    ? 'bg-black text-zinc-800 cursor-not-allowed border border-zinc-900' 
                    : isMaintenance
                      ? 'bg-yellow-500/20 text-yellow-500 cursor-not-allowed border-2 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                      : isSelected 
                        ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] -translate-y-1 scale-110 z-10' 
                        : 'bg-zinc-800 hover:bg-zinc-600 text-zinc-500 hover:text-white border border-white/5 cursor-pointer active:scale-90'}`}
              >
                {isMaintenance ? '🔧' : isReserved ? '✕' : seatId}
              </div>
            );
          })}
        </div>

        {/* CHÚ THÍCH */}
        <div className="flex flex-wrap justify-center gap-6 border-t border-white/5 pt-10">
            <div className="flex items-center gap-3"><div className="w-4 h-4 bg-zinc-800 rounded-sm"></div><span className="text-[9px] font-black text-zinc-500 uppercase">Trống</span></div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 bg-red-600 rounded-sm"></div><span className="text-[9px] font-black text-zinc-500 uppercase">Đang chọn</span></div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 bg-black border border-zinc-800 rounded-sm"></div><span className="text-[9px] font-black text-zinc-500 uppercase">Đã bán</span></div>
            <div className="flex items-center gap-3"><div className="w-4 h-4 bg-yellow-600/20 border border-yellow-600 rounded-sm"></div><span className="text-[9px] font-black text-yellow-600 uppercase">Bảo trì</span></div>
        </div>
      </div>

      {/* CHI TIẾT THANH TOÁN */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-zinc-900/80 p-8 rounded-[2.5rem] border border-white/5 sticky top-24 shadow-2xl backdrop-blur-md">
          <div className="mb-8">
            <p className="text-red-600 text-[10px] font-black uppercase tracking-widest mb-1">Phim đang chọn</p>
            <h3 className="text-2xl font-black border-l-4 border-red-600 pl-4 italic uppercase tracking-tighter">
                {bookingInfo.info?.ten_phim || '---'}
            </h3>
          </div>
          
          <div className="space-y-5 text-sm mb-10">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 uppercase text-[10px] font-black tracking-widest">Thời gian</span>
              <span className="font-bold text-zinc-200">
                {bookingInfo.info?.bat_dau ? new Date(bookingInfo.info.bat_dau).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '--:--'}
              </span>
            </div>
            
            <div className="flex justify-between items-start border-t border-white/5 pt-5">
              <span className="text-zinc-500 uppercase text-[10px] font-black tracking-widest">Ghế đã chọn</span>
              <div className="flex flex-wrap justify-end gap-1.5 max-w-[180px]">
                {selectedSeats.length > 0 ? selectedSeats.map(s => (
                  <span key={s} className="bg-red-600/20 text-red-500 border border-red-600/30 px-2 py-0.5 rounded-md text-[10px] font-black">
                    {s}
                  </span>
                )) : <span className="text-zinc-700 italic font-bold">Chưa chọn ghế</span>}
              </div>
            </div>
          </div>

          <div className="bg-black/40 p-6 rounded-3xl border border-white/5 mb-8">
            <div className="flex justify-between text-[10px] font-black mb-3 uppercase tracking-tighter">
              <span className={member.color}>Hạng: {member.rank}</span>
              <span className="text-red-600">-{member.discount * 100}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Tổng tiền</span>
              <span className="text-3xl font-black text-red-600 tracking-tighter">
                {Math.round(finalTotal).toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirmSeats}
            disabled={selectedSeats.length === 0}
            className="w-full py-5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-300 shadow-lg shadow-red-900/20"
          >
            Tiếp tục thanh toán
          </button>
        </div>
      </div>

      {/* REVIEW PHIM */}
      <div className="col-span-full mt-12 pt-12 border-t border-white/5">
        <h3 className="text-2xl font-black italic uppercase mb-10 tracking-tighter">
            Cộng đồng <span className="text-red-600">Review</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.length > 0 ? reviews.map((rv, i) => (
            <div key={i} className="bg-zinc-900/40 p-8 rounded-[2rem] border border-white/5 hover:border-red-600/30 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-black text-xs uppercase">
                        {rv.nguoi_dung?.charAt(0)}
                    </div>
                    <span className="font-black text-zinc-200 uppercase text-[11px] tracking-widest">{rv.nguoi_dung}</span>
                </div>
                <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black">⭐ {rv.diem}/10</div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed italic font-medium break-words">"{rv.binh_luan}"</p>
            </div>
          )) : (
            <div className="col-span-full text-zinc-600 italic py-10 text-center uppercase text-[10px] tracking-widest font-bold">Chưa có đánh giá nào.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
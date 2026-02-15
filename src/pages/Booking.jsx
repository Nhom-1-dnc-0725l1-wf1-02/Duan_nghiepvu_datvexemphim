import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const Booking = () => {
  const { id } = useParams(); // suat_chieu_id
  const navigate = useNavigate();
  const location = useLocation();
  
  const movieData = location.state?.movie || { ten: "Phim đang chọn" };
  const showtimeData = location.state?.showtime || { bat_dau: "" };

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [userTickets, setUserTickets] = useState([]); // State lưu vé của riêng user này

  const user = JSON.parse(localStorage.getItem('user'));

useEffect(() => {
  const fetchReservedSeats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/all-booked-tickets'); 
      const allTicketsFromDB = await response.json();
      
      // Lọc ghế: Phải khớp suat_chieu_id và lấy đúng trường ghe_text
      const bookedInThisShow = allTicketsFromDB
        .filter(t => String(t.suat_chieu_id) === String(id)) // Ép kiểu chuỗi để so sánh an toàn
        .map(t => t.ghe_text); // Kết quả sẽ là mảng ['G6', 'G8', ...]
      
      console.log("Danh sách ghế đã khóa cho suất chiếu " + id + ":", bookedInThisShow);
      setReservedSeats(bookedInThisShow);
    } catch (error) {
      console.error("Lỗi tải ghế từ Server:", error);
    }
  };
  fetchReservedSeats();
}, [id]);

// Trong phần render sơ đồ ghế:
// Nếu seatId của bạn là "G1" nhưng DB lưu là "1", hãy sửa seatId cho khớp
<div className="grid grid-cols-10 gap-4 mb-12">
  {Array.from({ length: 60 }).map((_, i) => {
    // QUAN TRỌNG: ID ghế phải là "G1", "G2"... để khớp với ghe_text trong DB
    const seatId = `G${i + 1}`; 
    const isSelected = selectedSeats.includes(seatId);
    const isReserved = reservedSeats.includes(seatId);

    return (
      <div 
        key={seatId} 
        onClick={() => toggleSeat(seatId)}
        className={`relative h-10 w-full rounded-t-xl cursor-pointer flex items-center justify-center text-[10px] font-black transition-all duration-300
          ${isReserved 
            ? 'bg-zinc-800 text-zinc-900 cursor-not-allowed border border-zinc-900 opacity-50' 
            : isSelected 
              ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-110 z-10' 
              : 'bg-zinc-700 hover:bg-zinc-500 text-zinc-400'}
        `}
      >
        {isReserved ? '✕' : (i + 1)}
      </div>
    );
  })}
</div>

  // 2. ĐỒNG BỘ VÉ TỪ DATABASE (Để tính hạng thành viên chính xác)
  useEffect(() => {
    const syncUserRank = async () => {
      if (user && user.id) {
        try {
          const res = await fetch(`http://localhost:5000/api/user-tickets/${user.id}`);
          const data = await res.json();
          if (Array.isArray(data)) {
            setUserTickets(data);
            // Ghi đè lại localStorage để đảm bảo mọi trang đều dùng dữ liệu mới nhất của user này
            localStorage.setItem('user_tickets', JSON.stringify(data));
          }
        } catch (err) {
          console.error("Lỗi đồng bộ hạng thành viên:", err);
          // Dự phòng nếu API lỗi thì dùng tạm local cũ
          const local = JSON.parse(localStorage.getItem('user_tickets') || '[]');
          setUserTickets(local);
        }
      }
    };
    syncUserRank();
  }, [user?.id]);

  // 3. Hàm tính hạng thành viên
  const getMembershipInfo = () => {
    const totalTickets = userTickets.length; // Số vé thực tế từ Database

    if (totalTickets >= 50) {
      return { rank: 'Kim cương', discount: 0.2, color: 'text-cyan-400' };
    } else if (totalTickets >= 10) {
      return { rank: 'Vàng', discount: 0.1, color: 'text-yellow-400' };
    } else {
      return { rank: 'Bạc', discount: 0, color: 'text-zinc-400' };
    }
  };

  const member = getMembershipInfo();
  const pricePerSeat = 90000;
  const rawTotal = selectedSeats.length * pricePerSeat;
  const finalTotal = rawTotal * (1 - member.discount);

  const toggleSeat = (seatId) => {
    if (reservedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmSeats = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đặt vé!");
      navigate('/login');
      return;
    }
    if (selectedSeats.length === 0) return;

    navigate('/thanh-toan', {
      state: {
        suat_chieu_id: id,
        movie: movieData,
        showtime: showtimeData,
        seats: selectedSeats,
        total: finalTotal,
        discountAmount: rawTotal - finalTotal // Truyền số tiền được giảm sang
      }
    });
  };

  return (
    <div className="container mx-auto px-6 py-10 grid grid-cols-12 gap-8 text-white font-sans">
      {/* Sơ đồ ghế */}
      <div className="col-span-12 lg:col-span-8 bg-zinc-900/30 p-10 rounded-[3rem] border border-white/5 backdrop-blur-sm">
        <div className="text-center mb-16">
          <div className="w-[70%] h-1.5 bg-red-600 mx-auto mb-4 shadow-[0_0_25px_rgba(220,38,38,0.8)] rounded-full"></div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.8em] font-black">Màn hình</p>
        </div>
        
        <div className="grid grid-cols-10 gap-4 mb-12">
          {Array.from({ length: 60 }).map((_, i) => {
            const seatId = `G${i + 1}`;
            const isSelected = selectedSeats.includes(seatId);
            const isReserved = reservedSeats.includes(seatId);

            return (
              <div 
                key={seatId} 
                onClick={() => toggleSeat(seatId)}
                className={`relative h-10 w-full rounded-t-xl cursor-pointer flex items-center justify-center text-[10px] font-black transition-all duration-300
                  ${isReserved 
                    ? 'bg-black text-zinc-800 cursor-not-allowed border border-zinc-900' 
                    : isSelected 
                      ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-110 z-10' 
                      : 'bg-zinc-700 hover:bg-zinc-500 text-zinc-400'}
                `}
              >
                {isReserved ? '✕' : (i + 1)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Thông tin thanh toán bên phải */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-zinc-900/80 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl sticky top-24">
          <h3 className="text-2xl font-black mb-8 uppercase italic border-l-4 border-red-600 pl-4">Thông tin vé</h3>
          
          <div className="space-y-5 text-sm mb-8">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 font-bold uppercase text-[10px]">Phim</span>
              <span className="font-black text-white">{movieData.ten}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 font-bold uppercase text-[10px]">Suất</span>
              <span className="font-black text-white">
                {showtimeData.bat_dau ? new Date(showtimeData.bat_dau).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
              </span>
            </div>
            <div className="flex justify-between items-start border-t border-white/5 pt-5">
              <span className="text-zinc-500 font-bold uppercase text-[10px]">Ghế</span>
              <div className="flex flex-wrap justify-end gap-2 max-w-[150px]">
                {selectedSeats.length > 0 ? selectedSeats.map(s => (
                  <span key={s} className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-black">{s}</span>
                )) : <span className="text-zinc-700 italic">Chưa chọn</span>}
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-white/5 pt-5 mb-8">
            <div className="flex justify-between text-[10px] uppercase font-bold">
              <span className="text-zinc-500">Hạng thành viên:</span>
              <span className={member.color}>{member.rank}</span>
            </div>
            <div className="flex justify-between text-[10px] uppercase font-bold">
              <span className="text-zinc-500">Tạm tính:</span>
              <span className="text-white">{rawTotal.toLocaleString()}đ</span>
            </div>
            {member.discount > 0 && (
              <div className="flex justify-between text-[10px] uppercase font-bold text-green-500">
                <span>Giảm giá ({member.discount * 100}%):</span>
                <span>-{(rawTotal * member.discount).toLocaleString()}đ</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-white/10 pt-3">
              <span className="font-bold text-zinc-500 text-[10px] uppercase">Tổng tiền</span>
              <span className="font-black text-red-600 text-3xl">{finalTotal.toLocaleString()}đ</span>
            </div>
          </div>

          <button 
            onClick={handleConfirmSeats} 
            className="w-full py-5 rounded-2xl font-black bg-red-600 hover:bg-red-700 text-white uppercase tracking-widest text-xs shadow-xl disabled:opacity-20 disabled:cursor-not-allowed" 
            disabled={selectedSeats.length === 0}
          >
            Tiếp theo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
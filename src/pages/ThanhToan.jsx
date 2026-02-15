import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ThanhToan = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!state || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p>Thông tin không hợp lệ. <button onClick={() => navigate('/')}>Quay lại</button></p>
      </div>
    );
  }

  // Chống lỗi Invalid Date (Sửa lỗi image_5c0f92)
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return { ngay: "N/A", gio: "--:--", full: "Chưa xác định" };
    
    return {
      ngay: date.toLocaleDateString('vi-VN'),
      gio: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleString('vi-VN')
    };
  };

  const timeData = formatDateTime(state.showtime?.bat_dau);

  const handleComplete = async () => {
    const orderData = {
      user_id: user.id,
      suat_chieu_id: state.suat_chieu_id,
      seats: state.seats,
      total_price: state.total,
      movie_info: {
        ten: state.movie?.ten || "Phim",
        ngay: timeData.ngay,
        gio: timeData.gio
      }
    };

    try {
      const response = await fetch('http://localhost:5000/api/dat-ve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        // BƯỚC QUAN TRỌNG: Không tự cộng dồn vào localStorage nữa
        // Chúng ta sẽ xóa cache để trang tiếp theo buộc phải gọi API lấy số liệu chuẩn (10 vé)
        localStorage.removeItem('user_tickets'); 
        
        alert("Thanh toán thành công!");
        navigate('/ve-cua-toi'); // Hoặc '/khuyen-mai'
      } else {
        alert("Lỗi: " + result.error);
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 text-center">
        <h2 className="text-3xl font-black text-red-600 mb-6 uppercase italic">Xác nhận đơn hàng</h2>
        
        <div className="text-left bg-black/40 p-6 rounded-2xl mb-8 space-y-3 border border-white/5 text-sm text-zinc-400">
            <div className="flex justify-between"><span>Phim:</span><span className="text-white font-bold">{state.movie?.ten}</span></div>
            <div className="flex justify-between"><span>Ghế:</span><span className="text-red-500 font-bold">{state.seats?.join(', ')}</span></div>
            <div className="flex justify-between"><span>Suất:</span><span className="text-white font-bold">{timeData.full}</span></div>
        </div>

        <div className="bg-white p-4 rounded-2xl mb-8 inline-block shadow-2xl">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT_ID_${Date.now()}`} 
            alt="QR" 
            className="w-48 h-48" 
          />
        </div>

        <p className="text-white font-black text-3xl mb-8">
          {(state.total || 0).toLocaleString()}đ
        </p>

        <button 
            onClick={handleComplete} 
            className="w-full bg-red-600 py-5 rounded-2xl font-black text-white uppercase hover:scale-[1.02] transition-transform"
        >
          Tôi đã chuyển khoản
        </button>
      </div>
    </div>
  );
};

export default ThanhToan;
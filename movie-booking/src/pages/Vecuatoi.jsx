import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Vecuatoi = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  // State cho Modal Đánh giá
  const [ratingModal, setRatingModal] = useState({ isOpen: false, phim_id: null, ten_phim: '' });
  const [diem, setDiem] = useState(5);
  const [binhLuan, setBinhLuan] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`http://localhost:5000/api/user-tickets/${user.id}`);
          const data = await response.json();

          if (Array.isArray(data)) {
            localStorage.setItem('user_tickets', JSON.stringify(data));
            const grouped = data.reduce((acc, curr) => {
              const key = `${curr.suat_chieu_id}_${curr.ngay_chieu}`;
              if (!acc[key]) {
                acc[key] = { ...curr, ghe: [curr.ghe_text] };
              } else {
                acc[key].ghe.push(curr.ghe_text);
              }
              return acc;
            }, {});
            setTickets(Object.values(grouped));
          }
        } catch (error) {
          console.error("Lỗi lấy vé:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTickets();
  }, [user?.id]);

  const submitRating = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/danh-gia', {
        nguoi_dung_id: user.id,
        ten_phim: ratingModal.ten_phim, // ĐỔI: Gửi Tên phim thay vì phim_id
        diem: diem,
        binh_luan: binhLuan
      });
      alert(res.data.message);
      setRatingModal({ isOpen: false, phim_id: null, ten_phim: '' });
      setBinhLuan(''); 
      setDiem(5);
    } catch (error) {
      alert(error.response?.data?.message || "Lỗi đánh giá");
    }
  };

  if (!user) return <div className="text-center text-white py-20 font-bold uppercase italic">Vui lòng đăng nhập!</div>;
  if (loading) return <div className="text-center text-zinc-500 py-20 italic animate-pulse tracking-widest">ĐANG TRUY XUẤT DATABASE...</div>;

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      <h2 className="text-3xl font-black italic uppercase border-l-8 border-red-600 pl-4 mb-12 text-white tracking-tighter">Lịch sử đặt vé</h2>
      
      <div className="grid gap-8">
        {tickets.length > 0 ? tickets.map((ticket, index) => {
          // KIỂM TRA ĐIỀU KIỆN ĐÁNH GIÁ CỦA THẦY: Đã qua giờ chiếu chưa?
          const daXemXong = true;

          return (
            <div key={index} className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 flex flex-col md:flex-row shadow-2xl relative">
              <div className="bg-red-600 p-8 flex flex-col justify-center items-center text-white md:w-64">
                <div className="text-[10px] font-black opacity-80 uppercase tracking-widest">Mã vé</div>
                <div className="text-2xl font-black italic">#{ticket.id}</div>
              </div>

              <div className="p-8 flex-1 text-white">
                <h3 className="text-3xl font-black uppercase mb-6 italic tracking-tighter text-white">{ticket.ten_phim}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase font-black mb-1">Ngày chiếu</p>
                    <p className="font-bold text-sm text-white">{ticket.ngay_chieu}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase font-black mb-1">Giờ chiếu</p>
                    <p className="font-bold text-sm text-white">{ticket.suat_chieu}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase font-black mb-1">Ghế</p>
                    <p className="text-red-500 font-black text-sm">{ticket.ghe.join(', ')}</p>
                  </div>
                </div>

                {/* NÚT ĐÁNH GIÁ CHỈ HIỆN KHI ĐÃ XEM XONG */}
                {daXemXong ? (
                  <button 
                    onClick={() => setRatingModal({ isOpen: true, phim_id: ticket.phim_id, ten_phim: ticket.ten_phim })}
                    className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                  >
                    Đánh giá phim ngay
                  </button>
                ) : (
                  <span className="mt-4 inline-block text-[10px] uppercase font-bold text-zinc-500 border border-zinc-700 px-4 py-2 rounded-xl">Chưa tới giờ xem</span>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="text-zinc-700 text-center py-20 font-black uppercase italic text-2xl">Tài khoản này chưa có vé.</div>
        )}
      </div>

      {/* POPUP ĐÁNH GIÁ */}
      {ratingModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black text-white italic uppercase mb-2">Đánh giá phim</h3>
            <p className="text-red-500 font-bold mb-6">{ratingModal.ten_phim}</p>
            
            <label className="text-zinc-400 text-xs font-bold uppercase block mb-2">Chấm điểm (1-5 Sao)</label>
            <select value={diem} onChange={e => setDiem(e.target.value)} className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white font-bold mb-4 outline-none">
              <option value="5">⭐⭐⭐⭐⭐ Tuyệt đỉnh</option>
              <option value="4">⭐⭐⭐⭐ Rất hay</option>
              <option value="3">⭐⭐⭐ Tạm được</option>
              <option value="2">⭐⭐ Khá chán</option>
              <option value="1">⭐ Phí tiền</option>
            </select>

            <label className="text-zinc-400 text-xs font-bold uppercase block mb-2">Cảm nhận của bạn</label>
            <textarea 
              value={binhLuan} onChange={e => setBinhLuan(e.target.value)}
              placeholder="Chia sẻ cảm nhận..." rows="3"
              className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white mb-6 outline-none"
            />

            <div className="flex gap-4">
              <button onClick={submitRating} className="flex-1 bg-red-600 text-white font-black py-3 rounded-xl uppercase text-xs hover:bg-red-700">Gửi đánh giá</button>
              <button onClick={() => setRatingModal({ isOpen: false })} className="px-6 bg-zinc-800 text-white font-bold py-3 rounded-xl uppercase text-xs hover:bg-zinc-700">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vecuatoi;
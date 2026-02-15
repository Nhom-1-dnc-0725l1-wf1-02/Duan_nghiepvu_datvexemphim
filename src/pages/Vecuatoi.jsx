import React, { useEffect, useState } from 'react';

const Vecuatoi = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchTickets = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`http://localhost:5000/api/user-tickets/${user.id}`);
          const data = await response.json();

          if (Array.isArray(data)) {
            // Cập nhật lại localStorage để hạng thành viên ở trang KhuyenMai chuẩn theo tài khoản này
            localStorage.setItem('user_tickets', JSON.stringify(data));

            // Group vé theo suất chiếu để hiển thị đẹp hơn
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
  }, [user?.id]); // Chạy lại nếu user ID thay đổi

  if (!user) return <div className="text-center text-white py-20 font-bold uppercase italic">Vui lòng đăng nhập!</div>;
  if (loading) return <div className="text-center text-zinc-500 py-20 italic animate-pulse tracking-widest">ĐANG TRUY XUẤT DATABASE...</div>;

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      <h2 className="text-3xl font-black italic uppercase border-l-8 border-red-600 pl-4 mb-12 text-white tracking-tighter">
        Lịch sử đặt vé
      </h2>
      
      <div className="grid gap-8">
        {tickets.length > 0 ? tickets.map((ticket, index) => (
          <div key={index} className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 flex flex-col md:flex-row shadow-2xl hover:border-red-600/30 transition-all">
            {/* Mã QR */}
            <div className="bg-red-600 p-8 flex flex-col justify-center items-center text-white md:w-64 border-r-2 border-dashed border-black/20">
              <div className="text-[10px] font-black opacity-80 uppercase tracking-widest">Mã vé</div>
              <div className="text-2xl font-black italic">#{ticket.id}</div>
              <div className="mt-6 p-2 bg-white rounded-xl shadow-lg">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=TICKET_USER_${user.id}_ID_${ticket.id}`} className="w-24 h-24" alt="QR" />
              </div>
            </div>

            {/* Nội dung */}
            <div className="p-8 flex-1 relative text-white">
              <span className="absolute top-8 right-8 px-4 py-1 rounded-full text-[10px] font-black uppercase bg-green-500/20 text-green-500 border border-green-500/20">
                Giao dịch thành công
              </span>
              
              <h3 className="text-3xl font-black uppercase mb-6 italic tracking-tighter text-white">
                {ticket.ten_phim}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-black mb-1">Ngày chiếu</p>
                  <p className="font-bold text-sm text-white">{ticket.ngay_chieu}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-black mb-1">Giờ chiếu</p>
                  <p className="font-bold text-sm text-white">{ticket.suat_chieu}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-black mb-1">Vị trí ghế</p>
                  <div className="flex flex-wrap gap-1">
                    {ticket.ghe.map(g => (
                      <span key={g} className="text-red-500 font-black text-sm">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-black mb-1">Tài khoản</p>
                  <p className="font-bold text-sm text-zinc-300">{user.ho_ten || 'Thành viên'}</p>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-zinc-700 text-center py-20 font-black uppercase italic text-2xl border-2 border-dashed border-zinc-900 rounded-3xl">
            Tài khoản này chưa có vé.
          </div>
        )}
      </div>
    </div>
  );
};

export default Vecuatoi;
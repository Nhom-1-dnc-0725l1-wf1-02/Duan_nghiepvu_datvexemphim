import React, { useEffect, useState } from 'react';

const KhuyenMai = () => {
  const [totalTickets, setTotalTickets] = useState(0);
  const [loading, setLoading] = useState(true);
  // Lấy thông tin user hiện tại
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchMemberData = async () => {
      // Chỉ fetch nếu có user đăng nhập
      if (user && user.id) {
        try {
          // GỌI DATABASE: Lấy vé theo đúng ID người dùng
          const response = await fetch(`http://localhost:5000/api/user-tickets/${user.id}`);
          const data = await response.json();

          if (Array.isArray(data)) {
            // ĐỒNG BỘ: Xóa cache cũ và ghi đè dữ liệu mới của đúng tài khoản này
            localStorage.removeItem('user_tickets');
            localStorage.setItem('user_tickets', JSON.stringify(data));
            
            setTotalTickets(data.length);
          }
        } catch (error) {
          console.error("Lỗi lấy dữ liệu từ DB:", error);
          // Dự phòng nếu lỗi mạng
          const localTickets = JSON.parse(localStorage.getItem('user_tickets') || '[]');
          setTotalTickets(localTickets.length);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [user?.id]); // Chạy lại nếu ID user thay đổi (đăng nhập acc khác)

  const getMembershipInfo = (count) => {
    if (count >= 50) return { rank: 'Kim cương', color: 'text-cyan-400', next: 'Max', discount: 20 };
    if (count >= 10) return { rank: 'Vàng', color: 'text-yellow-400', next: 50 - count, discount: 10 };
    return { rank: 'Bạc', color: 'text-zinc-400', next: 10 - count, discount: 0 };
  };

  const member = getMembershipInfo(totalTickets);

  if (loading) return <div className="text-center py-20 text-white animate-pulse uppercase font-black italic">Đang kiểm tra hạng thành viên...</div>;

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen text-white">
      <h2 className="text-3xl font-black italic uppercase border-l-8 border-red-600 pl-4 mb-12">
        Đặc quyền thành viên
      </h2>

      {/* Box trạng thái người dùng */}
      <div className="bg-gradient-to-r from-zinc-900 to-black p-10 rounded-[3rem] border border-zinc-800 mb-10 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 blur-[100px] rounded-full"></div>
        
        <p className="text-red-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Trạng thái của bạn</p>
        <h2 className={`text-7xl font-black italic uppercase mb-4 tracking-tighter ${member.color}`}>
          {member.rank}
        </h2>
        
        <div className="flex flex-col items-center gap-2">
            <p className="text-zinc-400 font-bold text-sm">
              {member.next === 'Max' 
                ? "Bạn đã đạt cấp độ cao nhất. Tận hưởng ưu đãi tối đa!" 
                : `Tài khoản ${user?.username} đã mua ${totalTickets} vé. Cần thêm ${member.next} vé nữa để thăng hạng.`}
            </p>
            {member.next !== 'Max' && (
                <div className="w-64 h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                    <div 
                        className="h-full bg-red-600 transition-all duration-1000 shadow-[0_0_10px_red]" 
                        style={{ width: `${(totalTickets / (member.rank === 'Bạc' ? 10 : 50)) * 100}%` }}
                    ></div>
                </div>
            )}
        </div>
      </div>

      {/* Grid danh sách các hạng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <BenefitCard rank="Bạc" desc="Mặc định" promo="Giá gốc" active={member.rank === 'Bạc'} />
        <BenefitCard rank="Vàng" desc="Trên 10 vé" promo="Giảm 10%" active={member.rank === 'Vàng'} />
        <BenefitCard rank="Kim cương" desc="Trên 50 vé" promo="Giảm 20%" active={member.rank === 'Kim cương'} />
      </div>
    </div>
  );
};

const BenefitCard = ({ rank, desc, promo, active }) => (
  <div className={`p-8 rounded-3xl border transition-all duration-500 ${
    active 
    ? 'bg-red-600/10 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.2)] scale-105 z-10' 
    : 'bg-zinc-900/50 border-zinc-800 opacity-40'
  }`}>
    <h3 className={`text-2xl font-black mb-2 italic uppercase ${active ? 'text-white' : 'text-zinc-500'}`}>{rank}</h3>
    <p className="text-zinc-400 text-[10px] font-bold mb-6 uppercase tracking-widest">{desc}</p>
    <div className={`text-xl font-black ${active ? 'text-red-500' : 'text-zinc-600'}`}>{promo}</div>
    {active && <div className="mt-4 text-[10px] bg-red-600 text-white w-fit px-3 py-1 rounded-full font-black animate-pulse">HẠNG HIỆN TẠI</div>}
  </div>
);

export default KhuyenMai;
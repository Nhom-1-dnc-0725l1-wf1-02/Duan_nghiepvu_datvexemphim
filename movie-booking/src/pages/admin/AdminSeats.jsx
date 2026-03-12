import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AdminSeats = () => {
  const [suatChieuId, setSuatChieuId] = useState("");
  const [lichChieu, setLichChieu] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [selectedSeatDetail, setSelectedSeatDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch dữ liệu từ Backend
  const fetchSeatData = useCallback(() => {
    if (!suatChieuId) return;
    setLoading(true);
    axios.get(`http://localhost:5000/api/admin/seats-detail/${suatChieuId}`)
      .then(res => {
        const data = res.data || [];
        setBookingData(data);
        
        // Cập nhật lại Panel chi tiết nếu đang chọn một ghế
        if (selectedSeatDetail) {
          const updatedSeat = data.find(s => s.ten_ghe === selectedSeatDetail.ten_ghe);
          setSelectedSeatDetail(updatedSeat || null);
        }
      })
      .catch(err => console.error("Lỗi fetch ghế:", err))
      .finally(() => setLoading(false));
  }, [suatChieuId, selectedSeatDetail]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/showtimes')
      .then(res => setLichChieu(res.data || []));
  }, []);

  useEffect(() => {
    if (suatChieuId) fetchSeatData();
    else {
        setBookingData([]);
        setSelectedSeatDetail(null);
    }
  }, [suatChieuId]);

  // 2. Hàm xử lý bảo trì
  const handleMaintenance = async (gheText, currentStatus) => {
    const actionText = currentStatus ? "Mở lại ghế này?" : "Xác nhận khóa bảo trì ghế này?";
    if (!window.confirm(actionText)) return;

    try {
      const response = await axios.post('http://localhost:5000/api/admin/toggle-seat-maintenance', {
        suatChieuId: parseInt(suatChieuId),
        gheText: gheText,
        isMaintenance: !currentStatus 
      });

      if (response.data.success) {
        alert(currentStatus ? "Đã mở lại ghế!" : "Đã khóa bảo trì!");
        fetchSeatData(); 
      }
    } catch (err) {
      alert(err.response?.data?.error || "Lỗi hệ thống!");
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-6 md:p-10 font-sans notranslate">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black border-l-4 border-red-600 pl-4 uppercase tracking-tighter italic">
          Hệ thống <span className="text-red-600">Quản lý ghế</span>
        </h2>
        {loading && <span className="text-[10px] animate-pulse text-red-500 font-bold uppercase">Đang đồng bộ dữ liệu...</span>}
      </div>

      {/* CHỌN SUẤT CHIẾU */}
      <div className="mb-10 bg-zinc-900/50 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
        <label className="block text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-widest">Chọn Suất Chiếu:</label>
        <select 
          className="w-full bg-black p-4 rounded-xl border border-zinc-800 text-sm font-bold focus:border-red-600 outline-none text-white cursor-pointer"
          onChange={(e) => setSuatChieuId(e.target.value)}
          value={suatChieuId}
        >
          <option value="">-- Click để chọn suất chiếu --</option>
          {lichChieu.map(lc => (
            <option key={lc.id} value={lc.id}>
              {lc.ten_phim} | {lc.ten_phong} | {new Date(lc.bat_dau).toLocaleString('vi-VN')}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* SƠ ĐỒ GHẾ */}
        <div className="col-span-12 lg:col-span-8 bg-zinc-900/20 p-8 rounded-[3rem] border border-white/5 relative">
          <div className="text-center mb-16">
            <div className="w-2/3 h-1 bg-zinc-800 mx-auto rounded-full mb-2"></div>
            <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[1em]">Màn hình</span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
            {bookingData.map((seat) => {
              // LOGIC HIỂN THỊ MÀU SẮC
              let seatClass = "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"; // Mặc định: Trống
              let icon = seat.ten_ghe;

              if (seat.is_booked) {
                seatClass = "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]";
                icon = "👤";
              } else if (seat.is_maintenance) {
                seatClass = "bg-yellow-600 text-black";
                icon = "🔧";
              }

              return (
                <button
                  key={seat.ten_ghe}
                  onClick={() => setSelectedSeatDetail(seat)}
                  className={`h-12 rounded-t-xl font-black text-[10px] transition-all duration-300 relative group
                    ${seatClass}
                    ${selectedSeatDetail?.ten_ghe === seat.ten_ghe ? 'ring-2 ring-white scale-110 z-10 shadow-2xl' : ''}
                  `}
                >
                  {icon}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[8px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                     {seat.ten_ghe}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CHI TIẾT & ĐIỀU KHIỂN */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-white/5 sticky top-10 shadow-2xl">
            <h3 className="text-xl font-black mb-8 uppercase italic border-l-4 border-red-600 pl-4 tracking-tighter">
              Chi tiết <span className="text-red-600">Ghế</span>
            </h3>
            
            {selectedSeatDetail ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-black/60 p-5 rounded-2xl border border-white/5">
                  <span className="text-zinc-500 font-black uppercase text-[10px]">Vị trí</span>
                  <b className="text-red-500 text-3xl">{selectedSeatDetail.ten_ghe}</b>
                </div>

                {/* TRƯỜNG HỢP 1: GHẾ ĐÃ ĐẶT (ƯU TIÊN CAO NHẤT) */}
                {selectedSeatDetail.is_booked ? (
                  <div className="space-y-4 bg-red-600/10 border border-red-600/20 p-5 rounded-2xl">
                    <div className="flex flex-col gap-1">
                      <span className="text-red-500 font-black text-[9px] uppercase">Trạng thái</span>
                      <b className="text-white text-lg uppercase tracking-tight">Đã bán (Confirmed)</b>
                    </div>
                    <div className="flex flex-col gap-1 border-t border-red-600/10 pt-3">
                      <span className="text-zinc-500 font-black text-[9px] uppercase">Khách hàng</span>
                      <b className="text-white text-lg">{selectedSeatDetail.customer?.name || 'Chưa cập nhật'}</b>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-500 font-black text-[9px] uppercase">Email liên hệ</span>
                      <b className="text-zinc-400 font-medium text-sm break-all">{selectedSeatDetail.customer?.email || 'N/A'}</b>
                    </div>
                    <p className="text-[9px] text-red-400 italic text-center">Ghế đã có giao dịch, không thể sửa trạng thái bảo trì.</p>
                  </div>
                ) : (
                  /* TRƯỜNG HỢP 2: GHẾ TRỐNG HOẶC ĐANG BẢO TRÌ */
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-800 rounded-2xl border border-white/5 text-center">
                       <span className="text-zinc-500 font-black uppercase text-[10px]">Trạng thái: </span>
                       <b className={selectedSeatDetail.is_maintenance ? 'text-yellow-500' : 'text-green-500'}>
                        {selectedSeatDetail.is_maintenance ? 'ĐANG BẢO TRÌ' : 'SẴN SÀNG'}
                       </b>
                    </div>

                    <button 
                      onClick={() => handleMaintenance(selectedSeatDetail.ten_ghe, selectedSeatDetail.is_maintenance)}
                      className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all
                        ${selectedSeatDetail.is_maintenance 
                          ? 'bg-green-600 hover:bg-green-500 text-white' 
                          : 'bg-yellow-600 hover:bg-yellow-500 text-black'}`}
                    >
                      {selectedSeatDetail.is_maintenance ? "✅ Mở lại ghế" : "⚠️ Khóa bảo trì"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center opacity-30 uppercase font-black text-[10px] tracking-widest">
                Chọn ghế để quản lý
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSeats;
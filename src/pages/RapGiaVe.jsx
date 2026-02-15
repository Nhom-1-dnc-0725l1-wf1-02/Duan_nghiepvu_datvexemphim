import React from 'react';

const RapGiaVe = () => {
  const priceList = [
    { type: "Người lớn", price: "90.000đ", note: "Thứ 2 - Thứ 5" },
    { type: "Học sinh/Sinh viên", price: "70.000đ", note: "Mọi ngày (Cần thẻ HSSV)" },
    { type: "Trẻ em", price: "60.000đ", note: "Dưới 1m3" },
    { type: "Cuối tuần / Lễ", price: "110.000đ", note: "Thứ 6 - Chủ nhật" },
  ];

  return (
    <div className="container mx-auto px-6 py-10 max-w-4xl">
      <h2 className="text-3xl font-black italic uppercase border-l-8 border-red-600 pl-4 mb-12 text-center md:text-left">Hệ thống rạp & Giá vé</h2>
      
      <div className="grid gap-6">
        {priceList.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-6 bg-zinc-900 rounded-2xl border-l-4 border-red-600">
            <div>
              <h4 className="font-black text-xl text-white">{item.type}</h4>
              <p className="text-zinc-500 text-xs italic mt-1">{item.note}</p>
            </div>
            <div className="text-2xl font-black text-red-500">{item.price}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-zinc-950 rounded-3xl border border-white/5">
        <h3 className="font-bold text-red-600 mb-4 uppercase tracking-widest text-sm italic">Lưu ý quan trọng</h3>
        <ul className="text-zinc-400 text-sm space-y-3 list-disc pl-4">
          <li>Mỗi ghế chỉ dành cho 1 vé.</li>
          <li>Giữ ghế tối đa 10 phút khi chưa thanh toán.</li>
          <li>Vé đã thanh toán không hoàn sau giờ chiếu.</li>
        </ul>
      </div>
    </div>
  );
};

export default RapGiaVe;
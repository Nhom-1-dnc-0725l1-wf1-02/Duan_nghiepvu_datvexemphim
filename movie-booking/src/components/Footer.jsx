import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-zinc-900 px-12 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="text-2xl font-black text-red-600 mb-6 uppercase">NOIR CINEMA</div>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">Hệ thống hỗ trợ đặt vé phim trực tuyến hiện đại, nhanh chóng và an toàn.</p>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-zinc-300 uppercase text-xs tracking-widest">Quy định</h4>
          <ul className="text-zinc-500 text-sm space-y-3 font-medium">
            <li><Link to="/rap-gia-ve" className="hover:text-red-500 transition">Giá vé & Suất chiếu</Link></li>
            <li><Link to="/rap-gia-ve" className="hover:text-red-500 transition">Điều khoản chung</Link></li>
          </ul>
        </div>
        <div className="text-right md:text-left">
          <h4 className="font-bold mb-6 text-zinc-300 uppercase text-xs tracking-widest">Liên hệ</h4>
          <p className="text-2xl font-black text-white italic mb-2">1900 66xx</p>
          <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">Tổng đài hỗ trợ 24/7</p>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-zinc-900 text-center text-zinc-700 text-[10px] tracking-[0.3em] uppercase font-black">
        © 2026 CODEGYM PROJECT - Nhóm 1
      </div>
    </footer>
  );
};

export default Footer;
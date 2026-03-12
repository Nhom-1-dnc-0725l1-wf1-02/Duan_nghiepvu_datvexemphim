import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xác định hạng thành viên - Đã ép kiểu Number để tránh lỗi so sánh
  const getRank = (totalTickets) => {
    const tickets = Number(totalTickets); 
    if (tickets >= 20) return { name: 'Kim Cương', color: 'text-blue-400' };
    if (tickets >= 10) return { name: 'Vàng', color: 'text-yellow-500' };
    if (tickets >= 5) return { name: 'Bạc', color: 'text-zinc-300' };
    return { name: 'Đồng', color: 'text-orange-700' };
  };

  if (loading) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-red-600 font-black animate-pulse tracking-widest uppercase">
            ĐANG TRUY XUẤT DỮ LIỆU KHÁCH HÀNG...
        </div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-white p-6 md:p-10">
      <h2 className="text-3xl font-black mb-8 italic uppercase border-l-4 border-red-600 pl-4">
        Quản Lý Khách Hàng <span className="text-zinc-600 text-sm ml-2">({users.length})</span>
      </h2>

      <div className="bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-800/50 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="p-6">Mã khách</th>
                <th className="p-6">Thông tin chi tiết</th>
                <th className="p-6 text-center">Hoạt động</th>
                <th className="p-6 text-center">Phân hạng rạp</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const rank = getRank(user.tong_ve_da_mua || 0);
                return (
                  <tr key={user.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-all group">
                    <td className="p-6 text-zinc-600 font-mono text-xs">#{user.id}</td>
                    <td className="p-6">
                      <div className="font-black uppercase tracking-tight text-zinc-200 group-hover:text-red-500 transition-colors">
                        {user.ho_ten}
                      </div>
                      <div className="text-xs text-zinc-500 lowercase">{user.email}</div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex flex-col">
                         <span className="text-2xl font-black text-white leading-none">
                           {user.tong_ve_da_mua || 0}
                         </span>
                         <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-tighter">Vé đã mua</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className={`px-4 py-1 rounded-full border border-current inline-block ${rank.color} bg-current/5`}>
                         <span className="font-black italic uppercase text-[11px] drop-shadow-md">
                           {rank.name}
                         </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="p-20 text-center text-zinc-600 italic uppercase text-xs tracking-widest font-bold">
            Dữ liệu trống.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
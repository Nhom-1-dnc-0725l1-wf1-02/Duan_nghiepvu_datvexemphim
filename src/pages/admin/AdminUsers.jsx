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
      // Giả sử bạn có API này trong backend
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xác định hạng thành viên nhanh
  const getRank = (totalTickets) => {
    if (totalTickets >= 20) return { name: 'Kim Cương', color: 'text-blue-400' };
    if (totalTickets >= 10) return { name: 'Vàng', color: 'text-yellow-500' };
    if (totalTickets >= 5) return { name: 'Bạc', color: 'text-zinc-300' };
    return { name: 'Đồng', color: 'text-orange-700' };
  };

  if (loading) return <div className="p-10 text-red-600 font-black">ĐANG TẢI DỮ LIỆU...</div>;

  return (
    <div className="bg-black min-h-screen text-white p-6 md:p-10">
      <h2 className="text-3xl font-black mb-8 italic uppercase border-l-4 border-red-600 pl-4">
        Quản Lý Khách Hàng
      </h2>

      <div className="bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-800/50 text-zinc-500 text-xs uppercase tracking-[0.2em]">
              <th className="p-6">ID</th>
              <th className="p-6">Họ Tên</th>
              <th className="p-6">Email</th>
              <th className="p-6 text-center">Tổng Vé</th>
              <th className="p-6 text-center">Hạng</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const rank = getRank(user.tong_ve_da_mua || 0);
              return (
                <tr key={user.id} className="border-t border-white/5 hover:bg-white/5 transition-all group">
                  <td className="p-6 text-zinc-600 font-mono">#{user.id}</td>
                  <td className="p-6 font-bold uppercase tracking-tight text-zinc-200">
                    {user.ho_ten}
                  </td>
                  <td className="p-6 text-zinc-400">{user.email}</td>
                  <td className="p-6 text-center">
                    <span className="bg-zinc-800 px-4 py-1 rounded-full text-white font-black">
                      {user.tong_ve_da_mua || 0}
                    </span>
                  </td>
                  <td className="p-6 text-center font-black italic uppercase">
                    <span className={`${rank.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`}>
                      {rank.name}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="p-20 text-center text-zinc-600 italic">
            Chưa có người dùng nào đăng ký hệ thống.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
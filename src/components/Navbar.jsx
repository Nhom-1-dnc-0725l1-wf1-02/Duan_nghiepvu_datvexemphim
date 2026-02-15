import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Lưu từ khóa tìm kiếm

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi đọc dữ liệu user:", error);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Xử lý khi nhấn Enter để tìm kiếm
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== "") {
      navigate(`/?search=${searchTerm}`); // Chuyển hướng về trang chủ với query tìm kiếm
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-black text-red-600 tracking-tighter hover:opacity-90 transition shrink-0">
        NOIR <span className="text-white">CINEMA</span>
      </Link>
      
      {/* Menu trung tâm & Search */}
      <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider">
        <Link to="/lich-chieu" className={`${isActive('/lich-chieu') ? 'text-red-600' : 'text-zinc-400'} hover:text-red-500 transition`}>
          Lịch chiếu
        </Link>
        <Link to="/" className={`${isActive('/') ? 'text-red-600' : 'text-zinc-400'} hover:text-red-500 transition`}>
          Phim hay
        </Link>
        <Link to="/khuyen-mai" className={`${isActive('/khuyen-mai') ? 'text-red-600' : 'text-zinc-400'} hover:text-red-500 transition`}>
          Khuyến mãi
        </Link>
        <Link to="/ve-cua-toi" className={`${isActive('/ve-cua-toi') ? 'text-red-600' : 'text-zinc-400'} hover:text-red-500 transition`}>
          Vé của tôi
        </Link>

        {/* Thanh tìm kiếm nhỏ gọn */}
        <div className="relative ml-4">
          <input 
            type="text" 
            placeholder="Tìm tên phim..." 
            className="bg-zinc-900 border border-zinc-700 rounded-full py-1.5 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600 w-48 transition-all focus:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
          <svg className="absolute right-3 top-2 w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>

      {/* Cụm người dùng */}
      <div className="flex gap-4 items-center shrink-0">
        {user ? (
          <div className="flex items-center gap-6">
            {/* Nếu là Admin thì hiện thêm nút Quản trị */}
            {user.vai_tro_id === 2 && (
              <Link to="/admin" className="text-[10px] bg-red-600 text-white px-2 py-1 rounded font-black hover:bg-white hover:text-red-600 transition">ADMIN</Link>
            )}
            
            <Link to="/profile" className="flex flex-col items-end leading-none group cursor-pointer">
              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-1 group-hover:text-red-500 transition">Thành viên</span>
              <span className="text-sm font-black text-white italic uppercase tracking-tighter group-hover:text-red-600 transition">{user.ten}</span>
            </Link>
            
            <button onClick={handleLogout} className="group flex items-center gap-2 text-zinc-500 hover:text-red-600 transition" title="Đăng xuất">
              <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center group-hover:border-red-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </div>
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-sm font-bold border border-zinc-700 px-5 py-2 rounded-full hover:bg-white hover:text-black transition text-white uppercase tracking-tighter">Đăng nhập</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; 

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Booking from './pages/Booking';
import LichChieu from './pages/LichChieu';
import KhuyenMai from './pages/KhuyenMai';
import VeCuaToi from './pages/Vecuatoi';
import Login from './pages/Login';
import Register from './pages/Register';
import ThanhToan from './pages/ThanhToan'; // Trang thanh toán mới
import Profile from './pages/Profile';
import LoginAdmin from './pages/admin/LoginAdmin';
import Dashboard from './pages/admin/Dashboard';
import AdminMovies from './pages/admin/AdminMovies';
import AdminShowtimes from './pages/admin/AdminShowtimes';
import AdminUsers from './pages/admin/AdminUsers';
const GOOGLE_CLIENT_ID = "286931495657-kfjbv8sv5pg46bsvvkbnajnp1iebqq8g.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Trang chủ hiển thị danh sách phim */}
            <Route index element={<Home />} />
            
            {/* Luồng đặt vé: Lịch chiếu -> Chọn ghế -> Thanh toán */}
            <Route path="lich-chieu" element={<LichChieu />} />
            <Route path="booking/:id" element={<Booking />} />
            <Route path="thanh-toan" element={<ThanhToan />} />
            
            {/* Các dịch vụ và thông tin khác */}
            <Route path="khuyen-mai" element={<KhuyenMai />} />
            <Route path="ve-cua-toi" element={<VeCuaToi />} />
            
            {/* Tài khoản */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
          </Route>
<Route path="/admin/login" element={<LoginAdmin />} />
<Route path="/admin/dashboard" element={<Dashboard />} /> 
<Route path="/admin/movies" element={<AdminMovies />} /> 
<Route path="/admin/showtimes" element={<AdminShowtimes />} />
<Route path="/admin/users" element={<AdminUsers />} />
          {/* Chuyển hướng các đường dẫn lạ về trang chủ */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
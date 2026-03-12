import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-cinema-black">
      <Navbar /> {/* Gọi Navbar ở đây */}
      
      <main>
        <Outlet /> {/* Nội dung các trang con (Home, LichChieu...) hiện ở đây */}
      </main>

      <Footer /> {/* Gọi Footer ở đây */}
    </div>
  );
};

export default MainLayout;
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const adminRouter = require('./routes/admin.cjs');
const authRoutes = require('../backend/routes/auth.cjs'); 

dotenv.config();
const app = express();

// --- 1. MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 

// --- 2. STATIC FILES ---
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// --- 3. KẾT NỐI DATABASE ---
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'rap_chieu_phim',
  waitForConnections: true,
  connectionLimit: 10
}).promise();

pool.query("SELECT 1")
  .then(() => console.log('✅ Đã kết nối MySQL thành công!'))
  .catch(err => console.error('❌ Lỗi kết nối Database:', err.message));

// --- 4. KHAI BÁO CÁC ROUTE (API) ---

app.get('/', (req, res) => res.send('SERVER ĐANG CHẠY 🚀'));

// Route Admin và Auth
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRoutes);

// 1. API lấy danh sách phim
app.get('/api/phim', async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM phim");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. API Lịch chiếu (ĐÃ THÊM LẠI VÀ SỬA LỖI 404)
app.get('/api/lich-chieu', async (req, res) => {
  try {
    // Đã loại bỏ WHERE sc.bat_dau >= CURDATE() để hiện data năm 2026 của bạn
    const sql = `
      SELECT p.id, p.ten, p.hinh_anh, p.thoi_luong, p.the_loai,
             sc.id AS suat_chieu_id, 
             DATE_FORMAT(sc.bat_dau, '%Y-%m-%d %H:%i:%s') AS bat_dau, 
             sc.ket_thuc, sc.phong_chieu_id
      FROM phim p
      INNER JOIN suat_chieu sc ON p.id = sc.phim_id
      ORDER BY sc.bat_dau ASC`;

    const [rows] = await pool.execute(sql);
    
    // Gom nhóm dữ liệu theo phim
    const moviesWithShowtimes = rows.reduce((acc, row) => {
      const { id, ten, hinh_anh, thoi_luong, the_loai, ...showtime } = row;
      if (!acc[id]) {
        acc[id] = { 
          id, 
          ten, 
          hinh_anh: hinh_anh?.trim() || '', 
          thoi_luong, 
          the_loai, 
          showtimes: [] 
        };
      }
      acc[id].showtimes.push(showtime);
      return acc;
    }, {});

    res.json(Object.values(moviesWithShowtimes));
  } catch (err) {
    console.error("Lỗi API Lịch chiếu:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. API Đặt vé
app.post('/api/dat-ve', async (req, res) => {
  const { user_id, suat_chieu_id, seats, total_price, movie_info } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [resHD] = await connection.execute(
      `INSERT INTO hoa_don (nguoi_dung_id, tong_tien, trang_thai, ngay_tao) VALUES (?, ?, 'đã thanh toán', NOW())`,
      [user_id, total_price]
    );
    for (const seat of seats) {
      await connection.execute(
        `INSERT INTO ve (suat_chieu_id, nguoi_dung_id, trang_thai, ten_phim, ngay_chieu, suat_chieu, ghe_text) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [suat_chieu_id, user_id, 'da_ban', movie_info.ten, movie_info.ngay, movie_info.gio, seat]
      );
    }
    await connection.execute(
      `UPDATE nguoi_dung SET tong_ve_da_mua = tong_ve_da_mua + ? WHERE id = ?`,
      [seats.length, user_id]
    );
    await connection.commit();
    res.json({ success: true, message: "Đặt vé thành công!" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
});

// 4. API Lấy ghế đã bán
app.get('/api/all-booked-tickets', async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT suat_chieu_id, ghe_text FROM ve WHERE trang_thai = 'da_ban'");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy danh sách ghế đã bán" });
  }
});

// 5. API Lấy vé của User
app.get('/api/user-tickets/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.execute(
      "SELECT * FROM ve WHERE nguoi_dung_id = ? ORDER BY id DESC", 
      [userId]
    );
    res.json(rows); 
  } catch (err) {
    res.status(500).json({ error: "Lỗi Server", message: err.message });
  }
});
// --- API QUẢN LÝ NGƯỜI DÙNG CHO ADMIN ---
app.get('/api/admin/users', async (req, res) => {
  try {
    // Truy vấn lấy danh sách người dùng và sắp xếp theo số vé đã mua giảm dần
    // Đảm bảo tên bảng là 'nguoi_dung' giống trong Database của bạn
    const [rows] = await pool.execute(
      "SELECT id, ho_ten, email, tong_ve_da_mua FROM nguoi_dung ORDER BY tong_ve_da_mua DESC"
    );
    
    console.log("Đã gửi danh sách người dùng cho Admin");
    res.json(rows);
  } catch (err) {
    console.error("LỖI SQL ADMIN USERS:", err.message);
    res.status(500).json({ error: "Lỗi Server", details: err.message });
  }
});
// --- 5. KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
});

module.exports = app;
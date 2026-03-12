const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const adminRouter = require('./routes/admin.cjs');
const authRoutes = require('./routes/auth.cjs'); 

dotenv.config();
const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'rap_chieu_phim',
  waitForConnections: true,
  connectionLimit: 10
}).promise();

// Kiểm tra kết nối
pool.query("SELECT 1")
  .then(() => console.log('✅ MySQL Connected!'))
  .catch(err => console.error('❌ MySQL Error:', err.message));

// --- API ROUTES ---

// 1. API Lấy danh sách phim
// 1. API Lấy danh sách phim (Đã thêm tính điểm trung bình)
app.get('/api/phim', async (req, res) => {
  try {
    const sql = `
      SELECT p.*, 
             IFNULL(AVG(dg.diem), 0) as diem_trung_binh, 
             COUNT(dg.id) as luot_danh_gia
      FROM phim p
      LEFT JOIN danh_gia dg ON p.id = dg.phim_id
      GROUP BY p.id`;
    const [rows] = await pool.execute(sql);
    res.json(rows);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// 2. API Lịch chiếu
app.get('/api/lich-chieu', async (req, res) => {
  try {
    const sql = `
      SELECT p.id, p.ten, p.hinh_anh, p.thoi_luong, p.the_loai,
             sc.id AS suat_chieu_id, sc.bat_dau, sc.phong_chieu_id
      FROM phim p
      INNER JOIN suat_chieu sc ON p.id = sc.phim_id
      ORDER BY sc.bat_dau ASC`;
    const [rows] = await pool.execute(sql);
    const result = rows.reduce((acc, row) => {
      if (!acc[row.id]) acc[row.id] = { ...row, showtimes: [] };
      acc[row.id].showtimes.push({ id: row.suat_chieu_id, bat_dau: row.bat_dau, phong: row.phong_chieu_id });
      return acc;
    }, {});
    res.json(Object.values(result));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. API CHI TIẾT ĐẶT VÉ
// Sửa API số 3 trong server.cjs
// Sửa lại API số 3 trong server.cjs
app.get('/api/booking-details/:id', async (req, res) => {
    const inputId = req.params.id; 
    try {
        // Tìm theo ID suất chiếu trước, nếu không có thì tìm theo phim_id
        let [scRows] = await pool.execute(`
            SELECT sc.id, sc.bat_dau, p.ten AS ten_phim, p.id AS phim_id, sc.phong_chieu_id
            FROM suat_chieu sc
            JOIN phim p ON sc.phim_id = p.id
            WHERE sc.id = ? OR p.id = ?
            ORDER BY (sc.id = ?) DESC, sc.bat_dau DESC LIMIT 1`, [inputId, inputId, inputId]);

        if (scRows.length === 0) return res.status(404).json({ message: "Không tìm thấy suất chiếu" });

        const activeId = scRows[0].id; // Đây là ID thật sự sẽ dùng để lấy ghế
        console.log("Đang lấy ghế cho Suất Chiếu ID:", activeId);

        const [booked] = await pool.execute("SELECT ghe_text FROM ve WHERE suat_chieu_id = ?", [activeId]);
        const [maint] = await pool.execute("SELECT ghe_text FROM bao_tri_ghe WHERE suat_chieu_id = ?", [activeId]);

        res.json({
            info: { ...scRows[0], ten_phong: `Phòng ${scRows[0].phong_chieu_id}` },
            // Quan trọng: Trả về mảng chữ viết hoa để Frontend so sánh cho dễ
            reservedSeats: booked.map(r => r.ghe_text ? r.ghe_text.toString().toUpperCase() : ""),
            maintenanceSeats: maint.map(r => r.ghe_text ? r.ghe_text.toString().toUpperCase() : "")
        });
    } catch (err) { 
        console.error("Lỗi lấy ghế:", err.message);
        res.status(500).json({ error: err.message }); 
    }
});
// 4. API LẤY ĐÁNH GIÁ CỦA PHIM
// API GỬI ĐÁNH GIÁ (POST) - Đã khớp cột 'ngay_tao'
app.post('/api/danh-gia', async (req, res) => {
  const { nguoi_dung_id, phim_id, ten_phim, diem, binh_luan } = req.body;

  if (!nguoi_dung_id || !diem) {
    return res.status(400).json({ message: "Thiếu thông tin đánh giá!" });
  }

  try {
    let finalPhimId = phim_id;

    // Tìm ID phim nếu Frontend chỉ gửi tên
    if (!finalPhimId && ten_phim) {
      const [phim] = await pool.execute("SELECT id FROM phim WHERE ten = ? LIMIT 1", [ten_phim]);
      if (phim.length > 0) finalPhimId = phim[0].id;
    }

    if (!finalPhimId) {
      return res.status(404).json({ message: "Không tìm thấy phim!" });
    }

    // Câu lệnh INSERT khớp 100% với các cột: phim_id, nguoi_dung_id, diem, binh_luan, ngay_tao
    const sql = `INSERT INTO danh_gia (phim_id, nguoi_dung_id, diem, binh_luan, ngay_tao) 
                 VALUES (?, ?, ?, ?, NOW())`;
    
    await pool.execute(sql, [finalPhimId, nguoi_dung_id, diem, binh_luan]);

    res.json({ success: true, message: "Đánh giá thành công! Cảm ơn mày nhé. ⭐" });
  } catch (err) {
    console.error("Lỗi POST đánh giá:", err.message);
    res.status(500).json({ message: "Lỗi Server: " + err.message });
  }
});
app.get('/api/danh-gia/:phimId', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT dg.*, nd.ten as nguoi_dung 
            FROM danh_gia dg 
            JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id 
            WHERE dg.phim_id = ? 
            ORDER BY dg.ngay_tao DESC`, [req.params.phimId]);
        
        console.log("Đánh giá tìm thấy:", rows.length); // Log để check terminal
        res.json(rows);
    } catch (err) { 
        console.error("Lỗi API đánh giá:", err.message);
        res.json([]); 
    } 
});
// 5. API ĐẶT VÉ (Bản Fix lỗi 500 - Khớp cấu trúc DB của bạn)
// Cập nhật API ĐẶT VÉ trong server.js
// 5. API ĐẶT VÉ (Bản chuẩn hóa dữ liệu ghế)
app.post('/api/dat-ve', async (req, res) => {
  const { user_id, suat_chieu_id, seats, total_price, movie_info } = req.body;
  
  if (!user_id || !suat_chieu_id || !seats || !seats.length) {
    return res.status(400).json({ success: false, error: "Thiếu dữ liệu đặt vé" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Tạo hóa đơn
    await conn.execute(
        "INSERT INTO hoa_don (nguoi_dung_id, tong_tien, trang_thai, ngay_tao) VALUES (?, ?, 'đã thanh toán', NOW())", 
        [user_id, total_price]
    );

    // 2. Chèn vào bảng ve
    for (const s of seats) {
      // CHUẨN HÓA GHẾ: Bỏ cách, viết hoa
      const cleanSeat = s.toString().trim().toUpperCase();

      const sql = `
        INSERT INTO ve 
        (suat_chieu_id, nguoi_dung_id, trang_thai, ten_phim, ngay_chieu, suat_chieu, ghe_text, gia) 
        VALUES (?, ?, 'da_ban', ?, ?, ?, ?, ?)`;
      
      await conn.execute(sql, [
        suat_chieu_id, 
        user_id, 
        movie_info.ten, 
        movie_info.ngay, 
        movie_info.gio, 
        cleanSeat, 
        (total_price / seats.length)
      ]);
    }

    await conn.commit();
    console.log(`✅ Đã đặt thành công ${seats.length} ghế cho suất chiếu ${suat_chieu_id}`);
    res.json({ success: true });
  } catch (err) { 
    await conn.rollback(); 
    console.error("❌ LỖI ĐẶT VÉ:", err.message); 
    res.status(500).json({ success: false, error: err.message }); 
  } finally { 
    conn.release(); 
  }
});
// 6. API LẤY VÉ USER
app.get('/api/user-tickets/:userId', async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM ve WHERE nguoi_dung_id = ? ORDER BY id DESC", [req.params.userId]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// API Thống kê doanh thu theo thời gian
app.get('/api/admin/thong-ke-doanh-thu', async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Vui lòng chọn đầy đủ từ ngày nào đến ngày nào!" });
  }

  try {
    const sql = `
      SELECT 
        DATE(ngay_tao) as ngay, 
        SUM(tong_tien) as doanh_thu,
        COUNT(id) as so_don_hang
      FROM hoa_don
      WHERE ngay_tao BETWEEN ? AND ?
      GROUP BY DATE(ngay_tao)
      ORDER BY ngay ASC
    `;
    
    // Thêm giờ vào để query chính xác từ 00:00:00 ngày đầu đến 23:59:59 ngày cuối
    const [rows] = await pool.execute(sql, [`${startDate} 00:00:00`, `${endDate} 23:59:59`]);
    
    // Tính tổng cộng cuối cùng
    const total = rows.reduce((sum, row) => sum + parseFloat(row.doanh_thu), 0);
    const totalOrders = rows.reduce((sum, row) => sum + row.so_don_hang, 0);

    res.json({
      success: true,
      data: rows,
      summary: {
        tong_doanh_thu: total,
        tong_don_hang: totalOrders
      }
    });
  } catch (err) {
    console.error("Lỗi thống kê:", err.message);
    res.status(500).json({ error: err.message });
  }
});app.use(express.static(path.join(__dirname, 'public')));
// API Thống kê doanh thu theo PHIM
app.get('/api/admin/thong-ke-phim', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    let sql = `
      SELECT 
        ten_phim, 
        SUM(gia) as doanh_thu,
        COUNT(id) as so_ve_ban_duoc
      FROM ve
      WHERE trang_thai = 'da_ban'
    `;
    
    const params = [];
    if (startDate && endDate) {
      // Giả sử bảng ve có cột ngay_tao hoặc ngay_dat
      sql += ` AND ngay_tao BETWEEN ? AND ? `;
      params.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
    }

    sql += ` GROUP BY ten_phim ORDER BY doanh_thu DESC`;
    
    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// API Lấy danh sách người dùng kèm tổng số vé đã mua
app.get('/api/admin/users', async (req, res) => {
  try {
    const sql = `
      SELECT 
        nd.id, 
        nd.ten, 
        nd.email, 
        COUNT(v.id) as tong_ve_da_mua
      FROM nguoi_dung nd
      LEFT JOIN ve v ON nd.id = v.nguoi_dung_id
      GROUP BY nd.id
      ORDER BY tong_ve_da_mua DESC
    `;
    const [rows] = await pool.execute(sql);
    res.json(rows);
  } catch (err) {
    console.error("Lỗi SQL lấy users:", err.message);
    res.status(500).json({ error: err.message });
  }
});
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running: http://localhost:${PORT}`));

module.exports = app;
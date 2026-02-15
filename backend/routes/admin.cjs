const express = require("express");
const router = express.Router();
const db = require("../db.cjs");

// 1. Lấy thống kê cho Dashboard
router.get("/stats", (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM phim) as totalMovies,
      (SELECT COUNT(*) FROM suat_chieu WHERE DATE(bat_dau) = CURDATE()) as todayShowtimes,
      (SELECT COUNT(*) FROM nguoi_dung) as totalUsers
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
});

// 2. Quản lý Phim
router.get("/movies", (req, res) => {
  db.query("SELECT * FROM phim", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

router.post("/movies", (req, res) => {
  const { ten, hinh_anh, thoi_luong, the_loai } = req.body;
  const sql = "INSERT INTO phim (ten, hinh_anh, thoi_luong, the_loai) VALUES (?, ?, ?, ?)";
  db.query(sql, [ten, hinh_anh, thoi_luong, the_loai], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

router.delete("/movies/:id", (req, res) => {
  db.query("DELETE FROM phim WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// 3. Quản lý Suất Chiếu (Sửa lại dùng Callback để đồng bộ)
router.post('/showtimes', (req, res) => {
  const { phim_id, phong_chieu_id, bat_dau } = req.body;
  const sql = `INSERT INTO suat_chieu (phim_id, phong_chieu_id, bat_dau, ket_thuc) 
               VALUES (?, ?, ?, DATE_ADD(?, INTERVAL 135 MINUTE))`;
  
  db.query(sql, [phim_id, phong_chieu_id, bat_dau, bat_dau], (err, result) => {
    if (err) {
      console.error("Lỗi thêm suất chiếu:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: "Thêm suất chiếu thành công!", data: result });
  });
});

// 4. Quản lý Người Dùng (Sửa lỗi 500 bằng cách dùng Callback)
router.get('/users', (req, res) => {
  const sql = "SELECT id, ten, email, tong_ve_da_mua FROM nguoi_dung ORDER BY tong_ve_da_mua DESC";
  
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi lấy danh sách người dùng:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

module.exports = router;
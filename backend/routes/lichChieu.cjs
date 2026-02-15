const express = require("express");
const router = express.Router();
const db = require("../db.cjs");

router.get("/", (req, res) => {
  // BỎ TOÀN BỘ ĐIỀU KIỆN WHERE ĐỂ HIỆN DATA CŨ (2026-02-11)
  const sql = `
    SELECT 
      sc.id AS suat_chieu_id,
      sc.phim_id,
      sc.phong_chieu_id,
      DATE_FORMAT(sc.bat_dau, '%Y-%m-%d %H:%i:%s') AS bat_dau,
      p.ten,
      p.hinh_anh,
      p.thoi_luong,
      p.the_loai
    FROM suat_chieu sc
    INNER JOIN phim p ON sc.phim_id = p.id
    ORDER BY sc.bat_dau ASC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi SQL:", err);
      return res.status(500).json(err);
    }

    // Kiểm tra log ở Terminal (Cửa sổ chạy node server)
    console.log("Tìm thấy số suất chiếu khớp với phim:", rows.length);

    const moviesMap = {};
    rows.forEach(row => {
      const pId = row.phim_id;
      if (!moviesMap[pId]) {
        moviesMap[pId] = {
          id: pId,
          ten: row.ten,
          hinh_anh: row.hinh_anh,
          thoi_luong: row.thoi_luong,
          the_loai: row.the_loai,
          showtimes: []
        };
      }
      moviesMap[pId].showtimes.push({
        suat_chieu_id: row.suat_chieu_id,
        bat_dau: row.bat_dau,
        phong_chieu_id: row.phong_chieu_id
      });
    });

    res.json(Object.values(moviesMap));
  });
});

module.exports = router;
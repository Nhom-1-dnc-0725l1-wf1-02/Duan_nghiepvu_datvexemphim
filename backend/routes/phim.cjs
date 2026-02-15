const express = require("express");
const router = express.Router();
const db = require("../db.cjs");

// GET /api/phim
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      id,
      ten,
      the_loai,
      dao_dien,
      dien_vien,
      ngon_ngu,
      thoi_luong,
      hinh_anh,
    FROM phim
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ✅ GET /api/phim/trang-thai/:trangThai (PHẢI ĐỂ TRƯỚC)
router.get("/trang-thai/:trangThai", (req, res) => {
  db.query(
    "SELECT * FROM phim WHERE trang_thai = ?",
    [req.params.trangThai],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

// GET /api/phim/:id
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM phim WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (rows.length === 0)
        return res.status(404).json({ message: "Không tìm thấy phim" });

      res.json(rows[0]);
    }
  );
});

module.exports = router;

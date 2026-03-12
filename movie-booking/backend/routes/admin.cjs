const express = require("express");
const router = express.Router();
const db = require("../db.cjs");

// ==========================================
// 1. THỐNG KÊ & DASHBOARD
// ==========================================
router.get("/stats", (req, res) => {
    const sql = `
    SELECT 
      (SELECT COUNT(*) FROM phim) as totalMovies,
      (SELECT COUNT(*) FROM suat_chieu WHERE DATE(bat_dau) = CURDATE()) as todayShowtimes,
      (SELECT COUNT(*) FROM nguoi_dung) as totalUsers,
      (SELECT IFNULL(SUM(tong_tien), 0) FROM hoa_don) as totalRevenue,
      (SELECT COUNT(*) FROM ve v 
       JOIN suat_chieu sc ON v.suat_chieu_id = sc.id 
       WHERE DATE(sc.bat_dau) = CURDATE()) as ticketsSoldToday
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result[0]);
    });
});

// ==========================================
// 2. QUẢN LÝ PHIM (Movies)
// ==========================================
router.get("/movies", (req, res) => {
    db.query("SELECT * FROM phim ORDER BY id DESC", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

router.post("/movies", (req, res) => {
    const { ten, hinh_anh, thoi_luong, the_loai, do_tuoi_gioi_han, mo_ta } = req.body;
    const sql = "INSERT INTO phim (ten, hinh_anh, thoi_luong, the_loai, do_tuoi_gioi_han, mo_ta) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [ten, hinh_anh, thoi_luong, the_loai, do_tuoi_gioi_han, mo_ta], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, insertId: result.insertId });
    });
});

router.delete("/movies/:id", (req, res) => {
    db.query("DELETE FROM phim WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// ==========================================
// 3. QUẢN LÝ SUẤT CHIẾU (Showtimes)
// ==========================================
router.get("/showtimes", (req, res) => {
    const sql = `
        SELECT sc.*, p.ten as ten_phim, CONCAT('Phòng ', sc.phong_chieu_id) as ten_phong
        FROM suat_chieu sc
        JOIN phim p ON sc.phim_id = p.id
        ORDER BY sc.bat_dau DESC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

router.post('/showtimes', (req, res) => {
    const { phim_id, phong_chieu_id, bat_dau } = req.body;
    const sql = `INSERT INTO suat_chieu (phim_id, phong_chieu_id, bat_dau, ket_thuc) 
                 VALUES (?, ?, ?, DATE_ADD(?, INTERVAL 135 MINUTE))`;
    db.query(sql, [phim_id, phong_chieu_id, bat_dau, bat_dau], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Thêm suất chiếu thành công!" });
    });
});

// ==========================================
// 4. QUẢN LÝ GHẾ & BẢO TRÌ (Seats Management)
// ==========================================

/**
 * Lấy sơ đồ 60 ghế kèm trạng thái: Trống, Đã đặt, Bảo trì.
 * Phù hợp cho cả trang Admin và trang Booking người dùng.
 */
router.get('/seats-detail/:suatChieuId', (req, res) => {
    const { suatChieuId } = req.params;

    const sqlVe = `
        SELECT v.ghe_text, u.ten, u.email 
        FROM ve v 
        JOIN nguoi_dung u ON v.nguoi_dung_id = u.id 
        WHERE v.suat_chieu_id = ?`;
    
    const sqlBaoTri = `SELECT ghe_text FROM bao_tri_ghe WHERE suat_chieu_id = ?`;

    db.query(sqlVe, [suatChieuId], (err, resVe) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(sqlBaoTri, [suatChieuId], (err, resBT) => {
            if (err) return res.status(500).json({ error: err.message });

            const fullSeats = Array.from({ length: 60 }).map((_, i) => {
                const tenGhe = `G${i + 1}`;
                const booking = resVe.find(r => r.ghe_text === tenGhe);
                const isBT = resBT.find(r => r.ghe_text === tenGhe);
                
                return {
                    ten_ghe: tenGhe,
                    is_booked: !!booking,
                    is_maintenance: !!isBT,
                    // Trạng thái disable cho giao diện Booking
                    is_disabled: !!booking || !!isBT, 
                    customer: booking ? {
                        name: booking.ten,
                        email: booking.email,
                        status: "Đã thanh toán"
                    } : null
                };
            });
            res.json(fullSeats);
        });
    });
});

/**
 * API: Đánh dấu bảo trì/Mở lại ghế
 */
router.post('/toggle-seat-maintenance', (req, res) => {
    const { suatChieuId, gheText, isMaintenance } = req.body;
    
    if (isMaintenance) {
        // KIỂM TRA QUAN TRỌNG: Nếu ghế đã có khách đặt, không cho bảo trì.
        const checkSql = "SELECT id FROM ve WHERE suat_chieu_id = ? AND ghe_text = ?";
        db.query(checkSql, [suatChieuId, gheText], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            
            if (results.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: "Ghế này đã có người đặt! Hãy xử lý hoàn vé trước khi khóa." 
                });
            }

            const sql = "INSERT INTO bao_tri_ghe (suat_chieu_id, ghe_text) VALUES (?, ?)";
            db.query(sql, [suatChieuId, gheText], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, message: "Đã đưa ghế vào danh sách bảo trì" });
            });
        });
    } else {
        const sql = "DELETE FROM bao_tri_ghe WHERE suat_chieu_id = ? AND ghe_text = ?";
        db.query(sql, [suatChieuId, gheText], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: "Đã mở lại ghế" });
        });
    }
});

// ==========================================
// 5. QUẢN LÝ NGƯỜI DÙNG
// ==========================================
router.get('/users', (req, res) => {
    const sql = "SELECT id, ten, email, tong_ve_da_mua FROM nguoi_dung ORDER BY id DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

router.get('/users/:id/tickets', (req, res) => {
    const sql = `
        SELECT v.*, p.ten as ten_phim, sc.bat_dau, sc.phong_chieu_id
        FROM ve v
        JOIN suat_chieu sc ON v.suat_chieu_id = sc.id
        JOIN phim p ON sc.phim_id = p.id
        WHERE v.nguoi_dung_id = ?
        ORDER BY v.id DESC
    `;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db.cjs'); // Đảm bảo đường dẫn này đúng với file kết nối DB của bạn
const nodemailer = require('nodemailer');

// Cấu hình gửi mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cuocdoitoi2005@gmail.com',
    pass: 'tqtm eiti rzrz exlh'
  }
});


// --- ROUTE ĐĂNG KÝ ---
router.post('/register', async (req, res) => {
    const { ten, so_dien_thoai, email, mat_khau } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("REGISTER HIT:", req.body);


    // 1. Kiểm tra xem Email hoặc SĐT đã tồn tại chưa
    const checkSql = "SELECT * FROM nguoi_dung WHERE email = ? OR so_dien_thoai = ?";
    db.query(checkSql, [email, so_dien_thoai], (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi kiểm tra Database" });
        
        if (results.length > 0) {
            return res.status(400).json({ message: "Email hoặc Số điện thoại này đã được đăng ký!" });
        }
        

        // 2. Nếu chưa tồn tại thì mới INSERT
        // Đảm bảo bảng 'vai_tro' đã có ID = 1
        const sql = "INSERT INTO nguoi_dung (ten, so_dien_thoai, email, mat_khau, otp_code, trang_thai_xac_thuc, vai_tro_id) VALUES (?, ?, ?, ?, ?, 0, 1)";
        
        db.query(sql, [ten, so_dien_thoai, email, mat_khau, otp], async (insertErr, result) => {
            if (insertErr) {
                console.error("LỖI SQL THẬT SỰ:", insertErr.message); 
                return res.status(500).json({ message: "Lỗi hệ thống: " + insertErr.message });
            }

            // 3. Gửi Email OTP
            try {
                await transporter.sendMail({
                    from: 'cuocdoitoi2005@gmail.com',
                    to: email,
                    subject: 'Mã xác thực OTP - Noir Cinema',
                    html: `<div style="text-align: center;"><h2>Mã OTP của bạn là:</h2><h1 style="color:red;">${otp}</h1></div>`
                });
                res.json({ userId: result.insertId, message: "Mã OTP đã được gửi!" });
            } catch (mailErr) {
                res.status(500).json({ message: "Lỗi gửi Email, vui lòng thử lại!" });
            }
        });
    });
});

// --- ROUTE ĐĂNG NHẬP (Tách riêng biệt) ---
// API Đăng nhập rút gọn
router.post('/login', (req, res) => {
    const { account, password } = req.body;

    // Chỉ kiểm tra tài khoản (Email hoặc SĐT) và Mật khẩu
    const sql = "SELECT id, ten, email, so_dien_thoai FROM nguoi_dung WHERE (email = ? OR so_dien_thoai = ?) AND mat_khau = ?";
    
    db.query(sql, [account, account, password], (err, rows) => {
        if (err) {
            console.error("Lỗi SQL:", err);
            return res.status(500).json({ message: "Lỗi kết nối database" });
        }

        if (rows.length > 0) {
            // Nếu tìm thấy dữ liệu khớp
            const user = rows[0];
            res.json({ 
                success: true, 
                message: "Đăng nhập thành công!",
                user: user 
            });
        } else {
            // Nếu không tìm thấy hoặc mật khẩu sai -> Trả về 401
            res.status(401).json({ message: "Tài khoản hoặc mật khẩu không chính xác!" });
        }
    });
});
router.post('/google-login', (req, res) => {
    const { email, ten, googleId } = req.body; // googleId nhận từ frontend

    const sqlCheck = "SELECT * FROM nguoi_dung WHERE email = ?";
    db.query(sqlCheck, [email], (err, rows) => {
        if (err) return res.status(500).json({ message: "Lỗi DB" });

        if (rows.length > 0) {
            return res.json({ success: true, user: rows[0] });
        } else {
            // Sửa tên cột thành google_id cho khớp với ảnh bạn gửi
            const sqlInsert = "INSERT INTO nguoi_dung (ten, email, google_id, trang_thai_xac_thuc, vai_tro_id) VALUES (?, ?, ?, 1, 1)";
            db.query(sqlInsert, [ten, email, googleId], (insErr, result) => {
                if (insErr) {
                    console.error("Lỗi SQL:", insErr.message);
                    return res.status(500).json({ message: "Lỗi tạo User Google" });
                }
                res.json({ success: true, user: { id: result.insertId, ten, email } });
            });
        }
    });
});
module.exports = router;
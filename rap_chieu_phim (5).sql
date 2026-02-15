-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th2 15, 2026 lúc 12:27 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `rap_chieu_phim`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bang_gia`
--

CREATE TABLE `bang_gia` (
  `id` int(11) NOT NULL,
  `suat_chieu_id` int(11) DEFAULT NULL,
  `loai_ghe_id` int(11) DEFAULT NULL,
  `gia` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ghe`
--

CREATE TABLE `ghe` (
  `id` int(11) NOT NULL,
  `phong_chieu_id` int(11) DEFAULT NULL,
  `loai_ghe_id` int(11) DEFAULT NULL,
  `hang` varchar(5) DEFAULT NULL,
  `so_ghe` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoa_don`
--

CREATE TABLE `hoa_don` (
  `id` int(11) NOT NULL,
  `nguoi_dung_id` int(11) DEFAULT NULL,
  `phuong_thuc_id` int(11) DEFAULT NULL,
  `khuyen_mai_id` int(11) DEFAULT NULL,
  `tong_tien` decimal(12,2) DEFAULT NULL,
  `trang_thai` varchar(50) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT NULL,
  `thoi_gian_dat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hoa_don`
--

INSERT INTO `hoa_don` (`id`, `nguoi_dung_id`, `phuong_thuc_id`, `khuyen_mai_id`, `tong_tien`, `trang_thai`, `ngay_tao`, `thoi_gian_dat`) VALUES
(3, 8, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-12 22:45:19', '2026-02-12 22:45:19'),
(4, 8, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-12 22:52:25', '2026-02-12 22:52:25'),
(5, 8, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-12 23:01:04', '2026-02-12 23:01:04'),
(6, 8, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-12 23:02:14', '2026-02-12 23:02:14'),
(7, 8, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-12 23:03:57', '2026-02-12 23:03:57'),
(8, 8, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-12 23:04:18', '2026-02-12 23:04:18'),
(9, 8, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-12 23:04:34', '2026-02-12 23:04:34'),
(10, 8, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-12 23:04:39', '2026-02-12 23:04:39'),
(11, 8, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-12 23:04:59', '2026-02-12 23:04:59'),
(12, 8, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-12 23:05:24', '2026-02-12 23:05:24'),
(13, 8, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-12 23:18:30', '2026-02-12 23:18:30'),
(14, 8, NULL, NULL, 81000.00, 'đã thanh toán', '2026-02-12 23:23:51', '2026-02-12 23:23:51'),
(19, 6, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-13 07:45:43', '2026-02-13 07:45:43'),
(20, 6, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-13 07:51:18', '2026-02-13 07:51:18'),
(21, 6, NULL, NULL, 90000.00, 'đã thanh toán', '2026-02-15 18:17:28', '2026-02-15 18:17:28'),
(22, 8, NULL, NULL, 81000.00, 'đã thanh toán', '2026-02-15 18:18:28', '2026-02-15 18:18:28');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoa_don_san_pham`
--

CREATE TABLE `hoa_don_san_pham` (
  `id` int(11) NOT NULL,
  `hoa_don_id` int(11) DEFAULT NULL,
  `san_pham_id` int(11) DEFAULT NULL,
  `so_luong` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoa_don_ve`
--

CREATE TABLE `hoa_don_ve` (
  `id` int(11) NOT NULL,
  `hoa_don_id` int(11) DEFAULT NULL,
  `ve_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khuyen_mai`
--

CREATE TABLE `khuyen_mai` (
  `id` int(11) NOT NULL,
  `ma` varchar(50) DEFAULT NULL,
  `giam_gia` decimal(10,2) DEFAULT NULL,
  `loai` enum('phan_tram','tien') DEFAULT NULL,
  `ngay_bat_dau` date DEFAULT NULL,
  `ngay_ket_thuc` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `loai_ghe`
--

CREATE TABLE `loai_ghe` (
  `id` int(11) NOT NULL,
  `ten` varchar(100) DEFAULT NULL,
  `phu_thu` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `id` int(11) NOT NULL,
  `ten` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `mat_khau` varchar(255) DEFAULT NULL,
  `vai_tro_id` int(11) DEFAULT NULL,
  `so_dien_thoai` varchar(15) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `otp_code` varchar(6) DEFAULT NULL,
  `otp_exp` datetime DEFAULT NULL,
  `trang_thai_xac_thuc` tinyint(1) DEFAULT 0,
  `tong_ve_da_mua` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id`, `ten`, `email`, `mat_khau`, `vai_tro_id`, `so_dien_thoai`, `google_id`, `otp_code`, `otp_exp`, `trang_thai_xac_thuc`, `tong_ve_da_mua`) VALUES
(6, 'Trung', 'nguyenminhmai2@gmail.com', 'Trungnd123', 1, '0989872428', NULL, NULL, NULL, 1, 3),
(7, NULL, 'cuocdoitoi2005@gmail.com', NULL, 1, NULL, '113011473323438060723', NULL, NULL, 1, 0),
(8, 'Thương ', 'nguyenthithuong07022005@gmail.com', 'Thuong123', 1, '0987761068', NULL, '136707', NULL, 0, 13);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phim`
--

CREATE TABLE `phim` (
  `id` int(11) NOT NULL,
  `ten` varchar(255) DEFAULT NULL,
  `the_loai` varchar(255) DEFAULT NULL,
  `dao_dien` varchar(255) DEFAULT NULL,
  `dien_vien` text DEFAULT NULL,
  `ngon_ngu` varchar(100) DEFAULT NULL,
  `thoi_luong` int(11) DEFAULT NULL,
  `do_tuoi_gioi_han` int(11) DEFAULT 0,
  `hinh_anh` varchar(500) DEFAULT NULL,
  `ngay_khoi_chieu` date DEFAULT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  `mo_ta` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phim`
--

INSERT INTO `phim` (`id`, `ten`, `the_loai`, `dao_dien`, `dien_vien`, `ngon_ngu`, `thoi_luong`, `do_tuoi_gioi_han`, `hinh_anh`, `ngay_khoi_chieu`, `ngay_ket_thuc`, `mo_ta`) VALUES
(4, 'Lật Mặt 7: Một Điều Ước', 'Gia đình, Tâm lý', 'Lý Hải', 'Thanh Hiền, Trương Minh Cường, Đinh Y Nhung', 'Tiếng Việt', 138, 16, 'lat-mat-7.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(5, 'Haikyu!! Trận Chiến Bãi Phế Liệu', 'Hoạt hình, Thể thao', 'Susumu Mitsunaka', 'Ayumu Murase, Kaito Ishikawa', 'Tiếng Nhật', 85, 16, 'Haikyu.jpg\r\n', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(6, 'Deadpool & Wolverine', 'Hành động, Hài hước', 'Shawn Levy', 'Ryan Reynolds, Hugh Jackman', 'Tiếng Anh', 127, 16, 'deadpool-wolverine.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(7, 'Kẻ Trộm Mặt Trăng 4', 'Hoạt hình, Gia đình', 'Chris Renaud', 'Steve Carell, Kristen Wiig', 'Tiếng Việt (Lồng tiếng)', 94, 16, 'despicable-me-4.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(8, 'Inside Out 2', 'Hoạt hình, Phiêu lưu', 'Kelsey Mann', 'Amy Poehler, Maya Hawke', 'Tiếng Anh', 96, 16, 'inside-out-2.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(9, 'A Quiet Place: Day One', 'Kinh dị, Hồi hộp', 'Michael Sarnoski', 'Lupita Nyong\'o, Joseph Quinn', 'Tiếng Anh', 100, 16, 'quiet-place-1.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(10, 'Mai', 'Tâm lý, Tình cảm', 'Trấn Thành', 'Phương Anh Đào, Tuấn Trần', 'Tiếng Việt', 131, 16, 'phim-mai.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(11, 'Dune: Part Two', 'Khoa học viễn tưởng', 'Denis Villeneuve', 'Timothée Chalamet, Zendaya', 'Tiếng Anh', 166, 16, 'dune-2.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(12, 'Godzilla x Kong', 'Hành động, Quái vật', 'Adam Wingard', 'Rebecca Hall, Brian Tyree Henry', 'Tiếng Anh', 113, 16, 'godzilla-kong.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(13, 'Conan: Ngôi Sao Năm Cánh', 'Anime, Trinh thám', 'Chika Nagaoka', 'Minami Takayama', 'Tiếng Nhật', 111, 16, 'conan-27.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(14, 'Furiosa: Saga Mad Max', 'Hành động, Phiêu lưu', 'George Miller', 'Anya Taylor-Joy, Chris Hemsworth', 'Tiếng Anh', 148, 16, 'furiosa.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(15, 'Kingdom of the Planet of the Apes', 'Hành động, Viễn tưởng', 'Wes Ball', 'Owen Teague, Freya Allan', 'Tiếng Anh', 145, 16, 'planet-apes.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(16, 'Joker: Folie à Deux', 'Tâm lý, Nhạc kịch', 'Todd Phillips', 'Joaquin Phoenix, Lady Gaga', 'Tiếng Anh', 138, 16, 'joker-2.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(17, 'Gladiator II', 'Hành động, Sử thi', 'Ridley Scott', 'Paul Mescal, Denzel Washington', 'Tiếng Anh', 148, 16, 'gladiator-2.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(18, 'Sonic the Hedgehog 3', 'Hành động, Gia đình', 'Jeff Fowler', 'Jim Carrey, Ben Schwartz', 'Tiếng Việt (Lồng tiếng)', 110, 16, 'sonic-3.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(19, 'Moana 2', 'Hoạt hình, Phiêu lưu', 'David G. Derrick Jr.', 'Auliʻi Cravalho, Dwayne Johnson', 'Tiếng Anh', 100, 16, 'moana-2.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(20, 'Spider-Man: Beyond the Spider-Verse', 'Hoạt hình, Hành động', 'Joaquim Dos Santos', 'Shameik Moore, Hailee Steinfeld', 'Tiếng Anh', 140, 16, 'spiderman-verse.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(21, 'Mufasa: The Lion King', 'Hoạt hình, Phiêu lưu', 'Barry Jenkins', 'Aaron Pierre, Kelvin Harrison Jr.', 'Tiếng Anh', 118, 16, 'mufasa.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(22, 'The Batman - Part II', 'Hành động, Trinh thám', 'Matt Reeves', 'Robert Pattinson, Zoë Kravitz', 'Tiếng Anh', 160, 16, 'batman-2.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(23, 'Lật Mặt 6: Tấm Vé Định Mệnh', 'Hành động, Tâm lý', 'Lý Hải', 'Quốc Cường, Trung Dũng', 'Tiếng Việt', 132, 16, 'lat-mat-6.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(24, 'Bố Già', 'Gia đình, Hài hước', 'Trấn Thành', 'Trấn Thành, Tuấn Trần', 'Tiếng Việt', 128, 16, 'bo-gia.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(25, 'Nhà Bà Nữ', 'Gia đình, Tâm lý', 'Trấn Thành', 'Lê Giang, Uyển Ân', 'Tiếng Việt', 102, 16, 'nha-ba-nu.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(26, 'Suzume', 'Anime, Kỳ ảo', 'Makoto Shinkai', 'Nanoka Hara, Hokuto Matsumura', 'Tiếng Nhật', 122, 16, 'suzume.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(27, 'One Piece Film: Red', 'Anime, Nhạc kịch', 'Goro Taniguchi', 'Mayumi Tanaka, Kaori Nazuka', 'Tiếng Nhật', 115, 16, 'one-piece-red.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(28, 'The Nun II', 'Kinh dị, Bí ẩn', 'Michael Chaves', 'Taissa Farmiga, Jonas Bloquet', 'Tiếng Anh', 110, 16, 'the-nun-2.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(29, 'Avatar: The Way of Water', 'Hành động, Viễn tưởng', 'James Cameron', 'Sam Worthington, Zoe Saldana', 'Tiếng Anh', 192, 16, 'avatar-2.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(30, 'Oppenheimer', 'Tiểu sử, Tâm lý', 'Christopher Nolan', 'Cillian Murphy, Emily Blunt', 'Tiếng Anh', 180, 16, 'oppenheimer.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(31, 'Spy x Family Code: White', 'Anime, Hành động, Hài hước', 'Kazuhiro Furuhashi', 'Takuya Eguchi, Atsumi Tanezaki', 'Tiếng Nhật', 110, 16, 'spy-family.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(32, 'Blue Lock: Episode Nagi', 'Anime, Thể thao', 'Shunsuke Ishikawa', 'Nobunaga Shimazaki', 'Tiếng Nhật', 89, 16, 'blue-lock.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(33, 'Interstellar', 'Khoa học viễn tưởng, Tâm lý', 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway', 'Tiếng Anh', 169, 16, 'interstellar.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(34, 'The Avengers', 'Hành động, Siêu anh hùng', 'Joss Whedon', 'Robert Downey Jr., Chris Evans', 'Tiếng Anh', 143, 16, 'avengers.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(35, 'Em và Trịnh', 'Âm nhạc, Lãng mạn', 'Phan Gia Nhật Linh', 'Avin Lu, Trần Lực', 'Tiếng Việt', 136, 16, 'em-va-trinh.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(36, 'Mắt Biếc', 'Lãng mạn, Tâm lý', 'Victor Vũ', 'Trần Nghĩa, Trúc Anh', 'Tiếng Việt', 117, 16, 'mat-biec.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(37, 'Solo Leveling: ReAwakening', 'Anime, Hành động, Phiêu lưu', 'Shunsuke Nakashige', 'Taito Ban, Reina Ueda', 'Tiếng Nhật', 115, 16, 'solo-leveling.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(38, 'Look Back: Liệu Ta Có Ngoảnh Lại', 'Anime, Tâm lý, Nghệ thuật', 'Kiyotaka Oshiyama', 'Yuumi Kawai, Mizuki Yoshida', 'Tiếng Nhật', 58, 16, 'look-back.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(39, 'Tên Cậu Là Gì? (Your Name)', 'Anime, Lãng mạn, Kỳ ảo', 'Makoto Shinkai', 'Ryunosuke Kamiki, Mone Kamishiraishi', 'Tiếng Nhật', 106, 16, 'your-name.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(40, 'Dáng Hình Thanh Âm', 'Anime, Tâm lý, Học đường', 'Naoko Yamada', 'Miyu Irino, Saori Hayami', 'Tiếng Nhật', 129, 16, 'silent-voice.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(41, 'Tớ Muốn Ăn Tụy Của Cậu', 'Anime, Tình cảm, Tâm lý', 'Shin\'ichirō Ushijima', 'Mahiro Takasugi, Lynn', 'Tiếng Nhật', 108, 16, 'eat-pancreas.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(42, 'Chú Thuật Hồi Chiến 0', 'Anime, Hành động, Kỳ ảo', 'Sunghoo Park', 'Megumi Ogata, Kana Hanazawa', 'Tiếng Nhật', 105, 16, 'jujutsu-kaisen-0.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(43, 'Những Đứa Con Của Sói', 'Anime, Gia đình, Kỳ ảo', 'Mamoru Hosoda', 'Aoi Miyazaki, Takao Osawa', 'Tiếng Nhật', 117, 16, 'wolf-children.jpg', '2024-01-01', '2026-12-31', 'Một siêu phẩm điện ảnh đỉnh cao với những tình tiết hấp dẫn và kỹ xảo mãn nhãn.'),
(46, 'Bộ tứ báo thủ ', 'Gia đình ', NULL, NULL, NULL, 130, 0, 'https://tse4.mm.bing.net/th/id/OIP.dIZq4MAmdGamtw_XQ7k40wHaEK?pid=Api&P=0&h=180', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phong_chieu`
--

CREATE TABLE `phong_chieu` (
  `id` int(11) NOT NULL,
  `rap_id` int(11) NOT NULL,
  `ten` varchar(100) DEFAULT NULL,
  `suc_chua` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phong_chieu`
--

INSERT INTO `phong_chieu` (`id`, `rap_id`, `ten`, `suc_chua`) VALUES
(1, 1, 'Phòng 1', 100),
(2, 1, 'Phòng 2', 120),
(3, 1, 'Phòng 3', 80),
(4, 1, 'Phòng 4', 150),
(5, 1, 'Phòng 5', 90),
(6, 1, 'Phòng 6', 200);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phuong_thuc_thanh_toan`
--

CREATE TABLE `phuong_thuc_thanh_toan` (
  `id` int(11) NOT NULL,
  `ten` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rap`
--

CREATE TABLE `rap` (
  `id` int(11) NOT NULL,
  `ten` varchar(150) NOT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `trang_thai` varchar(50) DEFAULT 'hoat_dong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `rap`
--

INSERT INTO `rap` (`id`, `ten`, `dia_chi`, `trang_thai`) VALUES
(1, 'Rạp ', 'Hà Nội', 'hoat_dong');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `san_pham`
--

CREATE TABLE `san_pham` (
  `id` int(11) NOT NULL,
  `ten` varchar(150) DEFAULT NULL,
  `gia` decimal(10,2) DEFAULT NULL,
  `loai` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `suat_chieu`
--

CREATE TABLE `suat_chieu` (
  `id` int(11) NOT NULL,
  `phim_id` int(11) DEFAULT NULL,
  `phong_chieu_id` int(11) DEFAULT NULL,
  `bat_dau` datetime DEFAULT NULL,
  `ket_thuc` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `suat_chieu`
--

INSERT INTO `suat_chieu` (`id`, `phim_id`, `phong_chieu_id`, `bat_dau`, `ket_thuc`) VALUES
(35, 4, 1, '2026-02-11 09:00:00', '2027-02-15 11:18:00'),
(36, 5, 2, '2026-02-11 09:00:00', '2027-02-11 10:25:00'),
(37, 6, 3, '2026-02-11 09:00:00', '2027-02-11 11:07:00'),
(38, 7, 4, '2026-02-11 09:00:00', '2027-02-11 10:34:00'),
(39, 8, 5, '2026-02-11 09:00:00', '2027-02-11 10:36:00'),
(40, 9, 6, '2026-02-11 09:00:00', '2027-02-11 10:40:00'),
(41, 10, 1, '2026-02-11 12:00:00', '2027-02-11 14:11:00'),
(42, 11, 2, '2026-02-11 12:00:00', '2027-02-11 14:46:00'),
(43, 12, 3, '2026-02-11 12:00:00', '2027-02-11 13:53:00'),
(44, 13, 4, '2026-02-11 12:00:00', '2027-02-11 13:51:00'),
(45, 14, 5, '2026-02-11 12:00:00', '2027-02-11 14:28:00'),
(46, 15, 6, '2026-02-11 12:00:00', '2027-02-11 14:25:00'),
(47, 16, 1, '2026-02-11 15:00:00', '2027-02-11 17:18:00'),
(48, 17, 2, '2026-02-11 15:00:00', '2027-02-11 17:28:00'),
(49, 18, 3, '2026-02-11 15:00:00', '2027-02-11 16:50:00'),
(50, 19, 4, '2026-02-11 15:00:00', '2027-02-11 16:40:00'),
(51, 20, 5, '2026-02-11 15:00:00', '2027-02-11 17:20:00'),
(52, 21, 6, '2026-02-11 15:00:00', '2027-02-11 16:58:00'),
(53, 22, 1, '2026-02-12 09:00:00', '2027-02-12 11:40:00'),
(54, 23, 2, '2026-02-12 09:00:00', '2027-02-12 11:12:00'),
(55, 24, 3, '2026-02-12 09:00:00', '2027-02-12 11:08:00'),
(56, 25, 4, '2026-02-12 09:00:00', '2027-02-12 10:42:00'),
(57, 26, 5, '2026-02-12 09:00:00', '2027-02-12 11:02:00'),
(58, 27, 6, '2026-02-12 09:00:00', '2027-02-12 10:55:00'),
(59, 28, 1, '2026-02-12 12:00:00', '2027-02-12 13:50:00'),
(60, 29, 2, '2026-02-12 12:00:00', '2027-02-12 15:12:00'),
(61, 30, 3, '2026-02-12 12:00:00', '2027-02-12 15:00:00'),
(62, 31, 4, '2026-02-12 12:00:00', '2027-02-12 13:50:00'),
(63, 32, 5, '2026-02-12 12:00:00', '2027-02-12 13:29:00'),
(64, 33, 6, '2026-02-12 12:00:00', '2027-02-12 14:49:00'),
(65, 34, 1, '2026-02-13 15:00:00', '2027-02-13 17:23:00'),
(66, 35, 2, '2026-02-13 15:00:00', '2027-02-13 17:16:00'),
(67, 36, 3, '2026-02-13 15:00:00', '2027-02-13 16:57:00'),
(68, 37, 4, '2026-02-13 15:00:00', '2027-02-13 16:55:00'),
(69, 38, 5, '2026-02-13 15:00:00', '2027-02-13 15:58:00'),
(70, 39, 6, '2026-02-13 15:00:00', '2027-02-13 16:46:00'),
(71, 40, 1, '2026-02-13 18:00:00', '2027-02-13 20:09:00'),
(72, 41, 2, '2026-02-13 18:00:00', '2027-02-13 19:48:00'),
(73, 42, 3, '2026-02-13 18:00:00', '2027-02-13 19:45:00'),
(74, 43, 4, '2026-02-13 18:00:00', '2027-02-13 19:57:00'),
(75, 4, 2, '2026-02-15 09:00:00', NULL),
(76, 10, 5, '2026-02-16 09:00:00', '2026-02-16 11:15:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vai_tro`
--

CREATE TABLE `vai_tro` (
  `id` int(11) NOT NULL,
  `ten` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `vai_tro`
--

INSERT INTO `vai_tro` (`id`, `ten`) VALUES
(1, 'Khách hàng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ve`
--

CREATE TABLE `ve` (
  `id` int(11) NOT NULL,
  `suat_chieu_id` int(11) DEFAULT NULL,
  `nguoi_dung_id` int(11) DEFAULT NULL,
  `ghe_id` int(11) DEFAULT NULL,
  `gia` decimal(10,2) DEFAULT NULL,
  `trang_thai` enum('trong','giu','da_ban','huy') DEFAULT 'trong',
  `thoi_gian_giu` datetime DEFAULT NULL,
  `ten_phim` varchar(255) DEFAULT NULL,
  `ngay_chieu` varchar(50) DEFAULT NULL,
  `suat_chieu` varchar(50) DEFAULT NULL,
  `phong` varchar(100) DEFAULT NULL,
  `ghe_text` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ve`
--

INSERT INTO `ve` (`id`, `suat_chieu_id`, `nguoi_dung_id`, `ghe_id`, `gia`, `trang_thai`, `thoi_gian_giu`, `ten_phim`, `ngay_chieu`, `suat_chieu`, `phong`, `ghe_text`) VALUES
(2, NULL, 8, NULL, 70000.00, 'da_ban', '2026-02-10 03:44:08', 'Lật Mặt 7: Một Điều Ước', '2026-02-10', '20:00', '2', 'H10'),
(3, NULL, 8, NULL, 140000.00, '', '2026-02-10 03:47:41', 'One Piece Film: Red', '2026-02-20', '21:00', 'P01', 'H20,H21'),
(4, NULL, 8, NULL, 180000.00, '', '2026-02-10 03:52:16', 'Deadpool & Wolverine', '2026-02-05', '16:00', 'P02', 'H10, H11'),
(8, 7, 8, NULL, NULL, 'da_ban', NULL, 'Kẻ Trộm Mặt Trăng 4', 'Invalid Date', 'Invalid Date', NULL, 'G6'),
(9, 8, 8, NULL, NULL, 'da_ban', NULL, 'Inside Out 2', 'Invalid Date', 'Invalid Date', NULL, 'G6'),
(10, 11, 8, NULL, NULL, 'da_ban', NULL, 'Dune: Part Two', 'N/A', '--:--', NULL, 'G8'),
(11, 7, 8, NULL, NULL, 'da_ban', NULL, 'Kẻ Trộm Mặt Trăng 4', 'N/A', '--:--', NULL, 'G37'),
(12, 6, 8, NULL, NULL, 'da_ban', NULL, 'Deadpool & Wolverine', 'N/A', '--:--', NULL, 'G28'),
(13, 7, 8, NULL, NULL, 'da_ban', NULL, 'Kẻ Trộm Mặt Trăng 4', 'N/A', '--:--', NULL, 'G58'),
(14, 7, 8, NULL, NULL, 'da_ban', NULL, 'Kẻ Trộm Mặt Trăng 4', 'N/A', '--:--', NULL, 'G57'),
(15, 6, 8, NULL, NULL, 'da_ban', NULL, 'Deadpool & Wolverine', 'N/A', '--:--', NULL, 'G60'),
(16, 6, 8, NULL, NULL, 'da_ban', NULL, 'Deadpool & Wolverine', 'N/A', '--:--', NULL, 'G58'),
(17, 5, 8, NULL, NULL, 'da_ban', NULL, 'Haikyu!! Trận Chiến Bãi Phế Liệu', 'N/A', '--:--', NULL, 'G56'),
(18, 7, 8, NULL, NULL, 'da_ban', NULL, 'Kẻ Trộm Mặt Trăng 4', 'N/A', '--:--', NULL, 'G26'),
(19, 10, 8, NULL, NULL, 'da_ban', NULL, 'Mai', 'N/A', '--:--', NULL, 'G57'),
(20, 8, 6, NULL, NULL, 'da_ban', NULL, 'Inside Out 2', 'N/A', '--:--', NULL, 'G25'),
(21, 4, 6, NULL, NULL, 'da_ban', NULL, 'Lật Mặt 7: Một Điều Ước', 'N/A', '--:--', NULL, 'G3'),
(22, 6, 6, NULL, NULL, 'da_ban', NULL, 'Deadpool & Wolverine', 'N/A', '--:--', NULL, 'G1'),
(23, 6, 8, NULL, NULL, 'da_ban', NULL, 'Deadpool & Wolverine', 'N/A', '--:--', NULL, 'G2');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bang_gia`
--
ALTER TABLE `bang_gia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `suat_chieu_id` (`suat_chieu_id`,`loai_ghe_id`),
  ADD KEY `loai_ghe_id` (`loai_ghe_id`);

--
-- Chỉ mục cho bảng `ghe`
--
ALTER TABLE `ghe`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phong_chieu_id` (`phong_chieu_id`,`hang`,`so_ghe`),
  ADD KEY `loai_ghe_id` (`loai_ghe_id`);

--
-- Chỉ mục cho bảng `hoa_don`
--
ALTER TABLE `hoa_don`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nguoi_dung_id` (`nguoi_dung_id`),
  ADD KEY `phuong_thuc_id` (`phuong_thuc_id`),
  ADD KEY `khuyen_mai_id` (`khuyen_mai_id`);

--
-- Chỉ mục cho bảng `hoa_don_san_pham`
--
ALTER TABLE `hoa_don_san_pham`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hoa_don_id` (`hoa_don_id`),
  ADD KEY `san_pham_id` (`san_pham_id`);

--
-- Chỉ mục cho bảng `hoa_don_ve`
--
ALTER TABLE `hoa_don_ve`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hoa_don_id` (`hoa_don_id`),
  ADD KEY `ve_id` (`ve_id`);

--
-- Chỉ mục cho bảng `khuyen_mai`
--
ALTER TABLE `khuyen_mai`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma` (`ma`);

--
-- Chỉ mục cho bảng `loai_ghe`
--
ALTER TABLE `loai_ghe`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `vai_tro_id` (`vai_tro_id`);

--
-- Chỉ mục cho bảng `phim`
--
ALTER TABLE `phim`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `phong_chieu`
--
ALTER TABLE `phong_chieu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rap_id` (`rap_id`,`ten`);

--
-- Chỉ mục cho bảng `phuong_thuc_thanh_toan`
--
ALTER TABLE `phuong_thuc_thanh_toan`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `rap`
--
ALTER TABLE `rap`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `suat_chieu`
--
ALTER TABLE `suat_chieu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `phim_id` (`phim_id`),
  ADD KEY `phong_chieu_id` (`phong_chieu_id`);

--
-- Chỉ mục cho bảng `vai_tro`
--
ALTER TABLE `vai_tro`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `ve`
--
ALTER TABLE `ve`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `suat_chieu_id` (`suat_chieu_id`,`ghe_id`),
  ADD KEY `ghe_id` (`ghe_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bang_gia`
--
ALTER TABLE `bang_gia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `ghe`
--
ALTER TABLE `ghe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hoa_don`
--
ALTER TABLE `hoa_don`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `hoa_don_san_pham`
--
ALTER TABLE `hoa_don_san_pham`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `hoa_don_ve`
--
ALTER TABLE `hoa_don_ve`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `khuyen_mai`
--
ALTER TABLE `khuyen_mai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `loai_ghe`
--
ALTER TABLE `loai_ghe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `phim`
--
ALTER TABLE `phim`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT cho bảng `phong_chieu`
--
ALTER TABLE `phong_chieu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `phuong_thuc_thanh_toan`
--
ALTER TABLE `phuong_thuc_thanh_toan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `rap`
--
ALTER TABLE `rap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `suat_chieu`
--
ALTER TABLE `suat_chieu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT cho bảng `vai_tro`
--
ALTER TABLE `vai_tro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `ve`
--
ALTER TABLE `ve`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bang_gia`
--
ALTER TABLE `bang_gia`
  ADD CONSTRAINT `bang_gia_ibfk_1` FOREIGN KEY (`suat_chieu_id`) REFERENCES `suat_chieu` (`id`),
  ADD CONSTRAINT `bang_gia_ibfk_2` FOREIGN KEY (`loai_ghe_id`) REFERENCES `loai_ghe` (`id`);

--
-- Các ràng buộc cho bảng `ghe`
--
ALTER TABLE `ghe`
  ADD CONSTRAINT `ghe_ibfk_1` FOREIGN KEY (`phong_chieu_id`) REFERENCES `phong_chieu` (`id`),
  ADD CONSTRAINT `ghe_ibfk_2` FOREIGN KEY (`loai_ghe_id`) REFERENCES `loai_ghe` (`id`);

--
-- Các ràng buộc cho bảng `hoa_don`
--
ALTER TABLE `hoa_don`
  ADD CONSTRAINT `hoa_don_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`),
  ADD CONSTRAINT `hoa_don_ibfk_2` FOREIGN KEY (`phuong_thuc_id`) REFERENCES `phuong_thuc_thanh_toan` (`id`),
  ADD CONSTRAINT `hoa_don_ibfk_3` FOREIGN KEY (`khuyen_mai_id`) REFERENCES `khuyen_mai` (`id`);

--
-- Các ràng buộc cho bảng `hoa_don_san_pham`
--
ALTER TABLE `hoa_don_san_pham`
  ADD CONSTRAINT `hoa_don_san_pham_ibfk_1` FOREIGN KEY (`hoa_don_id`) REFERENCES `hoa_don` (`id`),
  ADD CONSTRAINT `hoa_don_san_pham_ibfk_2` FOREIGN KEY (`san_pham_id`) REFERENCES `san_pham` (`id`);

--
-- Các ràng buộc cho bảng `hoa_don_ve`
--
ALTER TABLE `hoa_don_ve`
  ADD CONSTRAINT `hoa_don_ve_ibfk_1` FOREIGN KEY (`hoa_don_id`) REFERENCES `hoa_don` (`id`),
  ADD CONSTRAINT `hoa_don_ve_ibfk_2` FOREIGN KEY (`ve_id`) REFERENCES `ve` (`id`);

--
-- Các ràng buộc cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD CONSTRAINT `nguoi_dung_ibfk_1` FOREIGN KEY (`vai_tro_id`) REFERENCES `vai_tro` (`id`);

--
-- Các ràng buộc cho bảng `phong_chieu`
--
ALTER TABLE `phong_chieu`
  ADD CONSTRAINT `phong_chieu_ibfk_1` FOREIGN KEY (`rap_id`) REFERENCES `rap` (`id`);

--
-- Các ràng buộc cho bảng `suat_chieu`
--
ALTER TABLE `suat_chieu`
  ADD CONSTRAINT `suat_chieu_ibfk_1` FOREIGN KEY (`phim_id`) REFERENCES `phim` (`id`),
  ADD CONSTRAINT `suat_chieu_ibfk_2` FOREIGN KEY (`phong_chieu_id`) REFERENCES `phong_chieu` (`id`);

--
-- Các ràng buộc cho bảng `ve`
--
ALTER TABLE `ve`
  ADD CONSTRAINT `ve_ibfk_2` FOREIGN KEY (`ghe_id`) REFERENCES `ghe` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

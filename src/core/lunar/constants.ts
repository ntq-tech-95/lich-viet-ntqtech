export const VIETNAM_TIMEZONE = 7;

export const CAN = [
  'Giáp',
  'Ất',
  'Bính',
  'Đinh',
  'Mậu',
  'Kỷ',
  'Canh',
  'Tân',
  'Nhâm',
  'Quý',
] as const;

export const CHI = [
  'Tý',
  'Sửu',
  'Dần',
  'Mão',
  'Thìn',
  'Tỵ',
  'Ngọ',
  'Mùi',
  'Thân',
  'Dậu',
  'Tuất',
  'Hợi',
] as const;

export const ZODIAC_ANIMALS = [
  'Chuột',
  'Trâu',
  'Hổ',
  'Mèo',
  'Rồng',
  'Rắn',
  'Ngựa',
  'Dê',
  'Khỉ',
  'Gà',
  'Chó',
  'Lợn',
] as const;

export const WEEKDAYS = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
] as const;

export const WEEKDAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const;

export const LUNAR_MONTH_NAMES = [
  '',
  'Tháng Giêng',
  'Tháng Hai',
  'Tháng Ba',
  'Tháng Tư',
  'Tháng Năm',
  'Tháng Sáu',
  'Tháng Bảy',
  'Tháng Tám',
  'Tháng Chín',
  'Tháng Mười',
  'Tháng Một',
  'Tháng Chạp',
] as const;

export const HOUR_RANGES = [
  '23:00 - 01:00',
  '01:00 - 03:00',
  '03:00 - 05:00',
  '05:00 - 07:00',
  '07:00 - 09:00',
  '09:00 - 11:00',
  '11:00 - 13:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
  '17:00 - 19:00',
  '19:00 - 21:00',
  '21:00 - 23:00',
] as const;

// 24 Tiết Khí theo kinh độ Mặt Trời (mỗi 15 độ, bắt đầu từ 0° = Xuân Phân)
export const SOLAR_TERMS_24 = [
  'Xuân Phân',   // 0°
  'Thanh Minh',  // 15°
  'Cốc Vũ',      // 30°
  'Lập Hạ',      // 45°
  'Tiểu Mãn',    // 60°
  'Mang Chủng',  // 75°
  'Hạ Chí',      // 90°
  'Tiểu Thử',    // 105°
  'Đại Thử',     // 120°
  'Lập Thu',     // 135°
  'Xử Thử',      // 150°
  'Bạch Lộ',     // 165°
  'Thu Phân',    // 180°
  'Hàn Lộ',      // 195°
  'Sương Giáng', // 210°
  'Lập Đông',    // 225°
  'Tiểu Tuyết',  // 240°
  'Đại Tuyết',   // 255°
  'Đông Chí',    // 270°
  'Tiểu Hàn',    // 285°
  'Đại Hàn',     // 300°
  'Lập Xuân',    // 315°
  'Vũ Thủy',     // 330°
  'Kinh Trập',   // 345°
] as const;

// 12 Thần Sát Hoàng Đạo / Hắc Đạo
export const TWELVE_STARS = [
  { name: 'Thanh Long', isHoangDao: true },
  { name: 'Minh Đường', isHoangDao: true },
  { name: 'Thiên Hình', isHoangDao: false },
  { name: 'Chu Tước', isHoangDao: false },
  { name: 'Kim Quỹ', isHoangDao: true },
  { name: 'Thiên Đức', isHoangDao: true },
  { name: 'Bạch Hổ', isHoangDao: false },
  { name: 'Ngọc Đường', isHoangDao: true },
  { name: 'Thiên Lao', isHoangDao: false },
  { name: 'Huyền Vũ', isHoangDao: false },
  { name: 'Tư Mệnh', isHoangDao: true },
  { name: 'Câu Trận', isHoangDao: false },
] as const;

// Giờ Hoàng Đạo theo Chi ngày (0=Tý .. 11=Hợi)
export const AUSPICIOUS_HOURS_BY_DAY_CHI: Record<number, readonly number[]> = {
  0: [0, 1, 3, 6, 8, 9],   // Tý
  1: [2, 3, 5, 8, 10, 11], // Sửu
  2: [0, 1, 4, 5, 7, 10],  // Dần
  3: [0, 2, 3, 6, 7, 9],   // Mão
  4: [2, 4, 5, 8, 9, 11],  // Thìn
  5: [1, 4, 6, 7, 10, 11], // Tỵ
  6: [0, 1, 3, 6, 8, 9],   // Ngọ
  7: [2, 3, 5, 8, 10, 11], // Mùi
  8: [0, 1, 4, 5, 7, 10],  // Thân
  9: [0, 2, 3, 6, 7, 9],   // Dậu
  10: [2, 4, 5, 8, 9, 11], // Tuất
  11: [1, 4, 6, 7, 10, 11] // Hợi
};

// 12 Trực
export const TWELVE_TRUC = [
  { name: 'Kiến', meaning: 'Tốt cho khởi đầu, xuất hành, nhậm chức; tránh động thổ', isGood: true },
  { name: 'Trừ', meaning: 'Tốt cho dọn dẹp, chữa bệnh, giải trừ điều xấu', isGood: true },
  { name: 'Mãn', meaning: 'Tốt cho cầu tài, khai trương, cưới hỏi, giao dịch', isGood: true },
  { name: 'Bình', meaning: 'Ngày bình ổn, thuận lợi việc sửa sang, giao tế', isGood: true },
  { name: 'Định', meaning: 'Tốt cho ký kết, đính hôn, nhập học, lập kế hoạch', isGood: true },
  { name: 'Chấp', meaning: 'Hợp xây dựng, trồng trọt, tuyển dụng; kỵ dời nhà', isGood: false },
  { name: 'Phá', meaning: 'Chỉ hợp phá dỡ công trình cũ; tránh cưới hỏi, khai trương', isGood: false },
  { name: 'Nguy', meaning: 'Cẩn trọng mọi việc lớn, hợp cầu an, tế tự', isGood: false },
  { name: 'Thành', meaning: 'Đại cát: tốt cho khai trương, cưới hỏi, ký hợp đồng, nhập trạch', isGood: true },
  { name: 'Thu', meaning: 'Tốt cho thu hoạch, nhận tài lộc, cất giữ; kỵ xuất hành xa', isGood: true },
  { name: 'Khai', meaning: 'Tốt cho mở hàng, khởi công, cầu tài, giao lưu', isGood: true },
  { name: 'Bế', meaning: 'Nên tu dưỡng, hoàn tất việc cũ; tránh khởi sự lớn', isGood: false },
] as const;

// 30 cặp Nạp Âm (mỗi cặp dùng chung cho 2 Can Chi liên tiếp trong Lục Thập Hoa Giáp)
export const NAP_AM_30: Array<{ name: string; element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ' }> = [
  { name: 'Hải Trung Kim', element: 'Kim' },
  { name: 'Lư Trung Hỏa', element: 'Hỏa' },
  { name: 'Đại Lâm Mộc', element: 'Mộc' },
  { name: 'Lộ Bàng Thổ', element: 'Thổ' },
  { name: 'Kiếm Phong Kim', element: 'Kim' },
  { name: 'Sơn Đầu Hỏa', element: 'Hỏa' },
  { name: 'Giản Hạ Thủy', element: 'Thủy' },
  { name: 'Thành Đầu Thổ', element: 'Thổ' },
  { name: 'Bạch Lạp Kim', element: 'Kim' },
  { name: 'Dương Liễu Mộc', element: 'Mộc' },
  { name: 'Tuyền Trung Thủy', element: 'Thủy' },
  { name: 'Ốc Thượng Thổ', element: 'Thổ' },
  { name: 'Tích Lịch Hỏa', element: 'Hỏa' },
  { name: 'Tùng Bách Mộc', element: 'Mộc' },
  { name: 'Trường Lưu Thủy', element: 'Thủy' },
  { name: 'Sa Trung Kim', element: 'Kim' },
  { name: 'Sơn Hạ Hỏa', element: 'Hỏa' },
  { name: 'Bình Địa Mộc', element: 'Mộc' },
  { name: 'Bích Thượng Thổ', element: 'Thổ' },
  { name: 'Kim Bạch Kim', element: 'Kim' },
  { name: 'Phú Đăng Hỏa', element: 'Hỏa' },
  { name: 'Thiên Hà Thủy', element: 'Thủy' },
  { name: 'Đại Trạch Thổ', element: 'Thổ' },
  { name: 'Thoa Xuyến Kim', element: 'Kim' },
  { name: 'Tang Đố Mộc', element: 'Mộc' },
  { name: 'Đại Khê Thủy', element: 'Thủy' },
  { name: 'Sa Trung Thổ', element: 'Thổ' },
  { name: 'Thiên Thượng Hỏa', element: 'Hỏa' },
  { name: 'Thạch Lựu Mộc', element: 'Mộc' },
  { name: 'Đại Hải Thủy', element: 'Thủy' },
];

// Hướng Hỷ Thần theo Can ngày (0=Giáp .. 9=Quý)
export const HY_THAN_BY_CAN = [
  'Đông Bắc', // Giáp
  'Tây Bắc',  // Ất
  'Tây Nam',  // Bính
  'Chính Nam', // Đinh
  'Đông Nam', // Mậu
  'Đông Bắc', // Kỷ
  'Tây Bắc',  // Canh
  'Tây Nam',  // Tân
  'Chính Nam', // Nhâm
  'Đông Nam', // Quý
] as const;

// Hướng Tài Thần theo Can ngày (0=Giáp .. 9=Quý)
export const TAI_THAN_BY_CAN = [
  'Đông Nam', // Giáp
  'Đông Nam', // Ất
  'Chính Đông', // Bính
  'Chính Đông', // Đinh
  'Chính Bắc', // Mậu
  'Chính Nam', // Kỷ
  'Tây Nam',  // Canh
  'Tây Nam',  // Tân
  'Chính Tây', // Nhâm
  'Tây Bắc',  // Quý
] as const;

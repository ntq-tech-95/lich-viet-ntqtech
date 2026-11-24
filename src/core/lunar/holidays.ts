import type { Holiday, LunarDate, SolarDate } from './types';

interface HolidayDef {
  day: number;
  month: number;
  name: string;
  isMajor: boolean;
  description?: string;
}

export const SOLAR_HOLIDAYS: HolidayDef[] = [
  { day: 1, month: 1, name: 'Tết Dương lịch', isMajor: true, description: 'Ngày đầu năm mới Dương lịch' },
  { day: 3, month: 2, name: 'Ngày thành lập Đảng CSVN', isMajor: false },
  { day: 14, month: 2, name: 'Lễ Tình nhân (Valentine)', isMajor: false },
  { day: 27, month: 2, name: 'Ngày Thầy thuốc Việt Nam', isMajor: false },
  { day: 8, month: 3, name: 'Ngày Quốc tế Phụ nữ', isMajor: false },
  { day: 26, month: 3, name: 'Ngày thành lập Đoàn TNCS HCM', isMajor: false },
  { day: 30, month: 4, name: 'Ngày Giải phóng miền Nam', isMajor: true, description: 'Thống nhất đất nước (30/4)' },
  { day: 1, month: 5, name: 'Ngày Quốc tế Lao động', isMajor: true },
  { day: 7, month: 5, name: 'Chiến thắng Điện Biên Phủ', isMajor: false },
  { day: 19, month: 5, name: 'Ngày sinh Chủ tịch Hồ Chí Minh', isMajor: false },
  { day: 1, month: 6, name: 'Ngày Quốc tế Thiếu nhi', isMajor: false },
  { day: 28, month: 6, name: 'Ngày Gia đình Việt Nam', isMajor: false },
  { day: 27, month: 7, name: 'Ngày Thương binh - Liệt sĩ', isMajor: false },
  { day: 19, month: 8, name: 'Cách mạng tháng Tám thành công', isMajor: false },
  { day: 2, month: 9, name: 'Quốc khánh Việt Nam', isMajor: true, description: 'Ngày Quốc khánh nước CHXHCN Việt Nam' },
  { day: 10, month: 10, name: 'Ngày Giải phóng Thủ đô', isMajor: false },
  { day: 13, month: 10, name: 'Ngày Doanh nhân Việt Nam', isMajor: false },
  { day: 20, month: 10, name: 'Ngày Phụ nữ Việt Nam', isMajor: false },
  { day: 20, month: 11, name: 'Ngày Nhà giáo Việt Nam', isMajor: false },
  { day: 22, month: 12, name: 'Ngày thành lập QĐND Việt Nam', isMajor: false },
  { day: 24, month: 12, name: 'Đêm Giáng sinh', isMajor: false },
  { day: 25, month: 12, name: 'Lễ Giáng sinh', isMajor: false },
];

export const LUNAR_HOLIDAYS: HolidayDef[] = [
  { day: 1, month: 1, name: 'Mùng 1 Tết Nguyên Đán', isMajor: true, description: 'Ngày đầu năm mới Âm lịch' },
  { day: 2, month: 1, name: 'Mùng 2 Tết Nguyên Đán', isMajor: true },
  { day: 3, month: 1, name: 'Mùng 3 Tết Nguyên Đán', isMajor: true },
  { day: 15, month: 1, name: 'Tết Nguyên Tiêu (Rằm tháng Giêng)', isMajor: true },
  { day: 3, month: 3, name: 'Tết Hàn Thực', isMajor: false },
  { day: 10, month: 3, name: 'Giỗ Tổ Hùng Vương', isMajor: true, description: 'Quốc lễ Giỗ Tổ Hùng Vương (10/3 Âm lịch)' },
  { day: 15, month: 4, name: 'Lễ Phật Đản', isMajor: false },
  { day: 5, month: 5, name: 'Tết Đoan Ngọ', isMajor: true },
  { day: 15, month: 7, name: 'Lễ Vu Lan (Rằm tháng Bảy)', isMajor: true, description: 'Mùa báo hiếu cha mẹ' },
  { day: 15, month: 8, name: 'Tết Trung Thu', isMajor: true, description: 'Tết Thiếu nhi & Đoàn viên' },
  { day: 9, month: 9, name: 'Tết Trùng Cửu', isMajor: false },
  { day: 10, month: 10, name: 'Tết Trùng Thập (Cơm mới)', isMajor: false },
  { day: 15, month: 10, name: 'Tết Hạ Nguyên', isMajor: false },
  { day: 23, month: 12, name: 'Ông Công Ông Táo chầu trời', isMajor: true },
];

export function getHolidaysForDate(solar: SolarDate, lunar: LunarDate): Holiday[] {
  const result: Holiday[] = [];

  for (const h of SOLAR_HOLIDAYS) {
    if (h.day === solar.day && h.month === solar.month) {
      result.push({
        name: h.name,
        type: 'solar',
        isMajor: h.isMajor,
        description: h.description,
      });
    }
  }

  // Ngày lễ Âm lịch chỉ áp dụng cho tháng thường (không áp dụng cho tháng nhuận)
  if (!lunar.isLeapMonth) {
    for (const h of LUNAR_HOLIDAYS) {
      if (h.day === lunar.day && h.month === lunar.month) {
        result.push({
          name: h.name,
          type: 'lunar',
          isMajor: h.isMajor,
          description: h.description,
        });
      }
    }
  }

  return result;
}

export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
  jd: number;
}

export interface CanChiPair {
  canIndex: number;
  chiIndex: number;
  can: string;
  chi: string;
  label: string;
}

export interface AuspiciousHour {
  chiIndex: number;
  chi: string;
  canChi: string;
  timeRange: string;
  isAuspicious: boolean;
}

export type DayQuality = 'hoang-dao' | 'hac-dao';

export interface DayAstrology {
  yearCanChi: CanChiPair;
  monthCanChi: CanChiPair;
  dayCanChi: CanChiPair;
  zodiacAnimal: string;
  napAm: string;
  nguHanh: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
  dayQuality: DayQuality;
  dayStarName: string; // Thanh Long, Minh Đường, ...
  truc: {
    name: string;
    meaning: string;
    isGood: boolean;
  };
  solarTerm: string; // Tiết khí hiện tại
  isSolarTermStart: boolean;
  auspiciousHours: AuspiciousHour[];
  hyThan: string; // Hướng Hỷ Thần
  taiThan: string; // Hướng Tài Thần
  warnings: string[]; // Nguyệt Kỵ, Tam Nương, ...
  goodFor: string[];
  avoidFor: string[];
}

export interface Holiday {
  name: string;
  type: 'solar' | 'lunar';
  isMajor: boolean;
  description?: string;
}

export interface FullDayInfo {
  solar: SolarDate;
  lunar: LunarDate;
  weekdayIndex: number; // 0 = Chủ Nhật, 1 = Thứ Hai, ...
  weekdayName: string;
  astrology: DayAstrology;
  holidays: Holiday[];
}

export interface PersonalEvent {
  id: string;
  title: string;
  note?: string;
  calendarType: 'solar' | 'lunar';
  day: number;
  month: number;
  year?: number; // Nếu repeatYearly = true thì có thể lưu năm gốc
  repeatYearly: boolean;
  category: 'gio-chap' | 'sinh-nhat' | 'le-tet' | 'ca-nhan';
  createdAt: string;
}

import {
  AUSPICIOUS_HOURS_BY_DAY_CHI,
  CAN,
  CHI,
  HOUR_RANGES,
  HY_THAN_BY_CAN,
  NAP_AM_30,
  SOLAR_TERMS_24,
  TAI_THAN_BY_CAN,
  TWELVE_STARS,
  TWELVE_TRUC,
  ZODIAC_ANIMALS,
} from './constants';
import { getSolarTermIndex } from './calendar';
import type {
  AuspiciousHour,
  CanChiPair,
  DayAstrology,
  LunarDate,
} from './types';

function makeCanChi(canIndex: number, chiIndex: number): CanChiPair {
  const safeCan = ((canIndex % 10) + 10) % 10;
  const safeChi = ((chiIndex % 12) + 12) % 12;
  return {
    canIndex: safeCan,
    chiIndex: safeChi,
    can: CAN[safeCan],
    chi: CHI[safeChi],
    label: `${CAN[safeCan]} ${CHI[safeChi]}`,
  };
}

export function getYearCanChi(lunarYear: number): CanChiPair {
  return makeCanChi(lunarYear + 6, lunarYear + 8);
}

export function getMonthCanChi(lunarMonth: number, lunarYear: number): CanChiPair {
  const yearCan = ((lunarYear + 6) % 10 + 10) % 10;
  const monthCan = (yearCan * 2 + lunarMonth + 1) % 10;
  const monthChi = (lunarMonth + 1) % 12;
  return makeCanChi(monthCan, monthChi);
}

export function getDayCanChi(jd: number): CanChiPair {
  return makeCanChi(jd + 9, jd + 1);
}

export function getAuspiciousHours(dayCanIndex: number, dayChiIndex: number): AuspiciousHour[] {
  const goodSet = new Set(AUSPICIOUS_HOURS_BY_DAY_CHI[dayChiIndex] ?? []);
  return CHI.map((chi, hourChiIdx) => {
    const hourCanIdx = ((dayCanIndex % 5) * 2 + hourChiIdx) % 10;
    return {
      chiIndex: hourChiIdx,
      chi,
      canChi: `${CAN[hourCanIdx]} ${chi}`,
      timeRange: HOUR_RANGES[hourChiIdx],
      isAuspicious: goodSet.has(hourChiIdx),
    };
  });
}

export function getDayAstrology(lunar: LunarDate): DayAstrology {
  const yearCanChi = getYearCanChi(lunar.year);
  const monthCanChi = getMonthCanChi(lunar.month, lunar.year);
  const dayCanChi = getDayCanChi(lunar.jd);

  // Nạp Âm theo Lục Thập Hoa Giáp của ngày
  const sexagenaryIdx = (6 * dayCanChi.canIndex - 5 * dayCanChi.chiIndex + 60) % 60;
  const napAmInfo = NAP_AM_30[Math.floor(sexagenaryIdx / 2)];

  // 12 Thần Sát (Hoàng Đạo / Hắc Đạo) theo tháng Âm lịch & Chi ngày
  const thanhLongStartChi = ((lunar.month - 1) % 6) * 2;
  const starIdx = (dayCanChi.chiIndex - thanhLongStartChi + 12) % 12;
  const star = TWELVE_STARS[starIdx];

  // Tiết Khí & 12 Trực
  const solarTermInfo = getSolarTermIndex(lunar.jd);
  const monthBranchForTruc = (Math.floor(((solarTermInfo.index + 3) % 24) / 2) + 2) % 12;
  const trucIdx = (dayCanChi.chiIndex - monthBranchForTruc + 12) % 12;
  const truc = TWELVE_TRUC[trucIdx];

  // Ngày kỵ dân gian Việt Nam
  const warnings: string[] = [];
  if ([5, 14, 23].includes(lunar.day)) {
    warnings.push('Ngày Nguyệt Kỵ (mùng 5, 14, 23): dân gian khuyên tránh khởi sự việc lớn');
  }
  if ([3, 7, 13, 18, 22, 27].includes(lunar.day)) {
    warnings.push('Ngày Tam Nương: cân nhắc kỹ khi cưới hỏi, khai trương');
  }
  if (!star.isHoangDao) {
    warnings.push(`Ngày Hắc Đạo (${star.name}): nên ưu tiên các việc nhẹ nhàng, thường nhật`);
  }

  const goodFor: string[] = [];
  const avoidFor: string[] = [];

  if (star.isHoangDao && truc.isGood && warnings.length === 0) {
    goodFor.push('Cầu tài, khai trương', 'Xuất hành, gặp gỡ đối tác', 'Ký kết, sửa sang nhà cửa');
  } else if (star.isHoangDao || truc.isGood) {
    goodFor.push('Giao dịch thường nhật', 'Học tập, lên kế hoạch', 'Dọn dẹp, chăm sóc gia đình');
  } else {
    goodFor.push('Nghỉ ngơi, hoàn tất việc tồn đọng', 'Cầu an, làm việc thiện');
  }

  if (!truc.isGood || warnings.length > 0) {
    avoidFor.push('Động thổ, cất nóc', 'Cưới hỏi, mở hàng quy mô lớn');
  } else {
    avoidFor.push('Tranh chấp, kiện tụng');
  }

  return {
    yearCanChi,
    monthCanChi,
    dayCanChi,
    zodiacAnimal: ZODIAC_ANIMALS[yearCanChi.chiIndex],
    napAm: napAmInfo.name,
    nguHanh: napAmInfo.element,
    dayQuality: star.isHoangDao ? 'hoang-dao' : 'hac-dao',
    dayStarName: star.name,
    truc: { ...truc },
    solarTerm: SOLAR_TERMS_24[solarTermInfo.index],
    isSolarTermStart: solarTermInfo.isStartDay,
    auspiciousHours: getAuspiciousHours(dayCanChi.canIndex, dayCanChi.chiIndex),
    hyThan: HY_THAN_BY_CAN[dayCanChi.canIndex],
    taiThan: TAI_THAN_BY_CAN[dayCanChi.canIndex],
    warnings,
    goodFor,
    avoidFor,
  };
}

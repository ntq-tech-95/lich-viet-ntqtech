import { getDayAstrology } from './astrology';
import {
  convertLunar2Solar,
  convertSolar2Lunar,
  getDaysInLunarMonth,
  getDaysInSolarMonth,
  getLeapMonthOfLunarYear,
  jdFromDate,
  jdToDate,
} from './calendar';
import { LUNAR_MONTH_NAMES, WEEKDAYS } from './constants';
import { getHolidaysForDate } from './holidays';
import type { FullDayInfo, LunarDate, SolarDate } from './types';

export * from './types';
export * from './constants';
export * from './calendar';
export * from './astrology';
export * from './holidays';

export function getWeekdayIndex(jd: number): number {
  // jdFromDate(1, 1, 2000) = 2451545 (Thứ Bảy = 6). (2451545 + 1) % 7 = 6.
  return (jd + 1) % 7;
}

export function getFullDayInfo(day: number, month: number, year: number): FullDayInfo {
  const solar: SolarDate = { day, month, year };
  const lunar = convertSolar2Lunar(day, month, year);
  const weekdayIndex = getWeekdayIndex(lunar.jd);
  const astrology = getDayAstrology(lunar);
  const holidays = getHolidaysForDate(solar, lunar);

  return {
    solar,
    lunar,
    weekdayIndex,
    weekdayName: WEEKDAYS[weekdayIndex],
    astrology,
    holidays,
  };
}

export function formatLunarShort(lunar: LunarDate): string {
  const leapSuffix = lunar.isLeapMonth ? ' nhuận' : '';
  return `${lunar.day}/${lunar.month}${leapSuffix}`;
}

export function formatLunarMonthName(month: number, isLeapMonth: boolean): string {
  const base = LUNAR_MONTH_NAMES[month] ?? `Tháng ${month}`;
  return isLeapMonth ? `${base} (Nhuận)` : base;
}

export function getTodaySolar(): SolarDate {
  const now = new Date();
  return {
    day: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

export function getNextTetCountdown(fromSolar: SolarDate): {
  daysRemaining: number;
  tetSolar: SolarDate;
  lunarYear: number;
} {
  const todayJd = jdFromDate(fromSolar.day, fromSolar.month, fromSolar.year);
  const todayLunar = convertSolar2Lunar(fromSolar.day, fromSolar.month, fromSolar.year);

  let targetLunarYear = todayLunar.year;
  let tetSolar = convertLunar2Solar(1, 1, targetLunarYear, false)!;
  let tetJd = jdFromDate(tetSolar.day, tetSolar.month, tetSolar.year);

  if (tetJd < todayJd) {
    targetLunarYear += 1;
    tetSolar = convertLunar2Solar(1, 1, targetLunarYear, false)!;
    tetJd = jdFromDate(tetSolar.day, tetSolar.month, tetSolar.year);
  }

  return {
    daysRemaining: tetJd - todayJd,
    tetSolar,
    lunarYear: targetLunarYear,
  };
}

export { getDaysInLunarMonth, getDaysInSolarMonth, getLeapMonthOfLunarYear, jdFromDate, jdToDate };

import { VIETNAM_TIMEZONE } from './constants';
import type { LunarDate, SolarDate } from './types';

const PI = Math.PI;
const SYNODIC_MONTH = 29.530588861;
const J2000_NEW_MOON_JD = 2451550.09766;

function intFloor(d: number): number {
  return Math.floor(d);
}

/**
 * Chuyển ngày Dương lịch (dd/mm/yyyy) sang Số ngày Julius (Julian Day Number).
 */
export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = intFloor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd +
    intFloor((153 * m + 2) / 5) +
    365 * y +
    intFloor(y / 4) -
    intFloor(y / 100) +
    intFloor(y / 400) -
    32045;
  if (jd < 2299161) {
    jd =
      dd +
      intFloor((153 * m + 2) / 5) +
      365 * y +
      intFloor(y / 4) -
      32083;
  }
  return jd;
}

/**
 * Chuyển Số ngày Julius sang ngày Dương lịch (dd/mm/yyyy).
 */
export function jdToDate(jd: number): SolarDate {
  let a: number;
  let b: number;
  let c: number;
  if (jd > 2299160) {
    a = jd + 32044;
    b = intFloor((4 * a + 3) / 146097);
    c = a - intFloor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = intFloor((4 * c + 3) / 1461);
  const e = c - intFloor((1461 * d) / 4);
  const m = intFloor((5 * e + 2) / 153);
  const day = e - intFloor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * intFloor(m / 10);
  const year = b * 100 + d - 4800 + intFloor(m / 10);
  return { day, month, year };
}

/**
 * Ước lượng Delta T (TT - UT) tính bằng giây theo NASA (Espenak & Meeus).
 */
function deltaTSeconds(year: number): number {
  if (year >= 2005 && year < 2050) {
    const t = year - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }
  if (year >= 2050 && year <= 2150) {
    const u = (year - 1820) / 100;
    return -20 + 32 * u * u - 0.5628 * (2150 - year);
  }
  if (year >= 1986 && year < 2005) {
    const t = year - 2000;
    return (
      63.86 +
      0.3345 * t -
      0.060374 * t * t +
      0.0017275 * t * t * t +
      0.000651814 * t * t * t * t +
      0.00002373599 * t * t * t * t * t
    );
  }
  if (year >= 1961 && year < 1986) {
    const t = year - 1975;
    return 45.45 + 1.067 * t - (t * t) / 260 - (t * t * t) / 718;
  }
  if (year >= 1941 && year < 1961) {
    const t = year - 1950;
    return 29.07 + 0.407 * t - (t * t) / 233 + (t * t * t) / 2547;
  }
  if (year >= 1920 && year < 1941) {
    const t = year - 1920;
    return 21.20 + 0.84493 * t - 0.0761 * t * t + 0.0020936 * t * t * t;
  }
  if (year >= 1900 && year < 1920) {
    const t = year - 1900;
    return (
      -2.79 +
      1.494119 * t -
      0.0598939 * t * t +
      0.0061966 * t * t * t -
      0.000197 * t * t * t * t
    );
  }
  const u = (year - 1820) / 100;
  return -20 + 32 * u * u;
}

/**
 * Tính thời điểm Sóc thứ k (k = 0 tại Sóc đầu tháng 1/2000) theo Jean Meeus Ch. 49 (bản đầy đủ).
 * Trả về Julian Day theo giờ UT.
 */
function newMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  const dr = PI / 180;

  const Jde =
    J2000_NEW_MOON_JD +
    SYNODIC_MONTH * k +
    0.00015437 * T2 -
    0.000000150 * T3 +
    0.00000000073 * T4;

  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const E2 = E * E;

  const M = (2.5534 + 29.10535670 * k - 0.0000014 * T2 - 0.00000011 * T3) * dr;
  const Mpr =
    (201.5643 +
      385.81693528 * k +
      0.0107582 * T2 +
      0.00001238 * T3 -
      0.000000058 * T4) *
    dr;
  const F =
    (160.7108 +
      390.67050284 * k -
      0.0016118 * T2 -
      0.00000227 * T3 +
      0.000000011 * T4) *
    dr;
  const Omega = (124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3) * dr;

  let corr =
    -0.40720 * Math.sin(Mpr) +
    0.17241 * E * Math.sin(M) +
    0.01608 * Math.sin(2 * Mpr) +
    0.01039 * Math.sin(2 * F) +
    0.00739 * E * Math.sin(Mpr - M) -
    0.00514 * E * Math.sin(Mpr + M) +
    0.00208 * E2 * Math.sin(2 * M) -
    0.00111 * Math.sin(Mpr - 2 * F) -
    0.00057 * Math.sin(Mpr + 2 * F) +
    0.00056 * E * Math.sin(2 * Mpr + M) -
    0.00042 * Math.sin(3 * Mpr) +
    0.00042 * E * Math.sin(M + 2 * F) +
    0.00038 * E * Math.sin(M - 2 * F) -
    0.00024 * E * Math.sin(2 * Mpr - M) -
    0.00017 * Math.sin(Omega) -
    0.00007 * Math.sin(Mpr + 2 * M) +
    0.00004 * Math.sin(2 * Mpr - 2 * F) +
    0.00004 * Math.sin(3 * M) +
    0.00003 * Math.sin(Mpr + M - 2 * F) +
    0.00003 * Math.sin(2 * Mpr + 2 * F) -
    0.00003 * Math.sin(Mpr + M + 2 * F) +
    0.00003 * Math.sin(Mpr - M + 2 * F) -
    0.00002 * Math.sin(Mpr - M - 2 * F) -
    0.00002 * Math.sin(3 * Mpr + M) +
    0.00002 * Math.sin(4 * Mpr);

  // Số hạng hành tinh A1..A14
  const A1 = (299.77 + 0.107408 * k - 0.009173 * T2) * dr;
  const A2 = (251.88 + 0.016321 * k) * dr;
  const A3 = (251.83 + 26.651886 * k) * dr;
  const A4 = (349.42 + 36.412478 * k) * dr;
  const A5 = (84.66 + 18.206239 * k) * dr;
  const A6 = (141.74 + 53.303771 * k) * dr;
  const A7 = (207.14 + 2.453732 * k) * dr;
  const A8 = (154.84 + 7.306860 * k) * dr;
  const A9 = (34.52 + 27.261239 * k) * dr;
  const A10 = (207.19 + 0.121824 * k) * dr;
  const A11 = (291.34 + 1.844379 * k) * dr;
  const A12 = (161.72 + 24.198154 * k) * dr;
  const A13 = (239.56 + 25.513099 * k) * dr;
  const A14 = (331.55 + 3.592518 * k) * dr;

  corr +=
    0.000325 * Math.sin(A1) +
    0.000165 * Math.sin(A2) +
    0.000164 * Math.sin(A3) +
    0.000126 * Math.sin(A4) +
    0.000110 * Math.sin(A5) +
    0.000062 * Math.sin(A6) +
    0.000060 * Math.sin(A7) +
    0.000056 * Math.sin(A8) +
    0.000047 * Math.sin(A9) +
    0.000042 * Math.sin(A10) +
    0.000040 * Math.sin(A11) +
    0.000037 * Math.sin(A12) +
    0.000035 * Math.sin(A13) +
    0.000023 * Math.sin(A14);

  const approxYear = 2000 + k / 12.3685;
  const deltaT = deltaTSeconds(approxYear) / 86400;

  return Jde + corr - deltaT;
}

/**
 * Ngày Sóc (mùng 1 Âm lịch) thứ k theo múi giờ Việt Nam (UTC+7).
 */
export function getNewMoonDay(k: number, timeZone = VIETNAM_TIMEZONE): number {
  return intFloor(newMoon(k) + 0.5 + timeZone / 24);
}

/**
 * Kinh độ hoàng đạo biểu kiến của Mặt Trời (tính bằng độ, trong khoảng [0, 360)) tại Julian Day (UT).
 */
export function sunLongitudeDegrees(jdn: number): number {
  const approxYear = 2000 + (jdn - 2451545.0) / 365.25;
  const jde = jdn + deltaTSeconds(approxYear) / 86400;
  const T = (jde - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T2;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000289 * Math.sin(dr * 3 * M);
  const trueLong = L0 + DL;
  const omega = 125.04 - 1934.136 * T;
  let lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * dr);
  lambda = lambda - 360 * intFloor(lambda / 360);
  if (lambda < 0) lambda += 360;
  return lambda;
}

/**
 * Cung Trung Khí (0..11, mỗi cung 30 độ) tại 00:00 giờ địa phương của ngày jdn.
 */
export function getSunLongitude(dayNumber: number, timeZone = VIETNAM_TIMEZONE): number {
  const deg = sunLongitudeDegrees(dayNumber - 0.5 - timeZone / 24);
  return intFloor(deg / 30);
}

/**
 * Chỉ số Tiết Khí (0..23, mỗi tiết 15 độ) tại 00:00 và kiểm tra ngày jdn có phải ngày giao tiết khí hay không.
 */
export function getSolarTermIndex(dayNumber: number, timeZone = VIETNAM_TIMEZONE): {
  index: number;
  isStartDay: boolean;
} {
  const startDeg = sunLongitudeDegrees(dayNumber - 0.5 - timeZone / 24);
  const endDeg = sunLongitudeDegrees(dayNumber + 0.5 - timeZone / 24);
  const startIdx = intFloor(startDeg / 15) % 24;
  const endIdx = intFloor(endDeg / 15) % 24;
  if (startIdx !== endIdx) {
    return { index: endIdx, isStartDay: true };
  }
  return { index: startIdx, isStartDay: false };
}

/**
 * Tìm ngày bắt đầu tháng 11 Âm lịch (chứa Đông Chí) của năm Dương lịch yy.
 */
export function getLunarMonth11(yy: number, timeZone = VIETNAM_TIMEZONE): number {
  const dec31 = jdFromDate(31, 12, yy);
  let k = intFloor((dec31 - J2000_NEW_MOON_JD) / SYNODIC_MONTH);
  let nm = getNewMoonDay(k, timeZone);
  while (nm > dec31) {
    k -= 1;
    nm = getNewMoonDay(k, timeZone);
  }
  while (getNewMoonDay(k + 1, timeZone) <= dec31) {
    k += 1;
    nm = getNewMoonDay(k, timeZone);
  }
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/**
 * Xác định vị trí tháng nhuận sau tháng 11 Âm lịch a11.
 */
export function getLeapMonthOffset(a11: number, timeZone = VIETNAM_TIMEZONE): number {
  const k = Math.round((a11 - J2000_NEW_MOON_JD) / SYNODIC_MONTH);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Đổi ngày Dương lịch sang Âm lịch Việt Nam (múi giờ UTC+7).
 */
export function convertSolar2Lunar(
  dd: number,
  mm: number,
  yy: number,
  timeZone = VIETNAM_TIMEZONE,
): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  let k = intFloor((dayNumber - J2000_NEW_MOON_JD) / SYNODIC_MONTH);
  while (getNewMoonDay(k + 1, timeZone) <= dayNumber) {
    k += 1;
  }
  let monthStart = getNewMoonDay(k, timeZone);
  while (monthStart > dayNumber) {
    k -= 1;
    monthStart = getNewMoonDay(k, timeZone);
  }

  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = intFloor((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }

  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeapMonth: lunarLeap,
    jd: dayNumber,
  };
}

/**
 * Đổi ngày Âm lịch sang Dương lịch Việt Nam (múi giờ UTC+7).
 * Trả về null nếu ngày Âm lịch không hợp lệ.
 */
export function convertLunar2Solar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  lunarLeap = false,
  timeZone = VIETNAM_TIMEZONE,
): SolarDate | null {
  if (lunarDay < 1 || lunarDay > 30 || lunarMonth < 1 || lunarMonth > 12) {
    return null;
  }

  let a11: number;
  let b11: number;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }

  const k = Math.round((a11 - J2000_NEW_MOON_JD) / SYNODIC_MONTH);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }

  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth <= 0) {
      leapMonth += 12;
    }
    if (lunarLeap && lunarMonth !== leapMonth) {
      return null;
    }
    if (lunarLeap || off >= leapOff) {
      off += 1;
    }
  } else if (lunarLeap) {
    return null;
  }

  const monthStart = getNewMoonDay(k + off, timeZone);
  const nextMonthStart = getNewMoonDay(k + off + 1, timeZone);
  const daysInMonth = nextMonthStart - monthStart;
  if (lunarDay > daysInMonth) {
    return null;
  }

  return jdToDate(monthStart + lunarDay - 1);
}

/**
 * Kiểm tra tháng nhuận của một năm Âm lịch (trả về số tháng 1..12 nếu có, ngược lại trả về null).
 */
export function getLeapMonthOfLunarYear(
  lunarYear: number,
  timeZone = VIETNAM_TIMEZONE,
): number | null {
  const a11 = getLunarMonth11(lunarYear - 1, timeZone);
  const b11 = getLunarMonth11(lunarYear, timeZone);
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth <= 0) leapMonth += 12;
    if (leapMonth >= 1 && leapMonth <= 10) {
      return leapMonth;
    }
  }
  const a11Next = b11;
  const b11Next = getLunarMonth11(lunarYear + 1, timeZone);
  if (b11Next - a11Next > 365) {
    const leapOff = getLeapMonthOffset(a11Next, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth <= 0) leapMonth += 12;
    if (leapMonth >= 11) {
      return leapMonth;
    }
  }
  return null;
}

/**
 * Số ngày trong một tháng Dương lịch.
 */
export function getDaysInSolarMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Số ngày trong một tháng Âm lịch (29 hoặc 30).
 */
export function getDaysInLunarMonth(
  lunarMonth: number,
  lunarYear: number,
  isLeapMonth = false,
  timeZone = VIETNAM_TIMEZONE,
): number {
  const day1 = convertLunar2Solar(1, lunarMonth, lunarYear, isLeapMonth, timeZone);
  if (!day1) return 0;
  const day30 = convertLunar2Solar(30, lunarMonth, lunarYear, isLeapMonth, timeZone);
  return day30 ? 30 : 29;
}

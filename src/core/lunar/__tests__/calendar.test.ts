import { describe, expect, it } from 'vitest';
import {
  convertLunar2Solar,
  convertSolar2Lunar,
  getDayCanChi,
  getDaysInLunarMonth,
  getFullDayInfo,
  getLeapMonthOfLunarYear,
  getMonthCanChi,
  getNextTetCountdown,
  getYearCanChi,
  jdFromDate,
  jdToDate,
} from '../index';

describe('Vietnamese Lunar Calendar Engine (UTC+7)', () => {
  it('converts Julian Day Numbers back and forth accurately', () => {
    const samples = [
      { day: 1, month: 1, year: 2000 },
      { day: 29, month: 2, year: 2024 },
      { day: 24, month: 11, year: 2026 },
      { day: 15, month: 10, year: 1582 },
    ];
    for (const d of samples) {
      const jd = jdFromDate(d.day, d.month, d.year);
      expect(jdToDate(jd)).toEqual(d);
    }
  });

  it('matches known Vietnamese Tết Nguyên Đán dates', () => {
    expect(convertSolar2Lunar(22, 1, 2023)).toMatchObject({
      day: 1,
      month: 1,
      year: 2023,
      isLeapMonth: false,
    });
    expect(convertSolar2Lunar(10, 2, 2024)).toMatchObject({
      day: 1,
      month: 1,
      year: 2024,
      isLeapMonth: false,
    });
    expect(convertSolar2Lunar(29, 1, 2025)).toMatchObject({
      day: 1,
      month: 1,
      year: 2025,
      isLeapMonth: false,
    });
    expect(convertSolar2Lunar(17, 2, 2026)).toMatchObject({
      day: 1,
      month: 1,
      year: 2026,
      isLeapMonth: false,
    });
    expect(convertSolar2Lunar(6, 2, 2027)).toMatchObject({
      day: 1,
      month: 1,
      year: 2027,
      isLeapMonth: false,
    });
  });

  it('detects leap months accurately (2023 nhuận tháng 2, 2025 nhuận tháng 6)', () => {
    expect(getLeapMonthOfLunarYear(2023)).toBe(2);
    expect(getLeapMonthOfLunarYear(2024)).toBeNull();
    expect(getLeapMonthOfLunarYear(2025)).toBe(6);
    expect(getLeapMonthOfLunarYear(2026)).toBeNull();

    // 22/03/2023 Dương lịch = 01/02 nhuận Quý Mão 2023
    expect(convertSolar2Lunar(22, 3, 2023)).toMatchObject({
      day: 1,
      month: 2,
      year: 2023,
      isLeapMonth: true,
    });

    // 25/07/2025 Dương lịch = 01/06 nhuận Ất Tỵ 2025
    expect(convertSolar2Lunar(25, 7, 2025)).toMatchObject({
      day: 1,
      month: 6,
      year: 2025,
      isLeapMonth: true,
    });
  });

  it('round-trips every single day between 1900 and 2100', () => {
    const startJd = jdFromDate(1, 1, 1900);
    const endJd = jdFromDate(31, 12, 2100);
    for (let jd = startJd; jd <= endJd; jd++) {
      const solar = jdToDate(jd);
      const lunar = convertSolar2Lunar(solar.day, solar.month, solar.year);
      const back = convertLunar2Solar(
        lunar.day,
        lunar.month,
        lunar.year,
        lunar.isLeapMonth,
      );
      expect(back).toEqual(solar);
    }
  });

  it('rejects invalid lunar dates gracefully', () => {
    // Năm 2024 không có tháng nhuận
    expect(convertLunar2Solar(1, 2, 2024, true)).toBeNull();
    // Ngày 30 ở tháng thiếu (tháng 2 năm 2024 hoặc tháng 12 năm 2025)
    const days = getDaysInLunarMonth(12, 2025, false);
    if (days === 29) {
      expect(convertLunar2Solar(30, 12, 2025, false)).toBeNull();
    }
  });

  it('computes Can Chi correctly', () => {
    expect(getYearCanChi(2024).label).toBe('Giáp Thìn');
    expect(getYearCanChi(2025).label).toBe('Ất Tỵ');
    expect(getYearCanChi(2026).label).toBe('Bính Ngọ');

    expect(getMonthCanChi(1, 2024).label).toBe('Bính Dần');
    expect(getMonthCanChi(1, 2026).label).toBe('Canh Dần');

    // 01/01/2000 Dương lịch là ngày Mậu Ngọ
    expect(getDayCanChi(jdFromDate(1, 1, 2000)).label).toBe('Mậu Ngọ');
  });

  it('provides full day info, holidays, and Tet countdown', () => {
    const info = getFullDayInfo(17, 2, 2026);
    expect(info.lunar).toMatchObject({ day: 1, month: 1, year: 2026 });
    expect(info.holidays.some((h) => h.name.includes('Tết Nguyên Đán'))).toBe(true);
    expect(info.astrology.auspiciousHours.filter((h) => h.isAuspicious)).toHaveLength(6);

    const countdown = getNextTetCountdown({ day: 24, month: 11, year: 2026 });
    expect(countdown.lunarYear).toBe(2027);
    expect(countdown.tetSolar).toEqual({ day: 6, month: 2, year: 2027 });
    expect(countdown.daysRemaining).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from 'vitest';
import {
  buildUpcomingReminders,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '../notifications';
import type { PersonalEvent } from '../../core/lunar';

describe('Reminder Scheduling (Mùng 1, Rằm & Giỗ chạp)', () => {
  it('generates upcoming Mùng 1 and Rằm reminders chronologically', () => {
    const now = new Date(2026, 10, 24, 6, 0, 0); // 24/11/2026 06:00 (16/10 Âm lịch)
    const reminders = buildUpcomingReminders([], DEFAULT_NOTIFICATION_SETTINGS, now);

    expect(reminders.length).toBeGreaterThanOrEqual(10);
    // Ngày 16/10 Âm lịch -> Mùng 1/11 ÂL là 09/12/2026 Dương lịch
    expect(reminders[0].title).toContain('Mùng 1');
    expect(reminders[0].solar).toEqual({ day: 9, month: 12, year: 2026 });
    expect(reminders[0].at.getHours()).toBe(7);
    expect(reminders[0].at.getMinutes()).toBe(30);
  });

  it('schedules yearly lunar personal events accurately', () => {
    const now = new Date(2026, 10, 24, 6, 0, 0); // 24/11/2026
    const events: PersonalEvent[] = [
      {
        id: 'gio-1',
        title: 'Giỗ Ông Nội',
        calendarType: 'lunar',
        day: 20,
        month: 10,
        repeatYearly: true,
        category: 'gio-chap',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ];
    const reminders = buildUpcomingReminders(
      events,
      { ...DEFAULT_NOTIFICATION_SETTINGS, includeMung1AndRam: false },
      now,
    );

    expect(reminders).toHaveLength(1);
    expect(reminders[0].title).toBe('Nhắc lịch: Giỗ Ông Nội');
    // 24/11/2026 là 16/10 ÂL -> 20/10 ÂL là 28/11/2026
    expect(reminders[0].solar).toEqual({ day: 28, month: 11, year: 2026 });
  });
});

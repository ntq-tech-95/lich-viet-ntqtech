import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import {
  convertLunar2Solar,
  convertSolar2Lunar,
  formatLunarMonthName,
  getTodaySolar,
  jdFromDate,
  type PersonalEvent,
  type SolarDate,
} from '../core/lunar';

export interface NotificationSettings {
  enabled: boolean;
  includeMung1AndRam: boolean;
  includePersonalEvents: boolean;
  hour: number;
  minute: number;
}

export interface ScheduledReminderItem {
  id: number;
  title: string;
  body: string;
  solar: SolarDate;
  at: Date;
  kind: 'mung1-ram' | 'event';
}

const SETTINGS_STORAGE_KEY = 'lich-viet-notification-settings-v1';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  includeMung1AndRam: true,
  includePersonalEvents: true,
  hour: 7,
  minute: 30,
};

export function loadNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota error
  }
}

/**
 * Tạo danh sách các lịch nhắc sắp tới (Mùng 1, Ngày Rằm & Sự kiện/Giỗ chạp cá nhân).
 * Giới hạn tối đa 40 thông báo gần nhất để tuân thủ giới hạn iOS/Android.
 */
export function buildUpcomingReminders(
  events: PersonalEvent[],
  settings: NotificationSettings,
  now = new Date(),
): ScheduledReminderItem[] {
  if (!settings.enabled) return [];

  const todaySolar = getTodaySolarFromDate(now);
  const todayJd = jdFromDate(todaySolar.day, todaySolar.month, todaySolar.year);
  const todayLunar = convertSolar2Lunar(
    todaySolar.day,
    todaySolar.month,
    todaySolar.year,
  );
  const items: ScheduledReminderItem[] = [];
  let nextId = 1001;

  const makeTargetDate = (solar: SolarDate): Date =>
    new Date(solar.year, solar.month - 1, solar.day, settings.hour, settings.minute, 0, 0);

  // 1. Nhắc Mùng 1 và Ngày Rằm (15) trong 6 tháng Âm lịch tới
  if (settings.includeMung1AndRam) {
    let m = todayLunar.month;
    let y = todayLunar.year;
    for (let i = 0; i < 7; i++) {
      for (const lunarDay of [1, 15]) {
        const solar = convertLunar2Solar(lunarDay, m, y, false);
        if (!solar) continue;
        const at = makeTargetDate(solar);
        if (at.getTime() <= now.getTime()) continue;

        const monthLabel = formatLunarMonthName(m, false);
        items.push({
          id: nextId++,
          title:
            lunarDay === 1
              ? `Hôm nay Mùng 1 ${monthLabel}`
              : `Hôm nay Ngày Rằm ${monthLabel}`,
          body: `Ngày ${String(solar.day).padStart(2, '0')}/${String(solar.month).padStart(2, '0')}/${solar.year} Dương lịch — Xem giờ Hoàng Đạo trên Lịch Việt.`,
          solar,
          at,
          kind: 'mung1-ram',
        });
      }
      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
    }
  }

  // 2. Nhắc sự kiện & giỗ chạp cá nhân
  if (settings.includePersonalEvents) {
    for (const ev of events) {
      let targetSolar: SolarDate | null = null;

      if (ev.calendarType === 'solar') {
        const baseYear = ev.repeatYearly ? todaySolar.year : (ev.year ?? todaySolar.year);
        targetSolar = { day: ev.day, month: ev.month, year: baseYear };
        if (ev.repeatYearly && makeTargetDate(targetSolar).getTime() <= now.getTime()) {
          targetSolar = { day: ev.day, month: ev.month, year: baseYear + 1 };
        }
      } else {
        const baseLunarYear = ev.repeatYearly ? todayLunar.year : (ev.year ?? todayLunar.year);
        targetSolar = convertLunar2Solar(ev.day, ev.month, baseLunarYear, false);
        if (
          ev.repeatYearly &&
          (!targetSolar || makeTargetDate(targetSolar).getTime() <= now.getTime())
        ) {
          targetSolar = convertLunar2Solar(ev.day, ev.month, baseLunarYear + 1, false);
        }
      }

      if (!targetSolar) continue;
      const at = makeTargetDate(targetSolar);
      if (at.getTime() <= now.getTime()) continue;

      const targetJd = jdFromDate(targetSolar.day, targetSolar.month, targetSolar.year);
      if (targetJd - todayJd > 366) continue;

      const calLabel =
        ev.calendarType === 'lunar'
          ? `${ev.day}/${ev.month} Âm lịch`
          : `${ev.day}/${ev.month} Dương lịch`;

      items.push({
        id: nextId++,
        title: `Nhắc lịch: ${ev.title}`,
        body: `${calLabel}${ev.note ? ` · ${ev.note}` : ''}`,
        solar: targetSolar,
        at,
        kind: 'event',
      });
    }
  }

  return items
    .sort((a, b) => a.at.getTime() - b.at.getTime())
    .slice(0, 40);
}

function getTodaySolarFromDate(d: Date): SolarDate {
  return {
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
  };
}

export async function syncLocalNotifications(
  events: PersonalEvent[],
  settings: NotificationSettings,
): Promise<{ mode: 'native' | 'web'; scheduledCount: number; message: string }> {
  const upcoming = buildUpcomingReminders(events, settings);

  if (!Capacitor.isNativePlatform()) {
    if (settings.enabled && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {
        // Ignore browser permission prompt error
      }
    }
    return {
      mode: 'web',
      scheduledCount: upcoming.length,
      message: settings.enabled
        ? `Đã chuẩn bị ${upcoming.length} lịch nhắc sắp tới (thông báo đẩy tự động kích hoạt khi cài app Android/iOS).`
        : 'Đã tắt nhắc lịch tự động.',
    };
  }

  // Nền tảng Native (Android / iOS)
  const perm = await LocalNotifications.requestPermissions();
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length > 0) {
    await LocalNotifications.cancel({ notifications: pending.notifications });
  }

  if (!settings.enabled) {
    return {
      mode: 'native',
      scheduledCount: 0,
      message: 'Đã tắt toàn bộ thông báo nhắc lịch trên thiết bị.',
    };
  }

  if (perm.display !== 'granted') {
    return {
      mode: 'native',
      scheduledCount: 0,
      message: 'Ứng dụng chưa được cấp quyền Thông báo. Vui lòng bật trong Cài đặt điện thoại.',
    };
  }

  if (upcoming.length > 0) {
    await LocalNotifications.schedule({
      notifications: upcoming.map((item) => ({
        id: item.id,
        title: item.title,
        body: item.body,
        schedule: { at: item.at, allowWhileIdle: true },
      })),
    });
  }

  return {
    mode: 'native',
    scheduledCount: upcoming.length,
    message: `Đã hẹn ${upcoming.length} thông báo nhắc tự động lúc ${String(settings.hour).padStart(2, '0')}:${String(settings.minute).padStart(2, '0')}.`,
  };
}

export function getTodaysDueReminders(
  events: PersonalEvent[],
  settings: NotificationSettings,
): string[] {
  if (!settings.enabled) return [];
  const today = getTodaySolar();
  const lunar = convertSolar2Lunar(today.day, today.month, today.year);
  const due: string[] = [];

  if (settings.includeMung1AndRam && !lunar.isLeapMonth) {
    if (lunar.day === 1) due.push(`Hôm nay là Mùng 1 ${formatLunarMonthName(lunar.month, false)}`);
    if (lunar.day === 15) due.push(`Hôm nay là Ngày Rằm ${formatLunarMonthName(lunar.month, false)}`);
  }

  if (settings.includePersonalEvents) {
    for (const ev of events) {
      const match =
        ev.calendarType === 'solar'
          ? ev.day === today.day && ev.month === today.month && (ev.repeatYearly || !ev.year || ev.year === today.year)
          : !lunar.isLeapMonth &&
            ev.day === lunar.day &&
            ev.month === lunar.month &&
            (ev.repeatYearly || !ev.year || ev.year === lunar.year);
      if (match) due.push(ev.title);
    }
  }
  return due;
}

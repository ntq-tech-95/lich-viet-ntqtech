import { useCallback, useEffect, useState } from 'react';
import type { LunarDate, PersonalEvent, SolarDate } from '../core/lunar';

const STORAGE_KEY = 'lich-viet-personal-events-v1';

function isValidEvent(item: unknown): item is PersonalEvent {
  if (!item || typeof item !== 'object') return false;
  const ev = item as Record<string, unknown>;
  return (
    typeof ev.id === 'string' &&
    typeof ev.title === 'string' &&
    ev.title.trim().length > 0 &&
    (ev.calendarType === 'solar' || ev.calendarType === 'lunar') &&
    typeof ev.day === 'number' &&
    ev.day >= 1 &&
    ev.day <= 31 &&
    typeof ev.month === 'number' &&
    ev.month >= 1 &&
    ev.month <= 12 &&
    typeof ev.repeatYearly === 'boolean' &&
    (ev.category === 'gio-chap' ||
      ev.category === 'sinh-nhat' ||
      ev.category === 'le-tet' ||
      ev.category === 'ca-nhan')
  );
}

function loadEvents(): PersonalEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isValidEvent) : [];
  } catch {
    return [];
  }
}

export function useEvents() {
  const [events, setEvents] = useState<PersonalEvent[]>(loadEvents);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      // Bỏ qua lỗi quota storage
    }
  }, [events]);

  const addEvent = useCallback(
    (input: Omit<PersonalEvent, 'id' | 'createdAt'>) => {
      const next: PersonalEvent = {
        ...input,
        id:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
      };
      setEvents((prev) => [next, ...prev]);
      return next;
    },
    [],
  );

  const removeEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const exportEventsJson = useCallback(() => {
    return JSON.stringify(
      {
        app: 'lich-viet-ntqtech',
        version: 1,
        exportedAt: new Date().toISOString(),
        events,
      },
      null,
      2,
    );
  }, [events]);

  const importEventsJson = useCallback(
    (rawText: string): { added: number; total: number } => {
      const parsed = JSON.parse(rawText);
      const list: unknown[] = Array.isArray(parsed)
        ? parsed
        : parsed &&
            typeof parsed === 'object' &&
            Array.isArray((parsed as { events?: unknown }).events)
          ? (parsed as { events: unknown[] }).events
          : [];

      const validImported = list.filter(isValidEvent);
      if (validImported.length === 0 && list.length > 0) {
        throw new Error('Tệp sao lưu không chứa sự kiện hợp lệ.');
      }

      const existingIds = new Set(events.map((e) => e.id));
      const newItems = validImported.filter((e) => !existingIds.has(e.id));
      const merged = [...newItems, ...events];
      setEvents(merged);

      return { added: newItems.length, total: merged.length };
    },
    [events],
  );

  const getEventsForDay = useCallback(
    (solar: SolarDate, lunar: LunarDate): PersonalEvent[] => {
      return events.filter((ev) => {
        if (ev.calendarType === 'solar') {
          if (ev.day !== solar.day || ev.month !== solar.month) return false;
          return ev.repeatYearly || !ev.year || ev.year === solar.year;
        }
        // Âm lịch: mặc định áp dụng vào tháng thường (tránh trùng vào tháng nhuận)
        if (lunar.isLeapMonth) return false;
        if (ev.day !== lunar.day || ev.month !== lunar.month) return false;
        return ev.repeatYearly || !ev.year || ev.year === lunar.year;
      });
    },
    [events],
  );

  return {
    events,
    addEvent,
    removeEvent,
    exportEventsJson,
    importEventsJson,
    getEventsForDay,
  };
}

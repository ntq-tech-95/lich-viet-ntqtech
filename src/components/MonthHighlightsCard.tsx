import { CalendarHeart, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import {
  getDaysInSolarMonth,
  getFullDayInfo,
  type LunarDate,
  type PersonalEvent,
  type SolarDate,
} from '../core/lunar';

interface MonthHighlightsCardProps {
  viewMonth: number;
  viewYear: number;
  onSelectDate: (solar: SolarDate) => void;
  getEventsForDay: (solar: SolarDate, lunar: LunarDate) => PersonalEvent[];
}

interface HighlightItem {
  solar: SolarDate;
  lunarLabel: string;
  title: string;
  kind: 'holiday' | 'event' | 'solar-term';
}

export function MonthHighlightsCard({
  viewMonth,
  viewYear,
  onSelectDate,
  getEventsForDay,
}: MonthHighlightsCardProps) {
  const highlights = useMemo<HighlightItem[]>(() => {
    const days = getDaysInSolarMonth(viewMonth, viewYear);
    const items: HighlightItem[] = [];

    for (let d = 1; d <= days; d++) {
      const info = getFullDayInfo(d, viewMonth, viewYear);
      const lunarLabel = `${info.lunar.day}/${info.lunar.month}${info.lunar.isLeapMonth ? ' nhuận' : ''} ÂL`;

      for (const h of info.holidays) {
        items.push({
          solar: info.solar,
          lunarLabel,
          title: h.name,
          kind: 'holiday',
        });
      }

      if (info.astrology.isSolarTermStart) {
        items.push({
          solar: info.solar,
          lunarLabel,
          title: `Tiết ${info.astrology.solarTerm}`,
          kind: 'solar-term',
        });
      }

      for (const ev of getEventsForDay(info.solar, info.lunar)) {
        items.push({
          solar: info.solar,
          lunarLabel,
          title: ev.title,
          kind: 'event',
        });
      }
    }

    return items;
  }, [viewMonth, viewYear, getEventsForDay]);

  return (
    <section className="silk-card rounded-3xl border border-amber-200/90 p-4 shadow-md shadow-amber-900/5 sm:p-5 dark:border-amber-900/40 dark:shadow-black/30">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
            Điểm nhấn tháng {viewMonth}/{viewYear}
          </h2>
        </div>
        <span className="text-xs text-stone-500 dark:text-stone-400">
          Nhấn để xem chi tiết
        </span>
      </div>

      {highlights.length === 0 ? (
        <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
          Tháng này chưa có ngày lễ hay sự kiện cá nhân nào được đánh dấu.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {highlights.map((item, idx) => (
            <button
              key={`${item.solar.day}-${item.title}-${idx}`}
              type="button"
              onClick={() => onSelectDate(item.solar)}
              className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200/70 bg-white/80 px-3 py-2.5 text-left transition hover:border-red-300 hover:bg-red-50/50 dark:border-stone-800 dark:bg-stone-900/70 dark:hover:border-amber-700 dark:hover:bg-stone-800"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  {item.kind === 'event' && (
                    <CalendarHeart className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                  )}
                  <span className="truncate text-xs font-bold text-stone-900 dark:text-stone-100">
                    {item.title}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
                  {item.lunarLabel}
                </div>
              </div>

              <span
                className={`tabular-nums shrink-0 rounded-xl px-2.5 py-1 text-xs font-bold ${
                  item.kind === 'holiday'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300'
                    : item.kind === 'event'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                }`}
              >
                {String(item.solar.day).padStart(2, '0')}/
                {String(item.solar.month).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

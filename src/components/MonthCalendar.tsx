import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import {
  getDaysInSolarMonth,
  getFullDayInfo,
  jdFromDate,
  WEEKDAYS_SHORT,
  type FullDayInfo,
  type LunarDate,
  type PersonalEvent,
  type SolarDate,
} from '../core/lunar';

interface MonthCalendarProps {
  viewMonth: number;
  viewYear: number;
  selectedSolar: SolarDate;
  todaySolar: SolarDate;
  onSelectDate: (solar: SolarDate) => void;
  onChangeMonth: (month: number, year: number) => void;
  getEventsForDay: (solar: SolarDate, lunar: LunarDate) => PersonalEvent[];
}

interface CalendarCell {
  solar: SolarDate;
  isCurrentMonth: boolean;
  info: FullDayInfo;
  events: PersonalEvent[];
}

const MONDAY_FIRST_HEADERS = [
  WEEKDAYS_SHORT[1],
  WEEKDAYS_SHORT[2],
  WEEKDAYS_SHORT[3],
  WEEKDAYS_SHORT[4],
  WEEKDAYS_SHORT[5],
  WEEKDAYS_SHORT[6],
  WEEKDAYS_SHORT[0],
];

export function MonthCalendar({
  viewMonth,
  viewYear,
  selectedSolar,
  todaySolar,
  onSelectDate,
  onChangeMonth,
  getEventsForDay,
}: MonthCalendarProps) {
  const cells = useMemo<CalendarCell[]>(() => {
    const firstDayJd = jdFromDate(1, viewMonth, viewYear);
    const firstWeekday = (firstDayJd + 1) % 7;
    const leadingEmpty = (firstWeekday + 6) % 7;

    const daysInMonth = getDaysInSolarMonth(viewMonth, viewYear);
    const prevMonth = viewMonth === 1 ? 12 : viewMonth - 1;
    const prevYear = viewMonth === 1 ? viewYear - 1 : viewYear;
    const daysInPrevMonth = getDaysInSolarMonth(prevMonth, prevYear);

    const nextMonth = viewMonth === 12 ? 1 : viewMonth + 1;
    const nextYear = viewMonth === 12 ? viewYear + 1 : viewYear;

    const list: CalendarCell[] = [];

    for (let i = leadingEmpty - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const info = getFullDayInfo(day, prevMonth, prevYear);
      list.push({
        solar: info.solar,
        isCurrentMonth: false,
        info,
        events: getEventsForDay(info.solar, info.lunar),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const info = getFullDayInfo(day, viewMonth, viewYear);
      list.push({
        solar: info.solar,
        isCurrentMonth: true,
        info,
        events: getEventsForDay(info.solar, info.lunar),
      });
    }

    const remaining = 42 - list.length;
    for (let day = 1; day <= remaining; day++) {
      const info = getFullDayInfo(day, nextMonth, nextYear);
      list.push({
        solar: info.solar,
        isCurrentMonth: false,
        info,
        events: getEventsForDay(info.solar, info.lunar),
      });
    }

    return list;
  }, [viewMonth, viewYear, getEventsForDay]);

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      onChangeMonth(12, viewYear - 1);
    } else {
      onChangeMonth(viewMonth - 1, viewYear);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      onChangeMonth(1, viewYear + 1);
    } else {
      onChangeMonth(viewMonth + 1, viewYear);
    }
  };

  const isSameSolar = (a: SolarDate, b: SolarDate) =>
    a.day === b.day && a.month === b.month && a.year === b.year;

  return (
    <section className="silk-card rounded-3xl border border-amber-200/90 p-4 shadow-lg shadow-amber-900/5 sm:p-6 dark:border-amber-900/40 dark:shadow-black/30">
      {/* Thanh điều hướng Tháng / Năm */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            aria-label="Chọn tháng"
            value={viewMonth}
            onChange={(e) => onChangeMonth(Number(e.target.value), viewYear)}
            className="rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-base font-bold text-stone-900 shadow-2xs outline-none transition focus:border-red-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          >
            {Array.from({ length: 12 }, (_, idx) => idx + 1).map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>

          <select
            aria-label="Chọn năm"
            value={viewYear}
            onChange={(e) => onChangeMonth(viewMonth, Number(e.target.value))}
            className="rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-base font-bold text-stone-900 shadow-2xs outline-none transition focus:border-red-500 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          >
            {Array.from({ length: 201 }, (_, idx) => 1900 + idx).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Tháng trước"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-white text-stone-700 shadow-2xs transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Tháng sau"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-white text-stone-700 shadow-2xs transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tiêu đề các thứ trong tuần */}
      <div className="mb-2 grid grid-cols-7 gap-1.5 text-center">
        {MONDAY_FIRST_HEADERS.map((label, idx) => (
          <div
            key={label}
            className={`rounded-lg py-1.5 text-xs font-bold uppercase tracking-wider ${
              idx === 6
                ? 'bg-red-50/80 text-red-700 dark:bg-red-950/35 dark:text-red-400'
                : idx === 5
                  ? 'bg-amber-50/80 text-amber-800 dark:bg-amber-950/35 dark:text-amber-400'
                  : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Lưới 42 ngày */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((cell) => {
          const isSelected = isSameSolar(cell.solar, selectedSolar);
          const isToday = isSameSolar(cell.solar, todaySolar);
          const isSunday = cell.info.weekdayIndex === 0;
          const isSaturday = cell.info.weekdayIndex === 6;
          const hasHoliday = cell.info.holidays.length > 0;
          const hasMajorHoliday = cell.info.holidays.some((h) => h.isMajor);
          const isFirstOrFullMoon =
            cell.info.lunar.day === 1 || cell.info.lunar.day === 15;
          const isHoangDao = cell.info.astrology.dayQuality === 'hoang-dao';

          const lunarText =
            cell.info.lunar.day === 1
              ? `${cell.info.lunar.day}/${cell.info.lunar.month}${cell.info.lunar.isLeapMonth ? '*' : ''}`
              : `${cell.info.lunar.day}`;

          const badgeLabel = cell.info.holidays[0]?.name
            ? 'Lễ'
            : cell.info.lunar.day === 1
              ? 'M1'
              : cell.info.lunar.day === 15
                ? 'Rằm'
                : null;

          return (
            <button
              key={`${cell.solar.year}-${cell.solar.month}-${cell.solar.day}`}
              type="button"
              onClick={() => onSelectDate(cell.solar)}
              className={`group relative flex min-h-[68px] flex-col items-center justify-between rounded-2xl border p-1.5 transition duration-150 sm:min-h-[78px] sm:p-2 ${
                isSelected
                  ? 'border-red-600 bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md shadow-red-700/25 ring-2 ring-red-500/30'
                  : isToday
                    ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-xs ring-2 ring-amber-400/25 dark:border-amber-500 dark:from-amber-950/60 dark:to-red-950/40'
                    : cell.isCurrentMonth
                      ? 'border-amber-200/60 bg-white/85 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900/75 dark:hover:border-amber-700/60 dark:hover:bg-stone-800/90'
                      : 'border-transparent bg-transparent opacity-35 hover:opacity-70'
              }`}
            >
              {/* Dòng trên: Hoàng Đạo + Nhãn Lễ/Rằm/Sự kiện */}
              <div className="flex w-full items-center justify-between gap-0.5">
                <span
                  title={isHoangDao ? 'Ngày Hoàng Đạo' : 'Ngày Hắc Đạo'}
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSelected
                      ? isHoangDao
                        ? 'bg-emerald-300'
                        : 'bg-white/40'
                      : isHoangDao
                        ? 'bg-emerald-500'
                        : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                />
                <div className="flex items-center gap-0.5">
                  {badgeLabel && cell.isCurrentMonth && (
                    <span
                      className={`rounded px-1 text-[9px] font-bold leading-tight ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : hasHoliday
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                      }`}
                    >
                      {badgeLabel}
                    </span>
                  )}
                  {cell.events.length > 0 && (
                    <span
                      title={cell.events.map((e) => e.title).join(', ')}
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? 'bg-amber-300' : 'bg-amber-500'
                      }`}
                    />
                  )}
                </div>
              </div>

              {/* Số ngày Dương lịch */}
              <span
                className={`tabular-nums text-lg font-extrabold leading-none sm:text-xl ${
                  isSelected
                    ? 'text-white'
                    : hasMajorHoliday || isSunday
                      ? 'text-red-600 dark:text-red-400'
                      : isSaturday
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-stone-900 dark:text-stone-100'
                }`}
              >
                {cell.solar.day}
              </span>

              {/* Số ngày Âm lịch */}
              <span
                className={`tabular-nums text-[11px] leading-none sm:text-xs ${
                  isSelected
                    ? 'font-semibold text-amber-100'
                    : isFirstOrFullMoon
                      ? 'font-bold text-red-700 dark:text-amber-300'
                      : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {lunarText}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chú thích trực quan */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-amber-200/60 pt-3 text-xs text-stone-600 dark:border-stone-800 dark:text-stone-400">
        <div className="flex flex-wrap items-center gap-3.5">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Hoàng Đạo
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-900/60 dark:text-red-300">
              Lễ
            </span>
            Ngày lễ VN
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
              M1 / Rằm
            </span>
            Sóc & Vọng
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Sự kiện riêng
          </span>
        </div>
        <span>* Tháng nhuận</span>
      </div>
    </section>
  );
}

import { Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  convertLunar2Solar,
  jdFromDate,
  LUNAR_HOLIDAYS,
  SOLAR_HOLIDAYS,
  type SolarDate,
} from '../core/lunar';

interface HolidayListModalProps {
  year: number;
  onClose: () => void;
  onSelectDate: (solar: SolarDate) => void;
}

interface YearHolidayItem {
  name: string;
  type: 'lunar' | 'solar';
  isMajor: boolean;
  solar: SolarDate;
  lunarLabel?: string;
  jd: number;
}

export function HolidayListModal({
  year,
  onClose,
  onSelectDate,
}: HolidayListModalProps) {
  const [filter, setFilter] = useState<'all' | 'lunar' | 'solar'>('all');

  const items = useMemo<YearHolidayItem[]>(() => {
    const list: YearHolidayItem[] = [];

    for (const h of SOLAR_HOLIDAYS) {
      const solar = { day: h.day, month: h.month, year };
      list.push({
        name: h.name,
        type: 'solar',
        isMajor: h.isMajor,
        solar,
        jd: jdFromDate(solar.day, solar.month, solar.year),
      });
    }

    // Kiểm tra các ngày lễ Âm lịch rơi vào năm Dương lịch hiện tại
    for (const lunarY of [year - 1, year]) {
      for (const h of LUNAR_HOLIDAYS) {
        const solar = convertLunar2Solar(h.day, h.month, lunarY, false);
        if (solar && solar.year === year) {
          list.push({
            name: h.name,
            type: 'lunar',
            isMajor: h.isMajor,
            solar,
            lunarLabel: `${h.day}/${h.month} Âm lịch`,
            jd: jdFromDate(solar.day, solar.month, solar.year),
          });
        }
      }
    }

    return list.sort((a, b) => a.jd - b.jd);
  }, [year]);

  const filtered = items.filter((item) =>
    filter === 'all' ? true : item.type === filter,
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Ngày lễ Việt Nam năm ${year}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-xl dark:border-stone-800 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Ngày lễ Việt Nam {year}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex gap-1.5">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'lunar', label: 'Lễ Âm lịch' },
            { id: 'solar', label: 'Lễ Dương lịch' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as 'all' | 'lunar' | 'solar')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filter === tab.id
                  ? 'bg-red-700 text-white dark:bg-red-600'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ul className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
          {filtered.map((item) => (
            <li key={`${item.type}-${item.name}-${item.jd}`}>
              <button
                type="button"
                onClick={() => {
                  onSelectDate(item.solar);
                  onClose();
                }}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-stone-200/80 bg-stone-50/70 p-3 text-left transition hover:border-red-300 hover:bg-red-50/50 dark:border-stone-800 dark:bg-stone-800/50 dark:hover:border-red-800 dark:hover:bg-red-950/30"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {item.name}
                    </span>
                    {item.isMajor && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-900/50 dark:text-red-300">
                        Lễ lớn
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    {item.lunarLabel ?? 'Theo Dương lịch'}
                  </div>
                </div>
                <div className="tabular-nums shrink-0 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-stone-700 shadow-2xs dark:bg-stone-900 dark:text-stone-200">
                  {String(item.solar.day).padStart(2, '0')}/
                  {String(item.solar.month).padStart(2, '0')}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

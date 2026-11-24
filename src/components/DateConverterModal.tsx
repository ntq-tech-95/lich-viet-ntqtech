import { ArrowLeftRight, Calendar, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  convertLunar2Solar,
  convertSolar2Lunar,
  formatLunarMonthName,
  getDayCanChi,
  getDaysInLunarMonth,
  getDaysInSolarMonth,
  getLeapMonthOfLunarYear,
  getYearCanChi,
  jdFromDate,
  WEEKDAYS,
  type SolarDate,
} from '../core/lunar';

interface DateConverterModalProps {
  initialSolar: SolarDate;
  onClose: () => void;
  onSelectDate: (solar: SolarDate) => void;
}

export function DateConverterModal({
  initialSolar,
  onClose,
  onSelectDate,
}: DateConverterModalProps) {
  const initialLunar = convertSolar2Lunar(
    initialSolar.day,
    initialSolar.month,
    initialSolar.year,
  );

  const [mode, setMode] = useState<'solar-to-lunar' | 'lunar-to-solar'>('solar-to-lunar');

  // State Dương -> Âm
  const [sDay, setSDay] = useState(initialSolar.day);
  const [sMonth, setSMonth] = useState(initialSolar.month);
  const [sYear, setSYear] = useState(initialSolar.year);

  // State Âm -> Dương
  const [lDay, setLDay] = useState(initialLunar.day);
  const [lMonth, setLMonth] = useState(initialLunar.month);
  const [lYear, setLYear] = useState(initialLunar.year);
  const [lLeap, setLLeap] = useState(initialLunar.isLeapMonth);

  const maxSolarDays = getDaysInSolarMonth(sMonth, sYear);
  const safeSDay = Math.min(sDay, maxSolarDays);

  const solarConverted = useMemo(() => {
    const lunar = convertSolar2Lunar(safeSDay, sMonth, sYear);
    const weekday = WEEKDAYS[(lunar.jd + 1) % 7];
    return {
      lunar,
      weekday,
      yearCanChi: getYearCanChi(lunar.year).label,
      dayCanChi: getDayCanChi(lunar.jd).label,
    };
  }, [safeSDay, sMonth, sYear]);

  const leapMonthOfLYear = useMemo(() => getLeapMonthOfLunarYear(lYear), [lYear]);
  const effectiveLeap = lLeap && leapMonthOfLYear === lMonth;
  const maxLunarDays = useMemo(
    () => getDaysInLunarMonth(lMonth, lYear, effectiveLeap) || 29,
    [lMonth, lYear, effectiveLeap],
  );
  const safeLDay = Math.min(lDay, maxLunarDays);

  const lunarConverted = useMemo(() => {
    const solar = convertLunar2Solar(safeLDay, lMonth, lYear, effectiveLeap);
    if (!solar) return null;
    const jd = jdFromDate(solar.day, solar.month, solar.year);
    return {
      solar,
      weekday: WEEKDAYS[(jd + 1) % 7],
      yearCanChi: getYearCanChi(lYear).label,
      dayCanChi: getDayCanChi(jd).label,
    };
  }, [safeLDay, lMonth, lYear, effectiveLeap]);

  const handleApply = () => {
    if (mode === 'solar-to-lunar') {
      onSelectDate({ day: safeSDay, month: sMonth, year: sYear });
      onClose();
    } else if (lunarConverted) {
      onSelectDate(lunarConverted.solar);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Đổi ngày Âm Dương"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-xl dark:border-stone-800 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Đổi ngày Âm ⇄ Dương
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

        {/* Tab chuyển đổi */}
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-stone-100 p-1 dark:bg-stone-800">
          <button
            type="button"
            onClick={() => setMode('solar-to-lunar')}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              mode === 'solar-to-lunar'
                ? 'bg-white text-red-700 shadow-xs dark:bg-stone-900 dark:text-red-400'
                : 'text-stone-600 dark:text-stone-300'
            }`}
          >
            Dương → Âm
          </button>
          <button
            type="button"
            onClick={() => setMode('lunar-to-solar')}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              mode === 'lunar-to-solar'
                ? 'bg-white text-red-700 shadow-xs dark:bg-stone-900 dark:text-red-400'
                : 'text-stone-600 dark:text-stone-300'
            }`}
          >
            Âm → Dương
          </button>
        </div>

        {mode === 'solar-to-lunar' ? (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Ngày
                <select
                  value={safeSDay}
                  onChange={(e) => setSDay(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                >
                  {Array.from({ length: maxSolarDays }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Tháng
                <select
                  value={sMonth}
                  onChange={(e) => setSMonth(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      Tháng {m}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Năm
                <select
                  value={sYear}
                  onChange={(e) => setSYear(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                >
                  {Array.from({ length: 201 }, (_, i) => 1900 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 dark:border-red-900/50 dark:bg-red-950/30">
              <div className="text-xs font-medium uppercase tracking-wider text-red-700 dark:text-red-400">
                Kết quả Âm lịch
              </div>
              <div className="mt-1 text-2xl font-bold text-stone-900 dark:text-stone-100">
                Ngày {solarConverted.lunar.day}{' '}
                {formatLunarMonthName(
                  solarConverted.lunar.month,
                  solarConverted.lunar.isLeapMonth,
                )}
              </div>
              <div className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                {solarConverted.weekday} · Năm {solarConverted.yearCanChi} (
                {solarConverted.lunar.year}) · Ngày {solarConverted.dayCanChi}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Ngày Âm
                <select
                  value={safeLDay}
                  onChange={(e) => setLDay(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                >
                  {Array.from({ length: maxLunarDays }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Tháng Âm
                <select
                  value={lMonth}
                  onChange={(e) => {
                    const nextM = Number(e.target.value);
                    setLMonth(nextM);
                    if (leapMonthOfLYear !== nextM) setLLeap(false);
                  }}
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      Tháng {m}
                      {leapMonthOfLYear === m ? ' (có nhuận)' : ''}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Năm Âm
                <select
                  value={lYear}
                  onChange={(e) => {
                    const nextY = Number(e.target.value);
                    setLYear(nextY);
                    setLLeap(false);
                  }}
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
                >
                  {Array.from({ length: 201 }, (_, i) => 1900 + i).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {leapMonthOfLYear === lMonth && (
              <label className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-200">
                <input
                  type="checkbox"
                  checked={effectiveLeap}
                  onChange={(e) => setLLeap(e.target.checked)}
                  className="h-4 w-4 rounded accent-red-600"
                />
                Đây là tháng {lMonth} nhuận của năm {lYear}
              </label>
            )}

            {lunarConverted && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <div className="text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Kết quả Dương lịch
                </div>
                <div className="mt-1 text-2xl font-bold text-stone-900 dark:text-stone-100">
                  {String(lunarConverted.solar.day).padStart(2, '0')}/
                  {String(lunarConverted.solar.month).padStart(2, '0')}/
                  {lunarConverted.solar.year}
                </div>
                <div className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                  {lunarConverted.weekday} · Năm {lunarConverted.yearCanChi} · Ngày{' '}
                  {lunarConverted.dayCanChi}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700"
          >
            <Calendar className="h-4 w-4" />
            Xem ngày này trên lịch
          </button>
        </div>
      </div>
    </div>
  );
}

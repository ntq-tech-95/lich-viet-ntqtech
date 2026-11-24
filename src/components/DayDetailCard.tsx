import {
  AlertTriangle,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  Flame,
  Info,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { useRef, useState } from 'react';
import {
  formatLunarMonthName,
  type FullDayInfo,
  type PersonalEvent,
} from '../core/lunar';
import {
  CornerFlourish,
  getMoonPhaseLabel,
  MoonPhaseVisual,
  TrongDongPattern,
  ZODIAC_CHIBI_SYMBOLS,
} from './VietnameseArt';

interface DayDetailCardProps {
  dayInfo: FullDayInfo;
  isToday: boolean;
  events: PersonalEvent[];
  totalEventsCount: number;
  onAddEventForDay: () => void;
  onRemoveEvent: (id: string) => void;
  onExportEvents: () => string;
  onImportEvents: (rawText: string) => { added: number; total: number };
}

const NGU_HANH_BADGE: Record<string, string> = {
  Kim: 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200',
  Mộc: 'border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200',
  Thủy: 'border-sky-300 bg-sky-100 text-sky-900 dark:border-sky-800 dark:bg-sky-950/70 dark:text-sky-200',
  Hỏa: 'border-rose-300 bg-rose-100 text-rose-900 dark:border-rose-800 dark:bg-rose-950/70 dark:text-rose-200',
  Thổ: 'border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-800 dark:bg-amber-950/70 dark:text-amber-200',
};

const CATEGORY_LABELS: Record<PersonalEvent['category'], string> = {
  'gio-chap': 'Giỗ chạp',
  'sinh-nhat': 'Sinh nhật',
  'le-tet': 'Lễ Tết',
  'ca-nhan': 'Cá nhân',
};

export function DayDetailCard({
  dayInfo,
  isToday,
  events,
  totalEventsCount,
  onAddEventForDay,
  onRemoveEvent,
  onExportEvents,
  onImportEvents,
}: DayDetailCardProps) {
  const { solar, lunar, weekdayName, astrology, holidays } = dayInfo;
  const isHoangDao = astrology.dayQuality === 'hoang-dao';
  const isSunday = dayInfo.weekdayIndex === 0;
  const isRamOrMung1 = lunar.day === 1 || lunar.day === 15;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupNotice, setBackupNotice] = useState<string | null>(null);

  const handleExport = () => {
    const json = onExportEvents();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lich-viet-su-kien-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupNotice(`Đã xuất ${totalEventsCount} sự kiện ra tệp sao lưu.`);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const res = onImportEvents(text);
      setBackupNotice(`Đã nhập thêm ${res.added} sự kiện (tổng ${res.total} sự kiện).`);
    } catch (err) {
      setBackupNotice(
        err instanceof Error ? err.message : 'Không thể đọc tệp sao lưu JSON.',
      );
    }
  };

  const currentHour = new Date().getHours();
  const currentChiIdx = Math.floor(((currentHour + 1) % 24) / 2);

  const yearZodiacSymbol = ZODIAC_CHIBI_SYMBOLS[astrology.yearCanChi.chiIndex];
  const dayZodiacSymbol = ZODIAC_CHIBI_SYMBOLS[astrology.dayCanChi.chiIndex];

  return (
    <aside className="space-y-4">
      {/* Thẻ Tờ Lịch Bloc Nghệ Thuật */}
      <div className="silk-card overflow-hidden rounded-3xl border border-amber-200/90 shadow-lg shadow-amber-900/5 dark:border-amber-900/40 dark:shadow-black/30">
        {/* Phần đầu Bloc: Sơn mài Đỏ Vàng với Trống Đồng & Hoa văn góc */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#8f1212] via-[#b91c1c] to-[#b45309] px-5 pt-4 pb-6 text-white">
          {/* Họa tiết Trống Đồng chìm */}
          <TrongDongPattern className="pointer-events-none absolute -top-12 -right-12 h-60 w-60 text-amber-200/15" />

          {/* Hoa văn 4 góc */}
          <CornerFlourish className="pointer-events-none absolute top-2.5 left-2.5 h-6 w-6 text-amber-300/65" />
          <CornerFlourish className="pointer-events-none absolute top-2.5 right-2.5 h-6 w-6 rotate-90 text-amber-300/65" />

          {/* Khuyên treo lịch bloc trang trí */}
          <div className="mb-3 flex items-center justify-center gap-16">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-amber-200/80 bg-black/30" />
            <span className="h-2.5 w-2.5 rounded-full border-2 border-amber-200/80 bg-black/30" />
          </div>

          {/* Tháng Năm Dương & Nhãn Hôm nay */}
          <div className="relative flex items-center justify-between text-sm font-semibold text-amber-100">
            <span className="tracking-wide uppercase">
              Tháng {solar.month} · {solar.year}
            </span>
            <div className="flex items-center gap-1.5">
              {isRamOrMung1 && (
                <span className="rounded-full border border-amber-200/50 bg-amber-400/20 px-2.5 py-0.5 text-xs font-bold text-amber-100">
                  {lunar.day === 1 ? 'Mùng 1' : 'Ngày Rằm'}
                </span>
              )}
              {isToday && (
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-red-800 shadow-xs">
                  Hôm nay
                </span>
              )}
            </div>
          </div>

          {/* Số ngày Dương lớn + Ô Âm lịch kèm Pha Trăng */}
          <div className="relative mt-3 flex items-center justify-between gap-4">
            <div>
              <div
                className={`font-display tabular-nums text-7xl font-black leading-none tracking-tight drop-shadow-sm sm:text-[84px] ${
                  isSunday ? 'text-amber-200' : 'text-white'
                }`}
              >
                {solar.day}
              </div>
              <div className="mt-2 flex items-center gap-2 text-lg font-bold text-amber-100">
                <span>{weekdayName}</span>
              </div>
            </div>

            {/* Khung Âm Lịch kèm Pha Trăng */}
            <div className="flex flex-col items-end rounded-2xl border border-amber-200/35 bg-black/25 px-4 py-3 text-right backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <MoonPhaseVisual lunarDay={lunar.day} size={42} />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-amber-200">
                    Âm lịch
                  </div>
                  <div className="font-display tabular-nums text-4xl font-extrabold leading-none text-white">
                    {lunar.day}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs font-semibold text-amber-100">
                {formatLunarMonthName(lunar.month, lunar.isLeapMonth)}
              </div>
              <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-amber-200/90">
                <span>{yearZodiacSymbol}</span>
                <span>Năm {astrology.yearCanChi.label}</span>
              </div>
              <div className="mt-0.5 text-[10px] text-amber-100/75">
                {getMoonPhaseLabel(lunar.day)}
              </div>
            </div>
          </div>
        </div>

        {/* Thân thẻ: Thông tin chi tiết văn hóa & phong thủy */}
        <div className="space-y-4 p-5">
          {/* Huy hiệu Hoàng Đạo & Nạp Âm */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold shadow-2xs ${
                isHoangDao
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
                  : 'border-stone-300 bg-stone-100 text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isHoangDao ? 'Ngày Hoàng Đạo' : 'Ngày Hắc Đạo'} · Sao {astrology.dayStarName}
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                NGU_HANH_BADGE[astrology.nguHanh]
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              {astrology.napAm} ({astrology.nguHanh})
            </span>
          </div>

          {/* 3 ô Can Chi & Tiết Khí */}
          <div className="grid grid-cols-3 gap-2.5 text-sm">
            <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-3 dark:border-stone-800 dark:bg-stone-900/80">
              <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                Ngày
              </div>
              <div className="mt-0.5 flex items-center gap-1 font-bold text-stone-900 dark:text-stone-100">
                <span>{dayZodiacSymbol}</span>
                <span>{astrology.dayCanChi.label}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-3 dark:border-stone-800 dark:bg-stone-900/80">
              <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                Tháng
              </div>
              <div className="mt-0.5 font-bold text-stone-900 dark:text-stone-100">
                {astrology.monthCanChi.label}
              </div>
            </div>
            <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-3 dark:border-stone-800 dark:bg-stone-900/80">
              <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                Tiết khí
              </div>
              <div className="mt-0.5 font-bold text-stone-900 dark:text-stone-100">
                {astrology.solarTerm}
                {astrology.isSolarTermStart && (
                  <span className="ml-1 inline-block rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    Giao tiết
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Ngày lễ Việt Nam (nếu có) */}
          {holidays.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-amber-50/80 p-3.5 dark:border-red-900/50 dark:from-red-950/40 dark:to-amber-950/30">
              <div className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                🎉 Ngày lễ & Kỷ niệm
              </div>
              <ul className="mt-1.5 space-y-1">
                {holidays.map((h) => (
                  <li
                    key={h.name}
                    className="flex items-start justify-between gap-2 text-sm font-semibold text-stone-900 dark:text-stone-100"
                  >
                    <span>{h.name}</span>
                    <span className="shrink-0 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-medium text-red-700 shadow-2xs dark:bg-stone-900 dark:text-amber-300">
                      {h.type === 'lunar' ? 'Âm lịch' : 'Dương lịch'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sự kiện cá nhân / Giỗ chạp */}
          <div className="rounded-2xl border border-amber-200/70 bg-white/75 p-3.5 dark:border-stone-800 dark:bg-stone-900/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Sự kiện & Giỗ chạp ({events.length})
              </span>
              <button
                type="button"
                onClick={onAddEventForDay}
                className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 transition hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900/60"
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                Thêm sự kiện
              </button>
            </div>

            {events.length === 0 ? (
              <p className="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                Chưa có sự kiện nào trong ngày này. Nhấn <strong>Thêm sự kiện</strong> để lưu ngày giỗ theo Âm lịch (tự động nhắc lại mỗi năm).
              </p>
            ) : (
              <ul className="mt-2.5 space-y-2">
                {events.map((ev) => (
                  <li
                    key={ev.id}
                    className="flex items-start justify-between gap-2 rounded-xl border border-amber-100 bg-amber-50/40 p-2.5 dark:border-stone-800 dark:bg-stone-950/60"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {ev.title}
                        </span>
                        <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                          {CATEGORY_LABELS[ev.category]}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                        {ev.calendarType === 'lunar' ? 'Theo Âm lịch' : 'Theo Dương lịch'}
                        {ev.repeatYearly ? ' · Lặp hàng năm' : ''}
                        {ev.note ? ` · ${ev.note}` : ''}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveEvent(ev.id)}
                      aria-label={`Xóa sự kiện ${ev.title}`}
                      className="rounded-lg p-1 text-stone-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Thanh sao lưu / khôi phục sự kiện */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-amber-200/60 pt-2.5 text-[11px] dark:border-stone-800">
              <span className="text-stone-500 dark:text-stone-400">
                Tổng đã lưu: <strong>{totalEventsCount}</strong> sự kiện
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={totalEventsCount === 0}
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-white px-2 py-1 font-semibold text-stone-700 transition hover:bg-amber-50 disabled:opacity-40 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  <Download className="h-3 w-3" />
                  Xuất sao lưu
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-white px-2 py-1 font-semibold text-stone-700 transition hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
                >
                  <Upload className="h-3 w-3" />
                  Nhập file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </div>
            </div>
            {backupNotice && (
              <p className="mt-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                {backupNotice}
              </p>
            )}
          </div>

          {/* Giờ Hoàng Đạo */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                6 Khung Giờ Hoàng Đạo
              </div>
              {isToday && (
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                  Khung giờ hiện tại được tô sáng
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {astrology.auspiciousHours
                .filter((h) => h.isAuspicious)
                .map((h) => {
                  const isNow = isToday && h.chiIndex === currentChiIdx;
                  return (
                    <div
                      key={h.chi}
                      className={`rounded-xl border px-3 py-2 text-xs transition ${
                        isNow
                          ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 font-semibold text-emerald-950 shadow-sm ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:from-emerald-950/80 dark:to-teal-950/60 dark:text-emerald-100'
                          : 'border-amber-200/70 bg-white/80 text-stone-700 dark:border-stone-800 dark:bg-stone-900/70 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>Giờ {h.chi}</span>
                        {isNow && (
                          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <div className="tabular-nums mt-0.5 text-[11px] opacity-80">
                        {h.timeRange}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Hướng Xuất Hành & Trực */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div className="rounded-2xl border border-amber-200/70 bg-white/75 p-3.5 dark:border-stone-800 dark:bg-stone-900/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
                <Compass className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                Hướng xuất hành
              </div>
              <div className="mt-2 space-y-1 text-xs text-stone-700 dark:text-stone-300">
                <div>
                  <span className="font-semibold text-red-700 dark:text-amber-300">Hỷ thần:</span>{' '}
                  {astrology.hyThan}
                </div>
                <div>
                  <span className="font-semibold text-amber-700 dark:text-amber-300">Tài thần:</span>{' '}
                  {astrology.taiThan}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200/70 bg-white/75 p-3.5 dark:border-stone-800 dark:bg-stone-900/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
                <Info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Trực {astrology.truc.name}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                {astrology.truc.meaning}.
              </p>
            </div>
          </div>

          {/* Việc nên làm / Lưu ý */}
          <div className="space-y-2 border-t border-amber-200/60 pt-3 text-xs dark:border-stone-800">
            <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong>Nên làm:</strong> {astrology.goodFor.join(' · ')}
              </span>
            </div>
            {astrology.warnings.map((w) => (
              <div
                key={w}
                className="flex items-start gap-2 text-amber-800 dark:text-amber-300"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

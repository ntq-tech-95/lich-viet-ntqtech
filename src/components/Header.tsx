import {
  ArrowLeftRight,
  Bell,
  Moon,
  Plus,
  Sparkles,
  Sun,
} from 'lucide-react';
import { getYearCanChi, type SolarDate } from '../core/lunar';
import { LanternIcon } from './VietnameseArt';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onGoToday: () => void;
  onOpenConverter: () => void;
  onOpenHolidays: () => void;
  onOpenNotifications: () => void;
  onOpenAddEvent: () => void;
  notificationsEnabled: boolean;
  tetCountdown: {
    daysRemaining: number;
    tetSolar: SolarDate;
    lunarYear: number;
  };
}

export function Header({
  theme,
  onToggleTheme,
  onGoToday,
  onOpenConverter,
  onOpenHolidays,
  onOpenNotifications,
  onOpenAddEvent,
  notificationsEnabled,
  tetCountdown,
}: HeaderProps) {
  const tetCanChi = getYearCanChi(tetCountdown.lunarYear).label;

  return (
    <header className="sticky top-0 z-30 border-b border-amber-200/70 bg-[#fffaf2]/90 shadow-2xs backdrop-blur-md dark:border-amber-900/30 dark:bg-[#16100d]/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Thương hiệu + Đếm ngược Tết */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 via-red-600 to-amber-600 text-amber-100 shadow-md shadow-red-700/20">
            <LanternIcon className="h-6 w-6 text-red-100" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-xl font-extrabold tracking-tight text-red-900 dark:text-amber-100">
                Lịch Việt
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-100 to-orange-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900 shadow-2xs dark:border-amber-700/50 dark:from-amber-950/80 dark:to-red-950/70 dark:text-amber-200">
                🏮
                {tetCountdown.daysRemaining === 0
                  ? `Chúc Mừng Năm Mới ${tetCanChi}!`
                  : `Còn ${tetCountdown.daysRemaining} ngày đến Tết ${tetCanChi}`}
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Lịch Vạn Niên Việt Nam · Chuẩn múi giờ UTC+7 · <span className="font-medium text-red-700 dark:text-amber-300">NTQ TECH</span>
            </p>
          </div>
        </div>

        {/* Thanh công cụ */}
        <nav className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onGoToday}
            className="rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-sm font-semibold text-stone-700 shadow-2xs transition hover:border-red-300 hover:bg-red-50/60 hover:text-red-800 active:scale-[0.98] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-amber-700 dark:hover:bg-stone-800"
          >
            Hôm nay
          </button>

          <button
            type="button"
            onClick={onOpenConverter}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-sm font-semibold text-stone-700 shadow-2xs transition hover:border-red-300 hover:bg-red-50/60 hover:text-red-800 active:scale-[0.98] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-amber-700 dark:hover:bg-stone-800"
          >
            <ArrowLeftRight className="h-4 w-4 text-red-600 dark:text-amber-400" />
            <span>Đổi ngày</span>
          </button>

          <button
            type="button"
            onClick={onOpenHolidays}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-sm font-semibold text-stone-700 shadow-2xs transition hover:border-amber-400 hover:bg-amber-50 active:scale-[0.98] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-amber-700 dark:hover:bg-stone-800"
          >
            <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Ngày lễ</span>
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="Nhắc lịch tự động"
            title="Nhắc lịch Mùng 1, Ngày Rằm & Giỗ chạp"
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-sm font-semibold text-stone-700 shadow-2xs transition hover:border-red-300 hover:bg-red-50/60 active:scale-[0.98] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-amber-700 dark:hover:bg-stone-800"
          >
            <Bell
              className={`h-4 w-4 ${
                notificationsEnabled
                  ? 'text-red-600 dark:text-amber-400'
                  : 'text-stone-400'
              }`}
            />
            <span className="hidden md:inline">Nhắc lịch</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddEvent}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm shadow-red-700/25 transition hover:from-red-800 hover:to-red-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Thêm sự kiện</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-white text-amber-700 shadow-2xs transition hover:bg-amber-50 dark:border-stone-700 dark:bg-stone-900 dark:text-amber-300 dark:hover:bg-stone-800"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}

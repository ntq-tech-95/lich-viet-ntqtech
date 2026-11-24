import { useEffect, useMemo, useState } from 'react';
import { DateConverterModal } from './components/DateConverterModal';
import { DayDetailCard } from './components/DayDetailCard';
import { EventModal } from './components/EventModal';
import { Header } from './components/Header';
import { HolidayListModal } from './components/HolidayListModal';
import { MonthCalendar } from './components/MonthCalendar';
import { MonthHighlightsCard } from './components/MonthHighlightsCard';
import { NotificationModal } from './components/NotificationModal';
import {
  getFullDayInfo,
  getNextTetCountdown,
  getTodaySolar,
  type SolarDate,
} from './core/lunar';
import { useEvents } from './hooks/useEvents';
import { useTheme } from './hooks/useTheme';
import {
  getTodaysDueReminders,
  loadNotificationSettings,
  saveNotificationSettings,
  syncLocalNotifications,
  type NotificationSettings,
} from './services/notifications';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    events,
    addEvent,
    removeEvent,
    exportEventsJson,
    importEventsJson,
    getEventsForDay,
  } = useEvents();

  const todaySolar = useMemo(() => getTodaySolar(), []);
  const [selectedSolar, setSelectedSolar] = useState<SolarDate>(todaySolar);
  const [viewMonth, setViewMonth] = useState<number>(todaySolar.month);
  const [viewYear, setViewYear] = useState<number>(todaySolar.year);

  const [showConverter, setShowConverter] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(loadNotificationSettings);

  useEffect(() => {
    saveNotificationSettings(notificationSettings);
    syncLocalNotifications(events, notificationSettings).catch(() => {
      // Bỏ qua lỗi quyền khi chưa cấp trên thiết bị
    });
  }, [events, notificationSettings]);

  const todaysReminders = useMemo(
    () => getTodaysDueReminders(events, notificationSettings),
    [events, notificationSettings],
  );

  const selectedDayInfo = useMemo(
    () =>
      getFullDayInfo(
        selectedSolar.day,
        selectedSolar.month,
        selectedSolar.year,
      ),
    [selectedSolar],
  );

  const tetCountdown = useMemo(
    () => getNextTetCountdown(todaySolar),
    [todaySolar],
  );

  const selectedDayEvents = useMemo(
    () => getEventsForDay(selectedDayInfo.solar, selectedDayInfo.lunar),
    [getEventsForDay, selectedDayInfo],
  );

  const isSelectedToday =
    selectedSolar.day === todaySolar.day &&
    selectedSolar.month === todaySolar.month &&
    selectedSolar.year === todaySolar.year;

  const handleSelectDate = (solar: SolarDate) => {
    setSelectedSolar(solar);
    setViewMonth(solar.month);
    setViewYear(solar.year);
  };

  const handleGoToday = () => {
    handleSelectDate(todaySolar);
  };

  const handleChangeMonth = (month: number, year: number) => {
    setViewMonth(month);
    setViewYear(year);
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] transition-colors">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onGoToday={handleGoToday}
        onOpenConverter={() => setShowConverter(true)}
        onOpenHolidays={() => setShowHolidays(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenAddEvent={() => setShowEventModal(true)}
        notificationsEnabled={notificationSettings.enabled}
        tetCountdown={tetCountdown}
      />

      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
        {todaysReminders.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-100/90 to-red-50 px-4 py-2.5 text-sm font-semibold text-red-900 shadow-2xs dark:border-amber-800/60 dark:from-amber-950/60 dark:to-red-950/50 dark:text-amber-200">
            <span>🔔 Nhắc hôm nay: {todaysReminders.join(' · ')}</span>
            <button
              type="button"
              onClick={handleGoToday}
              className="rounded-lg bg-white/80 px-2.5 py-1 text-xs font-bold text-red-700 hover:bg-white dark:bg-stone-900 dark:text-amber-300"
            >
              Xem hôm nay
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Cột phải trên Desktop / Trên cùng trên Mobile: Lịch Bloc chi tiết ngày */}
          <div className="lg:order-2 lg:col-span-5">
            <DayDetailCard
              dayInfo={selectedDayInfo}
              isToday={isSelectedToday}
              events={selectedDayEvents}
              totalEventsCount={events.length}
              onAddEventForDay={() => setShowEventModal(true)}
              onRemoveEvent={removeEvent}
              onExportEvents={exportEventsJson}
              onImportEvents={importEventsJson}
            />
          </div>

          {/* Cột trái trên Desktop: Lịch Tháng + Điểm nhấn trong tháng */}
          <div className="space-y-5 lg:order-1 lg:col-span-7">
            <MonthCalendar
              viewMonth={viewMonth}
              viewYear={viewYear}
              selectedSolar={selectedSolar}
              todaySolar={todaySolar}
              onSelectDate={handleSelectDate}
              onChangeMonth={handleChangeMonth}
              getEventsForDay={getEventsForDay}
            />

            <MonthHighlightsCard
              viewMonth={viewMonth}
              viewYear={viewYear}
              onSelectDate={handleSelectDate}
              getEventsForDay={getEventsForDay}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-amber-200/70 py-5 text-center text-xs text-stone-600 dark:border-amber-900/30 dark:text-stone-400">
        Phát triển bởi <span className="font-bold text-red-800 dark:text-amber-300">NTQ TECH</span> · Lịch Việt — Âm Lịch Việt Nam
      </footer>

      {showConverter && (
        <DateConverterModal
          initialSolar={selectedSolar}
          onClose={() => setShowConverter(false)}
          onSelectDate={handleSelectDate}
        />
      )}

      {showHolidays && (
        <HolidayListModal
          year={viewYear}
          onClose={() => setShowHolidays(false)}
          onSelectDate={handleSelectDate}
        />
      )}

      {showEventModal && (
        <EventModal
          selectedSolar={selectedDayInfo.solar}
          selectedLunar={selectedDayInfo.lunar}
          onClose={() => setShowEventModal(false)}
          onSave={addEvent}
        />
      )}

      {showNotifications && (
        <NotificationModal
          settings={notificationSettings}
          events={events}
          onChangeSettings={setNotificationSettings}
          onSelectDate={handleSelectDate}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}

export default App;

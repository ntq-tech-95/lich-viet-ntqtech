import { Bell, BellOff, Clock, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { PersonalEvent, SolarDate } from '../core/lunar';
import {
  buildUpcomingReminders,
  syncLocalNotifications,
  type NotificationSettings,
} from '../services/notifications';

interface NotificationModalProps {
  settings: NotificationSettings;
  events: PersonalEvent[];
  onChangeSettings: (next: NotificationSettings) => void;
  onSelectDate: (solar: SolarDate) => void;
  onClose: () => void;
}

const TIME_OPTIONS = [
  { label: '06:30 sáng', hour: 6, minute: 30 },
  { label: '07:00 sáng', hour: 7, minute: 0 },
  { label: '07:30 sáng', hour: 7, minute: 30 },
  { label: '08:00 sáng', hour: 8, minute: 0 },
  { label: '09:00 sáng', hour: 9, minute: 0 },
];

export function NotificationModal({
  settings,
  events,
  onChangeSettings,
  onSelectDate,
  onClose,
}: NotificationModalProps) {
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const upcomingPreview = useMemo(
    () => buildUpcomingReminders(events, settings).slice(0, 6),
    [events, settings],
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await syncLocalNotifications(events, settings);
      setStatusMsg(res.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cài đặt nhắc lịch tự động"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-md flex-col rounded-3xl border border-amber-200 bg-white p-5 shadow-xl dark:border-stone-800 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.enabled ? (
              <Bell className="h-5 w-5 text-red-600 dark:text-amber-400" />
            ) : (
              <BellOff className="h-5 w-5 text-stone-400" />
            )}
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Nhắc lịch Âm tự động
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

        <div className="mt-4 space-y-3 overflow-y-auto pr-1">
          <label className="flex items-center justify-between rounded-2xl border border-amber-200/80 bg-amber-50/50 p-3.5 dark:border-stone-800 dark:bg-stone-800/50">
            <div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Bật thông báo nhắc lịch
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Tự động nhắc trên app iOS / Android khi đến ngày
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) =>
                onChangeSettings({ ...settings, enabled: e.target.checked })
              }
              className="h-5 w-5 accent-red-700"
            />
          </label>

          <div className="space-y-2 rounded-2xl border border-stone-200/80 p-3.5 dark:border-stone-800">
            <label className="flex items-center gap-2.5 text-sm text-stone-800 dark:text-stone-200">
              <input
                type="checkbox"
                disabled={!settings.enabled}
                checked={settings.includeMung1AndRam}
                onChange={(e) =>
                  onChangeSettings({
                    ...settings,
                    includeMung1AndRam: e.target.checked,
                  })
                }
                className="h-4 w-4 accent-red-700"
              />
              Nhắc ngày Mùng 1 & Ngày Rằm (15 Âm lịch)
            </label>

            <label className="flex items-center gap-2.5 text-sm text-stone-800 dark:text-stone-200">
              <input
                type="checkbox"
                disabled={!settings.enabled}
                checked={settings.includePersonalEvents}
                onChange={(e) =>
                  onChangeSettings({
                    ...settings,
                    includePersonalEvents: e.target.checked,
                  })
                }
                className="h-4 w-4 accent-red-700"
              />
              Nhắc sự kiện & Giỗ chạp cá nhân
            </label>

            <div className="flex items-center justify-between pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300">
                <Clock className="h-3.5 w-3.5 text-amber-600" />
                Giờ gửi thông báo
              </span>
              <select
                disabled={!settings.enabled}
                value={`${settings.hour}:${settings.minute}`}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(':').map(Number);
                  onChangeSettings({ ...settings, hour: h, minute: m });
                }}
                className="rounded-xl border border-amber-200 bg-stone-50 px-2.5 py-1.5 text-xs font-semibold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t.label} value={`${t.hour}:${t.minute}`}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Danh sách lịch nhắc sắp tới */}
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              Lịch nhắc sắp tới ({upcomingPreview.length})
            </div>
            {upcomingPreview.length === 0 ? (
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Chưa có lịch nhắc nào được bật.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {upcomingPreview.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDate(item.solar);
                        onClose();
                      }}
                      className="flex w-full items-center justify-between gap-2 rounded-xl border border-stone-200/70 bg-stone-50/70 px-3 py-2 text-left text-xs transition hover:border-red-300 hover:bg-red-50/50 dark:border-stone-800 dark:bg-stone-800/50 dark:hover:border-amber-700"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-stone-900 dark:text-stone-100">
                          {item.title}
                        </div>
                        <div className="truncate text-[11px] text-stone-500 dark:text-stone-400">
                          {item.body}
                        </div>
                      </div>
                      <span className="tabular-nums shrink-0 rounded-lg bg-white px-2 py-1 font-bold text-red-700 shadow-2xs dark:bg-stone-900 dark:text-amber-300">
                        {String(item.solar.day).padStart(2, '0')}/
                        {String(item.solar.month).padStart(2, '0')}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {statusMsg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
              {statusMsg}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-stone-100 pt-3 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            Đóng
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
          >
            {saving ? 'Đang áp dụng...' : 'Áp dụng & Hẹn nhắc'}
          </button>
        </div>
      </div>
    </div>
  );
}

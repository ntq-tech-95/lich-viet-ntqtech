import { CalendarPlus, X } from 'lucide-react';
import { useState } from 'react';
import type { LunarDate, PersonalEvent, SolarDate } from '../core/lunar';

interface EventModalProps {
  selectedSolar: SolarDate;
  selectedLunar: LunarDate;
  onClose: () => void;
  onSave: (event: Omit<PersonalEvent, 'id' | 'createdAt'>) => void;
}

export function EventModal({
  selectedSolar,
  selectedLunar,
  onClose,
  onSave,
}: EventModalProps) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [calendarType, setCalendarType] = useState<'lunar' | 'solar'>('lunar');
  const [category, setCategory] = useState<PersonalEvent['category']>('gio-chap');
  const [repeatYearly, setRepeatYearly] = useState(true);

  const [day, setDay] = useState(selectedLunar.day);
  const [month, setMonth] = useState(selectedLunar.month);
  const [year, setYear] = useState(selectedLunar.year);

  const handleSwitchCalendar = (nextType: 'lunar' | 'solar') => {
    setCalendarType(nextType);
    if (nextType === 'lunar') {
      setDay(selectedLunar.day);
      setMonth(selectedLunar.month);
      setYear(selectedLunar.year);
    } else {
      setDay(selectedSolar.day);
      setMonth(selectedSolar.month);
      setYear(selectedSolar.year);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onSave({
      title: trimmed,
      note: note.trim() || undefined,
      calendarType,
      day,
      month,
      year: repeatYearly ? undefined : year,
      repeatYearly,
      category,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Thêm sự kiện hoặc ngày giỗ"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-xl dark:border-stone-800 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Thêm sự kiện & Giỗ chạp
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
              Tên sự kiện *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ví dụ: Giỗ Ông Nội, Sinh nhật mẹ, Cúng Rằm..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:border-red-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
                Loại lịch
              </label>
              <div className="mt-1 grid grid-cols-2 gap-1 rounded-xl bg-stone-100 p-1 dark:bg-stone-800">
                <button
                  type="button"
                  onClick={() => handleSwitchCalendar('lunar')}
                  className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                    calendarType === 'lunar'
                      ? 'bg-white text-red-700 shadow-2xs dark:bg-stone-900 dark:text-red-400'
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Âm lịch
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchCalendar('solar')}
                  className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                    calendarType === 'solar'
                      ? 'bg-white text-red-700 shadow-2xs dark:bg-stone-900 dark:text-red-400'
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  Dương lịch
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
                Nhóm
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as PersonalEvent['category'])
                }
                className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:border-red-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option value="gio-chap">Giỗ chạp</option>
                <option value="sinh-nhat">Sinh nhật</option>
                <option value="le-tet">Lễ Tết</option>
                <option value="ca-nhan">Cá nhân</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Ngày
              <input
                type="number"
                min={1}
                max={calendarType === 'lunar' ? 30 : 31}
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
            </label>
            <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Tháng
              <input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
            </label>
            <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">
              Năm
              <input
                type="number"
                min={1900}
                max={2100}
                disabled={repeatYearly}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 disabled:opacity-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
            <input
              type="checkbox"
              checked={repeatYearly}
              onChange={(e) => setRepeatYearly(e.target.checked)}
              className="h-4 w-4 rounded accent-red-600"
            />
            Lặp lại hàng năm theo {calendarType === 'lunar' ? 'Âm lịch' : 'Dương lịch'}
          </label>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
              Ghi chú (tùy chọn)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Chuẩn bị hoa quả, đặt mâm..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:border-red-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Lưu sự kiện
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

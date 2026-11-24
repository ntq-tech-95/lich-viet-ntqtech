import type { SVGProps } from 'react';

/**
 * Họa tiết Trống Đồng Đông Sơn cách điệu làm nền chìm sang trọng
 */
export function TrongDongPattern({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="120" cy="120" r="112" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="120" cy="120" r="94" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="120" cy="120" r="76" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 6" />
      <circle cx="120" cy="120" r="56" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="120" cy="120" r="34" stroke="currentColor" strokeWidth="1" />
      {/* Mặt trời 12 tia ở tâm */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 120 + Math.cos(angle) * 18;
        const y1 = 120 + Math.sin(angle) * 18;
        const x2 = 120 + Math.cos(angle) * 32;
        const y2 = 120 + Math.sin(angle) * 32;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="120" cy="120" r="12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Hoa văn góc truyền thống Việt Nam
 */
export function CornerFlourish({
  className = '',
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M3 33V11C3 6.58172 6.58172 3 11 3H33"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 27V14C9 11.2386 11.2386 9 14 9H27"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="9" cy="9" r="2.2" fill="currentColor" />
    </svg>
  );
}

/**
 * Hiển thị pha Mặt Trăng trực quan theo ngày Âm lịch (1 -> 30)
 */
export function getMoonPhaseLabel(lunarDay: number): string {
  if (lunarDay === 1) return 'Trăng non (Sóc)';
  if (lunarDay <= 6) return 'Trăng lưỡi liềm đầu tháng';
  if (lunarDay <= 9) return 'Trăng thượng huyền';
  if (lunarDay <= 13) return 'Trăng khuyết đầu tháng';
  if (lunarDay <= 16) return 'Trăng tròn (Rằm)';
  if (lunarDay <= 21) return 'Trăng khuyết cuối tháng';
  if (lunarDay <= 24) return 'Trăng hạ huyền';
  return 'Trăng tàn cuối tháng';
}

export function MoonPhaseVisual({
  lunarDay,
  size = 44,
}: {
  lunarDay: number;
  size?: number;
}) {
  // Pha chu kỳ 0..1 (0 = ngày 1, 0.5 = ngày 15 Rằm)
  const phase = ((lunarDay - 1) % 29.53) / 29.53;
  const waxing = phase <= 0.5;
  // Độ sáng từ 0 (trăng non) -> 1 (trăng rằm)
  const illum = waxing ? phase * 2 : (1 - phase) * 2;
  const r = 18;
  const cx = 22;
  const cy = 22;
  // rx của nửa elip che bóng: khi illum = 0 -> rx = r (tối hết), illum = 0.5 -> rx = 0 (bán nguyệt), illum = 1 -> rx = -r (tròn sáng)
  const terminatorRx = Math.abs(1 - 2 * illum) * r;
  const isMoreThanHalf = illum >= 0.5;

  // Xây dựng path vùng sáng
  let litPath = '';
  if (illum <= 0.03) {
    litPath = '';
  } else if (illum >= 0.97) {
    litPath = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
  } else if (waxing) {
    // Sáng bên phải
    const sweepInner = isMoreThanHalf ? 1 : 0;
    litPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${terminatorRx} ${r} 0 0 ${sweepInner} ${cx} ${cy - r} Z`;
  } else {
    // Sáng bên trái
    const sweepInner = isMoreThanHalf ? 0 : 1;
    litPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${terminatorRx} ${r} 0 0 ${sweepInner} ${cx} ${cy - r} Z`;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      aria-label={getMoonPhaseLabel(lunarDay)}
      className="drop-shadow-[0_0_8px_rgba(253,224,71,0.45)]"
    >
      <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.12)" stroke="rgba(254,240,138,0.45)" strokeWidth="1.2" />
      {litPath && <path d={litPath} fill="#FEF08A" />}
    </svg>
  );
}

/**
 * Biểu tượng Ngũ Hành & 12 Con Giáp dạng huy hiệu Việt
 */
export const ZODIAC_CHIBI_SYMBOLS = [
  '🐭', // Tý - Chuột
  '🐃', // Sửu - Trâu
  '🐯', // Dần - Hổ
  '🐱', // Mão - Mèo
  '🐲', // Thìn - Rồng
  '🐍', // Tỵ - Rắn
  '🐴', // Ngọ - Ngựa
  '🐐', // Mùi - Dê
  '🐵', // Thân - Khỉ
  '🐓', // Dậu - Gà
  '🐕', // Tuất - Chó
  '🐖', // Hợi - Lợn
] as const;

export function LanternIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="11" y="5" width="10" height="3" rx="1.5" fill="#FBBF24" />
      <ellipse cx="16" cy="15.5" rx="9.5" ry="8.5" fill="currentColor" />
      <ellipse cx="16" cy="15.5" rx="5" ry="8.5" stroke="#FDE68A" strokeWidth="1.2" opacity="0.7" />
      <rect x="11.5" y="23" width="9" height="2.5" rx="1.2" fill="#FBBF24" />
      <line x1="14" y1="25.5" x2="13.5" y2="29.5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="25.5" x2="16" y2="30" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="25.5" x2="18.5" y2="29.5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

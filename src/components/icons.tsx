// Inline SVG icons used across the homepage, converted 1:1 from the original design file.
import type { CSSProperties, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

/** Phone handset, 16px (knob buttons) */
export function PhoneIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M12.0777 9.80198L9.33224 10.334C7.47778 9.40318 6.33224 8.33398 5.66558 6.66732L6.17888 3.91392L5.20859 1.33398H2.70798C1.95628 1.33398 1.36434 1.95517 1.4766 2.69844C1.75688 4.55398 2.58326 7.91832 4.99891 10.334C7.53571 12.8708 11.1894 13.9716 13.2002 14.4091C13.9768 14.5781 14.6656 13.9723 14.6656 13.1777V10.7881L12.0777 9.80198Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Trophy, announcement bar */
export function TrophyIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M5.62109 3.33398H14.4276C14.4276 3.33398 13.6938 14.3816 10.0244 14.3816C8.23186 14.3816 7.13986 11.7452 6.49174 9.04823C5.81309 6.22435 5.62109 3.33398 5.62109 3.33398Z" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /><path d="M14.4273 3.33402C14.4273 3.33402 15.195 2.51513 15.833 2.50068C17.083 2.47238 17.3141 3.33402 17.3141 3.33402C17.5587 3.84197 17.7544 5.1626 16.5802 6.38165C15.406 7.60069 14.0916 8.66736 13.5566 9.04827" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /><path d="M5.6211 3.33342C5.6211 3.33342 4.82127 2.50519 4.16667 2.50008C2.91667 2.49033 2.68557 3.33342 2.68557 3.33342C2.44094 3.84135 2.24524 5.16198 3.41946 6.38103C4.59367 7.60008 5.9569 8.66674 6.49174 9.04774" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /><path d="M7.08789 16.6666C7.08789 15.1428 10.0234 14.3809 10.0234 14.3809C10.0234 14.3809 12.959 15.1428 12.959 16.6666H7.08789Z" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Open book, announcement bar */
export function OpenBookIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M10 17.4993V5.83268C10 4.91221 10.7462 4.16602 11.6667 4.16602H17.8333C18.1095 4.16602 18.3333 4.38987 18.3333 4.66602V15.5946" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" /><path d="M9.99935 17.4993V5.83268C9.99935 4.91221 9.25318 4.16602 8.33268 4.16602H2.16602C1.88987 4.16602 1.66602 4.38987 1.66602 4.66602V15.5946" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" /><path d="M11.666 15.834H18.3327" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" /><path d="M8.33268 15.834H1.66602" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" /><path d="M10 17.5007C10 16.5802 10.7462 15.834 11.6667 15.834" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /><path d="M10.0007 17.5007C10.0007 16.5802 9.25448 15.834 8.33398 15.834" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Laptop, announcement bar */
export function LaptopOutlineIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M2.66665 11.8512V3.33268C2.66665 2.41221 3.41284 1.66602 4.33332 1.66602H15.6667C16.5872 1.66602 17.3333 2.41221 17.3333 3.33268V11.8512M2.66665 11.8512H17.3333M2.66665 11.8512L1.43306 16.2123C1.13218 17.2761 1.93134 18.3327 3.0368 18.3327H16.9632C18.0687 18.3327 18.8678 17.2761 18.5669 16.2123L17.3333 11.8512" stroke="#F3811D" strokeWidth="1.75" /><path d="M9.16602 15.834H10.8327" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Clipboard with a tick, announcement bar */
export function ClipboardCheckIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M6.66602 3.33398H5.41602C4.49554 3.33398 3.74935 4.08018 3.74935 5.00065V15.834C3.74935 16.7545 4.49554 17.5007 5.41602 17.5007H14.5827C15.5032 17.5007 16.2493 16.7545 16.2493 15.834V5.00065C16.2493 4.08018 15.5032 3.33398 14.5827 3.33398H13.3327" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /><path d="M7.49935 1.66602H12.4993C12.9596 1.66602 13.3327 2.03911 13.3327 2.49935V4.16602C13.3327 4.62625 12.9596 4.99935 12.4993 4.99935H7.49935C7.03911 4.99935 6.66602 4.62625 6.66602 4.16602V2.49935C6.66602 2.03911 7.03911 1.66602 7.49935 1.66602Z" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /><path d="M7.08398 11.25L9.16732 13.3333L12.9173 9.16667" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Two people, mentor and student, announcement bar */
export function MentorshipIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M7.49935 9.99935C9.34029 9.99935 10.8327 8.50697 10.8327 6.66602C10.8327 4.82507 9.34029 3.33268 7.49935 3.33268C5.6584 3.33268 4.16602 4.82507 4.16602 6.66602C4.16602 8.50697 5.6584 9.99935 7.49935 9.99935Z" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /><path d="M1.66602 17.5007V16.6673C1.66602 14.366 3.53148 12.5007 5.83268 12.5007H9.16602C11.4672 12.5007 13.3327 14.366 13.3327 16.6673V17.5007" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /><path d="M13.334 3.44141C14.7718 3.81141 15.834 5.11558 15.834 6.66724C15.834 8.21891 14.7718 9.52308 13.334 9.89308" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /><path d="M15.834 12.6094C17.2718 12.9794 18.334 14.2836 18.334 15.8353V17.5007" stroke="#F3811D" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Carousel arrow chevron, 20px */
export function CarouselChevronIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Arrow right, 20px (call-to-action buttons) */
export function ArrowRightLgIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M2.5 10H17.5M10.4167 17.0833L17.5 10L10.4167 2.91667" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Arrow right, 16px */
export function ArrowRightIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M2 8.00065H14M8.33333 13.6673L14 8.00065L8.33333 2.33398" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Arrow up-right, 18px (course cards) */
export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M4.5 13.5L13.5 4.5M13.5 11.25V4.5H6.75" stroke="currentColor" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Rank ribbon, 67px wide (topper cards) */
export function RankShapeWide(props: IconProps) {
  return (
    <svg width="67" height="78" viewBox="0 0 67 78" fill="none" aria-hidden="true" focusable="false" {...props}><defs><linearGradient id="rk67" x1="33.5" y1="0" x2="33.5" y2="78" gradientUnits="userSpaceOnUse"><stop stopColor="#C54D0E" /><stop offset="0.45" stopColor="#C54D0E" /><stop offset="1" stopColor="#E57512" /></linearGradient></defs><path d="M0 0H67V54.4875C67 57.2513 65.7377 59.4624 63.213 61.1207L37.287 76.8747C34.7623 78.3751 32.2377 78.3751 29.713 76.8747L3.78696 61.1207C1.26232 59.4624 0 57.2513 0 54.4875V0Z" fill="url(#rk67)" /></svg>
  );
}

/** Chevron right, 16px */
/** Chevron down, 14px (header menu items) */
export function ChevronDownSmIcon(props: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

export function ChevronRightSmIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Play triangle, 16px (hero video toggle) */
export function PlayIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M5 3.25V12.75L12.75 8L5 3.25Z" fill="currentColor" /></svg>
  );
}

/** Pause bars, 16px (hero video toggle) */
export function PauseIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" {...props}><rect x="3.75" y="3.25" width="2.75" height="9.5" rx="0.75" fill="currentColor" /><rect x="9.5" y="3.25" width="2.75" height="9.5" rx="0.75" fill="currentColor" /></svg>
  );
}

/** Close cross, 20px (video dialog) */
/** Three dots in a column, 18px (the header's menu button) */
export function MoreIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false" {...props}><rect x="7.5" y="2.5" width="3" height="3" rx="1" fill="currentColor" /><rect x="7.5" y="7.5" width="3" height="3" rx="1" fill="currentColor" /><rect x="7.5" y="12.5" width="3" height="3" rx="1" fill="currentColor" /></svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
  );
}

/** Decorative rings, toppers banner. Swells while a parent `group/banner` is hovered. */
export function BannerRings(props: IconProps) {
  return (
    <svg width="1120" height="281" viewBox="0 0 1120 281" fill="none" aria-hidden="true" {...props}><circle className="origin-center [transform-box:fill-box] [animation:ring_7s_ease-in-out_calc(var(--i)*-1.1s)_infinite] [transition:scale_.9s_var(--ease-smooth)_calc(var(--i)*70ms)] group-hover/banner:[scale:calc(1+var(--s))]" style={{ "--i": "0", "--s": ".025" } as CSSProperties} opacity="0.35" cx="1250" cy="148" r="460" fill="#F08E46" /><circle className="origin-center [transform-box:fill-box] [animation:ring_7s_ease-in-out_calc(var(--i)*-1.1s)_infinite] [transition:scale_.9s_var(--ease-smooth)_calc(var(--i)*70ms)] group-hover/banner:[scale:calc(1+var(--s))]" style={{ "--i": "1", "--s": ".035" } as CSSProperties} opacity="0.35" cx="1250" cy="148" r="380" fill="#F29F61" /><circle className="origin-center [transform-box:fill-box] [animation:ring_7s_ease-in-out_calc(var(--i)*-1.1s)_infinite] [transition:scale_.9s_var(--ease-smooth)_calc(var(--i)*70ms)] group-hover/banner:[scale:calc(1+var(--s))]" style={{ "--i": "2", "--s": ".045" } as CSSProperties} opacity="0.35" cx="1250" cy="148" r="300" fill="#F5B585" /><circle className="origin-center [transform-box:fill-box] [animation:ring_7s_ease-in-out_calc(var(--i)*-1.1s)_infinite] [transition:scale_.9s_var(--ease-smooth)_calc(var(--i)*70ms)] group-hover/banner:[scale:calc(1+var(--s))]" style={{ "--i": "3", "--s": ".06" } as CSSProperties} opacity="0.35" cx="1250" cy="148" r="220" fill="#F9CDAC" /><circle className="origin-center [transform-box:fill-box] [animation:ring_7s_ease-in-out_calc(var(--i)*-1.1s)_infinite] [transition:scale_.9s_var(--ease-smooth)_calc(var(--i)*70ms)] group-hover/banner:[scale:calc(1+var(--s))]" style={{ "--i": "4", "--s": ".08" } as CSSProperties} opacity="0.35" cx="1235" cy="148" r="140" fill="#FCE5D4" /></svg>
  );
}

/** Trend chart, feature card */
export function TrendIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M18.3327 18.3327H3.66602V3.66602" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.66602 15.125L10.9993 8.25L13.7493 11L17.8743 6.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Graduation cap, feature card */
export function GraduationCapIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M2.35872 7.7589L10.2956 3.79048C10.4504 3.71307 10.6326 3.71307 10.7875 3.79048L18.7243 7.7589C19.1297 7.96159 19.1297 8.54008 18.7243 8.74277L10.7875 12.7112C10.6326 12.7886 10.4504 12.7886 10.2956 12.7112L2.35872 8.74277C1.95334 8.54008 1.95334 7.96159 2.35872 7.7589Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M20.6243 11.916V8.70768L18.791 7.79102" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4.125 9.625V14.5861C4.125 15.2939 4.53254 15.9386 5.17202 16.2422L9.75535 18.4184C10.2529 18.6546 10.8304 18.6546 11.328 18.4184L15.9113 16.2422C16.5508 15.9386 16.9583 15.2939 16.9583 14.5861V9.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Person, feature card */
export function PersonIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M4.58398 18.3333V17.4167C4.58398 13.8728 7.45683 11 11.0007 11C14.5445 11 17.4173 13.8728 17.4173 17.4167V18.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M11.0007 10.9993C13.0257 10.9993 14.6673 9.35769 14.6673 7.33268C14.6673 5.30764 13.0257 3.66602 11.0007 3.66602C8.97561 3.66602 7.33398 5.30764 7.33398 7.33268C7.33398 9.35769 8.97561 10.9993 11.0007 10.9993Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Notebook, feature card */
export function NotebookIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M4.58398 17.875V4.58333C4.58398 3.57081 5.4048 2.75 6.41732 2.75H16.8673C17.1711 2.75 17.4173 2.99624 17.4173 3.3V19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.25 6.41602H13.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M5.95898 13.75H17.4173" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M5.95898 16.5H17.4173" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M5.95898 19.25H17.4173" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M5.95898 16.5C5.04232 16.5 4.58398 15.8844 4.58398 15.125C4.58398 14.3656 5.04232 13.75 5.95898 13.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M5.95898 19.25C5.04232 19.25 4.58398 18.6344 4.58398 17.875C4.58398 17.1156 5.04232 16.5 5.95898 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Location pin, feature card */
export function LocationPinIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M18.3327 9.16732C18.3327 13.2174 10.9993 20.1673 10.9993 20.1673C10.9993 20.1673 3.66602 13.2174 3.66602 9.16732C3.66602 5.11723 6.94926 1.83398 10.9993 1.83398C15.0495 1.83398 18.3327 5.11723 18.3327 9.16732Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M11.0007 10.0833C11.5069 10.0833 11.9173 9.67294 11.9173 9.16667C11.9173 8.66041 11.5069 8.25 11.0007 8.25C10.4944 8.25 10.084 8.66041 10.084 9.16667C10.084 9.67294 10.4944 10.0833 11.0007 10.0833Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Laptop, feature card */
export function LaptopIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M2.93312 13.0377V3.66732C2.93312 2.6548 3.75393 1.83398 4.76646 1.83398H17.2331C18.2457 1.83398 19.0665 2.6548 19.0665 3.66732V13.0377M2.93312 13.0377H19.0665M2.93312 13.0377L1.57617 17.835C1.2452 19.0051 2.12427 20.1673 3.34029 20.1673H18.6593C19.8753 20.1673 20.7544 19.0051 20.4234 17.835L19.0665 13.0377" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M10.084 17.416H11.9173" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Chevron right, 18px */
export function ChevronRightMdIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M6.75 4.5L11.25 9L6.75 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Flagship programme badge */
export function FlagshipBadgeShape(props: IconProps) {
  return (
    <svg width="172" height="48" viewBox="0 0 172 48" fill="none" aria-hidden="true" {...props}><defs><linearGradient id="bdg1" x1="-55.8501" y1="20.5" x2="136" y2="20.5" gradientUnits="userSpaceOnUse"><stop stopColor="#F6B653" /><stop offset="1" stopColor="#FCEAC9" /></linearGradient><linearGradient id="bdg2" x1="22.4197" y1="0" x2="22.4197" y2="44.8403" gradientUnits="userSpaceOnUse"><stop stopColor="#EDCE61" /><stop offset="0.221154" stopColor="#EECF63" /><stop offset="0.524038" stopColor="#CA9D32" /><stop offset="0.764423" stopColor="#E6C357" /><stop offset="0.894231" stopColor="#FEEA80" /><stop offset="0.995192" stopColor="#EBC95C" /></linearGradient><linearGradient id="bdg3" x1="5.43756" y1="0" x2="36.9199" y2="41.9146" gradientUnits="userSpaceOnUse"><stop offset="0.0576923" stopColor="#E4BF53" /><stop offset="0.163462" stopColor="#FDE77D" /><stop offset="0.355769" stopColor="#D6AB3F" /><stop offset="0.658654" stopColor="#CB9D34" /><stop offset="1" stopColor="#E6C152" /></linearGradient></defs><g transform="translate(36 3)"><path d="M0 40.1867V0.81334C0 0.364145 0.364144 0 0.813339 0H134.159C134.866 0 135.236 0.838722 134.76 1.36101L117.107 20.7435C116.816 21.0631 116.826 21.5545 117.129 21.8622L134.635 39.6156C135.142 40.1296 134.778 41 134.056 41H0.81334C0.364145 41 0 40.6359 0 40.1867Z" fill="url(#bdg1)" /></g><circle cx="23.901" cy="23.901" r="23.901" fill="#D9AB3E" /><g transform="translate(1.48 1.48)"><circle cx="22.4197" cy="22.4201" r="22.076" transform="rotate(90 22.4197 22.4201)" fill="#B98F2D" stroke="url(#bdg2)" strokeWidth="0.68834" /></g><g transform="translate(4.82 5.44)"><circle cx="18.4598" cy="18.4602" r="18.4602" transform="rotate(90 18.4598 18.4602)" fill="url(#bdg3)" /></g></svg>
  );
}

/** LinkedIn logo */
export function LinkedInIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M17.5 0H2.5C1.11929 0 0 1.11929 0 2.5V17.5C0 18.8807 1.11929 20 2.5 20H17.5C18.8807 20 20 18.8807 20 17.5V2.5C20 1.11929 18.8807 0 17.5 0Z" fill="#0076B2" /><path d="M17.0393 17.0431H14.0777V12.4022C14.0777 11.2956 14.0552 9.87141 12.5343 9.87141C10.9902 9.87141 10.7543 11.0756 10.7543 12.3206V17.0431H7.79268V7.49974H10.6377V8.80057H10.676C11.0735 8.05057 12.0402 7.25891 13.4843 7.25891C16.4852 7.25891 17.0402 9.23391 17.0402 11.8047L17.0393 17.0431ZM4.44768 6.19391C3.49435 6.19391 2.72852 5.42224 2.72852 4.47307C2.72852 3.52474 3.49518 2.75391 4.44768 2.75391C5.39768 2.75391 6.16768 3.52474 6.16768 4.47307C6.16768 5.42224 5.39685 6.19391 4.44768 6.19391ZM5.93268 17.0431H2.96268V7.49974H5.93268V17.0431Z" fill="white" /></svg>
  );
}

/** Tiny arrow, 8px */
export function TinyArrowIcon(props: IconProps) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true" {...props}><path d="M0.75 4H7.25M4.25 1L7.25 4L4.25 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Decorative rings, counsellor box */
export function ContactRings(props: IconProps) {
  return (
    <svg width="1136" height="630" viewBox="0 0 1136 630" fill="none" aria-hidden="true" {...props}><circle cx="276" cy="630" r="460" fill="#FBE7A0" /><circle cx="276" cy="630" r="380" fill="#F9DF88" /><circle cx="276" cy="630" r="300" fill="#F6D570" /><circle cx="276" cy="630" r="220" fill="#F3CA58" /><circle cx="276" cy="630" r="140" fill="#EFBD40" /><circle cx="276" cy="630" r="64" fill="#E57512" /></svg>
  );
}

/** Select dropdown chevron */
export function SelectChevronIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#535353" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Rank ribbon, 46px wide (story cards) */
export function RankShapeNarrow(props: IconProps) {
  return (
    <svg width="46" height="78" viewBox="0 0 46 78" fill="none" aria-hidden="true" focusable="false" {...props}><defs><linearGradient id="rk46" x1="23" y1="0" x2="23" y2="78" gradientUnits="userSpaceOnUse"><stop stopColor="#C54D0E" /><stop offset="0.45" stopColor="#C54D0E" /><stop offset="1" stopColor="#E57512" /></linearGradient></defs><path d="M0 0H46V54.4875C46 57.2513 45.1333 59.4624 43.4 61.1207L25.6 76.8747C23.8667 78.3751 22.1333 78.3751 20.4 76.8747L2.6 61.1207C0.866667 59.4624 0 57.2513 0 54.4875V0Z" fill="url(#rk46)" /></svg>
  );
}

/** Quotation mark */
export function QuoteIcon(props: IconProps) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false" {...props}><path fillRule="evenodd" clipRule="evenodd" d="M10.7473 14.8737C10.6504 15.7769 10.389 16.4978 9.93317 17.136C9.32313 17.99 8.30101 18.7862 6.60804 19.6328C6.17581 19.8488 6.00061 20.3744 6.21673 20.8067C6.43284 21.2389 6.95843 21.4141 7.39066 21.198C9.19769 20.2945 10.5089 19.3407 11.3572 18.1531C12.2215 16.9431 12.541 15.582 12.541 13.9987V8.7487C12.541 7.62113 11.6269 6.70703 10.4993 6.70703H5.83268C4.70511 6.70703 3.79102 7.62113 3.79102 8.7487V12.832C3.79102 13.9596 4.70512 14.8737 5.83268 14.8737H10.7473Z" fill="#BA9E88" /><path fillRule="evenodd" clipRule="evenodd" d="M22.4152 14.8737C22.3183 15.7769 22.057 16.4978 21.6011 17.136C20.9911 17.99 19.969 18.7862 18.276 19.6328C17.8438 19.8488 17.6685 20.3744 17.8847 20.8067C18.1008 21.2389 18.6264 21.4141 19.0586 21.198C20.8657 20.2945 22.1769 19.3407 23.0252 18.1531C23.8894 16.9431 24.209 15.582 24.209 13.9987V8.7487C24.209 7.62114 23.2949 6.70703 22.1673 6.70703H17.5007C16.3731 6.70703 15.459 7.62114 15.459 8.7487V12.832C15.459 13.9596 16.3731 14.8737 17.5007 14.8737H22.4152Z" fill="#BA9E88" /></svg>
  );
}

/** Arrow right, 14px */
export function ArrowRightXsIcon(props: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M1.75 6.99935H12.25M7.29167 11.9577L12.25 6.99935L7.29167 2.04102" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Arrow right, 12px */
export function ArrowRightXxsIcon(props: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M1.5 6H10.5M6.25 10.25L10.5 6L6.25 1.75" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** FAQ toggle: a plus that turns into a minus when `open`. */
export function PlusMinusIcon({ open = false, ...props }: IconProps & { open?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}><path className={`origin-[12px_12px] transition-transform duration-350 ease-smooth ${open ? "scale-y-0 rotate-90" : ""}`} d="M12 6V18" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 12H18" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Person, contact option */
export function CounsellorIcon(props: IconProps) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M6.66602 26.6667V25.3333C6.66602 20.1787 10.8447 16 15.9993 16C21.154 16 25.3327 20.1787 25.3327 25.3333V26.6667" stroke="#E57512" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M15.9993 16.0007C18.9448 16.0007 21.3327 13.6128 21.3327 10.6673C21.3327 7.7218 18.9448 5.33398 15.9993 5.33398C13.0538 5.33398 10.666 7.7218 10.666 10.6673C10.666 13.6128 13.0538 16.0007 15.9993 16.0007Z" stroke="#E57512" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Envelope, contact option */
export function MailIcon(props: IconProps) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M9.33398 12L16.0007 16.6667L22.6673 12" stroke="#E57512" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.66602 22.666V9.33268C2.66602 7.85992 3.85992 6.66602 5.33268 6.66602H26.666C28.1388 6.66602 29.3327 7.85992 29.3327 9.33268V22.666C29.3327 24.1388 28.1388 25.3327 26.666 25.3327H5.33268C3.85992 25.3327 2.66602 24.1388 2.66602 22.666Z" stroke="#E57512" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Phone handset, 32px */
export function PhoneLargeIcon(props: IconProps) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M24.1574 19.602L18.6664 20.666C14.9575 18.8044 12.6664 16.666 11.3331 13.3327L12.3597 7.82588L10.4191 2.66602H5.41791C3.91451 2.66602 2.73063 3.90839 2.95516 5.39492C3.51571 9.10602 5.16848 15.8347 9.99977 20.666C15.0734 25.7396 22.3807 27.9412 26.4024 28.8163C27.9555 29.1543 29.3331 27.9427 29.3331 26.3533V21.5743L24.1574 19.602Z" stroke="#E57512" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Map pin, 16px */
export function MapPinSmIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M13.3327 6.66732C13.3327 9.61285 7.99935 14.6673 7.99935 14.6673C7.99935 14.6673 2.66602 9.61285 2.66602 6.66732C2.66602 3.7218 5.05383 1.33398 7.99935 1.33398C10.9449 1.33398 13.3327 3.7218 13.3327 6.66732Z" stroke="#575757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.00065 7.33333C8.36885 7.33333 8.66732 7.03487 8.66732 6.66667C8.66732 6.29848 8.36885 6 8.00065 6C7.63245 6 7.33398 6.29848 7.33398 6.66667C7.33398 7.03487 7.63245 7.33333 8.00065 7.33333Z" stroke="#575757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Clock, 16px */
export function ClockIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M8 4V8H12" stroke="#575757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.00065 14.6654C11.6825 14.6654 14.6673 11.6806 14.6673 7.9987C14.6673 4.3168 11.6825 1.33203 8.00065 1.33203C4.31875 1.33203 1.33398 4.3168 1.33398 7.9987C1.33398 11.6806 4.31875 14.6654 8.00065 14.6654Z" stroke="#575757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Phone handset, 16px (map card) */
export function PhoneSmIcon(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M14.6669 11.2788V13.2788C14.6677 13.4644 14.6297 13.6482 14.5553 13.8183C14.4809 13.9884 14.3718 14.1412 14.235 14.2667C14.0982 14.3922 13.9367 14.4878 13.7608 14.5472C13.5849 14.6067 13.3985 14.6288 13.2136 14.6121C11.1622 14.3892 9.19161 13.6882 7.46028 12.5654C5.8495 11.5419 4.48384 10.1762 3.46028 8.56543C2.3336 6.82623 1.63244 4.84609 1.41361 2.78543C1.39695 2.60107 1.41886 2.41527 1.47795 2.23985C1.53703 2.06442 1.63199 1.90322 1.75679 1.76651C1.88159 1.6298 2.03348 1.52057 2.20281 1.44578C2.37213 1.37099 2.55517 1.33227 2.74028 1.3321H4.74028C5.06382 1.32891 5.37748 1.44348 5.62279 1.65445C5.8681 1.86542 6.02833 2.15839 6.07361 2.47876C6.15361 3.11876 6.31361 3.74543 6.54028 4.33876C6.62998 4.57738 6.64939 4.83671 6.59622 5.08602C6.54305 5.33533 6.41952 5.56417 6.24028 5.74543L5.39361 6.5921C6.34265 8.26113 7.72458 9.64306 9.39361 10.5921L10.2403 9.74543C10.4215 9.56619 10.6504 9.44266 10.8997 9.38949C11.149 9.33632 11.4083 9.35573 11.6469 9.44543C12.2403 9.6721 12.8669 9.8321 13.5069 9.9121C13.8356 9.95499 14.1364 10.1187 14.3509 10.3714C14.5653 10.6241 14.678 10.9475 14.6669 11.2788Z" stroke="#575757" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Folded map */
export function MapIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M12.5 4.16667L7.5 2.5L2.84188 4.05271C2.63772 4.12076 2.5 4.31183 2.5 4.52705V16.8062C2.5 17.1476 2.83435 17.3886 3.15812 17.2807L7.5 15.8333M12.5 4.16667L16.8419 2.71938C17.1657 2.61145 17.5 2.85243 17.5 3.19372V15.4729C17.5 15.6882 17.3623 15.8793 17.1581 15.9473L12.5 17.5L7.5 15.8333M7.5 15.8333V2.5M12.5 17.5V4.16667" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Zoom in */
export function ZoomInIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M5.5 11H11M11 11H16.5M11 11V5.5M11 11V16.5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Zoom out */
export function ZoomOutIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M5.5 11H16.5" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

/** Decorative rings, closing banner */
export function ClosingRings(props: IconProps) {
  return (
    <svg width="1112" height="444" viewBox="0 0 1112 444" fill="none" aria-hidden="true" {...props}><circle cx="1145" cy="2" r="220" fill="#F8DC84" fillOpacity="0.6" /><circle cx="1145" cy="2" r="160" fill="#F4CF68" fillOpacity="0.6" /><circle cx="1145" cy="2" r="100" fill="#EFC04F" fillOpacity="0.6" /><circle cx="11" cy="445" r="200" fill="#F8D7B4" fillOpacity="0.6" /><circle cx="12" cy="438" r="130" fill="#F5C597" fillOpacity="0.6" /><circle cx="-8" cy="460" r="100" fill="#F5C597" /></svg>
  );
}

/** YouTube */
export function YouTubeIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M19.5817 5.15591C19.4687 4.73031 19.2459 4.34186 18.9355 4.02946C18.6252 3.71707 18.2382 3.4917 17.8133 3.37591C16.2542 2.95508 10 2.95508 10 2.95508C10 2.95508 3.74583 2.95508 2.18583 3.37591C1.76117 3.4919 1.37441 3.71736 1.06423 4.02973C0.754051 4.3421 0.531326 4.73044 0.418333 5.15591C0 6.72591 0 10.0009 0 10.0009C0 10.0009 0 13.2759 0.418333 14.8459C0.531322 15.2715 0.754146 15.66 1.06449 15.9724C1.37484 16.2848 1.76181 16.5101 2.18667 16.6259C3.74583 17.0467 10 17.0467 10 17.0467C10 17.0467 16.2542 17.0467 17.8142 16.6259C18.2391 16.5102 18.6261 16.2849 18.9364 15.9724C19.2468 15.66 19.4696 15.2716 19.5825 14.8459C20 13.2759 20 10.0009 20 10.0009C20 10.0009 20 6.72591 19.5817 5.15591ZM7.95417 12.9742V7.02758L13.1817 10.0009L7.95417 12.9742Z" fill="currentColor" /></svg>
  );
}

/** Facebook */
export function FacebookIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M7.58417 19.7429V13.0929H5.5225V10.0371H7.58417V8.72044C7.58417 5.31628 9.12417 3.73878 12.4658 3.73878C12.8 3.73878 13.2617 3.77378 13.6892 3.82461C14.0094 3.85756 14.327 3.91185 14.64 3.98711V6.75794C14.4591 6.74107 14.2775 6.73106 14.0958 6.72794C13.8923 6.72266 13.6886 6.72016 13.485 6.72044C12.8958 6.72044 12.4358 6.80044 12.0892 6.97794C11.8561 7.09487 11.6602 7.27434 11.5233 7.49628C11.3083 7.84628 11.2117 8.32544 11.2117 8.95627V10.0371H14.4775L14.1558 11.7896L13.9167 13.0929H11.2117V19.9638C16.1633 19.3654 20 15.1496 20 10.0371C20 4.51461 15.5225 0.0371094 10 0.0371094C4.4775 0.0371094 0 4.51461 0 10.0371C0 14.7271 3.22833 18.6621 7.58417 19.7429Z" fill="currentColor" /></svg>
  );
}

/** Instagram */
export function InstagramIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M5.8584 0.070014C4.7944 0.120181 4.06782 0.290014 3.43257 0.539514C2.77523 0.795764 2.21798 1.13951 1.66357 1.69593C1.10923 2.25235 0.767735 2.80993 0.513401 3.46843C0.267235 4.10493 0.100401 4.83218 0.0534013 5.89676C0.00640132 6.96135 -0.00401534 7.3036 0.00123466 10.0193C0.00640132 12.7348 0.0184013 13.0752 0.0699847 14.142C0.120818 15.2058 0.289985 15.9322 0.539568 16.5676C0.796235 17.225 1.13957 17.782 1.69623 18.3366C2.25282 18.8912 2.80998 19.2318 3.46998 19.4866C4.10598 19.7324 4.8334 19.9 5.89782 19.9466C6.96223 19.9933 7.30482 20.0041 10.0197 19.9988C12.7345 19.9937 13.0763 19.9816 14.1428 19.931C15.2095 19.8804 15.932 19.71 16.5677 19.4616C17.2251 19.2044 17.7825 18.8616 18.3367 18.3048C18.8908 17.748 19.2321 17.19 19.4862 16.5312C19.7326 15.8952 19.9001 15.1678 19.9462 14.1042C19.9929 13.0368 20.0039 12.696 19.9987 9.98085C19.9935 7.2656 19.9812 6.92518 19.9307 5.85876C19.8801 4.79235 19.7107 4.06818 19.4612 3.43235C19.2042 2.77493 18.8612 2.21835 18.3049 1.66335C17.7485 1.10835 17.19 0.767347 16.5315 0.513764C15.895 0.267514 15.1681 0.099764 14.1037 0.053764C13.0392 0.00776399 12.6967 -0.00415268 9.98082 0.00118066C7.26499 0.00634732 6.92498 0.018014 5.8584 0.070014ZM5.97523 18.1476C5.00023 18.1052 4.47082 17.9432 4.11798 17.8076C3.65082 17.6276 3.31798 17.41 2.9664 17.0618C2.61473 16.7136 2.39882 16.3796 2.2164 15.9134C2.0794 15.5606 1.9144 15.0318 1.86882 14.0568C1.81923 13.003 1.80882 12.6866 1.80298 10.0168C1.79715 7.34701 1.8074 7.03093 1.85357 5.97676C1.89523 5.0026 2.05823 4.4726 2.19357 4.11993C2.37357 3.65218 2.5904 3.31993 2.9394 2.9686C3.2884 2.61718 3.6214 2.40076 4.08798 2.21835C4.44048 2.08076 4.96923 1.91718 5.94382 1.87076C6.9984 1.82076 7.3144 1.81076 9.98382 1.80493C12.6532 1.7991 12.9701 1.8091 14.0251 1.8556C14.9992 1.89793 15.5295 2.05935 15.8817 2.1956C16.3491 2.3756 16.6817 2.59176 17.0331 2.94143C17.3845 3.29093 17.6011 3.62276 17.7835 4.09035C17.9212 4.44176 18.0849 4.97035 18.1309 5.9456C18.1811 7.00018 18.1925 7.31643 18.1972 9.9856C18.2021 12.6548 18.1926 12.9718 18.1464 14.0256C18.1039 15.0006 17.9422 15.5302 17.8064 15.8834C17.6264 16.3504 17.4095 16.6834 17.0602 17.0346C16.7111 17.3858 16.3785 17.6022 15.9117 17.7846C15.5597 17.922 15.0302 18.086 14.0565 18.1324C13.0018 18.182 12.6858 18.1924 10.0154 18.1983C7.34499 18.2041 7.02982 18.1933 5.97523 18.1476ZM14.1275 4.65535C14.1279 4.89271 14.1987 5.12462 14.3309 5.32174C14.4631 5.51887 14.6508 5.67237 14.8702 5.76281C15.0897 5.85326 15.331 5.87659 15.5637 5.82986C15.7965 5.78313 16.0101 5.66843 16.1776 5.50028C16.3451 5.33213 16.459 5.11807 16.5049 4.88518C16.5507 4.6523 16.5265 4.41104 16.4352 4.19193C16.344 3.97282 16.1898 3.7857 15.9921 3.65423C15.7945 3.52276 15.5623 3.45285 15.325 3.45335C15.0068 3.45401 14.7019 3.581 14.4774 3.80641C14.2528 4.03181 14.127 4.33717 14.1275 4.65535ZM4.8654 10.01C4.87098 12.846 7.17423 15.1398 10.0096 15.1344C12.8451 15.129 15.1404 12.826 15.1351 9.99001C15.1297 7.15401 12.8259 4.8596 9.99007 4.86518C7.15423 4.87076 4.86007 7.17435 4.8654 10.01ZM6.66665 10.0064C6.66535 9.34717 6.85957 8.70232 7.22476 8.15343C7.58994 7.60455 8.10969 7.17628 8.71827 6.92279C9.32685 6.66929 9.99694 6.60195 10.6438 6.72929C11.2906 6.85662 11.8852 7.17291 12.3523 7.63815C12.8194 8.1034 13.1381 8.6967 13.268 9.34304C13.3979 9.98939 13.3332 10.6597 13.0821 11.2693C12.831 11.8789 12.4048 12.4003 11.8574 12.7677C11.31 13.1351 10.6659 13.3319 10.0067 13.3332C9.56889 13.3341 9.13524 13.2488 8.73046 13.0821C8.32568 12.9154 7.95771 12.6706 7.64755 12.3617C7.33739 12.0527 7.09113 11.6857 6.92282 11.2816C6.75452 10.8775 6.66747 10.4442 6.66665 10.0064Z" fill="currentColor" /></svg>
  );
}

/** Telegram */
export function TelegramIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M9.95333 2.72223e-05C7.30926 0.0123664 4.7777 1.07138 2.91241 2.94541C1.04713 4.81944 -2.87909e-05 7.35593 5.93696e-10 10C5.937e-10 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9465 7.34784 20 10 20C12.6522 20 15.1957 18.9465 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34786 18.9464 4.80432 17.0711 2.92896C15.1957 1.0536 12.6522 2.72223e-05 10 2.72223e-05C9.98444 -9.07409e-06 9.96889 -9.07409e-06 9.95333 2.72223e-05ZM14.0883 6.02003C14.1717 6.01836 14.3558 6.03919 14.4758 6.13669C14.5556 6.20594 14.6064 6.30259 14.6183 6.40753C14.6317 6.48503 14.6483 6.66253 14.635 6.80086C14.485 8.38253 13.8333 12.2192 13.5017 13.99C13.3617 14.74 13.0858 14.9909 12.8183 15.015C12.2383 15.0692 11.7975 14.6317 11.235 14.2634C10.355 13.6859 9.8575 13.3267 9.00333 12.7634C8.01583 12.1134 8.65583 11.755 9.21833 11.1717C9.36583 11.0184 11.9242 8.69086 11.9742 8.48003C11.98 8.45336 11.9858 8.35503 11.9275 8.30336C11.8692 8.25169 11.7825 8.26919 11.72 8.28336C11.6317 8.30336 10.2258 9.23336 7.5025 11.0709C7.1025 11.3459 6.74167 11.4792 6.4175 11.4709C6.06083 11.4642 5.37417 11.27 4.86333 11.1042C4.23667 10.9 3.73917 10.7925 3.7825 10.4467C3.805 10.2667 4.05333 10.0825 4.52667 9.89419C7.44167 8.62419 9.385 7.78669 10.3583 7.38253C13.135 6.22753 13.7125 6.02669 14.0883 6.02003Z" fill="currentColor" /></svg>
  );
}

/** Quora */
export function QuoraIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M6.14961 0.791156C8.19874 -0.0582841 10.4726 -0.200035 12.6114 0.38834C14.7501 0.976714 16.6316 2.2616 17.9579 4.03963C19.2842 5.81765 19.9796 7.98724 19.934 10.205C19.8885 12.4227 19.1046 14.5619 17.7064 16.284L19.7144 18.3027C20.3245 18.9162 19.8894 19.9615 19.025 19.9615L10.0996 19.9698C10.0152 19.9708 9.93072 19.9708 9.84628 19.9698H9.82961C7.53569 19.9377 5.32302 19.1155 3.56487 17.6417C1.80671 16.1679 0.61067 14.1328 0.178498 11.8798C-0.253673 9.62668 0.104475 7.29349 1.19253 5.27377C2.28058 3.25405 4.03195 1.67141 6.1512 0.792823L6.14961 0.791156ZM12.251 4.48116C11.5241 4.17007 10.7426 4.00634 9.95186 3.99945C9.16115 3.99257 8.37694 4.14266 7.64466 4.44104C6.91238 4.73943 6.24659 5.18016 5.68586 5.73771C5.12514 6.29525 4.68064 6.95853 4.37811 7.68911C4.07558 8.41969 3.92104 9.20304 3.92343 9.99377C3.92583 10.7845 4.08513 11.5669 4.39208 12.2956C4.69904 13.0244 5.14756 13.6849 5.71166 14.2391C6.27575 14.7932 6.9442 15.2299 7.67828 15.5238C9.13913 16.112 10.7731 16.0999 12.225 15.49C13.677 14.8801 14.8295 13.7218 15.4321 12.2669C16.0348 10.8119 16.0387 9.17788 15.4432 7.71999C14.8477 6.2621 13.7008 5.09818 12.2519 4.48124L12.251 4.48116Z" fill="currentColor" /></svg>
  );
}

/** WhatsApp */
export function WhatsAppIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" {...props}><path d="M14.5594 11.985C14.3119 11.8609 13.0944 11.2625 12.8677 11.1792C12.6402 11.0967 12.4752 11.0559 12.3094 11.3042C12.1452 11.5517 11.6702 12.1092 11.526 12.2742C11.3819 12.44 11.2369 12.46 10.9894 12.3367C10.7419 12.2117 9.94354 11.9509 8.99771 11.1075C8.26188 10.4509 7.76438 9.64003 7.62021 9.3917C7.47604 9.1442 7.60521 9.01003 7.72854 8.8867C7.84021 8.77587 7.97687 8.59753 8.10021 8.45337C8.22437 8.30837 8.26521 8.20503 8.34854 8.0392C8.43104 7.8742 8.39021 7.73003 8.32771 7.60587C8.26521 7.4817 7.77021 6.26253 7.56437 5.7667C7.36271 5.2842 7.15854 5.35003 7.00688 5.3417C6.86271 5.33503 6.69771 5.33337 6.53188 5.33337C6.36687 5.33337 6.09854 5.39503 5.87187 5.64337C5.64521 5.89087 5.00521 6.49003 5.00521 7.7092C5.00521 8.92753 5.89271 10.105 6.01604 10.2709C6.14021 10.4359 7.76271 12.9375 10.2469 14.01C10.8377 14.265 11.2985 14.4175 11.6585 14.5309C12.2519 14.72 12.7919 14.6934 13.2177 14.6292C13.6935 14.5584 14.6827 14.03 14.8894 13.4517C15.096 12.8734 15.096 12.3775 15.0335 12.2742C14.9719 12.1709 14.8077 12.1092 14.5594 11.985ZM10.041 18.1542H10.0377C8.56252 18.1543 7.11444 17.7577 5.84521 17.0059L5.54437 16.8275L2.42688 17.6459L3.25854 14.6059L3.06271 14.2942C2.23807 12.9811 1.80183 11.4614 1.80437 9.91087C1.80521 5.3692 5.50104 1.6742 10.0444 1.6742C12.2444 1.6742 14.3127 2.53253 15.8677 4.0892C16.6349 4.85305 17.2431 5.76147 17.6569 6.7619C18.0707 7.76233 18.282 8.8349 18.2785 9.91753C18.276 14.4592 14.581 18.1542 10.041 18.1542ZM17.0519 2.9067C16.1337 1.98247 15.0412 1.24965 13.8378 0.750701C12.6343 0.251754 11.3438 -0.00339687 10.041 3.4148e-05C4.57854 3.4148e-05 0.132708 4.44587 0.130208 9.91003C0.130208 11.6567 0.586042 13.3617 1.45354 14.8642L0.046875 20L5.30104 18.6217C6.75403 19.4133 8.38224 19.8282 10.0369 19.8284H10.041C15.5027 19.8284 19.9494 15.3825 19.9519 9.91753C19.9559 8.61526 19.7017 7.32512 19.2039 6.12173C18.7061 4.91834 17.9747 3.82559 17.0519 2.9067Z" fill="currentColor" /></svg>
  );
}

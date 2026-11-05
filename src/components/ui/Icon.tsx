import { cx } from "@/lib/cx";

/** The design's line icons (Figma "icon/ur", "icon/l", "icon/r", plus, "icon/minus", and the header's 16px phone). */
const ICONS = {
  "arrow-ur": "/images/icons/arrow-ur.svg",
  "arrow-l": "/images/icons/arrow-l.svg",
  "arrow-r": "/images/icons/arrow-r.svg",
  plus: "/images/icons/plus.svg",
  minus: "/images/icons/minus.svg",
  phone: "/images/icons/phone.svg",
} as const;

export type IconName = keyof typeof ICONS;

/**
 * One of the design's icons, painted in the current text colour: the SVG is used as a mask, so the same
 * file serves the white arrow in a dark disc and the dark arrow in a light one. Decoration only.
 */
export default function Icon({ name, className }: { name: IconName; className?: string }) {
  const mask = `url(${ICONS[name]}) center / contain no-repeat`;
  return <span aria-hidden="true" className={cx("block size-3.5 shrink-0 bg-current", className)} style={{ mask, WebkitMask: mask }} />;
}

import { ChatLines, NavArrowRight, Phone, Play } from "iconoir-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * The site's call-to-action buttons, after the design's "Buttons · sizes S / M / L · with icons"
 * (3764:42634): rounded rectangles with an Iconoir icon.
 * - primary: tangerine with a white label, a faint light line along the top edge and a chevron after the label.
 * - secondary: white with a madder (brand 700) edge and label, and a phone before the label.
 * The icon sits on the side with the smaller padding.
 */
export type ButtonTone = "primary" | "secondary";
type ButtonSize = "s" | "m";

/**
 * The icons a button can carry, each with its side and stroke. The chevron's stroke is heavier, as in
 * the design (1.6px at 16px); the others keep Iconoir's own 1.5 on its 24px grid.
 */
const ICONS = {
  arrow: { Icon: NavArrowRight, end: true, stroke: 2.4 },
  phone: { Icon: Phone, end: false, stroke: 1.5 },
  chat: { Icon: ChatLines, end: false, stroke: 1.5 },
  play: { Icon: Play, end: true, stroke: 1.5 },
};
type ButtonIcon = keyof typeof ICONS;

/** "s" is the design's 40px button and "m" its 48px one; `near` is the padding on the icon's side and `far` the other. */
const SIZE = {
  s: { box: "h-10 gap-1.5 rounded-[6px] text-[14px]/[20px]", icon: 16, near: 12, far: 16 },
  m: { box: "h-12 gap-2 rounded-[8px] text-[16px]/[20px]", icon: 18, near: 16, far: 20 },
};

const TONE = {
  primary:
    "bg-tangerine text-white shadow-[inset_0_1px_1px_rgb(255_255_255/0.25)] hover:bg-mango",
  secondary: "border border-brand-700 bg-white text-brand-700 hover:bg-brand-50",
};

/** Each tone's own icon: the chevron after the primary label, the phone before the secondary one. */
const DEFAULT_ICON: Record<ButtonTone, ButtonIcon> = { primary: "arrow", secondary: "phone" };

type ButtonProps = {
  href: string;
  children: ReactNode;
  tone?: ButtonTone;
  size?: ButtonSize;
  /** Overrides the tone's own icon; `false` leaves it out. */
  icon?: ButtonIcon | false;
  className?: string;
};

/** A link styled as the site's call-to-action button. */
export function Button({ href, children, tone = "primary", size = "m", icon = DEFAULT_ICON[tone], className }: ButtonProps) {
  const { box, icon: px, near, far } = SIZE[size];
  const glyph = icon && ICONS[icon];
  const mark = glyph && (
    <glyph.Icon
      aria-hidden="true"
      width={px}
      height={px}
      strokeWidth={glyph.stroke}
      className={cx(icon === "arrow" && "transition-transform duration-300 ease-smooth group-hover/btn:translate-x-[3px]")}
    />
  );
  return (
    <a
      href={href}
      className={cx(
        "group/btn inline-flex shrink-0 items-center font-display font-semibold whitespace-nowrap transition-[background-color,scale] duration-150 active:scale-98",
        box,
        TONE[tone],
        className,
      )}
      style={{ paddingLeft: glyph && !glyph.end ? near : far, paddingRight: glyph && glyph.end ? near : far }}
    >
      {glyph && !glyph.end && mark}
      {children}
      {glyph && glyph.end && mark}
    </a>
  );
}

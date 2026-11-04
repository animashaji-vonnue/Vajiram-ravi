import type { ReactNode } from "react";
import { ArrowRightLgIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

/** Smooth icon movement used for the little hover nudges on arrows and chevrons. */
export const NUDGE = "transition-transform duration-300 ease-smooth";

/**
 * The site's call-to-action buttons, the "Kangura inset line" set in the design: a stepped shape (each
 * corner cut in two 5px steps) with a thin saffron line 4px inside it, a label and an arrow.
 * - primary: madder with a white label and arrow.
 * - secondary: white with a madder edge, the same saffron line, and a madder label and arrow.
 * Every layer is the same stepped outline cut from its own box, so the steps and the line keep their
 * size whatever the label.
 */
export type ButtonTone = "primary" | "secondary";

/** The stepped outline: the union of a tall, a middle and a wide rectangle, `deep` and `step` px in from the edges. */
export function stepped(deep: number, step: number): string {
  const d = `${deep}px`;
  const s = `${step}px`;
  const far = (n: string) => `calc(100% - ${n})`;
  return `polygon(${d} 0, ${far(d)} 0, ${far(d)} ${s}, ${far(s)} ${s}, ${far(s)} ${d}, 100% ${d}, 100% ${far(d)}, ${far(s)} ${far(d)}, ${far(s)} ${far(s)}, ${far(d)} ${far(s)}, ${far(d)} 100%, ${d} 100%, ${d} ${far(s)}, ${s} ${far(s)}, ${s} ${far(d)}, 0 ${far(d)}, 0 ${d}, ${s} ${d}, ${s} ${s}, ${d} ${s})`;
}

const BASE =
  "group/btn relative inline-flex shrink-0 cursor-pointer items-center justify-center font-display font-semibold whitespace-nowrap transition-[scale] duration-150 active:scale-98 focus-visible:rounded-[6px]";

/**
 * "md" is the design's 56px button; "sm" a 44px one for tight spots; "nav" the header's 48px
 * "Let's talk", with smaller 4px steps and a 1px line 4px in; "xs" the 40px "View all" kind, with 3px
 * steps and a 1px line 3px in. `line` and `fill` are the insets of the saffron line and of the fill inside it.
 */
const SIZE = {
  md: { box: "h-14 gap-3 px-[30px] text-[16px]/[24px]", shape: stepped(10, 5), line: "inset-1", fill: "inset-[5px]" },
  sm: { box: "h-11 gap-2 px-5 text-[15px]/[22px]", shape: stepped(10, 5), line: "inset-1", fill: "inset-[5px]" },
  nav: { box: "h-12 gap-2.5 px-6 text-[15px]/[24px]", shape: stepped(8, 4), line: "inset-1", fill: "inset-[5px]" },
  xs: { box: "h-10 gap-2 px-[18px] text-[14px]/[20px]", shape: stepped(6, 3), line: "inset-[3px]", fill: "inset-1" },
};
const ARROW_SIZE: Record<ButtonSize, number> = { md: 20, sm: 18, nav: 18, xs: 16 };
type ButtonSize = keyof typeof SIZE;

const LABEL: Record<ButtonTone, string> = { primary: "text-white", secondary: "text-brand-700" };

/** The stepped layers, from the outside in: the madder edge, the white body (secondary), the saffron line and the fill. */
function Layers({ tone, size }: { tone: ButtonTone; size: ButtonSize }) {
  const { shape, line, fill: fillInset } = SIZE[size];
  const fill =
    tone === "primary"
      ? "bg-brand-700 group-hover/btn:bg-brand-800"
      : "bg-white group-hover/btn:bg-brand-50";
  const layer = (inset: string, colour: string) => (
    <span className={cx("absolute transition-colors duration-200", inset, colour)} style={{ clipPath: shape }} />
  );
  return (
    <span aria-hidden="true">
      {layer("inset-0", "bg-brand-700")}
      {tone === "secondary" && layer("inset-[2px]", fill)}
      {layer(line, "bg-brand-300")}
      {layer(fillInset, fill)}
    </span>
  );
}

const ARROW = cx("relative", NUDGE, "group-hover/btn:translate-x-[3px]");

type ButtonProps = {
  href: string;
  children: ReactNode;
  tone?: ButtonTone;
  size?: ButtonSize;
  /** The arrow after the label; on by default. */
  arrow?: boolean;
  /** An icon to show after the label in place of the arrow, e.g. a play symbol. */
  icon?: ReactNode;
  className?: string;
};

/** A link styled as the site's call-to-action button, with its arrow after the label. */
export function Button({ href, children, tone = "primary", size = "md", arrow = true, icon, className }: ButtonProps) {
  return (
    <a href={href} className={cx(BASE, SIZE[size].box, LABEL[tone], className)}>
      <Layers tone={tone} size={size} />
      <span className="relative">{children}</span>
      {icon ? (
        <span className={cx(ARROW, "flex")}>{icon}</span>
      ) : (
        arrow && <ArrowRightLgIcon className={ARROW} width={ARROW_SIZE[size]} height={ARROW_SIZE[size]} />
      )}
    </a>
  );
}

type IconButtonProps = { href: string; /** Read out in place of a visible label, e.g. "Enrol now". */ label: string; tone?: ButtonTone; className?: string };

/** The 56 × 56 arrow-only version, e.g. for carousel arrows or "see more". */
export function IconButton({ href, label, tone = "primary", className }: IconButtonProps) {
  return (
    <a href={href} aria-label={label} className={cx(BASE, "size-14", LABEL[tone], className)}>
      <Layers tone={tone} size="md" />
      <ArrowRightLgIcon className={ARROW} />
    </a>
  );
}

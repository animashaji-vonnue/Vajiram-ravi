import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/*
 * The ornaments of the design (Figma components "Ornament / Eyebrow · centred" 2104:3616, "Ornament /
 * Eyebrow · left" 2104:3626, "Ornament / Flourish" and "Ornament / Butta (block-print)"). All are
 * decoration around real text, so the drawings are hidden from assistive technology and only the label is
 * read.
 *
 * The eyebrows take part in the section reveal (motion spec, "Eyebrow ornament"): their side rules grow
 * out from the label and the diamonds at their ends arrive as they finish, 400ms, once. Pass
 * `reveal={false}` for an eyebrow that is on screen at load or animated by its section. On the burnt and
 * orange bands the design draws the ornaments and label in cream: `tone="dark"`.
 */

/** The ornament files: orange as drawn on papers, cream on the burnt and orange bands. */
const ART = {
  light: { butta: "/images/ornaments/butta.svg", lead: "/images/ornaments/eyebrow-line-lead.svg", trail: "/images/ornaments/eyebrow-line-trail.svg", label: "text-orange" },
  dark: {
    butta: "/images/ornaments/butta-cream.svg",
    lead: "/images/ornaments/eyebrow-line-lead-cream.svg",
    trail: "/images/ornaments/eyebrow-line-trail-cream.svg",
    label: "text-cream",
  },
} as const;

/** The small uppercase label above a heading, in Geist Mono. */
const LABEL = "font-mono text-[12px]/[normal] tracking-[0.72px] whitespace-nowrap";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
  /** "light" (orange, on papers) or "dark" (cream ornaments and label, on the burnt and orange bands). */
  tone?: keyof typeof ART;
  /** Overrides the label colour, e.g. "text-saffron". */
  labelClassName?: string;
  reveal?: boolean;
};

/** Centred eyebrow: a diamond-and-rule on each side of the label. */
export function EyebrowCentred({ children, className, tone = "light", labelClassName, reveal = true }: EyebrowProps) {
  const art = ART[tone];
  return (
    <div data-reveal={reveal ? "eyebrow" : undefined} className={cx("flex items-center gap-2.5", className)}>
      <img
        src={art.lead}
        alt=""
        aria-hidden="true"
        width={84}
        height={8}
        data-eyebrow-rule="lead"
        className="h-2 w-21 shrink-0"
      />
      <p className={cx(LABEL, labelClassName ?? art.label)}>{children}</p>
      <img src={art.trail} alt="" aria-hidden="true" width={84} height={8} data-eyebrow-rule="trail" className="h-2 w-21 shrink-0" />
    </div>
  );
}

/** Left eyebrow: the block-print butta, the label, then a rule ending in a diamond. */
export function EyebrowLeft({ children, className, tone = "light", labelClassName, reveal = true }: EyebrowProps) {
  const art = ART[tone];
  return (
    <div data-reveal={reveal ? "eyebrow" : undefined} className={cx("flex items-center gap-2.5", className)}>
      <Butta tone={tone} />
      <p className={cx(LABEL, labelClassName ?? art.label)}>{children}</p>
      <img src={art.trail} alt="" aria-hidden="true" width={84} height={8} data-eyebrow-rule="trail" className="h-2 w-21 shrink-0" />
    </div>
  );
}

/** The four-petal block-print motif, 14px. */
export function Butta({ className, tone = "light" }: { className?: string; tone?: keyof typeof ART }) {
  return <img src={ART[tone].butta} alt="" aria-hidden="true" width={14} height={14} className={cx("size-3.5 shrink-0", className)} />;
}

/** The scrolling flourish under a centred heading, 140 × 32. */
export function Flourish({ className }: { className?: string }) {
  return <img src="/images/ornaments/flourish.svg" alt="" aria-hidden="true" width={140} height={32.2} className={cx("h-[32.2px] w-35 shrink-0", className)} />;
}

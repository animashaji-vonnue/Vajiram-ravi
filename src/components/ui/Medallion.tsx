import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/*
 * The arrow medallion: the page-wide signal for "this is clickable", now the arrow alone in the colour of
 * its label (the client took out the circle behind it). The tones are kept for the callers.
 * While any `group/medal` ancestor is hovered the arrow nudges 2px forward. Not with reduced motion. Decoration only: hidden from assistive technology.
 */

/** The arrow's nudge on hover. */
const NUDGE =
  "[transition:translate_var(--dur-fast)_var(--ease-out)] group-hover/medal:translate-x-[2px] motion-reduce:transition-none";

/** The arrow, drawn on the 30px box (the 26px medallion is the same drawing, scaled). */
const ARROW = "M9.23077 15H19.6154M15.5769 19.0385L19.6154 15L15.5769 10.9615";

/** The colourways: disc and arrow. */
const TONES = {
  cream: { disc: "#FFF8EC", mark: "#CC5500" },
  /** The arrow alone, cream, without a disc. */
  bare: { disc: "transparent", mark: "#FFF8EC" },
  saffron: { disc: "#F4C430", mark: "#2A1A12" },
  ink: { disc: "#2A1A12", mark: "#F4C430" },
  burnt: { disc: "#CC5500", mark: "#FFF8EC" },
} as const;

export type MedallionTone = keyof typeof TONES;

type MedallionProps = {
  tone: MedallionTone;
  /** 30 on large buttons, 26 on medium buttons and links. */
  size?: number;
  /** Links: pressing nudges the arrow 5px right (buttons press as a whole instead). */
  pressNudge?: boolean;
  /** An icon in place of the arrow. */
  children?: ReactNode;
  className?: string;
};

export default function Medallion({ tone, size = 30, pressNudge = false, children, className }: MedallionProps) {
  void TONES[tone];
  return (
    <span aria-hidden="true" className={cx("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 30 30" width={size} height={size} className="absolute inset-0 overflow-visible" fill="none">
        {!children && (
          <path
            d={ARROW}
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className={cx(NUDGE, pressNudge && "group-active/medal:translate-x-[5px]")}
          />
        )}
      </svg>
      {children && <span className="absolute inset-0 flex items-center justify-center">{children}</span>}
    </span>
  );
}

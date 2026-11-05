import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/*
 * The scalloped arrow medallion (Figma "Arrow medallion" in "CTA / Indian", 2262:5786): the page-wide
 * signal for "this is clickable". Its two layers are drawn from the design's own paths, inline, because
 * the motion spec moves them apart: on hover of any `group/medal` ancestor the scallop turns 30° while the
 * arrow slides 3px right. Decoration only: hidden from assistive technology.
 */

/** The design's 30px scallop and arrow paths (the 26px medallion is the same drawing, scaled). */
const SCALLOP =
  "M30 15L29.92 15.78L29.68 16.54L29.29 17.26L28.79 17.93L28.2 18.54L27.55 19.08L27.76 19.9L27.88 20.73L27.9 21.57L27.78 22.38L27.53 23.14L27.14 23.82L26.61 24.4L25.97 24.88L25.23 25.23L24.43 25.48L23.6 25.62L22.76 25.68L22.44 26.46L22.05 27.21L21.57 27.9L21 28.48L20.35 28.95L19.64 29.27L18.87 29.43L18.07 29.44L17.26 29.29L16.47 29.02L15.72 28.65L15 28.2L14.28 28.65L13.53 29.02L12.74 29.29L11.93 29.44L11.13 29.43L10.36 29.27L9.65 28.95L9 28.48L8.43 27.9L7.95 27.21L7.56 26.46L7.24 25.68L6.4 25.62L5.57 25.48L4.77 25.23L4.03 24.88L3.39 24.4L2.86 23.82L2.47 23.14L2.22 22.38L2.1 21.57L2.12 20.73L2.24 19.9L2.45 19.08L1.8 18.54L1.21 17.93L0.71 17.26L0.32 16.54L0.08 15.78L0 15L0.08 14.22L0.32 13.46L0.71 12.74L1.21 12.07L1.8 11.46L2.45 10.92L2.24 10.1L2.12 9.27L2.1 8.43L2.22 7.62L2.47 6.86L2.86 6.18L3.39 5.6L4.03 5.12L4.77 4.77L5.57 4.52L6.4 4.38L7.24 4.32L7.56 3.54L7.95 2.79L8.43 2.1L9 1.52L9.65 1.05L10.36 0.73L11.13 0.57L11.93 0.56L12.74 0.71L13.53 0.98L14.28 1.35L15 1.8L15.72 1.35L16.47 0.98L17.26 0.71L18.07 0.56L18.87 0.57L19.64 0.73L20.35 1.05L21 1.52L21.57 2.1L22.05 2.79L22.44 3.54L22.76 4.32L23.6 4.38L24.43 4.52L25.23 4.77L25.97 5.12L26.61 5.6L27.14 6.18L27.53 6.86L27.78 7.62L27.9 8.43L27.88 9.27L27.76 10.1L27.55 10.92L28.2 11.46L28.79 12.07L29.29 12.74L29.68 13.46L29.92 14.22L30 15Z";
const ARROW = "M9.23077 15H19.6154M15.5769 19.0385L19.6154 15L15.5769 10.9615";

/** The design's three colourways: scallop and arrow. */
const TONES = {
  saffron: { scallop: "#F4C430", mark: "#2A1A12" },
  ink: { scallop: "#2A1A12", mark: "#F4C430" },
  burnt: { scallop: "#CC5500", mark: "#FFF8EC" },
} as const;

export type MedallionTone = keyof typeof TONES;

type MedallionProps = {
  tone: MedallionTone;
  /** 30 on large buttons, 26 on medium buttons and links. */
  size?: number;
  /** Links: pressing nudges the arrow 5px right (buttons press as a whole instead). */
  pressNudge?: boolean;
  /** An icon in place of the arrow (the contact cards). It stays still while the scallop turns. */
  children?: ReactNode;
  className?: string;
};

export default function Medallion({ tone, size = 30, pressNudge = false, children, className }: MedallionProps) {
  const colours = TONES[tone];
  return (
    <span aria-hidden="true" className={cx("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 30 30" width={size} height={size} className="absolute inset-0 overflow-visible" fill="none">
        <path
          d={SCALLOP}
          fill={colours.scallop}
          className="origin-center [transform-box:fill-box] [transition:rotate_var(--dur-fast)_var(--ease-out)] group-hover/medal:rotate-30"
        />
        {!children && (
          <path
            d={ARROW}
            stroke={colours.mark}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className={cx(
              "[transition:translate_var(--dur-fast)_var(--ease-out)] group-hover/medal:translate-x-[3px]",
              pressNudge && "group-active/medal:translate-x-[5px]",
            )}
          />
        )}
      </svg>
      {children && <span className="absolute inset-0 flex items-center justify-center">{children}</span>}
    </span>
  );
}

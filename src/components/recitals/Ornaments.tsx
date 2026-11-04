import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/cx";

/*
 * The Recitals — ornament kit.
 *
 * The rule these follow: density belongs in borders, seams and margins, never in the
 * reading area. Every motif here is one unit repeated, drawn as vector so it stays crisp
 * and takes its colour from props rather than from a baked image.
 */

/** Wraps a raw SVG tile as a CSS url() so it can tile with background-repeat. */
function svgUrl(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}")`;
}

type MarkProps = { className?: string; size?: number };

/** Four-petal flower. The page's full stop: separators, eyebrows, corners. */
export function FlowerMark({ className, size = 12 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M12 2.5C13.9 7 17 10.1 21.5 12 17 13.9 13.9 17 12 21.5 10.1 17 7 13.9 2.5 12 7 10.1 10.1 7 12 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Lozenge. Sits at card corners and inside rules. */
export function DiamondMark({ className, size = 8 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path d="M6 0 12 6 6 12 0 6Z" fill="currentColor" />
    </svg>
  );
}

/** The double danda, the full stop of Devanagari verse. Used to close a section heading. */
export function DandaMark({ className, size = 16 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path d="M5 1.5V14.5M11 1.5V14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Manuscript rule. A hairline pair broken by a centred mark, the way a printed page
 * separates a colophon from the text. Replaces the plain divider lines, which read as
 * generated rather than designed.
 */
export function Rule({ className, tone = "line" }: { className?: string; tone?: "line" | "accent" }) {
  const stroke = tone === "accent" ? "bg-r-orange/35" : "bg-r-line";
  const mark = tone === "accent" ? "text-r-orange" : "text-r-amber";
  return (
    <div className={cx("flex items-center gap-3", className)} role="presentation">
      <span className={cx("h-px flex-1", stroke)} />
      <span className={cx("flex items-center gap-1.5", mark)}>
        <DiamondMark size={5} />
        <FlowerMark size={11} />
        <DiamondMark size={5} />
      </span>
      <span className={cx("h-px flex-1", stroke)} />
    </div>
  );
}

/**
 * Double-rule frame, the border of a manuscript page: an outer hairline, a gap, then an
 * inner hairline. Applied to cards so the density lives on the edge and the content stays calm.
 */
export const doubleRule =
  "relative shadow-[inset_0_0_0_1px_var(--color-r-line),inset_0_0_0_4px_var(--color-r-paper),inset_0_0_0_5px_var(--color-r-line)]";

/* --------------------------------------------------------------------------------------
 * Seam bands — the join between two sections.
 *
 * Each band is one tile repeated across the page. The section above supplies `from` and the
 * section below supplies `to`, so the upper colour dissolves into the lower one through the
 * motif instead of stopping at a straight line.
 * ------------------------------------------------------------------------------------ */

export type SeamVariant = "perf" | "toran" | "jali" | "border";

type SeamTile = { w: number; h: number; svg: (from: string, to: string, accent: string) => string };

const SEAM_TILES: Record<SeamVariant, SeamTile> = {
  /** Stamp perforation: circular bites punched out of the upper colour. */
  perf: {
    w: 40,
    h: 56,
    svg: (from, to, accent) => `
      <svg xmlns='http://www.w3.org/2000/svg' width='40' height='56'>
        <rect width='40' height='56' fill='${to}'/>
        <path d='M0 0 H40 V30 H29 A9 9 0 0 0 11 30 H0 Z' fill='${from}'/>
        <circle cx='20' cy='41' r='2' fill='${accent}'/>
      </svg>`,
  },
  /** Toran: mango leaves hung from a rail, the garland over a doorway. */
  toran: {
    w: 48,
    h: 56,
    svg: (from, to, accent) => `
      <svg xmlns='http://www.w3.org/2000/svg' width='48' height='56'>
        <rect width='48' height='56' fill='${to}'/>
        <path d='M0 0 H48 V18 H42 C40 34 32 42 24 46 C16 42 8 34 6 18 H0 Z' fill='${from}'/>
        <circle cx='24' cy='50' r='2.2' fill='${accent}'/>
      </svg>`,
  },
  /** Jali: an ogee lattice standing on the section below, open at the foot. */
  jali: {
    w: 44,
    h: 56,
    svg: (from, to, accent) => `
      <svg xmlns='http://www.w3.org/2000/svg' width='44' height='56'>
        <rect width='44' height='56' fill='${to}'/>
        <path fill-rule='evenodd' d='M0 0 H44 V56 H0 Z M22 12 C30 20 34 25 34 32 V56 H10 V32 C10 25 14 20 22 12 Z' fill='${from}'/>
        <path d='M0 7 H44' stroke='${accent}' stroke-width='1.5' opacity='.5'/>
      </svg>`,
  },
  /** Block-print border: a rule, a repeated motif, then a toothed edge, as on a sari border. */
  border: {
    w: 36,
    h: 56,
    svg: (from, to, accent) => `
      <svg xmlns='http://www.w3.org/2000/svg' width='36' height='56'>
        <rect width='36' height='56' fill='${to}'/>
        <path d='M0 0 H36 V40 L30 50 L24 40 L18 50 L12 40 L6 50 L0 40 Z' fill='${from}'/>
        <path d='M0 8 H36' stroke='${accent}' stroke-width='1.2' opacity='.55'/>
        <path d='M18 16 C20.6 20 23.8 22.4 27 23.5 23.8 24.6 20.6 27 18 31 15.4 27 12.2 24.6 9 23.5 12.2 22.4 15.4 20 18 16Z' fill='${accent}'/>
      </svg>`,
  },
};

type SeamBandProps = {
  variant?: SeamVariant;
  /** Colour of the section above and the section below. CSS colours, not Tailwind classes. */
  from: string;
  to: string;
  accent?: string;
  className?: string;
};

/** A full-width seam. Place it flush between two sections, with no margin on either side. */
export function SeamBand({ variant = "toran", from, to, accent = "#e9a23b", className }: SeamBandProps) {
  const tile = SEAM_TILES[variant];
  return (
    <div
      aria-hidden="true"
      className={cx("w-full", className)}
      style={{
        height: tile.h,
        backgroundImage: svgUrl(tile.svg(from, to, accent)),
        backgroundRepeat: "repeat-x",
        backgroundSize: `${tile.w}px ${tile.h}px`,
      }}
    />
  );
}

/* --------------------------------------------------------------------------------------
 * Surface patterns — the quiet texture under a section, never over the reading area.
 * ------------------------------------------------------------------------------------ */

export type PatternName = "jali" | "block" | "chevron";

const PATTERN_TILES: Record<PatternName, { w: number; h: number; svg: (c: string) => string }> = {
  /** A lattice screen, for wide background fields. */
  jali: {
    w: 48,
    h: 48,
    svg: (c) => `
      <svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'>
        <g fill='none' stroke='${c}' stroke-width='1.2'>
          <path d='M24 0 C34 10 38 15 38 24 C38 33 33 40 24 48 C15 40 10 33 10 24 C10 15 14 10 24 0Z'/>
          <path d='M0 24 C10 14 15 10 24 10 M48 24 C38 14 33 10 24 10'/>
        </g>
      </svg>`,
  },
  /** A block-printed field: one stamp, repeated, offset. */
  block: {
    w: 40,
    h: 40,
    svg: (c) => `
      <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'>
        <g fill='${c}'>
          <path d='M10 4 C11.6 7.2 13.8 9.4 17 11 13.8 12.6 11.6 14.8 10 18 8.4 14.8 6.2 12.6 3 11 6.2 9.4 8.4 7.2 10 4Z'/>
          <path d='M30 24 C31.6 27.2 33.8 29.4 37 31 33.8 32.6 31.6 34.8 30 38 28.4 34.8 26.2 32.6 23 31 26.2 29.4 28.4 27.2 30 24Z'/>
        </g>
      </svg>`,
  },
  /** A fine zigzag, for narrow strips and card headers. */
  chevron: {
    w: 24,
    h: 12,
    svg: (c) => `
      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='12'>
        <path d='M0 9 L6 3 L12 9 L18 3 L24 9' fill='none' stroke='${c}' stroke-width='1.4'/>
      </svg>`,
  },
};

/** Inline style for a tiling pattern. Keep `opacity` low: this sits behind content. */
export function patternStyle(name: PatternName, color: string, opacity = 1): CSSProperties {
  const tile = PATTERN_TILES[name];
  return {
    backgroundImage: svgUrl(tile.svg(color)),
    backgroundRepeat: "repeat",
    backgroundSize: `${tile.w}px ${tile.h}px`,
    opacity,
  };
}

/** The paper grain, baked once in recitals-theme.css. Drop it over any ground. */
export const grainStyle: CSSProperties = {
  backgroundImage: "var(--r-grain)",
  backgroundRepeat: "repeat",
  mixBlendMode: "multiply",
  opacity: 0.085,
};

/** Small caps label above a section heading, opened by a flower rather than a rule. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("flex items-center gap-2 font-sans text-[13px]/[18px] font-semibold tracking-[.16em] text-r-rust uppercase", className)}>
      <FlowerMark size={11} className="text-r-amber" />
      {children}
    </p>
  );
}

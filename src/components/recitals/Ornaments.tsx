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

/**
 * An eight-pointed asterisk, taken from reference image 11. Shape only — two concave
 * four-point stars, the second turned 45 degrees and set a little smaller, so the arms
 * alternate long and short the way the reference does.
 */
export function StarMark({ className, size = 12 }: MarkProps) {
  const arm =
    "M12 1.2C12.9 7.9 16.1 11.1 22.8 12 16.1 12.9 12.9 16.1 12 22.8 11.1 16.1 7.9 12.9 1.2 12 7.9 11.1 11.1 7.9 12 1.2Z";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path d={arm} fill="currentColor" />
      <path d={arm} fill="currentColor" transform="rotate(45 12 12) translate(12 12) scale(0.72) translate(-12 -12)" />
    </svg>
  );
}

/**
 * A drawn underline: one uneven stroke, so it reads as a hand marking a line under a
 * phrase rather than a border-bottom. Stretches to whatever it sits under.
 */
export function Underline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 13"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M4 8.6C31 5 59 3.3 88 3.6c30 .3 59 2.3 88 5.6"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The page’s paper, at whatever strength a section needs.
 *
 * Every section used to sit on a flat tint, which is what made the lower half of the page
 * read as a different document from the hero. One scanned sheet, multiplied in, ties them
 * together without anyone having to draw a pattern — and nothing here is ever pure white.
 */
export function SectionGround({ tint = 0.26, className }: { tint?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx("pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-multiply", className)}
      style={{ backgroundImage: "url(/recitals/section-paper.webp)", opacity: tint }}
    />
  );
}

/**
 * A wash of colour bled into a section's paper.
 *
 * The light sections had gone quiet: paper, hairlines and ink, correct and a little
 * lifeless next to a hero that is almost entirely colour. This is the cheapest way to
 * carry some of that heat through the rest of the page without putting colour anywhere
 * near the reading — a soft bloom that fades out well before it reaches a column of
 * text, and a second cooler one opposite so the ground is never flat.
 *
 * Each section places it on a different side. A bloom in the same corner five times is a
 * stamp, and the eye starts reading it as a border rather than as light.
 */
export function SectionGlow({
  at = "top right",
  tone = "#ff8a2b",
  counter = "#f4c430",
  strength = 0.45,
}: {
  at?: "top left" | "top right" | "bottom left" | "bottom right";
  tone?: string;
  counter?: string;
  strength?: number;
}) {
  const [v, h] = at.split(" ");
  const opposite = `${v === "top" ? "bottom" : "top"} ${h === "left" ? "right" : "left"}`;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        /*
         * The radii are in pixels, not percentages.
         *
         * As percentages they were read against the section's own height, and these
         * sections run 1500 to 2500px tall — so a "55%" bloom spread over more than a
         * thousand pixels and faded to nothing long before it was ever dense enough to
         * see. Raising the opacity did nothing, because the problem was the falloff, not
         * the strength. A fixed pool is the same size whatever the section's length, so
         * it reads as light falling on paper rather than as a tint nobody notices.
         */
        background: [
          `radial-gradient(900px 700px at ${at}, ${tone} 0%, transparent 72%)`,
          `radial-gradient(760px 600px at ${opposite}, ${counter} 0%, transparent 74%)`,
        ].join(","),
        opacity: strength,
      }}
    />
  );
}

/**
 * An office rubber stamp, struck in a corner.
 *
 * Indian pages are busy in a particular way: a government form, a textbook, a coaching
 * prospectus all carry marks that were added by somebody — a stamp, an initial, a
 * marginal note — on top of the printed matter. That layering is what the page has been
 * missing, and it is not the same thing as putting more words in front of a reader.
 *
 * Everything it says is true of this magazine. A stamp that claimed an endorsement, an
 * approval or a date that did not exist would be a forged mark, not an ornament.
 */
export function RubberStamp({
  className,
  size = 150,
  rotate = -13,
  tone,
}: {
  className?: string;
  size?: number;
  rotate?: number;
  /**
   * Leave this unset to take the colour from a class on the element or from its parent.
   * It must not default to "currentColor": written into the inline style it outranks any
   * utility class on the same element, so `className="text-r-saffron"` silently lost and
   * the stamp came out near-black on a navy ground — present, correct, and invisible.
   */
  tone?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ transform: `rotate(${rotate}deg)`, ...(tone ? { color: tone } : null) }}
    >
      {/*
       * Two paths carry the curved wording. The lower one is drawn left-to-right along
       * the bottom of the circle so its letters stand upright; drawn the other way the
       * text comes out upside down, which is the usual way this goes wrong.
       */}
      <defs>
        <path id="r-stamp-top" d="M28 100A72 72 0 0 1 172 100" />
        <path id="r-stamp-bottom" d="M38 100A62 62 0 0 0 162 100" />
      </defs>

      <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="100" cy="100" r="84" stroke="currentColor" strokeWidth="1.4" />

      <text
        fill="currentColor"
        fontSize="15.5"
        letterSpacing="2.4"
        style={{ fontFamily: "var(--font-r-display), serif", fontWeight: 800 }}
      >
        <textPath href="#r-stamp-top" startOffset="50%" textAnchor="middle">
          THE RECITALS
        </textPath>
      </text>
      <text
        fill="currentColor"
        fontSize="12"
        letterSpacing="2.2"
        style={{ fontFamily: "var(--font-r-display), serif", fontWeight: 700 }}
      >
        <textPath href="#r-stamp-bottom" startOffset="50%" textAnchor="middle">
          VAJIRAM &amp; RAVI
        </textPath>
      </text>

      <path d="M58 100H142" stroke="currentColor" strokeWidth="1.4" />
      <path d="M58 122H142" stroke="currentColor" strokeWidth="1.4" />
      <text
        x="100"
        y="95"
        textAnchor="middle"
        fill="currentColor"
        fontSize="16"
        letterSpacing="1.4"
        style={{ fontFamily: "var(--font-r-display), serif", fontWeight: 800 }}
      >
        FREE TO READ
      </text>
      <text
        x="100"
        y="117"
        textAnchor="middle"
        fill="currentColor"
        fontSize="13"
        letterSpacing="1.2"
        style={{ fontFamily: "var(--font-r-display), serif", fontWeight: 700 }}
      >
        NO SIGN-IN
      </text>

      {/* The small marks either side, where a real stamp has its separators. */}
      <circle cx="14" cy="100" r="3" fill="currentColor" />
      <circle cx="186" cy="100" r="3" fill="currentColor" />
    </svg>
  );
}

/**
 * A sketch laid into a section's margin, the way a textbook carries a figure beside the
 * text. Struck faint and with multiply, so it sits in the paper rather than on it, and
 * stays behind the reading even where a column crosses it.
 */
export function MarginMark({
  src,
  className,
  size = 300,
  opacity = 0.1,
}: {
  src: string;
  className?: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cx("pointer-events-none absolute bg-contain bg-center bg-no-repeat mix-blend-multiply", className)}
      style={{ backgroundImage: `url(${src})`, width: size, height: size, opacity }}
    />
  );
}

/**
 * A six-petalled rosette. The page's one ornament.
 *
 * It replaces the lozenge and the four-point star everywhere on this page. Those were two
 * different marks doing the same job in different places, which is why neither read as
 * belonging to anything — a rosette this specific gets recognised after the second time
 * you meet it, and that recognition is the whole value of having a house mark at all.
 *
 * Drawn as one petal rotated six times about the centre rather than as six hand-written
 * paths, so the symmetry is exact and the shape can be adjusted in one place.
 */
const PETAL = "M12 12.4C13.75 9 13.9 5.3 12 1.4 10.1 5.3 10.25 9 12 12.4Z";

export function RosetteMark({ className, size = 12 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className={className}>
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <path key={angle} d={PETAL} fill="currentColor" transform={`rotate(${angle} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
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
      {/*
       * One rosette flanked by two of the same mark set small. They read as dots at that
       * size, which is all the flanks ever did — but they are the same shape, so the
       * cluster belongs to the page rather than being a third ornament invented for
       * rules alone.
       */}
      <span className={cx("flex items-center gap-1.5", mark)}>
        <RosetteMark size={7} />
        <RosetteMark size={16} />
        <RosetteMark size={7} />
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

export type PatternName = "jali" | "block" | "chevron" | "star" | "ledger" | "register";

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
  /** A sown field of eight-pointed asterisks. Quieter than the block stamp, and not a diamond. */
  star: {
    w: 52,
    h: 52,
    svg: (c) => {
      const point = (cx: number, cy: number, r: number, rot: number) => {
        const k = r * 0.3;
        const d =
          "M" + cx + " " + (cy - r) +
          "C" + (cx + k * 0.4) + " " + (cy - k) + " " + (cx + k) + " " + (cy - k * 0.4) + " " + (cx + r) + " " + cy +
          "C" + (cx + k) + " " + (cy + k * 0.4) + " " + (cx + k * 0.4) + " " + (cy + k) + " " + cx + " " + (cy + r) +
          "C" + (cx - k * 0.4) + " " + (cy + k) + " " + (cx - k) + " " + (cy + k * 0.4) + " " + (cx - r) + " " + cy +
          "C" + (cx - k) + " " + (cy - k * 0.4) + " " + (cx - k * 0.4) + " " + (cy - k) + " " + cx + " " + (cy - r) + "Z";
        return "<path transform='rotate(" + rot + " " + cx + " " + cy + ")' d='" + d + "'/>";
      };
      const star = (cx: number, cy: number, r: number) => point(cx, cy, r, 0) + point(cx, cy, r * 0.72, 45);
      return (
        "<svg xmlns='http://www.w3.org/2000/svg' width='52' height='52'><g fill='" + c + "'>" +
        star(13, 13, 5.5) + star(39, 39, 5.5) + star(39, 13, 3.4) + star(13, 39, 3.4) +
        "</g></svg>"
      );
    },
  },
  /**
   * Ruled paper. Structure rather than scattered motifs: a field of small shapes at low
   * contrast reads as dirt on the screen, while a grid reads as the thing you work on.
   */
  ledger: {
    w: 32,
    h: 32,
    svg: (c) =>
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'>" +
      "<g stroke='" + c + "' stroke-width='1' fill='none'>" +
      "<path d='M0 31.5H32'/><path d='M31.5 0V32'/>" +
      "</g></svg>",
  },
  /**
   * A government noting sheet: ruled lines with a margin rule struck down the left of
   * every column and a tick where each entry would be numbered.
   *
   * This is the one pattern on the page that belongs to the reader rather than to the
   * subject. An aspirant has handled this paper — in an office, on a form, in a register
   * — so it reads as the world they are entering rather than as decoration applied to a
   * page about it. It is also nobody's property, which the emblem and the chakra are.
   */
  register: {
    w: 148,
    h: 34,
    svg: (c) =>
      "<svg xmlns='http://www.w3.org/2000/svg' width='148' height='34'>" +
      "<g stroke='" + c + "' fill='none'>" +
      "<path stroke-width='1' d='M0 33.5H148'/>" +
      "<path stroke-width='1.6' d='M26.5 0V34'/>" +
      "<path stroke-width='1' d='M10 26.5h9'/>" +
      "</g></svg>",
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
      <RosetteMark size={15} className="text-r-amber" />
      {children}
    </p>
  );
}

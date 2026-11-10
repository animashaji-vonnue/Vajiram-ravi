import type { CSSProperties } from "react";

/**
 * Abstract covers for the programme books, after the customer cards on gitbook.com: large plain shapes (circles, half
 * circles, quarter circles and pills) cropped by the cover's edges, standing for each programme. At rest they are in
 * two tints of the programme's colour (on a cover tinted with it), with one shape in the full colour; while the cover is live (the pointer or
 * focus is on it) the cover fills with the colour, the shapes turn to light and dark tints over it and move into
 * place: the blocks line up, the rings spread, the lines write out and so on.
 */

export type ArtKind =
  "foundation" | "optional" | "csat" | "interview" | "mentor" | "mains" | "prelims" | "optionalTest";

/** A move, as CSS transform parts. */
type Move = { translate?: string; scale?: string; rotate?: string };

type Shape = {
  /** The SVG element and its attributes, in a 100 × 100 box. */
  el: "circle" | "rect" | "path";
  attrs: Record<string, number | string>;
  /** Where it sits at rest, and when live; the default is in place. */
  rest?: Move;
  live?: Move;
  /** The one shape in the programme's full colour at rest (and near-white when live). */
  accent?: boolean;
  /** A deeper tint, for depth (dark over the colour when live). */
  deep?: boolean;
  /** Where it turns about, if not its centre (as a share of its own box, e.g. "0% 50%"). */
  origin?: string;
};

/** A half disc of radius `r` centred on (`x`, `y`), its flat side facing `side`. */
function half(x: number, y: number, r: number, side: "left" | "right") {
  return side === "left"
    ? `M${x} ${y - r} A${r} ${r} 0 0 1 ${x} ${y + r} Z`
    : `M${x} ${y - r} A${r} ${r} 0 0 0 ${x} ${y + r} Z`;
}

/** A quarter disc with its corner at (`x`, `y`), bulging up and to the right. */
function quarter(x: number, y: number, r: number) {
  return `M${x} ${y} V${y - r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
}

/**
 * Every composition keeps clear of the title (top left, to about y = 38) except at the right edge, and may run under
 * the count and arrow at the foot and off the right and bottom edges.
 */
const SCENES: Record<ArtKind, Shape[]> = {
  // The GS Foundation: blocks that line up into a stack, the last one (in colour) set on top.
  foundation: [
    { el: "rect", attrs: { x: 12, y: 80, width: 100, height: 24, rx: 12 }, rest: { translate: "10px 0" } },
    { el: "rect", attrs: { x: 30, y: 60, width: 82, height: 18, rx: 9 }, deep: true, rest: { translate: "-8px 0" } },
    { el: "rect", attrs: { x: 48, y: 44, width: 64, height: 14, rx: 7 }, accent: true, rest: { translate: "12px 0" } },
  ],
  // Optional subjects: two large discs overlapping, one picked out and lifted.
  optional: [
    { el: "circle", attrs: { cx: 34, cy: 92, r: 32 }, live: { translate: "-6px 6px", scale: "0.92" } },
    { el: "circle", attrs: { cx: 82, cy: 74, r: 30 }, deep: true },
    { el: "circle", attrs: { cx: 62, cy: 72, r: 16 }, accent: true, live: { translate: "6px -10px", scale: "1.15" } },
  ],
  // CSAT: a grid of squares that turn into diamonds, one after another.
  csat: [0, 1, 2].flatMap((row) =>
    [0, 1, 2].map((col): Shape => ({
      el: "rect",
      attrs: { x: 48 + col * 19, y: 46 + row * 19, width: 15, height: 15, rx: 2 },
      accent: row === 1 && col === 1,
      deep: (row + col) % 2 === 1,
      live: { rotate: "45deg", scale: row === 1 && col === 1 ? "1.2" : "0.82" },
    })),
  ),
  // The interview: two large half discs, facing, that close into a whole, and a dot that appears above.
  interview: [
    { el: "path", attrs: { d: half(55, 80, 32, "right") }, rest: { translate: "-10px 0" } },
    { el: "path", attrs: { d: half(59, 80, 32, "left") }, deep: true, rest: { translate: "10px 0" } },
    { el: "circle", attrs: { cx: 57, cy: 80, r: 9 }, accent: true, rest: { scale: "0.4" } },
  ],
  // Mentorship: a large disc, an arc, and a small disc that rises along it.
  mentor: [
    { el: "path", attrs: { d: quarter(14, 104, 70) }, rest: { scale: "0.75" }, origin: "0% 100%" },
    { el: "circle", attrs: { cx: 30, cy: 92, r: 24 }, deep: true, live: { scale: "0.9" } },
    { el: "circle", attrs: { cx: 82, cy: 44, r: 8 }, accent: true, rest: { translate: "-20px 22px" } },
  ],
  // The Mains test series: lines of writing that run out across the page and off its edge.
  mains: [44, 57, 70, 83].map((y, i): Shape => ({
    el: "rect",
    attrs: { x: 30, y, width: [80, 66, 80, 52][i], height: 9, rx: 4.5 },
    accent: i === 0,
    deep: i === 2,
    rest: { scale: `${[0.45, 0.35, 0.6, 0.4][i]} 1` },
    origin: "0% 50%",
  })),
  // The Prelims test series: a large target, off the corner, whose rings spread out from the centre.
  prelims: [
    { el: "circle", attrs: { cx: 64, cy: 72, r: 38 }, rest: { scale: "0.82" } },
    { el: "circle", attrs: { cx: 64, cy: 72, r: 27 }, deep: true, rest: { scale: "0.86" } },
    { el: "circle", attrs: { cx: 64, cy: 72, r: 16 }, rest: { scale: "0.9" } },
    { el: "circle", attrs: { cx: 64, cy: 72, r: 6 }, accent: true, live: { scale: "1.3" } },
  ],
  // The optional test series: quarter discs as steps, rising one after another to a dot.
  optionalTest: [
    { el: "path", attrs: { d: quarter(12, 100, 24) }, rest: { translate: "0 8px" }, origin: "0% 100%" },
    { el: "path", attrs: { d: quarter(36, 100, 36) }, deep: true, rest: { translate: "0 12px" }, origin: "0% 100%" },
    { el: "path", attrs: { d: quarter(64, 100, 48) }, rest: { translate: "0 16px" }, origin: "0% 100%" },
    { el: "circle", attrs: { cx: 88, cy: 36, r: 6 }, accent: true, rest: { translate: "0 14px", scale: "0.6" } },
  ],
};

/** The tints over the programme's colour when live: light, dark, and near-white for the accent. */
const TINT = "rgb(255 255 255 / 0.14)";
const TINT_DEEP = "rgb(0 0 0 / 0.16)";
const TINT_ACCENT = "rgb(255 255 255 / 0.9)";
const EASE = "700ms cubic-bezier(0.22,1,0.36,1)";

/** A programme's abstract cover art; fills the cover, which should be positioned and square. */
export default function CoverArt({ kind, colour, live }: { kind: ArtKind; colour: string; live: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" overflow="hidden" className="cover-art absolute inset-0 size-full">
      {SCENES[kind].map(({ el: El, attrs, rest, live: moved, accent, deep, origin }, i) => {
        const move = live ? moved : rest;
        const style: CSSProperties = {
          translate: move?.translate ?? "0 0",
          scale: move?.scale ?? "1",
          rotate: move?.rotate ?? "0deg",
          // At rest, two tints of the programme's colour (as hex with alpha) and the full colour for the accent.
          fill: live
            ? accent
              ? TINT_ACCENT
              : deep
                ? TINT_DEEP
                : TINT
            : accent
              ? colour
              : `${colour}${deep ? "5c" : "33"}`,
          transformBox: "fill-box",
          transformOrigin: origin ?? "50% 50%",
          transition: `translate ${EASE}, scale ${EASE}, rotate ${EASE}, fill 400ms ease`,
          transitionDelay: live ? `${i * 60}ms` : "0ms",
        };
        return <El key={i} {...attrs} style={style} />;
      })}
    </svg>
  );
}

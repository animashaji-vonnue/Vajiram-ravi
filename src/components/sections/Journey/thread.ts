/*
 * The course of the journey's thread on the stage rail, in the rail's own px (the 1280 content column).
 * The three stage medallions sit on one line at the middle of three equal columns. The thread comes in from
 * beyond the left edge of the screen, hangs in a garland swag from each medallion to the next (a toran
 * between posts), and runs on out past the right edge: BLEED px either side of the column, more than any
 * screen shows, so it always runs off both edges. The joins sit under the medallions, so the swags may meet
 * the straight runs at an angle.
 */

/** The rail's width, and the medallions' centre line. */
export const RAIL_W = 1280;
export const RAIL_Y = 28;
/** How far the thread runs on past the column at either end (clipped by the screen). */
export const BLEED = 480;

/** The medallions' centres: the middle of each third of the column. */
export const MARKER_X = [RAIL_W / 6, RAIL_W / 2, (RAIL_W * 5) / 6];

/** How far each swag's control points hang below the line (the swag itself dips three quarters of it). */
const SAG = 32;

type Point = readonly [number, number];
type Cubic = readonly [Point, Point, Point, Point];

const swag = (x0: number, x1: number): Cubic => [
  [x0, RAIL_Y],
  [x0 + (x1 - x0) / 3, RAIL_Y + SAG],
  [x0 + ((x1 - x0) * 2) / 3, RAIL_Y + SAG],
  [x1, RAIL_Y],
];

const SWAGS = [swag(MARKER_X[0], MARKER_X[1]), swag(MARKER_X[1], MARKER_X[2])];

/** A cubic Bézier's length, by summing short chords (plenty for a gentle curve). */
function cubicLength([p0, p1, p2, p3]: Cubic, steps = 96) {
  let length = 0;
  let [px, py] = p0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
    const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
    length += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return length;
}

const n = (value: number) => Number(value.toFixed(2));

/** The thread: lead-in, two swags, lead-out. */
export const THREAD_D =
  `M${-BLEED} ${RAIL_Y}H${n(MARKER_X[0])}` +
  SWAGS.map(([, c1, c2, end]) => `C${n(c1[0])} ${c1[1]} ${n(c2[0])} ${c2[1]} ${n(end[0])} ${end[1]}`).join("") +
  `H${RAIL_W + BLEED}`;

const LEAD_IN = MARKER_X[0] + BLEED;
const SWAG_LENGTHS = SWAGS.map((curve) => cubicLength(curve));
const TOTAL = LEAD_IN + SWAG_LENGTHS[0] + SWAG_LENGTHS[1] + (RAIL_W + BLEED - MARKER_X[2]);

/**
 * Where each medallion sits along the thread, as a share of its length (0 to 1), for a path drawn with
 * pathLength 1: the filled thread runs from the start to the active stage's medallion. Rounded, so the
 * server's markup and the browser's agree to the digit.
 */
export const MARKER_AT = [LEAD_IN, LEAD_IN + SWAG_LENGTHS[0], LEAD_IN + SWAG_LENGTHS[0] + SWAG_LENGTHS[1]].map((at) => Number((at / TOTAL).toFixed(4)));

/**
 * The share of the thread at the point `x` (rail px) on its straight lead-out past the last medallion:
 * where the fill must reach to touch the right edge of the screen.
 */
export const alongLeadOut = (x: number) => Math.min(1, (LEAD_IN + SWAG_LENGTHS[0] + SWAG_LENGTHS[1] + Math.max(0, x - MARKER_X[2])) / TOTAL);

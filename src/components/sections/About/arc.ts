/*
 * The geometry and timing of the arc carousel (Figma "arc carousel", 2377:4531). The drawn cards stand on
 * one wheel: their centres lie on a circle of radius 1600 whose centre is 1600px below the centre card's
 * centre, 11° apart, each card turned by its own angle on the wheel. So a card's whole pose is one turn
 * about that point, and turning the carousel is turning the wheel.
 */

import { mod } from "@/lib/motion";

/** The wheel's radius, px, and the angle between two cards. */
export const RADIUS = 1600;
export const STEP_DEG = 11;
/** Pointer travel that turns the wheel by one card: the arc between two neighbouring centres (≈307px). */
export const STEP_PX = (RADIUS * STEP_DEG * Math.PI) / 180;
/** The centre card is 280 × 388 and the side cards 264 × 372, as drawn: the same card, scaled. */
const SIDE_SCALE = 264 / 280;
/** Two cards each side show; the card opposite the centre waits behind, unseen, fading out from 2.5 places. */
const SHOWN = 2.5;
const HIDDEN = 3;

/** Distance in places from the centre, wrapped so the cards sit evenly either side: [-n/2, n/2). */
export function wrapOffset(offset: number, count: number): number {
  return mod(offset + count / 2, count) - count / 2;
}

export type Pose = { transform: string; opacity: string; zIndex: string; pointerEvents: "none" | "auto" };

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const round = (n: number, digits: number) => Number(n.toFixed(digits));

/**
 * A card's pose `offset` places from the centre (fractional while the wheel turns): turned about the wheel's
 * centre, then by `tilt` about its own (the pile before the cards spread), and scaled from 1 at the centre
 * to the side cards' size one place out. `depth` sets the stacking (the centre on top); it is the distance
 * itself unless given. No trigonometry, so the server's markup matches the browser's exactly.
 */
export function pose(offset: number, tilt = 0, depth = Math.abs(offset)): Pose {
  const distance = Math.abs(offset);
  const scale = 1 - (1 - SIDE_SCALE) * Math.min(1, distance);
  const opacity = clamp01((HIDDEN - distance) / (HIDDEN - SHOWN));
  return {
    transform: `translateY(${RADIUS}px) rotate(${round(offset * STEP_DEG, 3)}deg) translateY(${-RADIUS}px) rotate(${round(tilt, 3)}deg) scale(${round(scale, 4)})`,
    opacity: String(round(opacity, 3)),
    zIndex: String(10 - Math.round(depth * 2)),
    pointerEvents: opacity < 0.05 ? "none" : "auto",
  };
}

/** Writes a pose onto a card. */
export function applyPose(el: HTMLElement, { transform, opacity, zIndex, pointerEvents }: Pose) {
  el.style.transform = transform;
  el.style.opacity = opacity;
  el.style.zIndex = zIndex;
  el.style.pointerEvents = pointerEvents;
}

/*
 * The spread's spring: a damped spring (damping ratio 0.62, 12.5 rad/s) that overshoots by about 8% and
 * settles within 720ms, where it is snapped to rest.
 */
const ZETA = 0.62;
const OMEGA = 12.5;
const DAMPED = OMEGA * Math.sqrt(1 - ZETA * ZETA);
export const SPRING_MS = 720;

/** The spring's progress `ms` after it starts, 0 to (briefly past) 1. */
export function spring(ms: number): number {
  if (ms <= 0) return 0;
  if (ms >= SPRING_MS) return 1;
  const t = ms / 1000;
  return 1 - Math.exp(-ZETA * OMEGA * t) * (Math.cos(DAMPED * t) + ((ZETA * OMEGA) / DAMPED) * Math.sin(DAMPED * t));
}

/** A CSS cubic-bezier() timing function, for turns driven frame by frame. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const at = (a: number, b: number, t: number) => 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t;
  const slope = (a: number, b: number, t: number) => 3 * a * (1 - t) * (1 - t) + 6 * (b - a) * (1 - t) * t + 3 * (1 - b) * t * t;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    // Newton's method on x(t) = x, with bisection when the slope is too flat to trust.
    let t = x;
    for (let i = 0; i < 6; i++) {
      const error = at(x1, x2, t) - x;
      const d = slope(x1, x2, t);
      if (Math.abs(error) < 1e-5) break;
      if (Math.abs(d) < 1e-6) break;
      t -= error / d;
    }
    if (t < 0 || t > 1 || Math.abs(at(x1, x2, t) - x) > 1e-4) {
      let lo = 0;
      let hi = 1;
      t = x;
      for (let i = 0; i < 24; i++) {
        if (at(x1, x2, t) < x) lo = t;
        else hi = t;
        t = (lo + hi) / 2;
      }
    }
    return at(y1, y2, t);
  };
}

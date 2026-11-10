import type { CSSProperties } from "react";

/*
 * The hero's load sequence. Each piece starts from an @starting-style (hidden, shifted) at the first paint
 * and transitions to rest after its own delay, `--at`. Being CSS, it plays once on load without waiting
 * for the script, so nothing flashes between the first paint and hydration, and it can never leave the
 * hero hidden: without JavaScript it still plays, and where @starting-style is unsupported everything is
 * simply at rest. Reduced motion: globals.css zeroes transition times and delays, so everything shows in
 * its final state at once.
 *
 * The intro (layout/Preloader) plays first, on every page load: its head script sets `--intro` on <html>
 * to the time the curtain clears the hero, and every start time here is offset by it, so the whole
 * sequence plays as the curtain lifts. Both run on the same clock (the first paint), so they stay in step
 * however late the script arrives. Without the intro `--intro` is unset and the offset is 0.
 */

/** Fades in over --dur-slow after `--at`. */
export const ENTER = "transition-[opacity,translate] duration-(--dur-slow) ease-out delay-(--at) starting:opacity-0";
/** Fades up --rise (24px). */
export const RISE = `${ENTER} starting:translate-y-(--rise)`;
/** A heading line: fades up --rise and comes into focus from a 6px blur, over --dur-slow. */
export const LINE =
  "transition-[opacity,translate,filter] duration-(--dur-slow) ease-out delay-(--at) starting:opacity-0 starting:translate-y-(--rise) starting:blur-[6px]";

/**
 * Start times in ms: the banner photo settles (0), the eyebrow, the heading line by line 80ms apart, the
 * lead, the two CTAs 60ms apart, then the three achievements 80ms apart (their figures roll as each one
 * rises, see ./HeroFigure). The last piece settles at about 1.6s, its figure at about 2.1s.
 */
export const AT = {
  art: 0,
  eyebrow: 160,
  lines: [240, 320, 400],
  lead: 520,
  ctas: [600, 660],
  achievements: [780, 860, 940],
} as const;

/** The delay as the `--at` custom property, after the intro curtain when there is one. */
export const at = (ms: number) => ({ "--at": `calc(var(--intro, 0ms) + ${ms}ms)` }) as CSSProperties;

/**
 * Calls `start` when the entrance of the element's piece of the sequence (its nearest `data-enter`
 * ancestor) begins to play, read from the piece's own CSS transition: so a script that hydrates late
 * still meets the sequence on time. If that entrance is no longer pending (it has played already, or
 * reduced motion skipped it), `start` is never called and the piece stays as it is. Returns a canceller.
 */
export function whenEntering(el: Element, start: () => void): () => void {
  const piece = el.closest("[data-enter]") ?? el;
  if (typeof CSSTransition === "undefined" || typeof piece.getAnimations !== "function") return () => {};
  const entrance = piece
    .getAnimations()
    .find((animation): animation is CSSTransition => animation instanceof CSSTransition && animation.transitionProperty === "opacity");
  const delay = Number(entrance?.effect?.getTiming().delay ?? 0);
  const elapsed = Number(entrance?.currentTime ?? Infinity);
  if (!entrance || elapsed > delay + 60) return () => {};
  const timer = window.setTimeout(start, Math.max(0, delay - elapsed));
  return () => window.clearTimeout(timer);
}

import type { CSSProperties } from "react";

/*
 * The hero's load sequence (motion spec, "01 Hero · On load (once, ~1.2s total)"). Each piece starts from
 * an @starting-style (hidden, shifted) at the first paint and transitions to rest after its own delay,
 * `--at`. Being CSS, it plays once on load without waiting for the script, so nothing flashes between the
 * first paint and hydration, and it can never leave the hero hidden: without JavaScript it still plays,
 * and where @starting-style is unsupported everything is simply at rest. Reduced motion: globals.css
 * zeroes transition times and delays, so everything shows in its final state at once.
 *
 * The intro (layout/Preloader) plays first, on a visitor's first page of the session: its head script
 * sets `--intro` on <html> to the time the curtain clears the hero, and every start time here (and the
 * niche-line draw) is offset by it, so the whole sequence plays as the curtain lifts. Both run on the same
 * clock (the first paint), so they stay in step however late the script arrives. Without the intro
 * `--intro` is unset and the offset is 0.
 */

/** Fades in over --dur-slow after `--at`. */
export const ENTER = "transition-[opacity,translate] duration-(--dur-slow) ease-out delay-(--at) starting:opacity-0";
/** Fades up --rise (24px). */
export const RISE = `${ENTER} starting:translate-y-(--rise)`;

/**
 * Start times in ms, in the spec's order: the niche lines draw (0, 700ms, in NicheLines), Lady Justice
 * fades up 32px, the eyebrow ornament, the heading's first line and then its italic 120ms later, the
 * body, the CTAs 60ms apart (with the "New to UPSC?" line as the last of them), and the proof card from
 * the right. The last piece settles at about 1.25s.
 */
export const AT = {
  statue: 120,
  eyebrow: 200,
  headline: 280,
  accent: 400,
  lead: 480,
  ctas: 560,
  card: 600,
} as const;

/** The delay as the `--at` custom property, after the intro curtain when there is one. */
export const at = (ms: number) => ({ "--at": `calc(var(--intro, 0ms) + ${ms}ms)` }) as CSSProperties;

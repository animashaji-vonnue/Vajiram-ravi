import { cx } from "@/lib/cx";
import PreloaderCurtain from "./PreloaderCurtain";

/*
 * The intro: a words preloader after Skiper UI's "skiper8" (recreated from dennissnellenberg.com). A
 * mahogany curtain covers the page while "Namaste" cycles through Indian languages, then it lifts off the
 * top with a curved lower edge that flattens as it leaves, and the hero plays its entrance beneath.
 *
 * It is CSS from the first paint: the head script (`introScript`) decides before anything is drawn and
 * marks <html> with `intro`; only then is the curtain displayed, and every step (each word, the lift, the
 * curve) is an @starting-style transition with its own delay. So it never flashes for anyone else, it
 * needs no script to run its timeline, and it shares the first paint's clock with the hero's own CSS
 * sequence, which waits for `--intro` (Hero/enter). PreloaderCurtain locks the page's scroll meanwhile and
 * removes `intro` when the curtain's transitions are done.
 *
 * On every page load (a reload included), never with reduced motion, never without JavaScript (no head
 * script, no `intro`, no curtain), and where @starting-style is unsupported the curtain rests off screen.
 * A page restored from the back-forward cache does not replay it. Decorative and short: aria-hidden,
 * nothing to focus.
 *
 * The timing: the first "Namaste" fades in and holds long enough to read, the other languages follow at
 * an even beat, and the closing "Namaste" holds again before the curtain lifts, so the greeting ends on a
 * word rather than mid-cycle. About 3.1 seconds in all, the hero starting 2.8s in.
 */

/** The greeting, in this order. Latin in Newsreader; the Indic scripts fall back to the system's fonts. */
const WORDS = [
  { text: "Namaste", lang: "hi-Latn" },
  { text: "नमस्ते", lang: "hi" },
  { text: "নমস্কার", lang: "bn" },
  { text: "வணக்கம்", lang: "ta" },
  { text: "నమస్కారం", lang: "te" },
  { text: "ನಮಸ್ಕಾರ", lang: "kn" },
  { text: "നമസ്കാരം", lang: "ml" },
  { text: "નમસ્તે", lang: "gu" },
  { text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", lang: "pa" },
  { text: "Namaste", lang: "hi-Latn" },
] as const;

/** The first word's time on screen (it fades in over FIRST_FADE), ms. */
const FIRST = 600;
/** Each of the languages in between: an even beat, quick but readable, ms. */
const STEP = 160;
const FIRST_FADE = 320;
const FADE = 100;
/** How long the closing "Namaste" holds before the curtain lifts, ms. */
const HOLD = 420;
/** The curtain starts to lift once the last word has held: 2.3s. */
const LIFT_AT = FIRST + (WORDS.length - 2) * STEP + HOLD;
/** The lift, ms; the curve flattens over all but the first FLATTEN_LAG of it. */
const LIFT = 800;
const FLATTEN_LAG = 100;
/**
 * When the hero's entrance starts (`--intro`): 500ms into the lift, when the eased curtain is about 80% up
 * and its edge is leaving the top of the hero, so the statue and copy rise as it clears.
 */
const HERO_AT = LIFT_AT + 500;

/** When word `i` comes on (and word `i - 1` goes off), ms after the first paint. */
const showAt = (i: number) => (i === 0 ? 0 : FIRST + (i - 1) * STEP);

/**
 * Inline <head> script: decides before the first paint whether the intro plays (on every load, unless the
 * visitor prefers reduced motion) and, if so, marks <html> with `intro` and sets `--intro` to the hero's
 * start time.
 */
export const introScript = `(function(){try{var r=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;r.classList.add("intro");r.style.setProperty("--intro","${HERO_AT}ms")}catch(e){}})();`;

export default function Preloader() {
  const last = WORDS.length - 1;
  return (
    <PreloaderCurtain
      until={LIFT_AT + LIFT}
      className="fixed inset-0 z-100 hidden -translate-y-full items-center justify-center bg-mahogany text-cream starting:translate-y-0 [.intro_&]:flex"
      style={{ transition: `translate ${LIFT}ms var(--ease-in-out) ${LIFT_AT}ms` }}
    >
      {/* The words share one grid cell, each centred; at least ~28 screen px on a zoomed-down canvas. */}
      <div className="grid text-[length:max(56px,calc(28px/var(--canvas-zoom,1)))] leading-[1.2] font-normal">
        {WORDS.map((word, i) => (
          <span
            key={i}
            lang={word.lang}
            className={cx(
              "col-start-1 row-start-1 flex items-center justify-center gap-[0.4em] whitespace-nowrap starting:opacity-0",
              word.lang === "hi-Latn" ? "font-serif" : "font-sans",
              // On at showAt(i), off (at once) when the next word comes on; the last one rides up with the curtain.
              i < last && "invisible starting:visible",
            )}
            style={{
              transition: `opacity ${i === 0 ? FIRST_FADE : FADE}ms var(--ease-out) ${showAt(i)}ms, visibility 0s linear ${showAt(i + 1)}ms`,
            }}
          >
            <span className="size-[0.18em] shrink-0 rounded-full bg-saffron" />
            {word.text}
          </span>
        ))}
      </div>

      {/* The curved lower edge: a bulge under the curtain that flattens (scaleY 1 → 0) as it lifts. */}
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute top-full left-0 -mt-px h-[15%] w-full origin-top scale-y-0 fill-mahogany starting:scale-y-100"
        style={{ transition: `scale ${LIFT - FLATTEN_LAG}ms var(--ease-in-out) ${LIFT_AT + FLATTEN_LAG}ms` }}
      >
        <path d="M0 0Q720 200 1440 0Z" />
      </svg>
    </PreloaderCurtain>
  );
}

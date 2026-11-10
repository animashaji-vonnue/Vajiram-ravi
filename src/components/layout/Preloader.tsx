import PreloaderCurtain from "./PreloaderCurtain";

/*
 * The intro: the opening of the page. A mahogany curtain covers it for a moment, then lifts off the top
 * with a curved lower edge that flattens as it leaves, and the hero plays its entrance beneath. (It once
 * cycled "Namaste" through Indian languages first; the client asked for the opening alone.)
 *
 * It is CSS from the first paint: the head script (`introScript`) decides before anything is drawn and
 * marks <html> with `intro`; only then is the curtain displayed, and the lift and the curve are
 * @starting-style transitions with their own delays. So it never flashes for anyone else, it needs no
 * script to run its timeline, and it shares the first paint's clock with the hero's own CSS sequence,
 * which waits for `--intro` (Hero/enter). PreloaderCurtain locks the page's scroll meanwhile and removes
 * `intro` when the curtain's transitions are done.
 *
 * On every page load (a reload included), never with reduced motion, never without JavaScript (no head
 * script, no `intro`, no curtain), and where @starting-style is unsupported the curtain rests off screen.
 * A page restored from the back-forward cache does not replay it. Decorative and short: aria-hidden,
 * nothing to focus. About 1.1 seconds in all, the hero starting 0.8s in.
 */

/** The curtain holds this long before it lifts, ms. */
const LIFT_AT = 300;
/** The lift, ms; the curve flattens over all but the first FLATTEN_LAG of it. */
const LIFT = 800;
const FLATTEN_LAG = 100;
/**
 * When the hero's entrance starts (`--intro`): 500ms into the lift, when the eased curtain is about 80% up
 * and its edge is leaving the top of the hero, so the copy rises as it clears.
 */
const HERO_AT = LIFT_AT + 500;

/**
 * Inline <head> script: decides before the first paint whether the intro plays (on every load, unless the
 * visitor prefers reduced motion) and, if so, marks <html> with `intro` and sets `--intro` to the hero's
 * start time.
 */
export const introScript = `(function(){try{var r=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;r.classList.add("intro");r.style.setProperty("--intro","${HERO_AT}ms")}catch(e){}})();`;

export default function Preloader() {
  return (
    <PreloaderCurtain
      until={LIFT_AT + LIFT}
      className="fixed inset-0 z-100 hidden -translate-y-full bg-mahogany starting:translate-y-0 [.intro_&]:block"
      style={{ transition: `translate ${LIFT}ms var(--ease-in-out) ${LIFT_AT}ms` }}
    >
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

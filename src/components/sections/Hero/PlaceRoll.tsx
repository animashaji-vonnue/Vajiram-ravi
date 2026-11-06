/** Both places start together, 1s after the hero's own clock (and its intro offset), on a 7s loop. */
const START = "[animation-delay:calc(var(--intro,0ms)+1000ms)]";
const FIRST = `animate-[place-roll-a_7s_var(--ease-in-out)_infinite_both] ${START}`;
const SECOND = `animate-[place-roll-b_7s_var(--ease-in-out)_infinite_both] ${START}`;

/**
 * The place in the hero's second line, one at a time: "Delhi" holds, then rolls up and away as "India"
 * rises in from below, and after a while India rolls up the same way and Delhi comes back. A turn every
 * 3.5 seconds, each roll taking 560ms on --ease-in-out with a soft blur while it moves (place-roll-a and
 * place-roll-b in globals.css: one keyframe set for the place showing first, one for the other).
 *
 * Pure CSS, so it is part of the hero's first paint: it starts 600ms after the line has begun its entrance,
 * which waits for the intro curtain (`--intro`, layout/Preloader). The two places share one grid cell, so
 * the slot is as wide as the longer one and nothing around it moves. Decorative: the heading carries the
 * full line for screen readers. With reduced motion the first place simply stays.
 */
export default function PlaceRoll({ places }: { places: readonly [string, string] }) {
  return (
    <span className="inline-grid justify-items-start">
      <span className={`col-start-1 row-start-1 ${FIRST}`}>{places[0]}</span>
      <span className={`col-start-1 row-start-1 ${SECOND}`}>{places[1]}</span>
    </span>
  );
}

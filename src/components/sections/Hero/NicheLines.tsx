/*
 * The arched niche behind the statue (Figma "niche outer line" 2256:5600, "niche" 2256:5601, "niche inner
 * line" 2256:5602), placed on the 1440 canvas as drawn.
 *
 * Motion spec, hero load step 1: the two gold lines draw in (stroke-dashoffset, 700ms). They are strokes,
 * so they are the design's own SVGs set inline (same root size, path and stroke) to reach the path, with
 * `pathLength` 1 so the dash needs no measuring. The draw is a CSS transition from an @starting-style,
 * so it plays once at the first paint without waiting for the script; without @starting-style, and with
 * reduced motion (globals.css zeroes transition times), the lines are simply there. The filled niche
 * between them stays still. With the intro curtain (layout/Preloader) the draw waits for `--intro`, as
 * the rest of the hero's sequence does (./enter).
 */

const DRAW =
  "[stroke-dasharray:1] [stroke-dashoffset:0] transition-[stroke-dashoffset] duration-700 ease-in-out [transition-delay:var(--intro,0ms)] starting:[stroke-dashoffset:1]";

export default function NicheLines() {
  return (
    <>
      {/* 420 × 640 at (910, 50); the SVG is 0.75px larger each side for the 1.5px stroke. */}
      <svg
        width="421.5"
        height="641.516"
        viewBox="0 0 421.5 641.516"
        fill="none"
        preserveAspectRatio="none"
        overflow="visible"
        className="absolute top-[49.25px] left-[909.25px] block"
      >
        <path
          d="M0.75 640.766V192.766C0.75 87.166 118.35 19.966 210.75 0.76602C303.15 19.966 420.75 87.166 420.75 192.766V640.766H0.75Z"
          strokeWidth="1.5"
          stroke="#F4C430"
          strokeOpacity="0.55"
          pathLength={1}
          className={DRAW}
        />
      </svg>
      <img src="/images/hero/niche.svg" alt="" width={380} height={620} className="absolute top-[70px] left-[930px] block h-[620px] w-[380px] max-w-none" />
      {/* 352 × 606 at (944, 84); the SVG is 0.5px larger each side for the 1px stroke. */}
      <svg
        width="353"
        height="607.014"
        viewBox="0 0 353 607.014"
        fill="none"
        preserveAspectRatio="none"
        overflow="visible"
        className="absolute top-[83.5px] left-[943.5px] block"
      >
        <path
          d="M0.5 606.514V182.314C0.5 82.3236 99.06 18.6936 176.5 0.513594C253.94 18.6936 352.5 82.3236 352.5 182.314V606.514H0.5Z"
          stroke="#F4C430"
          strokeOpacity="0.35"
          pathLength={1}
          className={DRAW}
        />
      </svg>
    </>
  );
}

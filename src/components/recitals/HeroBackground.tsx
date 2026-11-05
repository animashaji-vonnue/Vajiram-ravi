/*
 * The Recitals hero ground, as settled in Figma (Hero · 2b).
 *
 * Three layers, in this order:
 *   1. Paper. Near white with a real scanned grain over it, so the half of the screen that
 *      carries the reading matter is a printed page rather than a flat white panel.
 *   2. Colour rising from the foot. Dark type sits on the paper above it; the covers stand
 *      in the colour below. That split is the whole idea — colour and reading matter never
 *      share the same space, which is what made every earlier gradient look dull.
 *   3. The study collage, printed into the colour with `multiply` so it takes the ground's
 *      warmth instead of sitting on top of it. Two clusters only, held to the far edges,
 *      so the covers never cover anything.
 */

const RISE =
  "linear-gradient(to bottom," +
  "rgba(255,184,103,0) 0%," +
  "rgba(255,161,50,.48) 18%," +
  "rgba(248,135,26,.9) 45%," +
  "rgba(227,104,10,1) 72%," +
  "rgba(184,76,5,1) 100%)";

/* Vertical light bands over the colour, fading out as they climb. */
const RAYS =
  "repeating-linear-gradient(to right," +
  "rgba(255,255,255,.07) 0 2px," +
  "transparent 2px 74px," +
  "rgba(255,255,255,.05) 74px 78px," +
  "transparent 78px 152px)";

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#fffdfa]" aria-hidden="true">
      {/* 1. The sheet. */}
      <div
        className="absolute inset-0 opacity-[.22]"
        style={{ backgroundImage: "url(/recitals/paper.png)", backgroundSize: "cover", backgroundPosition: "center" }}
      />

      {/* 2. The colour, rising from the foot. */}
      <div className="absolute inset-x-0 bottom-0 h-[64%]" style={{ background: RISE }} />
      <div
        className="absolute inset-x-0 bottom-0 h-[64%]"
        style={{ background: RAYS, maskImage: "linear-gradient(to bottom, transparent, #000 55%)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 55%)" }}
      />

      {/*
       * 3. The collage. Stretched rather than cropped: the objects live hard against the
       * left and right edges, and `cover` would cut exactly them off on a wide screen.
       */}
      <div
        className="absolute inset-x-0 bottom-0 h-[51%] opacity-50 mix-blend-multiply"
        style={{
          backgroundImage: "url(/recitals/study-collage.png)",
          backgroundSize: "100% 100%",
          backgroundPosition: "bottom center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}

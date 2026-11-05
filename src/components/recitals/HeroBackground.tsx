/*
 * The Recitals hero ground.
 *
 * Four layers, in this order:
 *   1. Paper. Near white with a real scanned grain over it, so the half of the screen that
 *      carries the reading matter is a printed page rather than a flat white panel.
 *   2. Ghosted headlines, set large and faint down both margins. This is the device from
 *      Direction A, and it earns its place where a texture cannot: it is made of actual
 *      current affairs, so the ground says what the page is about instead of only looking
 *      like paper.
 *   3. Colour rising from the foot. Dark type sits on the paper above it; the covers stand
 *      in the colour below. That split is the whole idea — colour and reading matter never
 *      share the same space, which is what made every earlier gradient look dull.
 *   4. Two cut-outs, printed into the colour with `multiply` so they take the ground's
 *      warmth. India sits in the bottom corner and the books ride higher on the other side.
 *      They are separate elements rather than one generated band so each can be placed, and
 *      so that thinning the collage down to two objects was possible at all.
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

/**
 * Held to the margins, clear of the masthead. Real headlines rather than filler, because
 * at this size a reader can make out a phrase or two and that is the point of them.
 */
const GHOSTS: { text: string; top: string; side: "left" | "right"; w: number }[] = [
  { text: "Monsoon Session opens with eight Bills on the agenda", top: "11%", side: "left", w: 300 },
  { text: "RBI keeps the repo rate unchanged for a fourth time", top: "30%", side: "left", w: 280 },
  { text: "NITI Aayog flags the gap between education and work", top: "49%", side: "left", w: 290 },
  { text: "Supreme Court sets up a bench on electoral reform", top: "9%", side: "right", w: 300 },
  { text: "ISRO readies its next mission to study the Sun", top: "28%", side: "right", w: 275 },
  { text: "Cabinet clears a new scheme for rural broadband", top: "47%", side: "right", w: 290 },
];

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#fffdfa]" aria-hidden="true">
      {/* 1. The sheet. */}
      <div
        className="absolute inset-0 opacity-[.22]"
        style={{ backgroundImage: "url(/recitals/paper.png)", backgroundSize: "cover", backgroundPosition: "center" }}
      />

      {/* 2. The day's news, printed faint into it. */}
      {GHOSTS.map((ghost) => (
        <p
          key={ghost.text}
          className="absolute font-r-masthead text-[clamp(22px,2.1vw,31px)]/[1.14] text-[#7a3a14] opacity-[.09]"
          style={{
            top: ghost.top,
            width: ghost.w,
            [ghost.side]: "-10px",
            textAlign: ghost.side === "right" ? "right" : "left",
          }}
        >
          {ghost.text}
        </p>
      ))}

      {/* 3. The colour, rising from the foot. */}
      <div className="absolute inset-x-0 bottom-0 h-[64%]" style={{ background: RISE }} />
      <div
        className="absolute inset-x-0 bottom-0 h-[64%]"
        style={{
          background: RAYS,
          maskImage: "linear-gradient(to bottom, transparent, #000 55%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 55%)",
        }}
      />

      {/* 4. Two objects, not a crowd. */}
      <div
        className="absolute bottom-[-2%] left-[-1%] h-[42%] w-[26%] bg-contain bg-left-bottom bg-no-repeat opacity-55 mix-blend-multiply"
        style={{ backgroundImage: "url(/recitals/india.png)" }}
      />
      <div
        className="absolute right-[1%] bottom-[16%] h-[22%] w-[21%] bg-contain bg-right-bottom bg-no-repeat opacity-55 mix-blend-multiply"
        style={{ backgroundImage: "url(/recitals/books.png)" }}
      />
    </div>
  );
}

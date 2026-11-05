/*
 * KEPT COPY — the hero as it stood before the Figma “Hero · 2b” rebuild (4 Nov 2026).
 *
 * Nothing imports this. It is here so the earlier direction can be looked at or pulled
 * back from without digging through git: full-bleed warm ground with a flat sun disc,
 * newsprint down both margins, a monument skyline, the covers above the masthead, and the
 * three figures in a band across the foot.
 *
 * Its background lives beside it in this folder, so editing the live HeroBackground does
 * not change what this renders.
 */

import { grainStyle } from "@/components/recitals/Ornaments";
import Skyline from "@/components/recitals/Skyline";

/*
 * The Recitals hero ground — a poster, not a wash.
 *
 * Three attempts at a gradient sunrise all came out dull, because a soft blend of warm
 * tones has nowhere to go: there is no edge for the eye to catch on. So this drops the
 * gradient entirely and builds the ground the way the Banaras travel posters on the
 * reference board do: flat paper, a solid sun in two rings of colour, concentric rules
 * around it, a monument skyline cutting across its foot, and newspaper down both margins.
 *
 * Everything here is a hard-edged shape. The energy comes from the contrast between a
 * saturated disc and plain paper, which is exactly what the blends could not give.
 */

const HEADLINES_LEFT = [
  "Monsoon Session opens with eight Bills on the agenda",
  "RBI keeps the repo rate unchanged for the fourth time",
  "India and Japan sign pact on critical minerals",
  "Supreme Court sets up bench on electoral reform",
  "NITI Aayog flags gap between education and employment",
];

const HEADLINES_RIGHT = [
  "Supreme Court sets up bench on electoral reform",
  "ISRO readies next mission to study the Sun",
  "Cabinet clears new scheme for rural broadband",
  "Monsoon Session opens with eight Bills on the agenda",
  "Census 2027 questionnaire released for consultation",
];

const COLUMN =
  "The committee report, tabled on Thursday, recommends a phased roll-out across States, with a review after two years. Members noted the fiscal impact and asked for clearer targets. The ministry said consultations with stakeholders would continue through the month, and that a draft framework would be placed in the public domain for comments before notification.";

/** A column of newspaper down one margin, fading before it reaches the text. */
function Newsprint({ side, headlines }: { side: "left" | "right"; headlines: string[] }) {
  return (
    <span
      className={side === "left" ? "absolute -left-8 w-[420px] rotate-2" : "absolute -right-8 w-[420px] -rotate-2"}
      style={{
        top: "14%",
        height: "80%",
        overflow: "hidden",
        opacity: 0.3,
        maskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, #000 0%, #000 36%, transparent 94%)`,
        WebkitMaskImage: `linear-gradient(to ${side === "left" ? "right" : "left"}, #000 0%, #000 36%, transparent 94%)`,
      }}
      aria-hidden="true"
    >
      <span className="block font-r-masthead text-[#43230d]">
        {headlines.map((headline) => (
          <span key={headline} className="mb-3.5 block">
            <span className="block text-[25px]/[27px]">{headline}</span>
            <span className="mt-2 flex gap-3.5">
              <span className="block w-1/2 text-[10.5px]/[13px]">{COLUMN}</span>
              <span className="block w-1/2 text-[10.5px]/[13px]">{COLUMN}</span>
            </span>
            <span className="mt-2.5 block h-px w-full bg-[#43230d]" />
          </span>
        ))}
      </span>
    </span>
  );
}

export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#fff2db]" aria-hidden="true">
      {/* The sun: two flat discs and a pair of rules around them. */}
      {/* Held high enough that the masthead below the covers never sits on the disc. */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid size-[min(560px,50vh)] place-items-center">
          <span className="absolute size-full rounded-full border border-[#ff8a16]/30" />
          <span className="absolute size-[86%] rounded-full border border-[#ff8a16]/45" />
          <span className="absolute size-[74%] rounded-full bg-[#ff8a16]" />
          <span className="absolute size-[52%] rounded-full bg-[#ffc23c]" />
        </div>
      </div>

      <Newsprint side="left" headlines={HEADLINES_LEFT} />
      <Newsprint side="right" headlines={HEADLINES_RIGHT} />

      {/* The horizon the monuments stand on. */}
      <span className="absolute inset-x-0 bottom-[clamp(108px,20vh,190px)] block h-px bg-[#c4621f]/35" />

      <div className="absolute inset-x-0 bottom-0 h-[clamp(110px,20vh,190px)] text-[#a8521a] opacity-[.22]">
        <Skyline className="h-full w-full" stretch />
      </div>

      <div className="absolute inset-0" style={grainStyle} />
    </div>
  );
}

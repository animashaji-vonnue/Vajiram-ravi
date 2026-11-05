import { ClockIcon } from "@/components/icons";
import { Reveal } from "@/components/recitals/Motion";
import { FlowerMark, patternStyle, SectionGround } from "@/components/recitals/Ornaments";
import { SectionHead } from "@/components/recitals/Parts";
import { readingPasses, readingTotal } from "@/data/magazine";

/*
 * How to actually use an issue.
 *
 * The common failure is downloading every issue and reading none. Three passes with real
 * times attached turn the magazine from a thing you collect into a thing you schedule.
 *
 * Same card language as the contents entries above — a whole colour field with a folio
 * column — because these are pages of one publication, not a different kind of object.
 * What differs is the head: each card carries its place in the month on a band sized to
 * exactly what stays visible once the next card lands on top, so the three bands end up
 * reading down the page as a timetable with only the current pass open.
 */

type Tone = { bg: string; band: string; fg: string; body: string; rule: string; folio: string };

const TONES: Tone[] = [
  {
    bg: "#b4481c",
    band: "#9c3b14",
    fg: "#fff4e4",
    body: "#ffe3c6",
    rule: "rgba(255,244,228,.28)",
    folio: "rgba(255,244,228,.5)",
  },
  {
    bg: "#f2c75c",
    band: "#e3b23f",
    fg: "#67290d",
    body: "#833f16",
    rule: "rgba(103,41,13,.24)",
    folio: "rgba(103,41,13,.42)",
  },
  {
    bg: "#7c2a11",
    band: "#67200c",
    fg: "#fff4e4",
    body: "#ffdcbb",
    rule: "rgba(255,244,228,.26)",
    folio: "rgba(255,244,228,.46)",
  },
];

/** Where the first card parks, clear of the floating nav. */
const PARK = 132;
/** The height of the band each parked card leaves showing. */
const STEP = 54;

export default function HowToUse() {
  return (
    <section id="how" className="relative bg-[#faf3e6]" aria-labelledby="how-h">
      <SectionGround tint={0.24} />
      <div
        className="pointer-events-none absolute inset-0"
        style={patternStyle("register", "#8a4a16", 0.1)}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-[1440px] items-start gap-20 px-20 py-24">
        <Reveal className="sticky top-32 w-[420px] shrink-0">
          <SectionHead
            id="how-h"
            eyebrow="How to use it"
            title="One issue, three passes, across the month it covers"
            lead="Reading it once and filing it away is the common mistake. These three passes are what turn an issue into marks."
          />
          <p className="mt-8 flex items-center gap-3 font-sans text-[15px]/[22px] font-medium text-r-ink-700">
            <FlowerMark size={11} className="text-r-amber" />
            {readingTotal}
          </p>
        </Reveal>

        <div className="relative min-w-0 flex-1 pb-[16vh]">
          {readingPasses.map((pass, i) => {
            const tone = TONES[i % TONES.length];
            return (
              <div key={pass.title} className="sticky" style={{ top: PARK + i * STEP, zIndex: i + 1 }}>
                <article
                  className="mb-6 overflow-hidden shadow-[0_26px_46px_-34px_rgba(94,27,16,.6)]"
                  style={{ backgroundColor: tone.bg }}
                >
                  {/* The band that stays showing once the next pass covers this one. */}
                  <div
                    className="flex items-center justify-between px-8"
                    style={{ height: STEP, backgroundColor: tone.band }}
                  >
                    <span
                      className="flex items-center gap-3 font-sans text-[11px]/[15px] font-semibold tracking-[.2em] uppercase"
                      style={{ color: tone.fg }}
                    >
                      <span className="font-r-display text-[14px] font-extrabold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {pass.when}
                    </span>
                    <span
                      className="flex items-center gap-1.5 font-sans text-[12px]/[16px] font-semibold"
                      style={{ color: tone.folio }}
                    >
                      <ClockIcon className="size-3.5" />
                      {pass.minutes}
                    </span>
                  </div>

                  <div className="flex items-stretch">
                    <div
                      className="flex w-[116px] shrink-0 items-start py-7 pr-5 pl-7"
                      style={{ borderRight: `1px solid ${tone.rule}` }}
                    >
                      <span className="font-r-display text-[52px]/[46px] font-extrabold" style={{ color: tone.fg }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-2.5 px-8 py-7">
                      <h3 className="font-r-editorial text-[25px]/[31px] font-bold" style={{ color: tone.fg }}>
                        {pass.title}
                      </h3>
                      <p className="font-sans text-[16px]/[25px] font-medium" style={{ color: tone.body }}>
                        {pass.body}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { ClockIcon } from "@/components/icons";
import { Reveal } from "@/components/recitals/Motion";
import { FlowerMark, SectionGround } from "@/components/recitals/Ornaments";
import { SectionHead } from "@/components/recitals/Parts";
import { readingPasses, readingTotal } from "@/data/magazine";

/*
 * How to actually use an issue.
 *
 * This section exists because the common failure is downloading every issue and reading
 * none. Three passes with real times attached turn the magazine from a thing you collect
 * into a thing you schedule.
 *
 * The passes happen in sequence across a month, so they are read in sequence: the heading
 * holds still and each pass rises, parks and is covered by the next. Every card carries
 * its place in the month on a tinted strip at its head, and that strip is sized to be
 * exactly what stays visible once the following card lands on top — so by the end of the
 * section the three strips read down the page as a timetable, which is the point.
 */

/** Where the first card parks, clear of the floating nav. */
const PARK = 132;
/** The height of the strip each parked card leaves showing. */
const STEP = 56;

export default function HowToUse() {
  return (
    <section id="how" className="relative bg-[#faf3e6]" aria-labelledby="how-h">
      <SectionGround tint={0.24} />
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

        {/*
         * The padding is the runway. A sticky card only holds while its container is still
         * passing the scrollport, so without this the stack unsticks the moment the last
         * card is laid down and the whole arrangement slides away before it can be read.
         */}
        <div className="relative min-w-0 flex-1 pb-[38vh]">
          {readingPasses.map((pass, i) => (
            <div key={pass.title} className="sticky" style={{ top: PARK + i * STEP, zIndex: i + 1 }}>
              <article className="mb-6 bg-r-paper shadow-[0_0_0_1px_rgba(94,27,16,.09),0_26px_46px_-34px_rgba(94,27,16,.55)]">
                {/* The strip that stays showing once the next pass covers this one. */}
                <div
                  className="flex items-center justify-between bg-[#f1e3ca] px-8"
                  style={{ height: STEP }}
                >
                  <span className="flex items-center gap-3 font-sans text-[12px]/[16px] font-semibold tracking-[.16em] text-r-rust uppercase">
                    <span className="font-r-display text-[15px] font-extrabold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {pass.when}
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-[12px]/[16px] font-semibold text-r-rust">
                    <ClockIcon className="size-3.5" />
                    {pass.minutes}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 p-8">
                  <h3 className="font-r-editorial text-[22px]/[28px] font-bold text-r-ink">{pass.title}</h3>
                  <p className="font-sans text-[16px]/[25px] font-medium text-r-ink-700">{pass.body}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ClockIcon } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/recitals/Motion";
import { DiamondMark, FlowerMark, SeamBand } from "@/components/recitals/Ornaments";
import { SectionHead } from "@/components/recitals/Parts";
import { doubleRule } from "@/components/recitals/Ornaments";
import { readingPasses, readingTotal } from "@/data/magazine";
import { cx } from "@/lib/cx";

/*
 * How to actually use an issue.
 *
 * This section exists because the common failure is downloading every issue and reading
 * none. Three passes with real times attached turn the magazine from a thing you collect
 * into a thing you schedule. The connecting rule between the cards is the month itself.
 */
export default function HowToUse() {
  return (
    <section id="how" className="relative bg-r-cream" aria-labelledby="how-h">
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-20 py-24">
        <Reveal>
          <SectionHead
            id="how-h"
            eyebrow="How to use it"
            title="One issue, three passes, across the month it covers"
            lead="Reading it once and filing it away is the common mistake. These three passes are what turn an issue into marks."
          />
        </Reveal>

        <div className="relative">
          {/* The month, drawn as a rule behind the three passes. */}
          <span className="absolute top-[86px] right-10 left-10 hidden h-px bg-r-line lg:block" aria-hidden="true" />

          <Stagger className="relative grid grid-cols-3 gap-6" gap={0.1}>
            {readingPasses.map((pass, i) => (
              <StaggerItem key={pass.title}>
                <article className={cx("flex h-full flex-col gap-5 bg-r-paper p-7", doubleRule)}>
                  <div className="flex items-center justify-between">
                    <span className="font-r-display text-[32px]/[36px] font-extrabold text-r-rust">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex items-center gap-1.5 bg-r-sand px-2.5 py-1 font-sans text-[12px]/[16px] font-semibold text-r-rust">
                      <ClockIcon className="size-3.5" />
                      {pass.minutes}
                    </span>
                  </div>

                  <p className="flex items-center gap-2 font-sans text-[12px]/[16px] font-semibold tracking-[.14em] text-r-ink-500 uppercase">
                    <DiamondMark size={5} className="text-r-amber" />
                    {pass.when}
                  </p>

                  <div className="flex flex-col gap-2.5">
                    <h3 className="font-r-editorial text-[21px]/[28px] font-bold text-r-ink">{pass.title}</h3>
                    <p className="font-sans text-[15px]/[24px] font-medium text-r-ink-700">{pass.body}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal delay={0.1}>
          <p className="flex items-center justify-center gap-3 font-sans text-[15px]/[22px] font-medium text-r-ink-700">
            <FlowerMark size={11} className="text-r-amber" />
            {readingTotal}
            <FlowerMark size={11} className="text-r-amber" />
          </p>
        </Reveal>
      </div>

      <SeamBand variant="jali" from="#fff3e0" to="#5e1b10" accent="#e49b0f" />
    </section>
  );
}

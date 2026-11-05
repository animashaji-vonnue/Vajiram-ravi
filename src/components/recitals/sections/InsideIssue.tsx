import { Reveal } from "@/components/recitals/Motion";
import { SectionGround } from "@/components/recitals/Ornaments";
import { SectionHead } from "@/components/recitals/Parts";
import { issueSections, type Stage } from "@/data/magazine";
import { cx } from "@/lib/cx";

/*
 * What is in every issue.
 *
 * The UX job is to answer "what am I actually downloading" before someone spends an hour
 * on it. Five fixed parts, in the order they appear, each tagged with the paper it serves.
 *
 * The parts are read one at a time rather than scanned as a list. The heading holds still
 * while each card rises, parks, and is covered by the next — the mechanism on
 * voicetaggods.com, where every card is `sticky` at the same offset inside a tall column
 * and the scroll distance comes from the cards' own height. Each one parks a little lower
 * than the last, so the edge of every card you have already read stays on screen and the
 * stack builds in front of you.
 *
 * There is no entrance animation on these: a transform on a wrapper fights the sticky
 * positioning, and the arrival is the interaction here.
 */

const STAGE_TONE: Record<Stage, string> = {
  Prelims: "bg-r-sand text-r-rust",
  Mains: "bg-r-melon/60 text-r-rust",
  Interview: "bg-r-cream text-r-ink-700",
  Essay: "bg-r-cream text-r-ink-700",
  Ethics: "bg-r-cream text-r-ink-700",
};

/** Where the first card parks, clear of the floating nav. */
const PARK = 128;
/** How far each card stops short of the one before, so its edge stays visible. */
const STEP = 20;

export default function InsideIssue() {
  return (
    <section id="inside" className="relative bg-[#fdf8ef]" aria-labelledby="inside-h">
      <SectionGround tint={0.2} />
      <div className="relative mx-auto flex w-full max-w-[1440px] items-start gap-20 px-20 py-24">
        <Reveal className="sticky top-32 w-[420px] shrink-0">
          <SectionHead
            id="inside-h"
            eyebrow="Inside an issue"
            title="Five parts, in the same order every month"
            lead="Each one maps to a stage of the exam, so a year of issues reads as one course rather than twelve separate files."
          />
        </Reveal>

        {/*
         * The padding is the runway. A sticky card only holds while its container is still
         * passing the scrollport, so without this the stack unsticks the moment the last
         * card is laid down and the whole arrangement slides away before it can be read.
         */}
        <div className="relative min-w-0 flex-1 pb-[26vh]">
          {issueSections.map((section, i) => (
            <div
              key={section.title}
              className="sticky"
              style={{ top: PARK + i * STEP, zIndex: i + 1 }}
            >
              <article
                className={cx(
                  "group/row mb-6 flex items-start gap-7 bg-r-paper p-8",
                  "shadow-[0_0_0_1px_rgba(94,27,16,.09),0_26px_46px_-34px_rgba(94,27,16,.55)]",
                )}
              >
                <span className="w-14 shrink-0 pt-1">
                  <span className="font-r-display text-[30px]/[32px] font-extrabold text-r-sand transition-colors duration-400 group-hover/row:text-r-amber">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <h3 className="font-r-editorial text-[22px]/[28px] font-bold text-r-ink">{section.title}</h3>
                  <p className="font-sans text-[16px]/[25px] font-medium text-r-ink-700">{section.description}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 pt-1.5">
                  {section.stages.map((stage) => (
                    <span
                      key={stage}
                      className={cx(
                        "px-2.5 py-1 font-sans text-[12px]/[16px] font-semibold whitespace-nowrap",
                        STAGE_TONE[stage],
                      )}
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

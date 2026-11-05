import { Reveal, Stagger, StaggerItem } from "@/components/recitals/Motion";
import { DiamondMark, patternStyle } from "@/components/recitals/Ornaments";
import { SectionHead } from "@/components/recitals/Parts";
import { issueSections, type Stage } from "@/data/magazine";
import { cx } from "@/lib/cx";

/*
 * What is in every issue.
 *
 * The UX job is to answer "what am I actually downloading" before someone spends an hour
 * on it. Five fixed parts, in the order they appear, each tagged with the paper it serves,
 * so a reader can see at a glance that the thing covers their weak stage.
 */

const STAGE_TONE: Record<Stage, string> = {
  Prelims: "bg-r-sand text-r-rust",
  Mains: "bg-r-melon/60 text-r-rust",
  Interview: "bg-r-cream text-r-ink-700",
  Essay: "bg-r-cream text-r-ink-700",
  Ethics: "bg-r-cream text-r-ink-700",
};

export default function InsideIssue() {
  return (
    <section id="inside" className="relative bg-r-paper" aria-labelledby="inside-h">
      <div className="relative mx-auto flex w-full max-w-[1440px] items-start gap-20 px-20 py-24">
        <Reveal className="sticky top-24 w-[420px] shrink-0">
          <SectionHead
            id="inside-h"
            eyebrow="Inside an issue"
            title="Five parts, in the same order every month"
            lead="Each one maps to a stage of the exam, so a year of issues reads as one course rather than twelve separate files."
          />
        </Reveal>

        <Stagger className="relative min-w-0 flex-1" gap={0.08}>
          {issueSections.map((section, i) => (
            <StaggerItem key={section.title}>
              <article
                className={cx(
                  "group/row flex items-start gap-7 border-b border-r-line py-7",
                  i === issueSections.length - 1 && "border-b-0 pb-0",
                )}
              >
                <span className="relative w-14 shrink-0 pt-1">
                  <span className="font-r-display text-[30px]/[32px] font-extrabold text-r-sand transition-colors duration-400 group-hover/row:text-r-amber">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <DiamondMark
                    size={5}
                    className="absolute top-0 -left-3 text-r-amber opacity-0 transition-opacity duration-400 group-hover/row:opacity-100"
                  />
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <h3 className="font-r-editorial text-[22px]/[28px] font-bold text-r-ink">{section.title}</h3>
                  <p className="font-sans text-[16px]/[25px] font-medium text-r-ink-700">{section.description}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 pt-1.5">
                  {section.stages.map((stage) => (
                    <span
                      key={stage}
                      className={cx("px-2.5 py-1 font-sans text-[12px]/[16px] font-semibold whitespace-nowrap", STAGE_TONE[stage])}
                    >
                      {stage}
                    </span>
                  ))}
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40" style={patternStyle("chevron", "#cc5500", 0.05)} aria-hidden="true" />
    </section>
  );
}

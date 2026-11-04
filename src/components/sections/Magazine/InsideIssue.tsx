import { Eyebrow, Lead, SectionTitle } from "@/components/ui/Typography";
import { issueSections, type Stage } from "@/data/magazine";
import { cx } from "@/lib/cx";

const STAGE_TONE: Record<Stage, string> = {
  Prelims: "bg-brand-100 text-brand-800",
  Mains: "bg-sun-100 text-brown-800",
  Interview: "bg-neutral-100 text-neutral-700",
  Essay: "bg-neutral-100 text-neutral-700",
  Ethics: "bg-neutral-100 text-neutral-700",
};

/** Small tag naming the exam stage a section is written for. */
export function StageChip({ stage }: { stage: Stage }) {
  return (
    <span
      className={cx(
        "rounded-full px-2.5 py-1 font-display text-[12px]/[16px] font-semibold whitespace-nowrap",
        STAGE_TONE[stage],
      )}
    >
      {stage}
    </span>
  );
}

/** The five sections of every issue, laid out like the magazine's own contents page. */
export default function InsideIssue() {
  return (
    <section className="bg-brand-50" id="inside" aria-labelledby="in-h">
      <div className="relative mx-auto flex w-canvas items-start gap-20 px-20 py-24">
        <div data-reveal className="sticky top-[120px] flex w-[420px] flex-none flex-col gap-5">
          <Eyebrow>INSIDE EVERY ISSUE</Eyebrow>
          <div className="flex flex-col gap-3">
            <SectionTitle id="in-h">Five sections, one for each demand of the exam</SectionTitle>
            <Lead>
              The order never changes, so a year of issues reads like one course: questions first, then the depth to answer
              them.
            </Lead>
          </div>
        </div>

        <ol data-reveal-group className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[20px] border border-neutral-200 bg-white px-8">
          {issueSections.map((section, i) => (
            <li
              key={section.title}
              className="group/row flex items-start gap-8 border-b border-line py-7 last:border-b-0"
            >
              <span className="w-10 flex-none pt-0.5 font-display text-[24px]/[32px] font-semibold text-neutral-300 tabular-nums transition-colors duration-300 group-hover/row:text-brand-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h3 className="font-display text-[22px]/[30px] font-semibold text-neutral-900">{section.title}</h3>
                <p className="font-sans text-[16px]/[23px] font-medium text-neutral-500">{section.description}</p>
              </div>
              <div className="flex flex-none items-center gap-1.5 pt-1.5">
                {section.stages.map((stage) => (
                  <StageChip key={stage} stage={stage} />
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

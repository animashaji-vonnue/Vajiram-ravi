import { Reveal } from "@/components/recitals/Motion";
import { SectionGround, StarMark } from "@/components/recitals/Ornaments";
import { SectionHead } from "@/components/recitals/Parts";
import { issueSections } from "@/data/magazine";

/*
 * What is in every issue.
 *
 * The UX job is to answer "what am I actually downloading" before someone spends an hour
 * on it. Five fixed parts, in the order they appear.
 *
 * They are read one at a time rather than scanned as a list: the heading holds still while
 * each card rises, parks, and is covered by the next — every card `sticky` at its own
 * offset inside one column, which is the mechanism on voicetaggods.com. Each parks a
 * little lower than the last, so the edge of everything already read stays on screen.
 *
 * No entrance animation on these. A transform on a wrapper fights sticky positioning, and
 * the arrival is the interaction here.
 */

/**
 * One accent per part, drawn from the palette rather than the two tones the cards had
 * before. It colours the numeral block, the wash in the corner and the asterisk behind it,
 * so each card is recognisable at a glance once it is down to a parked edge.
 */
const ACCENTS = ["#e49b0f", "#cc5500", "#e34234", "#b87333", "#a8341a"];

/** Where the first card parks, clear of the floating nav. */
const PARK = 128;
/** How far each card stops short of the one before, so its edge stays visible. */
const STEP = 22;

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
         * A short runway, not a long one. The stack needs the container to still be
         * crossing the scrollport in order to hold, but too much of it leaves the finished
         * stack hanging in dead space and then lurching upward when it finally lets go.
         */}
        <div className="relative min-w-0 flex-1 pb-[10vh]">
          {issueSections.map((section, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <div key={section.title} className="sticky" style={{ top: PARK + i * STEP, zIndex: i + 1 }}>
                <article className="relative mb-6 overflow-hidden bg-r-paper shadow-[0_0_0_1px_rgba(94,27,16,.09),0_26px_46px_-34px_rgba(94,27,16,.55)]">
                  {/* The corner: a wash of the part's own colour, and the asterisk in it. */}
                  <div
                    className="pointer-events-none absolute -top-16 -right-16 size-52 rounded-full"
                    style={{ background: `radial-gradient(circle, ${accent}2e, transparent 68%)` }}
                    aria-hidden="true"
                  />
                  <span
                    className="pointer-events-none absolute -top-7 -right-7 opacity-[.13]"
                    style={{ color: accent }}
                    aria-hidden="true"
                  >
                    <StarMark size={132} />
                  </span>

                  <div className="relative flex items-start gap-6 p-8">
                    <span
                      className="flex size-11 shrink-0 items-center justify-center font-r-display text-[17px]/[20px] font-extrabold text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex min-w-0 flex-1 flex-col gap-2 pr-10">
                      <h3 className="font-r-editorial text-[22px]/[28px] font-bold text-r-ink">{section.title}</h3>
                      <p className="font-sans text-[16px]/[25px] font-medium text-r-ink-700">{section.description}</p>
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

import { Reveal } from "@/components/recitals/Motion";
import { LETTERFORMS, Letterform } from "@/components/recitals/Letterforms";
import { MarginMark, SectionGlow, SectionGround } from "@/components/recitals/Ornaments";
import { SectionHead } from "@/components/recitals/Parts";
import { issueSections } from "@/data/magazine";

/*
 * What is in every issue.
 *
 * The card is paper and ink after the Indian sites that do this well — The Hindu and
 * Nicobar keep their interface almost colourless and let type and imagery carry the
 * feeling. So: white, a hairline, a 12px radius, no shadow. Colour appears twice and
 * small — the numeral, and a painted stroke struck under the title.
 *
 * The mark in the corner is a letterform from a different Indian script on each card,
 * drawn as an outline rather than set as text. It is a mark, not a label: nobody has to
 * read it for the card to work, which is why it can carry what a Devanagari numeral could
 * not — those are not read outside the Hindi-speaking states, and this page is read
 * everywhere.
 *
 * The cards stack. The heading holds still while each one rises, parks, and is covered by
 * the next. No entrance animation: a transform on a wrapper fights sticky positioning.
 */

/** Where the first card parks, clear of the floating nav. */
const PARK = 128;
/** How far each card stops short of the one before, so its edge stays visible. */
const STEP = 22;

export default function InsideIssue() {
  return (
    <section id="inside" className="relative bg-[#ffefd5]" aria-labelledby="inside-h">
      <SectionGround tint={0.2} />
      <SectionGlow at="top right" strength={0.4} />
      {/* A figure in the margin, struck faint. The section is not clipped: overflow-hidden
          here would turn it into a scroll container and break the sticky stack inside. */}
      <MarginMark src="/recitals/mark-konark.webp" className="bottom-10 left-4" size={370} opacity={0.24} />
      <MarginMark src="/recitals/mark-indiagate.webp" className="bottom-6 right-6" size={330} opacity={0.18} />
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
         * The runway below the stack is a real element, not padding on this column.
         *
         * A sticky card is clamped to its container's CONTENT edge, so padding-bottom
         * buys no hold whatsoever: the completed stack was being dragged back up the
         * instant it formed, which is the lurch this section had. The hold the finished
         * stack gets is exactly the spacer's height, so 220px is a deliberate figure,
         * not a guess.
         */}
        <div className="relative min-w-0 flex-1">
          {issueSections.map((section, i) => (
            <div key={section.title} className="sticky" style={{ top: PARK + i * STEP, zIndex: i + 1 }}>
              <article className="relative mb-6 overflow-hidden rounded-xl border-[0.8px] border-[#2e1a0e]/10 bg-white">
                <span
                  className="pointer-events-none absolute -top-5 right-9 block h-[170px] text-[#fe5a1d] opacity-[.16]"
                  aria-hidden="true"
                >
                  <Letterform script={LETTERFORMS[i % LETTERFORMS.length]} className="h-full w-auto" />
                </span>

                <div className="relative flex flex-col gap-3 py-7 pr-[260px] pl-7">
                  <span className="font-r-display text-[22px]/[28px] font-extrabold text-[#fe5a1d]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="relative w-fit font-r-editorial text-[25px]/[32px] font-bold text-[#2e1a0e]">
                    {/*
                     * A painted stroke, not a drawn one. The bristle texture and frayed
                     * ends are what make it read as paint, and no bezier has them.
                     * Multiply drops the white it was painted on, so it lands on the card
                     * without carrying a box around with it.
                     */}
                    <span
                      className="pointer-events-none absolute -bottom-4 -left-3.5 h-[58px] w-[calc(100%+40px)] mix-blend-multiply"
                      style={{
                        backgroundImage: "url(/recitals/brush-bar.png)",
                        backgroundSize: "100% 100%",
                        backgroundRepeat: "no-repeat",
                      }}
                      aria-hidden="true"
                    />
                    <span className="relative">{section.title}</span>
                  </h3>

                  <p className="font-sans text-[16px]/[25px] font-medium text-[#2e1a0e]/65">{section.description}</p>
                </div>
              </article>
            </div>
          ))}
          <div className="h-[220px]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

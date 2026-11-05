import { Reveal } from "@/components/recitals/Motion";
import { SectionGround } from "@/components/recitals/Ornaments";
import { SectionHead } from "@/components/recitals/Parts";
import { issueSections } from "@/data/magazine";

/*
 * What is in every issue.
 *
 * The cards are the magazine's own contents entries, not boxes with a bullet in them: a
 * folio column carrying the part number, a rule, then the entry itself. Each part is a
 * whole colour field the way a section divider is printed in a magazine, alternating deep
 * and light down the stack — so a card is recognisable from the strip of its edge once the
 * next one has covered it, and the five of them read as a publication rather than as a
 * list of features.
 *
 * They stack: the heading holds still while each card rises, parks, and is covered by the
 * next. No entrance animation — a transform on a wrapper fights sticky positioning.
 */

type Tone = { bg: string; fg: string; body: string; rule: string; folio: string };

/** Deep, light, deep, light, deep — the way a run of section dividers is printed. */
const TONES: Tone[] = [
  { bg: "#a8341a", fg: "#fff4e4", body: "#ffe3c6", rule: "rgba(255,244,228,.3)", folio: "rgba(255,244,228,.45)" },
  { bg: "#ffe0ab", fg: "#6b2a0e", body: "#8a4318", rule: "rgba(107,42,14,.24)", folio: "rgba(107,42,14,.34)" },
  { bg: "#c0532a", fg: "#fff4e4", body: "#ffe3c6", rule: "rgba(255,244,228,.3)", folio: "rgba(255,244,228,.45)" },
  { bg: "#f2c75c", fg: "#67290d", body: "#833f16", rule: "rgba(103,41,13,.24)", folio: "rgba(103,41,13,.34)" },
  { bg: "#7c2a11", fg: "#fff4e4", body: "#ffdcbb", rule: "rgba(255,244,228,.28)", folio: "rgba(255,244,228,.4)" },
];

const WORDS = ["One", "Two", "Three", "Four", "Five"];

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

        <div className="relative min-w-0 flex-1 pb-[10vh]">
          {issueSections.map((section, i) => {
            const tone = TONES[i % TONES.length];
            return (
              <div key={section.title} className="sticky" style={{ top: PARK + i * STEP, zIndex: i + 1 }}>
                <article
                  className="mb-6 flex items-stretch overflow-hidden shadow-[0_26px_46px_-34px_rgba(94,27,16,.6)]"
                  style={{ backgroundColor: tone.bg }}
                >
                  {/* The folio column, as a contents page sets it. */}
                  <div
                    className="flex w-[116px] shrink-0 flex-col justify-between py-6 pr-5 pl-7"
                    style={{ borderRight: `1px solid ${tone.rule}` }}
                  >
                    <span
                      className="font-sans text-[10px]/[14px] font-semibold tracking-[.2em] uppercase"
                      style={{ color: tone.folio }}
                    >
                      Part {WORDS[i]}
                    </span>
                    <span
                      className="font-r-display text-[52px]/[46px] font-extrabold"
                      style={{ color: tone.fg }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-2.5 px-8 py-7">
                    <h3 className="font-r-editorial text-[25px]/[31px] font-bold" style={{ color: tone.fg }}>
                      {section.title}
                    </h3>
                    <p className="font-sans text-[16px]/[25px] font-medium" style={{ color: tone.body }}>
                      {section.description}
                    </p>
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

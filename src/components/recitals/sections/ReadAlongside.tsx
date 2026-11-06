import { ArrowRightXsIcon } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/recitals/Motion";
import { MarginMark, RosetteMark, SectionGlow, SectionGround } from "@/components/recitals/Ornaments";
import { SectionHead } from "@/components/recitals/Parts";
import { collections } from "@/data/magazine";

/*
 * The other free collections.
 *
 * Placed after the argument rather than before it: someone who has just decided the
 * magazine is worth their time is the right person to tell about the rest.
 *
 * Each card carries a drawing of what its collection is actually about, because the four
 * of them were previously identical but for a generic outline icon — a book, a notebook,
 * a cap, a chart — which told a reader nothing and left the row reading as a wireframe.
 * The drawings are reportage sketches, each in one ink, dropped onto a tinted band with
 * multiply so the paper they were drawn on disappears into the band. The tint is taken
 * from the drawing's own ink, which is what stops the row being four identical cards
 * again in a different way.
 *
 * They are original drawings of the subject matter — fields and a panchayat platform,
 * village infrastructure, revision cards, answer booklets. Yojana and Kurukshetra are
 * real government magazines and nothing here imitates their covers or their mastheads.
 */

type Plate = { art: string; band: string; ink: string };

const PLATES: Plate[] = [
  /* Yojana — development schemes: village works, power, water. */
  { art: "/recitals/read-yojana.webp", band: "linear-gradient(165deg,#fff4e6,#ffdfc0)", ink: "#b8470b" },
  /* Kurukshetra — rural development, agriculture, the panchayat. */
  { art: "/recitals/read-kurukshetra.webp", band: "linear-gradient(165deg,#f3f8ea,#dcebc9)", ink: "#2c6b1c" },
  /* Prelims Quick Revision — the last six weeks. */
  { art: "/recitals/read-prelims.webp", band: "linear-gradient(165deg,#fff7e4,#ffeabc)", ink: "#c46210" },
  /* GS Mains Probable — answer writing against the clock. */
  { art: "/recitals/read-mains.webp", band: "linear-gradient(165deg,#eff2fc,#dbe2f7)", ink: "#2b3a7a" },
];

export default function ReadAlongside() {
  return (
    <section id="alongside" className="relative overflow-hidden bg-[#ffefd5]" aria-labelledby="alongside-h">
      <SectionGround tint={0.2} />
      <SectionGlow at="top left" strength={0.42} />
      <MarginMark src="/recitals/mark-lion.webp" className="bottom-6 right-6" size={340} opacity={0.2} />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-20 py-24">
        <Reveal>
          <SectionHead
            id="alongside-h"
            eyebrow="Read alongside"
            title="Four more free collections on this site"
            lead="Between them they cover the ground The Recitals deliberately leaves out, and all of them are free in the same way."
          />
        </Reveal>

        <Stagger className="grid grid-cols-4 gap-6" gap={0.07}>
          {collections.map((collection, i) => {
            const plate = PLATES[i % PLATES.length];
            return (
              <StaggerItem key={collection.title}>
                <article className="group/col flex h-full flex-col overflow-hidden rounded-xl border-[0.8px] border-[#2e1a0e]/12 bg-[#fffbf2] [transition:translate_.4s_var(--ease-settle),box-shadow_.4s_var(--ease-settle)] hover:-translate-y-1 hover:shadow-[0_24px_44px_-26px_rgba(94,27,16,.45)]">
                  <div className="relative h-[164px] shrink-0 overflow-hidden" style={{ background: plate.band }}>
                    <div
                      className="absolute inset-0 bg-contain bg-center bg-no-repeat mix-blend-multiply [transition:scale_.6s_var(--ease-settle)] group-hover/col:scale-[1.05]"
                      style={{ backgroundImage: `url(${plate.art})` }}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-5 p-6">
                    <div className="flex flex-1 flex-col gap-2.5">
                      <h3 className="font-r-editorial text-[20px]/[27px] font-bold text-r-ink">{collection.title}</h3>
                      <p className="font-sans text-[15px]/[23px] font-medium text-r-ink-700">{collection.body}</p>
                    </div>

                    <div
                      className="flex items-center gap-3 border-t border-r-line pt-4"
                      style={{ color: plate.ink }}
                    >
                      <RosetteMark size={12} className="text-r-amber" />
                      <a href="#" className="flex items-center gap-1.5 font-sans text-[14px]/[20px] font-semibold">
                        {collection.cta}
                        <ArrowRightXsIcon className="transition-transform duration-300 group-hover/col:translate-x-0.5" />
                      </a>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

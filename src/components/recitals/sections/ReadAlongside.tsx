import { ArrowRightXsIcon, GraduationCapIcon, NotebookIcon, OpenBookIcon, TrendIcon } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/recitals/Motion";
import { DiamondMark, doubleRule } from "@/components/recitals/Ornaments";
import { SectionHead } from "@/components/recitals/Parts";
import { collections } from "@/data/magazine";
import { cx } from "@/lib/cx";

/*
 * The other free collections.
 *
 * Placed after the argument rather than before it: someone who has just decided the
 * magazine is worth their time is the right person to tell about the rest. Four cards,
 * same frame as the issue cards so the page keeps one vocabulary.
 */

const ICONS = [OpenBookIcon, NotebookIcon, GraduationCapIcon, TrendIcon];

export default function ReadAlongside() {
  return (
    <section id="alongside" className="relative bg-r-paper" aria-labelledby="alongside-h">
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
            const Icon = ICONS[i % ICONS.length];
            return (
              <StaggerItem key={collection.title}>
                <article
                  className={cx(
                    "group/col flex h-full flex-col gap-5 bg-r-paper p-6",
                    "[transition:translate_.4s_var(--ease-settle),box-shadow_.4s_var(--ease-settle)] hover:-translate-y-1",
                    doubleRule,
                    "hover:shadow-[inset_0_0_0_1px_var(--color-r-line),inset_0_0_0_4px_var(--color-r-paper),inset_0_0_0_5px_var(--color-r-amber),0_20px_36px_-24px_rgba(94,27,16,.4)]",
                  )}
                >
                  <span className="flex size-12 items-center justify-center bg-r-sand text-r-rust shadow-[inset_0_0_0_1px_rgba(94,27,16,.12)]">
                    <Icon />
                  </span>

                  <div className="flex flex-1 flex-col gap-2.5">
                    <h3 className="font-r-editorial text-[20px]/[27px] font-bold text-r-ink">{collection.title}</h3>
                    <p className="font-sans text-[15px]/[23px] font-medium text-r-ink-700">{collection.body}</p>
                  </div>

                  <div className="flex items-center gap-3 border-t border-r-line pt-4">
                    <DiamondMark size={5} className="text-r-amber" />
                    <a href="#" className="flex items-center gap-1.5 font-sans text-[14px]/[20px] font-semibold text-r-rust">
                      {collection.cta}
                      <ArrowRightXsIcon className="transition-transform duration-300 group-hover/col:translate-x-0.5" />
                    </a>
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

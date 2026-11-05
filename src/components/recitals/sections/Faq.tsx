"use client";

import { useState } from "react";
import { PlusMinusIcon } from "@/components/icons";
import { DiamondMark } from "@/components/recitals/Ornaments";
import { SectionHead } from "@/components/recitals/Parts";
import { magazineFaqs } from "@/data/magazine";
import { cx } from "@/lib/cx";

/*
 * Questions, answered.
 *
 * One answer open at a time, the first one open on arrival, so the section never looks like
 * a row of locked doors. The marks on the left are the page's lozenge, not a chevron, which
 * keeps the ornament consistent with the cards above.
 */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-r-cream" aria-labelledby="faq-h">
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center gap-12 px-20 py-24">
        <SectionHead id="faq-h" eyebrow="FAQ" title="Questions, answered" center />

        <div className="flex w-[940px] flex-col">
          {magazineFaqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.question} className="border-b border-r-line first:border-t first:border-t-r-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  id={`faq-q-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group/q flex w-full items-center gap-5 py-6 text-left"
                >
                  <DiamondMark
                    size={6}
                    className={cx("shrink-0 transition-colors duration-300", isOpen ? "text-r-rust" : "text-r-amber")}
                  />
                  <span
                    className={cx(
                      "min-w-0 flex-1 font-r-editorial text-[19px]/[27px] transition-colors duration-200",
                      isOpen ? "font-bold text-r-ink" : "text-r-ink group-hover/q:text-r-rust",
                    )}
                  >
                    {item.question}
                  </span>
                  <PlusMinusIcon open={isOpen} />
                </button>

                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={cx(
                    "grid transition-[grid-template-rows] duration-400 ease-[var(--ease-settle)]",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pr-12 pb-6 pl-11 font-sans text-[16px]/[26px] font-medium text-r-ink-700">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

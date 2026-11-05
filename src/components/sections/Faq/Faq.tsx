"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus } from "iconoir-react";
import { faq } from "@/data/home";
import { Lozenge } from "@/components/ui/Ornaments";
import { cx } from "@/lib/cx";
import SplitHeading from "@/components/ui/SplitHeading";

/** The lozenge's colour under the heading, the gilt of the faculty heading. */
const GILT = "#c9a96a";

/**
 * Frequently asked questions, after the design (3356:12948) set in the site's type: the heading centred in the
 * headline serif with a gilt lozenge under it, then the questions between fine rules, each with its number, the
 * question in the headline serif and a dark square button that opens its answer in Noto Serif. One answer is open at
 * a time, the first to begin with. It all sits on a card over a photo of a study desk by a jaali window.
 */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-title" className="px-10 pb-32 text-brown-950">
      <div className="relative isolate overflow-hidden rounded-[32px] py-24">
        {/* A study desk by a jaali window, washed over with cream so the questions read clearly on it. */}
        <Image src={faq.backdrop} alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#faf6ef]/85" />
        <div className="mx-auto w-[1180px]">
          <div data-reveal className="flex flex-col items-center">
            <h2
              data-split
              id="faq-title"
              className="font-serif text-[50px]/[1.08] font-normal tracking-[-0.02em] [font-variation-settings:'SOFT'_0,'WONK'_0]"
            >
              <SplitHeading text={faq.heading} />
            </h2>
            <Lozenge colour={GILT} className="mt-4" />
          </div>

          <ul data-reveal-group className="mt-14">
            {faq.list.map((item, i) => {
              const isOpen = open === i;
              const toggle = () => setOpen(isOpen ? null : i);
              return (
                <li key={item.question} className="flex items-start border-b border-brown-950/15 py-7">
                  <span className="w-[168px] shrink-0 pt-2.5 font-noto-serif text-[14px]/[20px] text-brown-950/60">
                    {String(i + 1).padStart(2, "0")}/
                  </span>
                  <div className="flex-1 pt-1.5 pr-[120px]">
                    <h3>
                      <button
                        type="button"
                        id={`faq-question-${i}`}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${i}`}
                        onClick={toggle}
                        className="text-left font-serif text-[24px]/[30px] font-normal [font-variation-settings:'SOFT'_0,'WONK'_0]"
                      >
                        {item.question}
                      </button>
                    </h3>
                    {/* The answer opens to its own height. */}
                    <div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      className={cx(
                        "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="pt-4 font-noto-serif text-[17px]/[28px] text-brown-950/75">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                  {/* The square button does the same as the question; screen readers get the question's button. */}
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={toggle}
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brown-950 text-white transition-colors hover:bg-amber"
                  >
                    {isOpen ? <Minus width={20} height={20} /> : <Plus width={20} height={20} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

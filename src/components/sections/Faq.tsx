"use client";

import { useState } from "react";
import { Plus } from "iconoir-react";
import { faq } from "@/data/content";
import SectionIntro from "@/components/ui/SectionIntro";
import { cx } from "@/lib/cx";

/**
 * The FAQs, on white: the intro and the topics (the institute, programmes, preparation, batches and admissions) as
 * a list of tabs, each with its number of questions, and beside them the chosen topic's questions in a ruled
 * accordion that opens one answer at a time.
 */
export default function Faq() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const list = faq.tabs[tab].list;

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-[76px] bg-white py-32">
      <div className="mx-auto grid w-canvas grid-cols-[440px_1fr] gap-20 px-12">
        <div>
          <SectionIntro id="faq-title" eyebrow={faq.eyebrow} headline={faq.headline} />
          <p className="mt-6 text-[18px]/[29px] text-muted">{faq.description}</p>

          <div role="tablist" aria-label="Topics" aria-orientation="vertical" className="mt-10 flex flex-col gap-2">
            {faq.tabs.map((t, i) => (
              <button
                key={t.name}
                type="button"
                role="tab"
                aria-selected={i === tab}
                onClick={() => {
                  setTab(i);
                  setOpen(0);
                }}
                className={cx(
                  "flex h-14 items-center justify-between rounded-[16px] px-6 text-left text-[16px] font-semibold transition-colors",
                  i === tab ? "ember-pill text-white" : "bg-paper text-ink-900/75 hover:text-ink-900",
                )}
              >
                {t.name}
                <span className={cx("text-[14px] tabular-nums", i === tab ? "text-white/90" : "text-muted")}>
                  {t.list.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <ul key={tab} className="stage-in border-t border-line">
            {list.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${tab}-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${tab}-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-8 py-7 text-left"
                    >
                      <span className="font-serif text-[30px]/[1.2] text-ink-900">{item.q}</span>
                      <span
                        className={cx(
                          "flex size-11 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,rotate] duration-300",
                          isOpen
                            ? "rotate-45 border-saffron-500 bg-saffron-500 text-white"
                            : "border-ink-900/20 text-ink-900",
                        )}
                      >
                        <Plus width={20} height={20} strokeWidth={1.8} />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${tab}-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${tab}-${i}`}
                    className={cx(
                      "grid transition-[grid-template-rows] duration-400 ease-out-soft",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[720px] pb-8 text-[18px]/[29px] text-muted">{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { Reveal } from "@/components/recitals/Motion";
import { faqIntro, faqs } from "@/data/new-home";
import { cx } from "@/lib/cx";
import { Button, Container, Eyebrow, Heading, Lead } from "./ui";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

/*
 * 10 — Frequently asked questions.
 *
 * The heading and the way out ("Still have questions?") stay pinned on the left while the
 * nine questions scroll past them. Any number can be open at once; the first starts open so
 * the pattern is obvious.
 */
export default function Faq() {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const reduce = useReducedMotion();
  const base = useId();

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-v-cream py-24 lg:py-32">
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow>{faqIntro.eyebrow}</Eyebrow>
            <Heading id="faq-title" className="mt-5 text-v-ink">
              {faqIntro.heading}
            </Heading>
            <Lead className="mt-6 text-v-ink-700">{faqIntro.description}</Lead>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 rounded-[26px] bg-v-orange-500 p-7 text-v-ink">
            <p className="font-v-head text-[24px]/[1.15] font-extrabold">{faqIntro.more.heading}</p>
            <p className="mt-2 font-v-body text-[16.5px]/[1.5] font-medium">{faqIntro.more.text}</p>
            <Button href={faqIntro.more.cta.href} variant="ink" className="mt-6">
              {faqIntro.more.cta.label}
            </Button>
          </Reveal>
        </div>

        <ul className="border-t-2 border-v-ink">
          {faqs.map((f, i) => {
            const isOpen = open.has(i);
            return (
              <li key={f.question} className="border-b border-v-line">
                <h3>
                  <button
                    type="button"
                    id={`${base}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${base}-a${i}`}
                    onClick={() => toggle(i)}
                    className="group flex w-full items-start gap-5 rounded-[14px] py-6 text-left"
                  >
                    <span className="w-7 shrink-0 pt-1 font-v-head text-[15px] font-extrabold text-v-orange-600 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-v-head text-[clamp(19px,1.6vw,22px)]/[1.3] font-bold text-v-ink transition-colors duration-200 group-hover:text-v-orange-600">
                      {f.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cx(
                        "grid size-9 shrink-0 place-items-center rounded-full border-2 transition-[background-color,border-color,transform] duration-300 ease-v-out",
                        isOpen ? "rotate-45 border-v-orange-500 bg-v-orange-500 text-v-ink" : "border-v-line text-v-ink group-hover:border-v-orange-500",
                      )}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`${base}-a${i}`}
                      role="region"
                      aria-labelledby={`${base}-q${i}`}
                      className="overflow-hidden"
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1, transition: { duration: 0.35, ease: EASE } }}
                      exit={reduce ? undefined : { height: 0, opacity: 0, transition: { duration: 0.22, ease: EASE } }}
                    >
                      <p className="max-w-[72ch] pr-14 pb-7 pl-12 font-v-body text-[17px]/[1.6] text-v-ink-700">{f.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

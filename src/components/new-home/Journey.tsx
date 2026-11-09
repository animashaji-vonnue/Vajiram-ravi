"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type KeyboardEvent, useId, useRef, useState } from "react";
import { Reveal } from "@/components/recitals/Motion";
import { journey, stages } from "@/data/new-home";
import { cx } from "@/lib/cx";
import { Button, Container, Eyebrow, Flower, Heading, Lead } from "./ui";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

/*
 * 02 — The preparation journey.
 *
 * Three stages, one at a time. Each stage has six or seven pieces of content, so showing all
 * three together is a wall of twenty; the stage switcher keeps one stage in view and the
 * sequence (01 → 02 → 03) visible above it.
 */
export default function Journey() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = stages[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = stages.length - 1;
    let next = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="journey" aria-labelledby="journey-title" className="relative bg-v-cream py-24 lg:py-32">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
          <Reveal>
            <Eyebrow>{journey.eyebrow}</Eyebrow>
            <Heading id="journey-title" className="mt-5 max-w-[17ch] text-v-ink">
              {journey.heading}
            </Heading>
          </Reveal>
          <Reveal delay={0.1}>
            <Lead className="text-v-ink-700">{journey.description}</Lead>
          </Reveal>
        </div>

        <div role="tablist" aria-label="Examination stages" className="mt-14 grid gap-3 sm:grid-cols-3">
          {stages.map((s, i) => {
            const selected = i === active;
            return (
              <button
                key={s.number}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${base}-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${base}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKey}
                className={cx(
                  "group relative isolate flex items-center gap-4 rounded-[22px] px-5 py-4 text-left transition-colors duration-200 [border-radius:22px] focus-visible:[border-radius:22px] sm:flex-col sm:items-start sm:gap-6 sm:px-6 sm:py-5",
                  selected ? "text-v-ink" : "bg-v-paper text-v-ink-700 hover:bg-v-sand/60 hover:text-v-ink",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId="stage-fill"
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-[22px] bg-v-orange-500 shadow-[0_24px_40px_-26px_rgba(168,60,7,0.8)]"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }}
                  />
                ) : null}
                <span className="flex shrink-0 items-center justify-between sm:w-full">
                  <span className="font-v-head text-[clamp(34px,3vw,46px)] leading-[0.8] font-extrabold tracking-[-0.03em]">{s.number}</span>
                  {i < stages.length - 1 ? (
                    <svg width="34" height="12" viewBox="0 0 34 12" aria-hidden="true" className={cx("hidden sm:block", selected ? "text-v-ink" : "text-v-orange-500")}>
                      <path d="M0 6h31M26 1l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <Flower size={16} className={cx("hidden sm:block", selected ? "text-v-ink" : "text-v-orange-500")} />
                  )}
                </span>
                <span className="flex flex-col">
                  <span className="font-v-body text-[12.5px] font-bold tracking-[0.14em] uppercase">Stage {s.number}</span>
                  <span className="font-v-head text-[clamp(20px,1.8vw,26px)]/[1.1] font-bold">{s.name}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${active}`}
          className="mt-4 overflow-hidden rounded-[28px] bg-v-paper shadow-[0_1px_0_var(--color-v-line),0_30px_60px_-40px_rgba(90,32,4,0.35)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stage.number}
              className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:p-14"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } }}
              exit={reduce ? undefined : { opacity: 0, y: -8, transition: { duration: 0.18, ease: EASE } }}
            >
              <div className="flex flex-col items-start">
                <p className="font-v-body text-[13px] font-bold tracking-[0.16em] text-v-orange-600 uppercase">
                  Stage {stage.number} · {stage.name}
                </p>
                <Heading as="h3" className="mt-4 max-w-[20ch] text-v-ink">
                  {stage.heading}
                </Heading>
                <p className="mt-5 max-w-[58ch] font-v-body text-[17.5px]/[1.6] text-v-ink-700">{stage.description}</p>

                <p className="mt-8 font-v-body text-[13px] font-bold tracking-[0.14em] text-v-ink-500 uppercase">
                  {stage.programmes.length > 1 ? "Relevant programmes" : "Relevant programme"}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {stage.programmes.map((p) => (
                    <li key={p} className="rounded-full bg-v-sand/70 px-3.5 py-1.5 font-v-body text-[14.5px] font-semibold text-v-ink">
                      {p}
                    </li>
                  ))}
                </ul>

                <Button href={stage.cta.href} className="mt-9">
                  {stage.cta.label}
                </Button>
              </div>

              <div className="lg:border-l lg:border-v-line lg:pl-16">
                <p className="font-v-head text-[22px]/[1.2] font-bold text-v-ink">How Vajiram supports your preparation</p>
                <ul className="mt-5">
                  {stage.support.map((item, i) => (
                    <motion.li
                      key={item}
                      className="flex items-start gap-4 border-t border-v-line py-4 font-v-body text-[17px]/[1.45] text-v-ink first:border-t-0"
                      initial={reduce ? false : { opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: EASE }}
                    >
                      <span className="mt-[3px] grid size-[22px] shrink-0 place-items-center rounded-full bg-v-orange-500 text-v-ink">
                        <Flower size={11} />
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <Reveal className="mt-14">
          <p className="mx-auto flex max-w-[52ch] items-center justify-center gap-4 text-center font-v-body text-[clamp(19px,1.6vw,23px)]/[1.45] text-v-ink-700 italic">
            <Flower size={14} className="hidden shrink-0 text-v-orange-500 sm:block" />
            {journey.closing}
            <Flower size={14} className="hidden shrink-0 text-v-orange-500 sm:block" />
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

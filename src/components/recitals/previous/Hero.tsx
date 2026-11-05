"use client";

/*
 * KEPT COPY — the hero as it stood before the Figma “Hero · 2b” rebuild (4 Nov 2026).
 *
 * Nothing imports this. It is here so the earlier direction can be looked at or pulled
 * back from without digging through git: full-bleed warm ground with a flat sun disc,
 * newsprint down both margins, a monument skyline, the covers above the masthead, and the
 * three figures in a band across the foot.
 *
 * Its background lives beside it in this folder, so editing the live HeroBackground does
 * not change what this renders.
 */

import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";
import { ArrowRightIcon, ChevronRightSmIcon, DownloadIcon } from "@/components/icons";
import CoverFan from "@/components/recitals/CoverFan";
import HeroBackground from "@/components/recitals/previous/HeroBackground";
import { Counter } from "@/components/recitals/Motion";
import { FlowerMark } from "@/components/recitals/Ornaments";
import { latestIssue } from "@/data/magazine";

/*
 * Hero.
 *
 * The issues come first, not the words. On load the covers open out of a single stack with
 * the newest in front, and only then does the masthead rise under them, so the page
 * introduces itself the way a magazine does: the object, then its name.
 *
 * The three figures used to sit in the middle of that stack, which made the whole thing read
 * as a list. They are now a band along the hero's base, standing on the ochre floor, where
 * they act as evidence under the offer rather than another line of copy inside it.
 *
 * Height is tied to the window, not to a fixed frame, so it lands above the fold from a
 * 1366 × 768 laptop upwards.
 */

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const crumbs = [
  { label: "Home", href: "/" },
  { label: "Study materials", href: "/#resources" },
];

const STATS = [
  { to: 600, suffix: "+", label: "Prelims MCQs a year" },
  { to: 600, suffix: "+", label: "Mains Q&A a year" },
  { to: 5, suffix: "", label: "Sections in every issue" },
];

export default function HeroPrevious() {
  const reduce = useReducedMotion();
  /** Everything under the fan rises after it has opened. */
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section id="latest" className="relative isolate flex min-h-[calc(100svh-114px)] flex-col overflow-hidden" aria-labelledby="recitals-h">
      <HeroBackground />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center px-20">
        <nav
          className="flex w-full items-center gap-1.5 pt-[clamp(8px,1.6vh,18px)] font-sans text-[13px]/[16px] font-medium text-[#3b1a0a]/60"
          aria-label="Breadcrumb"
        >
          {crumbs.map((crumb) => (
            <Fragment key={crumb.label}>
              <a href={crumb.href} className="transition-colors duration-200 hover:text-[#3b1a0a]">
                {crumb.label}
              </a>
              <ChevronRightSmIcon className="opacity-50" />
            </Fragment>
          ))}
          <span className="text-[#3b1a0a]/90" aria-current="page">
            The Recitals – Monthly Magazine
          </span>
        </nav>

        <div className="flex flex-1 flex-col items-center justify-center gap-[clamp(12px,2.4vh,30px)] py-[clamp(6px,1.4vh,20px)] text-center">
          {/* 1. The issues open out of a stack. */}
          <CoverFan />

          {/*
           * 2. The masthead rises under them, wiped up from behind its own edge rather than
           * faded in, so the name arrives the way a line of print does.
           */}
          <div className="flex flex-col items-center gap-1">
            <span className="block overflow-hidden py-[0.08em]">
              <motion.p
                className="font-sans text-[clamp(13px,1.1vw,16px)]/[1.3] font-semibold tracking-[.16em] text-[#b4430c] uppercase"
                initial={reduce ? false : { y: "130%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.75, delay: 1.1, ease: EASE }}
              >
                Monthly Current Affairs Magazine for UPSC
              </motion.p>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.h1
                id="recitals-h"
                className="font-r-masthead text-[clamp(46px,min(7.6vw,11.5vh),120px)]/[1] tracking-[-.02em] text-[#1c1209]"
                initial={reduce ? false : { y: "118%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, delay: 1.18, ease: EASE }}
              >
                The{" "}
                <span className="bg-[linear-gradient(100deg,#ef8a2b,#c04e11)] bg-clip-text italic text-transparent">
                  Recitals
                </span>
              </motion.h1>
            </span>
          </div>

          {/* 3. Then the sentence and the actions. */}
          <motion.p
            className="max-w-[600px] font-sans text-[clamp(15px,1.2vw,17px)]/[1.5] font-normal text-[#3b1a0a]/75"
            {...rise(1.42)}
          >
            A month of news, rewritten the way UPSC asks it — Prelims MCQs, Mains model answers and an ethics case study.
          </motion.p>

          <motion.div className="flex items-center gap-3" {...rise(1.56)}>
            <a
              href={latestIssue.pdf}
              className="group/btn inline-flex h-[clamp(42px,5vh,51px)] items-center gap-2.5 rounded-full bg-[linear-gradient(100deg,#f3831f,#dd5f12)] px-7 font-sans text-[15px]/[20px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(176,62,10,.55)] transition-shadow duration-300 hover:shadow-[0_14px_28px_-10px_rgba(176,62,10,.7)]"
            >
              Read {latestIssue.month} {latestIssue.year}
              <ArrowRightIcon className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </a>
            <a
              href="#archive"
              className="inline-flex h-[clamp(42px,5vh,51px)] items-center gap-2.5 rounded-full bg-white/55 px-6 font-sans text-[15px]/[20px] font-semibold text-[#1c1209] shadow-[inset_0_0_0_1px_rgba(60,26,10,.14)] transition-colors duration-250 hover:bg-white/80"
            >
              <DownloadIcon className="size-[18px]" />
              All 89 issues
            </a>
          </motion.div>
        </div>
      </div>

      {/* 4. The base band: the figures, standing on the floor of the hero. */}
      <motion.div
        className="relative w-full border-t border-[#8a5a2b]/18 bg-[#fdf3e0]/45 backdrop-blur-[2px]"
        {...rise(1.7)}
      >
        <dl className="mx-auto grid w-full max-w-[1440px] grid-cols-3 px-20">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="relative flex items-center justify-center gap-3 py-[clamp(10px,1.8vh,18px)]"
            >
              {i > 0 && (
                <span className="absolute top-1/2 left-0 flex -translate-y-1/2 items-center" aria-hidden="true">
                  <FlowerMark size={10} className="-translate-x-1/2 text-r-amber" />
                </span>
              )}
              <dd className="font-r-masthead text-[clamp(26px,2.3vw,34px)]/[1.05] text-[#9c3b10]">
                <Counter to={stat.to} suffix={stat.suffix} />
              </dd>
              <dt className="font-sans text-[clamp(11px,0.85vw,12.5px)]/[1.4] font-semibold tracking-[.14em] text-[#3b1a0a]/65 uppercase">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}

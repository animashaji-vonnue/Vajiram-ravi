"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, DownloadIcon } from "@/components/icons";
import CoverFan from "@/components/recitals/CoverFan";
import HeroBackground from "@/components/recitals/HeroBackground";
import { Underline } from "@/components/recitals/Ornaments";
import { latestIssue } from "@/data/magazine";

/*
 * Hero (Figma: Hero · 2b — Study collage).
 *
 * The words come first, on paper, where dark type reads perfectly. The covers come second
 * and stand low, in the colour. That order is the opposite of what this section used to do,
 * and it is the only arrangement in which a saturated ground and serious reading matter can
 * share one screen.
 *
 * The three figures that used to close the hero have gone. They return further down the
 * page as their own moment, which is the right place for something that animates in.
 */

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section
      id="latest"
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
      aria-labelledby="recitals-h"
    >
      <HeroBackground />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-end gap-[clamp(14px,2.6vh,30px)] px-20 pt-[calc(78px+clamp(36px,7vh,116px))] pb-[clamp(26px,4.8vh,50px)] text-center">
        {/* 1. The masthead, on paper. */}
        <div className="flex flex-col items-center gap-[clamp(14px,2.1vh,24px)]">
          {/*
           * A marked phrase rather than a pill. A rounded chip with an icon in it is the
           * house style of every template on the internet, and it was the first thing on
           * the page — so it set the register for everything under it.
           */}
          <motion.span className="relative inline-block" {...rise(0.1)}>
            <span className="font-sans text-[clamp(13px,1.05vw,15px)]/[1.4] font-semibold text-[#8a3c10]">
              New issue every month
            </span>
            <Underline className="absolute -bottom-2 left-0 h-[10px] w-full text-[#e2650d]" />
          </motion.span>

          <div className="flex flex-col items-center gap-1">
            <span className="block overflow-hidden py-[0.08em]">
              <motion.p
                className="font-r-masthead text-[clamp(17px,1.5vw,22px)]/[1.3] text-[#9c3b10]"
                initial={reduce ? false : { y: "130%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
              >
                Monthly current affairs magazine for UPSC —
              </motion.p>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <motion.h1
                id="recitals-h"
                className="font-r-masthead text-[clamp(46px,min(7.6vw,11.5vh),120px)]/[1] tracking-[-.02em] text-[#1c1209]"
                initial={reduce ? false : { y: "118%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, delay: 0.28, ease: EASE }}
              >
                The <span className="text-[#a8401c] italic">Recitals</span>
              </motion.h1>
            </span>
          </div>

          <motion.p
            className="max-w-[600px] font-sans text-[clamp(15px,1.2vw,17px)]/[1.5] text-[#3b1a0a]/75"
            {...rise(0.52)}
          >
            A month of news, rewritten the way UPSC asks it — Prelims MCQs, Mains model answers and an ethics case study.
          </motion.p>
        </div>

        {/* 2. The actions, still on paper so the orange button has white to push against. */}
        <motion.div className="flex items-center gap-3" {...rise(0.66)}>
          <a
            href={latestIssue.pdf}
            className="group/btn inline-flex h-[clamp(42px,5vh,51px)] items-center gap-2.5 rounded-full bg-[linear-gradient(100deg,#f58a22,#e0620f)] px-7 font-sans text-[15px]/[20px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(176,62,10,.55)] transition-shadow duration-300 hover:shadow-[0_14px_28px_-10px_rgba(176,62,10,.7)]"
          >
            Read {latestIssue.month} {latestIssue.year}
            <ArrowRightIcon className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </a>
          <a
            href="#archive"
            className="inline-flex h-[clamp(42px,5vh,51px)] items-center gap-2.5 rounded-full bg-white px-6 font-sans text-[15px]/[20px] font-semibold text-[#8a3c10] shadow-[inset_0_0_0_1px_#edcba6] transition-colors duration-250 hover:bg-[#fff6ea]"
          >
            <DownloadIcon className="size-[18px]" />
            All {89} issues
          </a>
        </motion.div>

        {/* 3. The issues, standing in the colour. */}
        <CoverFan />
      </div>
    </section>
  );
}

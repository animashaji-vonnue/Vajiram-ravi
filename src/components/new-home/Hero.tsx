"use client";

import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { hero, heroRankers, type Ranker } from "@/data/new-home";
import { cx } from "@/lib/cx";
import { ArrowLink, Button, Container, Eyebrow, Flower, flowerPrint, Lead } from "./ui";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

/*
 * 01 — Outcome-led hero.
 *
 * Left: the promise and the two actions. Right: the proof, on the page's loudest orange.
 * The three rankers stand on a podium (2 · 1 · 3) inside arch-topped frames, and
 * "36 out of the Top 50" is drawn as fifty flowers with thirty-six filled, so the figure
 * is something you see as well as read.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const [before, accent, after] = hero.heading;
  // Each word gets its place in the whole heading, so the stagger runs straight through the accent.
  const split = (text: string) => text.split(/(?<=\s)/);
  const parts = [split(before), split(accent), split(after)];
  const offsets = [0, parts[0].length, parts[0].length + parts[1].length];

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-v-paper">
      {/* A low saffron sun behind the proof panel: warmth on the right, clean paper under the headline. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_88%_42%,rgba(255,171,94,0.32),transparent_62%)]"
      />

      <Container className="relative grid items-center gap-12 pt-8 pb-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:pt-12 lg:pb-24">
        <div className="flex flex-col items-start">
          <motion.div {...fade(0)}>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </motion.div>

          <h1
            id="hero-title"
            className="mt-6 font-v-head text-[clamp(42px,5.3vw,78px)]/[1.02] font-extrabold tracking-[-0.025em] text-v-ink"
          >
            {parts[0].map((t, i) => (
              <Word key={`b${i}`} text={t} index={offsets[0] + i} reduce={!!reduce} />
            ))}
            <span className="relative isolate inline-block whitespace-nowrap">
              <motion.svg
                aria-hidden="true"
                viewBox="0 0 300 40"
                preserveAspectRatio="none"
                className="absolute -inset-x-[3%] bottom-[0.1em] -z-10 h-[0.56em] w-[106%] origin-left text-v-orange-500"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
              >
                <path d="M3 17C52 9 120 6 190 8c40 1 74 3 107 7l-2 20c-58-5-140-6-206-3-31 1-60 4-86 7L3 17Z" fill="currentColor" />
              </motion.svg>
              {parts[1].map((t, i) => (
                <Word key={`a${i}`} text={t} index={offsets[1] + i} reduce={!!reduce} />
              ))}
            </span>
            {parts[2].map((t, i) => (
              <Word key={`c${i}`} text={t} index={offsets[2] + i} reduce={!!reduce} />
            ))}
          </h1>

          <motion.div {...fade(0.5)} className="mt-7">
            <Lead className="text-v-ink-700">{hero.description}</Lead>
          </motion.div>

          <motion.div {...fade(0.6)} className="mt-9 flex flex-wrap items-center gap-3">
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={hero.secondary.href} variant="outline">
              {hero.secondary.label}
            </Button>
          </motion.div>

          <motion.div {...fade(0.7)} className="mt-7">
            <ArrowLink href={hero.link.href}>{hero.link.label}</ArrowLink>
          </motion.div>
        </div>

        <ProofPanel />
      </Container>
    </section>
  );
}

/** One word of the heading, rising out of its own line like type set into a forme. */
function Word({ text, index, reduce }: { text: string; index: number; reduce: boolean }) {
  return (
    <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className="inline-block whitespace-pre"
        initial={reduce ? false : { y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.12 + index * 0.045, ease: EASE }}
      >
        {text}
      </motion.span>
    </span>
  );
}

function ProofPanel() {
  const reduce = useReducedMotion();
  const { count, of, text } = hero.achievement;
  const [shown, setShown] = useState(count);

  useEffect(() => {
    if (reduce) return;
    setShown(0);
    const controls = animate(0, count, {
      duration: 1.3,
      delay: 1.05,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [count, reduce]);

  // Podium order: 2 · 1 · 3.
  const podium = [heroRankers[1], heroRankers[0], heroRankers[2]];
  const order = { 1: 0.85, 2: 0.6, 3: 0.72 } as Record<number, number>;

  return (
    <motion.aside
      aria-label={`${hero.exam} results`}
      className="relative overflow-hidden rounded-[32px] bg-v-orange-500 p-5 text-v-ink shadow-[0_50px_90px_-50px_rgba(168,60,7,0.75)] sm:p-8"
      initial={reduce ? false : { opacity: 0, x: 40, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.95, delay: 0.25, ease: EASE }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={flowerPrint("rgba(255,255,255,0.16)")} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,194,61,0.55),transparent_70%)]"
      />

      <div className="relative">
        <p className="flex items-center justify-between font-v-body text-[13px] font-bold tracking-[0.16em] uppercase">
          <span>{hero.exam}</span>
          <span className="flex items-center gap-2">
            <Flower size={10} />
            Top ranks
          </span>
        </p>

        <ol className="mt-6 grid grid-cols-3 items-end gap-3 sm:gap-5">
          {podium.map((r) => (
            <RankerFigure key={r.rank} ranker={r} delay={order[r.rank]} />
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
          <p className="flex shrink-0 items-baseline gap-3 sm:flex-col sm:gap-1">
            <span className="font-v-head text-[clamp(72px,7vw,104px)]/[0.82] font-extrabold tracking-[-0.04em] text-v-paper tabular-nums">
              {shown}
            </span>
            <span className="font-v-head text-[20px]/[1.1] font-bold">
              out of the
              <br className="hidden sm:block" /> Top {of}
            </span>
          </p>

          <div aria-hidden="true" className="grid flex-1 grid-cols-10 gap-x-1 gap-y-1.5 sm:gap-x-1.5">
            {Array.from({ length: of }, (_, i) => (
              <motion.span
                key={i}
                className={cx("grid aspect-square place-items-center", i < count ? "text-v-ink" : "text-v-paper/35")}
                initial={reduce || i >= count ? false : { scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.05 + i * 0.034, ease: EASE }}
              >
                <Flower className="size-full" size={20} />
              </motion.span>
            ))}
          </div>
        </div>

        <p className="mt-5 max-w-[52ch] font-v-body text-[15px]/[1.5] font-medium">{text}</p>
      </div>
    </motion.aside>
  );
}

function RankerFigure({ ranker, delay }: { ranker: Ranker; delay: number }) {
  const reduce = useReducedMotion();
  const first = ranker.rank === 1;
  return (
    <li className={cx("flex flex-col", first && "-translate-y-4 sm:-translate-y-6")}>
      <div
        className={cx(
          "relative overflow-hidden rounded-t-full rounded-b-[18px] bg-v-cream",
          first ? "aspect-[3/4.1] ring-4 ring-v-ink/90" : "aspect-[3/3.7]",
        )}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_45%,#fff,transparent_75%)]" />
        <motion.img
          src={ranker.image}
          alt={ranker.name}
          width={560}
          height={560}
          className="absolute bottom-0 left-1/2 w-[118%] max-w-none -translate-x-1/2"
          initial={reduce ? false : { y: "35%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay, ease: EASE }}
        />
      </div>
      <p className="mt-3 flex items-baseline gap-1 font-v-head font-extrabold tracking-[-0.02em]">
        <span className="text-[13px] tracking-[0.1em]">AIR</span>
        <span className={cx("leading-none", first ? "text-[clamp(34px,3.2vw,48px)]" : "text-[clamp(28px,2.5vw,38px)]")}>{ranker.rank}</span>
      </p>
      <p className="mt-1 font-v-head text-[clamp(15px,1.25vw,18px)]/[1.15] font-bold">{ranker.name}</p>
      <p className="mt-1 font-v-body text-[12.5px]/[1.35] font-medium sm:text-[13px]">{ranker.programme}</p>
    </li>
  );
}

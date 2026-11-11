"use client";

import { useEffect, useRef, useState } from "react";
import { CarouselDots } from "@/components/ui/CarouselControls";
import Cta from "@/components/ui/Cta";
import { achievements, achievementsLabel, hero, heroSlides, type HeroSlide } from "@/data/hero";
import { links } from "@/data/links";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { AT, ENTER, LINE, RISE, at } from "./enter";
import HeroFigure from "./HeroFigure";

/** How long each topper stays before the next comes in, and how long the hand-over takes. */
const SLIDE_MS = 6500;
const FADE_MS = 1000;

const pad = (n: number) => String(n).padStart(2, "0");

/** The rest of the year's top ten, after the three in the slideshow: small portraits under the panel. */

/** What is left of the intro curtain (layout/Preloader's `--intro`, in ms from the first paint), or 0. */
function introLeft() {
  const intro = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--intro"));
  return Number.isFinite(intro) ? Math.max(0, intro - performance.now()) : 0;
}

/**
 * The pill over the headline: a tag, then a window through which the current topper's line glides past,
 * faded at both ends, and an arrow. It links to the institute's selections page.
 */
function Ticker({ slide }: { slide: HeroSlide }) {
  const line = `${slide.name} · AIR ${slide.rank}, UPSC CSE ${slide.year} · See all the results`;
  return (
    <a
      href={links.toppers}
      className="group/ticker inline-flex w-[490px] items-center gap-4 rounded-full bg-mahogany/80 py-1.5 pr-4 pl-1.5 text-white ring-1 ring-white/20 [transition:background-color_var(--dur-fast)_var(--ease-out)] hover:bg-mahogany"
    >
      <span className="shrink-0 rounded-full bg-saffron px-3.5 py-1 text-[15px]/[20px] font-bold text-mahogany">
        CSE {slide.year} results
      </span>
      <span className="relative h-5 min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]">
        <span key={slide.name} className="hero-glide absolute top-0 left-0 flex text-[15px]/[20px] font-medium whitespace-nowrap">
          <span className="pr-10">{line}</span>
          <span className="pr-10" aria-hidden="true">
            {line}
          </span>
        </span>
      </span>
      <svg aria-hidden="true" viewBox="0 0 16 16" width={16} height={16} fill="none" className="shrink-0 [transition:translate_var(--dur-fast)_var(--ease-out)] group-hover/ticker:translate-x-0.5">
        <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

/**
 * The opening of the page, outcome first (the `kevin` branch's hero, in this site's type and colours): on
 * the orange gradient of Figma 2484:4261 (globals.css, .hero-ember), a large rounded panel inset a little from the edges, in which the top three of UPSC
 * CSE 2025 follow one another in their portraits.
 *
 *   - Each portrait pushes in slowly while it is shown and hands over to the next with a soft cross-fade
 *     (6.5s each, 1s hand-over). The topper's rank is marked beside them, the page's loudest figure: the rank
 *     large and bold in saffron (the headline stays white, so the two never compete), their name, the exam,
 *     a fine line drawn out to a dot. A dark wash from the left keeps the type legible. Dots at the foot of
 *     the panel show which topper is on and fill with the slide's time; choosing one jumps to that topper.
 *   - Over it, on the left: the pill (a bold saffron "CSE 2025 results" tag) whose line glides past with the topper's name and rank, the client's
 *     headline, the lead and the two buttons. A button to pause the slideshow appears
 *     when reached with the keyboard.
 *   - Under the panel, on the orange: the four points of Figma's stats bar (2425:51305), each figure in a
 *     cream laurel with its line beside it, centred (the figures roll in; the laurels sway gently, out of
 *     step, while the hero is on screen).
 *
 * Load (once, after the intro curtain; see ./enter): the pill, the heading line by line, the lead card,
 * the buttons and the results rise in; the slideshow starts its clock when the curtain has lifted. Reduced
 * motion: everything is in place, the first topper stays, nothing pushes in.
 */
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  // Bumped when the slideshow is played again, so the current slide gets its full time.
  const [cycle, setCycle] = useState(0);
  // The first slide waits for the intro curtain to lift.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    setStill(reduced);
    if (reduced) return;
    const timer = window.setTimeout(() => setReady(true), introLeft());
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready || paused || still) return;
    const timer = window.setTimeout(() => setCurrent((i) => (i + 1) % heroSlides.length), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [current, cycle, paused, ready, still]);

  // The active dot fills with the current slide's time; it waits while paused and stays full when still.
  const fillRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;
    if (still || !ready) {
      fill.style.transform = still ? "scaleX(1)" : "scaleX(0)";
      return;
    }
    const animation = fill.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: SLIDE_MS, easing: "linear", fill: "forwards" });
    if (paused) animation.pause();
    return () => animation.cancel();
  }, [current, cycle, paused, ready, still]);

  const choose = (i: number) => {
    setCurrent(i);
    setCycle((c) => c + 1);
  };

  const togglePause = () => {
    if (paused) setCycle((c) => c + 1);
    setPaused((p) => !p);
  };

  const slide = heroSlides[current];

  return (
    <section id="hero" aria-labelledby="hero-h" className="hero-ember text-white">
      <div className="px-4 pt-6">
        <div
          aria-roledescription="carousel"
          aria-label={`UPSC CSE ${slide.year} toppers`}
          className={cx(
            // The header (80), the room above the panel (24) and the stats strip under it (154) share the
            // first screen with it; the announcement strip waits just below.
            "relative h-[clamp(520px,calc(100svh/var(--canvas-zoom,1)-80px-24px-154px),820px)] overflow-clip rounded-[28px] bg-mahogany",
            ENTER,
          )}
          style={at(AT.art)}
        >
          {heroSlides.map((s, i) => {
            const shown = i === current;
            return (
              <div
                key={s.name}
                aria-hidden={!shown}
                className="absolute inset-0 transition-opacity ease-out"
                style={{ opacity: shown ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
              >
                <img
                  src={s.photo}
                  alt={shown ? `${s.name}, AIR ${s.rank}, UPSC CSE ${s.year}` : ""}
                  width={1920}
                  height={822}
                  fetchPriority={i === 0 ? "high" : undefined}
                  decoding="async"
                  className="absolute inset-0 size-full max-w-none object-cover object-[80%_18%]"
                  style={{
                    scale: shown && ready && !still ? "1.07" : "1",
                    transition: shown ? `scale ${SLIDE_MS + FADE_MS}ms linear` : `scale 0s linear ${FADE_MS}ms`,
                  }}
                />
              </div>
            );
          })}

          {/* A wash from the left for the type and a light one along the foot for the dots. */}
          {/* Warm brown, never pitch black, so every portrait keeps the tone of the office rooms they stand in. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-r from-[rgb(46_17_6/0.7)] via-[rgb(46_17_6/0.32)] to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-[rgb(46_17_6/0.4)] to-transparent" />

          {/*
            The topper's rank in the top right corner, clear of every portrait, on a frosted panel of the
            rooms' warm brown so it reads over a bright window as well as a dark wall. "AIR" sits on the middle
            of the figures, with the line (pointing back to the topper) level with it. Drawn in with each slide.
          */}
          <div
            key={`mark-${current}-${cycle}`}
            aria-hidden="true"
            className="hero-mark pointer-events-none absolute top-[7%] right-[3%] flex items-start"
          >
            {/* Level with the "AIR" row: the panel's top padding and half the row, less half the dot. */}
            <span className="mt-[54px] flex items-center">
              <span className="block size-2.5 rounded-full bg-[#ffe9c2] ring-4 ring-[#ffe9c2]/25" />
              <span className="hero-mark-line block h-[1.5px] w-14 origin-right bg-[#ffe9c2]/80" />
            </span>
            <div className="rounded-[22px] bg-[rgb(46_17_6/0.62)] px-7 pt-5 pb-6 text-right shadow-[0_18px_40px_-18px_rgb(20_6_2/0.6)] ring-1 ring-[#ffe9c2]/15 backdrop-blur-md">
              <p className="flex items-center justify-end gap-3 font-heading text-saffron">
                <span className="text-[34px]/[1] font-semibold">AIR</span>
                {/* The figures' box is trimmed to their height, so "AIR" centres on the digits themselves. */}
                <span className="text-[124px]/[0.74] font-bold tracking-[-0.03em] [text-box:trim-both_cap_alphabetic]">{pad(slide.rank)}</span>
              </p>
              <p className="mt-4 text-[21px]/[26px] font-semibold text-white">{slide.name}</p>
              <p className="text-[15px]/[20px] font-medium text-[#ffe9c2]">UPSC CSE {slide.year}</p>
            </div>
          </div>

          {/* The type, on the left. */}
          <div className="relative z-10 mx-auto flex h-full w-canvas flex-col items-start justify-center px-12 pb-2">
            <div className={RISE} style={at(AT.eyebrow)}>
              <Ticker slide={slide} />
            </div>
            <h1 id="hero-h" className="mt-6 font-heading text-[56px]/[1.06] font-normal tracking-[-0.02em]">
              {hero.headline.map((line, i) => (
                <span key={i} className={cx("block whitespace-nowrap", LINE)} style={at(AT.lines[i])}>
                  {line.map((run) =>
                    run.em ? (
                      <em key={run.text} className="font-semibold text-white not-italic">
                        {run.text}
                      </em>
                    ) : (
                      run.text
                    ),
                  )}
                </span>
              ))}
            </h1>
            <p
              className={cx("mt-6 w-[500px] text-[17px]/[1.6] text-white/92", RISE)}
              style={at(AT.lead)}
            >
              {hero.lead}
            </p>
            <div className="mt-7 flex items-start gap-3">
              <span className={cx("flex", RISE)} style={at(AT.ctas[0])}>
                <Cta variant="primary" size="lg" href={hero.primary.href}>
                  {hero.primary.label}
                </Cta>
              </span>
              <span className={cx("flex", RISE)} style={at(AT.ctas[1])}>
                <Cta variant="secondary-dark" size="lg" href={hero.secondary.href}>
                  {hero.secondary.label}
                </Cta>
              </span>
            </div>
          </div>

          {/* Which topper is on: a dot each, the current one filling with its time. */}
          <div className={cx("absolute inset-x-0 bottom-7 z-20 flex justify-center", RISE)} style={at(AT.ctas[1])}>
            <CarouselDots
              count={heroSlides.length}
              active={current}
              onSelect={choose}
              label="Choose a topper"
              itemName="Topper"
              tone="dark"
              fillRef={fillRef}
              className="rounded-full bg-black/25 px-3 py-2.5"
            />
          </div>

          {/* A way to stop the slideshow, kept out of sight until reached with the keyboard. */}
          {!still && (
            <button
              type="button"
              onClick={togglePause}
              className="sr-only z-20 cursor-pointer rounded-full bg-cream px-4 py-2 text-[14px] font-semibold text-ink focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-6 focus-visible:left-6 focus-visible:inline-flex focus-visible:items-center focus-visible:gap-2"
            >
              <svg aria-hidden="true" viewBox="0 0 14 14" width={14} height={14} fill="currentColor">
                {paused ? <path d="M3 1.5L12 7L3 12.5Z" /> : <path d="M3 1.5H5.6V12.5H3ZM8.4 1.5H11V12.5H8.4Z" />}
              </svg>
              {paused ? "Play the toppers' slideshow" : "Pause the toppers' slideshow"}
            </button>
          )}
        </div>
      </div>

      {/* Under the panel: the four points, each figure in its laurel, centred (Figma "stats bar", 2425:51305). */}
      <ul aria-label={achievementsLabel} className="mx-auto flex w-canvas items-center justify-center gap-16 px-12 pt-8 pb-9">
        {achievements.map((item, i) => (
          <li key={item.text} data-enter className={cx("flex items-center gap-4", RISE)} style={at(AT.achievements[Math.min(i, AT.achievements.length - 1)] + (i > 2 ? 80 : 0))}>
            <span className="relative flex h-[86px] w-[108px] shrink-0 items-center justify-center">
              {/* The laurel sways a little about its foot while the hero is on screen (globals.css, .lp-sway), each out of step. */}
              <img
                src="/images/hero/laurel-cream.svg"
                alt=""
                aria-hidden="true"
                width={108}
                height={86}
                className="lp-sway absolute inset-0 size-full"
                style={{ animationDelay: `${-i * 2.3}s` }}
              />
              <span className="relative font-heading text-[28px]/[1] font-medium whitespace-nowrap">
                <HeroFigure value={item.figure} />
              </span>
            </span>
            <span className="w-[150px] text-[17px]/[1.35]">{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

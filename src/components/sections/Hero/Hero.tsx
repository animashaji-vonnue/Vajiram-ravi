"use client";

import { useEffect, useState } from "react";
import Cta from "@/components/ui/Cta";
import { achievements, achievementsLabel, hero, heroSlides, type HeroSlide } from "@/data/hero";
import { links } from "@/data/links";
import { toppers, toppersYear } from "@/data/toppers";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { AT, ENTER, LINE, RISE, at } from "./enter";
import HeroFigure from "./HeroFigure";

/** How long each topper stays before the next comes in, and how long the hand-over takes. */
const SLIDE_MS = 6500;
const FADE_MS = 1000;

const pad = (n: number) => String(n).padStart(2, "0");

/** The rest of the year's top ten, after the three in the slideshow: small portraits under the panel. */
const others = toppers.filter((topper) => topper.rank > heroSlides.length && topper.rank <= 10);

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
      className="group/ticker inline-flex w-[470px] items-center gap-4 rounded-full bg-black/25 py-1.5 pr-4 pl-1.5 text-white ring-1 ring-white/25 backdrop-blur-md [transition:background-color_var(--dur-fast)_var(--ease-out)] hover:bg-black/35"
    >
      <span className="shrink-0 rounded-full bg-cream px-3 py-1 font-mono text-[11px]/[16px] tracking-[0.08em] text-burnt uppercase">
        CSE {slide.year} results
      </span>
      <span className="relative h-5 min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]">
        <span key={slide.name} className="hero-glide absolute top-0 left-0 flex text-[14px]/[20px] whitespace-nowrap">
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
 *     (6.5s each, 1s hand-over). The topper's rank is marked beside them (the rank large in the serif, their name, the exam,
 *     a fine line drawn out to a dot); a dark wash from the left and a halftone grain keep the type legible.
 *   - Over it, on the left: the pill whose line glides past with the topper's name and rank, the client's
 *     headline, the lead on a frosted card and the two buttons. A button to pause the slideshow appears
 *     when reached with the keyboard.
 *   - Under the panel, on the orange: the statement, the institute's three figures (50+ years, 10 of 10, 36 of the top 50; they roll in)
 *     and the rest of the year's top ten as small portraits, linking to the selections page.
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

  const togglePause = () => {
    if (paused) setCycle((c) => c + 1);
    setPaused((p) => !p);
  };

  const slide = heroSlides[current];

  return (
    <section id="hero" aria-labelledby="hero-h" className="hero-ember text-white">
      <div className="px-4 pt-4">
        <div
          aria-roledescription="carousel"
          aria-label={`UPSC CSE ${slide.year} toppers`}
          className={cx(
            // The header (119) and the strip under the panel (133) stay on the first screen with it.
            "relative h-[clamp(500px,calc(100svh/var(--canvas-zoom,1)-119px-16px-133px),820px)] overflow-clip rounded-[28px] bg-mahogany",
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
                  className="absolute inset-0 size-full max-w-none object-cover object-[80%_center]"
                  style={{
                    scale: shown && ready && !still ? "1.07" : "1",
                    transition: shown ? `scale ${SLIDE_MS + FADE_MS}ms linear` : `scale 0s linear ${FADE_MS}ms`,
                  }}
                />
              </div>
            );
          })}

          {/* A dark wash from the left for the type, and a fine halftone grain over everything. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/65 via-black/30 to-transparent" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-35 mix-blend-overlay [background-image:radial-gradient(rgb(0_0_0/0.65)_1px,transparent_1.5px)] [background-size:6px_6px]"
          />

          {/* The topper's rank marked beside them, drawn in with each slide. */}
          <div
            key={`mark-${current}-${cycle}`}
            aria-hidden="true"
            className="hero-mark pointer-events-none absolute top-[11%] left-[47%] flex items-start gap-3"
          >
            <div>
              <p className="font-mono text-[11px]/[14px] tracking-[0.2em] text-white/80 uppercase">All India Rank</p>
              <p className="mt-2 flex items-baseline gap-2 font-heading text-white">
                <span className="text-[26px]/[1] text-saffron italic">AIR</span>
                <span className="text-[96px]/[0.82] tracking-[-0.03em]">{pad(slide.rank)}</span>
              </p>
              <p className="mt-4 text-[16px]/[21px] font-semibold">{slide.name}</p>
              <p className="text-[13px]/[18px] text-white/80">UPSC CSE {slide.year}</p>
            </div>
            <span className="mt-[62px] flex items-center">
              <span className="hero-mark-line block h-px w-14 origin-left bg-white/70" />
              <span className="block size-2.5 rounded-full bg-white ring-4 ring-white/25" />
            </span>
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
                      <em key={run.text} className="text-saffron italic">
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
              className={cx("mt-6 w-[460px] rounded-[18px] bg-black/25 px-5 py-4 text-[16px]/[1.55] ring-1 ring-white/20 backdrop-blur-md", RISE)}
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

      {/* Under the panel: the statement, the three results and the rest of the top ten. */}
      <div className="mx-auto grid w-canvas grid-cols-[230px_repeat(3,minmax(0,1fr))_auto] items-center gap-10 px-12 py-6">
        <p className={cx("font-heading text-[24px]/[1.15] italic", RISE)} style={at(AT.achievements[0] - 80)}>
          {hero.statement}
        </p>
        <ul aria-label={achievementsLabel} className="contents">
          {achievements.map((item, i) => (
            <li key={item.label} data-enter className={cx("flex flex-col border-l border-white/30 pl-6", RISE)} style={at(AT.achievements[i])}>
              <span className="font-heading text-[40px]/[1] whitespace-nowrap">
                <HeroFigure value={item.figure} />
              </span>
              <span className="mt-1.5 text-[15px]/[20px] font-semibold whitespace-nowrap">{item.label}</span>
              <span className="text-[14px]/[19px] whitespace-nowrap text-white/85">{item.text}</span>
            </li>
          ))}
        </ul>
        <a
          href={links.toppers}
          className={cx("group/others flex items-center gap-4 border-l border-white/30 pl-6", RISE)}
          style={at(AT.achievements[2] + 80)}
        >
          <span className="flex">
            {others.map((topper, i) => (
              <span key={topper.rank} className={cx("relative size-10 overflow-clip rounded-full bg-[#8a2812] ring-2 ring-[#b23b16]", i > 0 && "-ml-3")}>
                <img src={topper.image} alt="" width={40} height={40} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover object-top" />
              </span>
            ))}
          </span>
          <span className="text-[14px]/[19px]">
            <span className="block font-semibold">And {others.length} more in the top ten</span>
            <span className="text-white/80 [transition:color_var(--dur-fast)_var(--ease-out)] group-hover/others:text-white">
              UPSC CSE {toppersYear} results
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}

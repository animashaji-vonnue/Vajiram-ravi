"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, PauseSolid, PlaySolid } from "iconoir-react";
import { hero } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { prefersReducedMotion } from "@/lib/motion";
import { cx } from "@/lib/cx";

type Slide = (typeof hero.slides)[number];

/** How long each topper stays before the next comes in, and how long the hand-over takes. */
const SLIDE_MS = 6500;
const FADE_MS = 1000;

const pad = (n: number) => String(n).padStart(2, "0");

/** The edge of a torn piece of paper, for the coloured scrap that tears into a corner of each slide. */
const TORN =
  "polygon(0% 46%, 5% 38%, 9% 44%, 15% 30%, 21% 36%, 27% 22%, 33% 28%, 40% 14%, 47% 22%, 53% 8%, 60% 16%, 67% 4%, 74% 12%, 81% 0%, 88% 9%, 94% 2%, 100% 6%, 100% 100%, 0% 100%)";

/**
 * The pill over the headline, after amperos.com's "Case study" pill: a tag, then a window through which the current
 * topper's line glides past, faded at both ends, and an arrow. It links to the student stories.
 */
function Ticker({ slide }: { slide: Slide }) {
  const line = `${slide.name} · AIR ${slide.rank}, CSE ${slide.year} · Read their story`;
  return (
    <a
      href="#stories"
      className="group inline-flex w-[460px] items-center gap-4 rounded-full bg-black/25 py-1.5 pr-4 pl-1.5 ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-black/35"
    >
      <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[12px] font-semibold tracking-[0.08em] text-saffron-700 uppercase">
        CSE {slide.year} results
      </span>
      <span className="relative h-5 min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]">
        <span
          key={slide.name}
          className="marquee absolute top-0 left-0 flex text-[14px]/[20px] whitespace-nowrap text-white"
          style={{ ["--marquee-duration" as string]: "14s" }}
        >
          <span className="pr-10">{line}</span>
          <span className="pr-10" aria-hidden="true">
            {line}
          </span>
        </span>
      </span>
      <ArrowRight
        width={16}
        height={16}
        strokeWidth={1.8}
        className="shrink-0 transition-transform group-hover:translate-x-0.5"
      />
    </a>
  );
}

/**
 * The opening of the page, outcome first, after amperos.com's hero: a large rounded panel, inset a little from the
 * orange, in which the top three of CSE 2025 follow one another in their portraits. Each portrait pushes in slowly
 * while it is shown and hands over to the next with a soft cross-fade; a coloured scrap of torn paper tears into a
 * corner, a fine line marks the topper's rank beside them, and a halftone grain and a dark wash from the left keep
 * the type legible. Over it on the left: a pill whose line glides past with the topper's name and rank, the headline,
 * the topper's own words (to be added) and the two buttons. A button to pause the slideshow appears when reached with
 * the keyboard. Under the panel, on the orange, the supporting statement, the institution's achievements and the rest
 * of the year's top ten.
 */
export default function Hero() {
  const { slides } = hero;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  // Bumped when the slideshow is played again, so the current slide gets its full time.
  const [cycle, setCycle] = useState(0);

  useEffect(() => setStill(prefersReducedMotion()), []);

  useEffect(() => {
    if (paused || still) return;
    const timer = setTimeout(() => setCurrent((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [current, cycle, paused, still, slides.length]);

  const togglePause = () => {
    if (paused) setCycle((c) => c + 1);
    setPaused((p) => !p);
  };

  const slide = slides[current];
  const playing = !paused && !still;
  const others = hero.years[2025].slice(slides.length);

  return (
    <section id="results" aria-labelledby="hero-title" className="ember text-white">
      <div className="px-4 pt-4">
        <div
          aria-roledescription="carousel"
          aria-label={`CSE ${slide.year} toppers`}
          className="relative h-[clamp(640px,calc(var(--vh,100vh)-76px-156px),860px)] overflow-clip rounded-[28px] bg-ink-950"
        >
          {slides.map((s, i) => {
            const shown = i === current;
            const top = i % 2 === 1;
            return (
              <div
                key={s.name}
                aria-hidden={!shown}
                className="absolute inset-0 transition-opacity ease-out"
                style={{ opacity: shown ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
              >
                <Image
                  src={s.photo}
                  alt={shown ? `${s.name}, AIR ${s.rank}, CSE ${s.year}` : ""}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover object-[80%_center]"
                  style={{
                    scale: shown && !still ? "1.07" : "1",
                    transition: shown ? `scale ${SLIDE_MS + FADE_MS}ms linear` : `scale 0s linear ${FADE_MS}ms`,
                  }}
                />
                {/* The torn scrap, a lighter paper edge behind the coloured one, tearing into a corner. */}
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute right-[-4px] h-[130px] w-[320px] transition-[translate,rotate] duration-[900ms] ease-out-soft",
                    top ? "top-[-4px] -scale-y-100" : "bottom-[-4px]",
                  )}
                  style={{
                    translate: shown ? "0 0" : `60px ${top ? "-70px" : "70px"}`,
                    rotate: shown ? "0deg" : "-6deg",
                    transitionDelay: shown ? "250ms" : "0ms",
                  }}
                >
                  <span className="absolute inset-0 bg-paper/80" style={{ clipPath: TORN, translate: "-6px -5px" }} />
                  <span className="absolute inset-0" style={{ clipPath: TORN, background: s.accent }} />
                </span>
              </div>
            );
          })}

          {/* A dark wash from the left for the type, and a fine halftone grain over everything. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/60 via-black/25 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-35 mix-blend-overlay [background-image:radial-gradient(rgb(0_0_0/0.65)_1px,transparent_1.5px)] [background-size:6px_6px]"
          />

          {/*
            The topper's rank marked beside them, drawn in with each slide: a small label, the rank large in the serif,
            then their name and the examination, with a fine line and a dot pointing towards them.
          */}
          <div
            key={`mark-${current}-${cycle}`}
            aria-hidden="true"
            className="hero-mark pointer-events-none absolute top-[12%] left-[46%] flex items-start gap-4"
          >
            <div>
              <p className="text-[11px]/[14px] font-semibold tracking-[0.24em] text-white/80 uppercase">
                All India Rank
              </p>
              <p className="mt-2 flex items-baseline gap-2 font-serif text-white">
                <span className="text-[26px]/[1] text-glow italic">AIR</span>
                <span className="text-[96px]/[0.82] tracking-[-0.03em]">{pad(slide.rank)}</span>
              </p>
              <p className="mt-4 text-[16px]/[21px] font-semibold text-white">{slide.name}</p>
              <p className="text-[13px]/[18px] text-white/80">UPSC CSE {slide.year}</p>
            </div>
            <span className="mt-[62px] flex items-center gap-0">
              <span className="hero-mark-line block h-px w-[120px] origin-left bg-white/70" />
              <span className="block size-2.5 rounded-full bg-white ring-4 ring-white/25" />
            </span>
          </div>

          {/* The type, on the left. */}
          <div className="relative z-10 mx-auto flex h-full w-canvas flex-col justify-center px-12 pb-6">
            <Ticker slide={slide} />
            <h1 id="hero-title" className="mt-7 w-[620px] font-serif text-[76px]/[0.98] tracking-[-0.02em]">
              <span className="block text-balance">{hero.headline.lead}</span>{" "}
              <em className="block text-glow italic">{hero.headline.accent}</em>
            </h1>
            <figure
              key={`quote-${current}`}
              aria-live={playing ? "off" : "polite"}
              className="stage-in mt-8 w-[500px] rounded-[20px] bg-black/25 p-5 ring-1 ring-white/20 backdrop-blur-md"
            >
              <blockquote className="flex gap-3 text-[17px]/[26px] text-white">
                <span aria-hidden="true" className="-mt-2 font-serif text-[44px]/[1] text-glow">
                  “
                </span>
                {slide.quote}
              </blockquote>
              <figcaption className="mt-3 flex items-baseline gap-2.5 pl-[30px] text-[14px]">
                <span className="font-semibold">{slide.name}</span>
                <span className="text-white/80">
                  AIR {slide.rank}, CSE {slide.year}
                </span>
              </figcaption>
            </figure>
            <div className="mt-8 flex gap-3">
              <Button href={hero.primary.href} tone="light">
                {hero.primary.label}
              </Button>
              <Button href={hero.secondary.href} tone="ghost-light">
                {hero.secondary.label}
              </Button>
            </div>
          </div>

          {/* A way to stop the slideshow, kept out of sight until reached with the keyboard. */}
          <button
            type="button"
            onClick={togglePause}
            className="sr-only z-20 rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-ink-900 focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-6 focus-visible:left-6 focus-visible:inline-flex focus-visible:items-center focus-visible:gap-2"
          >
            {paused ? <PlaySolid width={14} height={14} /> : <PauseSolid width={14} height={14} />}
            {paused ? "Play the toppers' slideshow" : "Pause the toppers' slideshow"}
          </button>
        </div>
      </div>

      {/* Under the panel: the supporting statement, the institution's achievements and the rest of the top ten. */}
      <div className="mx-auto grid w-canvas grid-cols-[230px_repeat(3,minmax(0,1fr))_auto] items-center gap-10 px-12 py-7">
        <p className="font-serif text-[24px]/[1.15] text-white italic">{hero.statement}</p>
        {hero.achievements.map((a) => (
          <dl key={a.label} className="flex flex-col border-l border-white/30 pl-6">
            <dt className="order-2 mt-1.5 text-[14px]/[19px] font-semibold">{a.label}</dt>
            <dd className="order-1 font-serif text-[40px]/[1]">{a.value}</dd>
            <dd className="order-3 text-[13px]/[18px] text-white/85">{a.text}</dd>
          </dl>
        ))}
        <a href="#stories" className="group flex items-center gap-4 border-l border-white/30 pl-6">
          <span className="flex">
            {others.map((a, i) => (
              <span
                key={a.rank}
                className={cx(
                  "relative size-10 overflow-hidden rounded-full bg-rust ring-2 ring-[#b23b16]",
                  i > 0 && "-ml-3",
                )}
              >
                <Image src={a.photo} alt="" fill sizes="40px" className="object-cover object-top" />
              </span>
            ))}
          </span>
          <span className="text-[14px]/[19px]">
            <span className="block font-semibold">And {others.length} more in the top ten</span>
            <span className="text-white/85 group-hover:text-white">CSE 2025 results</span>
          </span>
        </a>
      </div>
    </section>
  );
}

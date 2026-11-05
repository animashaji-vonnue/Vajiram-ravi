"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Buttons";
import { hero } from "@/data/home";
import { canvasTop } from "@/lib/canvas";
import { clamp01, followScroll } from "@/lib/scroll";
import SplitHeading, { letterCount } from "@/components/ui/SplitHeading";
import VideoLoop from "@/components/ui/VideoLoop";

/**
 * A jaali lattice, after the tone-on-tone pattern in airindia.com's footer but drawn as our own: on an 80px
 * tile, an eight-pointed khatam star (two squares, one turned 45°) whose points run out to the tile's
 * edges and corners, so neighbouring tiles join into one screen. Amber lines, faint on the cream.
 */
const JAALI = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' fill='none' stroke='#c84800' stroke-opacity='.13' stroke-width='1'>` +
    `<rect x='24' y='24' width='32' height='32'/>` +
    `<path d='M40 17.4 62.6 40 40 62.6 17.4 40Z'/>` +
    `<path d='M40 17.4V0M62.6 40H80M40 62.6V80M17.4 40H0M24 24 0 0M56 24 80 0M56 56 80 80M24 56 0 80'/>` +
    `</svg>`,
)}")`;

/**
 * As the page scrolls away from the top, the hero draws in from the edges like a card being lifted off the
 * orange of the stats band behind it, after concurrence.com: over the first SHRINK_DISTANCE canvas pixels of
 * scroll it scales down until it sits INSET pixels in from each side, and its corners round to RADIUS.
 */
const SHRINK_DISTANCE = 600;
const INSET = 32;
const RADIUS = 24;
const SMOOTHING_MS = 90;

/** The heading fades away this long after the page opens, leaving the film to play on its own. */
const TITLE_FADE_AFTER_MS = 6000;
const TITLE_FADE_MS = 1200;

/**
 * The opening hero: the film edge to edge, filling the window under the header, with the serif heading centred
 * over it in white (the second line in the page's orange) on a soft dark wash; then, on the cream band with its
 * faint jaali lattice, the heading again at a smaller size, the paragraph and the two buttons. It sits on the stats band's orange and draws in from the
 * edges as the page scrolls. Six seconds in, the heading and its wash fade away and the film plays on alone.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const wash = useRef<HTMLDivElement>(null);

  // After a few seconds the heading and the dark wash behind it fade out together. They stay in the page for
  // screen readers; only their look goes.
  useEffect(() => {
    const timer = setTimeout(() => {
      for (const el of [title.current, wash.current]) {
        if (!el) continue;
        el.style.transition = `opacity ${TITLE_FADE_MS}ms ease`;
        el.style.opacity = "0";
      }
    }, TITLE_FADE_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return followScroll(
      () => clamp01(-canvasTop(el) / SHRINK_DISTANCE),
      (progress) => {
        const scale = 1 - (progress * INSET * 2) / el.offsetWidth;
        el.style.transform = `scale(${scale})`;
        el.style.borderTopLeftRadius = el.style.borderTopRightRadius = `${progress * RADIUS}px`;
      },
      SMOOTHING_MS,
    );
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      className="relative isolate z-10 origin-top overflow-hidden rounded-b-[24px] bg-linear-to-b from-cream from-70% to-white will-change-transform"
    >
      {/* The film fills the window below the 72px header, never less than 600px tall. */}
      <div className="relative isolate flex h-[max(600px,calc(var(--vh,100vh)-72px))] items-center justify-center">
        <VideoLoop clips={hero.video.clips} label={hero.video.label} className="bg-neutral-950" />
        {/* Darkest behind the heading, so the white letters read on any frame of the film. */}
        <div
          ref={wash}
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(20_10_5/0.45),rgb(20_10_5/0.15)_70%)]"
        />
        <h1
          ref={title}
          data-split
          id="hero-heading"
          className="px-10 text-center font-serif text-[88px]/[0.98] font-normal tracking-[-0.025em] text-white drop-shadow-[0_2px_24px_rgb(0_0_0/0.35)] [font-variation-settings:'SOFT'_0,'WONK'_0]"
        >
          <SplitHeading text={hero.heading} />{" "}
          <em className="block text-[#ff8b00]">
            <SplitHeading text={hero.highlight} from={letterCount(hero.heading)} />
          </em>
        </h1>
      </div>

      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-[360px] mask-b-from-40% mask-b-to-100%"
          style={{ backgroundImage: JAALI, backgroundPosition: "center top" }}
        />
        <div className="mx-auto flex w-canvas flex-col items-center px-10 pt-14 pb-20 text-center">
          {/* The heading again, smaller, so it stays with the paragraph once the one over the film has faded. The h1
              already gives it to screen readers. */}
          <p
            aria-hidden="true"
            className="font-serif text-[48px]/[1.05] font-normal tracking-[-0.02em] text-neutral-900 [font-variation-settings:'SOFT'_0,'WONK'_0]"
          >
            {hero.heading} <em className="block text-amber">{hero.highlight}</em>
          </p>
          <p className="mt-6 w-[620px] text-[18px]/[28px] text-neutral-600">{hero.intro}</p>
          <div className="mt-8 flex gap-3">
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={hero.secondary.href} tone="secondary">
              {hero.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useState } from "react";
import { Button } from "@/components/ui/Buttons";
import { hero } from "@/data/home";
import { cx } from "@/lib/cx";

/** How long each photo stays up before the next one tears in. */
const SLIDE_MS = 6000;
const ROWS = 28;

/**
 * A ragged, slightly slanted vertical edge as a clip-path: everything right of `x`% is kept. The same
 * `seed` always tears the same way, so the hidden and shown shapes have matching points and the browser
 * can slide one into the other.
 */
function tornEdge(x: number, seed: number): string {
  const points = ["300% 0%"];
  for (let row = 0; row <= ROWS; row++) {
    const y = (row / ROWS) * 100;
    const jag = (Math.sin((row + 1) * 12.9898 * seed) * 43758.5453) % 1;
    points.push(`${(x + (50 - y) * 0.12 + jag * 1.4).toFixed(2)}% ${y.toFixed(2)}%`);
  }
  points.push("300% 100%");
  return `polygon(${points.join(", ")})`;
}

/** The layers of one cut, back to front: two torn papers and then the photo, each a beat behind the last. */
const LAYERS = [
  { seed: 1.7, delay: "delay-0" },
  { seed: 2.9, delay: "delay-[70ms]" },
  { seed: 4.3, delay: "delay-[160ms]" },
].map(({ seed, delay }) => ({
  delay,
  style: {
    "--hidden": tornEdge(112, seed),
    "--shown": tornEdge(-12, seed),
  } as CSSProperties,
}));

/** A fine grain for the papers, so they read as paper rather than flat colour. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")";

/**
 * Hidden until its turn, then torn in over the slide before it; "prev" stays up underneath until the
 * next cut has finished. Only the active slide's tear animates: the others jump.
 */
const CLIP =
  "absolute inset-0 [clip-path:var(--hidden)] group-data-[state=active]/slide:[clip-path:var(--shown)] group-data-[state=prev]/slide:[clip-path:var(--shown)] group-data-[state=active]/slide:transition-[clip-path] group-data-[state=active]/slide:duration-[1100ms] group-data-[state=active]/slide:ease-[cubic-bezier(0.7,0,0.2,1)]";

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

/** The shadow each layer casts on the one beneath, on a wrapper so the clip doesn't cut it off. */
const SHADOW = "absolute inset-0 drop-shadow-[-8px_0_14px_rgb(0_0_0/0.35)]";

/**
 * The opening hero, after amperos.com: a rounded card where photos of serving officers (IPS, IAS, IFS)
 * take turns, each one drifting slowly and the next tearing in behind two strips of torn paper in a
 * colour from its photo. The heading, a short paragraph and the buttons sit on the dark left of
 * the photos. With reduced motion the first photo stays up.
 * The card sits on a cream band, the full width of the window, with a faint jaali lattice; the lattice
 * fades out towards the band's foot and the cream fades into the white page.
 */
export default function Hero() {
  const { slides } = hero;
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setPrev(index);
      setIndex((index + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [index, slides.length]);

  const state = (i: number) => (i === index ? "active" : i === prev ? "prev" : "idle");

  return (
    <section aria-labelledby="hero-heading" className="relative isolate bg-linear-to-b from-cream from-70% to-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 mask-b-from-30% mask-b-to-100%"
        style={{ backgroundImage: JAALI, backgroundPosition: "center top" }}
      />
      {/*
        The card fills the canvas at 1440 (1360px) and grows to 1520px on wider windows, with the lattice
        either side. It's as tall as the window allows under the header, between 600 and 860px; the photos
        crop to fit (--vh is the window's height in canvas pixels, from lib/canvas).
      */}
      <div className="mx-auto w-full max-w-[1600px] px-10 pt-6 pb-12">
        <div className="relative h-[clamp(600px,calc(var(--vh,900px)-150px),860px)] w-full overflow-hidden rounded-[24px] bg-neutral-950">
          {slides.map((slide, i) => (
            <div
              key={slide.short}
              data-state={state(i)}
              aria-hidden={i !== index}
              className="group/slide absolute inset-0 z-1 data-[state=active]:z-3 data-[state=prev]:z-2"
            >
              {[slide.paper, "var(--color-cream)"].map((colour, layer) => (
                <div key={colour} className={SHADOW}>
                  <div
                    className={cx(CLIP, LAYERS[layer].delay)}
                    style={{
                      ...LAYERS[layer].style,
                      backgroundColor: colour,
                      backgroundImage: GRAIN,
                      backgroundBlendMode: "multiply",
                    }}
                  />
                </div>
              ))}
              <div className={SHADOW}>
                <div className={cx(CLIP, LAYERS[2].delay, "overflow-hidden")} style={LAYERS[2].style}>
                  <Image
                    src={slide.photo}
                    alt={slide.alt}
                    fill
                    sizes="1520px"
                    priority={i === 0}
                    className="object-cover group-data-[state=idle]/slide:animate-none animate-[hero-drift_9s_var(--ease-smooth)_both]"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Darkens the left for the text. */}
          <div className="pointer-events-none absolute inset-0 z-4 bg-linear-to-r from-black/60 via-black/20 via-45% to-transparent to-70%" />

          <div className="absolute bottom-16 left-16 z-5 flex w-[600px] flex-col items-start">
            <h1
              id="hero-heading"
              className="animate-[intro-rise_0.9s_var(--ease-smooth)_both] font-serif text-[76px]/[80px] font-medium tracking-[-1.5px] text-white [font-variation-settings:'SOFT'_0,'WONK'_0]"
            >
              {hero.heading} <span className="block text-saffron">{hero.highlight}</span>
            </h1>
            <p className="mt-5 w-[520px] animate-[intro-rise_0.9s_var(--ease-smooth)_0.1s_both] text-[18px]/[28px] text-white/80">
              {hero.intro}
            </p>
            <div className="mt-9 flex animate-[intro-rise_0.9s_var(--ease-smooth)_0.2s_both] gap-4">
              <Button href={hero.primary.href}>{hero.primary.label}</Button>
              <Button href={hero.secondary.href} tone="secondary">
                {hero.secondary.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

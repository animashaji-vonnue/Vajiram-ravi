"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import { testimonials } from "@/data/home";
import { Lozenge, TitleRule } from "@/components/ui/Ornaments";
import SplitHeading from "@/components/ui/SplitHeading";
import VideoLoop from "@/components/ui/VideoLoop";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";

type Testimonial = (typeof testimonials.list)[number];

/** The heading's ornaments' colour, the gilt of the faculty heading. */
const GILT = "#c9a96a";

/** How long each card stays at the front before the next comes round. */
const ADVANCE_MS = 4500;

/**
 * Where each card sits for its distance from the front, after the template carousel on wix.com: the front card
 * flat; the next out on each side turned 66° away, set back and a little smaller; the pair beyond turned further and
 * set further back. Cards any further out are hidden. Distances are in canvas pixels.
 */
const PLACES: Record<number, { x: number; z: number; turn: number; scale: number }> = {
  0: { x: 0, z: 0, turn: 0, scale: 1 },
  1: { x: 470, z: -140, turn: 66, scale: 0.9 },
  2: { x: 650, z: -320, turn: 78, scale: 0.95 },
};

function place(offset: number): CSSProperties {
  const spot = PLACES[Math.min(Math.abs(offset), 2)];
  const side = Math.sign(offset);
  return {
    transform: `translate(-50%, -50%) translate3d(${side * spot.x}px, 0, ${spot.z}px) rotateY(${-side * spot.turn}deg) scale(${spot.scale})`,
    zIndex: 10 - Math.abs(offset),
    opacity: Math.abs(offset) > 2 ? 0 : 1,
    pointerEvents: Math.abs(offset) > 2 ? "none" : undefined,
  };
}

/**
 * One student's words on a postage stamp, as in the design (3867:964): a perforated peach stamp with an orange
 * frame line inside its edge, the student's photo down the left (or their initials, until there is a photo) and on
 * the right the quote in the headline serif, with the name and their rank and programme under it.
 */
function StampCard({ item }: { item: Testimonial }) {
  const initials = item.name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return (
    <figure className="relative isolate flex h-[440px] w-[760px] gap-10 py-3.5 pr-9 pl-3.5">
      {/* eslint-disable-next-line @next/next/no-img-element -- the stamp's edge, an SVG stretched to the card */}
      <img src={testimonials.stamp} alt="" className="absolute inset-0 -z-10 size-full" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-3.5 border border-[#fea500]" />
      <div className="relative w-[340px] shrink-0 overflow-hidden">
        {item.photo ? (
          <Image src={item.photo} alt="" fill sizes="340px" className="object-cover" />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-full items-center justify-center bg-[#f3d29a] font-serif text-[120px] text-brown-950/40 [font-variation-settings:'SOFT'_0,'WONK'_0]"
          >
            {initials}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between pt-[22px] pb-2.5 text-left">
        <blockquote className="font-serif text-[28px]/[34px] font-normal tracking-[-0.015em] text-neutral-900 [font-variation-settings:'SOFT'_0,'WONK'_0]">
          “{item.quote}”
        </blockquote>
        <figcaption>
          <p className="font-noto-serif text-[16px]/[22px] font-semibold text-neutral-900">{item.name}</p>
          <p className="mt-0.5 font-noto-serif text-[14px]/[20px] text-neutral-800">{item.meta}</p>
        </figcaption>
      </div>
    </figure>
  );
}

/**
 * A round arrow button beside the front card, 16px clear of its edge. It stays hidden until the pointer is over the
 * ring (the `group`) or the button itself has focus.
 */
function Arrow({
  label,
  side,
  onClick,
  children,
}: {
  label: string;
  side: "left" | "right";
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cx(
        "absolute top-1/2 z-20 flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brown-950 opacity-0 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] transition-[opacity,background-color,color] duration-300 group-hover:opacity-100 hover:bg-[#fea500] hover:text-white focus-visible:opacity-100",
        side === "left" ? "left-[calc(50%-452px)]" : "right-[calc(50%-452px)]",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Testimonials, on a rounded card over two films played one after the other and washed dark, with the template
 * carousel from wix.com's "Templates for any industry": the heading centred as on the faculty section (spaced
 * capitals between gilt double rules, a lozenge and the intro under it), in light text, then the students' stamp
 * cards in a 3D ring, the front one flat and those either side turned away in perspective. Every few seconds the
 * next card comes round to the front; clicking a card at the side, or the arrows that show beside the front card while
 * the pointer is over the ring, brings another forward. It pauses while the pointer
 * or focus is on it, and doesn't turn on its own when motion is reduced.
 */
export default function Testimonials() {
  const list = testimonials.list;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const timer = setTimeout(() => setActive((i) => (i + 1) % list.length), ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [active, paused, list.length]);

  // Each card's distance from the front, the shorter way round the ring.
  const offsetOf = (i: number) => {
    const d = mod(i - active, list.length);
    return d > list.length / 2 ? d - list.length : d;
  };

  return (
    <section aria-labelledby="testimonials-title" className="px-10 pb-32">
      {/* A card over the two films, washed dark so the light heading and the peach stamps stand out on it. */}
      <div className="relative isolate overflow-hidden rounded-[32px] py-24 text-white">
        <VideoLoop clips={testimonials.backdrop} className="bg-neutral-950" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgb(25_14_8/0.62)]" />
        {/* The heading as on the faculty section: spaced capitals between gilt double rules, a lozenge under it. */}
        <div data-reveal className="mx-auto flex w-canvas flex-col items-center text-center">
          <div className="flex items-center gap-5">
            <TitleRule colour={GILT} className="w-[150px] flex-none" />
            <h2
              data-split
              id="testimonials-title"
              className="font-noto-serif text-[30px]/[40px] font-bold tracking-[0.12em] uppercase"
            >
              <SplitHeading text={testimonials.heading} />
            </h2>
            <TitleRule colour={GILT} mirrored className="w-[150px] flex-none" />
          </div>
          <Lozenge colour={GILT} className="mt-3" />
          <p className="mt-6 w-[520px] font-noto-serif text-[18px]/[30px] text-white/80">{testimonials.intro}</p>
        </div>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="group"
        >
          {/* The ring: every card is centred on the stage and moved to its place in 3D. */}
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Students' words"
            className="relative mt-16 h-[520px] [perspective:1200px]"
          >
            {list.map((item, i) => {
              const offset = offsetOf(i);
              return (
                <div
                  key={item.name}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${list.length}`}
                  aria-hidden={offset !== 0}
                  onClick={() => offset !== 0 && setActive(i)}
                  className={cx(
                    "absolute top-1/2 left-1/2 drop-shadow-[0_30px_40px_rgb(0_0_0/0.35)] transition-[transform,opacity] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]",
                    offset !== 0 && "cursor-pointer",
                  )}
                  style={place(offset)}
                >
                  <StampCard item={item} />
                </div>
              );
            })}

            {/* Arrows either side of the front card, shown while the pointer is over the ring or one has focus. */}
            <Arrow label="Previous student" side="left" onClick={() => setActive((i) => mod(i - 1, list.length))}>
              <NavArrowLeft width={24} height={24} />
            </Arrow>
            <Arrow label="Next student" side="right" onClick={() => setActive((i) => (i + 1) % list.length)}>
              <NavArrowRight width={24} height={24} />
            </Arrow>
          </div>
        </div>
      </div>
    </section>
  );
}

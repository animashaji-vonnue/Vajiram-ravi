"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import { stories } from "@/data/content";
import { Lozenge, TitleRule } from "@/components/ui/Ornaments";
import VideoLoop from "@/components/ui/VideoLoop";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";

type Story = (typeof stories.list)[number];

/** The heading's ornaments' colour: a muted gilt. */
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
 * One student's story on a card, as in v4 but without the stamp's perforated edge: a rounded peach card with an
 * orange frame line inside its edge, the student's photo down the left (or their initials, until there is a photo) and on the right their words
 * in the serif, with their name and their rank, year and programme under it.
 */
function StampCard({ item }: { item: Story }) {
  const initials = item.name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return (
    <figure className="relative isolate flex h-[440px] w-[760px] gap-10 rounded-[22px] bg-[#ffe5b4] py-3.5 pr-9 pl-3.5">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-3.5 rounded-[14px] border border-[#fea500]"
      />
      <div className="relative w-[340px] shrink-0 overflow-clip rounded-[14px] bg-[linear-gradient(170deg,#f6c08a,#e2864a)]">
        {item.photo ? (
          <Image src={item.photo} alt="" fill sizes="340px" className="object-cover object-top" />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-full items-center justify-center bg-[#f3d29a] font-serif text-[120px] text-ink-900/40"
          >
            {initials}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between pt-[22px] pb-2.5 text-left">
        <blockquote className="font-serif text-[30px]/[36px] tracking-[-0.01em] text-ink-900">
          “{item.quote}”
        </blockquote>
        <figcaption>
          <p className="text-[16px]/[22px] font-semibold text-ink-900">{item.name}</p>
          <p className="mt-0.5 text-[14px]/[20px] text-ink-800">{item.meta}</p>
        </figcaption>
      </div>
    </figure>
  );
}

/**
 * A round arrow button beside the front card. It stays hidden until the pointer is over the ring (the `group`) or
 * the button itself has focus.
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
        "absolute top-1/2 z-20 flex size-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] transition-[opacity,background-color,color] duration-300 group-hover:opacity-100 hover:bg-[#fea500] hover:text-white focus-visible:opacity-100",
        side === "left" ? "left-[calc(50%-452px)]" : "right-[calc(50%-452px)]",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Student stories, in the v4 design: a rounded card over two films of students played one after the other and
 * washed dark, with the heading centred (spaced capitals between gilt double rules, a lozenge, and the description
 * under it) in light text, then the students' cards in a 3D ring, the front one flat and those either side
 * turned away in perspective, after the template carousel on wix.com. Every few seconds the next card comes round to
 * the front; clicking a card at the side, or the arrows that show beside the front card while the pointer is over
 * the ring, brings another forward. It pauses while the pointer or focus is on it, and doesn't turn on its own when
 * motion is reduced.
 */
export default function Stories() {
  const list = stories.list;
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
    <section id="stories" aria-labelledby="stories-title" className="scroll-mt-[76px] bg-white px-10 py-24">
      {/* A card over the two films, washed dark so the light heading and the peach cards stand out on it. */}
      <div className="relative isolate overflow-clip rounded-[32px] py-24 text-white">
        <VideoLoop clips={stories.films} lazy className="bg-ink-950" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgb(25_14_8/0.62)]" />
        <div className="fade-up mx-auto flex w-canvas flex-col items-center text-center">
          <div className="flex items-center gap-5">
            <TitleRule colour={GILT} className="w-[150px] flex-none" />
            <h2 id="stories-title" className="font-serif text-[40px]/[48px] tracking-[0.12em] uppercase">
              {stories.eyebrow}
            </h2>
            <TitleRule colour={GILT} mirrored className="w-[150px] flex-none" />
          </div>
          <Lozenge colour={GILT} className="mt-3" />
          <p className="mt-6 w-[560px] text-[18px]/[30px] text-white/85">{stories.description}</p>
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
            aria-label="Students' stories"
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

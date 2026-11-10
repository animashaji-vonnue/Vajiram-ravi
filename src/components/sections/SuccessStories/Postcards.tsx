"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { CarouselArrow } from "@/components/ui/CarouselControls";
import Photo from "@/components/ui/Photo";
import type { Story } from "@/data/stories";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/*
 * The students' words on postcards, turned on a ring in 3D after the `kevin` branch's student stories
 * (itself after the template carousel on wix.com): the front postcard flat, the next one out on each side
 * turned away and set back, the pair beyond turned further and set further back.
 *   - Every 4.5s the next postcard comes round to the front (600ms, --ease-out). It pauses while the
 *     pointer or the keyboard focus is on the ring; clicking a postcard at the side, the round arrows in
 *     the heading row, the arrow keys and a swipe bring another forward. The move is announced.
 *   - Entrance, once, when the ring comes into view: the postcards fan out from behind the front one to
 *     their places, nearest first (600ms each, 90ms apart).
 *   - Hover on the front postcard lifts it with the hover shadow.
 *   - Reduced motion: no turning on its own and no fan; the postcards change places at once.
 */

/** How long each postcard stays at the front, ms. */
const ADVANCE_MS = 4500;
const SWIPE_PX = 48;

/** Where a postcard sits for its distance from the front: across, back, turned away and scaled. */
const PLACES: Record<number, { x: number; z: number; turn: number; scale: number }> = {
  0: { x: 0, z: 0, turn: 0, scale: 1 },
  1: { x: 420, z: -160, turn: 62, scale: 0.92 },
  2: { x: 600, z: -340, turn: 76, scale: 0.9 },
};

function place(offset: number, spread: boolean, fanning: boolean): CSSProperties {
  const far = Math.abs(offset) > 2;
  const spot = PLACES[spread ? Math.min(Math.abs(offset), 2) : 0];
  const side = Math.sign(offset);
  return {
    transform: `translate(-50%, -50%) translate3d(${side * spot.x}px, 0, ${spot.z - (spread ? 0 : 60)}px) rotateY(${-side * spot.turn}deg) scale(${spot.scale})`,
    zIndex: 10 - Math.abs(offset),
    opacity: far || (!spread && offset !== 0) ? 0 : 1,
    pointerEvents: far ? "none" : undefined,
    transitionDelay: fanning ? `${Math.abs(offset) * 90}ms` : "0ms",
  };
}

type PostcardsProps = {
  stories: Story[];
  /** The eyebrow, heading and lead, on the left of the heading row. */
  heading: ReactNode;
};

export default function Postcards({ stories, heading }: PostcardsProps) {
  const count = stories.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [moved, setMoved] = useState(false);
  // Fanned out to their places (false: gathered behind the front one, before the ring is seen).
  const [spread, setSpread] = useState(true);
  const [still, setStill] = useState(false);
  // The fan is under way: each postcard waits 90ms more the further out it goes.
  const [fanning, setFanning] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    setStill(reduced);
    const ring = ringRef.current;
    if (!ring || reduced) return;
    const box = ring.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.85 && box.bottom > 0) return;
    setSpread(false);
    let timer = 0;
    const cancel = whenVisible(ring, 0.3, () => {
      setFanning(true);
      setSpread(true);
      timer = window.setTimeout(() => setFanning(false), 900);
    });
    return () => {
      cancel();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (paused || still || !spread || count < 2) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % count), ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, still, spread, count]);

  const show = (i: number) => {
    setActive(mod(i, count));
    setMoved(true);
  };

  // Each postcard's distance from the front, the shorter way round the ring.
  const offsetOf = (i: number) => {
    const d = mod(i - active, count);
    return d > count / 2 ? d - count : d;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    show(active + (event.key === "ArrowRight" ? 1 : -1));
  };

  // Swipe on touch: a mostly sideways flick turns the ring one place; vertical moves stay page scrolls.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== event.pointerId) return;
    const zoom = getCanvasZoom();
    const dx = (event.clientX - start.x) / zoom;
    const dy = (event.clientY - start.y) / zoom;
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy)) show(active + (dx < 0 ? 1 : -1));
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Student stories"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="flex w-full flex-col gap-10"
    >
      <div className="flex w-full justify-center">{heading}</div>

      {/* The ring: every postcard is centred on the stage and moved to its place in 3D. */}
      <div
        ref={ringRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
        className="relative h-[440px] w-full touch-pan-y [perspective:1400px]"
      >
        {/* The arrows at either edge of the ring. */}
        {([-1, 1] as const).map((side) => (
          <div
            key={side}
            data-reveal="fade"
            className={cx("absolute top-1/2 z-30 -translate-y-1/2", side < 0 ? "-left-6" : "-right-6")}
          >
            <CarouselArrow
              direction={side < 0 ? "prev" : "next"}
              label={side < 0 ? "Previous story" : "Next story"}
              size={52}
              tone={side < 0 ? "light" : "solid"}
              onClick={() => show(active + side)}
              className="shadow-rest"
            />
          </div>
        ))}
        {stories.map((story, i) => {
          const offset = offsetOf(i);
          const front = offset === 0;
          return (
            <div
              key={story.name}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!front}
              inert={!front}
              onClick={front ? undefined : () => show(i)}
              className={cx(
                "absolute top-1/2 left-1/2 [transform-style:preserve-3d] [transition:transform_600ms_var(--ease-out),opacity_600ms_var(--ease-out)] motion-reduce:transition-none",
                !front && "cursor-pointer",
              )}
              style={place(offset, spread, fanning)}
            >
              <Postcard story={story} front={front} />
            </div>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {moved ? `Story ${active + 1} of ${count}: ${stories[active].name}` : ""}
      </p>
    </div>
  );
}

type PostcardProps = {
  story: Story;
  /** At the front of the ring: it lifts on hover. */
  front: boolean;
};

/**
 * One postcard (Figma "postcard · …", 590 × 370): aged paper, the
 * student's words in Mukta italic with their signature on the left of the dividing rule; on the right
 * the postmark with the exam and its year, the student's portrait as the stamp, then the "address": the
 * name, the rank and year, the programme, and the address lines.
 */
function Postcard({ story, front }: PostcardProps) {
  const standing = [story.rank !== undefined ? `AIR ${story.rank}` : null, `${story.exam} ${story.year}`].filter(Boolean).join(" · ");
  return (
    <figure
      className={cx(
        "relative h-[370px] w-[590px] overflow-clip rounded-[4px] bg-[#fff1dc] shadow-[0_30px_40px_-18px_rgb(43_18_5/0.35)] [transition:translate_var(--dur-base)_var(--ease-out),box-shadow_var(--dur-base)_var(--ease-out)]",
        front && "hover:shadow-hover motion-safe:hover:-translate-y-1",
      )}
    >
      <img
        src="/images/free-resources/paper-texture.webp"
        alt=""
        aria-hidden="true"
        width={1024}
        height={1440}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover opacity-35"
      />
      <span aria-hidden="true" className="absolute top-14 left-[342px] h-[290px] w-px bg-[#5a160f]/35" />

      <div className="absolute top-16 left-6 flex w-[294px] flex-col items-start gap-[18px]">
        <blockquote className="font-heading text-[19px]/[1.45] text-[#2a140c] italic">
          <p>“{story.quote}”</p>
        </blockquote>
        {/* The signature repeats the name in the caption, so it is only seen. */}
        <p aria-hidden="true" className="font-heading text-[17px]/[normal] text-burnt italic">
          — {story.name}
        </p>
      </div>

      <Postmark exam={story.exam} year={story.year} />

      {/* The stamp: the portrait on a white stamp, its edges perforated in the card's own colour. */}
      <div aria-hidden="true" className="absolute top-5 left-[470px] h-[116px] w-24 overflow-clip bg-white">
        <Photo src={story.image} alt="" sizes="84px" className="absolute top-1.5 left-1.5 h-[104px] w-[84px] bg-[#f3e4cc]" />
        <img
          src="/images/stories/stamp-perforation.svg"
          alt=""
          width={102}
          height={122}
          className="pointer-events-none absolute -top-[3px] -left-[3px] h-[122px] w-[102px] max-w-none"
        />
      </div>

      <figcaption className="absolute top-[160px] left-[366px] flex w-[200px] flex-col items-start">
        <h3 className="font-heading text-[24px]/[1.2] font-normal text-[#5a160f]">{story.name}</h3>
        <p className="mt-2 font-mono text-[11px]/[1.4] tracking-[0.08em] text-burnt uppercase">{standing}</p>
        <p className="mt-1 text-[13px]/[1.5] text-clay">{story.programme}</p>
        <span aria-hidden="true" className="mt-4 flex w-full flex-col gap-[29px]">
          {[0, 1, 2].map((line) => (
            <span key={line} className="h-px w-full bg-[#5a160f]/30" />
          ))}
        </span>
      </figcaption>
    </figure>
  );
}

/** The wavy cancellation lines' tops, canvas px, as drawn. */
const WAVES = [12.4, 21.4, 30.4, 39.4];

/** The postmark (110 × 60): a burnt ring with the exam and its year in it, and four wavy lines beside it. Decoration: the caption says the same. */
function Postmark({ exam, year }: { exam: string; year: number }) {
  return (
    <div aria-hidden="true" className="absolute top-14 left-[360px] h-[60px] w-[110px]">
      <img src="/images/stories/postmark-ring.svg" alt="" width={53.5} height={53.5} className="absolute top-[3.25px] left-[3.25px] h-[53.5px] w-[53.5px] max-w-none" />
      <span className="absolute top-1 left-1 flex size-[52px] flex-col items-center justify-center font-mono text-[8px]/[10px] text-burnt">
        <span>{exam}</span>
        <span>{year}</span>
      </span>
      {WAVES.map((top) => (
        <img
          key={top}
          src="/images/stories/postmark-wave.svg"
          alt=""
          width={40.6174}
          height={7.2}
          className="absolute left-[57.69px] h-[7.2px] w-[40.6174px] max-w-none"
          style={{ top }}
        />
      ))}
    </div>
  );
}

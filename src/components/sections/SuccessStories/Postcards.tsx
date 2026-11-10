"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { CarouselArrow } from "@/components/ui/CarouselControls";
import Photo from "@/components/ui/Photo";
import type { Story } from "@/data/stories";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/*
 * The students' words on postcards (Figma "postcards-row", 2394:4187), side by side on the table, each
 * turned 1.2° (alternately one way and the other).
 *   - Entrance, once, when the row comes into view: the postcards are dealt onto the table one by one
 *     (180ms apart). Each flies in from a dealer's hand above the middle of the row, turned 7–13° (a
 *     different angle every time), lands just past its angle and settles onto it (900ms).
 *   - Hover: the postcard is picked up, straightening and lifting 4px with the hover shadow (--dur-base).
 *   - The round arrows always stand in the heading row. With more stories than fit (two) the row is a
 *     carousel, a postcard at a time, by the arrows, the ← → keys and a swipe, and moves are announced
 *     ("Stories 2 to 3 of 5"); until then the arrows rest dimmed. A third story in data/stories.ts is all it
 *     takes.
 *   - Reduced motion: no dealing and no lift; the postcards simply lie on the table.
 */

/** A postcard (590) and the gap after it (32). */
const STEP = 590 + 32;
/** Postcards on the table at once across the 1280 content width. */
const VISIBLE = 2;
const SWIPE_PX = 48;
const DEAL_MS = 900;
const DEAL_STAGGER_MS = 180;
/** How high above the row the dealer's hand is, canvas px. */
const DEAL_FROM_Y = -180;

type PostcardsProps = {
  stories: Story[];
  /** The eyebrow, heading and lead, on the left of the heading row. */
  heading: ReactNode;
};

export default function Postcards({ stories, heading }: PostcardsProps) {
  const count = stories.length;
  const paged = count > VISIBLE;
  const last = Math.max(0, count - VISIBLE);
  // The first postcard on the table, and whether the last move was by hand (and so announced).
  const [index, setIndex] = useState(0);
  const [moved, setMoved] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);

  // The deal: the postcards on the table wait in the dealer's hand until the row is seen.
  useEffect(() => {
    const row = rowRef.current;
    if (!row || prefersReducedMotion()) return;
    // Already on screen: left as it is.
    if (canvasTop(row) < (window.innerHeight / getCanvasZoom()) * 0.9) return;
    const hand = row.offsetWidth / 2;
    const deals = cardRefs.current.slice(0, VISIBLE).flatMap((card, i) => {
      if (!card) return [];
      // Layout px (canvas px), so neither the canvas zoom nor the card's own turn gets in the way.
      const dx = hand - (card.offsetLeft + card.offsetWidth / 2);
      const side = dx > 0 ? -1 : 1;
      const spin = side * (7 + Math.random() * 6);
      const settle = -side * (0.5 + Math.random() * 0.9);
      const deal = card.animate(
        [
          { opacity: 0, transform: `translate(${dx.toFixed(1)}px, ${DEAL_FROM_Y}px) rotate(${spin.toFixed(2)}deg) scale(1.04)`, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
          { opacity: 1, offset: 0.2 },
          { opacity: 1, transform: `translate(0px, 3px) rotate(${settle.toFixed(2)}deg) scale(1)`, offset: 0.7, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: DEAL_MS, delay: i * DEAL_STAGGER_MS, fill: "backwards" },
      );
      // Held at its start (in the hand, unseen) until the row comes into view.
      deal.pause();
      return [deal];
    });
    const cancel = whenVisible(row, 0.3, () => deals.forEach((deal) => deal.play()));
    return () => {
      cancel();
      deals.forEach((deal) => deal.cancel());
    };
  }, []);

  const goTo = (target: number) => {
    const next = Math.min(last, Math.max(0, target));
    if (next === index) return;
    setIndex(next);
    setMoved(true);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    goTo(index + (event.key === "ArrowRight" ? 1 : -1));
  };

  // Swipe on touch: a mostly sideways flick moves one postcard; vertical moves stay page scrolls.
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
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy)) goTo(index + (dx < 0 ? 1 : -1));
  };

  const region = paged ? { role: "region", "aria-roledescription": "carousel", "aria-label": "Student stories", onKeyDown } : {};

  return (
    <div {...region} className="flex w-full flex-col gap-14">
      <div className="flex w-full items-end justify-between">
        {heading}
        {/* The arrows always show; they wake up once there are more stories than the table holds. */}
        <div data-reveal="fade" className="flex items-center gap-2.5">
          <CarouselArrow direction="prev" label="Previous story" disabled={!paged || index === 0} onClick={() => goTo(index - 1)} />
          <CarouselArrow direction="next" label="Next story" tone="solid" disabled={!paged || index >= last} onClick={() => goTo(index + 1)} />
        </div>
      </div>

      {/* The table. Room above and below for the turned corners and the lift; clipped sideways only when it pages. */}
      <div
        ref={rowRef}
        onPointerDown={paged ? onPointerDown : undefined}
        onPointerUp={paged ? onPointerUp : undefined}
        onPointerCancel={paged ? () => (swipe.current = null) : undefined}
        className={cx("relative -my-4 py-4", paged ? "mx-auto w-[1212px] touch-pan-y overflow-x-clip [overflow-clip-margin:24px]" : "w-full")}
      >
        <div
          className={cx("flex w-max gap-8", paged ? "[transition:transform_var(--dur-slow)_var(--ease-in-out)]" : "mx-auto")}
          style={paged ? { transform: `translateX(${-index * STEP}px)` } : undefined}
        >
          {stories.map((story, i) => (
            <div key={story.name} {...(paged ? { role: "group", "aria-roledescription": "slide", "aria-label": `${i + 1} of ${count}` } : {})} className="shrink-0">
              <Postcard
                story={story}
                tilt={i % 2 === 0 ? "rotate-[1.2deg]" : "-rotate-[1.2deg]"}
                cardRef={(el) => {
                  cardRefs.current[i] = el;
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {paged && (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {moved ? `Stories ${index + 1} to ${index + VISIBLE} of ${count}` : ""}
        </p>
      )}
    </div>
  );
}

type PostcardProps = {
  story: Story;
  /** Its resting turn on the table, a rotate class. */
  tilt: string;
  cardRef: (el: HTMLElement | null) => void;
};

/**
 * One postcard (Figma "postcard · …", 590 × 370): aged paper, "Post card" printed at the top left, the
 * student's words in Newsreader italic with their signature on the left of the dividing rule; on the right
 * the postmark with the exam and its year, the student's portrait as the stamp, then the "address": the
 * name, the rank and year, the programme, and the address lines.
 */
function Postcard({ story, tilt, cardRef }: PostcardProps) {
  const standing = [story.rank !== undefined ? `AIR ${story.rank}` : null, `${story.exam} ${story.year}`].filter(Boolean).join(" · ");
  return (
    <figure
      ref={cardRef}
      className={cx(
        "relative h-[370px] w-[590px] overflow-clip rounded-[4px] bg-[#fff1dc] shadow-rest [transition:rotate_var(--dur-base)_var(--ease-out),translate_var(--dur-base)_var(--ease-out),box-shadow_var(--dur-base)_var(--ease-out)] hover:shadow-hover motion-safe:hover:-translate-y-1 motion-safe:hover:rotate-0",
        tilt,
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
      <p aria-hidden="true" className="absolute top-[18px] left-6 font-serif text-[18px]/[normal] font-medium tracking-[0.18em] text-[#5a160f] uppercase">
        Post card
      </p>
      <span aria-hidden="true" className="absolute top-14 left-[342px] h-[290px] w-px bg-[#5a160f]/35" />

      <div className="absolute top-16 left-6 flex w-[294px] flex-col items-start gap-[18px]">
        <blockquote className="font-serif text-[19px]/[1.45] text-[#2a140c] italic">
          <p>“{story.quote}”</p>
        </blockquote>
        {/* The signature repeats the name in the caption, so it is only seen. */}
        <p aria-hidden="true" className="font-serif text-[17px]/[normal] text-burnt italic">
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
        <h3 className="font-serif text-[24px]/[1.2] font-normal text-[#5a160f]">{story.name}</h3>
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

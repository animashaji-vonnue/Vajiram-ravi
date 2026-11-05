"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from "react";
import { CarouselArrow, CarouselDots } from "@/components/ui/CarouselControls";
import Photo from "@/components/ui/Photo";
import type { Story } from "@/data/stories";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";
import { useInView } from "@/lib/useInView";

/*
 * The glass card holds one story at a time; every story sits in the same grid cell, so the card keeps the
 * height of the longest. Motion spec (09 Success stories):
 *   - Next / previous cross-fades the story: the old one fades out over 200ms, then the quote and the
 *     name come in over 320ms, rising --rise-sm; the portrait swaps at once with a 1.04 → 1 settle. The
 *     amber ring stays put.
 *   - It moves on by itself every 7s, with the time shown filling the active dot. It holds while hovered
 *     or focused, while the tab is hidden and while the card is off screen; under reduced motion it never
 *     moves by itself.
 *   - The opening quote mark draws itself in, left to right, the first time the card comes into view.
 *   - The arrows, the dots, the ← → keys and a swipe move it by hand; those moves are announced
 *     ("Story 2 of 3"), the clock's are not.
 */

const INTERVAL = 7000;
const OUT_MS = 200;
const IN_MS = 320;
const MARK_MS = 500;
const SWIPE_PX = 48;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";
/** The design's near-black for the quote and the name. */
const TEXT = "text-[#161412]";

export default function StoryCarousel({ stories }: { stories: Story[] }) {
  const count = stories.length;
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(count > 1);
  // Moves by hand are announced; the clock's are not.
  const [announce, setAnnounce] = useState(false);
  const [rootRef, inView] = useInView<HTMLDivElement>({ threshold: 0.3, once: false });
  const cardRef = useRef<HTMLDivElement>(null);
  const slides = useRef<Array<HTMLElement | null>>([]);
  const fillRef = useRef<HTMLSpanElement>(null);
  const elapsed = useRef(0);
  // Held while a mouse is over it or keyboard focus is inside it.
  const hovered = useRef(false);
  const focused = useRef(false);
  const shown = useRef(0);
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);

  // Every move, by hand or by the clock, gives the next story its full time.
  const move = useCallback(
    (to: (current: number) => number, byHand: boolean) => {
      elapsed.current = 0;
      setAnnounce(byHand);
      setActive((current) => mod(to(current), count));
    },
    [count],
  );

  useEffect(() => {
    if (prefersReducedMotion()) setAutoplay(false);
  }, []);

  // The clock runs while the carousel is on screen; it only counts while nobody is hovering or focused
  // on it and the tab is visible, and the active dot fills as it counts.
  useEffect(() => {
    if (!autoplay || !inView) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Capped, so coming back to a hidden tab does not count the time away.
      const dt = Math.min(now - last, 100);
      last = now;
      if (!hovered.current && !focused.current && !document.hidden) {
        elapsed.current += dt;
        if (elapsed.current >= INTERVAL) move((current) => current + 1, false);
      }
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${Math.min(elapsed.current / INTERVAL, 1)})`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [autoplay, inView, move]);

  // The swap, started before paint so the old story never blinks out before it fades.
  useLayoutEffect(() => {
    const from = shown.current;
    if (from === active) return;
    shown.current = active;
    if (prefersReducedMotion()) return;
    const leaving = slides.current[from];
    const arriving = slides.current[active];
    if (leaving) {
      leaving.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
      leaving.animate([{ opacity: 1 }, { opacity: 0 }], { duration: OUT_MS, easing: EASE_IN });
    }
    if (!arriving) return;
    arriving.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    arriving
      .querySelector("[data-portrait]")
      ?.animate([{ opacity: 0, transform: "scale(1.04)" }, { opacity: 1, transform: "none" }], { duration: IN_MS, easing: EASE_OUT });
    const rise = getComputedStyle(document.documentElement).getPropertyValue("--rise-sm").trim() || "8px";
    arriving.querySelectorAll("[data-words]").forEach((el) =>
      el.animate([{ opacity: 0, transform: `translateY(${rise})` }, { opacity: 1, transform: "none" }], {
        duration: IN_MS,
        delay: OUT_MS,
        easing: EASE_OUT,
        fill: "backwards",
      }),
    );
  }, [active]);

  // The quote mark draws in once, as the card settles after its reveal.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion()) return;
    return whenVisible(card, 0.5, () => {
      slides.current[shown.current]
        ?.querySelector("[data-quote-mark]")
        ?.animate([{ clipPath: "inset(-20% 100% -20% -20%)" }, { clipPath: "inset(-20% -20% -20% -20%)" }], {
          duration: MARK_MS,
          delay: 300,
          easing: EASE_OUT,
          fill: "backwards",
        });
    });
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (count < 2 || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    const delta = event.key === "ArrowLeft" ? -1 : 1;
    move((current) => current + delta, true);
  };

  // Keyboard focus holds it; a mouse click on an arrow does not (the pointer already does while it is over).
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target.matches(":focus-visible")) focused.current = true;
  };
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) focused.current = false;
  };

  // Swipe on touch: a mostly sideways flick moves one story; vertical moves stay page scrolls.
  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (count < 2 || !start || start.id !== event.pointerId) return;
    const zoom = getCanvasZoom();
    const dx = (event.clientX - start.x) / zoom;
    const dy = (event.clientY - start.y) / zoom;
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy)) move((current) => current + (dx < 0 ? 1 : -1), true);
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Success stories"
      onKeyDown={onKeyDown}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") hovered.current = true;
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") hovered.current = false;
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      className="flex w-full flex-col gap-10"
    >
      {/* 1280 wide, 56 / 140 padding, white at 68% with the design's soft amber glow low in the middle. */}
      <div
        ref={cardRef}
        data-reveal
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
        className="relative grid w-full touch-pan-y overflow-clip rounded-[36px] bg-white/68 px-35 py-14 shadow-[0_18px_44px_rgb(140_64_13/0.1)]"
      >
        <img
          src="/images/stories/card-glow.svg"
          alt=""
          aria-hidden="true"
          width={880}
          height={580}
          className="pointer-events-none absolute top-[180px] left-[200px] h-[580px] w-[880px] max-w-none"
        />
        {stories.map((story, i) => (
          <StorySlide
            key={story.name}
            story={story}
            label={`${i + 1} of ${count}`}
            shown={i === active}
            slideRef={(el) => {
              slides.current[i] = el;
            }}
          />
        ))}
        {/* The 3px amber ring over the portrait, inside its edge; it stays still while the portraits swap. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-14 left-1/2 size-24 -translate-x-1/2 rounded-full border-3 border-[#f9a825]"
        />
      </div>

      {count > 1 && (
        <div data-reveal className="flex w-full items-center justify-end gap-5">
          <CarouselDots
            count={count}
            active={active}
            onSelect={(index) => move(() => index, true)}
            label="Choose a story"
            itemName="Story"
            fillRef={autoplay ? fillRef : undefined}
          />
          <div className="flex items-start gap-2.5">
            <CarouselArrow direction="prev" label="Previous story" onClick={() => move((current) => current - 1, true)} />
            <CarouselArrow direction="next" label="Next story" tone="solid" onClick={() => move((current) => current + 1, true)} />
          </div>
        </div>
      )}

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announce ? `Story ${active + 1} of ${count}` : ""}
      </p>
    </div>
  );
}

type StorySlideProps = {
  story: Story;
  label: string;
  shown: boolean;
  slideRef: (el: HTMLElement | null) => void;
};

/** One story: the portrait, the quote in Newsreader italic, the name and the mono line under it. */
function StorySlide({ story, label, shown, slideRef }: StorySlideProps) {
  return (
    // The slide is a group (a <figure> may not take that role); the figure inside keeps the quote and its caption together.
    <div
      ref={slideRef}
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      aria-hidden={!shown || undefined}
      inert={!shown}
      className={cx("relative col-start-1 row-start-1", !shown && "pointer-events-none opacity-0")}
    >
      <figure className="flex flex-col items-center gap-7">
      {/* The cut-out portrait on the design's peach; the name is beside it, so it is decoration. */}
      <span data-portrait className="block">
        <Photo src={story.image} alt="" sizes="96px" className="relative size-24 overflow-hidden rounded-full bg-[#ffe0bc]" />
      </span>
      <blockquote data-words className={cx("w-[960px] text-center font-serif text-[40px]/[1.3] italic", TEXT)}>
        <p>
          <span data-quote-mark className="inline-block">
            “
          </span>
          {story.quote}”
        </p>
      </blockquote>
      <figcaption data-words className="flex flex-col items-center gap-1 leading-[normal] whitespace-nowrap">
        <span className={cx("text-[17px] font-semibold", TEXT)}>{story.name}</span>
        <span className="font-mono text-[11px] tracking-[0.33px] text-[#6b5d52] uppercase">{`AIR ${story.rank} · ${story.exam} · ${story.programme}`}</span>
      </figcaption>
      </figure>
    </div>
  );
}

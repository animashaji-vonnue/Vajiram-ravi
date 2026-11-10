"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { CarouselArrow, CarouselDots } from "@/components/ui/CarouselControls";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/*
 * A coverflow carousel (About and Meet our educators), projected outward like the colonnade of Parliament
 * House: the centre slide is the biggest and stands square to the page; one and two places out the slides
 * are smaller, closer together and turned a little away, outer edge back. Further slides wait unseen
 * beyond the edges.
 *
 *   - The centre slide is "expanded" (renderSlide gets `expanded`): it shows its full content; the side
 *     slides are collapsed to their title. An optional caption under the centre (renderCaption) cross-
 *     fades to the next slide's as it changes.
 *   - Arrows, dots, the ← → keys, a swipe or a click on a side slide move it; it never ends (the items are
 *     laid out more than once round the loop, so the wrap always happens out of sight).
 *   - It plays on its own (`interval`), showing the time left in the active dot, and pauses while the
 *     pointer is over it, while focus is inside it, while it is off screen or the tab is hidden, and for
 *     good with the pause button. Moving it by hand restarts the count.
 *   - It enters once, when it comes into view: the slides start gathered at the centre, collapsed, and
 *     spread out to their places, after which the centre one expands.
 *   - Reduced motion: no entrance, no autoplay, moves are instant.
 *   - Assistive technology: a carousel region; each item is a slide labelled "n of N", all of its content
 *     readable even while collapsed (the repeat copies are hidden from it); moves made by hand are
 *     announced politely ("3 of 6: title").
 *
 * Every pose is set as a CSS transform with a transition, so nothing runs per frame except the autoplay
 * clock, and only while it is on screen and playing.
 */

/** How many slides show on each side of the centre. */
const SIDES = 2;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
/** A swipe at least this long (canvas px) moves one slide. */
const SWIPE = 40;

type SlideState = {
  /** The item's index. */
  index: number;
  /** In the centre. */
  active: boolean;
  /** In the centre and spread out: show the full content. */
  expanded: boolean;
  /** A repeat copy, hidden from assistive technology: it must not hold focusable elements. */
  copy: boolean;
};

type CoverflowProps<T> = {
  items: readonly T[];
  /** The carousel's accessible name, e.g. "Our educators". */
  label: string;
  /** What one item is called, in lower case: "card" reads "Previous card", "Card 3 of 6". */
  itemName: string;
  /** The item's title, for the announcement of a move. */
  slideTitle: (item: T) => string;
  renderSlide: (item: T, state: SlideState) => ReactNode;
  /** Shown under the centre slide for the item there, cross-fading as it changes. Visual only. */
  renderCaption?: (item: T, index: number) => ReactNode;
  /** The centre slide's box, canvas px. */
  width: number;
  height: number;
  /** Centre-to-centre distance of the slides one and two places out. */
  spacing: [number, number];
  /** Their scale. */
  scales: [number, number];
  /** How far they turn away, in degrees (rotateY). */
  turns?: [number, number];
  /** Autoplay step, ms; 0 for none. */
  interval?: number;
  /** "dark" on a dark or orange band (cream controls), "light" on paper. */
  tone?: "light" | "dark";
  /** Space between the stage and what follows it (caption, controls), canvas px. */
  gap?: number;
  className?: string;
};

/** A slide's place `offset` slots from the centre. */
function pose(offset: number, spread: boolean, spacing: [number, number], scales: [number, number], turns: [number, number]) {
  const away = Math.abs(offset);
  const side = Math.sign(offset);
  if (!spread) {
    // Gathered: the near slides peek out a little behind the centre one, collapsed.
    const peek = Math.min(away, SIDES);
    return { x: side * peek * 26, scale: 1 - peek * 0.06, turn: 0, opacity: away <= SIDES ? 1 : 0, z: 20 - away * 2 };
  }
  if (away === 0) return { x: 0, scale: 1, turn: 0, opacity: 1, z: 20 };
  if (away === 1) return { x: side * spacing[0], scale: scales[0], turn: side * turns[0], opacity: 1, z: 18 };
  if (away === 2) return { x: side * spacing[1], scale: scales[1], turn: side * turns[1], opacity: 1, z: 16 };
  // Unseen, just past the edge on its side.
  return { x: side * (spacing[1] + (spacing[1] - spacing[0]) * 0.7), scale: scales[1] * 0.85, turn: side * turns[1], opacity: 0, z: 0 };
}

export default function Coverflow<T>({
  items,
  label,
  itemName,
  slideTitle,
  renderSlide,
  renderCaption,
  width,
  height,
  spacing,
  scales,
  turns = [18, 28],
  interval = 0,
  tone = "light",
  gap = 40,
  className,
}: CoverflowProps<T>) {
  const count = items.length;
  // Enough copies that a slide only ever wraps round the loop while it is out of sight, even on a jump of
  // half the items (a dot pressed).
  const copies = count ? Math.max(1, Math.ceil((2 * (SIDES + Math.floor(count / 2)) + 2) / count)) : 1;
  const slots = count * copies;
  const half = Math.floor(slots / 2);

  const [slot, setSlot] = useState(0);
  const [spread, setSpread] = useState(true);
  const [entering, setEntering] = useState(false);
  const [still, setStill] = useState(false);
  const [playing, setPlaying] = useState(interval > 0);
  const [onScreen, setOnScreen] = useState(false);
  const active = count ? mod(slot, count) : 0;

  const regionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const clock = useRef(0);
  const hold = useRef({ hover: false, focus: false });
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);
  const swallowClick = useRef(false);

  const offsetOf = (s: number) => mod(s - slot + half, slots) - half;

  // Motion preference, the entrance and whether it is on screen.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = prefersReducedMotion();
    setStill(reduced);
    if (reduced) setPlaying(false);
    let cancel = () => {};
    let timer = 0;
    const alreadyThere = canvasTop(stage) < (window.innerHeight / getCanvasZoom()) * 0.85;
    if (!reduced && !alreadyThere) {
      // Gather the slides before they are seen, then spread them as they come into view.
      setSpread(false);
      cancel = whenVisible(stage, 0.35, () => {
        setEntering(true);
        setSpread(true);
        timer = window.setTimeout(() => setEntering(false), 1400);
      });
    }
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.25 });
    io.observe(stage);
    return () => {
      cancel();
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const move = (step: number, byHand: boolean) => {
    if (!count || step === 0) return;
    clock.current = 0;
    const next = mod(slot + step, slots);
    setSlot(next);
    if (!spread) setSpread(true);
    if (byHand && liveRef.current) {
      const index = mod(next, count);
      liveRef.current.textContent = `${index + 1} of ${count}: ${slideTitle(items[index])}`;
    }
  };
  // The clock's way to move, kept current with the latest render.
  const moveRef = useRef(move);
  useEffect(() => {
    moveRef.current = move;
  });

  const goTo = (index: number) => move(mod(index - active + Math.floor(count / 2), count) - Math.floor(count / 2), true);

  // The autoplay clock: only while it is spread, on screen and playing; pointer, focus and a hidden tab hold it.
  useEffect(() => {
    if (!interval || !playing || still || !spread || !onScreen || count < 2) {
      if (fillRef.current) fillRef.current.style.transform = "scaleX(0)";
      return;
    }
    let frame = 0;
    let last = 0;
    const tick = (time: number) => {
      const held = hold.current.hover || hold.current.focus || document.hidden;
      if (last && !held) clock.current += Math.min(250, time - last);
      last = time;
      if (clock.current >= interval) moveRef.current(1, false);
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${Math.min(1, clock.current / interval).toFixed(4)})`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [interval, playing, still, spread, onScreen, count]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1, true);
  };

  // A swipe or a sideways mouse drag moves one slide; a mostly vertical one is the page's.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    swallowClick.current = false;
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== event.pointerId) return;
    const zoom = getCanvasZoom();
    const dx = (event.clientX - start.x) / zoom;
    const dy = (event.clientY - start.y) / zoom;
    if (Math.abs(dx) < SWIPE || Math.abs(dy) > Math.abs(dx)) return;
    swallowClick.current = true;
    move(dx < 0 ? 1 : -1, true);
  };

  const slideStyle = (offset: number): CSSProperties => {
    const p = pose(offset, spread, spacing, scales, turns);
    // On the entrance the outer slides set off a little after the inner ones.
    const delay = entering ? Math.min(Math.abs(offset), SIDES) * 70 : 0;
    return {
      width,
      height,
      marginLeft: -width / 2,
      zIndex: p.z,
      opacity: p.opacity,
      transform: `translateX(${p.x.toFixed(1)}px) rotateY(${p.turn.toFixed(2)}deg) scale(${p.scale.toFixed(4)})`,
      transition: still ? "none" : `transform 900ms ${EASE} ${delay}ms, opacity 600ms ${EASE} ${delay}ms`,
      pointerEvents: p.opacity === 0 ? "none" : undefined,
    };
  };

  const name = itemName.charAt(0).toUpperCase() + itemName.slice(1);

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onFocus={() => (hold.current.focus = true)}
      onBlur={(event) => {
        if (!regionRef.current?.contains(event.relatedTarget as Node | null)) hold.current.focus = false;
      }}
      onPointerEnter={(event) => event.pointerType === "mouse" && (hold.current.hover = true)}
      onPointerLeave={() => (hold.current.hover = false)}
      className={cx("relative flex w-full flex-col items-center", className)}
    >
      {/* The stage: every slide is stacked on its centre line and placed by transform alone. */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
        onClickCapture={(event) => {
          if (swallowClick.current) {
            swallowClick.current = false;
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          // A click on a side slide brings it to the centre.
          const el = (event.target as Element | null)?.closest<HTMLElement>("[data-slot]");
          if (!el) return;
          const offset = offsetOf(Number(el.dataset.slot));
          if (offset === 0) return;
          event.preventDefault();
          move(offset, true);
        }}
        className="relative w-full touch-pan-y select-none [perspective:1800px]"
        style={{ height }}
      >
        {Array.from({ length: slots }, (_, s) => {
          const index = s % count;
          const offset = offsetOf(s);
          const copy = s >= count;
          const isActive = offset === 0;
          return (
            <div
              key={s}
              data-slot={s}
              {...(copy
                ? { "aria-hidden": true }
                : { role: "group", "aria-roledescription": "slide", "aria-label": `${index + 1} of ${count}` })}
              className={cx("absolute top-0 left-1/2 origin-center [backface-visibility:hidden]", !isActive && "cursor-pointer")}
              style={slideStyle(offset)}
            >
              {renderSlide(items[index], { index, active: isActive, expanded: isActive && spread, copy })}
            </div>
          );
        })}
      </div>

      {renderCaption && (
        <div aria-hidden="true" className="grid w-full justify-items-center" style={{ marginTop: gap }}>
          {items.map((item, i) => (
            <div
              key={i}
              className="col-start-1 row-start-1 w-full"
              style={{
                opacity: i === active && spread ? 1 : 0,
                translate: i === active && spread ? "0 0" : "0 8px",
                visibility: i === active && spread ? "visible" : "hidden",
                transition: still ? "none" : `opacity 500ms ${EASE}, translate 500ms ${EASE}, visibility 0s linear ${i === active ? "0s" : "500ms"}`,
              }}
            >
              {renderCaption(item, i)}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-5" style={{ marginTop: gap }}>
        <CarouselArrow direction="prev" label={`Previous ${itemName}`} tone={tone} size={48} onClick={() => move(-1, true)} />
        <CarouselDots
          count={count}
          active={active}
          onSelect={goTo}
          label={`Choose ${itemName}`}
          itemName={name}
          tone={tone}
          fillRef={interval && playing && !still ? fillRef : undefined}
        />
        {interval > 0 && !still && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause the carousel" : "Play the carousel"}
            aria-pressed={!playing}
            className={cx(
              "flex size-9 cursor-pointer items-center justify-center rounded-full border [transition:background-color_var(--dur-fast)_var(--ease-out),color_var(--dur-fast)_var(--ease-out),border-color_var(--dur-fast)_var(--ease-out)]",
              tone === "dark" ? "border-cream/45 text-cream hover:border-cream hover:bg-cream hover:text-ink" : "border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream",
            )}
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" width={14} height={14} fill="currentColor">
              {playing ? (
                <>
                  <rect x={3.5} y={2.5} width={3} height={11} rx={0.8} />
                  <rect x={9.5} y={2.5} width={3} height={11} rx={0.8} />
                </>
              ) : (
                <path d="M4.5 2.8v10.4c0 .6.6.9 1.1.6l8-5.2c.4-.3.4-.9 0-1.2l-8-5.2c-.5-.3-1.1 0-1.1.6Z" />
              )}
            </svg>
          </button>
        )}
        <CarouselArrow direction="next" label={`Next ${itemName}`} tone={tone} size={48} onClick={() => move(1, true)} />
      </div>

      <p ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only" />
    </div>
  );
}

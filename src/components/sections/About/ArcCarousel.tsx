"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { CarouselArrow, CarouselDots } from "@/components/ui/CarouselControls";
import type { AboutCard } from "@/data/about";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";
import ArcCard from "./ArcCard";
import { applyPose, cubicBezier, pose, SPRING_MS, spring, STEP_PX, wrapOffset } from "./arc";

/** A turn by the arrows, dots or keys: one place in 560ms (--ease-in-out), a little longer per extra place. */
const TURN_MS = 560;
const TURN_EXTRA_MS = 90;
const TURN_MAX_MS = 860;
const EASE_IN_OUT = cubicBezier(0.65, 0, 0.35, 1);
/** After a drag the wheel coasts to the nearest card (--ease-out). */
const SETTLE_MS = 420;
const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);
/** Pointer travel, in canvas px, before a press becomes a drag; a drag this long moves at least one card. */
const DRAG_THRESHOLD = 6;
const FLICK = 48;

/** The spread: the cards leave the pile this far apart, nearest places first, the right before the left. */
const SPREAD_STAGGER = 50;
/** How each card lies in the pile before the spread, degrees about its own centre (the centre card square). */
const PILE_TILT = [0, 3.5, -4, 2, -2.5, 5];

type Drag = { id: number; x: number; y: number; from: number; dx: number; dragging: boolean };

type ArcCarouselProps = {
  cards: AboutCard[];
  /** The carousel's accessible name. */
  label: string;
  /** What one card is called: "Card 2 of 6". */
  itemName: string;
};

/**
 * The arc carousel (Figma "arc carousel" 2377:4531 and "carousel controls" 2377:4598): tall cards fanned
 * along a wide arc, the centre one upright and dark, two each side leaning out along the arc, under round
 * arrows and dots. The wheel turns endlessly; the card opposite the centre waits behind, unseen.
 *
 * Entrance (the client's "spread rows", after animos.app): while the section is still below, the cards lie
 * in a neat pile at the centre, the centre card on top and the others squared up a few degrees askew under
 * it. When the arc is a third in view they spread out along the arc to their places, each turning into its
 * angle on a spring (about 8% past, then back), nearest places first, 50ms apart: about 900ms in all. Already
 * on screen at load, or with reduced motion, the cards are simply on the arc.
 *
 * Then it is a carousel:
 *   - The arrows and dots turn the wheel (the dots by the shorter way round): one place in 560ms with
 *     --ease-in-out. The arrow keys do the same while focus is in the carousel; Home and End go to the
 *     first and last card.
 *   - Dragging with a mouse, or swiping, turns the wheel with the pointer (≈307px a card, along the arc);
 *     letting go coasts to the nearest card, and a flick moves at least one.
 *   - Clicking a side card brings it to the centre; under a mouse it lifts 8px to say so.
 *   - The card at the centre takes the dark look as it arrives (ArcCard); the others are light.
 * Each card is a slide, "n of 6"; a polite live region names the centre card once the visitor has turned
 * the wheel. Reduced motion: no spread, and a turn changes the cards at once, without travel.
 *
 * The wheel is turned frame by frame (requestAnimationFrame) through one number, the position, rather than
 * by CSS transitions: every card's place, lean, size, fade and stacking follow from it, so a turn can be
 * caught mid-way by a drag or another click and continue from exactly where it is.
 */
export default function ArcCarousel({ cards, label, itemName }: ArcCarouselProps) {
  const count = cards.length;
  // The card at the centre, for the dark look, the dots and the announcement.
  const [active, setActive] = useState(0);
  const [moved, setMoved] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  /** The wheel's position: the index (unbounded, fractional while turning) of the card at the centre. */
  const position = useRef(0);
  /** Where the current turn ends, so quick clicks add up. */
  const target = useRef(0);
  const frame = useRef(0);
  const spreading = useRef(false);
  const drag = useRef<Drag | null>(null);
  // After a drag, the click that ends it must not bring a card to the centre.
  const swallowClick = useRef(false);

  // The cards' poses as first rendered (the wheel at rest on the first card). React never changes these
  // styles again; the turns write them directly.
  const [initialPoses] = useState(() => cards.map((_, i) => pose(wrapOffset(i, count))));

  const paint = (at: number) => {
    cardRefs.current.forEach((el, i) => {
      if (el) applyPose(el, pose(wrapOffset(i - at, count)));
    });
  };

  /** Ends any turn or spread where it is; a spread caught mid-way jumps to the arc. */
  const halt = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (spreading.current) {
      spreading.current = false;
      paint(position.current);
    }
  };

  const turnTo = (next: number, duration: number, ease: (t: number) => number) => {
    halt();
    target.current = next;
    setActive(mod(next, count));
    setMoved(true);
    if (prefersReducedMotion()) {
      position.current = next;
      paint(next);
      return;
    }
    const from = position.current;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      position.current = from + (next - from) * ease(t);
      paint(position.current);
      frame.current = t < 1 ? requestAnimationFrame(step) : 0;
    };
    frame.current = requestAnimationFrame(step);
  };

  /** Turns by `places` (negative: back), from where the current turn is heading. */
  const turnBy = (places: number) => {
    if (!places) return;
    const duration = Math.min(TURN_MAX_MS, TURN_MS + (Math.abs(places) - 1) * TURN_EXTRA_MS);
    turnTo(target.current + places, duration, EASE_IN_OUT);
  };

  /** Brings card `i` to the centre by the shorter way round. */
  const show = (i: number) => turnBy(wrapOffset(i - target.current, count));

  // The spread: the pile waits until the arc is a third in view.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion()) return;
    if (canvasTop(stage) < (window.innerHeight / getCanvasZoom()) * 0.85) return;

    const places = cards.map((_, i) => wrapOffset(i, count));
    // Nearest places first; at the same distance the right one first.
    const order = places
      .map((place, i) => ({ place, i }))
      .filter(({ place }) => place !== 0)
      .sort((a, b) => Math.abs(a.place) - Math.abs(b.place) || b.place - a.place);
    const delays = new Map(order.map(({ i }, k) => [i, k * SPREAD_STAGGER]));
    const total = (order.length - 1) * SPREAD_STAGGER + SPRING_MS;

    const spreadAt = (elapsed: number) => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const k = spring(elapsed - (delays.get(i) ?? 0));
        applyPose(el, pose(places[i] * k, (PILE_TILT[i % PILE_TILT.length] ?? 0) * (1 - k), Math.abs(places[i])));
      });
    };

    spreading.current = true;
    spreadAt(0);
    const cancel = whenVisible(stage, 0.35, () => {
      if (!spreading.current) return;
      const start = performance.now();
      const step = (now: number) => {
        if (!spreading.current) return;
        const elapsed = now - start;
        spreadAt(elapsed);
        if (elapsed < total) frame.current = requestAnimationFrame(step);
        else {
          spreading.current = false;
          frame.current = 0;
        }
      };
      frame.current = requestAnimationFrame(step);
    });
    return () => {
      cancel();
      cancelAnimationFrame(frame.current);
      if (spreading.current) {
        spreading.current = false;
        cardRefs.current.forEach((el, i) => {
          if (el) applyPose(el, pose(wrapOffset(i - position.current, count)));
        });
      }
    };
  }, [cards, count]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const places =
      event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowLeft"
          ? -1
          : event.key === "Home"
            ? wrapOffset(-target.current, count)
            : event.key === "End"
              ? wrapOffset(count - 1 - target.current, count)
              : null;
    if (places === null) return;
    event.preventDefault();
    turnBy(places);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swallowClick.current = false;
    drag.current = null;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, from: position.current, dx: 0, dragging: false };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    if (event.pointerType === "mouse" && event.buttons === 0) {
      drag.current = null;
      return;
    }
    // Pointer deltas are in screen px; the canvas may be zoomed down.
    const zoom = getCanvasZoom();
    const dx = (event.clientX - current.x) / zoom;
    if (!current.dragging) {
      const dy = (event.clientY - current.y) / zoom;
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
      // Mostly vertical: a page scroll, not a swipe.
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        return;
      }
      halt();
      current.from = position.current;
      current.x = event.clientX;
      current.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }
    current.dx = dx;
    position.current = current.from - dx / STEP_PX;
    paint(position.current);
    setActive(mod(Math.round(position.current), count));
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    if (!current.dragging) return;
    swallowClick.current = true;
    const start = Math.round(current.from);
    let next = Math.round(position.current);
    if (cancelled) next = start;
    else if (next === start && Math.abs(current.dx) > FLICK) next += current.dx < 0 ? 1 : -1;
    turnTo(next, SETTLE_MS, EASE_OUT);
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    // detail 0 is a keyboard "click", which a drag never produces.
    if (!swallowClick.current || event.detail === 0) return;
    swallowClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={onKeyDown} className="flex w-full flex-col items-center gap-12">
      {/*
        The arc, 1440 × 560 on the canvas: the centre card's top 32px down (room for its shadow and the side
        cards' lift), the outer cards running past the canvas edges, where the band clips them.
      */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => endDrag(event, false)}
        onPointerCancel={(event) => endDrag(event, true)}
        onClickCapture={onClickCapture}
        onDragStart={(event) => event.preventDefault()}
        className="relative h-[560px] w-canvas cursor-grab touch-pan-y select-none active:cursor-grabbing"
      >
        {cards.map((card, i) => {
          const centred = i === active;
          return (
            <div
              key={card.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              onClick={centred ? undefined : () => show(i)}
              className={cx("group/arc absolute top-8 left-[580px] h-[388px] w-[280px] will-change-transform", !centred && "cursor-pointer")}
              style={initialPoses[i]}
            >
              <ArcCard card={card} index={i} active={centred} />
            </div>
          );
        })}
      </div>

      <div data-reveal className="flex items-center gap-4">
        <CarouselArrow direction="prev" label={`Previous ${itemName.toLowerCase()}`} size={48} onClick={() => turnBy(-1)} />
        <CarouselDots count={count} active={active} onSelect={show} label={label} itemName={itemName} />
        <CarouselArrow direction="next" label={`Next ${itemName.toLowerCase()}`} size={48} onClick={() => turnBy(1)} />
      </div>

      <p aria-live="polite" className="sr-only">
        {moved ? `${itemName} ${active + 1} of ${count}: ${cards[active].title}` : ""}
      </p>
    </div>
  );
}

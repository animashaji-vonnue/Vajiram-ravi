"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { CarouselArrow } from "@/components/ui/CarouselControls";
import GradualBlur from "@/components/ui/GradualBlur";
import { batchesCopy, type Batch } from "@/data/admissions";
import { getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";
import BatchTicket from "./BatchTicket";

/* The motion tokens, for the Web Animations API (which cannot read CSS variables). */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
const DUR_FAST = 200;
const DUR_BASE = 320;

/** Spec: tickets that leave a selection fold away (scaleY 0.9 and a fade) in 160ms... */
const FOLD_MS = 160;
/** ...the exit being 70% of the entry, tickets that join one unfold in this long. */
const UNFOLD_MS = Math.round(FOLD_MS / 0.7);
/**
 * Spec: the date's digits flip in 60ms apart (on re-flows); on the first sight, quicker: 30ms apart, each
 * ticket 40ms after the one before it, so every date reads within about half a second.
 */
const DIGIT_STAGGER_MS = 60;
const FIRST_DIGIT_STAGGER_MS = 30;
const TICKET_STAGGER_MS = 40;
/** The first sight's digit flip, ms. */
const FLIP_MS = 280;
/** Spec: the "Limited seats" stamp comes down in 220ms, then the ticket shakes 2px. */
const STAMP_MS = 220;
const SHAKE_PX = 2;

const DRAG_START_PX = 6;
/** The release speed of a drag is measured over this last stretch of it. */
const VELOCITY_WINDOW_MS = 100;
/** How far a flick carries: the release speed (px/ms) times this. */
const MOMENTUM_MS = 250;
/** Snapping comes back once the track has been still this long after a drag. */
const SETTLE_MS = 120;

type Drag = { id: number; x: number; scroll: number; moved: boolean; samples: Array<{ t: number; x: number }> };

type BatchTrackProps = {
  /** Every batch the track can show (the upcoming ones), in date order. */
  batches: Batch[];
  /** Ids of the batches in the current selection. Tickets that leave fold away, then the rest close up. */
  shownIds: string[];
  /** A batch's head colour (its place among all batches). */
  toneOf: (id: string) => number;
};

/**
 * The ticket track, with a round arrow at either side of it, level with the tickets: a native horizontal
 * scroller with scroll snapping, so trackpads and touch swipe it as usual (the page's smooth scrolling
 * leaves sideways gestures alone). A mouse drags it, with a flick carrying on to the nearest ticket; the
 * arrows and the arrow keys move it one ticket at a time, and an arrow dims when there is nothing further
 * its way. The track is the content's 1280px, so four tickets show, as drawn; the arrows sit in the
 * margins beside it.
 *
 * When it is first seen, the tickets' dates flip in like a departure board and the "Limited seats" stamps
 * come down; with reduced motion they are simply there.
 *
 * Opening, after React Bits Pro "Parallax Cards" (ui/TextMotion, data-depth-cards on the track): as the
 * track comes into view the tickets start at different depths, some lower, smaller and fainter than
 * others and each a little turned, and settle together into the flat row (560ms, 40ms apart). It is timed,
 * not scrubbed, so the tickets are never left half-settled where the scroll stops and their text reads
 * within about half a second. It moves the slides with the individual translate, scale and rotate
 * properties only, so the re-flow, the folds and the stamp's shake (transform animations) play over it
 * untouched, and the date flips and stamps land as the row settles.
 * The track's edges soften into a stepped blur where more tickets wait (ui/GradualBlur).
 */
export default function BatchTrack({ batches, shownIds, toneOf }: BatchTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const targetKey = shownIds.join(" ");
  const [rendered, setRendered] = useState(shownIds);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [dragging, setDragging] = useState(false);
  // Where each ticket sat just before a re-flow, read back after it to slide each one across.
  const before = useRef<Map<string, number> | null>(null);
  const drag = useRef<Drag | null>(null);
  // A drag just ended, so the click it ends with is not a click on "Register now".
  const dragged = useRef(false);
  const stopSettling = useRef<(() => void) | null>(null);

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft >= track.scrollWidth - track.clientWidth - 1);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => {
      window.removeEventListener("resize", updateEdges);
      stopSettling.current?.();
    };
  }, [updateEdges]);

  // Lenis smooths the page's wheel unless a gesture has no vertical part at all. A mostly sideways swipe
  // over the track is marked for Lenis to skip, so the track scrolls natively even when the swipe wobbles.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        (event as WheelEvent & { lenisStopPropagation?: boolean }).lenisStopPropagation = true;
      }
    };
    track.addEventListener("wheel", onWheel, { passive: true });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  // The first sight of the tickets: each date's digits flip in like a departure board (rotateX 90° to 0,
  // 280ms, 30ms apart, each ticket 40ms after the last), then each "Limited seats" stamp comes down (scale
  // 1.3 to 1 and a fade, 220ms) and its ticket gives a 2px shake: all done within about 0.8s. Once. The digits and stamps wait hidden until then; tickets that only join
  // later (through the tabs) are shown as they are.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion() || typeof track.animate !== "function") return;
    const digits = Array.from(track.querySelectorAll<HTMLElement>("[data-flip-digit]"));
    const stamps = Array.from(track.querySelectorAll<HTMLElement>("[data-stamp]"));
    const waiting = [...digits, ...stamps];
    waiting.forEach((el) => (el.style.opacity = "0"));

    const cancel = whenVisible(track, 0.55, () => {
      const tickets = Array.from(track.querySelectorAll<HTMLElement>("[data-ticket]"));
      for (const el of waiting) {
        el.style.opacity = "";
        if (!el.isConnected) continue;
        const ticket = el.closest<HTMLElement>("[data-ticket]");
        const order = ticket ? Math.max(0, tickets.indexOf(ticket)) : 0;
        // Straight away, while the tickets settle into their row (the track's one entrance, data-depth-cards).
        const start = Math.min(order, 4) * TICKET_STAGGER_MS;
        if (el.hasAttribute("data-flip-digit")) {
          const place = Array.from(el.parentElement?.children ?? []).indexOf(el);
          el.animate(
            [
              { opacity: 0, transform: "perspective(320px) rotateX(90deg)" },
              { opacity: 1, offset: 0.3 },
              { opacity: 1, transform: "perspective(320px) rotateX(0deg)" },
            ],
            { duration: FLIP_MS, delay: start + place * FIRST_DIGIT_STAGGER_MS, easing: EASE_OUT, fill: "backwards" },
          );
        } else {
          // After the date has landed.
          const delay = start + FLIP_MS + FIRST_DIGIT_STAGGER_MS * 2;
          el.animate(
            [
              { opacity: 0, transform: "scale(1.3)" },
              { opacity: 1, transform: "scale(1)" },
            ],
            { duration: STAMP_MS, delay, easing: EASE_OUT, fill: "backwards" },
          );
          ticket?.animate(
            [
              { transform: "translateX(0)" },
              { transform: `translateX(-${SHAKE_PX}px)` },
              { transform: `translateX(${SHAKE_PX}px)` },
              { transform: `translateX(-${SHAKE_PX / 2}px)` },
              { transform: "translateX(0)" },
            ],
            { duration: DUR_FAST, delay: delay + STAMP_MS * 0.8, easing: EASE_IN_OUT },
          );
        }
      }
    });
    return () => {
      cancel();
      waiting.forEach((el) => (el.style.opacity = ""));
    };
  }, []);

  // A new selection: the tickets that leave fold away first, then the track re-flows.
  useEffect(() => {
    if (rendered.join(" ") === targetKey) return;
    const next = targetKey ? targetKey.split(" ") : [];
    const commit = () => {
      const scroll = trackRef.current?.scrollLeft ?? 0;
      before.current = new Map(rendered.map((id) => [id, (nodes.current.get(id)?.offsetLeft ?? 0) - scroll]));
      setRendered(next);
    };
    const leaving = rendered
      .filter((id) => !next.includes(id))
      .map((id) => nodes.current.get(id))
      .filter((el): el is HTMLDivElement => !!el);
    if (!leaving.length || prefersReducedMotion() || typeof Element.prototype.animate !== "function") {
      commit();
      return;
    }
    let live = true;
    const folds = leaving.map((el) => {
      el.style.transformOrigin = "50% 0";
      return el.animate(
        [
          { opacity: 1, transform: "none" },
          { opacity: 0, transform: "scaleY(0.9)" },
        ],
        { duration: FOLD_MS, easing: EASE_IN, fill: "forwards" },
      );
    });
    Promise.all(folds.map((fold) => fold.finished)).then(
      () => live && commit(),
      () => {},
    );
    return () => {
      live = false;
      folds.forEach((fold) => fold.cancel());
    };
  }, [targetKey, rendered]);

  // After a re-flow: the tickets that stayed close the gap; the ones that joined unfold into place.
  useLayoutEffect(() => {
    const previous = before.current;
    if (!previous) return;
    before.current = null;
    // A new selection starts again from its first batch.
    if (trackRef.current) trackRef.current.scrollLeft = 0;
    updateEdges();
    if (prefersReducedMotion()) return;
    let joining = 0;
    for (const id of rendered) {
      const el = nodes.current.get(id);
      if (!el) continue;
      const from = previous.get(id);
      if (from === undefined) {
        el.style.transformOrigin = "50% 0";
        el.animate(
          [
            { opacity: 0, transform: "scaleY(0.9)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: UNFOLD_MS, delay: DUR_BASE * 0.5 + joining++ * DIGIT_STAGGER_MS, easing: EASE_OUT, fill: "backwards" },
        );
      } else if (Math.abs(from - el.offsetLeft) > 0.5) {
        el.animate([{ transform: `translateX(${from - el.offsetLeft}px)` }, { transform: "none" }], {
          duration: DUR_BASE,
          easing: EASE_IN_OUT,
        });
      }
    }
  }, [rendered, updateEdges]);

  /** The scroll position that puts a ticket at the track's left edge, within the track's reach. */
  const stopOf = (slide: HTMLElement) => {
    const track = trackRef.current;
    if (!track) return 0;
    return Math.min(track.scrollWidth - track.clientWidth, Math.max(0, slide.offsetLeft));
  };
  const stops = () => Array.from(trackRef.current?.children ?? [], (slide) => stopOf(slide as HTMLElement));

  const glideTo = (left: number) => {
    trackRef.current?.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  /** Moves the track one ticket along. */
  const step = (direction: 1 | -1) => {
    const at = trackRef.current?.scrollLeft ?? 0;
    const list = stops();
    const target = direction > 0 ? list.find((stop) => stop > at + 1) : list.findLast((stop) => stop < at - 1);
    if (target !== undefined) glideTo(target);
  };

  // Snapping is off while a mouse drags the track; it comes back once the release glide has settled.
  const settleSnap = () => {
    const track = trackRef.current;
    if (!track) return;
    let timer = 0;
    const stop = () => {
      window.clearTimeout(timer);
      track.removeEventListener("scroll", onScroll);
      stopSettling.current = null;
    };
    const done = () => {
      stop();
      track.style.scrollSnapType = "";
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(done, SETTLE_MS);
    };
    timer = window.setTimeout(done, SETTLE_MS * 2);
    track.addEventListener("scroll", onScroll, { passive: true });
    stopSettling.current = stop;
  };

  // Touch and pens scroll the track natively; a mouse drags it.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragged.current = false;
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      scroll: event.currentTarget.scrollLeft,
      moved: false,
      samples: [{ t: event.timeStamp, x: event.clientX }],
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const track = event.currentTarget;
    const dx = (event.clientX - current.x) / getCanvasZoom();
    if (!current.moved) {
      // Released somewhere the track never heard about: not a drag.
      if (!(event.buttons & 1)) {
        drag.current = null;
        return;
      }
      if (Math.abs(dx) < DRAG_START_PX) return;
      current.moved = true;
      stopSettling.current?.();
      track.setPointerCapture(event.pointerId);
      track.style.scrollSnapType = "none";
      setDragging(true);
    }
    track.scrollLeft = current.scroll - dx;
    current.samples.push({ t: event.timeStamp, x: event.clientX });
    while (current.samples.length > 2 && event.timeStamp - current.samples[0].t > VELOCITY_WINDOW_MS) current.samples.shift();
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    if (!current.moved) return;
    dragged.current = true;
    setDragging(false);
    // Glide on in the direction of a flick, to the ticket nearest where it would carry.
    const first = current.samples[0];
    const last = current.samples[current.samples.length - 1];
    const span = last.t - first.t;
    const fresh = event.timeStamp - last.t < VELOCITY_WINDOW_MS;
    const speed = fresh && span > 0 ? (last.x - first.x) / getCanvasZoom() / span : 0;
    const aim = event.currentTarget.scrollLeft - speed * MOMENTUM_MS;
    const target = stops().reduce<number | null>(
      (best, stop) => (best === null || Math.abs(stop - aim) < Math.abs(best - aim) ? stop : best),
      null,
    );
    if (target !== null) glideTo(target);
    settleSnap();
  };

  // Keyboard clicks have no detail, so they always go through.
  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!dragged.current || event.detail === 0) return;
    dragged.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  // From a ticket's "Register now", ← and → move to the neighbouring ticket and take the focus with them.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const slides = Array.from(event.currentTarget.children) as HTMLElement[];
    const from = slides.findIndex((slide) => slide.contains(event.target as Node));
    if (from < 0) {
      step(direction);
      return;
    }
    const to = slides[from + direction];
    if (!to) return;
    to.querySelector<HTMLElement>("button, a")?.focus({ preventScroll: true });
    glideTo(stopOf(to));
  };

  const byId = new Map(batches.map((batch) => [batch.id, batch]));
  const tickets = rendered.flatMap((id) => byId.get(id) ?? []);
  const count = shownIds.length;

  return (
    <>
      {/* No section reveal here: the tickets' settling (data-depth-cards) is the track's one entrance. */}
      <div className="relative w-full">
        {/* This tells screen readers how many batches a new selection holds. */}
        <p aria-live="polite" className="sr-only">
          {count} {count === 1 ? "batch" : "batches"}
        </p>
        {/* The arrows in the margins either side of the track, level with the tickets' middle. */}
        {([-1, 1] as const).map((side) => (
          <div key={side} className={`absolute top-[180px] z-10 -translate-y-1/2 ${side < 0 ? "-left-[66px]" : "-right-[66px]"}`}>
            <CarouselArrow
              direction={side < 0 ? "prev" : "next"}
              label={side < 0 ? "Previous batches" : "Next batches"}
              onClick={() => step(side)}
              disabled={side < 0 ? atStart : atEnd}
            />
          </div>
        ))}
        <div className="relative">
          {/*
           * Room around the 360px tickets, which the scroller would otherwise clip: 48px above for the hover
           * lift, 48px below for the lifted ticket's shadow.
           */}
          <div
            ref={trackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Upcoming batches"
            onScroll={updateEdges}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
            onClickCapture={onClickCapture}
            onKeyDown={onKeyDown}
            onDragStart={(event) => event.preventDefault()}
            data-depth-cards
            className={`relative -mt-12 -mb-12 flex h-[456px] snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pt-12 pb-12 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          >
            {tickets.map((batch, i) => (
              <div
                key={batch.id}
                ref={(el) => {
                  if (el) nodes.current.set(batch.id, el);
                  else nodes.current.delete(batch.id);
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${tickets.length}`}
                className="shrink-0 snap-start"
              >
                <BatchTicket batch={batch} tone={toneOf(batch.id)} />
              </div>
            ))}
          </div>
          {/*
           * The track's edges soften into a stepped blur (ui/GradualBlur) on the side where there are more
           * tickets to come, over the tickets' height; at the first or last ticket that side is clear.
           */}
          {([-1, 1] as const).map((side) => (
            <GradualBlur
              key={side}
              side={side < 0 ? "left" : "right"}
              strength={4}
              layers={3}
              className={`top-0 z-[5] h-[360px] w-7 [transition:opacity_var(--dur-base)_var(--ease-out)] ${side < 0 ? "left-0" : "right-0"}`}
              style={{ opacity: (side < 0 ? atStart : atEnd) ? 0 : 1 }}
            />
          ))}
          {!tickets.length && !count && (
            <p className="absolute inset-x-0 top-0 flex h-[360px] items-center justify-center rounded-[18px] border border-dashed border-ink/20 text-[15px]/[22px] text-clay">
              <span>
                {batchesCopy.empty} —{" "}
                <a
                  href="#counselling"
                  className="font-bold text-burnt underline decoration-burnt/40 underline-offset-[3px] [transition:text-decoration-color_var(--dur-fast)_var(--ease-out)] hover:decoration-burnt"
                >
                  {batchesCopy.emptyLink}
                </a>
              </span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode, type RefObject } from "react";
import { CarouselArrow } from "@/components/ui/CarouselControls";
import CursorLabel from "@/components/ui/CursorLabel";
import IndianLink from "@/components/ui/IndianLink";
import Photo from "@/components/ui/Photo";
import PointerGlow, { hasFinePointer } from "@/components/ui/PointerGlow";
import ProgressRule, { setProgress } from "@/components/ui/ProgressRule";
import type { Educator } from "@/data/faculty";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";

/** One card (200) plus the gap (16): a card's step along the track. */
const STEP = 216;
/** Cards on show at once across the 1280 content width. */
const VISIBLE = 6;
/** Pointer travel, in canvas px, before a press becomes a drag. */
const DRAG_THRESHOLD = 6;
/** A drag this long moves at least one card. */
const FLICK = 48;
/** Past either end the track follows the pointer at this rate. */
const EDGE_GIVE = 0.35;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** The cards' tilt toward the pointer (after Unlumen's tilt card): at most 4° each way, in 900px of perspective. */
const TILT_MAX = 4;
const TILT_PERSPECTIVE = 900;
/** The tilt follows the pointer with this time constant: it closes ~63% of the gap in this long. */
const TILT_FOLLOW_MS = 90;
/** On leave the card eases back flat over --dur-base... */
const TILT_BACK_MS = 320;
/** ...with --ease-out, cubic-bezier(0.22, 1, 0.36, 1), which is the ease-out quint. */
const easeOut = (t: number) => 1 - (1 - t) ** 5;

/**
 * Tilts the card toward the pointer: the side under it sinks back, up to TILT_MAX on each axis. It is a
 * `transform` (the hover lift of a linked card is the separate `translate`, so the two add up), written in
 * a frame loop that runs only while the card is moving, and cleared once the card is flat again. Fine
 * pointers only; never with reduced motion.
 */
function useTilt(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !hasFinePointer()) return;
    let hovering = false;
    let frame = 0;
    let last = 0;
    let leftAt = 0;
    // Degrees about the x and y axes: where the pointer wants the card, where it is, where it was on leave.
    const aim = { x: 0, y: 0 };
    const now = { x: 0, y: 0 };
    const from = { x: 0, y: 0 };

    const write = () => {
      el.style.transform = `perspective(${TILT_PERSPECTIVE}px) rotateX(${now.x.toFixed(3)}deg) rotateY(${now.y.toFixed(3)}deg)`;
    };
    const step = (time: number) => {
      frame = 0;
      if (hovering) {
        const dt = last ? Math.min(64, time - last) : 16;
        last = time;
        const k = 1 - Math.exp(-dt / TILT_FOLLOW_MS);
        now.x += (aim.x - now.x) * k;
        now.y += (aim.y - now.y) * k;
        write();
        if (Math.abs(aim.x - now.x) > 0.01 || Math.abs(aim.y - now.y) > 0.01) frame = requestAnimationFrame(step);
        else last = 0;
        return;
      }
      const t = clamp((time - leftAt) / TILT_BACK_MS, 0, 1);
      const eased = easeOut(t);
      now.x = from.x * (1 - eased);
      now.y = from.y * (1 - eased);
      if (t < 1) {
        write();
        frame = requestAnimationFrame(step);
        return;
      }
      el.style.transform = "";
      el.style.willChange = "";
    };
    const run = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    const onMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // -1 to 1 across the card. Ratios of screen px, so the canvas zoom cancels out.
      const nx = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      const ny = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
      aim.x = -ny * TILT_MAX;
      aim.y = nx * TILT_MAX;
      if (!hovering) {
        hovering = true;
        last = 0;
        el.style.willChange = "transform";
      }
      run();
    };
    const onLeave = () => {
      if (!hovering) return;
      hovering = false;
      from.x = now.x;
      from.y = now.y;
      leftAt = performance.now();
      cancelAnimationFrame(frame);
      frame = 0;
      run();
    };

    el.addEventListener("pointerenter", onMove);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onMove);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      el.style.transform = "";
      el.style.willChange = "";
    };
  }, [ref]);
}

/** Moves the track and fills the progress line to the share of the faculty seen so far, as transforms. */
function place(track: HTMLElement, fill: HTMLElement, offset: number, count: number, animate: boolean) {
  track.style.transition = animate ? "transform var(--dur-base) var(--ease-in-out)" : "none";
  track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  setProgress(fill, count ? clamp((offset / STEP + VISIBLE) / count, 0, 1) : 1, animate);
}

type Drag = { id: number; x: number; y: number; dx: number; dragging: boolean };

type FacultyCarouselProps = {
  educators: Educator[];
  /** The eyebrow, heading and lead, shown left of the arrows. */
  heading: ReactNode;
  /** The label of the profile link, "View profile". */
  profileLabel: string;
};

/**
 * The faculty carousel (Figma "guru row" and its controls, 2271:10596), built with the page's shared
 * carousel behaviour (motion spec, "Carousel arrows + dots"):
 *   - 200px cards, 16px apart; the arrows move a card at a time and hide when there is nothing further
 *     that way; mouse drag and touch swipe follow the pointer and snap to the nearest card; with focus in
 *     the carousel the arrow keys move it. The ornamented rule under the row (ui/ProgressRule)
 *     fills to show the position.
 *   - The design's hover state, drawn on the first card, is the active look: the card turns maroon with a
 *     soft orange glow, its arch line and chip turn saffron, and the profile link appears. It rests on the
 *     first card on show and follows the pointer (and keyboard focus once the cards link to profiles).
 *   - Cards that link to a profile also lift on hover (lib/hover); until those pages exist they stay still.
 *   - With a fine pointer, every card tilts gently toward the pointer (up to 4°) and a soft saffron glow
 *     follows it over the card (ui/PointerGlow); a saffron cursor label (ui/CursorLabel) says "Drag" over
 *     the row once it can move and "View" over a card with a profile.
 */
export default function FacultyCarousel({ educators, heading, profileLabel }: FacultyCarouselProps) {
  const count = educators.length;
  const last = Math.max(0, count - VISIBLE);
  // The first card on show, and the card wearing the active look.
  const [index, setIndex] = useState(0);
  const [active, setActive] = useState(0);
  const [moved, setMoved] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const drag = useRef<Drag | null>(null);
  const swallowClick = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    const fill = fillRef.current;
    if (track && fill) place(track, fill, index * STEP, count, !prefersReducedMotion());
    setActive(index);
  }, [index, count]);

  const goTo = (target: number) => {
    const next = clamp(target, 0, last);
    if (next !== index) {
      setIndex(next);
      setMoved(true);
      return;
    }
    // Same card (a short drag): settle back.
    const track = trackRef.current;
    const fill = fillRef.current;
    if (track && fill) place(track, fill, index * STEP, count, !prefersReducedMotion());
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const at = cardRefs.current.findIndex((card) => card === document.activeElement);
    if (at < 0) return goTo(index + direction);
    cardRefs.current[at + direction]?.focus({ preventScroll: true });
  };

  // A card that takes focus off screen brings itself into view.
  const showCard = (i: number) => {
    setActive(i);
    if (i < index) goTo(i);
    else if (i >= index + VISIBLE) goTo(i - VISIBLE + 1);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swallowClick.current = false;
    drag.current = null;
    if (last === 0 || (event.pointerType === "mouse" && event.button !== 0)) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dragging: false };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!current || current.id !== event.pointerId || !track || !fill) return;
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
      current.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    current.dx = dx;
    const max = last * STEP;
    let offset = index * STEP - dx;
    if (offset < 0) offset *= EDGE_GIVE;
    else if (offset > max) offset = max + (offset - max) * EDGE_GIVE;
    place(track, fill, offset, count, false);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    if (!current.dragging) return;
    swallowClick.current = true;
    if (cancelled) return goTo(index);
    let target = Math.round(index - current.dx / STEP);
    if (target === index && Math.abs(current.dx) > FLICK) target += current.dx < 0 ? 1 : -1;
    goTo(target);
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    // After a drag, the click that ends it must not open a profile; keyboard "clicks" (detail 0) pass.
    if (!swallowClick.current || event.detail === 0) return;
    swallowClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Our faculty" onKeyDown={onKeyDown} className="flex w-full flex-col gap-8">
      <div className="flex w-full items-end justify-between">
        {heading}
        <div data-reveal="fade" className="flex items-center gap-2.5">
          <CarouselArrow direction="prev" label="Previous educators" size={48} hidden={index === 0} onClick={() => goTo(index - 1)} />
          <CarouselArrow direction="next" label="Next educators" tone="solid" size={48} hidden={index >= last} onClick={() => goTo(index + 1)} />
        </div>
      </div>

      {/*
        The cursor label says only what a press does: "Drag" once the row can move, "View" over a card that
        links to a profile. With six educators that all fit and no profile pages yet there is nothing to
        say, so there is no disc: the card's own chip already names the subject, and a disc repeating it
        would only crowd the pointer.
      */}
      {(last > 0 || educators.some((educator) => educator.profile !== null)) && (
        <CursorLabel regionRef={viewportRef} fallback={last > 0 ? "Drag" : null} />
      )}

      {/* Clipped sideways only, so the active card's glow shows below the row. */}
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => endDrag(event, false)}
        onPointerCancel={(event) => endDrag(event, true)}
        onPointerLeave={() => setActive(index)}
        onClickCapture={onClickCapture}
        onDragStart={(event) => event.preventDefault()}
        className={cx("touch-pan-y overflow-x-clip overflow-y-visible select-none [overflow-clip-margin:16px]", last > 0 && "cursor-grab active:cursor-grabbing")}
      >
        <div ref={trackRef} data-reveal-group className="flex w-max items-stretch gap-4">
          {educators.map((educator, i) => (
            // The slide's className stays static: ScrollReveal toggles classes on it.
            <div key={educator.name} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} className="flex w-50 shrink-0">
              <FacultyCard
                educator={educator}
                active={i === active}
                profileLabel={profileLabel}
                cardRef={(el) => {
                  cardRefs.current[i] = el;
                }}
                onActivate={() => setActive(i)}
                onFocus={() => showCard(i)}
              />
            </div>
          ))}
        </div>
      </div>

      {/*
        The progress line (ui/ProgressRule): the filled share is the part of the faculty seen so far. The
        negative margins keep the 3px of the row the plain line had, so nothing below moves.
      */}
      <ProgressRule data-reveal="fade" rootRef={fillRef} progress={count ? Math.min(1, VISIBLE / count) : 1} className="-my-[5.5px] w-full" />

      <p aria-live="polite" className="sr-only">
        {moved ? `Showing educators ${index + 1} to ${Math.min(index + VISIBLE, count)} of ${count}` : ""}
      </p>
    </div>
  );
}

type FacultyCardProps = {
  educator: Educator;
  active: boolean;
  profileLabel: string;
  cardRef: (el: HTMLElement | null) => void;
  onActivate: () => void;
  onFocus: () => void;
};

/** The colour changes of the active look, over --dur-fast. */
const SHIFT = "[transition:background-color_var(--dur-fast)_var(--ease-out),border-color_var(--dur-fast)_var(--ease-out),color_var(--dur-fast)_var(--ease-out)]";

/**
 * One educator (Figma "guru · …", 200 wide): the arch-cut portrait (176 × 220) under its arch line, the
 * subject chip with its butta, the name, what they teach, and the profile link at the foot. The active
 * look is the design's hover state. A card with a profile page is one link (the profile link inside is its
 * look, not a second link); without one it is a still article.
 */
function FacultyCard({ educator, active, profileLabel, cardRef, onActivate, onFocus }: FacultyCardProps) {
  const linked = educator.profile !== null;
  // The tilt is on the card itself: its slide's className has to stay static for the reveal.
  const tiltRef = useRef<HTMLElement | null>(null);
  useTilt(tiltRef);
  const setRef = (el: HTMLElement | null) => {
    tiltRef.current = el;
    cardRef(el);
  };
  const className = cx(
    "group/medal relative flex w-full flex-col items-start gap-3 rounded-[18px] border px-3 pt-3 pb-4",
    SHIFT,
    active ? "border-transparent bg-[#5a160f]" : "border-[#eadbc4] bg-white",
    linked &&
      "group/card [transition:background-color_var(--dur-fast)_var(--ease-out),border-color_var(--dur-fast)_var(--ease-out),translate_var(--dur-fast)_var(--ease-out),scale_80ms_var(--ease-out)] hover:-translate-y-1 pointer-coarse:active:scale-[.98]",
  );
  const content = (
    <>
      {/* The soft orange glow of the active card, faded in rather than animating the shadow itself. */}
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute inset-0 rounded-[18px] shadow-[0_24px_40px_rgba(229,115,18,0.3)] [transition:opacity_var(--dur-fast)_var(--ease-out)]",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      {/*
        A soft saffron glow under the pointer, behind the portrait and the text. The card under the pointer
        is always the active, maroon one, so the glow screens onto the maroon; kept low so the white and
        cream text stays as legible as at rest.
      */}
      <PointerGlow color="rgb(244 196 48 / 0.24)" size={240} blend="screen" />
      <span className="relative block h-[220px] w-44 shrink-0 overflow-clip">
        <Photo src={educator.photo} alt="" sizes="177px" className="absolute top-[-0.5px] left-[-0.5px] h-[221px] w-[177px]" />
        <img
          src="/images/faculty/arch-outline.svg"
          alt=""
          aria-hidden="true"
          width={178}
          height={221}
          className="pointer-events-none absolute top-[-1px] left-[-1px] h-[221px] w-[178px] max-w-none"
        />
        <img
          src="/images/faculty/arch-outline-active.svg"
          alt=""
          aria-hidden="true"
          width={178}
          height={221}
          className={cx(
            "pointer-events-none absolute top-[-1px] left-[-1px] h-[221px] w-[178px] max-w-none [transition:opacity_var(--dur-fast)_var(--ease-out)]",
            active ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
      <span className={cx("relative inline-flex items-center gap-1.5 rounded-full px-2 py-1", SHIFT, active ? "bg-white/14" : "bg-orange/10")}>
        <img
          src={active ? "/images/courses/chip-butta-saffron.svg" : "/images/courses/chip-butta-burnt.svg"}
          alt=""
          aria-hidden="true"
          width={10}
          height={10}
          className="size-2.5"
        />
        <span className={cx("text-[10.5px]/[normal] font-bold tracking-[0.84px] whitespace-nowrap uppercase", SHIFT, active ? "text-saffron" : "text-burnt")}>
          {educator.subject}
        </span>
      </span>
      <span className={cx("relative text-[17px]/[normal] font-bold tracking-[-0.102px] whitespace-nowrap", SHIFT, active ? "text-white" : "text-ink")}>
        {educator.name}
      </span>
      <span className={cx("relative w-44 text-[12.5px]/[1.4]", SHIFT, active ? "text-white/75" : "text-[#7a6a5c]")}>{educator.focus}</span>
      {/* Every card keeps the link's room, so the row never changes height as the active look moves. */}
      <span
        aria-hidden={!active || undefined}
        className={cx(
          "relative mt-auto [transition:opacity_var(--dur-fast)_var(--ease-out),translate_var(--dur-fast)_var(--ease-out)]",
          active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-(--rise-sm) opacity-0",
        )}
      >
        <IndianLink tone="dark" size="sm" href={null} className={linked ? "cursor-pointer" : undefined}>
          {profileLabel}
        </IndianLink>
      </span>
    </>
  );

  if (linked) {
    return (
      <a
        ref={setRef}
        href={educator.profile ?? undefined}
        draggable={false}
        data-cursor-label="View"
        aria-label={`${educator.name}, ${educator.focus}: ${profileLabel}`}
        onPointerEnter={onActivate}
        onFocus={onFocus}
        className={className}
      >
        {content}
      </a>
    );
  }
  return (
    <article ref={setRef} aria-label={`${educator.name}, ${educator.focus}`} onPointerEnter={onActivate} className={className}>
      {content}
    </article>
  );
}

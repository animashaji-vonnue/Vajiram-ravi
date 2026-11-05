"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { CarouselArrow } from "@/components/ui/CarouselControls";
import Cta from "@/components/ui/Cta";
import CursorLabel from "@/components/ui/CursorLabel";
import Photo from "@/components/ui/Photo";
import { links } from "@/data/links";
import type { Topper } from "@/data/toppers";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { CARD_IMAGE_ZOOM } from "@/lib/hover";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

// Each stamp opens the topper's story; until those pages exist it opens the selections page.
const STORY_HREF = links.topperStory ?? links.toppers;

/** Stamps on show at once; the arrows move by this many. */
const PAGE = 5;
/** One stamp (240) plus the gap (20): a card's step along the track. */
const STEP = 260;
/** Pointer travel, in canvas px, before a press becomes a drag. */
const DRAG_THRESHOLD = 6;
/** A drag this long moves at least one card, even when it ends nearer where it started. */
const FLICK = 48;
/** Past either end the track follows the pointer at this rate. */
const EDGE_GIVE = 0.35;
/** The drop-in's stagger, as the motion spec names it for the stamps. */
const DROP_STAGGER = 80;

type Drag = { id: number; x: number; y: number; dx: number; dragging: boolean };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** A motion token's value, for the Web Animations API (which cannot read var()). */
function token(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

/**
 * Moves the track to `offset` px and fills the progress line to the share of the stamps seen so far. Both
 * move as transforms (translate and scaleX) with the same --dur-base / --ease-in-out transition, or none
 * while a drag follows the pointer.
 */
function place(track: HTMLElement, fill: HTMLElement, offset: number, count: number, animate: boolean) {
  const transition = animate ? "transform var(--dur-base) var(--ease-in-out)" : "none";
  track.style.transition = transition;
  fill.style.transition = transition;
  track.style.transform = `translate3d(${-offset}px, 0, 0)`;
  fill.style.transform = `scaleX(${clamp((offset / STEP + PAGE) / count, 0, 1)})`;
}

type ToppersCarouselProps = {
  toppers: Topper[];
  /** The carousel's accessible name. */
  label: string;
  /** The two lines printed on each stamp. */
  stamp: { exam: string; institute: string };
  /** The "see all" button's label. */
  cta: string;
};

/**
 * The stamp carousel (Figma "film strip" and its controls, motion spec "03 Toppers stamp carousel").
 *   - Five 240 × 300 stamps show at once; the arrows move a page of five, hiding at the ends. The track
 *     slides over --dur-base with --ease-in-out, and the orange line under it fills with the slide.
 *   - Mouse drag and touch swipe move the track with the pointer and snap to the nearest card.
 *   - Arrow keys move: from a stamp to the next or previous stamp (the track follows focus), elsewhere in
 *     the carousel a page at a time. Each stamp is a slide announced as "3 of 10".
 *   - On first view the first five stamps drop in one by one, like stamps placed in an album.
 *   - Hover: the stamp lifts with a deeper shadow, the photo zooms 1.04 inside its frame and the AIR tag
 *     slides 4px right.
 *   - With a fine pointer, a saffron cursor label (ui/CursorLabel) follows the pointer over the strip:
 *     "View" over a stamp (each opens the selections page), "Drag" between them. None over the controls.
 */
export default function ToppersCarousel({ toppers, label, stamp, cta }: ToppersCarouselProps) {
  const count = toppers.length;
  const last = Math.max(0, count - PAGE);
  // The first stamp on show.
  const [index, setIndex] = useState(0);
  // The live region speaks only once the visitor has moved the carousel.
  const [moved, setMoved] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const drag = useRef<Drag | null>(null);
  // After a drag, the click that ends it must not open the stamp's link.
  const swallowClick = useRef(false);
  // An arrow that hides while focused hands focus to the other one once the slide has rendered.
  const handOff = useRef<"prev" | "next" | null>(null);

  // Slide to the current stamp.
  useEffect(() => {
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!track || !fill) return;
    place(track, fill, index * STEP, count, !prefersReducedMotion());
    if (handOff.current) {
      const arrows = controlsRef.current?.querySelectorAll("button");
      arrows?.item(handOff.current === "prev" ? 0 : 1)?.focus();
      handOff.current = null;
    }
  }, [index, count]);

  // The drop-in (motion spec "Reveal"): each stamp fades in from 12px higher and 2° turned, 80ms apart,
  // once the strip is in view. Paused at its first frame until then. A strip already on screen at load, and
  // reduced motion, show the stamps as they are.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || prefersReducedMotion()) return;
    if (canvasTop(viewport) < (window.innerHeight / getCanvasZoom()) * 0.85) return;
    const duration = parseFloat(token("--dur-slow", "600ms")) || 600;
    const easing = token("--ease-out", "cubic-bezier(0.22, 1, 0.36, 1)");
    const drops = slideRefs.current.slice(0, PAGE).flatMap((slide, i) => {
      if (!slide) return [];
      const drop = slide.animate(
        [
          { opacity: 0, transform: "translateY(-12px) rotate(2deg)" },
          { opacity: 1, transform: "none" },
        ],
        { duration, easing, delay: i * DROP_STAGGER, fill: "backwards" },
      );
      drop.pause();
      return [drop];
    });
    const cancel = whenVisible(viewport, 0.35, () => drops.forEach((drop) => drop.play()));
    return () => {
      cancel();
      drops.forEach((drop) => drop.cancel());
    };
  }, []);

  const goTo = (target: number) => {
    const next = clamp(target, 0, last);
    if (next !== index) {
      setIndex(next);
      setMoved(true);
      return;
    }
    // Same stamp (a short drag): settle back into place.
    const track = trackRef.current;
    const fill = fillRef.current;
    if (track && fill) place(track, fill, index * STEP, count, !prefersReducedMotion());
  };

  const page = (direction: 1 | -1) => {
    const next = clamp(index + direction * PAGE, 0, last);
    const arrows = controlsRef.current?.querySelectorAll("button");
    const pressed = arrows?.item(direction === 1 ? 1 : 0);
    if (pressed && document.activeElement === pressed && (next === 0 || next === last)) {
      handOff.current = direction === 1 ? "prev" : "next";
    }
    goTo(next);
  };

  // A stamp that takes focus off screen brings its page into view.
  const showStamp = (i: number) => {
    if (i < index) goTo(i - PAGE + 1);
    else if (i >= index + PAGE) goTo(i);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const at = linkRefs.current.findIndex((link) => link === document.activeElement);
    if (at < 0) return page(direction);
    linkRefs.current[at + direction]?.focus({ preventScroll: true });
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
    // Snap to the nearest stamp; a flick moves at least one.
    let target = Math.round(index - current.dx / STEP);
    if (target === index && Math.abs(current.dx) > FLICK) target += current.dx < 0 ? 1 : -1;
    goTo(target);
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    // detail 0 is a keyboard "click", which a drag never produces.
    if (!swallowClick.current || event.detail === 0) return;
    swallowClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} onKeyDown={onKeyDown} className="flex flex-col gap-[52px]">
      {/* The strip only: the controls row below gets no disc. Renders nothing here (it portals to <body>). */}
      <CursorLabel regionRef={viewportRef} fallback={last > 0 ? "Drag" : null} />
      {/*
        Clipped sideways only, so the stamps' shadows and hover lift show above and below. The 8px clip
        margin keeps the focus ring of the stamps at the edges; the next stamp starts 20px out, unseen.
      */}
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => endDrag(event, false)}
        onPointerCancel={(event) => endDrag(event, true)}
        onClickCapture={onClickCapture}
        onDragStart={(event) => event.preventDefault()}
        className="touch-pan-y overflow-x-clip overflow-y-visible select-none [overflow-clip-margin:8px]"
      >
        <div ref={trackRef} className="flex w-max items-start gap-5">
          {toppers.map((topper, i) => (
            <div
              key={topper.rank}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              className="w-60 shrink-0"
            >
              <a
                ref={(el) => {
                  linkRefs.current[i] = el;
                }}
                href={STORY_HREF}
                draggable={false}
                data-cursor-label="View"
                onFocus={() => showStamp(i)}
                className="group/card block"
              >
                <Stamp topper={topper} stamp={stamp} />
                <div className="mt-3 flex flex-col gap-[3px]">
                  <p className="text-[16px]/[normal] font-bold tracking-[-0.128px] whitespace-nowrap text-ink">{topper.name}</p>
                  {topper.programme && <p className="w-[236px] text-[12.5px]/[1.4] text-[#7a6a5c]">{topper.programme}</p>}
                </div>
                <span className="sr-only">{links.topperStory ? ", read the story" : ", see all selections"}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div ref={controlsRef} data-reveal className="flex items-center justify-between">
        {/* The progress line: 900 wide; the orange fill is the share of the stamps seen so far. */}
        <div aria-hidden="true" className="relative h-0.5 w-[900px] overflow-clip bg-[#1a1714]/10">
          <span
            ref={fillRef}
            className="absolute inset-0 origin-left bg-orange"
            style={{ transform: `scaleX(${count ? Math.min(1, PAGE / count) : 1})` }}
          />
        </div>
        <div className="flex items-center gap-2.5">
          <CarouselArrow direction="prev" label="Previous toppers" shape="square" size={48} hidden={index === 0} onClick={() => page(-1)} />
          <CarouselArrow direction="next" label="Next toppers" tone="solid" shape="square" size={48} hidden={index >= last} onClick={() => page(1)} />
          <Cta variant="secondary" size="md" href={links.toppers}>
            {cta}
          </Cta>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {moved ? `Showing toppers ${index + 1} to ${Math.min(index + PAGE, count)} of ${count}` : ""}
      </p>
    </div>
  );
}

/**
 * One stamp (Figma "stamp"): white paper with the perforated edge (the design's cream holes, half cut off
 * by the paper's edge), the portrait in a 2px frame, the AIR tag, two printed lines and the butta. AIR 1
 * is framed and tagged in burnt orange; the rest in ochre with a maroon tag, as drawn.
 */
function Stamp({ topper, stamp }: { topper: Topper; stamp: ToppersCarouselProps["stamp"] }) {
  const first = topper.rank === 1;
  return (
    <div className="relative h-[300px] w-60 overflow-clip bg-white shadow-[0_8px_18px_rgba(89,46,13,0.18)] [transition:translate_var(--dur-fast)_var(--ease-out),box-shadow_var(--dur-fast)_var(--ease-out),scale_80ms_var(--ease-out)] group-hover/card:translate-y-(--lift) group-hover/card:shadow-hover pointer-coarse:group-active/card:scale-[.98]">
      <img
        src="/images/toppers/stamp-perforation.svg"
        alt=""
        aria-hidden="true"
        width={250}
        height={310}
        className="pointer-events-none absolute top-[-5px] left-[-5px] h-[310px] w-[250px] max-w-none"
      />
      <Photo
        src={topper.image}
        alt=""
        sizes="222px"
        className={cx("absolute top-4 left-4 h-[226px] w-[208px] overflow-clip border-2 bg-[#f3e4cc]", first ? "border-burnt" : "border-[#c72]")}
        imageClassName={CARD_IMAGE_ZOOM}
      />
      <span
        className={cx(
          "absolute top-6 left-6 rounded-[4px] px-2 py-[3px] text-[12px]/[normal] font-bold whitespace-nowrap text-white [transition:translate_var(--dur-fast)_var(--ease-out)] group-hover/card:translate-x-1",
          first ? "bg-burnt" : "bg-[#6e1e14]",
        )}
      >
        AIR {topper.rank}
      </span>
      <span aria-hidden="true" className="absolute top-[252px] left-4 text-[10.5px]/[normal] font-semibold tracking-[1.26px] whitespace-nowrap text-burnt">
        {stamp.exam}
      </span>
      <span aria-hidden="true" className="absolute top-[268px] left-4 text-[10.5px]/[normal] font-semibold tracking-[1.26px] whitespace-nowrap text-[#7a6a5c]">
        {stamp.institute}
      </span>
      <img src="/images/toppers/stamp-butta.svg" alt="" aria-hidden="true" width={16} height={16} className="absolute top-[256px] left-[208px] size-4" />
    </div>
  );
}

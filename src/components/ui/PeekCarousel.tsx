"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { CarouselArrow, CarouselDot, DOTS } from "@/components/ui/CarouselControls";
import Photo from "@/components/ui/Photo";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";

export type PeekSlide = {
  src: string;
  alt: string;
  /** CSS object-position for the crop, e.g. "50% 40%". Centred when left out. */
  position?: string;
};

type PeekCarouselProps = {
  /** Accessible name of the carousel, e.g. "Featured banners". */
  label: string;
  /** Prefix for each dot's label, e.g. "Banner" gives "Banner 1". */
  slideLabel: string;
  dotsLabel: string;
  prevLabel: string;
  nextLabel: string;
  count: number;
  /** Photos for each slide. Leave out to render the plain media placeholders from the design. */
  slides?: PeekSlide[];
  slidesSizes?: string;
  /** Width of the side slides and of the centred, active slide, in canvas pixels. */
  slideWidth: number;
  activeWidth: number;
  gap: number;
  /** Virtual index shown first. */
  start: number;
  /** Shifts which dot is lit for a given slide. */
  dotOffset: number;
  /** Autoplay interval in milliseconds. */
  interval: number;
  /** Sets the active slide in the hero's glass frame and hides the peeking slides, as in the hero design. */
  framed?: boolean;
};

/** Slides rendered on each side of the active one; the rest sit off-canvas and are not rendered. */
const RANGE = 3;
const DRAG_START_PX = 6;
const SWIPE_PX = 60;

const SLIDE =
  "absolute top-0 h-[392px] overflow-hidden rounded-[20px] bg-media [transition:left_.7s_var(--ease-smooth),width_.7s_var(--ease-smooth),box-shadow_.7s,opacity_.7s_var(--ease-smooth)] group-[.dragging]/car:transition-none";

/** Width of the glass frame's ring around the active slide. */
const FRAME_PX = 12;

/**
 * Frosted-glass frame behind the active slide: a 12px translucent ring, tinted by a blurred copy
 * of the slide it holds.
 */
function GlassFrame({ slide, width }: { slide?: PeekSlide; width: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-3 -bottom-3 overflow-clip rounded-[32px] border border-white/80 bg-white/35 shadow-[0_12px_32px_-8px_rgba(28,26,23,.1)] backdrop-blur-[12px]"
      style={{ left: `calc(50% - ${width / 2 + FRAME_PX}px)`, width: `${width + FRAME_PX * 2}px` }}
    >
      {slide && (
        <Photo
          className="absolute inset-[calc(-9.59%-1.19px)_calc(-2.96%-1.06px)_calc(-9.11%-1.18px)_calc(-3.12%-1.06px)] opacity-55 blur-[20px]"
          src={slide.src}
          alt=""
          sizes={`${width + FRAME_PX * 2}px`}
          position={slide.position}
        />
      )}
      <div className="absolute inset-[-1px_1px_1px_-1px] bg-white/35" />
    </div>
  );
}

/**
 * Endless "peek" carousel: the active slide is centred and its neighbours peek in from the sides.
 * Slides are keyed by a virtual index that grows without bound, so moving in either direction
 * never jumps. Positions use `calc(50% + offset)` and therefore need no measuring.
 */
export default function PeekCarousel(props: PeekCarouselProps) {
  const { count, slides, slideWidth, activeWidth, gap, dotOffset, interval, framed = false } = props;
  const [index, setIndex] = useState(props.start);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const hovering = useRef(false);
  const drag = useRef({ down: false, moved: false, startX: 0, dx: 0 });

  const go = useCallback((delta: number) => {
    if (delta) setIndex((current) => current + delta);
  }, []);

  const stop = useCallback(() => {
    clearInterval(timer.current);
    timer.current = undefined;
  }, []);

  const restart = useCallback(() => {
    stop();
    if (prefersReducedMotion() || hovering.current || document.hidden) return;
    timer.current = setInterval(() => go(1), interval);
  }, [go, stop, interval]);

  // Autoplay, paused while the tab is hidden.
  useEffect(() => {
    restart();
    const onVisibility = () => (document.hidden ? stop() : restart());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [restart, stop]);

  // Drag / swipe. Move and release are tracked on the window so a drag can leave the carousel.
  // The `dragging` class is toggled directly so slides follow the pointer without transitions.
  useEffect(() => {
    const onMove = (event: globalThis.PointerEvent) => {
      const d = drag.current;
      if (!d.down) return;
      d.dx = (event.clientX - d.startX) / getCanvasZoom();
      if (Math.abs(d.dx) > DRAG_START_PX) {
        d.moved = true;
        rootRef.current?.classList.add("dragging");
        if (stageRef.current) stageRef.current.style.transform = `translateX(${d.dx}px)`;
      }
    };
    const onUp = () => {
      const d = drag.current;
      if (!d.down) return;
      d.down = false;
      rootRef.current?.classList.remove("dragging");
      if (stageRef.current) stageRef.current.style.transform = "";
      if (d.moved && Math.abs(d.dx) > SWIPE_PX) go(d.dx < 0 ? 1 : -1);
      restart();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [go, restart]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    drag.current = { down: true, moved: false, startX: event.clientX, dx: 0 };
    stop();
  };

  // Clicking a peeking slide brings it to the centre.
  const onViewClick = (event: MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      event.preventDefault();
      return;
    }
    const slide = (event.target as Element).closest<HTMLElement>("[data-k]");
    if (slide && slide.dataset.active !== "true") go(Number(slide.dataset.k) - index);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  const toDot = (dot: number) => {
    const current = mod(index - dotOffset, count);
    let delta = dot - current;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    go(delta);
  };

  const offset = (s: number) => {
    if (s === 0) return -activeWidth / 2;
    if (s > 0) return activeWidth / 2 + gap + (s - 1) * (slideWidth + gap);
    return -activeWidth / 2 - gap - slideWidth - (-s - 1) * (slideWidth + gap);
  };

  const activeDot = mod(index - dotOffset, count);

  return (
    <div
      ref={rootRef}
      className={cx("group/car relative flex flex-col items-center py-3", framed ? "gap-7" : "gap-4")}
      aria-roledescription="carousel"
      aria-label={props.label}
      onKeyDown={onKeyDown}
      onMouseEnter={() => {
        hovering.current = true;
        stop();
      }}
      onMouseLeave={() => {
        hovering.current = false;
        restart();
      }}
      onFocus={stop}
    >
      <div className="relative h-[392px] w-full touch-pan-y select-none" onPointerDown={onPointerDown} onClick={onViewClick}>
        {framed && <GlassFrame slide={slides?.[mod(index, count)]} width={activeWidth} />}
        <div className="absolute inset-0" ref={stageRef}>
          {Array.from({ length: RANGE * 2 + 1 }, (_, i) => {
            const s = i - RANGE;
            const k = index + s;
            const active = s === 0;
            const slide = slides?.[mod(k, count)];
            return (
              <div
                key={k}
                data-k={k}
                data-active={active}
                aria-hidden={active ? "false" : "true"}
                className={cx(
                  SLIDE,
                  active
                    ? "shadow-[0_8px_24px_0_rgba(28,25,23,.06),0_1px_2px_rgba(28,25,23,.04)]"
                    : "cursor-pointer shadow-[0_8px_24px_-4px_rgba(28,25,23,.06),0_1px_2px_rgba(28,25,23,.04)]",
                  // The framed design hides the neighbours; they show only while the slides are dragged.
                  framed && !active && "pointer-events-none opacity-0 group-[.dragging]/car:opacity-100",
                )}
                style={{ left: `calc(50% + ${offset(s)}px)`, width: `${active ? activeWidth : slideWidth}px` }}
              >
                {slide && (
                  <Photo
                    className="absolute inset-0"
                    src={slide.src}
                    alt={slide.alt}
                    sizes={props.slidesSizes ?? `${activeWidth}px`}
                    position={slide.position}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={DOTS} role="tablist" aria-label={props.dotsLabel}>
        {Array.from({ length: count }, (_, i) => (
          <CarouselDot
            key={i}
            label={`${props.slideLabel} ${i + 1}`}
            active={i === activeDot}
            onClick={() => {
              toDot(i);
              restart();
            }}
          />
        ))}
      </div>
      <CarouselArrow
        direction="prev"
        label={props.prevLabel}
        className="top-[208px] left-[calc(50%-640px)]"
        onClick={() => {
          go(-1);
          restart();
        }}
      />
      <CarouselArrow
        direction="next"
        label={props.nextLabel}
        className="top-[208px] right-[calc(50%-640px)]"
        onClick={() => {
          go(1);
          restart();
        }}
      />
    </div>
  );
}

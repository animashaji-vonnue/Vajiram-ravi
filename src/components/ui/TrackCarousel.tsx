"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { CarouselArrow, CarouselDot, DOTS } from "@/components/ui/CarouselControls";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";

type TrackCarouselProps = {
  /** Layout classes for the root. Keep them static: ScrollReveal adds its own classes to this element. */
  className: string;
  viewClassName: string;
  /** Layout classes for the moving row; include its transform transition. */
  trackClassName: string;
  /** Positioning classes (top and left/right) for the two arrows. */
  arrows: { prev: string; next: string };
  /** Distance the track moves per page, in canvas pixels. */
  step: number;
  pages: number;
  dotsLabel: string;
  prevLabel: string;
  nextLabel: string;
  /** Fade the carousel in when it scrolls into view. */
  reveal?: boolean;
  children: ReactNode;
};

const DRAG_START_PX = 6;
const SWIPE_PX = 60;
const DRAG_FOLLOW = 0.9;

/** A row of cards that pages left and right, with arrows, dots, keyboard and swipe. */
export default function TrackCarousel(props: TrackCarouselProps) {
  const { step, pages } = props;
  const [page, setPage] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(0);
  const drag = useRef({ down: false, moved: false, startX: 0, dx: 0 });

  // The track transform is written directly so a drag can move it without re-rendering.
  const go = useCallback(
    (target: number) => {
      const next = Math.max(0, Math.min(pages - 1, target));
      pageRef.current = next;
      setPage(next);
      if (trackRef.current) trackRef.current.style.transform = `translateX(${-next * step}px)`;
    },
    [pages, step],
  );

  useEffect(() => {
    const view = viewRef.current;
    const onMove = (event: globalThis.PointerEvent) => {
      const d = drag.current;
      if (!d.down) return;
      d.dx = (event.clientX - d.startX) / getCanvasZoom();
      if (Math.abs(d.dx) > DRAG_START_PX) {
        d.moved = true;
        rootRef.current?.classList.add("dragging");
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${-pageRef.current * step + d.dx * DRAG_FOLLOW}px)`;
        }
      }
    };
    const onUp = () => {
      const d = drag.current;
      if (!d.down) return;
      d.down = false;
      rootRef.current?.classList.remove("dragging");
      go(d.moved && Math.abs(d.dx) > SWIPE_PX ? pageRef.current + (d.dx < 0 ? 1 : -1) : pageRef.current);
    };
    // A drag that ends over a card link must not also follow the link.
    const onClickCapture = (event: MouseEvent) => {
      if (drag.current.moved) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    view?.addEventListener("click", onClickCapture, true);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      view?.removeEventListener("click", onClickCapture, true);
    };
  }, [go, step]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    drag.current = { down: true, moved: false, startX: event.clientX, dx: 0 };
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(page - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(page + 1);
    }
  };

  return (
    <div ref={rootRef} className={cx("group/car", props.className)} data-reveal={props.reveal || undefined} onKeyDown={onKeyDown}>
      <div
        ref={viewRef}
        className={props.viewClassName}
        onPointerDown={onPointerDown}
        onDragStart={(event) => event.preventDefault()}
      >
        <div ref={trackRef} className={cx(props.trackClassName, "group-[.dragging]/car:transition-none")}>
          {props.children}
        </div>
      </div>
      <div className={DOTS} role="tablist" aria-label={props.dotsLabel}>
        {Array.from({ length: pages }, (_, i) => (
          <CarouselDot key={i} label={`Page ${i + 1}`} active={i === page} onClick={() => go(i)} />
        ))}
      </div>
      <CarouselArrow
        direction="prev"
        label={props.prevLabel}
        className={props.arrows.prev}
        hidden={page === 0}
        onClick={() => go(page - 1)}
      />
      <CarouselArrow
        direction="next"
        label={props.nextLabel}
        className={props.arrows.next}
        hidden={page === pages - 1}
        onClick={() => go(page + 1)}
      />
    </div>
  );
}

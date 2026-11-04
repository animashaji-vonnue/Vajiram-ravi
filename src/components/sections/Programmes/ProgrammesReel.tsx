"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { clamp01, followScroll } from "@/lib/scroll";
import { PROGRAMME_CARD } from "./ProgrammeCard";

/**
 * The band is a card inset 40px from each side of the canvas: 1360 wide, so its tile border (drawn 1440 × 900
 * in the design) is shrunk to 1360 × 850 to keep its tiles square.
 */
const FRAME = { width: 1360, height: 850 };
/** How far the heading and the row sit in from the card's sides: inside the border, as in the design. */
const INSET = 90;
/** The gap between cards, and the width they're shown in. */
const GAP = 16;
const VIEW = FRAME.width - 2 * INSET;
const STEP = PROGRAMME_CARD.width + GAP;
/** The site header's height: the card pins centred in the window below it, or at the top if it can't fit. */
const HEADER = 80;
const PIN_TOP = `max(0px, (var(--vh, 900px) + ${HEADER - FRAME.height}px) / 2)`;
const SMOOTHING_MS = 140;

type ProgrammesReelProps = {
  /** The cards, in order. */
  cards: { key: string; card: ReactNode }[];
  /** The heading row, above the cards. */
  children: ReactNode;
};

/**
 * The featured programmes card. The programme cards run off its right side; the card stays pinned while
 * scrolling down slides them left, one pixel for each pixel scrolled, until the last one reaches the right
 * margin. Cards slide under the tile border and are cut off at the card's edge. Tabbing to a card scrolls
 * the page to bring it into view. With reduced motion the row follows the scroll without easing.
 */
export default function ProgrammesReel({ cards, children }: ProgrammesReelProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const width = cards.length * STEP - GAP;
  const travel = Math.max(0, width - VIEW);

  useEffect(() => {
    const wrap = wrapRef.current;
    const frame = frameRef.current;
    const list = listRef.current;
    if (!wrap || !frame || !list || !travel) return;
    // Canvas pixels per screen pixel: the page is zoomed down on narrow windows.
    const scale = () => wrap.getBoundingClientRect().height / wrap.offsetHeight || 1;

    // Progress is how far the pinned card has been carried down its track.
    const stop = followScroll(
      () => clamp01((frame.getBoundingClientRect().top - wrap.getBoundingClientRect().top) / scale() / travel),
      (progress) => {
        list.style.transform = `translateX(${-progress * travel}px)`;
      },
      SMOOTHING_MS,
    );

    // Scrolls to the point where the focused card is centred in the row (or as near as the row goes).
    const onFocus = (event: FocusEvent) => {
      const card = (event.target as HTMLElement).closest<HTMLElement>("[data-card]");
      if (!card) return;
      const index = Number(card.dataset.card);
      const shift = Math.min(Math.max(index * STEP - (VIEW - PROGRAMME_CARD.width) / 2, 0), travel);
      const pinTop = parseFloat(getComputedStyle(frame).top) || 0;
      const top = window.scrollY + wrap.getBoundingClientRect().top + (shift - pinTop) * scale();
      window.scrollTo({ top, behavior: "instant" });
    };
    list.addEventListener("focusin", onFocus);

    return () => {
      stop();
      list.removeEventListener("focusin", onFocus);
    };
  }, [travel]);

  return (
    <div ref={wrapRef} className="relative" style={{ height: FRAME.height + travel }}>
      {/* Clipped, not hidden, so the browser can't scroll the row itself when a card takes focus. */}
      <div
        ref={frameRef}
        className="sticky flex flex-col gap-12 overflow-clip bg-marigold pt-24"
        style={{ top: PIN_TOP, height: FRAME.height, paddingInline: INSET }}
      >
        {children}
        <ul ref={listRef} className="flex gap-4 will-change-transform" aria-label="Featured programmes">
          {cards.map((item, i) => (
            <li key={item.key} data-card={i} className="shrink-0">
              {item.card}
            </li>
          ))}
        </ul>
        {/* On top, so the cards slide under the border's bands. */}
        <Image
          src="/images/programmes/border.svg"
          alt=""
          width={1440}
          height={900}
          className="pointer-events-none absolute inset-0 size-full max-w-none"
        />
      </div>
    </div>
  );
}

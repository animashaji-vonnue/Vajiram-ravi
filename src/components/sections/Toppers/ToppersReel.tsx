"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { clamp01, followScroll } from "@/lib/scroll";
import { createSparkles } from "@/lib/sparkles";
import { TOPPER_CARD } from "./TopperCard";

/** Distance between the centres of neighbouring cards: the card plus a 24px gap. */
const STEP = TOPPER_CARD.width + 24;
/** Page scroll, in canvas pixels, that moves the reel on by one card. */
const SCROLL_PER_CARD = 150;
/** How long each card lingers in the centre: 0 moves at an even pace, 1 stops briefly on every card. */
const DWELL = 0.7;
const SMOOTHING_MS = 140;
/** Height of the stage before the browser measures it: the heading, the reel and the space round them. */
const DEFAULT_STAGE = 717;
/**
 * Where the header's bar ends. While the stage is pinned the heading sits 40px under it, and the cards are
 * centred in the window below it, but never closer than REEL_GAP to the heading.
 */
const NAV_BOTTOM = 88;
const REEL_GAP = 68;
/** The ring of sparkles round a topper as it reaches the centre: how many, just outside the card's edges. */
const CARD_SPARKLES = 16;

/** Slows the reel near whole numbers, so each card settles in the centre for a moment. */
function dwell(position: number): number {
  return position - (DWELL * Math.sin(2 * Math.PI * position)) / (2 * Math.PI);
}

type ToppersReelProps = {
  /** The cards, in order. Placeholders are hidden from screen readers. */
  cards: { key: string; placeholder: boolean; card: ReactNode }[];
  /** The heading block, shown above the cards while they move. */
  children: ReactNode;
};

/**
 * A reel of cards that moves sideways as the page scrolls, after exp.fiddle.digital.
 * - The section stays pinned for the length of the reel while each card in turn slides into the centre.
 * - The centre card is the largest; cards shrink a little with distance, and those near the edges
 *   turn in towards the viewer, as if set around the inside of a curved wall.
 * - The movement is eased, and it lingers briefly on each card.
 * - It glitters, after teak.io: small diamond sparkles twinkle all over the panel, and a cluster of them
 *   gathers round each topper as it reaches the centre. With reduced motion there are no sparkles.
 */
export default function ToppersReel({ cards: items, children }: ToppersReelProps) {
  const count = items.length;
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const travel = (count - 1) * SCROLL_PER_CARD;

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const head = headRef.current;
    const reel = reelRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !stage || !head || !reel || !canvas) return;
    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));
    const sparkles = prefersReducedMotion() ? null : createSparkles(canvas);
    let centred = -1;
    // Where the centre card sits on the canvas, in the canvas's own pixels.
    const cardCentre = (card: HTMLElement) => {
      const box = canvas.getBoundingClientRect();
      const rect = card.getBoundingClientRect();
      const scale = box.width / (canvas.offsetWidth || 1);
      return {
        x: (rect.left + rect.width / 2 - box.left) / scale,
        y: (rect.top + rect.height / 2 - box.top) / scale,
      };
    };

    // Drops the cards to the middle of the window below the header (their centre, as they hang from their
    // tops). The stage is as tall as its content; the wrapper adds the scroll distance the reel moves over.
    const size = () => {
      const height = window.innerHeight / getCanvasZoom();
      const headBottom = head.offsetTop + head.offsetHeight;
      const top = Math.max(headBottom + REEL_GAP, (height + NAV_BOTTOM - TOPPER_CARD.height) / 2);
      reel.style.marginTop = `${Math.round(top - headBottom)}px`;
      wrap.style.height = `${stage.offsetHeight + travel}px`;
    };
    size();
    const observer = new ResizeObserver(size);
    observer.observe(stage);
    window.addEventListener("resize", size);

    const stop = followScroll(
      // Progress is how far the pinned stage has been carried down its track.
      () => {
        const box = wrap.getBoundingClientRect();
        const scale = box.height / wrap.offsetHeight || 1;
        return clamp01((stage.getBoundingClientRect().top - box.top) / scale / travel);
      },
      (progress) => {
        const position = dwell(progress * (count - 1));
        cards.forEach((card, i) => {
          const distance = i - position;
          const away = Math.abs(distance);
          const turn = -Math.sign(distance) * Math.min(Math.max(0, away - 1.2) * 30, 62);
          const scale = 1 - 0.07 * Math.min(away, 2.5);
          card.style.transform = `translateX(${distance * STEP}px) rotateY(${turn}deg) scale(${scale})`;
          card.style.opacity = String(clamp01(3.6 - away));
          card.dataset.current = String(away < 0.5);
        });

        // A new topper in the centre gets a cluster of sparkles round it.
        const current = Math.round(position);
        if (current !== centred && sparkles) {
          const { x, y } = cardCentre(cards[current]);
          sparkles.burst(x, y, CARD_SPARKLES, TOPPER_CARD.width / 2 + 24, TOPPER_CARD.height / 2 + 24);
        }
        centred = current;
      },
      SMOOTHING_MS,
    );

    return () => {
      stop();
      sparkles?.destroy();
      observer.disconnect();
      window.removeEventListener("resize", size);
    };
  }, [count, travel]);

  return (
    <div ref={wrapRef} className="relative" style={{ height: DEFAULT_STAGE + travel }}>
      <div ref={stageRef} className="sticky top-0 flex flex-col bg-white">
        {/* Clips the reel's far cards at the window's edges. */}
        {/* The bottom padding leaves room for the sparkles that burst under the centre card. */}
        <div className="relative flex flex-col overflow-hidden pb-18">
          {/* The sparkles, behind the heading and the cards (both are positioned after it). */}
          <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
          {/* While the stage is pinned, the heading sits 40px under the header's bar. */}
          <div ref={headRef} className="relative px-10 pt-32">
            {children}
          </div>
          {/* Its top margin is set to centre the cards in the window (see size()); 68px until then. */}
          <div ref={reelRef} className="relative mt-17" style={{ height: TOPPER_CARD.height + 30 }}>
            <ol className="absolute top-0 left-1/2 [perspective:1600px]">
              {items.map((item) => (
                <li
                  key={item.key}
                  data-card
                  aria-hidden={item.placeholder || undefined}
                  className="absolute top-0 will-change-transform [transform-origin:50%_0]"
                  style={{ width: TOPPER_CARD.width, left: -TOPPER_CARD.width / 2 }}
                >
                  {item.card}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

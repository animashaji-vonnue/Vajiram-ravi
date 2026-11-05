"use client";

import { useEffect, useRef } from "react";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { clamp01, followScroll } from "@/lib/scroll";

const SMOOTHING_MS = 90;

const cardClip = (inset: number, radius: number) => `inset(0 ${inset}px round ${radius}px)`;

/**
 * Turns its parent section into a card on the page that widens as it comes up the screen, after the
 * "Solutions designed for your organization" section on concurrence.com: away from the top of the window it
 * is held `inset` canvas pixels in from each side with rounded corners; as its top rises to the top of the
 * window it opens out to the full width, and as it scrolls on past it draws back in. It clips the section
 * rather than scaling it, so the content inside never moves. Renders nothing of its own; the section should
 * carry the resting clip itself for its first paint.
 */
export default function CardOnScroll({ inset = 32, radius = 24 }: { inset?: number; radius?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    return followScroll(
      () => {
        const top = canvasTop(el);
        // How far the section is from opening fully: over most of a screen as it comes up, and over most of
        // its own height as it leaves.
        const viewportHeight = window.innerHeight / getCanvasZoom();
        return top > 0 ? clamp01(top / (viewportHeight * 0.8)) : clamp01(-top / (el.offsetHeight * 0.7));
      },
      (distance) => {
        const eased = distance * distance * (3 - 2 * distance);
        el.style.clipPath = cardClip(inset * eased, radius);
      },
      SMOOTHING_MS,
    );
  }, [inset, radius]);

  return <span ref={ref} hidden />;
}

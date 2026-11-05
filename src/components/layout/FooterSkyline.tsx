"use client";

import { useEffect, useRef } from "react";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";
import { skylineStrokes } from "./skylineStrokes";

/** The spec's --ease-out, for strokes being drawn (things entering or growing). */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * The footer's line-art skyline of Raisina Hill (the design's "Raisina skyline", 1306 × 195), built on first
 * sight like a construction: the ground line is laid first, then the colonnades rise column by column from
 * their bases, the walls and arches go up, and the domes, spires and flagpoles are drawn last, sweeping left
 * to right over about two seconds (see skylineStrokes). Each stroke draws itself in by its dash offset, once,
 * when a third of the skyline is in view.
 *
 * Decoration: hidden from assistive technology. It renders fully drawn without JavaScript, and with reduced
 * motion it is simply there.
 */
export default function FooterSkyline({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion() || typeof root.animate !== "function") return;
    // Already on screen at load (a very short page or a jump to the foot): leave it built.
    if (canvasTop(root) < (window.innerHeight / getCanvasZoom()) * 0.85) return;
    const paths = Array.from(root.querySelectorAll<SVGPathElement>("path"));
    const draws = paths.map((path, i) => {
      const [, delay, duration] = skylineStrokes[i];
      const draw = path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration, delay, easing: EASE_OUT, fill: "backwards" });
      draw.pause();
      return draw;
    });
    const cancel = whenVisible(root, 0.3, () => draws.forEach((draw) => draw.play()));
    return () => {
      cancel();
      draws.forEach((draw) => draw.cancel());
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <svg width={1306.65} height={195.3} viewBox="0 0 1306.65 195.3" fill="none" overflow="visible" className="block">
        <g stroke="#DA9F58" strokeWidth={1.3}>
          {skylineStrokes.map(([d], i) => (
            // pathLength 1: a dash as long as the stroke, so an offset of 1 hides it and 0 shows it whole.
            <path key={i} d={d} pathLength={1} strokeDasharray="1 1" />
          ))}
        </g>
      </svg>
    </div>
  );
}

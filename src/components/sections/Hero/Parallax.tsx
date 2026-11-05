"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type ScrollTimelineConstructor = new (options: { source: Element; axis: "block" | "inline" }) => AnimationTimeline;

type ParallaxProps = {
  /** Share of the scroll speed the layer moves at: 0.9 for the statue, 0.8 for the line art. */
  speed: number;
  /** The most the layer falls behind the page, in px (the spec's 40). */
  max?: number;
  className?: string;
  children: ReactNode;
};

/**
 * A light parallax layer (motion spec, hero "Scroll"): it moves at `speed` × the scroll, so it trails the
 * page by (1 − speed) × the distance scrolled, up to `max` px, and then rides with the page. It runs on a
 * scroll-driven Web Animation (a ScrollTimeline on the document), so there is no scroll handler and the
 * work stays off the main thread. Where ScrollTimeline is missing, on touch screens and with reduced
 * motion, the layer does not move.
 */
export default function Parallax({ speed, max = 40, className, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const Timeline = (window as unknown as { ScrollTimeline?: ScrollTimelineConstructor }).ScrollTimeline;
    if (!el || !Timeline || prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;

    // The scroll after which the layer has fallen `max` px behind.
    const distance = Math.round(max / (1 - speed));
    let animation: Animation | undefined;
    try {
      const timeline = new Timeline({ source: document.documentElement, axis: "block" });
      animation = el.animate([{ transform: "translateY(0)" }, { transform: `translateY(${max}px)` }], {
        timeline,
        rangeStart: "0px",
        rangeEnd: `${distance}px`,
        fill: "both",
        easing: "linear",
      } as KeyframeAnimationOptions);
    } catch {
      // A browser that has ScrollTimeline but not these options: no parallax.
      animation?.cancel();
      animation = undefined;
    }
    return () => animation?.cancel();
  }, [speed, max]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

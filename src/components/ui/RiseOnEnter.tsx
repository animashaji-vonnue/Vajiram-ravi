"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Where the section starts: lower down, held in at the sides with rounded corners and its foot cut off. */
const START = {
  transform: "translateY(240px)",
  clipPath: "inset(0px 16px 28% 16px round 24px)",
};
const END = {
  transform: "translateY(0px)",
  clipPath: "inset(0px 0px 0% 0px round 0px)",
};
const TRANSITION = "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Plays its parent section in as it comes onto the screen, after the "Arts & Culture" banner on wearecollins.com:
 * the section starts 240 canvas pixels low, held 16px in at the sides with rounded corners and its lower part cut
 * off, and as its top enters the window it rises into place while opening out to its full size. Once it is back
 * below the window it is set to start again. Sections already on screen at load, and readers who ask for reduced
 * motion, see it in place. Renders nothing of its own.
 */
export default function RiseOnEnter() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el || prefersReducedMotion() || el.getBoundingClientRect().top < window.innerHeight) return;

    const set = (state: typeof START, animate: boolean) => {
      el.style.transition = animate ? TRANSITION : "none";
      el.style.transform = state.transform;
      el.style.clipPath = state.clipPath;
    };
    set(START, false);

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) set(END, true);
      // Only reset once it has gone back below the window, not when it scrolls off the top.
      else if (entry.boundingClientRect.top > 0) set(START, false);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.style.removeProperty("transition");
      el.style.removeProperty("transform");
      el.style.removeProperty("clip-path");
    };
  }, []);

  return <span ref={ref} hidden />;
}

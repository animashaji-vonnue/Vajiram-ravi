"use client";

import { useEffect, useRef } from "react";
import InkStamp from "@/components/sections/Admissions/InkStamp";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
/** The stamp comes down after the heading has risen, in a short firm press. */
const STAMP_DELAY_MS = 520;
const STAMP_MS = 260;

/**
 * The Vajiram & Ravi stamp beside the FAQ heading: the same round rubber stamp as on the counselling
 * postcard (Admissions/InkStamp: a double ring, "Vajiram & Ravi" round the top and "New Delhi" along the
 * foot, the emblem's rising sun and 1976 in the middle, in uneven vermilion ink), larger here, turned -10°
 * as a hand would press it and printed into the cream (multiply). When the band comes into view it is
 * pressed on (scaled down from 1.4 and fading in, after the heading) with an ink ring that spreads and
 * fades. With reduced motion it is simply there. Decoration only.
 */
export default function FaqSeal({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const seal = ref.current;
    const ring = ringRef.current;
    if (!seal || prefersReducedMotion() || typeof seal.animate !== "function") return;
    const box = seal.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.85 && box.bottom > 0) return;
    const animations = [
      // Scale only: the turn is the element's own `rotate`, which composes with this transform.
      seal.animate(
        [
          { transform: "scale(1.4)", opacity: 0 },
          { transform: "scale(0.96)", opacity: 1, offset: 0.75 },
          { transform: "none", opacity: 1 },
        ],
        { duration: STAMP_MS, delay: STAMP_DELAY_MS, easing: EASE_OUT, fill: "backwards" },
      ),
    ];
    if (ring) {
      animations.push(
        ring.animate(
          [
            { opacity: 0.5, transform: "scale(0.85)" },
            { opacity: 0, transform: "scale(1.35)" },
          ],
          { duration: 700, delay: STAMP_DELAY_MS + STAMP_MS * 0.7, easing: EASE_OUT, fill: "backwards" },
        ),
      );
    }
    animations.forEach((animation) => animation.pause());
    const band = seal.closest("section") ?? seal;
    const cancel = whenVisible(band, 0.2, () => animations.forEach((animation) => animation.play()));
    return () => {
      cancel();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none size-[136px] -rotate-10 opacity-90 mix-blend-multiply ${className ?? ""}`}>
      <span ref={ringRef} className="absolute -inset-3 rounded-full border-2 border-[#a5321b]/40 opacity-0" />
      <InkStamp filterId="faq-stamp-ink" className="size-full" />
    </div>
  );
}

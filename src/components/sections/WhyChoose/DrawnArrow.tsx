"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The crayon arrow's centre line, traced over the image (650 × 651): down the hook at the top left, round
 * the loop, out along the shaft, then the head: up its top wing, back to the tip and down its lower wing.
 * One unbroken line, since browsers restart the dash for every separate stroke.
 */
const STROKE =
  "M150 62 C120 110 100 150 110 210 C125 280 200 320 280 322 C350 322 430 260 440 200 C448 160 410 150 380 168 C335 195 318 260 330 320 C345 390 420 440 500 470 C540 485 570 490 598 488 L548 418 L600 488 L505 572";

/**
 * The red crayon arrow, drawn in as though by hand when it scrolls into view: a wide pen traces its
 * centre line, revealing the crayon as it goes, then flicks in the arrowhead. With reduced motion it's
 * simply there. Decorative.
 */
export default function DrawnArrow({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setDrawn(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setDrawn(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.6 },
    );
    // Only the image inside is masked, so the SVG's own box counts as on screen.
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 650 651"
      className={cx("group/arrow", className)}
      data-drawn={drawn || undefined}
    >
      <defs>
        <mask id={`${id}-pen`} maskUnits="userSpaceOnUse" x="0" y="0" width="650" height="651">
          <path
            d={STROKE}
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth="92"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 1"
            className="[stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[1600ms] ease-[cubic-bezier(0.45,0,0.3,1)] group-data-drawn/arrow:[stroke-dashoffset:0]"
          />
        </mask>
      </defs>
      <image href="/images/why/sticker-arrow.webp" width="650" height="651" mask={`url(#${id}-pen)`} />
    </svg>
  );
}

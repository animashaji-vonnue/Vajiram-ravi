"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { getViewTimeline } from "@/lib/parallax";

/*
 * The thread's course on the 1440 × 1005 band. It comes in over the top edge above the arch's right
 * shoulder, falls down the 32px gutter between the arch line and the text column (clear of the eyebrow,
 * heading and lead, which start at x 572), turns under the first card, passes through the cross-shaped gap
 * between the four upper cards (952, 503), runs on under cards 04 and 06 and leaves by the bottom-right
 * corner. Four cubic Béziers with matching tangents at each join, so it reads as one drawn line.
 */
const COURSE = "M520 -12C546 70 563 150 563 250C563 360 690 404 952 503C1214 602 1250 770 1302 902C1333 981 1392 1004 1456 1010";

/**
 * A saffron sutra thread behind the "Why Vajiram & Ravi" band (after Skiper UI's "SVG follow scroll"):
 * a fine dash-and-dot line at 30% that draws itself along its course as the band is scrolled through, from
 * when the band's top is a fifth of the way up the screen until its foot is, so it is whole as the band
 * leaves. The rhythm is the visible path; the draw is a mask over it whose stroke-dashoffset runs from 1 to
 * 0 (pathLength 1) on a ViewTimeline of the section. Without ViewTimeline, or with reduced motion, the
 * thread is simply there, fully drawn. Decorative: aria-hidden, no pointer events, behind everything.
 */
export default function SutraThread() {
  const svgRef = useRef<SVGSVGElement>(null);
  const drawRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const draw = drawRef.current;
    const band = svgRef.current?.closest("section");
    const Timeline = getViewTimeline();
    if (!draw || !band || !Timeline || prefersReducedMotion()) return;
    let animation: Animation | undefined;
    try {
      const timeline = new Timeline({ subject: band, axis: "block" });
      animation = draw.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        timeline,
        rangeStart: "entry 20%",
        rangeEnd: "exit 20%",
        fill: "both",
        easing: "linear",
      } as KeyframeAnimationOptions);
    } catch {
      // ViewTimeline without these options: the thread stays fully drawn.
      animation?.cancel();
      animation = undefined;
    }
    return () => animation?.cancel();
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      focusable="false"
      width={1440}
      height={1005}
      viewBox="0 0 1440 1005"
      fill="none"
      className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[1005px] w-canvas"
    >
      <defs>
        <mask id="why-thread-draw" maskUnits="userSpaceOnUse" x={0} y={0} width={1440} height={1005}>
          {/* A dash as long as the course: an offset of 1 hides the thread, 0 shows it whole. */}
          <path ref={drawRef} d={COURSE} pathLength={1} fill="none" stroke="#fff" strokeWidth={8} strokeDasharray="1 1" strokeDashoffset={0} />
        </mask>
      </defs>
      {/* Dash, dot, dash: a rangoli rhythm. */}
      <path
        d={COURSE}
        stroke="#F4C430"
        strokeOpacity={0.3}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray="14 6 0.5 6"
        mask="url(#why-thread-draw)"
      />
    </svg>
  );
}

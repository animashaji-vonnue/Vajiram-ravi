"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

const ART = "/images/locations";
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Motion spec: the line draws left to right over 600ms, then the station dot pulses twice. */
const DRAW_MS = 600;
const PULSE_MS = 480;
/** The card it sits in rises in with the section reveal; the line waits for it to be mostly there. */
const DRAW_DELAY_MS = 300;

/**
 * The metro note in the address card, 460 × 70: a stretch of the blue line with two stops and the station
 * (the larger dot in the middle), and the station's name and exit under it. On reveal the line (with its
 * stops) wipes in from the left, and the station dot then pulses twice. With reduced motion it is simply
 * there. It plays again if the campus is switched away and back.
 */
export default function MetroLine({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stationRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const box = ref.current;
    const line = lineRef.current;
    const station = stationRef.current;
    if (!box || !line || !station || prefersReducedMotion()) return;

    // Hidden (the first keyframe) until the note is in view.
    const draw = line.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], {
      duration: DRAW_MS,
      delay: DRAW_DELAY_MS,
      easing: EASE_OUT,
      fill: "backwards",
    });
    draw.pause();
    const pulse = station.animate([{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], {
      duration: PULSE_MS,
      delay: DRAW_DELAY_MS + DRAW_MS,
      iterations: 2,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
    });
    pulse.pause();

    const cancel = whenVisible(box, 0.6, () => {
      draw.play();
      pulse.play();
    });
    return () => {
      cancel();
      draw.cancel();
      pulse.cancel();
    };
  }, []);

  return (
    <div ref={ref} className="relative h-[70px] w-[460px] shrink-0">
      <div ref={lineRef} aria-hidden="true" className="absolute inset-0">
        <img src={`${ART}/metro-line.svg`} alt="" width={446} height={6} className="absolute top-[17px] left-[7px] h-1.5 w-[446px] max-w-none" />
        <img src={`${ART}/metro-stop.svg`} alt="" width={12} height={12} className="absolute top-3.5 left-11 size-3 max-w-none" />
        <img
          ref={stationRef}
          src={`${ART}/metro-station.svg`}
          alt=""
          width={20}
          height={20}
          className="absolute top-2.5 left-[220px] size-5 max-w-none"
        />
        <img src={`${ART}/metro-stop.svg`} alt="" width={12} height={12} className="absolute top-3.5 left-[404px] size-3 max-w-none" />
      </div>
      <p className="absolute inset-x-0 top-10 text-center text-[12px]/[16px] font-bold whitespace-nowrap text-mahogany">{label}</p>
    </div>
  );
}

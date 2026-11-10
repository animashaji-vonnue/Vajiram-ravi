"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type Ref } from "react";
import type { JourneyStage, StageId } from "@/data/journey";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";
import StageMedallion from "./StageMedallion";
import { MARKER_AT, RAIL_W, THREAD_D } from "./thread";

/** The entrance: the thread draws across in this time, lighting each medallion as it reaches it. */
const DRAW_MS = 1200;
/** A medallion's light-up: it grows in from 60% with a slight overshoot. */
const LIGHT_MS = 520;
const POP = "cubic-bezier(0.34, 1.56, 0.64, 1)";
/** The filled thread's run to the chosen stage (--dur-slow, --ease-in-out); medallions change as it passes them. */
const FILL_MS = 600;

/** A motion token's value, for the Web Animations API (which cannot read var()). */
function token(name: string, fallback: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

type StageRailProps = {
  stages: JourneyStage[];
  active: StageId;
  onSelect: (id: StageId) => void;
  /** The tab list's accessible name. */
  label: string;
  /** Prefix of the tab ids and of the panel's id (`${idPrefix}-panel`). */
  idPrefix: string;
  /**
   * The filled thread, for a parent that drives it with the scroll (JourneyStages): it then sets the path's
   * stroke-dashoffset itself, frame by frame, and the fill has no transition of its own.
   */
  fillRef?: Ref<SVGPathElement>;
};

/**
 * The stage rail: the three stages as WAI-ARIA tabs (one tab stop; the arrow keys, Home and End move and
 * choose), each a numbered medallion over the stage's name, strung on a thread across the column.
 *
 * The thread (see thread.ts) is a burnt dash-and-dot line hanging in garland swags between the medallions;
 * over it a saffron-to-burnt thread fills from the start to the chosen stage, running on or back over
 * --dur-slow when another is chosen. The medallions it has reached are lit orange, the ones ahead are paper,
 * and each changes as the fill passes it; the chosen one stands 12% larger in a saffron halo, its name in ink.
 *
 * Entrance, once, when the rail is in view: the thread draws itself from the left (1.2s, linear, so it
 * keeps pace), and each medallion lights up as the line reaches it, growing in with a saffron ring that
 * swells and fades; its name follows. A rail already on screen at load, or reduced motion: all as it rests.
 */
export default function StageRail({ stages, active, onSelect, label, idPrefix, fillRef }: StageRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const index = Math.max(0, stages.findIndex((stage) => stage.id === active));

  // The fill's last run, so each medallion on the way can wait for it (state adjusted while rendering).
  const [run, setRun] = useState({ from: index, to: index });
  if (run.to !== index) setRun({ from: run.to, to: index });
  const span = Math.abs(MARKER_AT[run.to] - MARKER_AT[run.from]);
  /** When the fill passes medallion `i` on its run, ms (its ease-in-out reads near enough as even here). */
  const passAt = (i: number) => (span ? Math.round((Math.abs(MARKER_AT[i] - MARKER_AT[run.from]) / span) * FILL_MS * 0.85) : 0);

  useEffect(() => {
    const rail = railRef.current;
    const draw = drawRef.current;
    if (!rail || !draw || prefersReducedMotion()) return;
    if (canvasTop(rail) < (window.innerHeight / getCanvasZoom()) * 0.85) return;
    const easeOut = token("--ease-out", "cubic-bezier(0.22, 1, 0.36, 1)");
    const animations: Animation[] = [
      draw.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: DRAW_MS, easing: "linear", fill: "backwards" }),
    ];
    const labels = rail.querySelectorAll<HTMLElement>("[data-stage-name]");
    rail.querySelectorAll<HTMLElement>("[data-stage-marker]").forEach((marker, i) => {
      const delay = Math.max(0, MARKER_AT[i] * DRAW_MS - 80);
      animations.push(
        marker.animate([{ opacity: 0, transform: "scale(0.6)" }, { opacity: 1, transform: "none" }], { duration: LIGHT_MS, delay, easing: POP, fill: "backwards" }),
      );
      const ring = marker.querySelector<HTMLElement>("[data-stage-ring]");
      if (ring) {
        animations.push(
          ring.animate([{ opacity: 0.8, transform: "scale(0.7)" }, { opacity: 0, transform: "scale(1.7)" }], { duration: 900, delay: delay + 120, easing: easeOut }),
        );
      }
      const name = labels.item(i);
      if (name) {
        animations.push(
          name.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], {
            duration: LIGHT_MS,
            delay: delay + 100,
            easing: easeOut,
            fill: "backwards",
          }),
        );
      }
    });
    // Held at their first frame (the thread undrawn, the medallions out) until the rail is seen.
    animations.forEach((animation) => animation.pause());
    const cancel = whenVisible(rail, 0.6, () => animations.forEach((animation) => animation.play()));
    return () => {
      cancel();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  const select = (next: number) => {
    const i = (next + stages.length) % stages.length;
    onSelect(stages[i].id);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next =
      event.key === "ArrowRight" ? index + 1 : event.key === "ArrowLeft" ? index - 1 : event.key === "Home" ? 0 : event.key === "End" ? stages.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    select(next);
  };

  return (
    <div ref={railRef} className="relative">
      <svg
        aria-hidden="true"
        focusable="false"
        width={RAIL_W}
        height={72}
        viewBox={`0 0 ${RAIL_W} 72`}
        fill="none"
        className="pointer-events-none absolute top-0 left-0 overflow-visible"
      >
        <defs>
          {/* The entrance's draw: a dash as long as the thread; an offset of 1 hides it, 0 shows it whole. */}
          <mask id={`${idPrefix}-thread-draw`} maskUnits="userSpaceOnUse" x={-8} y={-8} width={RAIL_W + 16} height={88}>
            <path ref={drawRef} d={THREAD_D} pathLength={1} stroke="#fff" strokeWidth={14} strokeDasharray="1 1" strokeDashoffset={0} />
          </mask>
          <linearGradient id={`${idPrefix}-thread-fill`} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={RAIL_W} y2={0}>
            <stop offset="0" stopColor="#F4C430" />
            <stop offset="1" stopColor="#CC5500" />
          </linearGradient>
        </defs>
        <g mask={`url(#${idPrefix}-thread-draw)`}>
          {/* The thread in a dash-dot rhythm, a dot at its start and a diamond at its end, as the eyebrow rules. */}
          <path d={THREAD_D} stroke="#CC5500" strokeOpacity={0.4} strokeWidth={1.5} strokeLinecap="round" strokeDasharray="10 6 0.5 6" />
          <circle cx={4} cy={28} r={2.4} fill="#CC5500" fillOpacity={0.6} />
          <path d={`M${RAIL_W - 12} 28L${RAIL_W - 6} 23L${RAIL_W} 28L${RAIL_W - 6} 33Z`} fill="#CC5500" fillOpacity={0.6} />
          {/* The filled thread: a dash of the path's whole length, offset to end at the chosen stage. */}
          <path
            ref={fillRef}
            d={THREAD_D}
            pathLength={1}
            stroke={`url(#${idPrefix}-thread-fill)`}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="1 1"
            className={fillRef ? undefined : "[transition:stroke-dashoffset_var(--dur-slow)_var(--ease-in-out)]"}
            style={{ strokeDashoffset: 1 - MARKER_AT[index] }}
          />
        </g>
      </svg>

      <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className="relative grid grid-cols-3">
        {stages.map((stage, i) => {
          const chosen = i === index;
          // Driven by the scroll, the fill is already at a medallion when its stage is chosen: no wait.
          const delay = fillRef ? 0 : passAt(i);
          return (
            <button
              key={stage.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${stage.id}`}
              aria-selected={chosen}
              aria-controls={`${idPrefix}-panel`}
              tabIndex={chosen ? 0 : -1}
              onClick={() => onSelect(stage.id)}
              className="group/stage flex cursor-pointer flex-col items-center gap-3.5 justify-self-center rounded-lg outline-offset-4"
            >
              {/* The entrance moves this layer; the chosen stage's growth is on the layer inside. */}
              <span data-stage-marker className="relative block size-14">
                <span data-stage-ring className="pointer-events-none absolute -inset-2 rounded-full border-2 border-saffron opacity-0" />
                <span
                  className={cx("absolute inset-0 [transition:scale_var(--dur-base)_var(--ease-out)]", chosen && "scale-112")}
                  style={{ transitionDelay: `${chosen ? delay : 0}ms` }}
                >
                  <span
                    className={cx(
                      "absolute -inset-3 rounded-full bg-saffron/25 [transition:opacity_var(--dur-base)_var(--ease-out),scale_var(--dur-base)_var(--ease-out)]",
                      chosen ? "opacity-100" : "scale-75 opacity-0",
                    )}
                    style={{ transitionDelay: `${chosen ? delay : 0}ms` }}
                  />
                  <StageMedallion number={stage.number} lit={i <= index} delay={delay} />
                </span>
              </span>
              <span
                data-stage-name
                className={cx(
                  "font-serif text-[24px]/[1.2] whitespace-nowrap [transition:color_var(--dur-fast)_var(--ease-out)]",
                  chosen ? "text-ink" : "text-clay group-hover/stage:text-burnt",
                )}
              >
                {stage.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

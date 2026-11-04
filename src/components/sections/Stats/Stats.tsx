"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { stats } from "@/data/home";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import TornPaper, { PAPER_H } from "./TornPaper";

const ROWS = 24;

/**
 * The tear that reveals the paper, as a clip-path: everything left of `x`% is kept, up to a ragged
 * vertical edge. Hidden and shown use the same jitter, so the browser slides one into the other; `seed`
 * varies the jitter.
 */
function revealEdge(x: number, seed = 78.233): string {
  const points = ["-10% 0%"];
  for (let row = 0; row <= ROWS; row++) {
    const y = (row / ROWS) * 100;
    const jag = Math.sin((row + 1) * seed) * 0.5 + Math.sin(row * 1.7) * 0.35;
    points.push(`${(x + jag * 0.9).toFixed(2)}% ${y.toFixed(2)}%`);
  }
  points.push("-10% 100%");
  return `polygon(${points.join(", ")})`;
}

const CLIP = { "--hidden": revealEdge(-4), "--shown": revealEdge(104) } as CSSProperties;
/** The pale fibres along the moving tear: the same tear a little ahead of the face, ragged differently. */
const FIBRES = { "--hidden": revealEdge(-3.4, 12.9898), "--shown": revealEdge(104.6, 12.9898) } as CSSProperties;

/** Both layers tear in together, easing in and out, and settle flat from a slight tilt as they go. */
const TEAR =
  "absolute inset-0 [clip-path:var(--hidden)] transition-[clip-path,translate,rotate] duration-[1800ms] ease-[cubic-bezier(0.65,0,0.35,1)] [rotate:-0.6deg] [translate:0_10px] group-data-shown/paper:[clip-path:var(--shown)] group-data-shown/paper:[rotate:0deg] group-data-shown/paper:[translate:0_0]";

/** When each column's figures start to fade up: about when the tear, easing in and out over 1.8s, reaches them. */
const FADE_DELAYS = [550, 780, 960, 1180];

/**
 * The stats on a strip of torn kraft paper, a figure with its unit and a line of context in each of four
 * columns. When the strip scrolls into view it tears in from the left, easing in and out, and settles
 * flat as it goes, with pale fibres showing along the tear; each column's figures fade up as the tear passes them. With reduced motion it's simply there.
 */
export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-label="Vajiram & Ravi in numbers" className="mx-auto w-canvas px-10 pt-12">
      <div
        ref={ref}
        data-shown={shown || undefined}
        className="group/paper relative drop-shadow-[0_10px_18px_rgb(67_45_20/0.18)]"
        style={{ height: PAPER_H }}
      >
        <div style={FIBRES} className={TEAR}>
          <TornPaper rimOnly className="absolute inset-0" />
        </div>
        <div style={CLIP} className={TEAR}>
          <TornPaper className="absolute inset-0" />
          <ul className="relative grid h-full grid-cols-4 items-center px-16">
            {stats.map((stat, i) => (
              <li
                key={stat.value}
                style={{ transitionDelay: `${FADE_DELAYS[i]}ms` }}
                className={cx(
                  "translate-y-2 px-8 opacity-0 transition-[opacity,translate] duration-600 ease-smooth group-data-shown/paper:translate-y-0 group-data-shown/paper:opacity-100",
                  i === 0 ? "pl-0" : "border-l border-brown-900/20",
                )}
              >
                <p className="flex flex-col gap-2 font-medium">
                  <span className="flex items-baseline gap-2.5 font-display whitespace-nowrap text-neutral-900">
                    <span className="text-[48px]/[56px] tracking-[-0.96px]">{stat.value}</span>
                    <span className="text-[20px]/[28px] tracking-[-0.2px]">{stat.unit}</span>
                  </span>
                  <span className="font-sans text-[16px]/[24px] text-neutral-800">{stat.text}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

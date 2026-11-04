"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";

/** The stroke's own grid; the SVG stretches to whatever box it's given. */
const W = 1000;
const H = 160;
const TOP = 14;
const BOTTOM = 146;
const BANDS = 50;

/** A seeded random number generator, so the same stroke comes out on the server and in the browser. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const f = (n: number) => n.toFixed(1);

/**
 * A dry-brush stroke as one path: a stack of thin bristle bands, each with tapered ends, shorter towards
 * the stroke's top and bottom where the brush pressed lighter, and broken into pieces near the ends where
 * the paint ran thin. The whole stroke rises slightly to the right.
 */
function stroke(): string {
  const rand = seeded(11);
  const r = (a: number, b: number) => a + rand() * (b - a);
  const step = (BOTTOM - TOP) / BANDS;
  const tilt = (y: number, x: number) => y - (x - W / 2) * 0.012;
  const pieces: string[] = [];

  for (let i = 0; i < BANDS; i++) {
    const t = (i + 0.5) / BANDS;
    const edge = Math.abs(t - 0.5) * 2;
    const thin = edge ** 3.2;
    const y = TOP + i * step;
    const h = step + 0.8;
    let start = r(8, 40) + thin * r(40, 220);
    let end = W - r(8, 36) - thin * r(40, 240);
    // A few bristles drag further out at either end.
    if (rand() < 0.2) start -= r(4, 8);
    if (rand() < 0.2) end += r(2, 8);

    const cuts: [number, number][] = [];
    if (rand() < 0.5) cuts.push([start + r(20, 160), r(5, 40)]);
    if (rand() < 0.55) cuts.push([end - r(20, 200), r(5, 50)]);
    if (edge > 0.5 && rand() < 0.5) cuts.push([r(start + 200, end - 200), r(10, 120)]);
    cuts.sort((a, b) => a[0] - b[0]);

    let x = start;
    const spans: [number, number][] = [];
    for (const [at, gap] of cuts) {
      if (at - x > 18) spans.push([x, at]);
      x = at + gap;
    }
    if (end - x > 18) spans.push([x, end]);

    for (const [a, b] of spans) {
      // Tapers no longer than a third of the piece each, so short pieces don't cross over themselves.
      const tl = Math.min(r(5, 22), (b - a) / 3);
      const tr = Math.min(r(5, 26), (b - a) / 3);
      const mid = y + h / 2 + r(-0.3, 0.3);
      pieces.push(
        `M${f(a)} ${f(tilt(mid, a))}L${f(a + tl)} ${f(tilt(y, a + tl))}L${f(b - tr)} ${f(tilt(y, b - tr))}L${f(b)} ${f(tilt(mid, b))}L${f(b - tr)} ${f(tilt(y + h, b - tr))}L${f(a + tl)} ${f(tilt(y + h, a + tl))}Z`,
      );
    }
  }
  return pieces.join("");
}

const PATH = stroke();

/**
 * A saffron dry-brush stroke for text to sit on, stretched to fill its box. When it scrolls into view it
 * paints itself in from the left, as a brush would; with reduced motion it's simply there. Decorative.
 */
export default function BrushStroke({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setPainted(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPainted(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.5 },
    );
    // Watch the box the stroke fills, not the stroke: until it's painted the stroke is clipped to nothing,
    // and Chrome counts that as never on screen.
    observer.observe(el.parentElement ?? el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      data-painted={painted || undefined}
      className={cx(
        "[clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.55,0,0.25,1)] data-painted:[clip-path:inset(0_0_0_0)]",
        className,
      )}
    >
      <path d={PATH} className="fill-saffron" />
    </svg>
  );
}

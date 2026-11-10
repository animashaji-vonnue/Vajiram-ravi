"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { useInView } from "@/lib/useInView";

/**
 * The rows of Indian-script letters behind the counselling band (Figma "bg – Indian scripts (unity in
 * languages)": अ in nine scripts, outlined, white at 14%; the middle row at 5%). Each row drifts sideways
 * very slowly, a few px either way and back (26–32s, ease-in-out, alternating), the rows in opposite
 * directions; only while the band is on screen, and not at all with reduced motion. Decoration only.
 */
const ROWS = [
  { position: "top-[102px]", strength: "", drift: -28, ms: 26000 },
  { position: "bottom-[262px]", strength: "opacity-36", drift: 24, ms: 32000 },
  { position: "bottom-[128px]", strength: "", drift: -20, ms: 29000 },
];

export default function ScriptRows() {
  const [ref, inView] = useInView<HTMLDivElement>({ once: false });
  const drifts = useRef<Animation[]>([]);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion() || typeof root.animate !== "function") return;
    drifts.current = Array.from(root.children, (row, i) => {
      const drift = row.animate([{ transform: "translateX(0)" }, { transform: `translateX(${ROWS[i].drift}px)` }], {
        duration: ROWS[i].ms,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      });
      drift.pause();
      return drift;
    });
    return () => {
      drifts.current.forEach((drift) => drift.cancel());
      drifts.current = [];
    };
  }, [ref]);

  useEffect(() => {
    drifts.current.forEach((drift) => (inView ? drift.play() : drift.pause()));
  }, [inView]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {ROWS.map((row) => (
        <img
          key={row.position}
          src="/images/talk-to-us/script-glyphs.svg"
          alt=""
          width={1280}
          height={56.432}
          className={`absolute left-20 max-w-none ${row.position} ${row.strength}`}
        />
      ))}
    </div>
  );
}

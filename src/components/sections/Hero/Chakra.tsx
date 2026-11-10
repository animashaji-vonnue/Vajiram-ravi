"use client";

import type { CSSProperties } from "react";
import { useInView } from "@/lib/useInView";

/**
 * The Ashoka chakra of the banner photo, separated from it so it can turn: the photo (banner.webp) is the
 * design's own with the wheel taken out, and the wheel (chakra.webp, the same watermark rebuilt from its 24
 * spokes) sits back exactly where it was drawn. In front of it stay the flag, its pole and the dome, so
 * a still mask over the wheel's square (chakra-mask.webp, transparent where they stand) hides the turning
 * wheel behind them.
 *
 * The square is 418px of the 2059px photo, at (1750.5, 0.5) on it; the banner shows that photo at 0.62168,
 * so on the canvas it is 259.86px square at (1088.26, 0.31) of the banner. At rest it looks just like the
 * photo.
 *
 * Ambient (motion rules): the wheel turns once every two minutes, clockwise and linear, only while the
 * banner is on screen (paused off screen). Still with reduced motion.
 */
const BOX: CSSProperties = {
  left: 1088.26,
  top: 0.31,
  width: 259.86,
  height: 259.86,
  maskImage: "url(/images/hero/chakra-mask.webp)",
  WebkitMaskImage: "url(/images/hero/chakra-mask.webp)",
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
};

/** One turn, in ms. */
const TURN = 120_000;

export default function Chakra() {
  const [ref, inView] = useInView<HTMLDivElement>({ once: false });
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute" style={BOX}>
      <img
        src="/images/hero/chakra.webp"
        alt=""
        width={418}
        height={418}
        decoding="async"
        className="block size-full max-w-none animate-spin motion-reduce:animate-none"
        style={{ animationDuration: `${TURN}ms`, animationPlayState: inView ? "running" : "paused" }}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { useInView } from "@/lib/useInView";

/**
 * Motion spec, hero "Ambient": the glow's peak opacity breathes between 0.30 and 0.42. The design's glow
 * (a radial gradient whose centre is #EC5800 at 0.38) can only be dimmed by the element's opacity, so it
 * breathes from 0.30 up to its drawn 0.38: element opacity 0.79 ↔ 1.
 */
const LOW = 0.79;
/** Half a breath; a whole one (out and back) takes the spec's 6s. */
const HALF_BREATH = 3000;
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

/**
 * The warm glow behind the statue (Figma "bg – warm glow", 2256:5588, 760 × 760 at (740, 0)). It rests as
 * drawn and breathes slowly, ease-in-out, only while it is on screen (it pauses off screen). Still with
 * reduced motion.
 */
export default function HeroGlow() {
  const [ref, inView] = useInView<HTMLImageElement>({ once: false });
  const breath = useRef<Animation | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (!inView) {
      breath.current?.pause();
      return;
    }
    if (breath.current) breath.current.play();
    else {
      // From the drawn state down and back, so the loop starts without a jump.
      breath.current = el.animate([{ opacity: 1 }, { opacity: LOW }], {
        duration: HALF_BREATH,
        direction: "alternate",
        iterations: Infinity,
        easing: EASE_IN_OUT,
      });
    }
  }, [inView, ref]);

  useEffect(
    () => () => {
      breath.current?.cancel();
      breath.current = null;
    },
    [],
  );

  return (
    <img
      ref={ref}
      src="/images/hero/warm-glow.svg"
      alt=""
      width={760}
      height={760}
      className="absolute top-0 left-[740px] block size-[760px] max-w-none"
    />
  );
}

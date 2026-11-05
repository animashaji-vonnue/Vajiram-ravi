"use client";

import { useEffect, useRef } from "react";
import { closingSkyline, haloRings } from "@/data/closing-cta";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Motion spec: the disc rises 80px over 900ms; the rings scale 0.9 to 1 and fade in, 120ms apart. */
const RISE_PX = 80;
const RISE_MS = 900;
const RING_MS = 600;
const RING_STAGGER_MS = 120;

/** The halo square (1500px, centred on the canvas, its top 280px down) and the rings' shared centre in it. */
const HALO = 1500;
const HALO_CENTRE = 750;

/**
 * The sun behind the closing call to action: the white halo rings, the skyline silhouette (mahogany at
 * 16%) and the sun disc rising from the band's foot. Decoration only.
 *
 * Motion spec, once, when the band is 20% in view (with the section reveal, whose heading and buttons are
 * delayed to follow): the disc rises 80px into place (900ms, --ease-out) while the rings scale from 0.9 to
 * 1 and fade in one after another from the inside out, 120ms apart. With reduced motion, or if the band is
 * already on screen at load, everything is simply in place.
 *
 * The spec's ambient turn of the rings (90s a turn, alternating) is left out: the rings are plain
 * concentric circles, so turning them would show nothing while keeping eight layers up to 1500px square
 * on the compositor.
 */
export default function SunRise() {
  const ref = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLImageElement>(null);
  const ringRefs = useRef<Array<HTMLImageElement | null>>([]);

  useEffect(() => {
    const art = ref.current;
    const disc = discRef.current;
    const band = art?.closest("section");
    if (!art || !disc || !band || prefersReducedMotion()) return;
    if (canvasTop(band) < (window.innerHeight / getCanvasZoom()) * 0.85) return;

    // Created paused: their first keyframes (fill backwards) hold the art in its start state until then.
    const animations: Animation[] = [
      disc.animate([{ transform: `translateY(${RISE_PX}px)` }, { transform: "none" }], { duration: RISE_MS, easing: EASE_OUT, fill: "backwards" }),
      ...ringRefs.current.flatMap((ring, i) =>
        ring
          ? [
              ring.animate([{ opacity: 0, transform: "scale(0.9)" }, { opacity: 1, transform: "none" }], {
                duration: RING_MS,
                delay: i * RING_STAGGER_MS,
                easing: EASE_OUT,
                fill: "backwards",
              }),
            ]
          : [],
      ),
    ];
    animations.forEach((animation) => animation.pause());

    const cancel = whenVisible(band, 0.2, () => animations.forEach((animation) => animation.play()));
    return () => {
      cancel();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute top-[280px] left-[-30px] overflow-hidden" style={{ width: HALO, height: HALO }}>
        {haloRings.map((ring, i) => (
          <img
            key={ring.src}
            ref={(el) => {
              ringRefs.current[i] = el;
            }}
            src={ring.src}
            alt=""
            width={ring.size}
            height={ring.size}
            className="absolute max-w-none"
            style={{ left: HALO_CENTRE - ring.size / 2, top: HALO_CENTRE - ring.size / 2, width: ring.size, height: ring.size }}
          />
        ))}
      </div>

      <div className="absolute top-[464.05px] left-0 h-[258.75px] w-[1440px] opacity-16">
        {closingSkyline.map((monument) => (
          <img
            key={monument.name}
            src={monument.src}
            alt=""
            width={monument.width}
            height={monument.height}
            className="absolute max-w-none"
            style={{ left: monument.x, top: monument.y, width: monument.width, height: monument.height }}
          />
        ))}
      </div>

      <img ref={discRef} src="/images/closing/sun-disc.svg" alt="" width={520} height={520} className="absolute top-[560px] left-[460px] size-[520px] max-w-none" />
    </div>
  );
}

"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { haloRings } from "@/data/closing-cta";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";
import { useInView } from "@/lib/useInView";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Motion spec: the disc rises 80px over 900ms; the rings scale 0.9 to 1 and fade in, 120ms apart. */
const RISE_PX = 80;
const RISE_MS = 900;
const RING_MS = 600;
const RING_STAGGER_MS = 120;

/** The halo square (1500px, centred on the sun) and the rings' shared centre in it. */
const HALO = 1500;
const HALO_CENTRE = 750;

/** The sun disc (520px, its top 560px down) and its centre on the canvas, which the rays and glow share. */
const DISC = 520;
const SUN_X = 720;
const SUN_Y = 820;
/** The rays' square and the glow's, both centred on the sun. */
const RAYS = 1100;
const GLOW = 760;

/**
 * The wave of light through the rings: every RIPPLE_MS a brighter copy of each ring swells in and out,
 * one ring after another from the sun outwards, RIPPLE_STAGGER_MS apart, so a pulse travels out through
 * the halo. The first wave waits RIPPLE_START_MS, until the rings have faded in.
 */
const RIPPLE_MS = 5200;
const RIPPLE_STAGGER_MS = 240;
const RIPPLE_START_MS = 1400;

/**
 * The sun behind the closing call to action: the white halo rings, centred on the sun, and the sun disc
 * rising from the band's foot. Decoration only.
 *
 * Motion spec, once, when the band is 20% in view (with the section reveal, whose heading and buttons are
 * delayed to follow): the disc rises 80px into place (900ms, --ease-out) while the rings scale from 0.9 to
 * 1 and fade in one after another from the inside out, 120ms apart. With reduced motion, or if the band is
 * already on screen at load, everything is simply in place.
 *
 * Then, for as long as the band is on screen (paused when it is not, none of it with reduced motion):
 *   - A wave of light runs out from the sun through the rings every 5.2s (halo-ripple in globals.css):
 *     each ring's brighter copy swells from 98.5% to 101% while it brightens and fades.
 *   - Faint rays fan out around the sun, behind the skyline, and turn once every two minutes.
 *   - A warm glow around the disc breathes, 5s each way (sun-breathe).
 * Every loop moves only opacity and transform, so it stays on the compositor.
 */
export default function SunRise() {
  const [ref, inView] = useInView<HTMLDivElement>({ once: false });
  const backRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLImageElement>(null);
  const ringRefs = useRef<Array<HTMLImageElement | null>>([]);

  useEffect(() => {
    const art = ref.current;
    const back = backRef.current;
    const disc = discRef.current;
    const band = art?.closest("section");
    if (!art || !back || !disc || !band || prefersReducedMotion()) return;
    if (canvasTop(band) < (window.innerHeight / getCanvasZoom()) * 0.85) return;

    // Created paused: their first keyframes (fill backwards) hold the art in its start state until then.
    // The rays and glow rise with the disc.
    const rise = [{ transform: `translateY(${RISE_PX}px)` }, { transform: "none" }];
    const animations: Animation[] = [
      disc.animate(rise, { duration: RISE_MS, easing: EASE_OUT, fill: "backwards" }),
      back.animate(rise, { duration: RISE_MS, easing: EASE_OUT, fill: "backwards" }),
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
  }, [ref]);

  // The ambient loops run only while the band is on screen.
  const play: CSSProperties = { animationPlayState: inView ? "running" : "paused" };

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* The rings and their wave share the sun's centre, so they read as its halo. */}
      <div className="absolute overflow-hidden" style={{ left: SUN_X - HALO_CENTRE, top: SUN_Y - HALO_CENTRE, width: HALO, height: HALO }}>
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
        {/* The wave: a brighter copy of each ring, at rest unseen. */}
        {haloRings.map((ring, i) => (
          <svg
            key={`wave-${ring.src}`}
            viewBox={`0 0 ${ring.size} ${ring.size}`}
            width={ring.size}
            height={ring.size}
            fill="none"
            className="absolute max-w-none animate-[halo-ripple_5200ms_var(--ease-in-out)_infinite] opacity-0 motion-reduce:hidden"
            style={{
              ...play,
              left: HALO_CENTRE - ring.size / 2,
              top: HALO_CENTRE - ring.size / 2,
              animationDuration: `${RIPPLE_MS}ms`,
              animationDelay: `${RIPPLE_START_MS + i * RIPPLE_STAGGER_MS}ms`,
            }}
          >
            <circle cx={ring.size / 2} cy={ring.size / 2} r={ring.size / 2 - 1} stroke="#fff6e8" strokeOpacity={0.8} strokeWidth={1.5} />
          </svg>
        ))}
      </div>

      {/* The rays and the glow, centred on the sun, rising with it. */}
      <div ref={backRef} className="absolute inset-0">
        <div
          className="absolute animate-spin motion-reduce:animate-none"
          style={{
            ...play,
            left: SUN_X - RAYS / 2,
            top: SUN_Y - RAYS / 2,
            width: RAYS,
            height: RAYS,
            animationDuration: "120s",
            // 24 soft rays, from just outside the disc out to about 280px beyond it.
            background: "repeating-conic-gradient(from 0deg, transparent 0deg, rgb(255 241 194 / 0.2) 3deg, transparent 6deg 15deg)",
            maskImage: `radial-gradient(circle closest-side, transparent ${DISC / 2 - 6}px, #000 ${DISC / 2 + 30}px, transparent ${RAYS / 2}px)`,
            WebkitMaskImage: `radial-gradient(circle closest-side, transparent ${DISC / 2 - 6}px, #000 ${DISC / 2 + 30}px, transparent ${RAYS / 2}px)`,
          }}
        />
        <div
          className="absolute animate-[sun-breathe_5s_var(--ease-in-out)_infinite_alternate] rounded-full motion-reduce:animate-none"
          style={{
            ...play,
            left: SUN_X - GLOW / 2,
            top: SUN_Y - GLOW / 2,
            width: GLOW,
            height: GLOW,
            background: "radial-gradient(circle closest-side, rgb(255 236 170 / 0.55), rgb(255 205 115 / 0.24) 62%, transparent)",
          }}
        />
      </div>

      <img
        ref={discRef}
        src="/images/closing/sun-disc.svg"
        alt=""
        width={DISC}
        height={DISC}
        className="absolute max-w-none"
        style={{ left: SUN_X - DISC / 2, top: SUN_Y - DISC / 2, width: DISC, height: DISC }}
      />
    </div>
  );
}

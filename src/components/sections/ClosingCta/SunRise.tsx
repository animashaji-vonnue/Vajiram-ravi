"use client";

import { useEffect, useRef } from "react";
import { haloRings } from "@/data/closing-cta";
import { prefersReducedMotion } from "@/lib/motion";
import { playSunrise } from "./sunrisePlay";
import "./closing-cta.css";

/** The band's height (ClosingCta). */
const BAND = 720;

/** The halo square (1500px, centred on the sun) and the rings' shared centre in it. */
const HALO = 1500;
const HALO_CENTRE = 750;
/** The halo's clip reaches this far past the outermost ring, so a ring that follows the pointer keeps its edge. */
const HALO_PAD = 48;

/** The sun disc (520px, its top 560px down) and its centre on the canvas, which the rays and glow share. */
const DISC = 520;
const SUN_X = 720;
const SUN_Y = 820;
/** The rays' square and the glow's, both centred on the sun; the hover warmth is a little wider. */
const RAYS = 1100;
const GLOW = 760;
const WARM = 900;
/** The light that follows the pointer (sunrisePlay's SPOT). */
const SPOT = 440;

/**
 * The wave of light through the rings: every RIPPLE_MS a brighter copy of each ring swells in and out,
 * one ring after another from the sun outwards, RIPPLE_STAGGER_MS apart, so a pulse travels out through
 * the halo. The first wave waits RIPPLE_START_MS.
 */
const RIPPLE_MS = 5200;
const RIPPLE_STAGGER_MS = 240;
const RIPPLE_START_MS = 1400;

/**
 * The sun behind the closing call to action: the white halo rings, centred on the sun, the rays and glow
 * round it and the sun disc at the band's foot, over a dusk shade and a dawn light that the scroll plays.
 * Decoration only (aria-hidden; the band itself takes the pointer).
 *
 * As drawn (without JavaScript, and with reduced motion) everything is in place and still. Otherwise
 * sunrisePlay.ts drives it, from one animation-frame loop that runs only while the band is on screen:
 *   - The scroll scrubs the sunrise: the disc, rays and glow rise from below the horizon into place, the
 *     rings scale in and fade in from the inside out, and the sky warms out of dusk.
 *   - A mouse or pen over the band draws the sun, its glow and rays after it on a lagged spring, the rings
 *     at falling depths; the rays turn faster, the glow warms and a soft light follows the pointer. The
 *     heading's letters lift towards the pointer as it passes them.
 *   - A press or tap on the band (not its buttons) sends a halo ripple out from the point; the sun flashes.
 * And two CSS loops, paused while the band is off screen (closing-cta.css):
 *   - A wave of light runs out from the sun through the rings every 5.2s (halo-ripple in globals.css):
 *     each ring's brighter copy swells from 98.5% to 101% while it brightens and fades.
 *   - The glow round the disc breathes, 5s each way (sun-breathe).
 * Every layer moves only by opacity and transform, so it stays on the compositor.
 */
export default function SunRise() {
  const rootRef = useRef<HTMLDivElement>(null);
  const duskRef = useRef<HTMLDivElement>(null);
  const dawnRef = useRef<HTMLDivElement>(null);
  const ringRefs = useRef<Array<HTMLDivElement | null>>([]);
  const backRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const warmRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLImageElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const ripplesRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const band = root?.closest("section");
    const [dusk, dawn, back, rays, glow, warm, sun, disc, flare, ripples, spot] = [
      duskRef, dawnRef, backRef, raysRef, glowRef, warmRef, sunRef, discRef, flareRef, ripplesRef, spotRef,
    ].map((ref) => ref.current);
    const rings = ringRefs.current.filter((ring): ring is HTMLDivElement => !!ring);
    if (!root || !band || !dusk || !dawn || !back || !rays || !glow || !warm || !sun || !disc || !flare || !ripples || !spot) return;
    if (prefersReducedMotion() || typeof root.animate !== "function") return;
    return playSunrise(
      { root, band, heading: band.querySelector("h2"), dusk, dawn, rings, back, rays, glow, warm, sun, disc, flare, ripples, spot },
      { sunX: SUN_X, sunY: SUN_Y, discTop: SUN_Y - DISC / 2, height: BAND },
    );
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="sunrise pointer-events-none absolute inset-0">
      {/* The sky the scroll plays: a dusk shade that lifts, and a dawn light at the foot that swells and passes. */}
      <div ref={duskRef} className="absolute inset-y-0 -inset-x-[1200px] bg-linear-to-b from-[#6e2410] to-[#4a1708] opacity-0" />
      <div
        ref={dawnRef}
        className="absolute inset-y-0 -inset-x-[1200px] opacity-0"
        style={{ background: "linear-gradient(to top, rgb(255 196 110 / 0.55), rgb(255 196 110 / 0) 55%)" }}
      />

      {/* The rings and their wave share the sun's centre, so they read as its halo. */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: SUN_X - HALO_CENTRE - HALO_PAD,
          top: SUN_Y - HALO_CENTRE - HALO_PAD,
          width: HALO + HALO_PAD * 2,
          height: HALO + HALO_PAD * 2,
        }}
      >
        {haloRings.map((ring, i) => (
          <div
            key={ring.src}
            ref={(el) => {
              ringRefs.current[i] = el;
            }}
            className="sunrise-layer absolute"
            style={{
              left: HALO_PAD + HALO_CENTRE - ring.size / 2,
              top: HALO_PAD + HALO_CENTRE - ring.size / 2,
              width: ring.size,
              height: ring.size,
            }}
          >
            <img src={ring.src} alt="" width={ring.size} height={ring.size} className="absolute inset-0 max-w-none" />
            {/* The wave: a brighter copy of the ring, at rest unseen. */}
            <svg
              viewBox={`0 0 ${ring.size} ${ring.size}`}
              width={ring.size}
              height={ring.size}
              fill="none"
              className="sunrise-loop absolute inset-0 max-w-none animate-[halo-ripple_5200ms_var(--ease-in-out)_infinite] opacity-0 motion-reduce:hidden"
              style={{ animationDuration: `${RIPPLE_MS}ms`, animationDelay: `${RIPPLE_START_MS + i * RIPPLE_STAGGER_MS}ms` }}
            >
              <circle cx={ring.size / 2} cy={ring.size / 2} r={ring.size / 2 - 1} stroke="#fff6e8" strokeOpacity={0.8} strokeWidth={1.5} />
            </svg>
          </div>
        ))}
      </div>

      {/* The rays and the glow, centred on the sun, rising with it. */}
      <div ref={backRef} className="sunrise-layer absolute inset-0">
        <div
          ref={raysRef}
          className="sunrise-layer absolute"
          style={{
            left: SUN_X - RAYS / 2,
            top: SUN_Y - RAYS / 2,
            width: RAYS,
            height: RAYS,
            // 24 soft rays, from just outside the disc out to about 280px beyond it.
            background: "repeating-conic-gradient(from 0deg, transparent 0deg, rgb(255 241 194 / 0.2) 3deg, transparent 6deg 15deg)",
            maskImage: `radial-gradient(circle closest-side, transparent ${DISC / 2 - 6}px, #000 ${DISC / 2 + 30}px, transparent ${RAYS / 2}px)`,
            WebkitMaskImage: `radial-gradient(circle closest-side, transparent ${DISC / 2 - 6}px, #000 ${DISC / 2 + 30}px, transparent ${RAYS / 2}px)`,
          }}
        />
        <div ref={glowRef} className="sunrise-layer absolute" style={{ left: SUN_X - WARM / 2, top: SUN_Y - WARM / 2, width: WARM, height: WARM }}>
          <div
            className="sunrise-loop absolute animate-[sun-breathe_5s_var(--ease-in-out)_infinite_alternate] rounded-full motion-reduce:animate-none"
            style={{
              left: (WARM - GLOW) / 2,
              top: (WARM - GLOW) / 2,
              width: GLOW,
              height: GLOW,
              background: "radial-gradient(circle closest-side, rgb(255 236 170 / 0.55), rgb(255 205 115 / 0.24) 62%, transparent)",
            }}
          />
          {/* The warmth while the pointer is over the band. */}
          <div
            ref={warmRef}
            className="absolute inset-0 rounded-full opacity-0"
            style={{ background: "radial-gradient(circle closest-side, rgb(255 222 140 / 0.6), rgb(255 180 80 / 0.25) 60%, transparent)" }}
          />
        </div>
      </div>

      <div ref={sunRef} className="sunrise-layer absolute" style={{ left: SUN_X - DISC / 2, top: SUN_Y - DISC / 2, width: DISC, height: DISC }}>
        <img ref={discRef} src="/images/closing/sun-disc.svg" alt="" width={DISC} height={DISC} className="absolute inset-0 max-w-none" />
        {/* The flash when the band is pressed. */}
        <div
          ref={flareRef}
          className="absolute -inset-10 rounded-full opacity-0"
          style={{ background: "radial-gradient(circle closest-side, rgb(255 252 236 / 0.85), rgb(255 236 170 / 0.4) 62%, transparent)" }}
        />
      </div>

      {/* The press ripples, and the soft light that follows the pointer. */}
      <div ref={ripplesRef} className="absolute inset-0" />
      <div
        ref={spotRef}
        className="sunrise-layer absolute top-0 left-0 rounded-full opacity-0"
        style={{ width: SPOT, height: SPOT, background: "radial-gradient(circle closest-side, rgb(255 230 170 / 0.26), transparent)" }}
      />
    </div>
  );
}

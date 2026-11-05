"use client";

import { useEffect, useRef } from "react";
import Photo from "@/components/ui/Photo";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { canParallax, parallax } from "@/lib/parallax";
import { whenVisible } from "@/lib/reveal";

/** The motion spec's wipe: "slow", 800ms. */
const WIPE_MS = 800;

/** The photo's drift each way, as a share of its height (lib/parallax). */
const PARALLAX_SPEED = 5;

/**
 * The arched Constitution photo (Figma "arch frame · Constitution photo", 2257:8719): the design's arched
 * cut-out, 460 × 600, with its orange arch line 12px outside it; the frame clips the line, so it shows only
 * where the arch curves away from the frame's corners. The quote is part of the photo.
 *
 * Motion spec: on first view it reveals with a slow wipe from the bottom (clip-path inset(100% 0 0 0) to
 * inset(0), 800ms), paused at its first frame until then. Already on screen at load, or with reduced motion,
 * it shows as it is.
 *
 * Scroll parallax (fine pointers, where ViewTimeline exists, motion allowed): the photo drifts inside the
 * arch as the frame rises into view, settling once the whole frame is on screen. The arch is cut into the
 * photo itself, so once it has loaded the photo's own picture becomes the mask of the layer around it: the
 * arch keeps its exact shape inside the orange line while the picture moves. The drift ends with the photo
 * flush with the frame's foot, so the quote sits by the foot as drawn whenever the whole frame is in view.
 */
export default function ArchPhoto({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = ref.current;
    const layer = wipeRef.current;
    if (!frame || !layer || prefersReducedMotion()) return;
    if (canvasTop(frame) < (window.innerHeight / getCanvasZoom()) * 0.85) return;
    const easing = getComputedStyle(document.documentElement).getPropertyValue("--ease-out").trim() || "cubic-bezier(0.22, 1, 0.36, 1)";
    // The wipe runs on an inner layer: an element fully clipped by its own clip-path counts as 0% visible to
    // IntersectionObserver, so the observed frame must stay unclipped.
    const wipe = layer.animate([{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }], {
      duration: WIPE_MS,
      easing,
      fill: "backwards",
    });
    wipe.pause();
    const cancel = whenVisible(frame, 0.3, () => wipe.play());
    return () => {
      cancel();
      wipe.cancel();
    };
  }, []);

  useEffect(() => {
    const frame = ref.current;
    const arch = archRef.current;
    const drift = driftRef.current;
    const img = drift?.querySelector("img");
    if (!frame || !arch || !drift || !img || !canParallax()) return;

    let stop = () => {};
    const start = () => {
      // The loaded file, so the mask comes from the cache and matches the picture exactly (object-cover).
      const mask = `url("${img.currentSrc || img.src}")`;
      for (const prefix of ["", "-webkit-"]) {
        arch.style.setProperty(`${prefix}mask-image`, mask);
        arch.style.setProperty(`${prefix}mask-size`, "cover");
        arch.style.setProperty(`${prefix}mask-position`, "center");
        arch.style.setProperty(`${prefix}mask-repeat`, "no-repeat");
      }
      // "faster": it settles where the quote is drawn (about 40px from the foot) once the whole frame is in view.
      stop = parallax(drift, { speed: PARALLAX_SPEED, direction: "faster", frame, rangeStart: "cover 0%", rangeEnd: "contain 0%" });
    };
    if (img.complete && img.naturalWidth > 0) start();
    else img.addEventListener("load", start, { once: true });

    return () => {
      img.removeEventListener("load", start);
      stop();
      for (const prefix of ["", "-webkit-"]) {
        for (const property of ["mask-image", "mask-size", "mask-position", "mask-repeat"]) arch.style.removeProperty(`${prefix}${property}`);
      }
    };
  }, []);

  return (
    <div ref={ref} className="relative h-[600px] w-[460px] shrink-0 overflow-clip">
      <div ref={wipeRef} className="absolute inset-0">
        {/* The arch (masked by the photo once the parallax runs), and the drifting layer holding the photo. */}
        <div ref={archRef} className="absolute top-0 left-[-0.5px] h-[600px] w-[461px]">
          <div ref={driftRef} className="absolute inset-0">
            <Photo src={src} alt={alt} sizes="461px" className="absolute inset-0" />
          </div>
        </div>
        <img
          src="/images/why-choose/arch-outline.svg"
          alt=""
          aria-hidden="true"
          width={487}
          height={613.5}
          className="pointer-events-none absolute top-[-13.5px] left-[-13.5px] h-[613.5px] w-[487px] max-w-none"
        />
      </div>
    </div>
  );
}

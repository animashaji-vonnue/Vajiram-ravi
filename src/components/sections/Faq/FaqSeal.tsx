"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
/** The seal is pressed on after the heading has risen in: 1.4× to its size with a small overshoot of shadow. */
const STAMP_DELAY_MS = 520;
const STAMP_MS = 260;
/** Its hover spin: a full turn about its upright axis, seen through a 600px perspective. */
const SPIN_MS = 900;
const SPIN = [{ transform: "perspective(600px) rotateY(0deg)" }, { transform: "perspective(600px) rotateY(360deg)" }];

/**
 * The V&R wax seal beside the FAQ heading (Figma "wax seal · V&R"), turned 12°. When the band comes into
 * view it is pressed on like a seal into wax (scaled down from 1.4 and fading in, after the heading); with a
 * mouse, hovering it spins its face once in 3D. The still outer box takes the hover, so the turning face
 * cannot drop the pointer and start another turn. With reduced motion it is simply there. Decoration only.
 */
export default function FaqSeal({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seal = ref.current;
    if (!seal || prefersReducedMotion() || typeof seal.animate !== "function") return;
    const box = seal.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.85 && box.bottom > 0) return;
    const stamp = seal.animate(
      // Scale only: the 12° turn is the element's own `rotate`, which composes with this transform.
      [
        { transform: "scale(1.4)", opacity: 0 },
        { transform: "scale(0.96)", opacity: 1, offset: 0.75 },
        { transform: "none", opacity: 1 },
      ],
      { duration: STAMP_MS, delay: STAMP_DELAY_MS, easing: EASE_OUT, fill: "backwards" },
    );
    stamp.pause();
    const band = seal.closest("section") ?? seal;
    const cancel = whenVisible(band, 0.2, () => stamp.play());
    return () => {
      cancel();
      stamp.cancel();
    };
  }, []);

  const spin = (event: { pointerType: string }) => {
    const seal = ref.current;
    const face = faceRef.current;
    if (!seal || !face || typeof face.animate !== "function" || event.pointerType === "touch") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    if (seal.getAnimations().length || face.getAnimations().length) return;
    face.animate(SPIN, { duration: SPIN_MS, easing: EASE_IN_OUT });
  };

  return (
    <div ref={ref} aria-hidden="true" onPointerEnter={spin} className={`size-[92px] rotate-12 ${className ?? ""}`}>
      <div ref={faceRef} className="pointer-events-none absolute inset-0">
        <img src="/images/faq/wax-seal.svg" alt="" width={108} height={106.76} className="absolute top-[-3.38px] left-[-8px] h-[106.76px] w-[108px] max-w-none" />
        <img src="/images/faq/seal-ring.svg" alt="" width={65} height={65} className="absolute top-[13.5px] left-[13.5px] size-[65px] max-w-none" />
        <span className="absolute inset-x-0 top-[33px] text-center font-heading text-[24px]/[26px] whitespace-nowrap text-[#ffe5b4]">V&amp;R</span>
        <span className="absolute inset-x-0 top-[60px] text-center font-mono text-[9px]/[10px] whitespace-nowrap text-[#ffe5b4]/85">1976</span>
      </div>
    </div>
  );
}

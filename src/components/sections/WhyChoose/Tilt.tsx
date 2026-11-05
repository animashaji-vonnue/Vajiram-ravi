"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** The most the card leans, in degrees, and the depth it leans in. */
const MAX_TILT = 4;
const PERSPECTIVE = 900;

const FLAT = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`;
const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * A gentle 3D tilt toward the pointer (after Unlumen's "Tilt Card"): while a mouse is over the card, the
 * card leans up to 4° so the spot under the pointer sinks away, and on leave it eases back to flat over
 * --dur-base. Only the transform of this inner layer moves; the card element around it (its parent, which
 * ScrollReveal styles) is left alone, and it is the parent that is listened to, so the moving layer never
 * changes what counts as "over the card". Fine pointers only; nothing with reduced motion or on touch.
 */
export default function Tilt({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const card = layer?.parentElement;
    if (!layer || !card || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let hovering = false;
    let x = 0.5;
    let y = 0.5;

    const paint = () => {
      frame = 0;
      layer.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${((0.5 - y) * 2 * MAX_TILT).toFixed(2)}deg) rotateY(${((x - 0.5) * 2 * MAX_TILT).toFixed(2)}deg)`;
    };
    // Both are in screen pixels, so the share needs no canvas-zoom correction.
    const onMove = (event: PointerEvent) => {
      if (!hovering) return;
      const rect = card.getBoundingClientRect();
      x = clamp((event.clientX - rect.left) / rect.width);
      y = clamp((event.clientY - rect.top) / rect.height);
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      hovering = true;
      // A short ease, so the lean follows the pointer smoothly instead of jumping.
      layer.style.transition = "transform var(--dur-fast) var(--ease-out)";
      onMove(event);
    };
    const onLeave = () => {
      if (!hovering) return;
      hovering = false;
      cancelAnimationFrame(frame);
      frame = 0;
      layer.style.transition = "transform var(--dur-base) var(--ease-out)";
      layer.style.transform = FLAT;
    };
    // Back at rest: drop the transform, so the card is exactly as it was.
    const onSettled = (event: TransitionEvent) => {
      if (hovering || event.target !== layer || event.propertyName !== "transform") return;
      layer.style.transition = "";
      layer.style.transform = "";
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    layer.addEventListener("transitionend", onSettled);
    return () => {
      cancelAnimationFrame(frame);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      layer.removeEventListener("transitionend", onSettled);
      layer.style.transition = "";
      layer.style.transform = "";
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

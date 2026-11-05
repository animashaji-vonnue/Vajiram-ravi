"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";

/** Devices that hover with a precise pointer: the only ones that get pointer-following effects. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function hasFinePointer(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(FINE_POINTER).matches;
}

type PointerGlowProps = {
  /** The colour at the glow's centre, with its alpha (e.g. "rgb(244 196 48 / 0.24)"); it fades to clear at the edge. */
  color: string;
  /** The glow's diameter in canvas px. */
  size?: number;
  /** How the glow mixes with the card under it: "multiply" for light paper, "screen" for dark cards. */
  blend?: CSSProperties["mixBlendMode"];
  /** Extra classes for the layer, e.g. a mask in the card's shape. The layer already clips to the card's border radius. */
  className?: string;
  /** Extra styles for the layer, e.g. `clipPath: "path('…')"` for a card that is not a rounded rectangle. */
  style?: CSSProperties;
};

/**
 * A soft gradient circle that follows the pointer inside a card (after Skiper UI's gradient hover card).
 * Drop it inside a `relative` card, before the card's content so the content paints over it: it listens to
 * its parent's pointer events, fades in over --dur-fast while the pointer is on the card and out in 70% of
 * that when it leaves. The position goes to two custom properties in a frame callback, in canvas px, and
 * moves the circle with `translate` only. Decorative: aria-hidden, no pointer events. Fine pointers only;
 * nothing at all on touch or with reduced motion.
 */
export default function PointerGlow({ color, size = 240, blend = "normal", className, style }: PointerGlowProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const card = layer?.parentElement;
    if (!layer || !card || prefersReducedMotion() || !hasFinePointer()) return;
    let frame = 0;
    let x = 0;
    let y = 0;

    // The pointer's place on the card, in canvas px (pointer and rect are in screen px).
    const draw = () => {
      frame = 0;
      const rect = card.getBoundingClientRect();
      const zoom = getCanvasZoom();
      layer.style.setProperty("--glow-x", `${(x - rect.left) / zoom}px`);
      layer.style.setProperty("--glow-y", `${(y - rect.top) / zoom}px`);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;
      // In place before it fades in, so it never slides over from where it last was.
      cancelAnimationFrame(frame);
      draw();
      layer.setAttribute("data-on", "");
    };
    const onLeave = () => layer.removeAttribute("data-on");

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      layer.removeAttribute("data-on");
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute inset-0 overflow-clip rounded-[inherit] opacity-0 [transition:opacity_calc(var(--dur-fast)*0.7)_var(--ease-in)] data-on:opacity-100 data-on:[transition:opacity_var(--dur-fast)_var(--ease-out)] motion-reduce:hidden",
        className,
      )}
      style={{ mixBlendMode: blend, ...style }}
    >
      <span
        className="absolute top-0 left-0 rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(closest-side, ${color}, transparent)`,
          translate: "calc(var(--glow-x, 0px) - 50%) calc(var(--glow-y, 0px) - 50%)",
        }}
      />
    </span>
  );
}

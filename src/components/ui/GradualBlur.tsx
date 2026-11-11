import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";

type Side = "top" | "bottom" | "left" | "right";

type GradualBlurProps = {
  /** The edge the blur gathers towards. */
  side: Side;
  /** The strongest blur, at the edge itself, px (each layer inwards has half the one before). */
  strength?: number;
  /** How many stacked layers: few, as each one is a backdrop filter of its own. */
  layers?: number;
  /** Size, position and anything else for the overlay; it is absolutely placed unless told otherwise. */
  className?: string;
  style?: CSSProperties;
};

const TOWARDS: Record<Side, string> = { top: "to top", bottom: "to bottom", left: "to left", right: "to right" };

/**
 * A stepped, progressive blur at an edge, after React Bits "Gradual Blur": a few layers stacked on the
 * overlay, each a backdrop blur twice as strong as the one before and masked to the stretch nearer the edge
 * than the one before, so the content behind softens by degrees into the edge rather than behind a line.
 * Decoration only: aria-hidden and never in the way of the pointer. It holds no motion of its own; where it
 * should show only at times (the screen's foot, a track's edge with more to come) its owner fades it.
 */
export default function GradualBlur({ side, strength = 6, layers = 4, className, style }: GradualBlurProps) {
  const towards = TOWARDS[side];
  return (
    <div aria-hidden="true" className={cx("pointer-events-none absolute", className)} style={style}>
      {Array.from({ length: layers }, (_, i) => {
        const blur = strength / 2 ** (layers - 1 - i);
        // Each layer starts a step further towards the edge and stays to it, the steps overlapping a little.
        const from = (i / layers) * 100;
        const full = Math.min(100, ((i + 1) / layers) * 100);
        const mask = `linear-gradient(${towards}, transparent ${from.toFixed(1)}%, #000 ${full.toFixed(1)}%)`;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur.toFixed(2)}px)`,
              WebkitBackdropFilter: `blur(${blur.toFixed(2)}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}

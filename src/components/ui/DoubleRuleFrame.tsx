"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/*
 * The band frame of the design (the batches band and the FAQ): a rule, a hairline 6px inside it, and an
 * 18px diamond at each corner, centred on the rule's corner. It is drawn with boxes rather than one picture,
 * so it fits its band at any height. Give it the box the diamonds sit in (e.g. `inset-[19px]`): the rule
 * runs 9px in from that box, under the diamonds' centres.
 *
 * With `draw`, it draws itself once when a fifth of it is on screen: the diamonds pop in, then each side of
 * the rule and of the hairline grows out of its corner, going round clockwise, over 900ms on --ease-in-out.
 * With reduced motion, or when it is already on screen at load, it is simply there. Decoration only.
 */

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
const DIAMOND_MS = 320;
const DRAW_MS = 900;

/** The rule's and the hairline's distance in from the frame's box, and their thickness. */
const RULE = { inset: 8.4, weight: 1.2 };
const HAIRLINE = { inset: 14.5, weight: 1 };

type Side = { style: CSSProperties; origin: string; axis: "x" | "y" };

/** The four sides of a rule at `inset` from the box, each growing from the corner it starts at, clockwise. */
function sides(inset: number, weight: number): Side[] {
  return [
    { style: { top: inset, left: inset, right: inset, height: weight }, origin: "left", axis: "x" },
    { style: { top: inset, right: inset, bottom: inset, width: weight }, origin: "top", axis: "y" },
    { style: { bottom: inset, left: inset, right: inset, height: weight }, origin: "right", axis: "x" },
    { style: { top: inset, left: inset, bottom: inset, width: weight }, origin: "bottom", axis: "y" },
  ];
}

const CORNERS = ["top-0 left-0", "top-0 right-0", "right-0 bottom-0", "bottom-0 left-0"];

type DoubleRuleFrameProps = {
  /** The rule's colour; the hairline is the same colour at 60%. */
  colour: string;
  /** The box the corner diamonds sit in, positioned in its band (e.g. "absolute inset-[19px]"). */
  className?: string;
  /** Draw it in when it comes into view. */
  draw?: boolean;
};

export default function DoubleRuleFrame({ colour, className, draw = false }: DoubleRuleFrameProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !draw || prefersReducedMotion() || typeof root.animate !== "function") return;
    const box = root.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.85 && box.bottom > 0) return;

    const diamonds = Array.from(root.querySelectorAll<SVGElement>("[data-frame-diamond]"));
    const lines = Array.from(root.querySelectorAll<HTMLElement>("[data-frame-side]"));
    const animations: Animation[] = [
      ...diamonds.map((diamond) =>
        diamond.animate([{ transform: "scale(0) rotate(-90deg)", opacity: 0 }, { transform: "none", opacity: 1 }], {
          duration: DIAMOND_MS,
          easing: EASE_OUT,
          fill: "backwards",
        }),
      ),
      ...lines.map((line) => {
        const axis = line.dataset.frameSide === "x" ? "scaleX" : "scaleY";
        return line.animate([{ transform: `${axis}(0)` }, { transform: "none" }], {
          duration: DRAW_MS,
          delay: DIAMOND_MS * 0.6,
          easing: EASE_IN_OUT,
          fill: "backwards",
        });
      }),
    ];
    animations.forEach((animation) => animation.pause());
    const cancel = whenVisible(root, 0.2, () => animations.forEach((animation) => animation.play()));
    return () => {
      cancel();
      animations.forEach((animation) => animation.cancel());
    };
  }, [draw]);

  return (
    <div ref={ref} aria-hidden="true" className={cx("pointer-events-none", className)}>
      {[...sides(RULE.inset, RULE.weight), ...sides(HAIRLINE.inset, HAIRLINE.weight)].map((side, i) => (
        <span
          key={i}
          data-frame-side={side.axis}
          className="absolute"
          style={{ ...side.style, background: colour, opacity: i < 4 ? 1 : 0.6, transformOrigin: side.origin }}
        />
      ))}
      {CORNERS.map((corner) => (
        <svg key={corner} data-frame-diamond viewBox="0 0 18 18" width={18} height={18} className={`absolute ${corner}`}>
          <path d="M9 0L18 9L9 18L0 9Z" fill={colour} />
        </svg>
      ))}
    </div>
  );
}

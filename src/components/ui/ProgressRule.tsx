import type { ComponentProps, Ref } from "react";
import { cx } from "@/lib/cx";

/*
 * A carousel's progress line, drawn as an ornamented rule in the page's own vocabulary (the eyebrows'
 * rules and diamonds, the block-print butta): a fine burnt hairline between two small diamonds, and over
 * it a saffron-to-burnt rule that fills from the left to the share seen so far, its leading end marked by
 * a butta flower. Used under the toppers and the faculty carousels.
 *
 * The carousel moves it with `setProgress`, as transforms only: the rule scales from the left and the
 * flower slides with its end, on the same --dur-base / --ease-in-out transition as the track, or at once
 * while a drag follows the pointer. 14px tall (the flower's height), the rule on its middle line.
 * Decoration only: hidden from assistive technology, which hears the carousel's own announcements.
 */

/** How far the rule's ends stand in from the diamonds at the line's ends, px. */
const INSET = 16;

type ProgressRuleProps = Omit<ComponentProps<"div">, "ref" | "children"> & {
  /** The share seen so far at first render, 0 to 1. */
  progress: number;
  rootRef?: Ref<HTMLDivElement>;
};

/** Moves the rule of a ProgressRule to `progress` (0 to 1), animated or at once. */
export function setProgress(root: HTMLElement, progress: number, animate: boolean) {
  const transition = animate ? "transform var(--dur-base) var(--ease-in-out)" : "none";
  for (const [selector, transform] of [
    ["[data-progress-fill]", fillTransform(progress)],
    ["[data-progress-head]", headTransform(progress)],
  ] as const) {
    const el = root.querySelector<HTMLElement>(selector);
    if (!el) continue;
    el.style.transition = transition;
    el.style.transform = transform;
  }
}

const fillTransform = (progress: number) => `scaleX(${progress})`;
// The flower's layer spans the rule, so moving it back by (1 − progress) of its width puts its right edge,
// where the flower sits, at the end of the fill.
const headTransform = (progress: number) => `translateX(${(progress - 1) * 100}%)`;

export default function ProgressRule({ progress, rootRef, className, ...props }: ProgressRuleProps) {
  return (
    <div {...props} ref={rootRef} aria-hidden="true" className={cx("relative h-3.5", className)}>
      <span className="absolute top-1/2 h-px -translate-y-1/2 bg-burnt/22" style={{ left: INSET / 2, right: INSET / 2 }} />
      {["left-0", "right-0"].map((side) => (
        <svg key={side} viewBox="0 0 8 8" width={8} height={8} className={`absolute top-[3px] ${side}`}>
          <path d="M4 0L8 4L4 8L0 4Z" fill="#cc5500" fillOpacity={0.45} />
        </svg>
      ))}
      <span
        data-progress-fill
        className="absolute top-1/2 h-0.5 origin-left -translate-y-1/2 rounded-full bg-linear-to-r from-saffron to-burnt"
        style={{ left: INSET, right: INSET, transform: fillTransform(progress) }}
      />
      <span data-progress-head className="absolute inset-y-0" style={{ left: INSET, right: INSET, transform: headTransform(progress) }}>
        <img src="/images/ornaments/butta.svg" alt="" width={14} height={14} className="absolute top-0 -right-[7px] size-3.5 max-w-none" />
      </span>
    </div>
  );
}

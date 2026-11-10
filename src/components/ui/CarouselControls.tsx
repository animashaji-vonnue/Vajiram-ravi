"use client";

import type { RefObject } from "react";
import Icon from "@/components/ui/Icon";
import { cx } from "@/lib/cx";

/*
 * Carousel arrows and dots (motion spec, "Carousel arrows + dots").
 *   - Arrow: hover fills it ink and turns the icon cream (--dur-fast); pressing scales it to 0.96. An
 *     arrow with nothing further to go hides (opacity 0, out of the tab order) but keeps its place.
 *   - Dots: the active dot stretches from 8px to 24px wide over --dur-base. An autoplaying carousel can
 *     show its progress inside the active dot through `fillRef`.
 */

type CarouselArrowProps = {
  direction: "prev" | "next";
  onClick: () => void;
  /** E.g. "Next toppers", "Previous batches". */
  label: string;
  /** Nothing further this way: hide without removing. */
  hidden?: boolean;
  /** Nothing further this way, but stay in view, dimmed (for a carousel whose arrows always show). */
  disabled?: boolean;
  /** "light": white with a hairline; "solid": filled ink, as the design's "next" arrows. */
  tone?: "light" | "solid";
  /** "circle" or the toppers' rounded "square". */
  shape?: "circle" | "square";
  /** Box size in px (40 or 44 in the design). */
  size?: number;
  className?: string;
};

export function CarouselArrow({ direction, onClick, label, hidden = false, disabled = false, tone = "light", shape = "circle", size = 44, className }: CarouselArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      style={{ width: size, height: size }}
      className={cx(
        "flex shrink-0 cursor-pointer items-center justify-center [transition:background-color_var(--dur-fast)_var(--ease-out),color_var(--dur-fast)_var(--ease-out),border-color_var(--dur-fast)_var(--ease-out),opacity_var(--dur-fast)_var(--ease-out),scale_80ms_var(--ease-out)] hover:bg-ink hover:text-cream active:scale-[.96]",
        shape === "circle" ? "rounded-full" : "rounded-lg",
        tone === "light" ? "border border-ink/15 bg-white text-ink hover:border-ink" : "bg-ink text-cream",
        hidden && "pointer-events-none opacity-0",
        disabled && "cursor-default opacity-35 hover:bg-white hover:text-ink",
        disabled && tone === "light" && "hover:border-ink/15",
        className,
      )}
    >
      <Icon name={direction === "prev" ? "arrow-l" : "arrow-r"} />
    </button>
  );
}

type CarouselDotsProps = {
  count: number;
  active: number;
  onSelect: (index: number) => void;
  /** Accessible name of the dot group, e.g. "Choose story". */
  label: string;
  /** What one item is called: "Story" reads "Story 3 of 10". */
  itemName: string;
  /** Colours of the active and idle dots. */
  tone?: "light" | "dark";
  /** Autoplay progress: a fill inside the active dot that the carousel's clock scales from 0 to 1. */
  fillRef?: RefObject<HTMLSpanElement | null>;
  className?: string;
};

export function CarouselDots({ count, active, onSelect, label, itemName, tone = "light", fillRef, className }: CarouselDotsProps) {
  return (
    <div role="group" aria-label={label} className={cx("flex items-center gap-2", className)}>
      {Array.from({ length: count }, (_, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            type="button"
            aria-label={`${itemName} ${i + 1} of ${count}`}
            aria-current={isActive || undefined}
            onClick={() => onSelect(i)}
            className={cx(
              "relative h-2 cursor-pointer overflow-hidden rounded-full [transition:width_var(--dur-base)_var(--ease-in-out),background-color_var(--dur-fast)_var(--ease-out)] after:absolute after:-inset-2",
              isActive ? "w-6" : "w-2",
              tone === "light"
                ? isActive
                  ? fillRef
                    ? "bg-burnt/25"
                    : "bg-burnt"
                  : "bg-clay/30 hover:bg-clay/60"
                : isActive
                  ? fillRef
                    ? "bg-cream/30"
                    : "bg-saffron"
                  : "bg-cream/35 hover:bg-cream/60",
            )}
          >
            {isActive && fillRef && (
              <span
                ref={fillRef}
                aria-hidden="true"
                className={cx("absolute inset-0 origin-left rounded-full", tone === "light" ? "bg-burnt" : "bg-saffron")}
                // Starts empty; the clock sets the fill (not a scale class, which would multiply with it).
                style={{ transform: "scaleX(0)" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

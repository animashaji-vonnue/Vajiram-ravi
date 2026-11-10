"use client";

import { useRef, type KeyboardEvent } from "react";
import { cx } from "@/lib/cx";

/** One year's step on the ruler. */
const ROW = 30;

type YearRulerProps = {
  /** Latest first, top to bottom. */
  years: number[];
  value: number;
  onChange: (year: number) => void;
  /** The tab list's accessible name. */
  label: string;
  /** Prefix for the tab ids and the panel's id (`${idPrefix}-panel`, rendered by the caller). */
  idPrefix: string;
};

/**
 * The year ruler (Figma 2392:5050): the years down a measuring rule, latest at the top, 30px apart, with a
 * fine graduation every 5px and a longer mark at each year. The chosen year is set larger in ink
 * SemiBold and carries the orange mark, which slides to the next year chosen (--dur-base, ease-in-out);
 * the others are clay, turning burnt on hover. (The design's chosen year is orange text; its mark keeps
 * the orange here, and the figure is in ink so it reads at AA.)
 *
 * A vertical WAI-ARIA tab list: one tab stop, the arrow keys (up and down, or left and right) and Home / End
 * move and choose, wrapping at the ends; each tab controls `${idPrefix}-panel`.
 */
export default function YearRuler({ years, value, onChange, label, idPrefix }: YearRulerProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const index = Math.max(0, years.indexOf(value));

  const select = (next: number) => {
    const i = (next + years.length) % years.length;
    onChange(years[i]);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const key = event.key;
    const next =
      key === "ArrowDown" || key === "ArrowRight"
        ? index + 1
        : key === "ArrowUp" || key === "ArrowLeft"
          ? index - 1
          : key === "Home"
            ? 0
            : key === "End"
              ? years.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    select(next);
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      aria-orientation="vertical"
      onKeyDown={onKeyDown}
      className="relative w-28 shrink-0"
      style={{ height: years.length * ROW }}
    >
      {/* The fine graduation, every 5px down the whole rule. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[62px] w-[29px] bg-[repeating-linear-gradient(to_bottom,#eadbc4_0_1px,transparent_1px_5px)]"
      />
      {/* The chosen year's mark, sliding from year to year. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-[43px] h-0.5 w-[69px] bg-linear-to-r from-orange to-orange/0 [transition:transform_var(--dur-base)_var(--ease-in-out)]"
        style={{ transform: `translateY(${index * ROW + ROW / 2 - 1}px)` }}
      />
      {years.map((year, i) => {
        const active = i === index;
        return (
          <button
            key={year}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${year}`}
            aria-selected={active}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(year)}
            className="group/year relative flex w-full cursor-pointer items-center pl-[7px] text-left"
            style={{ height: ROW }}
          >
            <span
              className={cx(
                "origin-left text-[15px]/[22px] whitespace-nowrap [transition:scale_var(--dur-base)_var(--ease-out),color_var(--dur-fast)_var(--ease-out)]",
                active ? "font-semibold text-ink" : "scale-80 font-medium text-clay group-hover/year:text-burnt",
              )}
            >
              {year}
            </span>
            {/* The year's own mark on the rule. */}
            <span
              aria-hidden="true"
              className={cx(
                "pointer-events-none absolute top-1/2 left-[43px] h-px w-[50px] bg-linear-to-r to-transparent [transition:opacity_var(--dur-fast)_var(--ease-out)]",
                active ? "opacity-0" : "from-clay/45 group-hover/year:from-burnt",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "@/lib/cx";

/*
 * The site's tabs: a segmented control. The labels sit in a rounded cream track with a hairline border,
 * and a burnt pill sits under the chosen one (it once was a rule with a diamond under the label; the client
 * asked for a clearer mark). Used by the batches (mode and month) and the locations.
 *   - The chosen label is white SemiBold on the pill; the others clay Medium, turning ink over a faint
 *     wash on hover.
 *   - Choosing a tab slides the pill from the old tab to the new one and resizes it to the label (left and
 *     width, --dur-base, --ease-in-out). Reduced motion: it simply moves.
 *   - WAI-ARIA tabs: one tab stop; the arrow keys (and Home / End) move and select; aria-selected and
 *     aria-controls point at the panel `${idPrefix}-panel`, which the caller renders with
 *     role="tabpanel" and aria-labelledby `${idPrefix}-tab-${value}`. Focus shows the saffron ring.
 * The content below should cross-fade over 200ms: see CrossFade.
 */

export type TabItem = { id: string; label: ReactNode };

type TraditionalTabsProps = {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** Accessible name of the tab list, e.g. "Programme stages". */
  label: string;
  /** Prefix for the tab and panel ids. */
  idPrefix: string;
  className?: string;
};

export default function TraditionalTabs({ tabs, value, onChange, label, idPrefix, className }: TraditionalTabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);
  // The pill only slides once it has been placed, so it does not fly in from the left on load.
  const [placed, setPlaced] = useState(false);
  const index = Math.max(0, tabs.findIndex((tab) => tab.id === value));

  useLayoutEffect(() => {
    const tab = tabRefs.current[index];
    if (!tab) return;
    setThumb({ left: tab.offsetLeft, width: tab.offsetWidth });
    if (!placed) requestAnimationFrame(() => setPlaced(true));
  }, [index, placed, tabs]);

  const select = (next: number) => {
    const i = (next + tabs.length) % tabs.length;
    onChange(tabs[i].id);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next =
      event.key === "ArrowRight" ? index + 1 : event.key === "ArrowLeft" ? index - 1 : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    select(next);
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cx("relative inline-flex w-fit items-center gap-1 rounded-full border border-[#eadbc4] bg-[#fbf3e6] p-1", className)}
    >
      {thumb && (
        <span
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-burnt shadow-[0_4px_10px_-4px_rgb(204_85_0/0.6)]",
            placed && "[transition:translate_var(--dur-base)_var(--ease-in-out),width_var(--dur-base)_var(--ease-in-out)] motion-reduce:transition-none",
          )}
          style={{ translate: `${thumb.left}px 0`, width: thumb.width }}
        />
      )}
      {tabs.map((tab, i) => {
        const active = i === index;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cx(
              "relative h-9 shrink-0 cursor-pointer rounded-full px-4 text-[15px]/[22px] whitespace-nowrap [transition:color_var(--dur-fast)_var(--ease-out),background-color_var(--dur-fast)_var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron",
              active ? "font-semibold text-white" : "font-medium text-clay hover:bg-burnt/8 hover:text-ink",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

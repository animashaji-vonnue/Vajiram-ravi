"use client";

import { Fragment, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "@/lib/cx";

/*
 * Traditional tabs (motion spec; Figma "Programme stages – tabs", 2267:5914): labels with small diamond
 * separators and a rule-diamond-rule indicator under the active one. Used by Programmes, Batches (mode and
 * month), the newspaper editions and the locations.
 *   - The active label is burnt SemiBold; the others clay Medium, turning burnt on hover with their own
 *     indicator faded in at 40%.
 *   - Choosing a tab slides the indicator from the old tab to the new one (translateX, --dur-base,
 *     --ease-in-out).
 *   - WAI-ARIA tabs: one tab stop; the arrow keys (and Home / End) move and select; aria-selected and
 *     aria-controls point at the panel `${idPrefix}-panel`, which the caller renders with
 *     role="tabpanel" and aria-labelledby `${idPrefix}-tab-${value}`.
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

const INDICATOR = "/images/ornaments/tab-indicator.svg";

export default function TraditionalTabs({ tabs, value, onChange, label, idPrefix, className }: TraditionalTabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [x, setX] = useState<number | null>(null);
  // The indicator only slides once it has been placed, so it does not fly in from the left on load.
  const [placed, setPlaced] = useState(false);
  const index = Math.max(0, tabs.findIndex((tab) => tab.id === value));

  useLayoutEffect(() => {
    const tab = tabRefs.current[index];
    if (!tab) return;
    setX(tab.offsetLeft + tab.offsetWidth / 2 - 18);
    if (!placed) requestAnimationFrame(() => setPlaced(true));
  }, [index, placed, tabs]);

  const select = (next: number) => {
    const tab = tabs[(next + tabs.length) % tabs.length];
    onChange(tab.id);
    tabRefs.current[(next + tabs.length) % tabs.length]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next =
      event.key === "ArrowRight" ? index + 1 : event.key === "ArrowLeft" ? index - 1 : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    select(next);
  };

  return (
    <div role="tablist" aria-label={label} onKeyDown={onKeyDown} className={cx("relative flex items-start gap-3.5", className)}>
      {tabs.map((tab, i) => {
        const active = i === index;
        return (
          <Fragment key={tab.id}>
            {i > 0 && <img src="/images/ornaments/tab-sep.svg" alt="" aria-hidden="true" width={8} height={22} className="h-[22px] w-2 shrink-0" />}
            <button
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
              className="group/tab flex shrink-0 cursor-pointer flex-col items-center gap-1.5 outline-offset-4"
            >
              <span className="flex items-start gap-[5px] whitespace-nowrap">
                <span
                  className={cx(
                    "text-[15px]/[22px] [transition:color_var(--dur-instant)_var(--ease-out)]",
                    active ? "font-semibold text-burnt" : "font-medium text-clay group-hover/tab:text-burnt",
                  )}
                >
                  {tab.label}
                </span>
              </span>
              {/* Each tab's own indicator only shows, faintly, on hover; the active one slides below. */}
              <img
                src={INDICATOR}
                alt=""
                aria-hidden="true"
                width={36}
                height={8}
                className={cx(
                  "h-2 w-9 opacity-0 [transition:opacity_var(--dur-fast)_var(--ease-out)]",
                  !active && "group-hover/tab:opacity-40",
                )}
              />
            </button>
          </Fragment>
        );
      })}
      {x !== null && (
        <img
          src={INDICATOR}
          alt=""
          aria-hidden="true"
          width={36}
          height={8}
          className={cx("pointer-events-none absolute bottom-0 left-0 h-2 w-9", placed && "[transition:translate_var(--dur-base)_var(--ease-in-out)]")}
          style={{ translate: `${x}px 0` }}
        />
      )}
    </div>
  );
}

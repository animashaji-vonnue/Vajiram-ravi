import type { FaqEntry } from "@/data/faq-chat";
import { cx } from "@/lib/cx";

/*
 * The questions, each between hairlines, with its number in the margin. Motion spec
 * (Shared components, "Accordion toggle", and 11 FAQ):
 *   - The whole row (numeral, question and toggle) is the button, so the focus ring wraps all of it.
 *   - Hover: the toggle's border turns burnt and its plus thickens.
 *   - Hover (a closed row): a faint tint of the open panel shows behind it.
 *   - Opening (feedback item 40, so an open question reads as open): a warm tinted panel fades in behind
 *     the row with a burnt accent bar drawing down its left edge; the question turns semibold and ink; the
 *     answer's height goes 0fr → 1fr (--dur-base, --ease-in-out) and its text fades in 120ms later; the
 *     plus's upright bar turns down onto the crossbar, leaving a minus, while the circle fills dark; the
 *     numeral turns burnt. Closing plays back at 70% of the time.
 * One row is open at a time. Closed answers stay in the HTML (collapsed and inert), so every answer is
 * crawlable.
 */


type FaqAccordionProps = {
  entries: FaqEntry[];
  /** The open question, or null when all are closed. */
  open: number | null;
  onToggle: (index: number) => void;
};

export default function FaqAccordion({ entries, open, onToggle }: FaqAccordionProps) {
  return entries.map((entry, i) => {
    const expanded = i === open;
    return (
      // The open row drops its rule, and so does the row after it (the list's foot rule, after the last), so
      // the open panel stands clear of lines above and below.
      <div
        key={entry.question}
        className={cx(
          "group/row relative w-[788px] shrink-0 border-t py-5 [transition:border-color_var(--dur-base)_var(--ease-in-out)]",
          expanded || i - 1 === open ? "border-transparent" : "border-[rgb(94_23_16/0.25)]",
        )}
      >
        {/* The open panel: a tint from the numeral's margin to past the toggle, its accent bar at the left. */}
        <span
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute inset-y-1.5 -right-6 -left-[60px] rounded-[16px] bg-[#f8e6cc] motion-reduce:transition-none",
            expanded
              ? "opacity-100 [transition:opacity_var(--dur-base)_var(--ease-in-out)]"
              : "opacity-0 [transition:opacity_calc(var(--dur-base)*0.7)_var(--ease-in-out)] group-hover/row:opacity-40",
          )}
        >
          <span
            className={cx(
              "absolute inset-y-4 left-0 w-[3px] origin-top rounded-full bg-burnt motion-reduce:transition-none",
              expanded ? "scale-y-100 [transition:scale_var(--dur-base)_var(--ease-out)_var(--dur-instant)]" : "scale-y-0 [transition:scale_var(--dur-fast)_var(--ease-in)]",
            )}
          />
        </span>
        <h3 className="relative">
          <button
            type="button"
            id={`faq-q-${i}`}
            aria-expanded={expanded}
            aria-controls={`faq-a-${i}`}
            onClick={() => onToggle(i)}
            className="group/q relative -ml-[34px] flex w-[calc(100%+34px)] cursor-pointer items-center justify-between pl-[34px] text-left [transition:scale_80ms_var(--ease-out)] pointer-coarse:active:scale-[.98]"
          >
            <span
              aria-hidden="true"
              className={cx(
                "absolute top-1 left-0 font-heading text-[20px]/[24px] whitespace-nowrap tabular-nums [transition:color_var(--dur-base)_var(--ease-in-out)]",
                expanded ? "text-burnt" : "text-burnt/55",
              )}
            >
              {`${i + 1}.`}
            </span>
            <span
              className={cx(
                "w-[700px] font-heading text-[21px]/[normal] [transition:color_var(--dur-base)_var(--ease-in-out)]",
                expanded ? "font-semibold text-ink" : "font-normal text-[#2a140c]",
              )}
            >
              {entry.question}
            </span>
            <Toggle expanded={expanded} />
          </button>
        </h3>
        <div
          id={`faq-a-${i}`}
          role="region"
          aria-labelledby={`faq-q-${i}`}
          inert={!expanded}
          className={cx(
            "relative grid motion-reduce:transition-none",
            expanded
              ? "grid-rows-[1fr] [transition:grid-template-rows_var(--dur-base)_var(--ease-in-out)]"
              : "grid-rows-[0fr] [transition:grid-template-rows_calc(var(--dur-base)*0.7)_var(--ease-in-out)]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <p
              className={cx(
                "w-[700px] pt-3 pb-1 text-[16px]/[1.6] text-clay motion-reduce:transition-none",
                expanded
                  ? "opacity-100 [transition:opacity_var(--dur-fast)_var(--ease-out)_var(--dur-instant)]"
                  : "opacity-0 [transition:opacity_calc(var(--dur-fast)*0.7)_var(--ease-in)]",
              )}
            >
              {entry.answer}
            </p>
          </div>
        </div>
      </div>
    );
  });
}

/**
 * The 30px toggle. Closed: paper with a burnt hairline and a burnt plus. Open: filled maroon with a
 * cream minus. The plus is drawn here from the design's icon so its bar can turn and its line thicken.
 */
function Toggle({ expanded }: { expanded: boolean }) {
  const stroke = cx(
    "[transition:rotate_var(--dur-base)_var(--ease-in-out),stroke-width_var(--dur-fast)_var(--ease-out)]",
    expanded ? "[stroke-width:1.6]" : "[stroke-width:1.8] group-hover/q:[stroke-width:2.4]",
  );
  return (
    <span
      aria-hidden="true"
      className={cx(
        "flex size-[30px] shrink-0 items-center justify-center rounded-full border [transition:background-color_var(--dur-base)_var(--ease-in-out),border-color_var(--dur-fast)_var(--ease-out),color_var(--dur-base)_var(--ease-in-out)]",
        expanded ? "border-[#5e1710] bg-[#5e1710] text-[#fff1dc]" : "border-burnt/70 bg-paper text-burnt group-hover/q:border-burnt",
      )}
    >
      <svg viewBox="0 0 14 14" width={14} height={14} fill="none" className="overflow-visible">
        <path d="M2 7H12" stroke="currentColor" strokeLinecap="round" className={stroke} />
        <path
          d="M7 2V12"
          stroke="currentColor"
          strokeLinecap="round"
          className={cx(stroke, "origin-center [transform-box:fill-box]", expanded && "rotate-90")}
        />
      </svg>
    </span>
  );
}

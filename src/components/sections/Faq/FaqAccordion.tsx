import type { FaqEntry } from "@/data/faq-chat";
import { cx } from "@/lib/cx";

/*
 * The questions, each between hairlines, with its roman numeral in the margin. Motion spec
 * (Shared components, "Accordion toggle", and 11 FAQ):
 *   - The whole row (numeral, question and toggle) is the button, so the focus ring wraps all of it.
 *   - Hover: the toggle's border turns burnt and its plus thickens.
 *   - Opening: the answer's height goes 0fr → 1fr (--dur-base, --ease-in-out) and its text fades in
 *     120ms later; the plus's upright bar turns down onto the crossbar, leaving a minus, while the circle
 *     fills dark; the numeral turns burnt. Closing plays back at 70% of the time.
 * One row is open at a time. Closed answers stay in the HTML (collapsed and inert), so every answer is
 * crawlable.
 */

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

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
      <div key={entry.question} data-reveal="sm" className="relative w-[788px] shrink-0 border-t border-[rgb(94_23_16/0.25)] py-4">
        <h3>
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
                "absolute top-1 left-0 font-heading text-[20px]/[24px] whitespace-nowrap italic [transition:color_var(--dur-base)_var(--ease-in-out)]",
                expanded ? "text-burnt" : "text-burnt/55",
              )}
            >
              {`${ROMAN[i] ?? i + 1}.`}
            </span>
            <span className="w-[700px] font-heading text-[21px]/[normal] text-[#2a140c]">{entry.question}</span>
            <Toggle expanded={expanded} />
          </button>
        </h3>
        <div
          id={`faq-a-${i}`}
          role="region"
          aria-labelledby={`faq-q-${i}`}
          inert={!expanded}
          className={cx(
            "grid motion-reduce:transition-none",
            expanded
              ? "grid-rows-[1fr] [transition:grid-template-rows_var(--dur-base)_var(--ease-in-out)]"
              : "grid-rows-[0fr] [transition:grid-template-rows_calc(var(--dur-base)*0.7)_var(--ease-in-out)]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <p
              className={cx(
                "w-[700px] pt-2 text-[15px]/[1.6] text-[#7a5e4c] motion-reduce:transition-none",
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
 * The 30px toggle. Closed: cream with a burnt hairline and a burnt plus. Open: filled maroon with a
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
        expanded ? "border-[#5e1710] bg-[#5e1710] text-[#fff1dc]" : "border-burnt/70 bg-cream text-burnt group-hover/q:border-burnt",
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

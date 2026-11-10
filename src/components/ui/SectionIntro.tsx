import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/** A section's small label: capitals with a rule before them, saffron on paper and pale gold on the orange. */
export function Eyebrow({
  children,
  className,
  rule = "bg-saffron-500",
}: {
  children: ReactNode;
  className?: string;
  rule?: string;
}) {
  return (
    <p
      className={cx("flex items-center gap-3 text-[13px]/[18px] font-semibold tracking-[0.16em] uppercase", className)}
    >
      <span aria-hidden="true" className={cx("h-px w-8", rule)} />
      {children}
    </p>
  );
}

/**
 * The opening of a section, set as on an editorial page: the label, the headline in the serif (its last sentence in
 * italic, the way mastersunion.org leans on one word), and beside it, the description with the supporting statement
 * under a fine rule. `tone` sets the colours for paper and white, or for the orange ground (`ember`).
 */
export default function SectionIntro({
  id,
  eyebrow,
  headline,
  description,
  statement,
  tone = "paper",
  className,
}: {
  id: string;
  eyebrow: string;
  headline: string;
  description?: string;
  statement?: string;
  tone?: "paper" | "ember";
  className?: string;
}) {
  // The last sentence of the headline is set in italic; in a one-sentence headline, what follows its last comma.
  // A one-sentence headline with no comma stays upright.
  const parts = headline.match(/[^.?!]+[.?!]?\s*/g) ?? [headline];
  const comma = headline.lastIndexOf(", ");
  const [lead, accent] =
    parts.length > 1
      ? [parts.slice(0, -1).join(""), parts[parts.length - 1]]
      : comma > 0
        ? [headline.slice(0, comma + 2), headline.slice(comma + 2)]
        : [headline, ""];
  const ember = tone === "ember";

  return (
    <div
      className={cx("fade-up", (description || statement) && "grid grid-cols-[1fr_440px] items-end gap-20", className)}
    >
      <div>
        <Eyebrow className={ember ? "text-white" : "text-muted"} rule={ember ? "bg-glow" : undefined}>
          {eyebrow}
        </Eyebrow>
        <h2
          id={id}
          className={cx(
            "mt-6 font-serif text-[64px]/[1.02] tracking-[-0.015em] text-balance",
            ember ? "text-white" : "text-ink-900",
          )}
        >
          {lead}
          <em className={cx("italic", ember ? "text-glow" : "text-saffron-600")}>{accent}</em>
        </h2>
      </div>
      {(description || statement) && (
        <div className="pb-2">
          {description && (
            <p className={cx("text-[18px]/[29px]", ember ? "text-white/95" : "text-muted")}>{description}</p>
          )}
          {statement && (
            <p
              className={cx(
                "mt-6 border-t pt-5 font-serif text-[22px]/[1.3] italic",
                ember ? "border-white/30 text-white" : "border-line text-ink-900",
              )}
            >
              {statement}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

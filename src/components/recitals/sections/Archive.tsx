"use client";

import { useMemo, useState } from "react";
import { FlowerMark, patternStyle, SeamBand } from "@/components/recitals/Ornaments";
import { IssueCard, SectionHead } from "@/components/recitals/Parts";
import { Stagger, StaggerItem } from "@/components/recitals/Motion";
import { issues, issueYears, latestIssue } from "@/data/magazine";
import { cx } from "@/lib/cx";

/*
 * Every issue, by year.
 *
 * The UX problem is that 89 covers on one page is a wall, and a "show more" button turns
 * finding March 2024 into eight clicks. A year is the unit people actually think in, so the
 * year rail is the primary control: one click reaches any issue, and no view is ever longer
 * than twelve cards. The search is there for anyone who already knows the month they want,
 * and it looks across every year at once.
 */
export default function Archive() {
  const [year, setYear] = useState(issueYears[0]);
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 0;
  const shown = useMemo(() => {
    if (searching) {
      const q = query.trim().toLowerCase();
      return issues.filter((issue) => issue.label.toLowerCase().includes(q));
    }
    return issues.filter((issue) => issue.year === year);
  }, [query, searching, year]);

  return (
    <section id="archive" className="relative bg-r-cream" aria-labelledby="archive-h">
      <div className="pointer-events-none absolute inset-0" style={patternStyle("block", "#a8341a", 0.045)} aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-20 py-24">
        <SectionHead
          id="archive-h"
          eyebrow="The library"
          title="Every issue since May 2019"
          lead={`${issues.length} issues, newest first. Read online or download the PDF. No sign-in, no email.`}
        />

        {/* Controls ---------------------------------------------------------------- */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <label className="flex h-12 flex-1 items-center gap-3 bg-r-paper px-4 shadow-[inset_0_0_0_1px_var(--color-r-line)] focus-within:shadow-[inset_0_0_0_1px_var(--color-r-rust)]">
              <FlowerMark size={12} className="shrink-0 text-r-amber" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by month or year — e.g. March 2026"
                aria-label="Search issues by month or year"
                className="w-full bg-transparent font-sans text-[15px]/[21px] font-medium text-r-ink placeholder:text-r-ink-500 focus:outline-none"
              />
            </label>
            <p className="shrink-0 font-sans text-[14px]/[20px] font-medium text-r-ink-500 tabular-nums">
              {shown.length} {shown.length === 1 ? "issue" : "issues"}
              {searching ? " found" : ` in ${year}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Choose a year">
            {issueYears.map((option) => {
              const active = !searching && option === year;
              return (
                <button
                  key={option}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setQuery("");
                    setYear(option);
                  }}
                  className={cx(
                    "h-10 px-4 font-sans text-[15px]/[20px] font-semibold tabular-nums transition-colors duration-200",
                    active
                      ? "bg-[#e2650d] text-white"
                      : "bg-r-paper text-r-ink-700 shadow-[inset_0_0_0_1px_var(--color-r-line)] hover:text-r-rust hover:shadow-[inset_0_0_0_1px_var(--color-r-rust)]",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid -------------------------------------------------------------------- */}
        {shown.length > 0 ? (
          <Stagger key={searching ? `q:${query}` : `y:${year}`} className="grid grid-cols-4 gap-6" gap={0.05}>
            {shown.map((issue) => (
              <StaggerItem key={issue.label}>
                <IssueCard issue={issue} latest={issue.label === latestIssue.label} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="py-16 text-center font-sans text-[16px]/[24px] font-medium text-r-ink-500">
            Nothing matches “{query}”. Try a month, a year, or both.
          </p>
        )}
      </div>

      <SeamBand variant="perf" from="#fff3e0" to="#fffcf6" accent="#f58025" />
    </section>
  );
}

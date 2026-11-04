"use client";

import { useState } from "react";
import { DownloadIcon } from "@/components/icons";
import { Eyebrow, Lead, SectionTitle } from "@/components/ui/Typography";
import { issues, issueYears, latestIssue, type Issue } from "@/data/magazine";
import { cx } from "@/lib/cx";
import Cover from "./Cover";

function IssueCard({ issue }: { issue: Issue }) {
  const latest = issue === latestIssue;
  return (
    <a
      href={issue.pdf}
      className="group/issue flex flex-col gap-3.5 rounded-2xl p-2.5 [transition:background-color_.3s,translate_.35s_var(--ease-smooth)] hover:-translate-y-1 hover:bg-neutral-50"
      aria-label={`Download the ${issue.label} issue (PDF)`}
    >
      <span className="relative block">
        <Cover
          issue={issue}
          className="w-full shadow-[0_18px_30px_-18px_rgba(28,25,23,.35)] transition-shadow duration-350 ease-smooth group-hover/issue:shadow-[0_26px_36px_-18px_rgba(28,25,23,.45)]"
        />
        {latest && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-neutral-900 px-2.5 py-1 font-display text-[11px]/[14px] font-semibold tracking-[.04em] text-white uppercase">
            Latest
          </span>
        )}
      </span>
      <span className="flex items-center justify-between gap-2 px-1">
        <span className="flex flex-col gap-0.5">
          <span className="font-display text-[16px]/[22px] font-semibold text-neutral-900">{issue.month}</span>
          <span className="font-sans text-[13px]/[18px] font-medium text-neutral-500">{issue.year} · PDF</span>
        </span>
        <span className="flex size-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors duration-300 group-hover/issue:bg-brand-500 group-hover/issue:text-white">
          <DownloadIcon />
        </span>
      </span>
    </a>
  );
}

/** Every issue as a cover to download, one year at a time. */
export default function IssueArchive() {
  const [year, setYear] = useState(issueYears[0]);
  const shown = issues.filter((issue) => issue.year === year);

  return (
    <section id="issues" aria-labelledby="arc-h">
      <div className="relative mx-auto flex w-canvas flex-col gap-10 px-20 py-24">
        <div data-reveal className="flex items-end justify-between gap-16">
          <div className="flex w-[560px] flex-col gap-5">
            <Eyebrow>ARCHIVE</Eyebrow>
            <div className="flex flex-col gap-3">
              <SectionTitle id="arc-h">Download any issue</SectionTitle>
              <Lead>
                Every issue is a free PDF. Pick a year, then open a cover. {issues.length} issues, back to{" "}
                {issues[issues.length - 1].label}.
              </Lead>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white p-1.5" role="tablist" aria-label="Year">
            {issueYears.map((y) => {
              const active = y === year;
              return (
                <button
                  key={y}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="issue-grid"
                  onClick={() => setYear(y)}
                  className={cx(
                    "h-10 rounded-full px-4 font-display text-[15px]/[21px] font-semibold tabular-nums transition-colors duration-200",
                    active ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                  )}
                >
                  {y}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <h3 className="font-display text-[22px]/[30px] font-semibold text-neutral-900 tabular-nums">{year}</h3>
          <p className="font-sans text-[14px]/[21px] font-medium text-neutral-500">
            {shown.length} {shown.length === 1 ? "issue" : "issues"}
          </p>
        </div>

        <div id="issue-grid" role="tabpanel" key={year} data-reveal-group className="grid grid-cols-6 gap-x-5 gap-y-8">
          {shown.map((issue) => (
            <IssueCard key={issue.label} issue={issue} />
          ))}
        </div>
      </div>
    </section>
  );
}

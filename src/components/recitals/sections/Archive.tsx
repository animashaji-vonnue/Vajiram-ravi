"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { patternStyle, SeamBand, StarMark } from "@/components/recitals/Ornaments";
import { IssueCard, SectionHead } from "@/components/recitals/Parts";
import { Counter, DealIn, Stagger, StaggerItem } from "@/components/recitals/Motion";
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
/* The three figures that used to close the hero. */
const HEADLINE_FIGURES = [
  { to: 600, suffix: "+", label: "Prelims MCQs a year" },
  { to: 600, suffix: "+", label: "Mains Q&A a year" },
  { to: 5, suffix: "", label: "Sections in every issue" },
];

export default function Archive() {
  const [year, setYear] = useState(issueYears[0]);
  const [query, setQuery] = useState("");
  const rail = useRef<HTMLDivElement>(null);
  /* Which end of the shelf we are at, so the arrows can say when they do nothing. */
  const [atEnd, setAtEnd] = useState({ start: true, finish: false });

  const syncEnds = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtEnd({ start: el.scrollLeft <= 2, finish: el.scrollLeft >= max - 2 });
  }, []);

  const searching = query.trim().length > 0;
  /* Only the newest year goes on the shelf; everything older stays a grid. */
  const onShelf = !searching && year === issueYears[0];
  const shown = useMemo(() => {
    if (searching) {
      const q = query.trim().toLowerCase();
      return issues.filter((issue) => issue.label.toLowerCase().includes(q));
    }
    return issues.filter((issue) => issue.year === year);
  }, [query, searching, year]);

  useEffect(syncEnds, [syncEnds, shown.length, year, query]);

  return (
    <section id="archive" className="relative bg-[#fffcf6]" aria-labelledby="archive-h">
      {/*
       * The same sheet the hero is printed on, so the page stays one piece of paper, with
       * a sown field of asterisks over it. Plain would read as a different document; the
       * old diamond block was the wrong shape for this family.
       */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ backgroundImage: "url(/recitals/paper.png)", backgroundSize: "cover", backgroundPosition: "center" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0" style={patternStyle("star", "#a8341a", 0.05)} aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-20 py-24">
        <SectionHead
          id="archive-h"
          eyebrow="The library"
          title="Every issue since May 2019"
          lead={`${issues.length} issues, newest first. Read online or download the PDF. No sign-in, no email.`}
        />

        {/*
         * The figures, returned from the hero.
         *
         * They sit here rather than in a section of their own because they are evidence
         * for browsing, and this is where browsing starts. All three are shown at once:
         * revealing them one per screen would imply a sequence that does not exist and
         * would stop you comparing them, which is the only interesting thing about three
         * numbers. The arrival comes from the count instead — each one runs up as the row
         * enters view, a tenth of a second apart.
         */}
        <Stagger className="flex flex-wrap items-center gap-x-14 gap-y-6" gap={0.1}>
          {HEADLINE_FIGURES.map((figure, i) => (
            <StaggerItem key={figure.label} className="flex items-center gap-3">
              {i > 0 && <StarMark size={12} className="-ml-7 mr-4 shrink-0 text-r-gamboge" />}
              <span className="font-r-masthead text-[40px]/[44px] text-[#b9501f]">
                <Counter to={figure.to} suffix={figure.suffix} />
              </span>
              <span className="max-w-[9rem] font-sans text-[12px]/[16px] font-semibold tracking-[.12em] text-r-ink-700 uppercase">
                {figure.label}
              </span>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Controls ---------------------------------------------------------------- */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <label className="flex h-12 flex-1 items-center gap-3 bg-r-paper px-4 shadow-[inset_0_0_0_1px_var(--color-r-line)] focus-within:shadow-[inset_0_0_0_1px_var(--color-r-rust)]">
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

        {/*
         * Grid, or a shelf.
         *
         * The newest year reads as a rail: one shelf of twelve, scrolled sideways, which
         * is how someone after a recent issue actually looks. Older years stay a grid,
         * because digging through an archive wants everything visible at once and
         * horizontal scrolling hides exactly what you are scanning for. Arrows are there
         * so the rail is not reachable by trackpad gesture alone.
         */}
        {shown.length === 0 ? (
          <p className="py-16 text-center font-sans text-[16px]/[24px] font-medium text-r-ink-500">
            Nothing matches “{query}”. Try a month, a year, or both.
          </p>
        ) : onShelf ? (
          <div className="flex flex-col gap-5">
            <div
              ref={rail}
              onScroll={syncEnds}
              /*
               * scroll-px matches the padding. Without it, mandatory snapping aligns the
               * first card to the scrollport edge and the rail lands at scrollLeft 80, so
               * the shelf started one gutter left of the heading above it.
               */
              className="r-roster -mx-20 flex snap-x snap-mandatory scroll-px-20 gap-6 overflow-x-auto px-20 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {shown.map((issue, i) => (
                <DealIn
                  key={issue.label}
                  index={i}
                  tilt={i % 2 === 0 ? -3.5 : 3.5}
                  root={rail}
                  once={false}
                  className="w-[302px] shrink-0 snap-start"
                >
                  <IssueCard issue={issue} latest={issue.label === latestIssue.label} />
                </DealIn>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {[-1, 1].map((dir) => {
                const spent = dir < 0 ? atEnd.start : atEnd.finish;
                return (
                  <button
                    key={dir}
                    type="button"
                    disabled={spent}
                    onClick={() => rail.current?.scrollBy({ left: dir * 326, behavior: "smooth" })}
                    aria-label={dir < 0 ? "Scroll to earlier issues" : "Scroll to later issues"}
                    className={cx(
                      "flex size-10 items-center justify-center bg-r-paper transition-all duration-200",
                      spent
                        ? "cursor-default text-r-ink-500/40 shadow-[inset_0_0_0_1px_var(--color-r-line)]"
                        : "text-r-ink-700 shadow-[inset_0_0_0_1px_var(--color-r-line)] hover:text-r-rust hover:shadow-[inset_0_0_0_1px_var(--color-r-rust)]",
                    )}
                  >
                    <ArrowRightIcon className={dir < 0 ? "rotate-180" : undefined} />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <Stagger key={searching ? `q:${query}` : `y:${year}`} className="grid grid-cols-4 gap-6" gap={0.05}>
            {shown.map((issue) => (
              <StaggerItem key={issue.label}>
                <IssueCard issue={issue} latest={issue.label === latestIssue.label} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>

      <SeamBand variant="perf" from="#fff3e0" to="#fffcf6" accent="#f58025" />
    </section>
  );
}

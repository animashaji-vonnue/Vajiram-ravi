"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { MarginMark, RosetteMark, SectionGlow, SectionGround } from "@/components/recitals/Ornaments";
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
/** One wax for all three, so the seals read as one hand sealing three notes. */
const SEAL = "#b03a2e";

/*
 * How each figure card is set down: its width, how far across, how far round, and the
 * corners it is torn to.
 *
 * Laid off the grid on purpose, so the three read as notes someone put down rather than
 * a control panel. The turn is bigger here than it was on the plain labels — these have
 * a seal to anchor them, and a sealed note that sits perfectly square looks printed
 * rather than placed. Every card's right edge still lands inside the 300px column, so
 * nothing overhangs the section's margin.
 *
 * The four corner radii are all different and rotate between cards. At this size that is
 * what stands in for a deckle edge: an actual torn outline would need a mask per card
 * for something a reader only registers as "not cut by a machine".
 */
const FIGURE_SET = [
  { w: 296, x: -8, r: -1.9, radius: "2px 8px 3px 9px" },
  { w: 288, x: 11, r: 1.3, radius: "8px 3px 9px 2px" },
  { w: 292, x: 1, r: -0.9, radius: "3px 9px 2px 8px" },
];

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
  /*
   * Whether the shelf has reached the reader. The cards measure themselves against the
   * rail so that arrow clicks deal the ones coming in from the right, but a scroller is
   * always in view of itself — so without this they dealt on mount, far below the fold,
   * and the shelf was simply already there when you scrolled down to it.
   */
  const shelf = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  const syncEnds = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtEnd({ start: el.scrollLeft <= 2, finish: el.scrollLeft >= max - 2 });
  }, []);

  const searching = query.trim().length > 0;
  /*
   * Every year goes on the shelf, not just the newest.
   *
   * It used to be the current year on a rail and older years in a grid, on the reasoning
   * that digging through an archive wants everything visible at once. In use that reads
   * as a fault rather than a distinction: you pick 2025 and the carousel you were just
   * using disappears, with no way to tell whether the page broke or the layout changed
   * on purpose. One control for all nine years is worth more than the better layout for
   * eight of them.
   */
  const shown = useMemo(() => {
    if (searching) {
      const q = query.trim().toLowerCase();
      return issues.filter((issue) => issue.label.toLowerCase().includes(q));
    }
    return issues.filter((issue) => issue.year === year);
  }, [query, searching, year]);

  /*
   * Send the shelf back to its start whenever the set changes, and on mount. Browsers
   * restore a scroller position across reloads, which left the rail parked at its far end
   * with the first cards still holding their un-dealt state — invisible, off to the left,
   * and never reached.
   */
  useEffect(() => {
    if (rail.current) rail.current.scrollLeft = 0;
    syncEnds();
  }, [syncEnds, shown.length, year, query]);

  /* Arm the deal the first time the shelf itself crosses into the page's viewport. */
  useEffect(() => {
    const el = shelf.current;
    if (!el || armed) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  return (
    <section id="archive" className="relative bg-[#ffefd5]" aria-labelledby="archive-h">
      {/*
       * A real sheet, scanned: fibre, tone and torn newsprint caught at its corners. Every
       * drawn pattern tried here — diamonds, asterisks, a ruled grid — read either as
       * decoration or as dirt, because a flat tint with marks on it is not a surface.
       *
       * The same sheet at the same strength as every other light section. This one used
       * to carry its own copy at .3 over a slightly different cream, which is why the
       * page had a visible change of paper at the section joins.
       */}
      <SectionGround tint={0.2} />
      <SectionGlow at="bottom right" strength={0.42} />
      {/* A figure in the margin, struck faint. The section is not clipped: overflow-hidden
          here would turn it into a scroll container and break the sticky stack inside. */}
      <MarginMark src="/recitals/mark-volumes.webp" className="bottom-12 left-6" size={400} opacity={0.24} />
      <MarginMark src="/recitals/mark-secretariat.webp" className="bottom-4 right-10" size={300} opacity={0.22} />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-20 pt-24 pb-40">
        <div className="flex items-start justify-between gap-16">
          <SectionHead
            id="archive-h"
            eyebrow="The library"
            title="Every issue since May 2019"
            lead={`${issues.length} issues, newest first. Read online or download the PDF. No sign-in, no email.`}
          />

          {/*
           * The figures, returned from the hero. Three separate chits, not one object.
           *
           * They sit here rather than in a section of their own because they are evidence
           * for browsing, and this is where browsing starts. Set as a row under the
           * heading they left the whole right-hand side of the section empty; held level
           * with the heading they fill it.
           *
           * They are deliberately NOT perforated. The issue cards below are postage
           * stamps, and giving the figures the same edge made them look like three more
           * issues — a reader has to be able to tell evidence from merchandise at a
           * glance. A plain hairline card in the page's other card language keeps them
           * separate without inventing a third style.
           *
           * They sit IN the flow, beside the heading, and they are sized to be no taller
           * than it. Positioning them absolutely instead looked right until the stack ran
           * past the heading and straight over the search field and the issue count — an
           * absolutely positioned block has no idea what is beneath it, so every fix was
           * a guess at a pixel height that the next type change would undo. In flow it
           * cannot overlap anything by definition, and keeping the stack within the
           * heading's own height is what stops it pushing the search bar down the page.
           *
           * All three are shown at once: revealing them one per screen would imply a
           * sequence that does not exist and would stop you comparing them, which is the
           * only interesting thing about three numbers. The arrival comes from the count
           * instead — each runs up as it enters view, a tenth of a second apart.
           */}
          <Stagger className="flex w-[300px] shrink-0 flex-col gap-[5px]" gap={0.1}>
            {HEADLINE_FIGURES.map((figure, i) => {
              const set = FIGURE_SET[i];
              return (
                <StaggerItem key={figure.label}>
                  {/*
                   * The offset and the turn go on this inner element, never on the
                   * StaggerItem: that one is a motion element and Framer owns its
                   * transform, so anything written there is overwritten the moment the
                   * entrance animation runs. A transform costs no layout either, so the
                   * stack still measures as three flush rows and keeps its promise not
                   * to push the search bar down the page.
                   */}
                  <div
                    className="flex items-center gap-2.5 bg-[#fdf6e4] py-1.5 pr-3 pl-2 shadow-[0_11px_22px_-13px_rgba(94,27,16,.42)]"
                    style={{
                      width: set.w,
                      borderRadius: set.radius,
                      transform: `translateX(${set.x}px) rotate(${set.r}deg)`,
                    }}
                  >
                    {/*
                     * A blob of wax with the house rosette pressed into it. The inner
                     * ring is the raised lip a real seal leaves where the stamp bit into
                     * the wax, and it is the one detail that stops this reading as a
                     * coloured dot.
                     */}
                    <span
                      className="relative flex size-[32px] shrink-0 items-center justify-center rounded-full"
                      style={{ background: SEAL }}
                    >
                      <span className="pointer-events-none absolute inset-[3px] rounded-full ring-1 ring-white/30" />
                      <RosetteMark size={16} className="relative text-[#ffe9c9] opacity-85" />
                    </span>
                    <span className="font-r-masthead text-[21px]/[25px] text-[#8a3516]">
                      <Counter to={figure.to} suffix={figure.suffix} />
                    </span>
                    <span className="font-sans text-[9px]/[12px] font-semibold tracking-[.09em] text-[#6b4a33] uppercase">
                      {figure.label}
                    </span>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>

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
        ) : (
          <div ref={shelf} className="flex flex-col gap-5">
            <div
              ref={rail}
              onScroll={syncEnds}
              /*
               * The rail is exactly the content width. It used to bleed to the viewport
               * with negative margins, which meant a card leaving the shelf stayed visible
               * out in the gutter and broke the column the rest of the page is set to.
               *
               * The vertical padding is not decoration: a scroll container clips both axes,
               * so without it a card lifting on hover is cut off along its top edge.
               */
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-px pt-8 pb-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {shown.map((issue, i) => (
                <DealIn
                  key={issue.label}
                  index={i}
                  tilt={i % 2 === 0 ? -3.5 : 3.5}
                  root={rail}
                  armed={armed}
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
        )}
      </div>

    </section>
  );
}

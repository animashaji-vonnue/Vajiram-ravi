"use client";

import { useState } from "react";
import { ArrowRight } from "iconoir-react";
import { resources, type Paper } from "@/data/home";
import { Button } from "@/components/ui/Buttons";
import { cx } from "@/lib/cx";
import SplitHeading from "@/components/ui/SplitHeading";

/** Each paper's colour in the table, from the design. */
const PAPER_COLOUR: Record<Paper, string> = {
  "GS I": "text-[#b45509]",
  "GS II": "text-[#2961cc]",
  "GS III": "text-[#09735c]",
};

/** The folder tabs' fills from the front tab back; the front one is the colour of the folder itself. */
const TAB_FILLS = ["#f68026", "#ffbd89", "#ffe5b4"];

/** A 20px grid of fine lines on the folder's orange page, only a shade lighter than it so the grid stays quiet. */
const GRID = {
  backgroundImage:
    "linear-gradient(#f9964b 1px, transparent 1px), linear-gradient(90deg, #f9964b 1px, transparent 1px)",
  backgroundSize: "20px 20px",
};

/** The boxed cells of the table, each a sheet of paper on the grid, each on one line. */
const CELL = "border border-[#d8d1cf] bg-[#fafaf9] px-2 text-left whitespace-nowrap";

/** The ornament after the eyebrow, as on the site's other eyebrows: a short rule, a small diamond, then a longer rule. */
function Flourish() {
  return (
    <span aria-hidden="true" className="flex items-center gap-2">
      <span className="h-px w-10 bg-brown-950/45" />
      <span className="size-1.5 rotate-45 bg-brown-950" />
      <span className="h-px w-16 bg-brown-950/45" />
    </span>
  );
}

/**
 * Free resources, after the design (3638:292) set in the site's type: a card with a faint fleur-de-lis trellis, the
 * eyebrow in Noto Serif capitals with a diamond flourish, as on the site's other eyebrows, and the heading in the
 * headline serif, then an orange folder with a tab for each stage (Prelims, Mains, Quest), the tabs behind in paler
 * oranges. The open tab's page is ruled in a fine light orange grid with the article count and a "View more" button along the
 * top and a table of topics under it, each with its subject and its paper in that paper's colour. Under the folder,
 * links to the other free resources.
 */
export default function Resources() {
  const [active, setActive] = useState(0);
  const tab = resources.tabs[active];

  // The tabs behind the open one take the darker fills in turn, as cards further back in the folder.
  const behind = resources.tabs.map((_, i) => i).filter((i) => i !== active);

  return (
    <section aria-labelledby="resources-title" className="px-10 pb-32">
      <div className="relative isolate overflow-hidden rounded-[32px] bg-[#fafaf9] px-14 py-24 [container-type:inline-size]">
        {/*
          The trellis is drawn upright; turned on its side it spans the card. Its drawn height becomes its width across
          the card, so it grows with the card, padding included (at least its own 1392px), and never stops short of
          the edges.
        */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- a decorative SVG pattern, drawn at its own size */}
          <img
            src={resources.motif}
            alt=""
            width={925}
            height={1392}
            className="absolute top-1/2 left-1/2 w-auto max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90"
            style={{ height: "max(1392px, calc(100cqw + 112px))" }}
          />
        </div>

        <div data-reveal>
          <p className="flex items-center gap-4 font-noto-serif text-[16px]/[24px] font-bold tracking-[0.12em] text-brown-950 uppercase">
            {resources.eyebrow}
            <Flourish />
          </p>
          <h2
            data-split
            id="resources-title"
            className="mt-5 w-[520px] font-serif text-[44px]/[1.1] font-normal tracking-[-0.02em] text-balance text-neutral-900 [font-variation-settings:'SOFT'_0,'WONK'_0]"
          >
            <SplitHeading text={resources.heading} />
          </h2>
        </div>

        <div data-reveal className="mt-12">
          {/* The folder's tabs, overlapping, the open one in front. */}
          <div role="tablist" aria-label="Stage" className="relative h-10">
            {resources.tabs.map((item, i) => {
              const depth = i === active ? 0 : behind.indexOf(i) + 1;
              return (
                <button
                  key={item.label}
                  type="button"
                  role="tab"
                  id={`resources-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="resources-panel"
                  onClick={() => setActive(i)}
                  className="absolute top-0 h-10 w-[180px] text-left"
                  style={{ left: i * 160, zIndex: TAB_FILLS.length - depth }}
                >
                  <svg
                    aria-hidden="true"
                    width="180"
                    height="40"
                    viewBox="0 0 180 40"
                    className="absolute inset-0"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 40V8C0 3.58 3.58 0 8 0H148C151.2 0 153.9 1.6 155.4 4.2L180 40H0Z"
                      fill={TAB_FILLS[depth]}
                    />
                  </svg>
                  <span
                    className={cx(
                      "relative block pt-1 pl-6 font-noto-serif text-[12px]/[16px] font-medium",
                      i === active ? "text-neutral-900" : "text-[#7c6d67]",
                    )}
                  >
                    {item.label}
                    <span className="block">{item.topics.length} articles</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id="resources-panel"
            role="tabpanel"
            aria-labelledby={`resources-tab-${active}`}
            className="rounded-tr-[12px] rounded-b-[12px] bg-[#f68026] p-5"
          >
            <div className="flex flex-col gap-5 p-5" style={GRID}>
              <div className="flex items-center justify-between">
                <p className={cx(CELL, "flex h-5 w-20 items-center font-noto-serif text-[12px]/[16px] text-[#5a514b]")}>
                  {tab.topics.length} articles
                </p>
                <Button href={tab.href} tone="secondary" size="s" icon="arrow">
                  View more
                </Button>
              </div>

              <table className="mt-5 border-separate border-spacing-x-5 border-spacing-y-0 [margin-inline:-20px]">
                <thead>
                  <tr className="font-noto-serif text-[12px]/[16px] font-medium text-[#272727]">
                    <th scope="col" className={cx(CELL, "h-5 w-[808px] font-medium")}>
                      Topic
                    </th>
                    <th scope="col" className={cx(CELL, "h-5 w-[180px] font-medium")}>
                      Subject
                    </th>
                    <th scope="col" className={cx(CELL, "h-5 w-[140px] font-medium")}>
                      Paper
                    </th>
                  </tr>
                  {/* The gap between the header and the rows. */}
                  <tr aria-hidden="true" className="h-5" />
                </thead>
                <tbody className="font-noto-serif text-[15px]/[20px] text-neutral-900">
                  {tab.topics.map((row, i) => (
                    <tr key={row.topic} className="h-10">
                      {/* The rows sit edge to edge, so each after the first drops its top border. */}
                      <td className={cx(CELL, i > 0 && "border-t-0")}>
                        <a href={row.href} className="hover:text-amber hover:underline">
                          {row.topic}
                        </a>
                      </td>
                      <td className={cx(CELL, i > 0 && "border-t-0")}>{row.subject}</td>
                      <td className={cx(CELL, i > 0 && "border-t-0", PAPER_COLOUR[row.paper])}>{row.paper}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div data-reveal className="mt-12 flex items-center gap-4">
          <p className="font-serif text-[20px]/[25px] font-normal text-neutral-900 [font-variation-settings:'SOFT'_0,'WONK'_0]">
            {resources.others.label}
          </p>
          <ul className="flex flex-wrap items-center gap-3">
            {resources.others.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-2.5 pr-3.5 pl-4 font-noto-serif text-[14px]/[21px] text-neutral-700 transition-colors hover:border-[#805c4e] hover:text-neutral-900"
                >
                  {link.label}
                  <ArrowRight width={12} height={12} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

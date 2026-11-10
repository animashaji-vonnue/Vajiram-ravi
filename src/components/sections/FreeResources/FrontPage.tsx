import IndianLink from "@/components/ui/IndianLink";
import LinkOrText from "@/components/ui/LinkOrText";
import { otherResources, otherResourcesLabel, resourceColumns, resourcesIntro } from "@/data/study-materials";
import PrintIn from "./PrintIn";

/*
 * The newspaper front page, on the layout of Figma "Newspaper" (2392:5787), 1280 wide on the table:
 *   - the masthead: the eyebrow, the section heading as the paper's name and the lead as its strap,
 *     centred over a heavy and a fine rule;
 *   - three ruled columns (Prelims Pointers, Mains Articles & Editorial Analysis, UPSC Study Materials),
 *     each under its heavy column-head rule: a lead headline in the heading face, five more headlines
 *     between hairlines, and the client's link to the rest;
 *   - along the foot, after a fine rule, "Other free resources" as a row of pills.
 * Every headline links to its article on vajiramandravi.com: on hover its underline draws in. The entrance
 * (PrintIn) prints the page in, at the times marked here.
 */

/** Hover underline for a headline: a line drawn left to right under it, across its lines in turn. */
const UNDERLINE =
  "bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[position:0_100%] bg-[length:0%_1px] [transition:background-size_var(--dur-base)_var(--ease-out)] hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]";

/** The design's printing ink. */
const PRINT = "text-[#161514]";

/** When each part prints in, ms after the sheet starts to settle (PrintIn). */
const AT = { rule: 350, columnRules: 480, columns: 540, columnStep: 110, footRule: 900, foot: 1000 };

/** The column rules' places: halfway across the 48px gutters between the 368px columns. */
const COLUMN_RULES = [392, 808];

export default function FrontPage() {
  const { heading, lead } = resourcesIntro;
  return (
    <PrintIn className="relative w-full rounded-[2px] bg-[#fbfaf7] px-10 pt-10 pb-8 shadow-[0_20px_40px_-12px_rgb(20_20_20/0.35)]">
      {/* Fresh newsprint: a very fine grain, no ageing. */}
      <span aria-hidden="true" className="cover-grain pointer-events-none absolute inset-0 opacity-[0.07]!" />

      <header className="relative flex flex-col items-center gap-4 text-center">
        <h2 id="resources-h" data-split className="font-heading text-[56px]/[1.08] font-normal tracking-[-0.02em] text-ink">
          {heading.before}
          {/* The resources take the second line. */}
          <br />
          <em data-reveal-em className="text-ink not-italic">
            {heading.emphasis}
          </em>{" "}
          {heading.after}
        </h2>
        <p data-words className="w-[760px] text-[17px]/[1.55] text-clay">
          {lead}
        </p>
      </header>

      {/* The masthead's heavy and fine rules, drawing out from the middle. */}
      <div aria-hidden="true" data-press="rule" data-press-at={AT.rule} className="relative mt-6 flex origin-center flex-col gap-[3px]">
        <span className="h-[3px] bg-[#161514]" />
        <span className="h-px bg-[#161514]" />
      </div>
      {/* The dateline, as under a newspaper's masthead: the edition, the place, the price. */}
      <div data-press="ink" data-press-at={AT.rule + 80} className="relative flex items-center justify-between border-b border-[#161514] py-2 font-mono text-[11px]/[16px] tracking-[0.14em] text-[#161514] uppercase">
        <span>Vol. L · Since 1976</span>
        <span>New Delhi · Daily edition</span>
        <span>Price: Free</span>
      </div>

      {/* The three columns of headlines. */}
      <div className="relative mt-5 grid grid-cols-3 gap-x-12">
        {COLUMN_RULES.map((left) => (
          <span
            key={left}
            aria-hidden="true"
            data-press="rule-v"
            data-press-at={AT.columnRules}
            className="absolute inset-y-0 w-px origin-top bg-[rgb(22_21_20/0.3)]"
            style={{ left }}
          />
        ))}
        {resourceColumns.map((column, i) => (
          <article key={column.title} data-press="ink" data-press-at={AT.columns + i * AT.columnStep} className="flex h-full flex-col items-start">
            <h3 className="w-full border-b-2 border-[#161514] pb-2 font-mono text-[13px]/[20px] font-medium tracking-[0.12em] text-burnt uppercase">{column.title}</h3>
            <ul className="mt-2.5 flex w-full flex-col">
              <li className="py-3">
                <a href={column.lead.href ?? undefined} className={`font-heading text-[24px]/[30px] ${PRINT} ${UNDERLINE}`}>
                  {column.lead.title}
                </a>
              </li>
              {column.stories.map((story) => (
                <li key={story.title} className="border-t border-[rgb(22_21_20/0.16)] py-3">
                  <a href={story.href ?? undefined} className={`text-[15px]/[21px] font-normal ${PRINT} ${UNDERLINE}`}>
                    {story.title}
                  </a>
                </li>
              ))}
            </ul>
            {/* The way to the rest, on one line at the foot of every column. */}
            <div className="mt-auto pt-4">
              <IndianLink tone="light" href={column.href}>
                {column.cta}
              </IndianLink>
            </div>
          </article>
        ))}
      </div>

      {/* The foot: a fine rule drawing in from the left, then the other free resources as pills. */}
      <span aria-hidden="true" data-press="rule" data-press-at={AT.footRule} className="relative mt-10 block h-px origin-left bg-[#161514]" />
      <nav aria-label="Other free resources" data-press="ink" data-press-at={AT.foot} className="relative mt-5 flex flex-wrap items-center gap-2.5">
        <span className={`text-[15px]/[22px] font-bold whitespace-nowrap ${PRINT}`}>{otherResourcesLabel}</span>
        {otherResources.map((item) => (
          <LinkOrText
            key={item.label}
            href={item.href}
            className="group/pill flex items-center gap-1.5 rounded-full border border-[#e8cfa8] bg-white py-2 pr-3 pl-3.5 text-[13px]/[18px] font-bold whitespace-nowrap text-[#161514] [transition:border-color_var(--dur-fast)_var(--ease-out),color_var(--dur-fast)_var(--ease-out)] hover:border-burnt hover:text-burnt"
          >
            {item.label}
            <svg aria-hidden="true" viewBox="0 0 16 16" width={14} height={14} fill="none" className="[transition:translate_var(--dur-fast)_var(--ease-out)] group-hover/pill:translate-x-0.5">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </LinkOrText>
        ))}
      </nav>
    </PrintIn>
  );
}

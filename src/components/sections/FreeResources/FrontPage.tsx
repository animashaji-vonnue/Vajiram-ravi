import IndianLink from "@/components/ui/IndianLink";
import LinkOrText from "@/components/ui/LinkOrText";
import { EyebrowCentred } from "@/components/ui/Ornament";
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
const PRINT = "text-[#2b1206]";

/** When each part prints in, ms after the sheet starts to settle (PrintIn). */
const AT = { rule: 350, columnRules: 480, columns: 540, columnStep: 110, footRule: 900, foot: 1000 };

/** The column rules' places: halfway across the 48px gutters between the 368px columns. */
const COLUMN_RULES = [392, 808];

export default function FrontPage() {
  const { eyebrow, heading, lead } = resourcesIntro;
  return (
    <PrintIn className="relative w-full rounded-[4px] bg-[#f7eedd] px-10 pt-10 pb-8 shadow-[0_4px_8px_rgb(43_18_5/0.28)]">
      {/* Aged paper, multiplied faintly into the sheet. */}
      <img
        src="/images/free-resources/paper-texture.webp"
        alt=""
        aria-hidden="true"
        width={1024}
        height={1440}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[4px] object-cover opacity-20 mix-blend-multiply"
      />

      <header className="relative flex flex-col items-center gap-4 text-center">
        <EyebrowCentred>{eyebrow}</EyebrowCentred>
        <h2 id="resources-h" data-split className="font-heading text-[56px]/[1.08] font-normal tracking-[-0.02em] text-ink">
          {heading.before}{" "}
          <em data-reveal-em className="text-orange italic">
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
        <span className="h-[3px] bg-mahogany" />
        <span className="h-px bg-mahogany" />
      </div>

      {/* The three columns of headlines. */}
      <div className="relative mt-6 grid grid-cols-3 gap-x-12">
        {COLUMN_RULES.map((left) => (
          <span
            key={left}
            aria-hidden="true"
            data-press="rule-v"
            data-press-at={AT.columnRules}
            className="absolute inset-y-0 w-px origin-top bg-[rgb(43_18_6/0.35)]"
            style={{ left }}
          />
        ))}
        {resourceColumns.map((column, i) => (
          <article key={column.title} data-press="ink" data-press-at={AT.columns + i * AT.columnStep} className="flex flex-col items-start">
            <h3 className="w-full border-b-2 border-mahogany pb-2 font-heading text-[22px]/[26px] font-normal text-burnt">{column.title}</h3>
            <ul className="mt-2.5 flex w-full flex-col">
              <li className="py-3">
                <a href={column.lead.href ?? undefined} className={`font-heading text-[24px]/[30px] ${PRINT} ${UNDERLINE}`}>
                  {column.lead.title}
                </a>
              </li>
              {column.stories.map((story) => (
                <li key={story.title} className="border-t border-[rgb(43_18_6/0.2)] py-3">
                  <a href={story.href ?? undefined} className={`text-[15px]/[21px] font-bold ${PRINT} ${UNDERLINE}`}>
                    {story.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2">
              <IndianLink tone="light" href={column.href}>
                {column.cta}
              </IndianLink>
            </div>
          </article>
        ))}
      </div>

      {/* The foot: a fine rule drawing in from the left, then the other free resources as pills. */}
      <span aria-hidden="true" data-press="rule" data-press-at={AT.footRule} className="relative mt-10 block h-px origin-left bg-mahogany" />
      <nav aria-label="Other free resources" data-press="ink" data-press-at={AT.foot} className="relative mt-5 flex flex-wrap items-center gap-2.5">
        <span className={`text-[15px]/[22px] font-bold whitespace-nowrap ${PRINT}`}>{otherResourcesLabel}</span>
        {otherResources.map((item) => (
          <LinkOrText
            key={item.label}
            href={item.href}
            className="group/pill flex items-center gap-1.5 rounded-full border border-[#e8cfa8] bg-white py-2 pr-3 pl-3.5 text-[13px]/[18px] font-bold whitespace-nowrap text-[#2b1206] [transition:border-color_var(--dur-fast)_var(--ease-out),color_var(--dur-fast)_var(--ease-out)] hover:border-burnt hover:text-burnt"
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

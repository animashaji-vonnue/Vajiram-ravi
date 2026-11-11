import IndianLink from "@/components/ui/IndianLink";
import LinkOrText from "@/components/ui/LinkOrText";
import { masthead, otherResources, otherResourcesLabel, resourceColumns, resourcesIntro, resourcesQuote } from "@/data/study-materials";
import Dateline from "./Dateline";
import PrintIn from "./PrintIn";
import "./front-page.css";

/*
 * The broadsheet front page, 1280 wide on the paper band, set the way a newspaper sets its front page:
 *   - the nameplate: the Vajiram & Ravi logo between two ears (small boxed notes in small caps);
 *   - the dateline between double rules (heavy over fine, fine over heavy): the volume and issue, the date,
 *     the paper's address, all in small caps (Dateline works out the day);
 *   - the headline (the section's H2) in the didone face, its emphasis in italic,
 *     and the standfirst opening on a two-line drop cap; beside them, across a column rule, a pull-quote;
 *   - three ruled columns (Prelims pointers, Mains articles & editorial analysis, UPSC study materials),
 *     each under its section letter and heavy column-head rule, with the desk's byline, a halftone photo,
 *     the lead headline, five more between hairlines and the client's link to the rest;
 *   - an index of the other free resources between rules, and the folio (page, paper, date) at the foot.
 * All the headings are in ink (feedback item 38). The sheet is a lighter newsprint than the band's cream,
 * with a second sheet askew beneath it and a faint fold across its middle. Every headline links to its article on vajiramandravi.com: on hover its
 * underline draws in and the column's photo develops into colour. The entrance (PrintIn) prints the page
 * in, at the times marked here; with it the headline's letters rise (ui/TextMotion, data-split) and the
 * small labels settle out of shuffling type (data-scramble), and the halftone photos drift in their
 * frames with the scroll (data-par).
 */

/** Hover underline for a headline: a line drawn left to right under it, across its lines in turn. */
const UNDERLINE =
  "bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[position:0_100%] bg-[length:0%_1px] [transition:background-size_var(--dur-base)_var(--ease-out)] hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]";

/** The printing ink, and its hairlines. */
const INK = "text-ink";
const HAIRLINE = "border-[rgb(42_26_18/0.18)]";

/** The headline face: the site's heading face, Mukta (the site uses Mukta and Source Sans 3 only). */
const SERIF = "font-heading";

/** When each part prints in, ms after the sheet starts to settle (PrintIn). */
const AT = { masthead: 250, rule: 350, headline: 480, columnRules: 620, columns: 680, columnStep: 110, footRule: 1000, foot: 1080 };

/** The column rules' places: halfway across the 48px gutters between the 368px columns. */
const COLUMN_RULES = [392, 808];

/** A heavy rule over a fine one (or the reverse), as a paper frames its dateline. */
function DoubleRule({ flip = false, at }: { flip?: boolean; at: number }) {
  return (
    <div aria-hidden="true" data-press="rule" data-press-at={at} className={`flex origin-center gap-[2px] ${flip ? "flex-col-reverse" : "flex-col"}`}>
      <span className="h-[3px] bg-ink" />
      <span className="h-px bg-ink" />
    </div>
  );
}

export default function FrontPage() {
  const { heading, lead } = resourcesIntro;
  return (
    <PrintIn
      className="relative isolate w-full rounded-[2px] border border-[#eadcc4] bg-[#fffbf4] px-12 pt-8 pb-6 shadow-[0_1px_0_rgb(255_255_255/0.9)_inset,0_28px_56px_-30px_rgb(43_18_5/0.32)]"
    >
      {/* The sheet under this one, a little askew; the grain of fresh newsprint; the fold. Decoration. */}
      <span aria-hidden="true" className="absolute inset-0 -z-10 rotate-[0.7deg] rounded-[2px] border border-[#eadcc4] bg-[#fbf3e5] shadow-[0_18px_36px_-24px_rgb(43_18_5/0.25)]" />
      <span aria-hidden="true" className="cover-grain pointer-events-none absolute inset-0 opacity-[0.06]!" />
      <span aria-hidden="true" className="fp-fold pointer-events-none absolute inset-x-0 top-1/2 h-10 -translate-y-1/2" />

      {/* The nameplate: the logo between its ears. */}
      <div data-press="ink" data-press-at={AT.masthead} className="relative grid grid-cols-[200px_1fr_200px] items-center">
        {masthead.ears.map((ear, i) => (
          <p
            key={ear.top}
            className={`fp-smallcaps ${SERIF} flex flex-col border-y ${HAIRLINE} py-1.5 text-[14px]/[18px] ${INK} ${i === 0 ? "col-start-1 items-start text-left" : "col-start-3 items-end text-right"}`}
          >
            <span className="font-semibold">{ear.top}</span>
            <span className="text-clay">{ear.bottom}</span>
          </p>
        ))}
        <img src="/images/logo.webp" alt="Vajiram & Ravi" width={750} height={180} className="col-start-2 row-start-1 mx-auto h-[72px] w-[300px]" />
      </div>

      {/* The dateline, between double rules. */}
      <div className="relative mt-5">
        <DoubleRule at={AT.rule} />
        <p data-press="ink" data-press-at={AT.rule + 80} className={`fp-smallcaps ${SERIF} flex items-center justify-between py-[7px] text-[15px]/[20px] ${INK}`}>
          <Dateline part="volume" />
          <Dateline part="date" className="font-semibold" />
          <span>{masthead.site}</span>
        </p>
        <DoubleRule flip at={AT.rule} />
      </div>

      {/* The headline and standfirst, and the pull-quote across a column rule. */}
      <div className="relative mt-7 grid grid-cols-[1fr_336px] gap-x-12">
        <span aria-hidden="true" data-press="rule-v" data-press-at={AT.headline} className="absolute inset-y-0 right-[360px] w-px origin-top bg-[rgb(42_26_18/0.3)]" />
        <header className="flex flex-col items-start">
          <h2 id="resources-h" data-split className={`${SERIF} text-[60px]/[1.04] font-bold tracking-[-0.015em] ${INK}`}>
            {heading.before}
            {/* The resources take the second line. */}
            <br />
            <em data-reveal-em className="font-semibold text-ink italic">
              {heading.emphasis}
            </em>
            {heading.after}
          </h2>
          <p data-press="ink" data-press-at={AT.headline + 160} className="fp-dropcap mt-5 w-[700px] text-[18px]/[1.55] text-[#4a3428]">
            {lead}
          </p>
        </header>

        <figure data-press="ink" data-press-at={AT.headline + 240} className="flex flex-col justify-center">
          <span aria-hidden="true" className={`${SERIF} block h-[52px] text-[96px]/[1] font-bold text-burnt`}>
            “
          </span>
          <blockquote className={`${SERIF} text-[25px]/[1.32] font-medium ${INK} italic`}>{resourcesQuote.text}</blockquote>
          <figcaption data-scramble className="mt-4 flex items-center gap-3 text-[12px]/[16px] tracking-[0.02em] text-clay">
            <span aria-hidden="true" className="h-px w-8 bg-clay/60" />
            {resourcesQuote.source}
          </figcaption>
        </figure>
      </div>

      {/* The three columns of headlines, their parts on shared rows (subgrid) so heads, photos and links line up. */}
      <div className="relative mt-7 grid grid-cols-3 gap-x-12">
        {COLUMN_RULES.map((left) => (
          <span
            key={left}
            aria-hidden="true"
            data-press="rule-v"
            data-press-at={AT.columnRules}
            className="absolute inset-y-0 w-px origin-top bg-[rgb(42_26_18/0.3)]"
            style={{ left }}
          />
        ))}
        {resourceColumns.map((column, i) => (
          <article key={column.title} data-press="ink" data-press-at={AT.columns + i * AT.columnStep} className="row-span-6 grid grid-rows-subgrid">
            {/* The column head: its section letter over a heavy rule, the title, the desk's byline. */}
            <p data-scramble className="w-full border-b-[3px] border-ink pb-1.5 text-[12px]/[16px] font-medium tracking-[0.02em] text-clay">Section {column.section}</p>
            <h3 className={`${SERIF} mt-2.5 self-end text-[25px]/[1.15] font-bold ${INK}`}>{column.title}</h3>
            <p className={`mt-1.5 w-full border-b ${HAIRLINE} pb-3 text-[13px]/[18px] text-clay italic`}>{column.byline}</p>

            {/* The lead story, under its halftone photo. */}
            <div className="group/story mt-4 flex w-full flex-col gap-3">
              <div className="fp-halftone h-[116px] w-full" data-press="photo" data-press-at={AT.columns + i * AT.columnStep + 120}>
                {/* TODO: an institute photo standing in for the lead article's own picture. It drifts in its frame with the scroll (ui/TextMotion, data-par). */}
                <div data-par="10" className="absolute inset-x-0 -inset-y-[14%]">
                  <img src={column.photo.src} alt="" width={column.photo.width} height={column.photo.height} loading="lazy" decoding="async" className="size-full object-cover" style={{ objectPosition: column.photo.position }} />
                </div>
              </div>
              <a href={column.lead.href ?? undefined} className={`font-heading text-[23px]/[29px] font-medium ${INK} ${UNDERLINE}`}>
                {column.lead.title}
              </a>
            </div>

            <ul className="mt-3 flex w-full flex-col self-start">
              {column.stories.map((story) => (
                <li key={story.title} className={`border-t ${HAIRLINE} py-2`}>
                  <a href={story.href ?? undefined} className={`text-[15px]/[21px] ${INK} ${UNDERLINE}`}>
                    {story.title}
                  </a>
                </li>
              ))}
            </ul>
            {/* The way to the rest, on one line at the foot of every column. */}
            <div className={`mt-3 w-full self-end border-t ${HAIRLINE} pt-4`}>
              <IndianLink tone="light" href={column.href}>
                {column.cta}
              </IndianLink>
            </div>
          </article>
        ))}
      </div>

      {/* The index of the other free resources, between a heavy rule and a fine one. */}
      <div className="relative mt-8">
        <DoubleRule at={AT.footRule} />
        <nav aria-label={otherResourcesLabel} data-press="ink" data-press-at={AT.foot} className="flex items-center gap-5 py-3.5">
          <span className={`${SERIF} text-[18px]/[24px] font-bold whitespace-nowrap ${INK} italic`}>{otherResourcesLabel}</span>
          <ul className="flex flex-1 items-center justify-between gap-x-3">
            {otherResources.map((item) => (
              <li key={item.label}>
                <LinkOrText
                  href={item.href}
                  className="group/item flex items-center gap-1.5 text-[14px]/[20px] font-semibold whitespace-nowrap text-ink [transition:color_var(--dur-fast)_var(--ease-out)] hover:text-burnt focus-visible:text-burnt"
                >
                  <span aria-hidden="true" className="size-1.5 rotate-45 bg-burnt" />
                  {item.label}
                  <svg aria-hidden="true" viewBox="0 0 16 16" width={13} height={13} fill="none" className="[transition:translate_var(--dur-fast)_var(--ease-out)] group-hover/item:translate-x-0.5">
                    <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </LinkOrText>
              </li>
            ))}
          </ul>
        </nav>
        <span aria-hidden="true" className="block h-px bg-ink" />
      </div>

      {/* The folio. */}
      <p data-press="ink" data-press-at={AT.foot + 80} className={`fp-smallcaps ${SERIF} relative mt-3 flex items-center justify-between text-[13px]/[18px] text-clay`}>
        <span>{masthead.folio.page}</span>
        <span>{masthead.folio.title}</span>
        <Dateline part="date" />
      </p>
    </PrintIn>
  );
}

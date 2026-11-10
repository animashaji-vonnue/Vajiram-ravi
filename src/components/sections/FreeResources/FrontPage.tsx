import Cta from "@/components/ui/Cta";
import IndianLink from "@/components/ui/IndianLink";
import { EyebrowCentred } from "@/components/ui/Ornament";
import Photo from "@/components/ui/Photo";
import { freeResources, resourcesIntro } from "@/data/study-materials";
import { ParallaxLayer } from "@/lib/parallax";
import PrintIn from "./PrintIn";

/*
 * The newspaper front page (Figma "Newspaper", 2392:5787), 1280 wide on the table:
 *   - the masthead: the eyebrow, the section heading as the paper's name and the lead as its strap,
 *     centred over a heavy and a fine rule;
 *   - the lead story, The Recitals: its headline, the content's sentence as the standfirst, its link, and
 *     the photo of old front pages beside it;
 *   - three ruled columns (Daily Current Affairs, Prelims Pointers, Mains Articles & Editorial Analysis),
 *     each under its own heavy column-head rule;
 *   - along the foot, UPSC Study Materials with "View All Study Materials".
 * Each story is one link (its link stretches over it): on hover its headline's underline draws in, its
 * medallion turns, and the lead photo loses its light sepia and zooms 1.03 (it also drifts with the
 * scroll, lib/parallax). The entrance (PrintIn) prints the page in, at the times marked here.
 */

/** Hover underline for a headline: a line drawn left to right under it, across its lines in turn. */
const underline = (weight: 1 | 2) =>
  `bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[position:0_100%] [transition:background-size_var(--dur-base)_var(--ease-out)] ${
    weight === 2
      ? "bg-[length:0%_2px] group-hover/story:bg-[length:100%_2px] group-focus-within/story:bg-[length:100%_2px]"
      : "bg-[length:0%_1px] group-hover/story:bg-[length:100%_1px] group-focus-within/story:bg-[length:100%_1px]"
  }`;

/** A story's link covers the whole story, above its photo. */
const STRETCHED = "after:absolute after:inset-0 after:z-1";

/** The design's printing ink, a shade off --color-ink. */
const PRINT = "text-[#2a140c]";

/** When each part prints in, ms after the sheet starts to settle (PrintIn). */
const AT = { rule: 350, photo: 520, letters: 450, letterStep: 40, standfirst: 650, leadLink: 760, columnRules: 820, columns: 880, columnStep: 100, footRule: 1150, foot: 1250 };

/** The column rules' places: halfway across the 48px gutters between the 368px columns. */
const COLUMN_RULES = [392, 808];

export default function FrontPage() {
  const { eyebrow, heading, lead } = resourcesIntro;
  const { lead: story, columns, foot } = freeResources;
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
        <h2 id="resources-h" data-reveal="heading" className="font-serif text-[56px]/[1.08] font-normal tracking-[-0.02em] text-ink">
          {heading.before}{" "}
          <em data-reveal-em className="text-orange italic">
            {heading.emphasis}
          </em>{" "}
          {heading.after}
        </h2>
        <p data-reveal="sub" className="w-[760px] text-[17px]/[1.55] text-clay">
          {lead}
        </p>
      </header>

      {/* The masthead's heavy and fine rules, drawing out from the middle. */}
      <div aria-hidden="true" data-press="rule" data-press-at={AT.rule} className="relative mt-6 flex origin-center flex-col gap-[3px]">
        <span className="h-[3px] bg-mahogany" />
        <span className="h-px bg-mahogany" />
      </div>

      {/* The lead story. */}
      <article className="group/story relative mt-7 flex items-stretch gap-10">
        <div className="flex w-[520px] shrink-0 flex-col items-start">
          <h3 className="font-serif text-[52px]/[1.05] font-normal tracking-[-0.02em] text-mahogany">
            <span className={underline(2)}>
              <span className="sr-only">{story.title}</span>
              {/* Letter by letter, so the headline can ink in; read once, above. */}
              <span aria-hidden="true">
                {Array.from(story.title, (letter, i) => (
                  <span key={i} data-press="letter" data-press-at={AT.letters + i * AT.letterStep}>
                    {letter}
                  </span>
                ))}
              </span>
            </span>
          </h3>
          <p data-press="ink" data-press-at={AT.standfirst} className={`mt-4 font-serif text-[22px]/[1.4] italic ${PRINT}`}>
            {story.text}
          </p>
          <div data-press="ink" data-press-at={AT.leadLink} className="mt-auto pt-6">
            <IndianLink tone="light" href={story.href} className={STRETCHED}>
              {story.cta}
            </IndianLink>
          </div>
        </div>
        {/* Front pages of August 1947, as the design's lead photo: decoration, in a light sepia. */}
        <div data-press="photo" data-press-at={AT.photo} className="relative h-[300px] min-w-0 flex-1 overflow-hidden bg-[#d8c9ad]">
          <ParallaxLayer speed={4} className="absolute inset-0">
            <Photo
              src="/images/free-resources/lead-1947-front-pages.webp"
              alt=""
              sizes="640px"
              className="absolute inset-0"
              imageClassName="sepia-30 group-hover/story:scale-103 group-hover/story:sepia-0"
            />
          </ParallaxLayer>
        </div>
      </article>

      {/*
        The columns. A subgrid lines up their parts across the page: the column heads stand on one rule
        whatever their length, the texts start together and the links share a baseline.
      */}
      <div className="relative mt-9 grid grid-cols-3 grid-rows-[auto_1fr_auto] gap-x-12">
        {COLUMN_RULES.map((left) => (
          <span
            key={left}
            aria-hidden="true"
            data-press="rule-v"
            data-press-at={AT.columnRules}
            className="absolute inset-y-0 w-px origin-top bg-mahogany/35"
            style={{ left }}
          />
        ))}
        {columns.map((column, i) => (
          <article
            key={column.title}
            data-press="ink"
            data-press-at={AT.columns + i * AT.columnStep}
            className="group/story relative row-span-3 grid grid-rows-subgrid"
          >
            <h3 className="self-end border-b-2 border-mahogany pb-2 font-serif text-[24px]/[1.2] font-normal text-burnt">
              <span className={underline(1)}>{column.title}</span>
            </h3>
            <p className={`mt-4 font-serif text-[19px]/[1.45] ${PRINT}`}>{column.text}</p>
            <div className="pt-5">
              <IndianLink tone="light" href={column.href} className={STRETCHED}>
                {column.cta}
              </IndianLink>
            </div>
          </article>
        ))}
      </div>

      {/* The foot: a fine rule drawing in from the left, then the study materials and the way to all of them. */}
      <span aria-hidden="true" data-press="rule" data-press-at={AT.footRule} className="relative mt-9 block h-px origin-left bg-mahogany" />
      <div data-press="ink" data-press-at={AT.foot} className="relative mt-5 flex items-center gap-6">
        <h3 className="shrink-0 font-serif text-[24px]/[1.2] font-normal whitespace-nowrap text-burnt">{foot.title}</h3>
        <p className="min-w-0 flex-1 text-[16px]/[1.5] text-clay">{foot.text}</p>
        <Cta variant="primary" size="md" href={foot.href}>
          {foot.cta}
        </Cta>
      </div>
    </PrintIn>
  );
}

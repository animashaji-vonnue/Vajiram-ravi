"use client";

import { useState } from "react";
import CrossFade from "@/components/ui/CrossFade";
import Cta from "@/components/ui/Cta";
import IndianLink from "@/components/ui/IndianLink";
import LinkOrText from "@/components/ui/LinkOrText";
import Medallion from "@/components/ui/Medallion";
import Photo from "@/components/ui/Photo";
import TraditionalTabs from "@/components/ui/TraditionalTabs";
import type { FreeResource, StudyIntro, StudyStage } from "@/data/study-materials";
import { cx } from "@/lib/cx";
import { ParallaxLayer } from "@/lib/parallax";

/*
 * The newspaper sheet. Motion spec (10 Free study material):
 *   - The edition tabs (Prelims / Mains / Quest) slide their indicator, and the lead story and the five
 *     headlines turn like a page: the old ones fade and shift 12px left, the new ones fade in from 12px
 *     right (--dur-base). The "Mains edition" label turns with them.
 *   - Each headline row is one link: on hover the headline turns burnt and its underline draws in, the
 *     row tints #F8E9CF and the medallion turns.
 *   - The lead story is one link ("Read the analysis" stretched over it): on hover its photo zooms 1.03
 *     and loses its light sepia.
 *   - Scroll (fine pointers, where ViewTimeline exists, motion allowed): the lead photo drifts 6% of its
 *     frame's height inside it as the sheet crosses the screen (lib/parallax), under the hover zoom.
 *   - "Also free" links are underlined; on hover the line thickens from 1px to 2px.
 * Every edition is also laid out, invisibly, in the same grid cell, so the sheet keeps the height of the
 * tallest and switching never moves the page below.
 */

/** The design's printing ink, a shade off --color-ink. */
const PRINT = "text-[#2a140c]";

type FrontPageProps = {
  stages: StudyStage[];
  initialStage: StudyStage["id"];
  intro: StudyIntro;
  resources: FreeResource[];
};

const PAGE_TURN = { shift: 12, duration: 320 } as const;

export default function FrontPage({ stages, initialStage, intro, resources }: FrontPageProps) {
  const [stageId, setStageId] = useState(initialStage);
  const stage = stages.find((s) => s.id === stageId) ?? stages[0];

  return (
    <div
      data-reveal
      className={cx(
        "relative flex w-full flex-col items-start gap-4 overflow-clip bg-[#f3ead8] px-9 py-7 shadow-[0_16px_30px_rgb(51_26_13/0.25)]",
        PRINT,
      )}
    >
      {/* Aged paper at 25% over the sheet's colour. */}
      <img
        src="/images/free-resources/paper-texture.webp"
        alt=""
        aria-hidden="true"
        width={1024}
        height={1440}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover opacity-25"
      />

      {/* Masthead: the kicker, the paper's name and the editions, over a heavy rule. */}
      <div className="relative flex w-full items-center justify-between border-b-3 border-[rgb(42_20_12/0.9)] pb-2.5">
        <p className="text-[16px]/[normal] font-semibold tracking-[0.96px] whitespace-nowrap uppercase">{intro.kicker}</p>
        <h2 id="resources-h" className="font-serif text-[56px]/[normal] whitespace-nowrap">
          {intro.masthead}
        </h2>
        <TraditionalTabs
          tabs={stages.map(({ id, label }) => ({ id, label }))}
          value={stage.id}
          onChange={(id) => setStageId(id as StudyStage["id"])}
          label="Editions"
          idPrefix="fr"
        />
      </div>

      {/* The strap and the edition, over a hairline. */}
      <div className="relative flex w-full items-start justify-between border-b border-[rgb(42_20_12/0.5)] pb-2 text-[16px]/[normal] whitespace-nowrap">
        <p className="font-serif italic">{intro.strap}</p>
        <CrossFade id={stage.id} {...PAGE_TURN}>
          <p className="font-semibold tracking-[0.64px]">{`${stage.label} ${intro.edition}`}</p>
        </CrossFade>
      </div>

      <div role="tabpanel" id="fr-panel" aria-labelledby={`fr-tab-${stage.id}`} className="relative grid w-full">
        {/* The other editions, invisible, only holding the sheet at the tallest edition's height. */}
        {stages
          .filter((s) => s.id !== stage.id)
          .map((s) => (
            <div key={s.id} aria-hidden="true" inert className="invisible col-start-1 row-start-1">
              <Edition stage={s} readMore={intro.readMore} live={false} />
            </div>
          ))}
        <CrossFade id={stage.id} {...PAGE_TURN} className="col-start-1 row-start-1">
          <Edition stage={stage} readMore={intro.readMore} live />
        </CrossFade>
      </div>

      {/* The foot: the other free resources, and the edition's listing. */}
      <div className="relative flex w-full items-center justify-between border-t-2 border-[rgb(42_20_12/0.9)] pt-2.5">
        <div className="flex items-center gap-[18px]">
          <h3 id="fr-also" className="text-[16px]/[normal] font-semibold tracking-[0.64px] whitespace-nowrap uppercase">
            {intro.alsoFree}
          </h3>
          <ul aria-labelledby="fr-also" className="flex items-center gap-[18px]">
            {resources.map((resource, i) => (
              <li key={resource.label} className="flex items-center gap-[18px]">
                {i > 0 && (
                  <img src="/images/free-resources/diamond-sep.svg" alt="" aria-hidden="true" width={8} height={8} className="size-2 shrink-0" />
                )}
                <LinkOrText
                  href={resource.href}
                  className={cx(
                    "text-[15px]/[normal] font-medium whitespace-nowrap text-burnt",
                    resource.href !== null &&
                      "underline decoration-1 [text-underline-position:from-font] [transition:text-decoration-thickness_var(--dur-fast)_var(--ease-out)] hover:decoration-2",
                  )}
                >
                  {resource.label}
                </LinkOrText>
              </li>
            ))}
          </ul>
        </div>
        <Cta variant="primary" size="md" href={stage.moreHref}>
          {intro.more}
        </Cta>
      </div>
    </div>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One edition: the lead story on the left, the five headlines in a ruled column on the right. `live` is false
 * for the invisible copies that only hold the sheet's height: their photo does not run the parallax.
 */
function Edition({ stage, readMore, live }: { stage: StudyStage; readMore: string; live: boolean }) {
  const [lead, ...headlines] = stage.articles;
  return (
    <div className="flex w-full items-start gap-7">
      {/* The lead story; its "Read the analysis" link stretches over the whole of it. */}
      <div className="group/lead relative flex w-[680px] shrink-0 flex-col items-start gap-3">
        {/* The frame clips; the layer inside it drifts with the scroll, and the photo in it keeps its hover zoom. */}
        <div className="relative h-[300px] w-[680px] overflow-hidden bg-[#d8c9ad]">
          <ParallaxLayer speed={4} enabled={live} className="absolute inset-0">
            <Photo
              src={stage.leadImage}
              alt=""
              sizes="680px"
              className="absolute inset-0"
              imageClassName="sepia-30 group-hover/lead:scale-103 group-hover/lead:sepia-0"
            />
          </ParallaxLayer>
        </div>
        <h3 className="w-[680px] font-serif text-[34px]/[1.15]">{lead.title}</h3>
        <IndianLink
          tone="light"
          href={lead.href}
          medallion={24}
          ariaLabel={`${readMore}: ${lead.title}`}
          className="gap-2.5! text-[17px]/[normal]! font-semibold! tracking-[0.68px] uppercase after:absolute after:inset-0"
        >
          {readMore}
        </IndianLink>
      </div>

      <ol className="flex w-[500px] shrink-0 flex-col items-start border-l border-[rgb(42_20_12/0.4)] pl-6">
        {headlines.map((article, i) => (
          <li key={article.title} className={cx("w-[476px]", i > 0 && "border-t border-[rgb(42_20_12/0.35)]")}>
            <Headline article={article} kicker={`${stage.label} · ${pad(i + 2)}`} />
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * A headline row, the whole row one link. The tint reaches 12px past the text on both sides; the
 * underline is a 1px line drawn across the headline's lines, one after the other.
 */
function Headline({ article, kicker }: { article: StudyStage["articles"][number]; kicker: string }) {
  const linked = article.href !== null;
  return (
    <LinkOrText
      href={article.href}
      className={cx(
        "-mx-3 flex flex-col items-start gap-1 px-3 py-3",
        linked &&
          "group/medal [transition:background-color_var(--dur-fast)_var(--ease-out),scale_80ms_var(--ease-out)] hover:bg-[#f8e9cf] pointer-coarse:active:scale-[.98]",
      )}
    >
      <span className="text-[15px]/[normal] font-semibold tracking-[0.6px] whitespace-nowrap text-burnt uppercase">{kicker}</span>
      <span className="flex w-full items-center gap-4">
        <span className="min-w-0 flex-1 font-serif text-[19px]/[1.25] [transition:color_var(--dur-fast)_var(--ease-out)] group-hover/medal:text-burnt">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat [transition:background-size_var(--dur-base)_var(--ease-out)] group-hover/medal:bg-[length:100%_1px]">
            {article.title}
          </span>
        </span>
        {linked && <Medallion tone="burnt" size={24} />}
      </span>
    </LinkOrText>
  );
}

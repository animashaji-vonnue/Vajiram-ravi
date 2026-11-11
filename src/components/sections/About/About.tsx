"use client";

import { useEffect, useRef, useState } from "react";
import Coverflow from "@/components/ui/Coverflow";
import { aboutIntro, institutionCards, type InstitutionCard, type InstitutionIcon } from "@/data/about";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/** The cards' autoplay step, ms. */
/** Long enough to read a centre card's sentence once it has opened (client: "not readable because of the timing"). */
const AUTOPLAY_MS = 9000;
/** Parliament House fades out at its far left and right, so its cut-off forecourt never shows an edge. */
const PHOTO_MASK = "linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%)";

/**
 * About Vajiram & Ravi (IA 3): one band, on a deep orange (deep enough for white text to read, 5:1 and
 * up behind the heading and lead), with Parliament House standing on its foot: the client's picture,
 * toned orange and cut out against a transparent sky, its colonnade right behind the cards.
 *   - At the top, the brand: the logo's round mark, large, in a soft halo that blends it into the band.
 *   - The heading, one sentence on two lines, its last beat ("a legacy in civil services preparation.")
 *     on a line of its own in the light emphasis colour; then the lead, kept to a
 *     reading width (three lines).
 *   - The six cards in a coverflow projected outward like the colonnade (Coverflow): the centre card is
 *     the biggest, in its dark look, and shows its sentence; the cards to the sides are collapsed to their
 *     medallion and title. It plays on its own and pauses on hover, focus and off screen, with arrows,
 *     dots and a pause button under it.
 * Motion, kept to one entrance so the text reads at once (the client, 11 Nov 2026: effects colliding made
 * it unreadable): as the band arrives, the mark, the heading and the lead rise into place together in one
 * quick 450ms move, with no delay or stagger, and then nothing moves them. The cards are simply there. The
 * rest is decoration behind the text (ui/TextMotion): the band's edge opens out from an inset card as it
 * rises in (data-curtain), and the centre card's head glows, slowly breathing (.lp-glow). (The scroll expand of the photo, the
 * parting "Since 1976" title, the heading's word-by-word rise, its emphasis glint, the photo's drift and
 * the cards' scrubbed rise were taken out: the photo sits behind the cards, so an expand could only be seen by holding the
 * cards back, which kept them waiting on the scroll.)
 * Reduced motion: the text is simply there and the cards do not play on their own.
 */
export default function About() {
  const { heading } = aboutIntro;
  const textRef = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(true);

  useEffect(() => {
    const text = textRef.current;
    if (prefersReducedMotion() || !text) return;
    // Already on screen: leave it. Otherwise the block waits, out of sight, for the band to arrive.
    if (canvasTop(text) < (window.innerHeight / getCanvasZoom()) * 0.85) return;
    setArrived(false);
    return whenVisible(text, 0.2, () => setArrived(true));
  }, []);


  return (
    <section
      id="about"
      data-curtain
      aria-labelledby="about-h"
      className="relative isolate overflow-clip pt-24 pb-24"
      style={{
        backgroundColor: "#b8400f",
        backgroundImage:
          "radial-gradient(40% 32% at 50% 74%, rgb(250 184 92 / 0.45), rgb(250 184 92 / 0) 100%), linear-gradient(180deg, #a3390d 0%, #b8400f 30%, #cf5814 62%, #b8400f 86%, #9a3412 100%)",
      }}
    >
      {/*
        Parliament House, the client's picture (Figma 2586:4289): already toned orange and cut out against a
        transparent sky, so it sits on the band as it is, anchored to its foot and centred, behind the cards
        and under the lead (its flag stops short of the text). Its far sides fade out (PHOTO_MASK).
        Decoration.
      */}
      <img
        src="/images/about/parliament-orange.webp"
        alt=""
        aria-hidden="true"
        width={1344}
        height={752}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-auto w-[1440px] max-w-none -translate-x-1/2 opacity-90"
        style={{ maskImage: PHOTO_MASK, WebkitMaskImage: PHOTO_MASK }}
      />

      <div className="mx-auto flex w-canvas flex-col items-center">
        {/*
          The mark, the heading and the lead arrive together, once, in one quick rise (450ms, no delay and no
          stagger), so they are readable at once; nothing else moves them or runs over them.
        */}
        <div
          ref={textRef}
          className="flex flex-col items-center text-center [transition:opacity_450ms_var(--ease-out),translate_450ms_var(--ease-out)]"
          style={{ opacity: arrived ? 1 : 0, translate: arrived ? "0 0" : "0 16px" }}
        >
          {/*
            The brand: the logo's round mark alone (no plate, no wordmark), large, sitting in a soft halo of
            warm light so it melts into the top of the band, as the sun into the sky.
          */}
          <span className="relative flex size-[132px] items-center justify-center">
            <span aria-hidden="true" className="absolute -inset-16 rounded-full bg-[radial-gradient(closest-side,rgb(255_226_160/0.55),rgb(255_196_110/0.22)_55%,transparent)]" />
            <img
              src="/images/logo-mark.webp"
              alt="Vajiram & Ravi"
              width={168}
              height={171}
              className="relative size-[132px] object-contain drop-shadow-[0_10px_22px_rgb(77_20_4/0.35)]"
            />
          </span>

          <h2 id="about-h" className="mt-7 w-[1000px] font-heading text-[52px]/[1.12] font-normal tracking-[-0.02em] text-balance text-white">
            {heading.lead}{" "}
            {/* The emphasis keeps to one line, under the first: the heading is two lines. */}
            <span className="block whitespace-nowrap text-[#ffe9b0]">{heading.emphasis}</span>
          </h2>
          <p className="mt-6 w-[720px] text-[19px]/[1.6] text-white">{aboutIntro.lead}</p>
        </div>

        {/* The cards are simply there: the band's one entrance is the text's. */}
        <div className="mt-14 w-full">
          <div>
        <Coverflow
          items={institutionCards}
          label="Why Vajiram & Ravi"
          itemName="card"
          slideTitle={(card) => card.title}
          renderSlide={(card, { active, expanded }) => <Card card={card} active={active} expanded={expanded} />}
          width={340}
          height={440}
          spacing={[340, 560]}
          scales={[0.78, 0.6]}
          turns={[12, 20]}
          interval={AUTOPLAY_MS}
          tone="dark"
        />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A card (after Figma 2397:6766), 340 × 440, 24px corners. To the side it is collapsed: on its light paper
 * with a white hairline, the scalloped medallion and the title, in ink. In the centre it takes its dark
 * look (maroon to rust, saffron hairline, white title) and opens: the rule-and-diamond divider and the
 * sentence (18px, white) unfold under the title.
 */
function Card({ card, active, expanded }: { card: InstitutionCard; active: boolean; expanded: boolean }) {
  const [from, to] = card.paper;
  return (
    <article
      className="relative flex size-full flex-col items-center justify-center overflow-clip rounded-[24px] px-8 text-center shadow-[0_28px_50px_rgb(70_22_6/0.35)]"
      style={{ backgroundImage: `linear-gradient(140deg, ${from} 7.4%, ${to} 81.5%)` }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[24px] border border-white/70" />
      {/* The dark look, in the centre. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[24px] border border-saffron/40 bg-[linear-gradient(140.8deg,#5a1a10_7.4%,#9c4019_81.5%)] [transition:opacity_350ms_var(--ease-out)]"
        style={{ opacity: active ? 1 : 0 }}
      />
      {/* In the centre, a warm light breathes slowly at the card's head while the band is on screen (globals.css, .lp-glow). */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-clip rounded-[24px] [transition:opacity_350ms_var(--ease-out)]" style={{ opacity: active ? 1 : 0 }}>
        <span
          className={cx(
            "absolute -top-[30%] left-[-20%] h-[75%] w-[140%] rounded-full bg-[radial-gradient(closest-side,rgb(255_196_110/0.34),rgb(255_170_80/0.12)_55%,transparent)]",
            active && "lp-glow",
          )}
        />
      </span>
      <Medallion icon={card.icon} />
      <h3
        className="relative mt-5 font-heading text-[30px]/[1.15] font-normal [transition:color_350ms_var(--ease-out)]"
        style={{ color: active ? "#fff" : "#2b1206" }}
      >
        {card.title}
      </h3>
      {/* The sentence, unfolding in the centre card. */}
      <div
        className="relative grid w-full [transition:grid-template-rows_400ms_var(--ease-out),opacity_300ms_var(--ease-out)]"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0 }}
      >
        <div className="flex min-h-0 flex-col items-center overflow-hidden">
          <img src="/images/about/divider-dark.svg" alt="" aria-hidden="true" width={150} height={10} className="mt-5 h-2.5 w-[150px]" />
          <p className="mt-5 text-[18px]/[1.6] text-white">{card.text}</p>
        </div>
      </div>
    </article>
  );
}

/**
 * The scalloped medallion (Figma "medallion"): orange scallop and cream stitch, as drawn, with the card's
 * icon in white where the number was.
 */
function Medallion({ icon }: { icon: InstitutionIcon }) {
  return (
    <span aria-hidden="true" className="relative block size-16 shrink-0">
      <img src="/images/about/medallion-scallop-orange.svg" alt="" width={64} height={62.6} className="absolute top-[0.7px] left-0 h-[62.6px] w-16 max-w-none" />
      <img src="/images/about/medallion-stitch-cream.svg" alt="" width={51} height={51} className="absolute top-[6.5px] left-[6.5px] size-[51px] max-w-none" />
      <span className="absolute inset-0 flex items-center justify-center text-white">
        <Icon icon={icon} />
      </span>
    </span>
  );
}

/**
 * The cards' line icons, 24px: a trophy for the track record, a teacher at the board for the faculty, a
 * student with a mentor's tick for personalised learning, books for the resources, a map pin for the
 * location, and a screen beside a classroom desk for the learning modes.
 */
function Icon({ icon }: { icon: InstitutionIcon }) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      {icon === "trophy" && (
        <>
          <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
          <path d="M8 6H5a3 3 0 0 0 3 3.5M16 6h3a3 3 0 0 1-3 3.5M12 13v4M8.5 20h7M9.5 17h5" />
        </>
      )}
      {icon === "faculty" && (
        <>
          <rect x={10} y={3.5} width={11} height={8.5} rx={1} />
          <circle cx={5.5} cy={8} r={2.2} />
          <path d="M2.5 20.5v-4.25a3 3 0 0 1 3-3h1.75l3.25-2.75" />
        </>
      )}
      {icon === "mentor" && (
        <>
          <circle cx={9} cy={8} r={3} />
          <path d="M3.5 19.5c0-3.2 2.5-5.5 5.5-5.5s5.5 2.3 5.5 5.5" />
          <path d="m15.5 10 2 2 4-4" />
        </>
      )}
      {icon === "books" && (
        <>
          <path d="M12 6.5c-1.8-1.4-4.6-2-8-1.8v12.6c3.4-.2 6.2.4 8 1.8 1.8-1.4 4.6-2 8-1.8V4.7c-3.4-.2-6.2.4-8 1.8Z" />
          <path d="M12 6.5v12.6" />
        </>
      )}
      {icon === "location" && (
        <>
          <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
          <circle cx={12} cy={9.5} r={2.5} />
        </>
      )}
      {icon === "modes" && (
        <>
          <rect x={3} y={4.5} width={18} height={11.5} rx={1.5} />
          <path d="M8 20h8M12 16v4" />
          <path d="m10.5 8 4 2.25-4 2.25Z" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

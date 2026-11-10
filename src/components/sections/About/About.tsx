"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Coverflow from "@/components/ui/Coverflow";
import { aboutIntro, institutionCards, type InstitutionCard, type InstitutionIcon } from "@/data/about";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/** The cards' autoplay step, ms. */
const AUTOPLAY_MS = 5000;
/**
 * Where Parliament House shows: from just under the lead (the sky and the flag stay out, so the text keeps
 * its contrast) down to the forecourt, fading out to the sides. The two gradients are intersected.
 */
const PHOTO_MASK =
  "linear-gradient(180deg, transparent 34%, #000 52%, #000 84%, transparent 100%), radial-gradient(72% 95% at 50% 62%, #000 55%, transparent 100%)";

/**
 * About Vajiram & Ravi (IA 3): one band, on a deep orange (deep enough for white text to read, 5:1 and
 * up behind the heading and lead), with Parliament House blended into it: the photo is set in the band's
 * colour (luminosity blend, so its light and shade take the orange) and melts into it at the top and
 * sides through a gradient mask, its colonnade standing right behind the cards.
 *   - At the top, the brand: the logo's round mark, large, in a soft halo that blends it into the band.
 *   - The heading, one sentence, its last beat in the light emphasis colour; then the lead, kept to a
 *     reading width (three lines). As the band arrives, the heading's words rise out of their lines one
 *     after another and the lead fades up after them.
 *   - The six cards in a coverflow projected outward like the colonnade (Coverflow): the centre card is
 *     the biggest, in its dark look, and shows its sentence; the cards to the sides are collapsed to their
 *     medallion and title. It plays on its own and pauses on hover, focus and off screen, with arrows,
 *     dots and a pause button under it.
 * Scroll and ambient motion (ui/TextMotion): the band opens out from an inset card as it rises in
 * (data-curtain), Parliament House drifts slowly against the scroll behind the cards (data-par), the
 * heading's light words catch a soft light now and then (data-sweep), the cards rise into place with the
 * scroll (data-rise), and the centre card's head glows, slowly breathing (.lp-glow).
 * Reduced motion: the text is simply there and the cards do not play on their own.
 */
export default function About() {
  const { heading } = aboutIntro;
  const textRef = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(true);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const text = textRef.current;
    const reduced = prefersReducedMotion();
    setStill(reduced);
    if (reduced || !text) return;
    // Already on screen: leave it. Otherwise hide the words until the band arrives.
    if (canvasTop(text) < (window.innerHeight / getCanvasZoom()) * 0.85) return;
    setArrived(false);
    return whenVisible(text, 0.4, () => setArrived(true));
  }, []);

  const words = (text: string, from: number, className?: string, sweep = false) =>
    text.split(" ").map((word, i) => (
      <Fragment key={`${word}-${i}`}>
        {i > 0 && " "}
        <span className="inline-block overflow-clip pb-[0.08em] align-top">
          <span
            data-sweep-unit={sweep || undefined}
            className={cx("inline-block [transition:translate_900ms_var(--ease-out),opacity_900ms_var(--ease-out)]", className)}
            style={{
              translate: arrived ? "0 0" : "0 105%",
              opacity: arrived ? 1 : 0,
              transitionDelay: still ? "0ms" : `${(from + i) * 40}ms`,
            }}
          >
            {word}
          </span>
        </span>
      </Fragment>
    ));
  const leadWords = heading.lead.split(" ").length;

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
        Parliament House, set in the band's colour: the luminosity blend keeps the photo's light and shade
        and takes the hue from the orange under it; the mask melts its sky, sides and forecourt into the band.
        Decoration.
      */}
      <img
        data-par="5"
        src="/images/about/parliament.webp"
        alt=""
        aria-hidden="true"
        width={1920}
        height={1086}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute top-[170px] left-1/2 -z-10 w-[max(112%,1640px)] max-w-none -translate-x-1/2 opacity-[0.62] mix-blend-luminosity contrast-[1.08]"
        style={{ maskImage: PHOTO_MASK, WebkitMaskImage: PHOTO_MASK, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
      />
      {/* A warm wash over the photo, so it reads as part of the orange rather than laid on it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 mix-blend-soft-light"
        style={{ backgroundImage: "linear-gradient(180deg, rgb(255 190 110 / 0) 30%, rgb(255 170 80 / 0.55) 70%, rgb(120 40 10 / 0.6) 100%)" }}
      />

      <div className="mx-auto flex w-canvas flex-col items-center">
        <div ref={textRef} className="flex flex-col items-center text-center">
          {/*
            The brand: the logo's round mark alone (no plate, no wordmark), large, sitting in a soft halo of
            warm light so it melts into the top of the band, as the sun into the sky.
          */}
          <span
            className="relative flex size-[132px] items-center justify-center [transition:opacity_700ms_var(--ease-out),translate_700ms_var(--ease-out)]"
            style={{ opacity: arrived ? 1 : 0, translate: arrived ? "0 0" : "0 12px" }}
          >
            <span aria-hidden="true" className="absolute -inset-16 rounded-full bg-[radial-gradient(closest-side,rgb(255_226_160/0.55),rgb(255_196_110/0.22)_55%,transparent)]" />
            <img
              src="/images/logo-mark.webp"
              alt="Vajiram & Ravi"
              width={168}
              height={171}
              className="relative size-[132px] object-contain drop-shadow-[0_10px_22px_rgb(77_20_4/0.35)]"
            />
          </span>

          <h2 id="about-h" data-sweep="130" className="mt-7 w-[1000px] font-heading text-[52px]/[1.12] font-normal tracking-[-0.02em] text-balance text-white">
            {words(heading.lead, 0)} {words(heading.emphasis, leadWords, "text-[#ffe9b0]", true)}
          </h2>
          <p
            className="mt-6 w-[720px] text-[19px]/[1.6] text-white [transition:opacity_900ms_var(--ease-out),translate_900ms_var(--ease-out)]"
            style={{ opacity: arrived ? 1 : 0, translate: arrived ? "0 0" : "0 16px", transitionDelay: still ? "0ms" : "600ms" }}
          >
            {aboutIntro.lead}
          </p>
        </div>

        {/* The cards rise into place with the scroll (ui/TextMotion, data-rise, measured on this wrapper). */}
        <div className="mt-14 w-full">
          <div data-rise>
        <Coverflow
          items={institutionCards}
          label="Why Vajiram & Ravi"
          itemName="card"
          slideTitle={(card) => card.title}
          renderSlide={(card, { active, expanded }) => <Card card={card} active={active} expanded={expanded} />}
          width={340}
          height={440}
          spacing={[356, 612]}
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
        className="pointer-events-none absolute inset-0 rounded-[24px] border border-saffron/40 bg-[linear-gradient(140.8deg,#5a1a10_7.4%,#9c4019_81.5%)] [transition:opacity_600ms_var(--ease-out)]"
        style={{ opacity: active ? 1 : 0 }}
      />
      {/* In the centre, a warm light breathes slowly at the card's head while the band is on screen (globals.css, .lp-glow). */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-clip rounded-[24px] [transition:opacity_600ms_var(--ease-out)]" style={{ opacity: active ? 1 : 0 }}>
        <span
          className={cx(
            "absolute -top-[30%] left-[-20%] h-[75%] w-[140%] rounded-full bg-[radial-gradient(closest-side,rgb(255_196_110/0.34),rgb(255_170_80/0.12)_55%,transparent)]",
            active && "lp-glow",
          )}
        />
      </span>
      <Medallion icon={card.icon} />
      <h3
        className="relative mt-5 font-heading text-[30px]/[1.15] font-normal [transition:color_600ms_var(--ease-out)]"
        style={{ color: active ? "#fff" : "#2b1206" }}
      >
        {card.title}
      </h3>
      {/* The sentence, unfolding in the centre card. */}
      <div
        className="relative grid w-full [transition:grid-template-rows_700ms_var(--ease-out),opacity_500ms_var(--ease-out)]"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0, transitionDelay: expanded ? "200ms" : "0ms" }}
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

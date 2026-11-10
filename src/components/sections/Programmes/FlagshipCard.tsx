"use client";

import { useEffect, useState } from "react";
import Cta from "@/components/ui/Cta";
import { featuredProgramme } from "@/data/programmes";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";

/** How long each photograph stays before the next fades in, ms. */
const PHOTO_MS = 4500;

/**
 * The card's ground: the hero's gradient (Figma 2484:4261: light orange through the brand orange to deep
 * rust at 144°, under a soft gold glow), with a deep rust shade over it, stronger at the top, so that white
 * text holds WCAG AA everywhere on it (4.5:1 for the body text, at the gradient's lightest point too).
 */
const GROUND = [
  "linear-gradient(90deg, rgb(70 18 2 / 0.16) 35%, rgb(70 18 2 / 0) 75%)",
  "linear-gradient(180deg, rgb(70 18 2 / 0.42) 0%, rgb(70 18 2 / 0.34) 55%, rgb(70 18 2 / 0.18) 100%)",
  "radial-gradient(50% 50% at 50% 50%, rgb(255 217 153 / 0.25), rgb(255 217 153 / 0))",
  "linear-gradient(143.9deg, #fab85c 7.69%, #ed781c 46.15%, #b8400f 84.62%)",
].join(", ");

/** A hyphen that never breaks the line, so "LIVE-Online" always stays in one piece. */
const keepHyphens = (text: string) => text.replace(/LIVE-Online/g, "LIVE‑Online");

/**
 * The featured programme, General Studies Prelims & Mains (the `kevin` branch's featured card, on the hero's
 * orange gradient): on the left its photographs, fading from one to the next under the "Featured programme"
 * tag, with a button to pause them; on the right its name, its line, the four things it covers, who it is
 * for, how it can be taken and its duration, and the two buttons, all on one left edge.
 *
 * Accessibility: white type on the shaded gradient (AA throughout); the buttons are the white and the
 * cream-outline buttons of the dark bands, each with the saffron focus ring; the photographs are
 * decoration, and their slideshow can be paused (WCAG 2.2.2). Reduced motion: the first photograph stays.
 * The card is its own (nested) section, labelled by its name, so its reveal waits for the card itself.
 */
export default function FlagshipCard() {
  const programme = featuredProgramme;
  const [photo, setPhoto] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => setStill(prefersReducedMotion()), []);

  useEffect(() => {
    if (still || paused) return;
    const timer = window.setInterval(() => setPhoto((p) => (p + 1) % programme.photos.length), PHOTO_MS);
    return () => window.clearInterval(timer);
  }, [programme.photos.length, paused, still]);

  return (
    <section
      aria-labelledby="flagship-programme-h"
      data-reveal
      className="relative grid w-full grid-cols-[520px_1fr] overflow-clip rounded-[28px] text-white shadow-[0_24px_48px_-20px_rgb(77_31_8/0.45)]"
      style={{ backgroundImage: GROUND, backgroundColor: "#c9561a" }}
    >
      <img
        src="/images/programmes/lotus-mark.svg"
        alt=""
        aria-hidden="true"
        width={520}
        height={520}
        className="pointer-events-none absolute top-[-250px] left-[1020px] size-[520px] max-w-none opacity-40 mix-blend-screen"
      />

      {/* The photographs (decoration), fading one into the next, with the tag and the pause button. */}
      <div className="relative min-h-[620px] overflow-clip bg-[#8a2812]">
        {/* The photographs drift against the scroll inside their frame (TextMotion, data-par). */}
        <div data-par className="absolute inset-x-0 -inset-y-[7%]">
        {programme.photos.map((p, i) => (
          <img
            key={p.src}
            src={p.src}
            alt=""
            aria-hidden="true"
            width={p.width}
            height={p.height}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full max-w-none object-cover [transition:opacity_1200ms_var(--ease-out),scale_1200ms_var(--ease-out)]"
            style={{ opacity: i === photo ? 1 : 0, scale: i === photo ? "1" : "1.06", objectPosition: "position" in p ? p.position : undefined }}
          />
        ))}
        </div>
        <span className="absolute top-6 left-6 rounded-full bg-white px-4 py-2 font-mono text-[12px]/[16px] tracking-[0.08em] text-[#a8431a] uppercase shadow-rest">
          {programme.tag}
        </span>
        {!still && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play the programme photographs" : "Pause the programme photographs"}
            className="absolute bottom-6 left-6 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-rest [transition:background-color_var(--dur-fast)_var(--ease-out)] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
          >
            <svg aria-hidden="true" viewBox="0 0 14 14" width={14} height={14} fill="currentColor">
              {paused ? <path d="M4 2L12 7L4 12Z" /> : <path d="M3.5 2H6V12H3.5ZM8 2H10.5V12H8Z" />}
            </svg>
          </button>
        )}
      </div>

      <div className="relative flex flex-col items-start p-14">
        <h3 id="flagship-programme-h" className="font-heading text-[48px]/[1.06] tracking-[-0.02em] text-balance text-white">
          {programme.name}
        </h3>
        <p className="mt-3 font-heading text-[22px]/[1.3] text-[#ffe3b3]">{programme.line}</p>

        <ul className="mt-8 flex w-full flex-col gap-3.5">
          {programme.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3.5 text-[17px]/[25px] text-white">
              <span aria-hidden="true" className="flex size-[25px] shrink-0 items-center justify-center rounded-full bg-white text-burnt">
                <svg viewBox="0 0 12 12" width={12} height={12} fill="none">
                  <path d="M2.5 6.2 5 8.5l4.5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {keepHyphens(benefit)}
            </li>
          ))}
        </ul>

        <dl className="mt-9 grid w-full grid-cols-[1.3fr_1fr_1fr] gap-8 border-t border-white/35 pt-7">
          {programme.details.map((detail) => (
            <div key={detail.term} className="flex flex-col gap-2">
              <dt className="font-mono text-[12px]/[16px] tracking-[0.08em] text-cream uppercase">{detail.term}</dt>
              <dd className={cx("text-[16px]/[24px] text-white", detail.value.startsWith("[") && "italic")}>{keepHyphens(detail.value)}</dd>
            </div>
          ))}
        </dl>

        {/* The buttons, on the content's left edge: white for the programme, a cream outline for the batches. */}
        <div className="mt-auto flex items-center gap-3 pt-10">
          <Cta variant="secondary" size="lg" href={programme.primary.href}>
            {programme.primary.label}
          </Cta>
          <Cta variant="secondary-dark" size="lg" href={programme.secondary.href}>
            {programme.secondary.label}
          </Cta>
        </div>
      </div>
    </section>
  );
}

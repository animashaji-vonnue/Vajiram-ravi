"use client";

import { useEffect, useState } from "react";
import Cta from "@/components/ui/Cta";
import { requestEnquiry } from "@/components/sections/Admissions/enquiry";
import { batches, featuredBatch, todayIso, upcomingBatches, type Batch } from "@/data/admissions";
import { featuredProgramme } from "@/data/programmes";
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

/** The flagship programme's batches in the batch CMS (data/admissions): the General Studies ones. */
const isFlagshipBatch = (batch: Batch) => batch.id.startsWith("gs-");

const DAY_MS = 86_400_000;
const dateOf = (iso: string) => new Date(`${iso}T00:00:00`);
const longDate = (iso: string) => dateOf(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

/**
 * The pill's line, from the batch CMS only: whether admissions are open, when the next batch of the
 * programme starts and, once today is known (in the browser), how many days are left until then, and
 * "Limited seats" only when admissions have flagged the batch so. With no upcoming batch in the CMS, the
 * featured batch's start as the batch ticket shows it.
 */
function admissionsLine(today: string | null): string {
  const batch = (today ? upcomingBatches(today) : [...batches].sort((a, b) => a.startDate.localeCompare(b.startDate))).find(isFlagshipBatch);
  if (!batch) return `Next batch starts ${featuredBatch.start}`;
  const parts: string[] = [];
  if (batch.admissionOpen) parts.push("Admissions open");
  parts.push(`Next batch starts ${longDate(batch.startDate)}`);
  if (today) {
    const days = Math.round((dateOf(batch.startDate).getTime() - dateOf(today).getTime()) / DAY_MS);
    parts.push(days === 0 ? "Classes begin today" : days === 1 ? "Only 1 day to go" : `Only ${days} days to go`);
  }
  if (batch.seatStatus === "limited") parts.push("Limited seats");
  return parts.join(" · ");
}

/**
 * The tag over the photographs, after the hero's pill (Hero, Ticker): the butta (the benefits' Indian flower
 * bullet, turning slowly) and "Flagship programme", then a window through which the admissions line glides
 * past (globals.css, .hero-glide), faded at both ends. It links to the upcoming batches. Reduced motion: the
 * line and the flower stand still.
 */
function AdmissionsTicker({ tag }: { tag: string }) {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(todayIso()), []);
  const line = admissionsLine(today);
  return (
    <a
      href="#batches"
      className="group/ticker absolute top-6 left-6 flex w-[490px] items-center gap-3.5 rounded-full bg-mahogany/80 py-1.5 pr-5 pl-1.5 text-white ring-1 ring-white/20 [transition:background-color_var(--dur-fast)_var(--ease-out)] hover:bg-mahogany focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
    >
      <span className="flex shrink-0 items-center gap-2 rounded-full bg-saffron px-3.5 py-1 text-[15px]/[20px] font-bold text-mahogany">
        {/* The butta, the same Indian flower as the benefits' bullets, turning slowly. */}
        <img
          src="/images/ornaments/butta.svg"
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
          className="size-4 shrink-0 animate-[spin_9s_linear_infinite] motion-reduce:animate-none"
        />
        {tag}
      </span>
      <span className="relative h-5 min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)]">
        <span key={line} className="hero-glide absolute top-0 left-0 flex text-[15px]/[20px] font-medium whitespace-nowrap">
          <span className="pr-10">{line}</span>
          <span className="pr-10" aria-hidden="true">
            {line}
          </span>
        </span>
      </span>
    </a>
  );
}

/**
 * The flagship programme, General Studies Prelims & Mains (the `kevin` branch's featured card, on the hero's
 * orange gradient): on the left its classroom photographs, fading from one to the next under the
 * "Flagship programme" pill with the admissions line gliding through it (AdmissionsTicker), with a button
 * to pause them; on the right its name, the three things it covers, how it can be taken and its
 * duration, and the two buttons, all on one left edge.
 *
 * Accessibility: white type on the shaded gradient (AA throughout); the buttons are the white and the
 * cream-outline buttons of the dark bands, each with the saffron focus ring; the photographs are
 * decoration, and their slideshow can be paused (WCAG 2.2.2). Reduced motion: the first photograph stays.
 * The card is its own (nested) section, labelled by its name, so its reveal waits for the card itself.
 *
 * Motion (ui/TextMotion): the card rises and grows into place (data-zoom); its name rises letter by letter
 * (data-split) and its three points follow one by one (data-stagger); the detail labels settle out of
 * shuffling glyphs (data-scramble) and the duration counts up (data-count); the photographs drift inside
 * their frame (data-par) and the lotus turns slowly with the scroll (data-turn).
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
      data-zoom
      className="relative grid w-full grid-cols-[520px_1fr] overflow-clip rounded-[28px] text-white shadow-[0_24px_48px_-20px_rgb(77_31_8/0.45)]"
      style={{ backgroundImage: GROUND, backgroundColor: "#c9561a" }}
    >
      <img
        src="/images/programmes/lotus-mark.svg"
        alt=""
        aria-hidden="true"
        width={520}
        height={520}
        data-turn="36"
        className="pointer-events-none absolute top-[-250px] left-[1020px] size-[520px] max-w-none opacity-40 mix-blend-screen"
      />

      {/* The photographs (decoration), fading one into the next, with the pill and the pause button. */}
      <div className="relative min-h-[500px] overflow-clip bg-[#8a2812]">
        {/* The photographs drift against the scroll inside their frame (TextMotion, data-par). */}
        <div data-par className="absolute inset-x-0 -inset-y-[7%]">
          {programme.photos.map((p, i) => (
            <img
              key={`${p.src}-${i}`}
              src={p.src}
              alt=""
              aria-hidden="true"
              width={p.width}
              height={p.height}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full max-w-none object-cover [transition:opacity_1200ms_var(--ease-out),scale_1200ms_var(--ease-out)]"
              style={{ opacity: i === photo ? 1 : 0, scale: i === photo ? "1" : "1.06", objectPosition: p.position }}
            />
          ))}
        </div>
        {/* A shade along the top, so the pill reads on any photograph. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgb(43_18_6/0.45),transparent)]" />
        <AdmissionsTicker tag={programme.tag} />
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

      <div className="relative flex flex-col items-start px-14 py-12">
        <h3 id="flagship-programme-h" data-split className="font-heading text-[44px]/[1.06] tracking-[-0.02em] text-balance text-white">
          {programme.name}
        </h3>
        <ul data-stagger className="mt-7 flex w-full flex-col gap-2.5">
          {programme.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-[17px]/[25px] text-white">
              <img src="/images/ornaments/butta-cream.svg" alt="" aria-hidden="true" width={16} height={16} className="mt-[5px] size-4 shrink-0" />
              <span>
                {/* The figures carry the weight (bold, not colour). */}
                {keepHyphens(benefit)
                  .split(/(\d+\+?)/)
                  .map((part, i) => (/^\d/.test(part) ? <strong key={i} className="font-bold">{part}</strong> : part))}
              </span>
            </li>
          ))}
        </ul>

        {/* How it can be taken: a small note, not a block of its own. */}
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/30 py-1 pr-3.5 pl-2.5 text-[14px]/[20px] text-cream">
          <svg aria-hidden="true" viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
            <rect x={1.5} y={2.5} width={13} height={8.5} rx={1.2} />
            <path d="M5.5 13.5h5M8 11v2.5" />
          </svg>
          {programme.modes}
        </p>

        {/*
          The buttons, on the content's left edge: white to enrol (it opens the counselling postcard with the
          programme chosen; TODO: the programme's enrolment page once there is one), a cream outline to the
          programme's page.
        */}
        <div className="mt-auto flex items-center gap-3 pt-9">
          <Cta variant="secondary" size="lg" onClick={() => requestEnquiry(programme.name)}>
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

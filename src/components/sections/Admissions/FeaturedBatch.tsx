"use client";

import { useEffect, useRef } from "react";
import Cta from "@/components/ui/Cta";
import { featuredBatch } from "@/data/admissions";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/* The motion tokens, for the Web Animations API (which cannot read CSS variables). */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
const DUR_FAST = 200;
const DUR_BASE = 320;
/** As the batch tickets (BatchTrack): the digits flip 60ms apart, then the stamp comes down in 220ms. */
const DIGIT_STAGGER_MS = 60;
const STAMP_MS = 220;
const SHAKE_PX = 2;

/** The ticket's paper, as the batch tickets' body. */
const PAPER = "bg-[#ffefd5]";

/**
 * The featured batch (content "Featured Batch") on a wide railway ticket, 1280 × 188, in the batch tickets'
 * language: the burnt orange head (308 wide, as a ticket) with the lotus mark and the target year in large
 * Mukta (where the tickets have the date), the peach body with the programme and its details (start,
 * mode, location; a value may take two lines) under small labels, then the perforation between two notches
 * and the counterfoil, stamped "Admissions open", with the button to the programme's page.
 *
 * When it is first seen the year's digits flip in like a departure board and the stamp comes down with a
 * 2px shake of the ticket, as on the batch tickets; then, while the band is on screen, the stamp wobbles
 * now and then (.lp-wobble) and the detail labels settle out of shuffling glyphs as they come in
 * (ui/TextMotion, data-scramble). With reduced motion they are simply there.
 */
export default function FeaturedBatch() {
  const ref = useRef<HTMLDivElement>(null);
  const batch = featuredBatch;

  useEffect(() => {
    const ticket = ref.current;
    if (!ticket || prefersReducedMotion() || typeof ticket.animate !== "function") return;
    const digits = Array.from(ticket.querySelectorAll<HTMLElement>("[data-flip-digit]"));
    const stamp = ticket.querySelector<HTMLElement>("[data-stamp]");
    const waiting = stamp ? [...digits, stamp] : digits;
    waiting.forEach((el) => (el.style.opacity = "0"));

    const animations: Animation[] = [];
    const cancel = whenVisible(ticket, 0.4, () => {
      waiting.forEach((el) => (el.style.opacity = ""));
      digits.forEach((digit, i) => {
        animations.push(
          digit.animate(
            [
              { opacity: 0, transform: "perspective(320px) rotateX(90deg)" },
              { opacity: 1, offset: 0.3 },
              { opacity: 1, transform: "perspective(320px) rotateX(0deg)" },
            ],
            { duration: DUR_BASE, delay: DUR_BASE + i * DIGIT_STAGGER_MS, easing: EASE_OUT, fill: "backwards" },
          ),
        );
      });
      if (!stamp) return;
      const delay = DUR_BASE * 2 + digits.length * DIGIT_STAGGER_MS;
      animations.push(
        stamp.animate(
          [
            { opacity: 0, transform: "scale(1.3)" },
            { opacity: 1, transform: "scale(1)" },
          ],
          { duration: STAMP_MS, delay, easing: EASE_OUT, fill: "backwards" },
        ),
        ticket.animate(
          [
            { transform: "translateX(0)" },
            { transform: `translateX(-${SHAKE_PX}px)` },
            { transform: `translateX(${SHAKE_PX}px)` },
            { transform: `translateX(-${SHAKE_PX / 2}px)` },
            { transform: "translateX(0)" },
          ],
          { duration: DUR_FAST, delay: delay + STAMP_MS * 0.8, easing: EASE_IN_OUT },
        ),
      );
    });
    return () => {
      cancel();
      animations.forEach((animation) => animation.cancel());
      waiting.forEach((el) => (el.style.opacity = ""));
    };
  }, []);

  return (
    <article aria-labelledby="featured-batch-h" data-reveal className="w-full">
      {/* The ticket itself, inside the revealed box so its shake does not fight the reveal's rise. */}
      <div ref={ref} className="relative flex h-[188px] w-full">
        {/* The head: the label, the target year and what the programme prepares for. */}
        <div className="relative flex w-[308px] shrink-0 flex-col items-start justify-center overflow-clip rounded-l-[18px] bg-[#ec5800] px-6 whitespace-nowrap">
          {/* The whole lotus (the tickets' one is cut to their 108px head), its centre where theirs is; the head's rounded edge crops it. */}
          <img
            src="/images/admissions/ticket-lotus-full.svg"
            alt=""
            aria-hidden="true"
            width={260}
            height={260}
            className="pointer-events-none absolute -top-[58px] left-[124px] max-w-none"
          />
          <p className="relative text-[13px]/[16px] font-bold tracking-[0.01em] text-saffron">{batch.label}</p>
          <p className="relative mt-1.5 font-heading text-[64px]/[64px] text-white">
            <span className="sr-only">{batch.targetYear}</span>
            <span aria-hidden="true">
              {String(batch.targetYear)
                .split("")
                .map((digit, i) => (
                  <span key={i} data-flip-digit className="inline-block">
                    {digit}
                  </span>
                ))}
            </span>
          </p>
          <p className="relative mt-2 text-[13px]/[16px] font-bold tracking-[0.01em] text-white/90">{batch.kind}</p>
        </div>

        {/* The body: the programme and its details. */}
        <div className={`flex min-w-0 flex-1 flex-col justify-center px-10 ${PAPER}`}>
          <h3 id="featured-batch-h" className="font-heading text-[32px]/[1.15] tracking-[-0.01em] text-mahogany">
            {batch.programme}
          </h3>
          <dl className="mt-5 grid grid-cols-3 items-start gap-x-8">
            {[
              { label: batch.details.start, value: batch.start },
              { label: batch.details.mode, value: batch.mode },
              { label: batch.details.location, value: batch.location },
            ].map((detail) => (
              <div key={detail.label} className="flex flex-col gap-1.5">
                <dt data-scramble className="font-mono text-[11px]/[14px] tracking-[0.01em] text-clay">{detail.label}</dt>
                <dd className="text-[15px]/[21px] font-semibold text-ink">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The counterfoil: the perforation and its notches, the stamp and the button. */}
        <div className={`relative flex w-[280px] shrink-0 flex-col items-center justify-center gap-5 rounded-r-[18px] ${PAPER}`}>
          <svg aria-hidden="true" width={1.5} height={152} viewBox="0 0 1.5 152" className="absolute top-[18px] left-0">
            <line x1={0.75} y1={0} x2={0.75} y2={152} stroke="#2B1206" strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray="6.09 6.09" />
          </svg>
          <span aria-hidden="true" className="absolute -top-3.5 -left-3.5 size-7 rounded-full bg-cream" />
          <span aria-hidden="true" className="absolute -bottom-3.5 -left-3.5 size-7 rounded-full bg-cream" />

          {/* "Admissions open" as a rubber stamp: a double rule in deep burnt, turned 6°. */}
          <p className="lp-wobble -rotate-6" style={{ animationDelay: "-2.6s" }}>
            <span
              data-stamp
              className="relative block rounded-md border-2 border-[#a8431a] px-4 py-2 text-[13px]/[16px] font-bold tracking-[0.08em] whitespace-nowrap text-[#a8431a] uppercase"
            >
              <span aria-hidden="true" className="absolute inset-[3px] rounded-[3px] border border-[#a8431a]/60" />
              {batch.status}
            </span>
          </p>
          <Cta variant="primary" size="md" href={batch.cta.href}>
            {batch.cta.label}
          </Cta>
        </div>
      </div>
    </article>
  );
}

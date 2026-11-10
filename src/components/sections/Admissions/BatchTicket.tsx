"use client";

import type { PointerEvent } from "react";
import IndianLink from "@/components/ui/IndianLink";
import type { Batch } from "@/data/admissions";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { dateParts } from "./dates";
import { requestEnquiry } from "./enquiry";

/**
 * The ticket heads of the design, in turn (Figma "ticket head"): burnt orange with the lotus mark,
 * marigold, terracotta with mahogany text, and mahogany. A batch keeps its colour whatever the filters show.
 */
const TONES = [
  { head: "bg-[#ec5800]", month: "text-saffron", day: "text-white", target: "text-white/90", lotus: true },
  { head: "bg-[#ff9f02]", month: "text-saffron", day: "text-white", target: "text-white/90", lotus: false },
  { head: "bg-[#e2725b]", month: "text-mahogany", day: "text-mahogany", target: "text-mahogany", lotus: false },
  { head: "bg-mahogany", month: "text-saffron", day: "text-white", target: "text-white/90", lotus: false },
] as const;

/** The perforation as drawn: 6.09px dashes and gaps (22 of each over 268px), starting on half a dash. */
const DASH = 268 / 44;
const DASH_OFFSET = DASH / 2;
/** On hover the dashes run on two whole periods, so the line ends exactly as it started. */
const TEAR_SHIFT = DASH * 4;
const TEAR_MS = 600;
/** --ease-out, for the Web Animations API (which cannot read CSS variables). */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

type BatchTicketProps = {
  batch: Batch;
  /** The batch's place among all batches, which picks its head colour. */
  tone: number;
};

/**
 * One railway ticket (Figma "ticket – …", 308 × 360): the coloured head with the start date and the target
 * year, the programme, its modes and, where admissions have confirmed it, "Admissions open"; the perforation
 * between the notches, then "Register now", which opens the counselling postcard with this programme. A
 * batch with limited seats carries the round rubber stamp.
 *
 * Hover (or keyboard focus inside it) lifts the ticket 8px, runs the perforation's dashes along once as if
 * it were being torn, and turns the medallions (the ticket is their `group/medal`). Its shadow is a soft
 * contact shadow: a warm, blurred patch a little narrower than the ticket and set below it, so it reads as
 * lifted off the page and stays within the room the track leaves around it. The departure-board flip of the date and the stamp coming down are played by the
 * track when it is first seen (`data-flip-digit`, `data-stamp`).
 */
export default function BatchTicket({ batch, tone }: BatchTicketProps) {
  const look = TONES[tone % TONES.length];
  const { year, month, day } = dateParts(batch.startDate);
  const limited = batch.seatStatus === "limited";
  const modes = batch.modes.join(" & ");

  const tear = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
    const line = event.currentTarget.querySelector<SVGLineElement>("[data-perforation]");
    if (!line || typeof line.animate !== "function" || line.getAnimations().length) return;
    line.animate([{ strokeDashoffset: `${DASH_OFFSET}px` }, { strokeDashoffset: `${DASH_OFFSET - TEAR_SHIFT}px` }], {
      duration: TEAR_MS,
      easing: EASE_OUT,
    });
  };

  return (
    <article
      data-ticket
      onPointerEnter={tear}
      className="group/ticket group/medal relative h-[360px] w-[308px] [transition:translate_var(--dur-base)_var(--ease-out)] hover:-translate-y-2 has-[:focus-visible]:-translate-y-2"
    >
      {/* The lifted ticket's shadow: it only fades in. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-5 top-6 -bottom-2 rounded-[18px] bg-[#4d1f08] opacity-0 blur-[11px] [transition:opacity_var(--dur-fast)_var(--ease-out)] group-hover/medal:opacity-24"
      />
      <img src="/images/admissions/ticket-body.svg" alt="" aria-hidden="true" width={308} height={360} className="absolute top-0 left-0" />

      <div className={cx("absolute inset-x-0 top-0 h-[108px] overflow-clip rounded-t-[18px] whitespace-nowrap", look.head)}>
        {look.lotus && (
          <img
            src="/images/admissions/ticket-lotus.svg"
            alt=""
            aria-hidden="true"
            width={204}
            height={108}
            className="pointer-events-none absolute top-0 left-[104px] max-w-none"
          />
        )}
        <p aria-hidden="true" className={cx("absolute top-[22px] left-5 text-[13px]/[16px] font-bold tracking-[1.82px] uppercase", look.month)}>
          {month}
        </p>
        <p aria-hidden="true" className={cx("absolute top-9 left-5 font-heading text-[64px]/[64px]", look.day)}>
          {String(day)
            .split("")
            .map((digit, i) => (
              <span key={i} data-flip-digit className="inline-block">
                {digit}
              </span>
            ))}
        </p>
        <p className="sr-only">
          Starts <time dateTime={batch.startDate}>{`${day} ${month} ${year}`}</time>
        </p>
        <p className={cx("absolute top-6 right-[31px] text-[11px]/[14px] font-bold tracking-[0.66px]", look.target)}>
          Target: UPSC CSE {batch.targetYear}
        </p>
      </div>

      <div className="absolute top-32 left-5 flex w-[268px] flex-col items-start gap-2">
        <h3 className="text-[18px]/[24px] font-bold text-mahogany">{batch.programme}</h3>
        {modes && <p className="text-[13px]/[18px] font-medium text-clay">{modes}</p>}
        {batch.admissionOpen && (
          <p className="flex items-center gap-1.5 text-[11px]/[14px] font-bold tracking-[0.08em] text-[#a8431a] uppercase">
            <span aria-hidden="true" className="size-1.5 rotate-45 bg-current" />
            Admissions open
          </p>
        )}
      </div>

      {/* The perforation between the notches, drawn inline so its dashes can run on hover. */}
      <svg aria-hidden="true" width={268} height={1.5} viewBox="0 0 268 1.5" className="absolute top-[275.25px] left-5 overflow-visible">
        <line
          data-perforation
          x1={0}
          y1={0.75}
          x2={268}
          y2={0.75}
          stroke="#2B1206"
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeDasharray={`${DASH} ${DASH}`}
          strokeDashoffset={DASH_OFFSET}
        />
      </svg>

      <div className="absolute inset-x-5 top-[304px] flex items-center justify-between">
        <IndianLink tone="light" onClick={() => requestEnquiry(batch.programme)} ariaLabel={`Register now for ${batch.programme}`}>
          Register now
        </IndianLink>
      </div>

      {limited && (
        <>
          <p className="sr-only">Limited seats</p>
          {/* The rubber stamp (Figma "rubber stamp – Limited seats"): 96px, turned 14°, at 85%. */}
          <div aria-hidden="true" className="pointer-events-none absolute top-[182.19px] left-[184.97px] size-24 rotate-14 opacity-85">
            <div data-stamp className="absolute inset-0">
              <img src="/images/admissions/stamp-limited-ring.svg" alt="" width={94} height={94} className="absolute top-px left-px max-w-none" />
              <p className="absolute inset-x-0 top-[34px] pl-[1.2px] text-center text-[12px]/[14px] font-bold tracking-[1.2px] whitespace-nowrap text-[#e34234]">
                LIMITED
              </p>
              <p className="absolute inset-x-0 top-[50px] pl-[1.2px] text-center text-[12px]/[14px] font-bold tracking-[1.2px] whitespace-nowrap text-[#e34234]">
                SEATS
              </p>
            </div>
          </div>
        </>
      )}
    </article>
  );
}

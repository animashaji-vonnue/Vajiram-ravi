"use client";

import { useEffect, useRef, useState } from "react";
import { batches, type Batch } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionIntro";
import { cx } from "@/lib/cx";

/** Card width plus the gap between cards: how far one press of an arrow moves the rail. */
const STEP = 308 + 16;

/**
 * One batch as an admission ticket, after the design (Figma 2257:9039): a peach ticket with a notch either side of a
 * dashed tear line; a coloured head with the start month, the day large in the serif and the examination it targets
 * (the first carries a lotus mark); then the programme, how it is taught, a "limited seats" rubber stamp where it
 * applies, and under the tear line a link to register.
 */
function Ticket({ batch }: { batch: Batch }) {
  const light = batch.tone === "light";
  return (
    <li className="relative h-[360px] w-[308px] shrink-0 snap-start">
      {/* eslint-disable-next-line @next/next/no-img-element -- the ticket's notched outline, a fixed-size SVG */}
      <img src="/images/batches/ticket-body.svg" alt="" width={308} height={360} className="absolute inset-0" />
      <div
        className={cx(
          "absolute inset-x-0 top-0 h-[108px] overflow-clip rounded-t-[18px] px-5",
          light ? "text-white" : "text-ink-900",
        )}
        style={{ background: batch.head }}
      >
        {batch.mark && (
          // eslint-disable-next-line @next/next/no-img-element -- the lotus mark, a fixed-size SVG
          <img
            src="/images/batches/mark-lotus.svg"
            alt=""
            width={204}
            height={108}
            className="absolute top-0 left-[104px]"
          />
        )}
        <p className="relative flex items-start justify-between pt-[22px]">
          <span
            className={cx(
              "text-[13px]/[16px] font-semibold tracking-[0.14em] uppercase",
              light ? "text-[#f4c430]" : "text-ink-900",
            )}
          >
            {batch.month}
          </span>
          <span className={cx("text-[11px]/[14px] font-semibold tracking-[0.06em]", light && "text-white/90")}>
            Target: {batch.target}
          </span>
        </p>
        <p className="relative font-serif text-[64px]/[64px]">{batch.day}</p>
      </div>

      <div className="absolute inset-x-5 top-[128px]">
        <h3 className="text-[18px]/[24px] font-semibold text-[#2b1206]">{batch.title}</h3>
        {batch.mode && <p className="mt-2 text-[13px]/[18px] font-medium text-[#6b4a3a]">{batch.mode}</p>}
      </div>

      {batch.limited && (
        <span
          aria-label="Limited seats"
          className="absolute top-[182px] left-[185px] flex size-[96px] rotate-14 flex-col items-center justify-center opacity-85"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- the rubber stamp's ring, a fixed-size SVG */}
          <img src="/images/batches/stamp-ring.svg" alt="" width={94} height={94} className="absolute top-px left-px" />
          <span aria-hidden="true" className="text-[12px]/[16px] font-bold tracking-[0.1em] text-[#e34234]">
            LIMITED
          </span>
          <span aria-hidden="true" className="text-[12px]/[16px] font-bold tracking-[0.1em] text-[#e34234]">
            SEATS
          </span>
        </span>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element -- the dashed tear line, a fixed-size SVG */}
      <img src="/images/batches/tear-line.svg" alt="" width={268} height={2} className="absolute top-[275px] left-5" />
      <a
        href={batch.href}
        className="group absolute top-[304px] left-5 flex items-center gap-2 text-[15px]/[22px] font-semibold text-[#c50]"
        aria-label={`Register now for ${batch.title}`}
      >
        Register now
        {/* eslint-disable-next-line @next/next/no-img-element -- the arrow medallion, a fixed-size SVG */}
        <img
          src="/images/batches/arrow-medallion.svg"
          alt=""
          width={26}
          height={26}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </a>
    </li>
  );
}

/** A round arrow button for the rail; dark when it can move the rail, faded when it can't. */
function RailButton({
  label,
  icon,
  primary,
  disabled,
  onClick,
}: {
  label: string;
  icon: string;
  primary?: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "flex size-11 items-center justify-center rounded-full border transition-[background-color,opacity] disabled:cursor-default disabled:opacity-35",
        primary ? "border-ink-900 bg-ink-900 hover:bg-ink-700" : "border-ink-900/15 bg-white hover:bg-paper",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- the arrow icon, a fixed-size SVG */}
      <img src={icon} alt="" width={14} height={14} />
    </button>
  );
}

/**
 * Upcoming batches and admissions, on white, after the design (Figma 2257:9039): the "Admissions" label and headline
 * beside a line on how to register; previous and next buttons above a rail of batch tickets, which scrolls sideways
 * when there are more than fit; and a button to view all batches.
 */
export default function Batches() {
  const rail = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  // Which ends of the rail are reached, so each arrow is only live when it can move it.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const move = (direction: number) => rail.current?.scrollBy({ left: direction * STEP, behavior: "smooth" });

  return (
    <section id="batches" aria-labelledby="batches-title" className="scroll-mt-[76px] bg-white pt-24 pb-28">
      <div className="mx-auto w-canvas px-20">
        <div className="fade-up flex items-end justify-between gap-16">
          <div>
            <Eyebrow>{batches.eyebrow}</Eyebrow>
            <h2 id="batches-title" className="mt-4 font-serif text-[60px]/[1.04] tracking-[-0.015em] text-ink-900">
              {batches.headline}
            </h2>
          </div>
          <p className="w-[420px] pb-3 text-[16px]/[1.55] text-muted">{batches.description}</p>
        </div>

        <div className="mt-12 flex justify-end gap-2.5">
          <RailButton
            label="Previous batches"
            icon="/images/batches/icon-left.svg"
            disabled={edges.start}
            onClick={() => move(-1)}
          />
          <RailButton
            label="Next batches"
            icon="/images/batches/icon-right.svg"
            primary
            disabled={edges.end}
            onClick={() => move(1)}
          />
        </div>

        <ul
          ref={rail}
          aria-label="Upcoming batches"
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {batches.list.map((batch) => (
            <Ticket key={batch.title} batch={batch} />
          ))}
        </ul>

        <div className="mt-12 flex justify-end">
          <Button href={batches.all.href} tone="ghost-dark" size="md">
            {batches.all.label}
          </Button>
        </div>
      </div>
    </section>
  );
}

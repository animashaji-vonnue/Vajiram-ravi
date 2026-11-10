"use client";

import Coverflow from "@/components/ui/Coverflow";
import Photo from "@/components/ui/Photo";
import type { Educator } from "@/data/faculty";
import { cx } from "@/lib/cx";

/** The autoplay step, ms. */
const AUTOPLAY_MS = 4500;

/**
 * The educators in the shared coverflow (the same one as About): portrait cards, the centre one the
 * biggest and in colour, the ones to the sides smaller, turned away, in black and white (colour on hover)
 * and collapsed to the name at their foot. Under the centre card, joined to it, its educator is
 * introduced: the name, the subject, the introduction and the qualifications and experience, cross-fading
 * as the centre changes. It plays on its own, pausing on hover, focus and off screen.
 */
export default function EducatorFlow({ educators }: { educators: Educator[] }) {
  return (
    <Coverflow
      items={educators}
      label="Our educators"
      itemName="educator"
      slideTitle={(educator) => `${educator.name}, ${educator.focus}`}
      renderSlide={(educator, { active, copy }) => <EducatorCard educator={educator} active={active} copy={copy} />}
      renderCaption={(educator) => <Caption educator={educator} />}
      width={300}
      height={410}
      spacing={[296, 520]}
      scales={[0.8, 0.64]}
      turns={[16, 26]}
      interval={AUTOPLAY_MS}
      tone="light"
      gap={32}
    />
  );
}

/**
 * One educator, 300 × 410: the portrait filling a rounded card. To the side it is black and white (colour
 * on hover) with a dark fade at its foot holding the name; in the centre it is in colour and the name
 * leaves the card for the caption under it. With a profile page the card is a link; without one it is a
 * still article. The slide carries all of the educator's lines for assistive technology.
 */
function EducatorCard({ educator, active, copy }: { educator: Educator; active: boolean; copy: boolean }) {
  const { name, focus, photo, profile, qualifications, experience, introduction } = educator;
  const details = [focus, qualifications, experience, introduction].filter(Boolean).join(". ");
  const className = cx(
    "group/card relative block size-full overflow-hidden rounded-[22px] bg-[#24211e] [transition:box-shadow_600ms_var(--ease-out)]",
    active ? "shadow-[0_30px_60px_rgb(77_31_8/0.32)]" : "shadow-rest",
  );
  const content = (
    <>
      {/* The name is right with it, so the portrait itself is not announced. */}
      <Photo
        src={photo}
        alt=""
        sizes="300px"
        className="absolute inset-0 bg-[#24211e]"
        imageClassName={active ? "grayscale-0" : "grayscale group-hover/card:grayscale-0"}
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[190px] bg-linear-to-b from-[rgb(18_17_16/0)] to-[rgb(18_17_16/0.92)] [transition:opacity_600ms_var(--ease-out)]"
        style={{ opacity: active ? 0 : 1 }}
      />
      <div className="absolute inset-x-5 bottom-6 [transition:opacity_500ms_var(--ease-out)]" style={{ opacity: active ? 0 : 1 }}>
        <h3 className="font-heading text-[28px]/[1.15] font-normal text-white">{name}</h3>
        {details && <p className="sr-only">{details}</p>}
      </div>
    </>
  );
  if (profile !== null) {
    return (
      <a href={profile} draggable={false} tabIndex={copy ? -1 : undefined} className={className}>
        {content}
      </a>
    );
  }
  return <article className={className}>{content}</article>;
}

/** Under the centre card: the name, the subject, the introduction, then the qualifications and experience. */
function Caption({ educator }: { educator: Educator }) {
  const { name, focus, introduction, qualifications, experience } = educator;
  const facts = [qualifications, experience].filter(Boolean).join(" · ");
  return (
    <div className="mx-auto flex w-[640px] flex-col items-center gap-2 text-center">
      <p className="font-heading text-[32px]/[1.15] text-ink">{name}</p>
      <p className="font-mono text-[15px]/[1.4] tracking-[0.02em] text-burnt">{focus}</p>
      {introduction && <p className="mt-2 text-[18px]/[1.6] text-clay">{introduction}</p>}
      {facts && <p className="mt-1 font-mono text-[15px]/[1.4] tracking-[0.02em] text-clay">{facts}</p>}
    </div>
  );
}

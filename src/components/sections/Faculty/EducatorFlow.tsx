"use client";

import CircularCarousel from "@/components/ui/CircularCarousel";
import type { Educator } from "@/data/faculty";

/** The autoplay step, ms. */
const AUTOPLAY_MS = 4500;

/**
 * The educators on a circular carousel (after React Bits' "Circular Carousel"): portrait cards standing
 * round a ring, each bent to follow it, the camera looking a little down onto it. The card at the front is
 * in colour; the rest are in black and white (colour on hover) and fade into the cream as they turn away.
 * Under the ring the front educator is introduced: the name, the subject, the introduction and the
 * qualifications and experience, cross-fading as the front changes. It turns by drag, swipe, arrows, dots
 * and keys, and plays on its own, pausing while the pointer is on the front card, on keyboard focus and
 * off screen (and with its pause button).
 */
export default function EducatorFlow({ educators }: { educators: Educator[] }) {
  return (
    <CircularCarousel
      items={educators}
      label="Our educators"
      itemName="educator"
      slideTitle={(educator) => `${educator.name}, ${educator.focus}`}
      image={(educator) => educator.photo}
      href={(educator) => educator.profile}
      renderSlide={(educator) => <SlideText educator={educator} />}
      renderCaption={(educator) => <Caption educator={educator} />}
      width={264}
      height={372}
      gap={30}
      interval={AUTOPLAY_MS}
      fadeColor="#fff8ec"
      backColor="#ead9c2"
      tone="light"
      spacing={28}
    />
  );
}

/** The slide's content for assistive technology: the card itself is only the portrait. */
function SlideText({ educator }: { educator: Educator }) {
  const { name, focus, qualifications, experience, introduction } = educator;
  const details = [focus, qualifications, experience, introduction].filter(Boolean).join(". ");
  return (
    <>
      <h3>{name}</h3>
      {details && <p>{details}</p>}
    </>
  );
}

/** Under the ring: the name, the subject, the introduction, then the qualifications and experience. */
function Caption({ educator }: { educator: Educator }) {
  const { name, focus, introduction, qualifications, experience } = educator;
  const facts = [qualifications, experience].filter(Boolean).join(" · ");
  return (
    <div className="mx-auto flex w-[640px] flex-col items-center gap-2 text-center">
      <p className="font-heading text-[32px]/[1.15] text-ink">{name}</p>
      <p className="text-[15px]/[1.4] tracking-[0.02em] text-burnt">{focus}</p>
      {introduction && <p className="mt-2 text-[18px]/[1.6] text-clay">{introduction}</p>}
      {facts && <p className="mt-1 text-[15px]/[1.4] tracking-[0.02em] text-clay">{facts}</p>}
    </div>
  );
}

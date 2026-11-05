"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Linkedin, NavArrowLeft, NavArrowRight } from "iconoir-react";
import { faculty } from "@/data/home";
import { Lozenge, TitleRule } from "@/components/ui/Ornaments";
import { cx } from "@/lib/cx";
import SplitHeading from "@/components/ui/SplitHeading";

/** The heading's ornaments' colour, the gilt of the toppers' frame. */
const GILT = "#c9a96a";

/** A round arrow button under the carousel. */
function Arrow({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-full border border-brown-950/30 text-brown-950 transition-colors hover:bg-brown-950 hover:text-white disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}

/** A card's width and the gap between cards, in canvas pixels (the row's `w-[360px]` and `gap-6`). */
const CARD = 360;
const GAP = 24;

/**
 * Faculty, with the content of the design's section (3362:45512) in the site's own look and the layout of the
 * brief's sketch: a centred heading block (the heading in spaced Noto Serif capitals between gilt double rules, as
 * the brief's "Best sellers" heading, a lozenge under it and the intro), then a cream panel with a Mughal library in
 * line art across its top and a row of teachers standing in front of its shelves. Each is a portrait under a Mughal
 * arch in a gold (#E3A75F) mat, like the matted photos in "Why Vajiram & Ravi", with the name in the headline serif
 * and the subject under it. The row scrolls sideways, by the arrows or by hand, and the diamonds under it show which
 * part of it is in view.
 */
export default function Faculty() {
  const track = useRef<HTMLUListElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const scrollable = el.scrollWidth - el.clientWidth;
      // A page is the cards in view plus the gap after them.
      const step = el.clientWidth + GAP;
      setPages(Math.max(1, Math.ceil((el.scrollWidth + GAP) / step)));
      setPage(
        el.scrollLeft >= scrollable - 1
          ? Math.ceil((el.scrollWidth + GAP) / step) - 1
          : Math.round(el.scrollLeft / step),
      );
      setAtStart(el.scrollLeft <= 1);
      setAtEnd(el.scrollLeft >= scrollable - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Moves the row on by a page: the cards in view give way to the next ones.
  const move = (direction: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: direction * (el.clientWidth + GAP), behavior: "smooth" });
  };

  return (
    <section aria-labelledby="faculty-title" className="py-32 text-brown-950">
      {/* The heading as in the brief's "Best sellers": spaced capitals between gilt double rules, a lozenge under it. */}
      <div data-reveal className="mx-auto flex w-canvas flex-col items-center text-center">
        <div className="flex items-center gap-5">
          <TitleRule colour={GILT} className="w-[150px] flex-none" />
          <h2
            data-split
            id="faculty-title"
            className="font-noto-serif text-[30px]/[40px] font-bold tracking-[0.12em] uppercase"
          >
            <SplitHeading text={faculty.heading} />
          </h2>
          <TitleRule colour={GILT} mirrored className="w-[150px] flex-none" />
        </div>
        <Lozenge colour={GILT} className="mt-3" />
        <p className="mt-6 w-[520px] font-noto-serif text-[18px]/[30px] text-brown-950/75">{faculty.intro}</p>
      </div>

      {/* The panel: the library across its top, with the teachers standing in front of its shelves. */}
      <div className="relative isolate mx-8 mt-14 overflow-hidden rounded-[24px] bg-cream pt-[248px] pb-14">
        {/* The drawing's white paper drops out against the cream, and its foot fades away under the portraits. */}
        <Image
          src={faculty.backdrop}
          alt=""
          width={2000}
          height={857}
          sizes="100vw"
          className="absolute inset-x-0 top-0 -z-10 w-full opacity-60 mix-blend-multiply mask-b-from-50% mask-b-to-80%"
        />
        {/*
          The row, centred in the panel: as many whole cards as fit with at least 48px either side (three on the
          1440 canvas, more on wider screens), the rest a scroll away.
        */}
        <div
          className="mx-auto"
          style={{ width: `calc(round(down, 100% - 96px + ${GAP}px, ${CARD + GAP}px) - ${GAP}px)` }}
        >
          {/*
            Sideways only: room under the cards (taken back by the negative margin) holds them while they fade up
            from 18px low, so the row never has anything to scroll up and down and the arch tops are never cut off.
          */}
          <ul
            ref={track}
            data-reveal-group
            className="flex snap-x snap-mandatory -mb-5 gap-6 overflow-x-auto overflow-y-hidden pb-7 [scrollbar-width:none]"
          >
            {faculty.list.map((member) => (
              <li key={member.name} className="w-[360px] shrink-0 snap-start">
                <div className="rounded-t-full bg-[#e3a75f] p-3 shadow-[0_18px_40px_-24px_rgb(60_40_20/0.5)]">
                  <div className="relative h-[440px] overflow-hidden rounded-t-full">
                    <Image
                      src={member.photo}
                      alt={`${member.name}, ${member.subject}`}
                      fill
                      sizes="340px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-[26px]/[1.15] font-normal tracking-[-0.01em] [font-variation-settings:'SOFT'_0,'WONK'_0]">
                      {member.name}
                    </h3>
                    <p className="mt-1.5 font-noto-serif text-[15px]/[22px] text-brown-950/75">{member.subject}</p>
                  </div>
                  <a
                    href={member.linkedin}
                    aria-label={`${member.name} on LinkedIn`}
                    className="flex size-11 shrink-0 items-center justify-center rounded-full text-brown-950/70 transition-colors hover:text-amber"
                  >
                    <Linkedin width={20} height={20} />
                  </a>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-between">
            {/* The stepper as in the design (3858:404): a small diamond for each page, the current one in orange. */}
            <div aria-hidden="true" className="flex items-center gap-[4.7px] px-0.5">
              {Array.from({ length: pages }, (_, i) => (
                <span
                  key={i}
                  className={cx("size-2 rotate-45 transition-colors", i === page ? "bg-[#ff7517]" : "bg-[#cacaca]")}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <Arrow label="Previous teachers" disabled={atStart} onClick={() => move(-1)}>
                <NavArrowLeft width={20} height={20} />
              </Arrow>
              <Arrow label="More teachers" disabled={atEnd} onClick={() => move(1)}>
                <NavArrowRight width={20} height={20} />
              </Arrow>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

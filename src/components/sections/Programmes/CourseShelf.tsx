"use client";

import { useEffect, useRef, useState } from "react";
import IndianLink from "@/components/ui/IndianLink";
import type { Programme } from "@/data/programmes";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/** A cover: 216px square, five to a shelf across the 1280 column (50px apart). */
const COVER = 216;
const PER_SHELF = 5;
/** The shelves draw out from their middle, then the covers are set on them one by one. */
const PLANK_MS = 700;
const SET_MS = 650;
const SET_STAGGER_MS = 70;
const SHELF_GAP_MS = 220;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
/** A soft spring for a cover landing on its shelf: a hair past its place, then settled. */
const SETTLE = "cubic-bezier(0.34, 1.4, 0.64, 1)";

/**
 * The course shelf (after Shopify Editions' record shelf): the ten programme families as square covers
 * standing on two cream wall shelves, five to a shelf, and under them an index of all ten.
 *
 *   - A cover is the programme's own: its colour, its illustration (the "block-print vignettes" of
 *     scripts/course-art.py), its number and its title set on it like a book cover. The whole cover is the
 *     link to the programme's page.
 *   - Hover (or focus): the cover lifts off its shelf with a deeper shadow, and its round "Details" button
 *     shows at the top right. "Details" turns the cover over (a 3D flip about its upright axis, --dur-slow)
 *     to its back: the title, how it is taught, what it covers, and "View courses". Pressed again, it turns
 *     back. On touch screens the button is always there.
 *   - The index under the shelves names every programme with its number, like the edition list under a
 *     record shelf; pointing at an entry lifts its cover. It repeats the covers' links for the
 *     mouse only, so a keyboard or screen reader meets each programme once, on its cover.
 *   - Entrance, once, when the shelves come into view: the shelves draw out from their middles, then the
 *     covers are set on them one by one, left to right, the second shelf a moment after the first, each
 *     dropping in from a slight tilt and settling. Reduced motion, or already on screen: all simply there.
 */
export default function CourseShelf({ programmes }: { programmes: Programme[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState<number | null>(null);
  const [pointed, setPointed] = useState<number | null>(null);
  const shelves = [programmes.slice(0, PER_SHELF), programmes.slice(PER_SHELF)];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion() || typeof root.animate !== "function") return;
    const box = root.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.85 && box.bottom > 0) return;

    const animations: Animation[] = [];
    root.querySelectorAll<HTMLElement>("[data-shelf]").forEach((shelf, s) => {
      const start = s * SHELF_GAP_MS;
      const plank = shelf.querySelector<HTMLElement>("[data-plank]");
      if (plank) {
        animations.push(plank.animate([{ transform: "scaleX(0)" }, { transform: "none" }], { duration: PLANK_MS, delay: start, easing: EASE_OUT, fill: "backwards" }));
      }
      shelf.querySelectorAll<HTMLElement>("[data-cover]").forEach((cover, i) => {
        animations.push(
          cover.animate(
            [
              { transform: "translateY(-56px) rotate(-5deg)", opacity: 0 },
              { transform: "none", opacity: 1 },
            ],
            { duration: SET_MS, delay: start + PLANK_MS * 0.45 + i * SET_STAGGER_MS, easing: SETTLE, fill: "backwards" },
          ),
        );
      });
    });
    animations.forEach((animation) => animation.pause());
    const cancel = whenVisible(root, 0.25, () => animations.forEach((animation) => animation.play()));
    return () => {
      cancel();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return (
    <div ref={rootRef} className="relative flex w-full flex-col">
      {shelves.map((shelf, s) => (
        <div key={s} data-shelf className={cx("relative", s > 0 && "mt-16")}>
          <ul className="relative flex items-end justify-between">
            {shelf.map((programme, i) => {
              const index = s * PER_SHELF + i;
              return (
                <li key={programme.number} className="flex">
                  <Cover
                    programme={programme}
                    flipped={flipped === index}
                    lifted={pointed === index}
                    onFlip={() => setFlipped((current) => (current === index ? null : index))}
                  />
                </li>
              );
            })}
          </ul>
          {/* The shelf: a cream plank with its front edge and a soft shadow on the wall under it. */}
          <div
            data-plank
            aria-hidden="true"
            className="relative -mx-6 h-3 rounded-[2px] bg-linear-to-b from-[#fffaf0] from-20% to-[#ecd9bb] shadow-[0_16px_22px_-12px_rgb(77_31_8/0.4)]"
          />
        </div>
      ))}

      {/* The index: every programme, as the edition list under a record shelf. Mouse only (see above). */}
      <ol aria-hidden="true" className="mt-12 grid grid-cols-10 gap-x-4 border-t border-[#eadbc4] pt-5">
        {programmes.map((programme, i) => (
          <li key={programme.number}>
            <a
              href={programme.cta.href ?? undefined}
              tabIndex={-1}
              onPointerEnter={() => setPointed(i)}
              onPointerLeave={() => setPointed((current) => (current === i ? null : current))}
              className="group/index flex flex-col gap-1"
            >
              <span className="font-mono text-[11px]/[14px] tracking-[0.08em] text-[#a8431a]">{programme.number}</span>
              <span className="text-[13px]/[1.35] font-medium text-ink [transition:color_var(--dur-fast)_var(--ease-out)] group-hover/index:text-burnt">
                {programme.title}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

type CoverProps = {
  programme: Programme;
  flipped: boolean;
  /** Lifted from the index. */
  lifted: boolean;
  onFlip: () => void;
};

/** One programme's cover: the front (the link) and the back (the details), turned by "Details". */
function Cover({ programme, flipped, lifted, onFlip }: CoverProps) {
  const light = programme.cover.type === "light";
  const href = programme.cta.href;
  return (
    <article
      data-cover
      className={cx(
        "group/cover relative [perspective:1200px] [transition:translate_var(--dur-base)_var(--ease-out)] hover:-translate-y-3 focus-within:-translate-y-3",
        lifted && "-translate-y-3",
      )}
      style={{ width: COVER, height: COVER }}
    >
      <div
        className="relative size-full [transform-style:preserve-3d] [transition:transform_var(--dur-slow)_var(--ease-in-out)] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* The front: the cover itself, a link to the programme's page. */}
        <div
          inert={flipped}
          className={cx(
            "absolute inset-0 overflow-clip rounded-[6px] shadow-rest [backface-visibility:hidden] [transition:box-shadow_var(--dur-base)_var(--ease-out)] group-hover/cover:shadow-hover",
            lifted && "shadow-hover",
          )}
          style={{ backgroundColor: programme.cover.colour }}
        >
          <img src={programme.art} alt="" aria-hidden="true" width={236} height={169} loading="lazy" decoding="async" className="pointer-events-none absolute top-0 left-[-46px] h-[169px] w-[236px] max-w-none" />
          {/* The sleeve's edge: a fine light line down the left, as on a record or a book. */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-white/25" />
          <span className={cx("absolute top-4 left-4 font-mono text-[11px]/[14px] tracking-[0.08em]", light ? "text-cream/80" : "text-[#a8431a]")}>{programme.number}</span>
          <h3 className={cx("absolute right-4 bottom-4 left-4 font-serif text-[21px]/[1.12]", light ? "text-cream" : "text-ink")}>{programme.title}</h3>
          {href !== null && (
            <a href={href} aria-label={`${programme.cta.label}: ${programme.title}`} className="absolute inset-0 rounded-[6px] outline-offset-4" />
          )}
        </div>

        {/* The back: the details. */}
        <div
          inert={!flipped}
          className="absolute inset-0 flex flex-col items-start overflow-clip rounded-[6px] bg-cream p-4 shadow-hover [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: programme.cover.colour }} />
          <p className="mt-1 font-serif text-[17px]/[1.15] text-ink">{programme.title}</p>
          <p className="mt-1.5 font-mono text-[10px]/[13px] tracking-[0.05em] text-[#a8431a] uppercase">{programme.modes}</p>
          <p className="mt-2 text-[12.5px]/[1.42] text-clay">{programme.text}</p>
          <div className="mt-auto pt-2">
            <IndianLink tone="light" size="sm" href={href} ariaLabel={`${programme.cta.label}: ${programme.title}`}>
              {programme.cta.label}
            </IndianLink>
          </div>
        </div>
      </div>

      {/* "Details": over both faces, shown on hover or focus (always on touch screens). */}
      <button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        aria-label={`${flipped ? "Back to the cover" : "Details"}: ${programme.title}`}
        className={cx(
          "absolute top-2.5 right-2.5 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-rest [transition:opacity_var(--dur-fast)_var(--ease-out),background-color_var(--dur-fast)_var(--ease-out)] hover:bg-white focus-visible:opacity-100",
          "pointer-fine:opacity-0 pointer-fine:group-hover/cover:opacity-100 pointer-fine:group-focus-within/cover:opacity-100",
          flipped && "pointer-fine:opacity-100",
        )}
      >
        <svg aria-hidden="true" viewBox="0 0 14 14" width={14} height={14} fill="none" className={cx("[transition:rotate_var(--dur-base)_var(--ease-out)]", flipped && "rotate-45")}>
          <path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
        </svg>
      </button>
    </article>
  );
}

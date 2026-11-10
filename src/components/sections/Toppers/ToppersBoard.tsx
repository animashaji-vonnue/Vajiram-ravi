"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Cta from "@/components/ui/Cta";
import { EyebrowCentred } from "@/components/ui/Ornament";
import { links } from "@/data/links";
import { toppersByYear, toppersSection, toppersYear, toppersYears } from "@/data/toppers";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";
import { GRID_WIDTH, deckTransform, gridHeight, masonry } from "./masonry";
import TopperCard from "./TopperCard";
import YearRuler from "./YearRuler";

/** Prefix of the ruler's tab ids and the grid panel's id. */
const ID = "results-year";
/** One height for every year: the tallest year's masonry (600px for a full top ten). */
const GRID_HEIGHT = gridHeight(toppersYears.map((year) => toppersByYear[year]?.length ?? 0));

/** The motion tokens, for the Web Animations API: --ease-out and --ease-in. */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";

/** The deal out of the deck: AIR 1 first, 80ms apart, each flight 800ms. */
const DEAL = { duration: 800, stagger: 80, threshold: 0.5 };
/** The year's cards falling away: 30ms apart, 320ms each. */
const FALL = { duration: 320, stagger: 30 };
const FALL_FRAMES: Keyframe[] = [
  { opacity: 1, transform: "none", filter: "blur(0px)" },
  { opacity: 0, transform: "translateY(40px) scale(0.97)", filter: "blur(6px)" },
];
/** The next year's cards rising in (after React Bits' Masonry): 60ms apart, 700ms each. */
const RISE = { duration: 700, stagger: 60 };
const RISE_FRAMES: Keyframe[] = [
  { opacity: 0, transform: "translateY(60px) scale(0.96)", filter: "blur(10px)" },
  { opacity: 1, transform: "none", filter: "blur(0px)" },
];

/** The year on show, and how many times the grid has changed (the cards' keys, so each change remounts them). */
type Shown = { year: number; turn: number };

/**
 * The results band's working part: the eyebrow (it names the year on show), the server-rendered heading,
 * the toppers' masonry with the year ruler beside it, the button to all selections, and a polite live
 * region.
 *
 * The grid (./masonry, ./TopperCard): the chosen year's toppers in rank order as dark photo cards of
 * varied heights in five columns, AIR 1 the tallest, in a box as tall as the longest year's grid so the
 * band never changes height. The ruler (./YearRuler) is a vertical tab list; the grid is its panel.
 *
 * Motion:
 *   - The deal (once): until the grid is half in view the cards lie stacked in the centre as the design's
 *     deck, AIR 1 on top; then they are dealt out to their places in the masonry, AIR 1 first, 80ms
 *     apart, each flying 800ms on --ease-out (above the cards already placed). A grid already on screen at
 *     load, and reduced motion, show the masonry as it is.
 *   - A new year: the cards on show fall away (40px down, fading and blurring, 320ms, 30ms apart) and the
 *     new year's cards rise into the masonry from 60px below, out of a 10px blur and from 96%, 700ms on
 *     --ease-out, 60ms apart. Choosing again while they fall shows the latest choice. The live region
 *     then reads e.g. "UPSC CSE 2023: 8 toppers". Reduced motion: the cards change at once.
 *   - Hover (fine pointers): a card grows to 1.03 with the hover shadow (./TopperCard).
 */
export default function ToppersBoard({ heading }: { heading: ReactNode }) {
  const [selected, setSelected] = useState(toppersYear);
  const [shown, setShown] = useState<Shown>({ year: toppersYear, turn: 0 });
  // The live region speaks only once the visitor has chosen a year.
  const [chosen, setChosen] = useState(false);
  const gridRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const dealing = useRef<{ animations: Animation[]; cancel: () => void } | null>(null);
  const falling = useRef(false);
  const latest = useRef(selected);

  const toppers = toppersByYear[shown.year] ?? [];
  const slots = masonry(toppers.length);
  const cards = () => cardRefs.current.slice(0, toppers.length).filter((card): card is HTMLLIElement => card !== null);

  // The deal, created paused on the deck (fill backwards holds each card there) and played once in view.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;
    if (canvasTop(grid) < (window.innerHeight / getCanvasZoom()) * 0.85) return;
    const count = (toppersByYear[toppersYear] ?? []).length;
    const places = masonry(count);
    const animations = cardRefs.current.slice(0, count).flatMap((card, i) => {
      if (!card) return [];
      // Above everything while in the deck and in flight; back to its own place in the stack once it lands.
      const zIndex = 100 + count - i;
      const flight = card.animate([{ transform: deckTransform(places[i], i, GRID_HEIGHT), zIndex }, { transform: "none", zIndex }], {
        duration: DEAL.duration,
        delay: i * DEAL.stagger,
        easing: EASE_OUT,
        fill: "backwards",
      });
      flight.pause();
      return [flight];
    });
    const cancel = whenVisible(grid, DEAL.threshold, () => animations.forEach((flight) => flight.play()));
    dealing.current = { animations, cancel };
    return () => {
      cancel();
      animations.forEach((flight) => flight.cancel());
      dealing.current = null;
    };
  }, []);

  // A new year: the cards on show fall away, then the latest choice is shown.
  useEffect(() => {
    latest.current = selected;
    if (selected === shown.year || falling.current) return;
    // A deal still waiting or under way settles first.
    if (dealing.current) {
      dealing.current.cancel();
      dealing.current.animations.forEach((flight) => flight.finish());
      dealing.current = null;
    }
    const next = () => setShown((current) => ({ year: latest.current, turn: current.turn + 1 }));
    if (prefersReducedMotion()) return next();
    falling.current = true;
    const falls = cards().map((card, i) =>
      card.animate(FALL_FRAMES, { duration: FALL.duration, delay: i * FALL.stagger, easing: EASE_IN, fill: "forwards" }),
    );
    Promise.all(falls.map((fall) => fall.finished)).then(
      () => {
        falling.current = false;
        next();
      },
      () => {
        falling.current = false;
      },
    );
  }, [selected, shown.year]);

  // The new year's cards rise in, before they are first painted.
  useLayoutEffect(() => {
    if (shown.turn === 0 || prefersReducedMotion()) return;
    const rises = cards().map((card, i) =>
      card.animate(RISE_FRAMES, { duration: RISE.duration, delay: i * RISE.stagger, easing: EASE_OUT, fill: "backwards" }),
    );
    return () => rises.forEach((rise) => rise.cancel());
  }, [shown.turn]);

  const choose = (year: number) => {
    setChosen(true);
    setSelected(year);
  };

  return (
    <div className="flex flex-col items-center">
      <EyebrowCentred>{toppersSection.eyebrow(shown.year, toppers.length)}</EyebrowCentred>
      {heading}

      <div className="mt-14 flex w-full items-center justify-between">
        <div
          role="tabpanel"
          id={`${ID}-panel`}
          aria-labelledby={`${ID}-tab-${selected}`}
          tabIndex={0}
          className="relative shrink-0 rounded-2xl"
          style={{ width: GRID_WIDTH, height: GRID_HEIGHT }}
        >
          <ul ref={gridRef} aria-label={toppersSection.gridLabel(shown.year)} className="relative size-full">
            {toppers.map((topper, i) => (
              <TopperCard
                key={`${shown.turn}-${topper.rank}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                topper={topper}
                width={slots[i].w}
                style={{ left: slots[i].x, top: slots[i].y, width: slots[i].w, height: slots[i].h }}
              />
            ))}
          </ul>
        </div>

        <div data-reveal="fade">
          <YearRuler years={toppersYears} value={selected} onChange={choose} label={toppersSection.rulerLabel} idPrefix={ID} />
        </div>
      </div>

      <div data-reveal className="mt-12">
        <Cta variant="secondary" size="md" href={links.toppers}>
          {toppersSection.cta(shown.year)}
        </Cta>
      </div>

      <p aria-live="polite" className="sr-only">
        {chosen ? toppersSection.announcement(shown.year, toppers.length) : ""}
      </p>
    </div>
  );
}

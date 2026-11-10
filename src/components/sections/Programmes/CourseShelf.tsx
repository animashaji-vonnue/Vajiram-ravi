"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Cta from "@/components/ui/Cta";
import IndianLink from "@/components/ui/IndianLink";
import { programmeCategories, type Programme, type ProgrammeCategory } from "@/data/programmes";
import { cx } from "@/lib/cx";
import { pressRipple } from "@/lib/pressRipple";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";
import CoverArt from "./CoverArt";
import GeoArt from "./GeoArt";
import "./shelf.css";

/**
 * The shelf's measurements in canvas px: books of BOOK size, up to four to a plank with GAP between them,
 * centred on their plank; a plank every ROW_H, its top at PLANK_TOP in its row (the books stand on it, a
 * little in from its front edge); and the open book, its pages PAGE in size with the spine at SPINE, which
 * needs OPEN_H of stage.
 */
const STAGE_W = 1180;
const BOOK = { w: 196, h: 260 };
const PER_SHELF = 4;
const GAP = 60;
const ROW_H = 352;
const BOOK_TOP = 30;
const PLANK_TOP = BOOK_TOP + BOOK.h - 8;
const PLANK_W = 1080;
const PAGE = { w: 380, h: 504 };
const OPEN_H = 2 * ROW_H;
const SPINE = { x: STAGE_W / 2, y: OPEN_H / 2 };

/** A book coming forward (and going back), and its cover swinging open (and shut). */
const MOVE_MS = 650;
const OPEN_MS = 750;
const TURN_MS = 700;

/** The entrance: the books are set on the planks one by one, the upper plank first. */
const SET_MS = 650;
const SET_STAGGER_MS = 70;
const SHELF_GAP_MS = 220;
/** A soft spring for a book landing on its plank: a hair past its place, then settled. */
const SETTLE = "cubic-bezier(0.34, 1.4, 0.64, 1)";
const EASE = "var(--ease-out)";

/**
 * Filtering: the books that leave sink and fade where they stand; then those that stay slide along the
 * planks to their new places; then those that arrive rise into theirs one after another.
 */
const LEAVE_MS = 340;
const SLIDE_DELAY_MS = 140;
const ARRIVE_DELAY_MS = 260;
const ARRIVE_STAGGER_MS = 70;
const SHUFFLE_MS = 1200;

type Filter = "All" | ProgrammeCategory;
const FILTERS: Filter[] = ["All", ...programmeCategories];

/** The paper of a page, shaded a little towards the spine on whichever side the spine is. */
const PAPER = "bg-[#fff8ec]";
const SPINE_SHADE_RIGHT_PAGE = "bg-[linear-gradient(90deg,rgb(77_31_8/0.14),transparent_10%)]";
const SPINE_SHADE_LEFT_PAGE = "bg-[linear-gradient(270deg,rgb(77_31_8/0.14),transparent_10%)]";
/** The gold of the foil on the covers. */
const FOIL = "#f6c77a";

/** A page turning swaps its stacking half-way, when it stands upright on the spine. */
const flip = (ms: number) => `transform ${ms}ms cubic-bezier(0.65, 0, 0.35, 1), z-index 0s linear ${ms / 2}ms`;

/** Where the k-th of n books on the shelf stands: its top left corner, its plank's books centred. */
function spot(k: number, n: number) {
  const row = Math.floor(k / PER_SHELF);
  const inRow = Math.min(PER_SHELF, n - row * PER_SHELF);
  const left = (STAGE_W - (inRow * BOOK.w + (inRow - 1) * GAP)) / 2;
  return { x: left + (k % PER_SHELF) * (BOOK.w + GAP), y: row * ROW_H + BOOK_TOP };
}

/** The pages of a book: the programme, one page for each course its line names, then the way to them all. */
type Leaf = { kind: "overview" } | { kind: "course"; name: string; index: number } | { kind: "all" };
const leavesOf = (programme: Programme): Leaf[] => [
  { kind: "overview" },
  ...programme.courses.map((name, index) => ({ kind: "course" as const, name, index })),
  { kind: "all" },
];
const pad = (n: number) => String(n).padStart(2, "0");

function Arrow({ back = false, className }: { back?: boolean; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width={16} height={16} fill="none" className={cx(back && "-scale-x-100", className)}>
      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The course shelf (feedback 26 and 27, after the reference shelf on vajiram-ravi.vercel.app): kevin's
 * eight programme groups as cloth hardcovers standing on two walnut planks drawn in CSS (shelf.css), four
 * to a plank, on the band's cream wall, with the category filter above them.
 *
 *   - The filter (All, Foundation, Optional, Tests, Guidance, each with how many groups it holds): a white
 *     bar whose burnt indicator slides to the chosen chip. Choosing one sinks and fades the books that
 *     leave, slides the rest along the planks to their new places, centred on their plank, and raises the
 *     arriving ones into theirs one by one; with four or fewer books the lower plank fades away and the
 *     shelf closes up to one plank. A line for screen readers says how many are shown.
 *   - A book (CoverFront): its cloth board in the programme's colour, the spine down the left, the page
 *     block showing past the board on the right, a gold foil frame, "Vajiram & Ravi", the name, the emblem,
 *     and the category with the course count at the foot. Hover (or focus): it lifts off its plank, the
 *     foil brightens, a band of light sweeps across, and the foot reads "Open the book".
 *   - Choosing one brings it forward to the middle of the shelf, larger, while the rest blur back (the shelf
 *     grows to two planks' height for it if it was down to one); then its cover swings open on the spine,
 *     and its pages can be turned, as in kevin's book: the programme (how many courses, its line), a page
 *     for each course its line names, and last the way to all of them. Above the open book a line says to
 *     turn the pages; under it, previous and next and the page number. A click on the right-hand page, or →,
 *     turns forward; on the left-hand page, or ←, back.
 *   - Closing shuts the cover first, then puts the book back: the open cover, Escape or a click on the wall
 *     all close it. Choosing another book puts this one back first; choosing a filter puts it straight back.
 *   - Entrance, once, when the shelf comes into view: the books are set on the planks one by one, each
 *     dropping in from a slight tilt and settling. While the shelf is on screen, a faint glint of the foil
 *     passes across one cover or another now and then (CoverFront). Reduced motion, or already on screen: all simply there,
 *     the book opens without the swing, and filtering swaps the books without moving them.
 */
export default function CourseShelf({ programmes }: { programmes: Programme[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  // `picked` is the book brought forward; `open` is whether its cover has swung open.
  const [picked, setPicked] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  // While a filter change plays: the books arriving, in order.
  const [shuffle, setShuffle] = useState<{ arriving: number[] } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const shuffleTimer = useRef<number | undefined>(undefined);
  // Where each book last stood, so one that leaves fades out in its place.
  const lastSpot = useRef(new Map<number, { x: number; y: number }>());

  const shownIn = (f: Filter) => programmes.flatMap((p, i) => (f === "All" || p.category === f ? [i] : []));
  const shown = shownIn(filter);
  const rows = Math.max(1, Math.ceil(shown.length / PER_SHELF));

  const later = (fn: () => void, ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(fn, prefersReducedMotion() ? 0 : ms);
  };

  const pick = (i: number) => {
    if (picked === i) return;
    if (picked !== null) {
      // Another book is out: shut it and put it back, then bring this one.
      setOpen(false);
      later(() => {
        setPicked(i);
        later(() => setOpen(true), MOVE_MS);
      }, OPEN_MS);
      return;
    }
    setPicked(i);
    later(() => setOpen(true), MOVE_MS);
  };

  const close = () => {
    if (picked === null) return;
    setOpen(false);
    later(() => setPicked(null), OPEN_MS);
  };

  const choose = (next: Filter) => {
    if (next === filter) return;
    const before = shownIn(filter);
    const after = shownIn(next);
    window.clearTimeout(timer.current);
    setOpen(false);
    setPicked(null);
    setHovered(null);
    if (!prefersReducedMotion()) {
      setShuffle({ arriving: after.filter((i) => !before.includes(i)) });
      window.clearTimeout(shuffleTimer.current);
      shuffleTimer.current = window.setTimeout(() => setShuffle(null), SHUFFLE_MS);
    }
    setFilter(next);
  };

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      window.clearTimeout(shuffleTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (picked === null) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // The entrance.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion() || typeof root.animate !== "function") return;
    const box = root.getBoundingClientRect();
    if (box.top < window.innerHeight * 0.85 && box.bottom > 0) return;

    const animations: Animation[] = [];
    root.querySelectorAll<HTMLElement>("[data-cover]").forEach((cover, i) => {
      const shelf = Math.floor(i / PER_SHELF);
      animations.push(
        cover.animate(
          [
            { transform: "translateY(-56px) rotate(-5deg)", opacity: 0 },
            { transform: "none", opacity: 1 },
          ],
          { duration: SET_MS, delay: shelf * SHELF_GAP_MS + (i % PER_SHELF) * SET_STAGGER_MS, easing: SETTLE, fill: "backwards" },
        ),
      );
    });
    animations.forEach((animation) => animation.pause());
    const cancel = whenVisible(root, 0.25, () => animations.forEach((animation) => animation.play()));
    return () => {
      cancel();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  const away = picked !== null;
  const place = (i: number): CSSProperties => {
    if (i === picked) {
      return {
        left: SPINE.x,
        top: SPINE.y - PAGE.h / 2,
        width: PAGE.w,
        height: PAGE.h,
        zIndex: 20,
        transition: `left ${MOVE_MS}ms ${EASE}, top ${MOVE_MS}ms ${EASE}, width ${MOVE_MS}ms ${EASE}, height ${MOVE_MS}ms ${EASE}, transform 320ms ${EASE}`,
      };
    }
    const k = shown.indexOf(i);
    const size = { width: BOOK.w, height: BOOK.h };
    if (k < 0) {
      // Not in this filter: it sinks and fades where it stood.
      const { x, y } = lastSpot.current.get(i) ?? spot(i, programmes.length);
      return {
        ...size,
        left: x,
        top: y,
        transform: "translateY(18px) scale(0.92)",
        filter: "blur(3px)",
        opacity: 0,
        pointerEvents: "none",
        transition: `opacity ${LEAVE_MS}ms ${EASE}, transform ${LEAVE_MS + 40}ms ${EASE}, filter ${LEAVE_MS}ms ${EASE}`,
      };
    }
    const { x, y } = spot(k, shown.length);
    lastSpot.current.set(i, { x, y });
    const arriving = shuffle?.arriving.indexOf(i) ?? -1;
    const delay = ARRIVE_DELAY_MS + arriving * ARRIVE_STAGGER_MS;
    return {
      ...size,
      left: x,
      top: y,
      transform: hovered === i && !away ? "translateY(-14px) rotate(-1deg)" : "none",
      filter: away ? "blur(14px)" : "none",
      opacity: away ? 0.25 : 1,
      transition:
        arriving >= 0
          ? // Arriving: straight to its place while unseen, then it rises in.
            `opacity 520ms ${EASE} ${delay}ms, transform 620ms ${SETTLE} ${delay}ms, filter 520ms ${EASE} ${delay}ms`
          : shuffle
            ? `left 620ms ${EASE} ${SLIDE_DELAY_MS}ms, top 620ms ${EASE} ${SLIDE_DELAY_MS}ms, width ${MOVE_MS}ms ${EASE}, height ${MOVE_MS}ms ${EASE}, transform 320ms ${EASE}, filter 700ms ${EASE}, opacity 700ms ${EASE}`
            : `left ${MOVE_MS}ms ${EASE}, top ${MOVE_MS}ms ${EASE}, width ${MOVE_MS}ms ${EASE}, height ${MOVE_MS}ms ${EASE}, transform 320ms ${EASE}, filter 700ms ${EASE}, opacity 700ms ${EASE}`,
    };
  };

  return (
    <div className="flex w-full flex-col items-center">
      <ShelfFilter
        filter={filter}
        counts={FILTERS.map((f) => shownIn(f).length)}
        onChoose={choose}
      />
      <p aria-live="polite" className="sr-only">
        {filter === "All" ? `Showing all ${shown.length} programmes` : `Showing ${shown.length} ${filter} programmes`}
      </p>

      {/* A click on the wall, away from the books, closes an open one. */}
      <div
        ref={rootRef}
        id="programme-shelf"
        className="relative mt-10 [transition:height_600ms_var(--ease-out)]"
        style={{ width: STAGE_W, height: away ? Math.max(rows * ROW_H, OPEN_H) : rows * ROW_H }}
        onClick={(event) => event.target === event.currentTarget && close()}
      >
        {/* The planks: the lower one fades away when the books fit on one; both blur back behind an open book. */}
        {[0, 1].map((row) => (
          <span
            key={row}
            aria-hidden="true"
            className="shelf-plank"
            style={{
              left: (STAGE_W - PLANK_W) / 2,
              width: PLANK_W,
              top: row * ROW_H + PLANK_TOP,
              opacity: row < rows ? (away ? 0.3 : 1) : 0,
              translate: row < rows ? "0 0" : "0 -12px",
              filter: away ? "blur(6px)" : "none",
            }}
          >
            <span className="shelf-plank__top" />
            <span className="shelf-plank__front" />
          </span>
        ))}

        {programmes.map((programme, i) => (
          <Book
            key={programme.name}
            programme={programme}
            hidden={!shown.includes(i)}
            out={picked === i}
            open={picked === i && open}
            away={away && picked !== i}
            style={place(i)}
            onPick={() => pick(i)}
            onClose={close}
            onHover={(on) => setHovered((current) => (on ? i : current === i ? null : current))}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * The category filter, after the reference shelf's: a white bar of chips, each with how many programme
 * groups it holds, and a burnt indicator that slides under the chosen one (shelf.css). Each chip is a
 * toggle button (aria-pressed) controlling the shelf.
 */
function ShelfFilter({ filter, counts, onChoose }: { filter: Filter; counts: number[]; onChoose: (f: Filter) => void }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const chip = barRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (chip) setInd({ x: chip.offsetLeft, w: chip.offsetWidth });
    };
    measure();
    // The chips' widths settle once the web fonts are in.
    document.fonts?.ready.then(measure);
  }, [filter]);

  return (
    <div
      ref={barRef}
      role="group"
      aria-label="Filter the programmes by category"
      className="relative inline-flex items-center gap-1 rounded-[14px] bg-white p-1.5 shadow-[0_12px_26px_-18px_rgb(110_40_8/0.55)] ring-1 ring-[#eadbc4]"
    >
      {ind && <span aria-hidden="true" className="shelf-filter__ind absolute top-1.5 bottom-1.5 left-0 rounded-[10px] bg-burnt" style={{ translate: `${ind.x}px 0`, width: ind.w }} />}
      {FILTERS.map((f, n) => {
        const active = f === filter;
        return (
          <button
            key={f}
            type="button"
            aria-pressed={active}
            aria-controls="programme-shelf"
            onClick={() => onChoose(f)}
            className={cx(
              "relative flex h-10 cursor-pointer items-center gap-2 rounded-[10px] px-4 text-[15px]/[20px] font-semibold [transition:color_300ms_var(--ease-out),background-color_var(--dur-fast)_var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron",
              active ? "text-white" : "text-ink hover:bg-[#fbefe0]",
              // Before the indicator is measured, the chosen chip carries the fill itself.
              active && !ind && "bg-burnt",
            )}
          >
            {f}
            <span
              className={cx(
                "min-w-6 rounded-full px-1.5 py-px text-center font-mono text-[11px]/[16px] [transition:background-color_300ms_var(--ease-out),color_300ms_var(--ease-out)]",
                active ? "bg-white/22 text-white" : "bg-[#f3e6d4] text-clay",
              )}
            >
              {counts[n]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

type BookProps = {
  programme: Programme;
  /** Not in the chosen category: faded out and out of reach. */
  hidden: boolean;
  /** Brought forward from the shelf. */
  out: boolean;
  /** Its cover swung open. */
  open: boolean;
  /** Another book is out: this one waits, blurred. */
  away: boolean;
  style: CSSProperties;
  onPick: () => void;
  onClose: () => void;
  onHover: (on: boolean) => void;
};

/** Where a book's glint loop starts, s: spread by its name, so the covers never glint together. */
function glintOffset(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return (hash % 11) + (hash % 7) / 7;
}

/**
 * One programme as a book on the shelf. Out and open, it is a little flipbook: the cover swings open on the
 * spine, and the pages turn the same way, each over the next.
 */
function Book({ programme, hidden, out, open, away, style, onPick, onClose, onHover }: BookProps) {
  // How many pages have been turned; the last page is never turned.
  const [turned, setTurned] = useState(0);
  const leaves = leavesOf(programme);
  const last = leaves.length - 1;
  const turn = (by: number) => setTurned((t) => Math.min(last, Math.max(0, t + by)));
  const { deep } = programme.cover;

  useEffect(() => {
    if (!open) {
      setTurned(0);
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setTurned((t) => Math.min(last, t + 1));
      if (event.key === "ArrowLeft") setTurned((t) => Math.max(0, t - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, last]);

  return (
    <div
      inert={away || hidden}
      aria-hidden={hidden || undefined}
      className="group/book absolute"
      style={style}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div data-cover className="absolute inset-0 [perspective:2200px]">
        {/* On the shelf: the back board and the page block showing past the cover on the right, and the shadow on the plank. */}
        <span
          aria-hidden="true"
          className={cx("pointer-events-none absolute inset-0 [transition:opacity_400ms_var(--ease-out)]", out ? "opacity-0" : "opacity-100")}
        >
          <span className="absolute -right-[7px] bottom-[-1px] left-3 h-3 rounded-[50%] bg-[rgb(43_18_6/0.45)] blur-[5px]" />
          <span className="absolute top-0 -right-[6px] bottom-0 w-4 rounded-r-[7px]" style={{ backgroundColor: deep, filter: "brightness(0.8)" }} />
          <span className="book-pages absolute top-[4px] -right-[4px] bottom-[4px] w-3 rounded-r-[3px] shadow-[inset_2px_0_3px_rgb(43_18_6/0.25)]" />
        </span>

        {/* The line over the open spread. */}
        {out && (
          <p
            aria-hidden={!open}
            className={cx(
              "pointer-events-none absolute bottom-full left-0 mb-5 flex w-max -translate-x-1/2 items-center gap-2.5 rounded-full bg-mahogany/85 py-2 pr-4 pl-2 text-[14px] font-semibold text-cream backdrop-blur-md [transition:opacity_500ms_var(--ease-out)]",
              open ? "opacity-100 delay-300" : "opacity-0",
            )}
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-saffron text-mahogany">
              <svg aria-hidden="true" viewBox="0 0 16 16" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round">
                <path d="M8 4.2C6.6 3.2 4.6 2.8 2 2.9v9.3c2.6-.1 4.6.3 6 1.3 1.4-1 3.4-1.4 6-1.3V2.9c-2.6-.1-4.6.3-6 1.3ZM8 4.2v9.3" />
              </svg>
            </span>
            Turn the pages
          </p>
        )}

        {/* A round close button at the open book's top right corner, for those who do not think to click away. */}
        {out && (
          <button
            type="button"
            onClick={onClose}
            onPointerDown={pressRipple}
            aria-label={`Close ${programme.name}`}
            tabIndex={open ? 0 : -1}
            aria-hidden={!open || undefined}
            className={cx(
              "absolute -top-5 -right-5 z-[130] flex size-10 cursor-pointer items-center justify-center rounded-full border border-ink/20 bg-cream/95 text-ink shadow-[0_6px_16px_-6px_rgb(43_18_6/0.45)] [transition:opacity_400ms_var(--ease-out),scale_400ms_var(--ease-out),background-color_var(--dur-fast)_var(--ease-out),color_var(--dur-fast)_var(--ease-out),border-color_var(--dur-fast)_var(--ease-out)] hover:border-ink hover:bg-ink hover:text-cream active:scale-[.94] [--press-ring:#2a1a12]",
              open ? "scale-100 opacity-100 delay-300" : "pointer-events-none scale-75 opacity-0",
            )}
          >
            <span data-ripple aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" />
            <svg aria-hidden="true" viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" className="relative">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}

        {/* The inside of the back cover, under every page. */}
        {out && <div aria-hidden="true" className={cx("absolute inset-0 shadow-[0_24px_40px_-20px_rgb(43_18_6/0.55)]", PAPER)} />}

        {/* The pages. */}
        {out &&
          leaves.map((leaf, i) => {
            const isTurned = i < turned;
            const current = open && i === turned;
            return (
              <div
                key={i}
                className="absolute inset-0 origin-left [transform-style:preserve-3d]"
                style={{ transform: isTurned ? "rotateY(-180deg)" : "none", zIndex: isTurned ? 60 + i : 50 - i, transition: flip(TURN_MS) }}
              >
                {/* The front: the right-hand page. A click on it, away from its buttons, turns it. */}
                <div
                  aria-hidden={!current}
                  inert={!current}
                  onClick={(event) => {
                    if ((event.target as HTMLElement).closest("a,button")) return;
                    if (i < last) turn(1);
                  }}
                  className={cx("absolute inset-0 flex flex-col overflow-clip p-9 pl-11 text-ink [backface-visibility:hidden]", i < last && "cursor-pointer", PAPER, SPINE_SHADE_RIGHT_PAGE)}
                >
                  <Page leaf={leaf} programme={programme} onTurn={() => turn(1)} onRestart={() => setTurned(0)} />
                  {/* A turned-up corner, saying the page can be turned. */}
                  {i < last && (
                    <span
                      aria-hidden="true"
                      className="absolute right-0 bottom-0 size-9 bg-[linear-gradient(315deg,transparent_50%,#ecdcc2_50%,#f8ecd8)] shadow-[-3px_-3px_6px_-2px_rgb(77_31_8/0.25)]"
                    />
                  )}
                </div>
                {/* The back: the left-hand page once turned. A click on it turns it back. */}
                <div
                  aria-hidden="true"
                  onClick={() => turn(-1)}
                  className={cx(
                    "absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 text-ink/45 [backface-visibility:hidden] [transform:rotateY(180deg)]",
                    PAPER,
                    SPINE_SHADE_LEFT_PAGE,
                  )}
                >
                  <img src="/images/ornaments/butta.svg" alt="" width={20} height={20} className="size-5 opacity-60" />
                  <span className="px-10 text-center font-heading text-[18px]/[1.3]">{programme.name}</span>
                  <span className="absolute bottom-6 font-mono text-[11px] tracking-[0.06em]">{i * 2 + 2}</span>
                </div>
              </div>
            );
          })}

        {/* The cover, hinged on the spine: the front on the shelf, its inside once it swings open. */}
        <button
          type="button"
          aria-label={out ? `Close ${programme.name}` : `Open ${programme.name}`}
          aria-expanded={open}
          onClick={() => (out ? onClose() : onPick())}
          className="absolute inset-0 origin-left cursor-pointer rounded-[3px_7px_7px_3px] [transform-style:preserve-3d] focus-visible:outline-offset-4"
          style={{ transform: open ? "rotateY(-180deg)" : "none", zIndex: open ? 55 : 100, transition: flip(OPEN_MS) }}
        >
          <span className="absolute inset-0 [backface-visibility:hidden]">
            <CoverFront programme={programme} large={out} />
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 flex flex-col justify-between rounded-[7px_3px_3px_7px] p-8 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{ backgroundColor: deep, backgroundImage: "linear-gradient(270deg, rgb(0 0 0/0.32), transparent 14%, rgb(0 0 0/0.1))", color: FOIL }}
          >
            <span className="font-mono text-[11px]/[14px] tracking-[0.18em] uppercase opacity-85">Vajiram &amp; Ravi</span>
            <span className="font-heading text-[22px]/[1.15] opacity-90">Since 1976</span>
          </span>
        </button>

        {/* Under the open spread: previous and next, and where you are. */}
        {out && (
          <div
            aria-hidden={!open}
            inert={!open}
            className={cx(
              "absolute top-full left-0 mt-5 flex w-[800px] -translate-x-1/2 items-center justify-between [transition:opacity_500ms_var(--ease-out)]",
              open ? "opacity-100 delay-300" : "pointer-events-none opacity-0",
            )}
          >
            <button
              type="button"
              onClick={() => turn(-1)}
              disabled={turned === 0}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-ink/20 bg-white px-4 text-[14px] font-semibold text-ink [transition:border-color_var(--dur-fast)_var(--ease-out),opacity_var(--dur-fast)_var(--ease-out)] hover:border-burnt disabled:cursor-default disabled:opacity-35"
            >
              <Arrow back />
              Previous page
            </button>
            <p aria-live="polite" className="font-mono text-[12px] tracking-[0.01em] text-clay">
              Page {turned + 1} of {leaves.length}
            </p>
            <button
              type="button"
              onClick={() => turn(1)}
              disabled={turned === last}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-ink px-4 text-[14px] font-semibold text-cream [transition:background-color_var(--dur-fast)_var(--ease-out),opacity_var(--dur-fast)_var(--ease-out)] hover:bg-[#271811] disabled:cursor-default disabled:opacity-35"
            >
              Next page
              <Arrow />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * The front of a cover, a cloth hardcover after the reference shelf's books: the board in the programme's
 * colour, light at the top left to deep at the bottom right, with a fine weave and grain; the spine down
 * the left with the hinge's groove beside it; a gold foil frame (a double rule); inside it "Vajiram & Ravi",
 * the name, a small foil rule, the emblem (CoverArt), and at the foot the category and the course count.
 *
 * Under the foil, the earlier wall's geometric motif (GeoArt) is pressed faintly into the cloth.
 * Hover: the cloth grows brighter and more vivid, the motif moves (each in its own way) and shows a little
 * clearer, the foil brightens, a band of light sweeps across, and the foot gives way to "Open the book".
 * A little larger, in the same layout, on the book brought forward.
 */
function CoverFront({ programme, large }: { programme: Programme; large: boolean }) {
  const { light, base, deep, emblem, art } = programme.cover;
  const SPINE_W = large ? 26 : 14;
  const frame = large ? { top: 20, right: 20, bottom: 20, left: SPINE_W + 18 } : { top: 10, right: 10, bottom: 10, left: SPINE_W + 9 };
  return (
    <span
      className="relative block size-full overflow-clip rounded-[3px_7px_7px_3px] text-center [transition:filter_700ms_var(--ease-out)] group-hover/book:brightness-[1.12] group-hover/book:saturate-[1.3]"
      style={{ backgroundColor: base, backgroundImage: `linear-gradient(140deg, ${light} 0%, ${base} 48%, ${deep} 100%)` }}
    >
      {/* The motif pressed into the cloth, faint at rest and a little clearer while it moves on hover. */}
      <span aria-hidden="true" className="absolute inset-0 opacity-[0.16] [transition:opacity_700ms_var(--ease-out)] group-hover/book:opacity-[0.3]">
        <GeoArt kind={art} accent={FOIL} soft="#fff3dc" />
      </span>
      <span aria-hidden="true" className="book-cloth pointer-events-none absolute inset-0" />
      <span aria-hidden="true" className="cover-grain pointer-events-none absolute inset-0 opacity-[0.12]!" />
      {/* The spine and the hinge's groove. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0"
        style={{ width: SPINE_W, background: `linear-gradient(90deg, rgb(0 0 0 / 0.38), ${deep} 38%, ${base} 80%, rgb(0 0 0 / 0.2))` }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-0 w-[3px] bg-[linear-gradient(90deg,rgb(0_0_0/0.32),rgb(255_255_255/0.12))]"
        style={{ left: SPINE_W }}
      />
      {/* The light from the top left and the shade towards the fore-edge. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.14),transparent_42%,rgb(0_0_0/0.16))]" />

      {/* The foil frame, a double rule. */}
      <span
        aria-hidden="true"
        className="absolute rounded-[2px] border opacity-60 [transition:opacity_500ms_var(--ease-out)] group-hover/book:opacity-95"
        style={{ ...frame, borderColor: FOIL }}
      >
        <span className="absolute inset-[3px] rounded-[1px] border opacity-50" style={{ borderColor: FOIL }} />
      </span>

      <span className={cx("absolute flex flex-col items-center", large ? "px-6 pt-7 pb-6" : "px-2.5 pt-3.5 pb-3")} style={frame}>
        <span
          aria-hidden="true"
          className={cx("font-mono tracking-[0.2em] uppercase", large ? "text-[12px]/[16px]" : "text-[9px]/[12px]")}
          style={{ color: FOIL, opacity: 0.88 }}
        >
          Vajiram &amp; Ravi
        </span>
        <span
          className={cx("block font-heading font-medium text-balance text-[#ffe3b0]", large ? "mt-5 text-[34px]/[1.1]" : "mt-2.5 text-[17px]/[1.12]")}
        >
          {programme.name}
        </span>
        {/* A short foil rule with a lozenge. */}
        <span aria-hidden="true" className={cx("flex items-center gap-1.5", large ? "mt-4" : "mt-2")} style={{ color: FOIL }}>
          <span className={cx("h-px bg-current opacity-70", large ? "w-10" : "w-5")} />
          <span className={cx("rotate-45 bg-current", large ? "size-1.5" : "size-1")} />
          <span className={cx("h-px bg-current opacity-70", large ? "w-10" : "w-5")} />
        </span>
        <span aria-hidden="true" className="flex flex-1 items-center justify-center">
          <CoverArt emblem={emblem} size={large ? 128 : 66} />
        </span>
        {/* The foot: the category and the course count; on hover, "Open the book". */}
        <span className={cx("relative grid font-mono tracking-[0.1em] whitespace-nowrap uppercase", large ? "text-[12px]/[16px]" : "text-[9px]/[12px]")} style={{ color: FOIL }}>
          <span className="col-start-1 row-start-1 [transition:opacity_300ms_var(--ease-out)] group-hover/book:opacity-0">
            {programme.category} · {programme.count} courses
          </span>
          <span aria-hidden="true" className="col-start-1 row-start-1 text-[#ffe3b0] opacity-0 [transition:opacity_300ms_var(--ease-out)] group-hover/book:opacity-100">
            Open the book
          </span>
        </span>
      </span>

      {/*
        The foil's glint: now and then, while the shelf is on screen, a faint band of gold light passes
        across the cover by itself (globals.css, .lp-glint), each book at its own time.
      */}
      <span
        aria-hidden="true"
        className="lp-glint pointer-events-none absolute inset-y-0 -left-[60%] z-10 w-[45%] bg-[linear-gradient(90deg,transparent,rgb(255_226_160/0.3)_50%,transparent)] mix-blend-screen"
        style={{ animationDelay: `${-glintOffset(programme.name)}s` }}
      />
      {/* The shine: a band of light that sweeps across the cover on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-full z-10 w-[70%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgb(255_235_200/0.28),transparent)] opacity-0 group-hover/book:translate-x-[300%] group-hover/book:opacity-100 group-hover/book:[transition:translate_900ms_var(--ease-out),opacity_200ms] motion-reduce:hidden"
      />
    </span>
  );
}

/** What is printed on a right-hand page: the programme, one of its courses, or the way to all of them (kevin's pages). */
function Page({ leaf, programme, onTurn, onRestart }: { leaf: Leaf; programme: Programme; onTurn: () => void; onRestart: () => void }) {
  const href = programme.href;
  if (leaf.kind === "overview") {
    return (
      <>
        <p className="font-mono text-[12px]/[16px] tracking-[0.01em] text-burnt">
          {programme.category} · {programme.count} courses
        </p>
        <h3 className="mt-3 font-heading text-[32px]/[1.08] font-normal tracking-[-0.015em] text-ink">{programme.name}</h3>
        <p className="mt-3 text-[15px]/[1.55] text-clay">{programme.line}</p>
        <div className="mt-auto">
          <Cta variant="primary" size="md" onClick={onTurn}>
            Turn the page to see the courses
          </Cta>
        </div>
      </>
    );
  }
  if (leaf.kind === "course") {
    return (
      <>
        <p className="font-mono text-[12px]/[16px] tracking-[0.01em] text-burnt">
          Course {pad(leaf.index + 1)} of {pad(programme.count)}
        </p>
        <h3 className="mt-3 font-heading text-[34px]/[1.08] font-normal tracking-[-0.015em] text-ink">{leaf.name}</h3>
        <p className="mt-1 text-[14px]/[20px] text-clay">{programme.name}</p>
        {href !== null && (
          <div className="mt-auto">
            <IndianLink tone="light" href={href} ariaLabel={`View this course: ${leaf.name}`}>
              View this course
            </IndianLink>
          </div>
        )}
      </>
    );
  }
  return (
    <>
      <p className="font-mono text-[12px]/[16px] tracking-[0.01em] text-burnt">The full list</p>
      <h3 className="mt-3 font-heading text-[32px]/[1.08] font-normal tracking-[-0.015em] text-ink">All {programme.count} courses</h3>
      <p className="mt-3 text-[15px]/[1.55] text-clay">See every course in the {programme.name}, with its dates, learning modes and fees.</p>
      <div className="mt-auto flex flex-col items-start gap-3">
        <Cta variant="primary" size="md" href={href} ariaLabel={`View all ${programme.count} courses: ${programme.name}`}>
          View all {programme.count} courses
        </Cta>
        <button
          type="button"
          onClick={onRestart}
          className="flex cursor-pointer items-center gap-1.5 text-[14px] font-semibold text-clay [transition:color_var(--dur-fast)_var(--ease-out)] hover:text-ink"
        >
          <Arrow back />
          Back to the first page
        </button>
      </div>
    </>
  );
}

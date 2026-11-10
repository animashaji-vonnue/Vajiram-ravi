"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Cta from "@/components/ui/Cta";
import type { Programme } from "@/data/programmes";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/**
 * The shelf's measurements, in canvas px: covers of COVER square, five to a shelf across the 1280 column
 * (50px apart), on two shelves; a plank under each; and the open book, its pages PAGE square with the spine
 * at the middle of the stage, so the spread is centred.
 */
const STAGE = { width: 1280, height: 540 };
const COVER = 216;
const PER_SHELF = 5;
const GAP = (STAGE.width - PER_SHELF * COVER) / (PER_SHELF - 1);
const SHELF_TOPS = [6, 304];
const PLANK = 12;
const PAGE = 400;
const SPINE = { x: STAGE.width / 2, y: STAGE.height / 2 };

/** A book coming forward (and going back), and its cover swinging open (and shut). */
const MOVE_MS = 650;
const OPEN_MS = 750;
const TURN_MS = 700;

/** The entrance: the shelves draw out from their middles, then the covers are set on them one by one. */
const PLANK_MS = 700;
const SET_MS = 650;
const SET_STAGGER_MS = 70;
const SHELF_GAP_MS = 220;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
/** A soft spring for a cover landing on its shelf: a hair past its place, then settled. */
const SETTLE = "cubic-bezier(0.34, 1.4, 0.64, 1)";

/** The paper of a page, shaded a little towards the spine on whichever side the spine is. */
const PAPER = "bg-[#fff8ec]";
const SPINE_SHADE_RIGHT_PAGE = "bg-[linear-gradient(90deg,rgb(77_31_8/0.14),transparent_10%)]";
const SPINE_SHADE_LEFT_PAGE = "bg-[linear-gradient(270deg,rgb(77_31_8/0.14),transparent_10%)]";

/** A page turning swaps its stacking half-way, when it stands upright on the spine. */
const flip = (ms: number) => `transform ${ms}ms cubic-bezier(0.65, 0, 0.35, 1), z-index 0s linear ${ms / 2}ms`;

/** Where a cover stands on its shelf: its top left corner. */
function spot(i: number) {
  return { x: (i % PER_SHELF) * (COVER + GAP), y: SHELF_TOPS[Math.floor(i / PER_SHELF)] };
}

/** The pages of a book: the programme, then the way to its courses. */
type Leaf = "overview" | "courses";
const LEAVES: Leaf[] = ["overview", "courses"];

function Arrow({ back = false, className }: { back?: boolean; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width={16} height={16} fill="none" className={cx(back && "-scale-x-100", className)}>
      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The course shelf (after the `kevin` branch's "More UPSC programmes" wall, itself after Shopify Editions'
 * record shelf and library.jjangik.kr's books): the ten programme families as plain square covers on two
 * cream wall shelves, five to a shelf.
 *
 *   - A cover is the programme's own colour with a sheen, "Vajiram & Ravi" and its number at the top and
 *     its title and modes at the foot. Hover (or focus): it lifts off its shelf.
 *   - Choosing one brings it forward to the middle of the shelves, larger, while the rest blur back; then its
 *     cover swings open on the spine, and its pages can be turned: the programme (what it is, how it is
 *     taught) and the way to its courses on vajiramandravi.com. Above the open book a line says to turn the
 *     pages; under it, previous and next and the page number. A click on the right-hand page, or →, turns
 *     forward; on the left-hand page, or ←, back.
 *   - Closing shuts the cover first, then puts the book back: the open cover, Escape or a click on the wall
 *     all close it. Choosing another book puts this one back first.
 *   - Entrance, once, when the shelves come into view: the shelves draw out from their middles, then the
 *     covers are set on them one by one, each dropping in from a slight tilt and settling. Reduced motion,
 *     or already on screen: all simply there, and the book opens without the swing.
 */
export default function CourseShelf({ programmes }: { programmes: Programme[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  // `picked` is the book brought forward; `open` is whether its cover has swung open.
  const [picked, setPicked] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);

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

  useEffect(() => () => window.clearTimeout(timer.current), []);

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
    root.querySelectorAll<HTMLElement>("[data-plank]").forEach((plank, s) => {
      animations.push(plank.animate([{ transform: "scaleX(0)" }, { transform: "none" }], { duration: PLANK_MS, delay: s * SHELF_GAP_MS, easing: EASE_OUT, fill: "backwards" }));
    });
    root.querySelectorAll<HTMLElement>("[data-cover]").forEach((cover, i) => {
      const shelf = Math.floor(i / PER_SHELF);
      animations.push(
        cover.animate(
          [
            { transform: "translateY(-56px) rotate(-5deg)", opacity: 0 },
            { transform: "none", opacity: 1 },
          ],
          { duration: SET_MS, delay: shelf * SHELF_GAP_MS + PLANK_MS * 0.45 + (i % PER_SHELF) * SET_STAGGER_MS, easing: SETTLE, fill: "backwards" },
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
    if (i === picked) return { left: SPINE.x, top: SPINE.y - PAGE / 2, width: PAGE, height: PAGE, zIndex: 20 };
    const { x, y } = spot(i);
    return {
      left: x,
      top: y,
      width: COVER,
      height: COVER,
      transform: hovered === i && !away ? "translateY(-12px)" : "none",
      filter: away ? "blur(14px)" : "none",
      opacity: away ? 0.25 : 1,
    };
  };

  return (
    // A click on the wall, away from the books, closes an open one.
    <div
      ref={rootRef}
      className="relative mx-auto"
      style={{ width: STAGE.width, height: STAGE.height }}
      onClick={(event) => event.target === event.currentTarget && close()}
    >
      {/* The shelves: cream planks with a front edge and a soft shadow on the wall. */}
      {SHELF_TOPS.map((top) => (
        <span
          key={top}
          data-plank
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute -inset-x-6 rounded-[2px] bg-linear-to-b from-[#fffaf0] from-20% to-[#ecd9bb] shadow-[0_16px_22px_-12px_rgb(77_31_8/0.4)] [transition:filter_700ms_var(--ease-out),opacity_700ms_var(--ease-out)]",
            away && "opacity-25 blur-[14px]",
          )}
          style={{ top: top + COVER, height: PLANK }}
        />
      ))}

      {programmes.map((programme, i) => (
        <Book
          key={programme.number}
          programme={programme}
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
  );
}

type BookProps = {
  programme: Programme;
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

/**
 * One programme as a book on the shelf. Out and open, it is a little flipbook: the cover swings open on the
 * spine, and the pages turn the same way, each over the next.
 */
function Book({ programme, out, open, away, style, onPick, onClose, onHover }: BookProps) {
  // How many pages have been turned; the last page is never turned.
  const [turned, setTurned] = useState(0);
  const last = LEAVES.length - 1;
  const turn = (by: number) => setTurned((t) => Math.min(last, Math.max(0, t + by)));

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
      inert={away}
      className="absolute shadow-[0_14px_24px_-14px_rgb(77_31_8/0.55)] [transition:left_650ms_var(--ease-out),top_650ms_var(--ease-out),width_650ms_var(--ease-out),height_650ms_var(--ease-out),transform_var(--dur-base)_var(--ease-out),filter_700ms_var(--ease-out),opacity_700ms_var(--ease-out)]"
      style={style}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div data-cover className="absolute inset-0 [perspective:2200px]">
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
            <Arrow className="animate-[nudge_1.6s_ease-in-out_infinite]" />
          </p>
        )}

        {/* The inside of the back cover, under every page. */}
        {out && <div aria-hidden="true" className={cx("absolute inset-0", PAPER)} />}

        {/* The pages. */}
        {out &&
          LEAVES.map((leaf, i) => {
            const isTurned = i < turned;
            const current = open && i === turned;
            return (
              <div
                key={leaf}
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
                  <span className="px-10 text-center font-serif text-[18px]/[1.3] italic">{programme.title}</span>
                  <span className="absolute bottom-6 font-mono text-[11px] tracking-[0.06em]">{i * 2 + 2}</span>
                </div>
              </div>
            );
          })}

        {/* The cover, hinged on the spine: the front on the shelf, its inside once it swings open. */}
        <button
          type="button"
          aria-label={out ? `Close ${programme.title}` : `Open ${programme.title}`}
          aria-expanded={open}
          onClick={() => (out ? onClose() : onPick())}
          className="absolute inset-0 origin-left cursor-pointer rounded-[3px] [transform-style:preserve-3d] focus-visible:outline-offset-4"
          style={{ transform: open ? "rotateY(-180deg)" : "none", zIndex: open ? 55 : 100, transition: flip(OPEN_MS) }}
        >
          <span className="absolute inset-0 [backface-visibility:hidden]">
            <CoverFront programme={programme} large={out} />
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 flex flex-col justify-between p-8 text-left text-cream [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{ backgroundColor: programme.cover.colour, backgroundImage: "linear-gradient(270deg, rgb(0 0 0/0.28), transparent 14%, rgb(0 0 0/0.08))" }}
          >
            <span className="font-mono text-[11px]/[14px] tracking-[0.18em] uppercase opacity-85">Vajiram &amp; Ravi</span>
            <span className="font-serif text-[22px]/[1.15] opacity-90">Since 1976</span>
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
            <p aria-live="polite" className="font-mono text-[12px] tracking-[0.06em] text-clay uppercase">
              Page {turned + 1} of {LEAVES.length}
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
 * The front of a cover: the programme's colour with a sheen and a fine light edge down the spine,
 * "Vajiram & Ravi" and the number at the top, the title and how it is taught at the foot. A little larger
 * on the book brought forward.
 */
function CoverFront({ programme, large }: { programme: Programme; large: boolean }) {
  const light = programme.cover.type === "light";
  return (
    <span
      className={cx("relative flex size-full flex-col justify-between overflow-clip rounded-[3px] text-left", large ? "p-8" : "p-4", light ? "text-cream" : "text-ink")}
      style={{ backgroundColor: programme.cover.colour, backgroundImage: "linear-gradient(135deg, rgb(255 255 255/0.2), transparent 55%, rgb(0 0 0/0.14))" }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-white/25" />
      <span className={cx("flex items-start justify-between font-mono tracking-[0.16em] uppercase", large ? "text-[12px]/[16px]" : "text-[9.5px]/[12px]", light ? "text-cream/80" : "text-[#a8431a]")}>
        <span>Vajiram &amp; Ravi</span>
        <span className="tracking-[0.08em]">{programme.number}</span>
      </span>
      <span>
        <span className={cx("block font-serif", large ? "text-[36px]/[1.08]" : "text-[21px]/[1.12]")}>{programme.title}</span>
        <span className={cx("mt-1.5 block", large ? "text-[14px]/[19px]" : "text-[11px]/[14px]", light ? "text-cream/75" : "text-ink/65")}>{programme.modes}</span>
      </span>
    </span>
  );
}

/** What is printed on a right-hand page: the programme, or the way to its courses. */
function Page({ leaf, programme, onTurn, onRestart }: { leaf: Leaf; programme: Programme; onTurn: () => void; onRestart: () => void }) {
  if (leaf === "overview") {
    return (
      <>
        <p className="font-mono text-[12px]/[16px] tracking-[0.08em] text-burnt uppercase">Programme {programme.number}</p>
        <h3 className="mt-3 font-serif text-[32px]/[1.08] font-normal tracking-[-0.015em] text-ink">{programme.title}</h3>
        <p className="mt-3 text-[15px]/[1.55] text-clay">{programme.text}</p>
        <p className="mt-4 text-[12px]/[16px] text-clay">
          How it is taught
          <span className="block text-[15px]/[21px] font-semibold text-ink">{programme.modes}</span>
        </p>
        <button
          type="button"
          onClick={onTurn}
          className="group/turn mt-auto flex h-11 w-fit cursor-pointer items-center gap-2.5 rounded-full bg-burnt px-5 text-[15px] font-semibold text-cream [transition:background-color_var(--dur-fast)_var(--ease-out)] hover:bg-[#b84d00]"
        >
          Turn the page
          <Arrow className="[transition:translate_var(--dur-fast)_var(--ease-out)] group-hover/turn:translate-x-1" />
        </button>
      </>
    );
  }
  const href = programme.cta.href;
  return (
    <>
      <p className="font-mono text-[12px]/[16px] tracking-[0.08em] text-burnt uppercase">The courses</p>
      <h3 className="mt-3 font-serif text-[32px]/[1.08] font-normal tracking-[-0.015em] text-ink">Every course in {programme.title}</h3>
      <p className="mt-3 text-[15px]/[1.55] text-clay">
        {href !== null
          ? "See each course with its dates, learning modes and fees on vajiramandravi.com."
          : "Speak with our academic counsellors to find the course that suits your preparation."}
      </p>
      <div className="mt-auto flex flex-col items-start gap-3">
        {href !== null ? (
          <Cta variant="primary" size="md" href={href} ariaLabel={`${programme.cta.label}: ${programme.title}`}>
            {programme.cta.label}
          </Cta>
        ) : (
          <Cta variant="primary" size="md" href="#counselling">
            Get Expert Guidance
          </Cta>
        )}
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

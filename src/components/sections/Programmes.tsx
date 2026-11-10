"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Check, OpenBook } from "iconoir-react";
import { programmes } from "@/data/content";
import { Button } from "@/components/ui/Button";
import SectionIntro, { Eyebrow } from "@/components/ui/SectionIntro";
import { prefersReducedMotion } from "@/lib/motion";
import { cx } from "@/lib/cx";

/** How long each photograph of the featured programme stays before the next fades in. */
const PHOTO_MS = 4500;

/**
 * The featured programme, General Studies Prelims & Mains, on a glass panel over the orange: its photographs
 * fading from one to the next, and beside them its name, line, benefits, who it suits, how it can be taken, its
 * duration and two buttons.
 */
function Featured() {
  const { featured } = programmes;
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = setInterval(() => setPhoto((p) => (p + 1) % featured.photos.length), PHOTO_MS);
    return () => clearInterval(timer);
  }, [featured.photos.length]);

  return (
    <article
      aria-labelledby="featured-programme"
      className="fade-up mt-16 grid grid-cols-[560px_1fr] overflow-hidden rounded-[36px] bg-white/10 ring-1 ring-white/25 backdrop-blur-sm"
    >
      <div className="relative min-h-[640px] overflow-hidden">
        {featured.photos.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="560px"
            className="object-cover transition-[opacity,scale] duration-[1200ms] ease-out-soft"
            style={{ opacity: i === photo ? 1 : 0, scale: i === photo ? "1" : "1.06" }}
          />
        ))}
        <span className="absolute top-6 left-6 rounded-full bg-white px-4 py-2 text-[13px] font-semibold tracking-[0.08em] text-saffron-700 uppercase">
          {featured.tag}
        </span>
      </div>

      <div className="flex flex-col p-14">
        <h3 id="featured-programme" className="font-serif text-[56px]/[1.02] tracking-[-0.015em] text-balance">
          {featured.name}
        </h3>
        <p className="mt-4 font-serif text-[24px]/[1.3] text-glow italic">{featured.line}</p>

        <ul className="mt-9 flex flex-col gap-3.5">
          {featured.benefits.map((benefit) => (
            <li key={benefit} className="flex gap-3.5 text-[17px]/[25px]">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-saffron-600">
                <Check width={14} height={14} strokeWidth={2.4} />
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <dl className="mt-10 grid grid-cols-3 gap-8 border-t border-white/30 pt-7">
          {[
            ["Who it's for", featured.for],
            ["Learning options", featured.mode],
            ["Duration", featured.duration],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="text-[13px] font-semibold tracking-[0.14em] text-white/85 uppercase">{term}</dt>
              <dd className="mt-2 text-[16px]/[24px] text-white">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-wrap gap-3 pt-10">
          <Button href={featured.href} tone="light">
            {featured.cta}
          </Button>
          <Button href="#batches" tone="ghost-light">
            See upcoming batches
          </Button>
        </div>
      </div>
    </article>
  );
}

type Course = (typeof programmes.wall.list)[number];

/**
 * The wall's measurements in canvas pixels, as in v4: books of SLEEVE square, four to a shelf with GAP between
 * them, on two shelves, and the stage they stand on.
 */
const STAGE = { width: 1180, height: 620 };
const SLEEVE = 190;
const GAP = 40;
const PER_SHELF = 4;
const SHELF_OVERHANG = 56;
const SHELF_TOPS = [70, 340];
/** The open book: its page size, and where its spine stands (the middle of the stage, so the spread is centred). */
const PAGE = 380;
const SPINE = { x: STAGE.width / 2, y: STAGE.height / 2 };
/** How long a book takes to come forward, and its cover to swing open. */
const MOVE_MS = 650;
const OPEN_MS = 750;

/** Where a sleeve stands on its shelf: its top left corner. */
function spot(i: number) {
  const left = (STAGE.width - (PER_SHELF * SLEEVE + (PER_SHELF - 1) * GAP)) / 2;
  return { x: left + (i % PER_SHELF) * (SLEEVE + GAP), y: SHELF_TOPS[Math.floor(i / PER_SHELF)] };
}

/** A sleeve: a plain cover in the programme's colour with its name and how many courses it holds. */
function Sleeve({ course }: { course: Course }) {
  return (
    <span
      className="flex size-full flex-col justify-between p-4 text-left text-white"
      style={{
        backgroundColor: course.colour,
        backgroundImage: "linear-gradient(135deg, rgb(255 255 255/0.18), transparent 55%, rgb(0 0 0/0.18))",
      }}
    >
      <span className="text-[9px]/[12px] font-bold tracking-[0.18em] uppercase opacity-80">Vajiram &amp; Ravi</span>
      <span>
        <span className="block font-serif text-[22px]/[1.1]">{course.name}</span>
        <span className="mt-1.5 block text-[11px]/[14px] opacity-80">{course.count} courses</span>
      </span>
    </span>
  );
}

type Leaf = { kind: "overview" } | { kind: "course"; name: string; index: number; total: number } | { kind: "all" };

/** The paper of a page, a little shaded towards the spine on whichever side the spine is. */
const PAPER = "bg-[#fbf4e6]";
const SPINE_SHADE_RIGHT_PAGE = "bg-[linear-gradient(90deg,rgb(60_30_10/0.16),transparent_10%)]";
const SPINE_SHADE_LEFT_PAGE = "bg-[linear-gradient(270deg,rgb(60_30_10/0.16),transparent_10%)]";

/**
 * One programme as a book on the shelf. Out of the shelf and open, it is a little flipbook: the cover swings open on
 * the spine, and the pages turn the same way, each over the next. The first right-hand page is the programme (how
 * many courses, its name, its line and the next batch); then one page for each course it names; and last, a page to
 * view all its courses. Above the open book a line says to turn the pages; under it, the previous and next buttons
 * and the page number. A click on the right-hand page, or →, turns forward; on the left-hand page, or ←, back.
 */
function Book({
  item,
  out,
  open,
  style,
  onPick,
  onClose,
  onHover,
}: {
  item: Course;
  out: boolean;
  open: boolean;
  style: CSSProperties;
  onPick: () => void;
  onClose: () => void;
  onHover: (on: boolean) => void;
}) {
  const leaves: Leaf[] = [
    { kind: "overview" },
    ...item.courses.map((name, index) => ({ kind: "course" as const, name, index, total: item.courses.length })),
    { kind: "all" },
  ];
  // How many pages have been turned; the last page is never turned.
  const [turned, setTurned] = useState(0);
  const last = leaves.length - 1;
  const turn = (by: number) => setTurned((t) => Math.min(last, Math.max(0, t + by)));

  useEffect(() => {
    if (!open) {
      setTurned(0);
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") turn(1);
      if (event.key === "ArrowLeft") turn(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // A turning page swaps its stacking at the half-way point, when it stands upright on the spine.
  const flip = (ms: number) => `transform ${ms}ms cubic-bezier(0.65,0,0.35,1), z-index 0s linear ${ms / 2}ms`;

  return (
    <div
      className="absolute shadow-[0_14px_24px_-14px_rgb(40_25_15/0.6)] transition-[left,top,width,height,transform,filter,opacity] ease-[cubic-bezier(0.22,1,0.36,1)] [perspective:2200px]"
      style={{ transitionDuration: `${MOVE_MS}ms`, ...style }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* The instruction, over the open spread. */}
      {out && (
        <p
          aria-hidden={!open}
          className={cx(
            "pointer-events-none absolute bottom-full left-0 mb-5 flex w-max -translate-x-1/2 items-center gap-2.5 rounded-full bg-ink-950/45 py-2 pr-4 pl-2 text-[14px] font-semibold text-white backdrop-blur-md transition-opacity duration-500",
            open ? "opacity-100 delay-300" : "opacity-0",
          )}
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-white text-saffron-600">
            <OpenBook width={16} height={16} strokeWidth={1.8} />
          </span>
          Turn the pages to see the courses
          <ArrowRight width={16} height={16} strokeWidth={2} className="animate-[nudge_1.6s_ease-in-out_infinite]" />
        </p>
      )}

      {/* The inside of the back cover, under every page. */}
      {out && <div aria-hidden="true" className={cx("absolute inset-0", PAPER)} />}

      {/* The pages. */}
      {out &&
        leaves.map((leaf, i) => {
          const isTurned = i < turned;
          const current = open && i === turned;
          return (
            <div
              key={i}
              className="absolute inset-0 origin-left [transform-style:preserve-3d]"
              style={{
                transform: isTurned ? "rotateY(-180deg)" : "none",
                zIndex: isTurned ? 60 + i : 50 - i,
                transition: flip(700),
              }}
            >
              {/* The front: the right-hand page. A click on it, away from its buttons, turns it. */}
              <div
                aria-hidden={!current}
                inert={!current}
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest("a,button")) return;
                  if (i < last) turn(1);
                }}
                className={cx(
                  "absolute inset-0 flex cursor-pointer flex-col overflow-clip p-9 pl-11 text-ink-900 [backface-visibility:hidden]",
                  PAPER,
                  SPINE_SHADE_RIGHT_PAGE,
                )}
              >
                <Page leaf={leaf} item={item} onTurn={() => turn(1)} onRestart={() => setTurned(0)} />
                {/* A turned-up corner, saying the page can be turned. */}
                {i < last && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0 bottom-0 size-9 bg-[linear-gradient(315deg,transparent_50%,#e8dcc6_50%,#f4ead6)] shadow-[-3px_-3px_6px_-2px_rgb(60_30_10/0.25)]"
                  />
                )}
              </div>
              {/* The back: the left-hand page once turned. A click on it turns it back. */}
              <div
                aria-hidden="true"
                onClick={() => turn(-1)}
                className={cx(
                  "absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 text-ink-900/45 [backface-visibility:hidden] [transform:rotateY(180deg)]",
                  PAPER,
                  SPINE_SHADE_LEFT_PAGE,
                )}
              >
                <span className="size-[18px] bg-marigold/60 [mask:url(/images/ornaments/butta.svg)_center/contain_no-repeat]" />
                <span className="font-serif text-[18px] italic">{item.name}</span>
                <span className="absolute bottom-6 font-mono text-[11px] tracking-[0.06em]">{i * 2 + 2}</span>
              </div>
            </div>
          );
        })}

      {/* The cover, hinged on the spine: the front on the shelf, the inside once it swings open. */}
      <button
        type="button"
        aria-label={open ? `Close ${item.name}` : `Open ${item.name}, ${item.count} courses`}
        aria-expanded={open}
        onClick={() => (out ? onClose() : onPick())}
        className="absolute inset-0 origin-left [transform-style:preserve-3d]"
        style={{ transform: open ? "rotateY(-180deg)" : "none", zIndex: open ? 55 : 100, transition: flip(OPEN_MS) }}
      >
        <span className="absolute inset-0 [backface-visibility:hidden]">
          <Sleeve course={item} />
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex flex-col justify-between p-8 text-left text-white [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{
            backgroundColor: item.colour,
            backgroundImage: "linear-gradient(270deg, rgb(0 0 0/0.28), transparent 14%, rgb(0 0 0/0.08))",
          }}
        >
          <span className="text-[11px]/[14px] font-bold tracking-[0.18em] uppercase opacity-80">
            Vajiram &amp; Ravi
          </span>
          <span className="font-serif text-[22px]/[1.15] opacity-90">Since 1976</span>
        </span>
      </button>

      {/* Under the open spread: previous and next, and where you are. */}
      {out && (
        <div
          aria-hidden={!open}
          inert={!open}
          className={cx(
            "absolute top-full left-0 mt-5 flex w-[760px] -translate-x-1/2 items-center justify-between transition-opacity duration-500",
            open ? "opacity-100 delay-300" : "pointer-events-none opacity-0",
          )}
        >
          <button
            type="button"
            onClick={() => turn(-1)}
            disabled={turned === 0}
            className="flex h-10 items-center gap-2 rounded-full bg-white/15 px-4 text-[14px] font-semibold text-white backdrop-blur-sm transition-[background-color,opacity] hover:bg-white/25 disabled:opacity-35"
          >
            <ArrowLeft width={16} height={16} strokeWidth={2} />
            Previous page
          </button>
          <p aria-live="polite" className="font-mono text-[12px] tracking-[0.06em] text-white/90 uppercase">
            Page {turned + 1} of {leaves.length}
          </p>
          <button
            type="button"
            onClick={() => turn(1)}
            disabled={turned === last}
            className="flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-semibold text-ink-900 transition-[background-color,opacity] hover:bg-paper disabled:opacity-35"
          >
            Next page
            <ArrowRight width={16} height={16} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

/** What is printed on a right-hand page: the programme, one of its courses, or the way to all of them. */
function Page({
  leaf,
  item,
  onTurn,
  onRestart,
}: {
  leaf: Leaf;
  item: Course;
  onTurn: () => void;
  onRestart: () => void;
}) {
  if (leaf.kind === "overview") {
    return (
      <>
        <p className="font-mono text-[12px]/[16px] tracking-[0.06em] text-marigold uppercase">{item.count} courses</p>
        <h3 className="mt-3 font-serif text-[32px]/[1.05] tracking-[-0.015em]">{item.name}</h3>
        <p className="mt-3 text-[15px]/[23px] text-muted">{item.line}</p>
        <p className="mt-4 text-[12px]/[16px] text-muted">
          Next batch starts
          <span className="block text-[15px]/[21px] font-semibold text-ink-900">{item.nextBatch}</span>
        </p>
        <button
          type="button"
          onClick={onTurn}
          className="group/turn mt-auto flex h-11 w-fit items-center gap-2.5 rounded-full bg-saffron-500 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-saffron-600"
        >
          Turn the page to see the courses
          <ArrowRight
            width={17}
            height={17}
            strokeWidth={1.9}
            className="transition-transform group-hover/turn:translate-x-1"
          />
        </button>
      </>
    );
  }
  if (leaf.kind === "course") {
    return (
      <>
        <p className="font-mono text-[12px]/[16px] tracking-[0.06em] text-marigold uppercase">
          Course {String(leaf.index + 1).padStart(2, "0")} of {String(item.count).padStart(2, "0")}
        </p>
        <h3 className="mt-3 font-serif text-[34px]/[1.05] tracking-[-0.015em]">{leaf.name}</h3>
        <p className="mt-1 text-[14px]/[20px] text-muted">{item.name}</p>
        <dl className="mt-5 flex flex-col border-t border-ink-900/12 text-[14px]/[20px]">
          {[
            ["Learning mode", "[To be confirmed]"],
            ["Duration", "[To be confirmed]"],
            ["Next batch", item.nextBatch],
          ].map(([term, value]) => (
            <div key={term} className="flex justify-between gap-4 border-b border-ink-900/12 py-2">
              <dt className="text-muted">{term}</dt>
              <dd className="font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        <a
          href={item.href}
          className="group/link mt-auto flex w-fit items-center gap-2 text-[15px] font-semibold text-saffron-600"
        >
          View this course
          <ArrowRight
            width={16}
            height={16}
            strokeWidth={2}
            className="transition-transform group-hover/link:translate-x-1"
          />
        </a>
      </>
    );
  }
  return (
    <>
      <p className="font-mono text-[12px]/[16px] tracking-[0.06em] text-marigold uppercase">The full list</p>
      <h3 className="mt-3 font-serif text-[32px]/[1.05] tracking-[-0.015em]">All {item.count} courses</h3>
      <p className="mt-3 text-[15px]/[23px] text-muted">
        See every course in the {item.name}, with its dates, learning modes and fees.
      </p>
      <div className="mt-auto flex flex-col items-start gap-3">
        <Button href={item.href} size="md">
          View all {item.count} courses
        </Button>
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-1.5 text-[14px] font-semibold text-muted hover:text-ink-900"
        >
          <ArrowLeft width={15} height={15} strokeWidth={2} />
          Back to the first page
        </button>
      </div>
    </>
  );
}

/**
 * Every programme on one wall, in the v4 design (after shopify.com/editions): the programmes as books standing on two
 * white shelves, over the ruins of Nalanda in line art. A book lifts off its shelf when the pointer is on it. Picking
 * one brings it forward to the middle of the wall, larger, while the rest blur; then its cover swings open on the
 * spine (after library.jjangik.kr) and its pages can be turned to see the courses. Closing shuts the cover first,
 * then puts the book back; Escape, the open cover or a click on the wall all close it.
 */
function Wall() {
  const { wall } = programmes;
  const list = wall.list;
  // `picked` is the book brought forward; `open` is whether its cover has swung open.
  const [picked, setPicked] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const later = (fn: () => void, ms: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  };

  const pick = (i: number) => {
    if (picked === i) return;
    if (picked !== null) {
      // Another book is out: close it and put it back, then bring this one.
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

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (picked === null) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const place = (i: number): CSSProperties => {
    const { x, y } = spot(i);
    if (i === picked) {
      return { left: SPINE.x, top: SPINE.y - PAGE / 2, width: PAGE, height: PAGE, zIndex: 20 };
    }
    return {
      left: x,
      top: y,
      width: SLEEVE,
      height: SLEEVE,
      transform: hovered === i && picked === null ? "translateY(-12px)" : "none",
      filter: picked !== null ? "blur(20px)" : "none",
      opacity: picked !== null ? 0.25 : 1,
    };
  };

  return (
    <div className="relative mt-28">
      {/* The ruins of Nalanda in line art, behind the shelves; they fade and blur back while a book is out. */}
      <Image
        src={wall.backdrop}
        alt=""
        width={1344}
        height={576}
        sizes="1344px"
        className={cx(
          "pointer-events-none absolute inset-x-0 bottom-[-128px] w-full opacity-60 mix-blend-multiply brightness-75 contrast-200 sepia transition-[opacity,filter] duration-700",
          picked !== null && "opacity-15 blur-[6px]",
        )}
      />
      <div className="fade-up relative flex flex-col items-center text-center">
        <Eyebrow tone="ember">{wall.title}</Eyebrow>
        <p className="mt-5 w-[520px] text-[18px]/[29px] text-white/95">{wall.intro}</p>
      </div>

      {/* The wall. A click on it, away from the books, closes an open one. */}
      <div
        className="relative mx-auto mt-8"
        style={{ width: STAGE.width, height: STAGE.height }}
        onClick={(event) => event.target === event.currentTarget && close()}
      >
        {/* The shelves, each a white ledge casting a soft shadow on the wall. */}
        {SHELF_TOPS.map((top) => (
          <span
            key={top}
            aria-hidden="true"
            className={cx(
              "pointer-events-none absolute h-4 rounded-[2px] border-b-[3px] border-[#ddd6cd] bg-linear-to-b from-white to-[#f4f1ec] shadow-[0_26px_34px_-14px_rgb(40_25_15/0.45)] transition-[filter,opacity] duration-700",
              picked !== null && "opacity-25 blur-[20px]",
            )}
            style={{
              top: top + SLEEVE,
              left: spot(0).x - SHELF_OVERHANG,
              width: PER_SHELF * SLEEVE + (PER_SHELF - 1) * GAP + 2 * SHELF_OVERHANG,
            }}
          />
        ))}

        {list.map((item, i) => (
          <Book
            key={item.name}
            item={item}
            out={picked === i}
            open={picked === i && open}
            style={place(i)}
            onPick={() => pick(i)}
            onClose={close}
            onHover={(on) => setHovered(on ? i : null)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Explore UPSC programmes, on the orange ground: the intro, the featured General Studies Prelims & Mains programme,
 * then every programme on the record-shelf wall from v4.
 */
export default function Programmes() {
  return (
    <section
      id="programmes"
      aria-labelledby="programmes-title"
      className="ember scroll-mt-[76px] pt-32 pb-24 text-white"
    >
      <div className="mx-auto w-canvas px-12">
        <SectionIntro
          id="programmes-title"
          tone="ember"
          eyebrow={programmes.eyebrow}
          headline={programmes.headline}
          description={programmes.description}
        />

        <Featured />

        <Wall />
      </div>
    </section>
  );
}

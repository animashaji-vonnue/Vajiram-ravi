"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { Xmark } from "iconoir-react";
import { courses } from "@/data/home";
import { Button } from "@/components/ui/Buttons";
import { Lozenge, TitleRule } from "@/components/ui/Ornaments";
import SplitHeading from "@/components/ui/SplitHeading";
import { cx } from "@/lib/cx";

type Course = (typeof courses.list)[number];

/** The heading's ornaments' colour: white, like the text on the orange card. */
const ORNAMENT = "#ffffff";

/**
 * The wall's measurements in canvas pixels: sleeves of SLEEVE square, four to a shelf with GAP between them, on
 * two shelves; the stage they stand on; and where a picked sleeve comes forward to, a little right of centre and
 * LIFT times its size, leaving room on the left for its details.
 */
const STAGE = { width: 1180, height: 620 };
const SLEEVE = 190;
const GAP = 40;
const PER_SHELF = 4;
const SHELF_OVERHANG = 56;
const SHELF_TOPS = [70, 340];
const FRONT = { x: 700, y: STAGE.height / 2 };
const LIFT = 1.55;

/** Where a sleeve stands on its shelf: its top left corner. */
function spot(i: number) {
  const left = (STAGE.width - (PER_SHELF * SLEEVE + (PER_SHELF - 1) * GAP)) / 2;
  return { x: left + (i % PER_SHELF) * (SLEEVE + GAP), y: SHELF_TOPS[Math.floor(i / PER_SHELF)] };
}

/** A placeholder sleeve: a plain cover in the course's colour with its name and how many courses it holds. */
function Sleeve({ course }: { course: Course }) {
  return (
    <span
      className="flex size-full flex-col justify-between p-4 text-left text-white"
      style={{
        backgroundColor: course.colour,
        backgroundImage: "linear-gradient(135deg, rgb(255 255 255/0.18), transparent 55%, rgb(0 0 0/0.18))",
      }}
    >
      <span className="font-noto-serif text-[9px]/[12px] font-bold tracking-[0.18em] uppercase opacity-80">
        Vajiram &amp; Ravi
      </span>
      <span>
        <span className="block font-serif text-[21px]/[1.1] [font-variation-settings:'SOFT'_0,'WONK'_0]">
          {course.name}
        </span>
        <span className="mt-1.5 block font-noto-serif text-[11px]/[14px] opacity-80">{course.count} courses</span>
      </span>
    </span>
  );
}

/**
 * The courses, after the edition wall on shopify.com/editions, on an orange card with the ruins of Nalanda in line
 * art along its foot: the heading as on the faculty section, then the courses as record sleeves standing on two white
 * shelves. A sleeve lifts off its shelf when the pointer is on it. Picking one brings it forward and larger while the
 * rest of the wall blurs, and its course count, name, line, next batch and a link appear beside it; Escape, the close
 * button or a click on the wall puts it back. The courses are the design's (3860:405); the sleeves stay plain covers
 * until there is artwork.
 */
export default function Courses() {
  const list = courses.list;
  const [picked, setPicked] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const course = picked === null ? null : list[picked];

  useEffect(() => {
    if (picked === null) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setPicked(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [picked]);

  const place = (i: number): CSSProperties => {
    const { x, y } = spot(i);
    if (i === picked) {
      const dx = FRONT.x - (x + SLEEVE / 2);
      const dy = FRONT.y - (y + SLEEVE / 2);
      return { left: x, top: y, transform: `translate(${dx}px, ${dy}px) scale(${LIFT})`, zIndex: 20 };
    }
    return {
      left: x,
      top: y,
      transform: hovered === i && picked === null ? "translateY(-12px)" : "none",
      filter: picked !== null ? "blur(20px)" : "none",
      opacity: picked !== null ? 0.25 : 1,
    };
  };

  return (
    <section aria-labelledby="courses-title" className="mt-24 px-10">
      <div className="relative isolate overflow-hidden rounded-[32px] bg-[radial-gradient(ellipse_at_center,#ffa04a_20%,#f68026)] py-24 text-white">
        {/*
          The ruins of Nalanda in line art, across the card's foot behind the shelves, in dark brown: its lines are
          darkened and warmed, and its white paper drops out against the orange. It fades and blurs back while a course is picked.
        */}
        <Image
          src={courses.backdrop}
          alt=""
          width={1344}
          height={576}
          sizes="100vw"
          className={cx(
            "absolute inset-x-0 bottom-0 -z-10 w-full mix-blend-multiply brightness-75 contrast-200 sepia transition-[opacity,filter] duration-700",
            picked !== null && "opacity-20 blur-[6px]",
          )}
        />
        {/* The heading as on the faculty section: spaced capitals between gilt double rules, a lozenge under it. */}
        <div data-reveal className="mx-auto flex w-canvas flex-col items-center text-center">
          <div className="flex items-center gap-5">
            <TitleRule colour={ORNAMENT} className="w-[150px] flex-none" />
            <h2
              data-split
              id="courses-title"
              className="font-noto-serif text-[30px]/[40px] font-bold tracking-[0.12em] uppercase"
            >
              <SplitHeading text={courses.heading} />
            </h2>
            <TitleRule colour={ORNAMENT} mirrored className="w-[150px] flex-none" />
          </div>
          <Lozenge colour={ORNAMENT} className="mt-3" />
          <p className="mt-6 w-[520px] font-noto-serif text-[18px]/[30px] text-white/85">{courses.intro}</p>
        </div>

        {/* The wall. A click on it, away from the sleeves, puts a picked sleeve back. */}
        <div
          className="relative mx-auto mt-10"
          style={{ width: STAGE.width, height: STAGE.height }}
          onClick={(event) => event.target === event.currentTarget && setPicked(null)}
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
              // Each shelf runs SHELF_OVERHANG past the sleeves at either end.
              style={{
                top: top + SLEEVE,
                left: spot(0).x - SHELF_OVERHANG,
                width: PER_SHELF * SLEEVE + (PER_SHELF - 1) * GAP + 2 * SHELF_OVERHANG,
              }}
            />
          ))}

          {list.map((item, i) => (
            <button
              key={item.name}
              type="button"
              aria-label={`${item.name}, ${item.count} courses`}
              aria-pressed={picked === i}
              onClick={() => setPicked(picked === i ? null : i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="absolute shadow-[0_14px_24px_-14px_rgb(40_25_15/0.6)] transition-[transform,filter,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: SLEEVE, height: SLEEVE, ...place(i) }}
            >
              <Sleeve course={item} />
            </button>
          ))}

          {/* The picked course's details, beside it on the left. */}
          <div
            aria-live="polite"
            className={cx(
              "absolute top-1/2 left-0 z-30 w-[400px] -translate-y-1/2 transition-[opacity,translate] duration-500",
              course ? "opacity-100" : "pointer-events-none -translate-x-4 opacity-0",
            )}
          >
            {course && (
              <>
                <p className="font-noto-serif text-[13px]/[20px] font-bold tracking-[0.12em] text-brown-950/70 uppercase">
                  {course.count} courses
                </p>
                <h3 className="mt-3 font-serif text-[44px]/[1.05] font-normal tracking-[-0.02em] text-brown-950 [font-variation-settings:'SOFT'_0,'WONK'_0]">
                  {course.name}
                </h3>
                <p className="mt-4 font-noto-serif text-[18px]/[29px] text-brown-950/85">{course.line}</p>
                <p className="mt-5 font-noto-serif text-[13px]/[18px] text-brown-950/70">
                  Next batch starts
                  <span className="block text-[16px]/[22px] font-semibold text-brown-950">{course.nextBatch}</span>
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <Button href={course.href} tone="secondary" size="s" icon="arrow">
                    View courses
                  </Button>
                  <button
                    type="button"
                    onClick={() => setPicked(null)}
                    className="flex h-10 items-center gap-1.5 rounded-[6px] px-3 font-display text-[14px]/[20px] font-semibold text-brown-950/80 transition-colors hover:text-brown-950"
                  >
                    <Xmark width={16} height={16} />
                    Back to all courses
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

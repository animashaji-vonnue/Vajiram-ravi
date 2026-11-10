import type { ReactNode } from "react";
import type { CoverEmblem } from "@/data/programmes";

/*
 * The emblem stamped in gold foil in the middle of a book's cover (CourseShelf, CoverFront), after the
 * reference shelf's covers (vajiram-ravi.vercel.app): a line drawing for the programme inside a thin foil
 * ring, on a 48 × 48 box. The ring's dotted rule turns slowly all the time; while the book is hovered
 * (`group/book`) the emblem grows a little and glows, and its drawing draws itself again stroke by stroke
 * in the brighter foil (shelf.css, .emblem). Reduced motion: it stays still.
 */

const DRAWINGS: Record<CoverEmblem, ReactNode> = {
  // An open book: the General Studies foundation.
  books: (
    <>
      <path d="M24 17c-2.6-1.8-6-2.4-10-2.2v16c4-.2 7.4.4 10 2.2 2.6-1.8 6-2.4 10-2.2v-16c-4-.2-7.4.4-10 2.2Z" />
      <path d="M24 17v16M17 20.5h3.5M17 24h3.5M27.5 20.5H31M27.5 24H31" />
    </>
  ),
  // An abacus: aptitude.
  abacus: (
    <>
      <rect x={15} y={15} width={18} height={18} rx={2} />
      <path d="M15 21h18M15 27h18" />
      <circle cx={20} cy={21} r={1.6} />
      <circle cx={26} cy={21} r={1.6} />
      <circle cx={23} cy={27} r={1.6} />
      <circle cx={29} cy={27} r={1.6} />
    </>
  ),
  // A quill: the optional subjects.
  quill: (
    <>
      <path d="M33 15c-7 1-12 6-14 14l-1.5 4.5" />
      <path d="M33 15c-1 6-4.5 10.5-11 12.5" />
      <path d="M21 30.5h8" />
    </>
  ),
  // Stacked papers: a test series in your optional.
  layers: (
    <>
      <path d="m24 15 9 4.5-9 4.5-9-4.5 9-4.5Z" />
      <path d="m15 24 9 4.5 9-4.5M15 28.5 24 33l9-4.5" />
    </>
  ),
  // A target: Prelims.
  target: (
    <>
      <circle cx={24} cy={24} r={9} />
      <circle cx={24} cy={24} r={5} />
      <circle cx={24} cy={24} r={1.4} />
      <path d="m24 24 8-8M29 16h3v3" />
    </>
  ),
  // A pen over lines: Mains answer writing.
  pen: (
    <>
      <path d="M15 31h9M15 27h6M15 23h5" />
      <path d="m27 29.5 6.5-6.5a1.8 1.8 0 0 0-2.5-2.5L24.5 27 24 30Z" />
    </>
  ),
  // A compass: a mentor's direction.
  compass: (
    <>
      <circle cx={24} cy={24} r={9} />
      <path d="m27.8 20.2-2.3 5.3-5.3 2.3 2.3-5.3 5.3-2.3Z" />
    </>
  ),
  // A microphone: the interview.
  mic: (
    <>
      <rect x={20.5} y={14} width={7} height={12} rx={3.5} />
      <path d="M17 23.5a7 7 0 0 0 14 0M24 30.5V34M20.5 34h7" />
    </>
  ),
};

export default function CoverArt({ emblem, size }: { emblem: CoverEmblem; size: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="emblem overflow-visible text-[#f6c77a] [transition:color_500ms_var(--ease-out),scale_600ms_var(--ease-out),filter_600ms_var(--ease-out)] group-hover/book:scale-[1.08] group-hover/book:text-[#ffe3b0] group-hover/book:drop-shadow-[0_0_6px_rgb(255_210_130/0.55)]"
    >
      {/* The foil ring, a double rule: the dotted rule turns slowly all the time, the inner one stays. */}
      <g className="emblem-ring">
        <circle cx={24} cy={24} r={21.5} strokeWidth={0.9} strokeDasharray="1.2 2.4" />
      </g>
      <circle cx={24} cy={24} r={18.5} strokeWidth={0.9} />
      {/* The drawing, which draws itself again in the foil while the book is hovered (shelf.css). */}
      <g className="emblem-draw">{DRAWINGS[emblem]}</g>
    </svg>
  );
}

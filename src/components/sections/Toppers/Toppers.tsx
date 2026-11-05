import Image from "next/image";
import { toppers, type Topper } from "@/data/home";
import CardOnScroll from "@/components/ui/CardOnScroll";
import { cx } from "@/lib/cx";
import SplitHeading, { letterCount } from "@/components/ui/SplitHeading";

/** The newspaper's details: its strip and the edition on the masthead. */
const PAPER = {
  strip: ["@vajiramandravi", "A results publication by Vajiram & Ravi", "vajiramandravi.com"],
  edition: "2025",
  editionNote: "The All India Rank holders of UPSC CSE 2025 who prepared with us",
  intro:
    "The final result of the Civil Services Examination 2025 is out, and once again the top of the list is full of names from our classrooms. This edition celebrates the aspirants who turned years of preparation into an All India Rank: the toppers who prepared with Vajiram & Ravi.",
};

/**
 * One of the sheet's gold corner ornaments, as on the Dori Chronicle: the corner filled in gold up to a
 * concave edge with a small step in it, so the paper looks set into a gilt frame. Drawn for the top left
 * corner; the others are mirrored.
 */
function Corner({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" className={cx("absolute", className)}>
      <path d="M0 0H24C17 0 15 2.5 14.5 6.5C10.5 7 7 8 6.5 14.5C2.5 15 0 17 0 24Z" fill="#c9a96a" />
    </svg>
  );
}

/** A topper's photo, printed in black and white on the newsprint, as a newspaper would run it. */
function Halftone({ topper, sizes, className }: { topper: Topper; sizes: string; className?: string }) {
  return (
    <div className={cx("relative overflow-hidden bg-[#e9e3d6]", className)}>
      {topper.photo && (
        <Image
          src={topper.photo}
          alt={`${topper.name}, AIR ${topper.rank}, ${topper.exam}`}
          fill
          sizes={sizes}
          className="object-contain object-bottom contrast-110 grayscale"
        />
      )}
    </div>
  );
}

/**
 * Toppers as a newspaper, "The Vajiram Toppers", after the Dori Chronicle on nappadori.com: on a faint
 * collage of newspaper cuttings, a sheet of newsprint in a thin gilt frame with ornamented corners, with a
 * strip of three small notes between rules, a masthead in the headline serif with the edition beside
 * it, then a lead story (AIR 1's photo, the headline and the intro set in a justified column) and a list of
 * the rest of the top ten, each a small photo, rank and name between column rules. The section is a card on the
 * orange page that opens to the full width as it reaches the top of the window (CardOnScroll), and its
 * masthead, lead story and list fade up as they come into view.
 */
export default function Toppers() {
  const [lead, ...rest] = toppers.list;
  return (
    <section
      id="toppers"
      aria-labelledby="toppers-title"
      // The card's resting clip, for the first paint before CardOnScroll takes over.
      className="relative isolate mt-24 bg-[#efece6] py-28 [clip-path:inset(0_32px_round_24px)]"
    >
      <CardOnScroll />
      {/* Torn newspaper cuttings, tiled faintly across the section behind the sheet. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[url(/images/toppers/newsprint.jpg)] bg-[length:626px_939px] bg-repeat opacity-20"
      />
      {/* A little narrower than the canvas, so the cuttings show either side of the sheet. */}
      <div className="mx-auto w-[1240px]">
        <div className="relative border border-[#c9a96a] bg-[#fbf9f4] px-20 pt-12 pb-20 shadow-[0_24px_60px_-30px_rgb(60_40_20/0.35)]">
          <Corner className="top-0 left-0" />
          <Corner className="top-0 right-0 -scale-x-100" />
          <Corner className="bottom-0 left-0 -scale-y-100" />
          <Corner className="right-0 bottom-0 -scale-100" />
          <p className="grid grid-cols-3 border-y border-neutral-900 py-2.5 text-center font-sans text-[13px]/[18px] text-neutral-700">
            {PAPER.strip.map((note, i) => (
              <span key={note} className={cx(i > 0 && "border-l border-neutral-900")}>
                {note}
              </span>
            ))}
          </p>

          <header
            data-reveal
            className="mt-1.5 flex items-center justify-between border-y-[3px] border-double border-neutral-900 py-6"
          >
            <h2
              data-split
              id="toppers-title"
              className="font-serif text-h2 font-normal text-neutral-900 [font-variation-settings:'SOFT'_0,'WONK'_0]"
            >
              <SplitHeading text="The Vajiram" />
              <br />
              <SplitHeading text="Toppers" from={letterCount("The Vajiram")} />
            </h2>
            <div className="flex items-center gap-8">
              <p className="flex w-[200px] flex-col gap-2">
                <span className="border-b border-neutral-900 pb-1.5 font-noto-serif text-[28px]/[32px] font-semibold text-neutral-900">
                  edition
                </span>
                <span className="font-sans text-[13px]/[18px] text-neutral-700">{PAPER.editionNote}</span>
              </p>
              <p className="font-serif text-[120px]/[0.85] font-light tracking-[-0.04em] text-neutral-900 [font-variation-settings:'SOFT'_0,'WONK'_0]">
                {PAPER.edition}
              </p>
            </div>
          </header>

          {/* The lead story: AIR 1. */}
          <article data-reveal className="mt-8 grid grid-cols-[1fr_380px] gap-12">
            <Halftone topper={lead} sizes="800px" className="aspect-[4/3]" />
            <div className="flex flex-col border-l border-neutral-900 pl-12">
              {/* Set like the ranks in the list below. */}
              <p className="font-serif text-[40px]/[1] font-normal tracking-[-0.03em] text-neutral-900 [font-variation-settings:'SOFT'_0,'WONK'_0]">
                <abbr title="All India Rank" className="no-underline">
                  AIR
                </abbr>{" "}
                {lead.rank}
              </p>
              <h3 className="mt-4 font-noto-serif text-[44px]/[1.05] font-bold tracking-[-0.02em] text-neutral-900">
                {lead.name} tops {lead.exam}
              </h3>
              <p className="mt-6 text-justify font-noto-serif text-[16px]/[27px] text-neutral-800 [hyphens:auto]">
                {PAPER.intro}
              </p>
            </div>
          </article>

          {/* The rest of the top ten. */}
          <ol data-reveal-group className="mt-10 grid grid-cols-3 border-t border-neutral-900">
            {rest.map((topper, i) => (
              <li
                key={topper.rank}
                className={cx(
                  "flex gap-5 border-b border-neutral-900 py-6",
                  i % 3 === 0 ? "pr-8" : "border-l border-neutral-900 px-8",
                  i % 3 === 2 && "pr-0",
                )}
              >
                <Halftone topper={topper} sizes="96px" className="size-24 shrink-0" />
                <p className="flex flex-col justify-center">
                  <span className="font-serif text-[40px]/[1] font-normal tracking-[-0.03em] text-neutral-900 [font-variation-settings:'SOFT'_0,'WONK'_0]">
                    {String(topper.rank).padStart(2, "0")}.
                  </span>
                  <span className="mt-2 font-noto-serif text-[18px]/[24px] font-bold text-neutral-900">
                    {topper.name}
                  </span>
                  <span className="font-sans text-[12px]/[18px] tracking-[0.08em] text-neutral-600 uppercase">
                    <abbr title="All India Rank" className="no-underline">
                      AIR
                    </abbr>{" "}
                    {topper.rank} · {topper.exam}
                  </span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

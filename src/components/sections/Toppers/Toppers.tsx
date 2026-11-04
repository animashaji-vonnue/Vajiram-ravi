import Image from "next/image";
import TrackCarousel from "@/components/ui/TrackCarousel";
import { cx } from "@/lib/cx";
import { Eyebrow } from "@/components/ui/Typography";
import { toppers } from "@/data/home";
import NotepadCard from "./NotepadCard";

/** Toppers on view at once; the arrows, dots, keys or a swipe move to the next five. */
const PER_PAGE = 5;
/** One page of the row: the 1360px content width, five 272px slots. */
const PAGE_WIDTH = 1360;

/**
 * Toppers: an eyebrow and a heading in Noto Serif above a row of notepad pages, one per topper, five at
 * a time. The view leaves room above and below for the clips and the tilted backing cards. Behind it all,
 * faint navy line art of India's monuments rises from the foot of the section at both edges of the window:
 * one engraving on the left as drawn, the other mirrored on the right. Their lower part fades into the white,
 * so the section has no hard edge at its foot. The pages fade up one after
 * another as the row scrolls in.
 */
export default function Toppers() {
  const pages = Math.ceil(toppers.list.length / PER_PAGE);
  return (
    // At least the window's height under the header (--vh is the window's height in canvas pixels), with the
    // heading and cards centred in it, so while it's in view the sections above and below are out of sight.
    <section
      id="toppers"
      aria-labelledby="toppers-title"
      className="relative isolate flex min-h-[calc(var(--vh,900px)-72px)] flex-col justify-center py-20"
    >
      {(
        [
          ["left", "/images/toppers/lineart-west.webp"],
          ["right", "/images/toppers/lineart-east.webp"],
        ] as const
      ).map(([side, src]) => (
        <Image
          key={side}
          src={src}
          alt=""
          aria-hidden="true"
          width={2000}
          height={1125}
          className={cx(
            "pointer-events-none absolute bottom-0 -z-10 h-[780px] w-auto max-w-none opacity-15 mask-b-from-55% mask-b-to-100%",
            // Pushed past the window's edges, so the drawings stay large but keep to the sides; the right
            // one's monuments spread wider, so it goes further out.
            side === "left" ? "-left-[260px]" : "-right-[340px] -scale-x-100",
          )}
        />
      ))}
      <div className="mx-auto w-canvas px-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow tone="maroon" tagged tag="crest">
            {toppers.eyebrow}
          </Eyebrow>
          <h2
            id="toppers-title"
            className="font-noto-serif text-[44px]/[54px] font-semibold tracking-[-0.88px] text-neutral-900"
          >
            {toppers.heading}
          </h2>
        </div>
        <TrackCarousel
          className="relative mt-4 pb-4 [&>[role=tablist]]:justify-center"
          viewClassName="overflow-hidden pt-24 pb-16"
          trackClassName="transition-transform duration-700 ease-smooth"
          arrows={{ prev: "top-[calc(50%-24px)] -left-6", next: "top-[calc(50%-24px)] -right-6" }}
          step={PAGE_WIDTH}
          pages={pages}
          dotsLabel="Pages of toppers"
          prevLabel="Previous toppers"
          nextLabel="Next toppers"
        >
          <ul data-reveal-group className="flex">
            {toppers.list.map((topper, i) => (
              <li key={topper.name} className="flex w-[272px] shrink-0 justify-center">
                <NotepadCard topper={topper} index={i} />
              </li>
            ))}
          </ul>
        </TrackCarousel>
      </div>
    </section>
  );
}

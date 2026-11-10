import type { CSSProperties, Ref } from "react";
import Photo from "@/components/ui/Photo";
import type { Topper } from "@/data/toppers";
import { cx } from "@/lib/cx";

type TopperCardProps = {
  topper: Topper;
  /** The card's slot in the masonry (left, top, width, height). */
  style: CSSProperties;
  /** The card's width in canvas px, for the photo's `sizes`. */
  width: number;
  ref?: Ref<HTMLLIElement>;
};

/**
 * One topper (Figma "AIR 1" 2392:5044 and the cards under it): a dark photo card, 16px round, the portrait
 * filling it on a warm dark ground, a gradient at its foot under the name (Hanken SemiBold 17, white) and
 * the programmes (12px, white at 70%), and the rank in a small Geist Mono tag at the top left. AIR 1 is
 * outlined and tagged in saffron (the design's orange, in the dark-band accent so its tag reads at AA).
 *
 * Not a link (the selections page is the button under the grid), so on hover it only grows slightly
 * (1.03, fine pointers) with the hover shadow, above its neighbours.
 */
export default function TopperCard({ topper, style, width, ref }: TopperCardProps) {
  const first = topper.rank === 1;
  return (
    <li
      ref={ref}
      style={style}
      className="absolute overflow-clip rounded-2xl bg-ink shadow-rest [transition:scale_var(--dur-base)_var(--ease-out),box-shadow_var(--dur-base)_var(--ease-out)] hover:z-20 pointer-fine:hover:scale-103 pointer-fine:hover:shadow-hover"
    >
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_20%,#3b2416,transparent)]" />
      <Photo src={topper.image} alt="" sizes={`${width}px`} className="absolute inset-0" imageClassName="object-[50%_20%]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[65%] bg-linear-to-b from-ink/0 via-ink/75 via-55% to-ink/95" />
      <p
        className={cx(
          "absolute top-3 left-3 rounded-full px-2.5 py-1 font-mono text-[11.5px]/[normal] font-medium tracking-[0.04em] whitespace-nowrap uppercase",
          first ? "bg-saffron text-ink" : "bg-ink/80 text-white",
        )}
      >
        AIR {topper.rank}
      </p>
      <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1">
        <h3 className="text-[17px]/[1.2] font-semibold text-white">{topper.name}</h3>
        {topper.programme && <p className="text-[12px]/[1.35] text-white/70">{topper.programme}</p>}
      </div>
      {first && <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-saffron" />}
    </li>
  );
}

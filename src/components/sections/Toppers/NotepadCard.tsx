import Image from "next/image";
import type { CSSProperties } from "react";
import type { Topper } from "@/data/home";
import BinderClip from "./BinderClip";

/** The page's size on the canvas. */
export const NOTEPAD = { width: 224, height: 312 };

/** A fine speckled grain for the page, so it reads as paper rather than flat colour. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.22'/%3E%3C/svg%3E\")";

/**
 * The perforations where the page was torn off its pad: a row of small square holes near the top, cut
 * out of the page with a mask so whatever is behind shows through.
 */
const PERFORATED: CSSProperties = {
  backgroundImage: GRAIN,
  backgroundBlendMode: "multiply",
  maskImage:
    "linear-gradient(#000, #000), repeating-linear-gradient(90deg, transparent 0 8px, #000 8px 18px, transparent 18px 20px)",
  maskSize: "100% 100%, calc(100% - 12px) 12px",
  maskPosition: "0 0, 6px 10px",
  maskRepeat: "no-repeat",
  maskComposite: "exclude",
};

/** How the backing card and the page lean, card by card, so a row looks laid down by hand. */
const TILTS = [
  { page: -1.5, backing: -8 },
  { page: 1.2, backing: 7 },
  { page: -0.8, backing: -6 },
  { page: 1.6, backing: 8 },
  { page: -1.2, backing: -7 },
];

/**
 * A topper on a page torn from a notepad, after the reference the brief pointed to: a maroon card set
 * askew behind it, low enough that the perforations show the page behind, and an orange binder clip at its
 * top right. On the page, the All India Rank, the name and the exam, with the topper's cut-out portrait
 * standing at the foot of the page. On hover the page straightens and lifts a little.
 */
export default function NotepadCard({ topper, index }: { topper: Topper; index: number }) {
  const tilt = TILTS[index % TILTS.length];
  return (
    <div className="group/card relative" style={{ width: NOTEPAD.width, height: NOTEPAD.height }}>
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-red-900 shadow-[0_12px_24px_-10px_rgb(60_10_10/0.45)] transition-[rotate] duration-500 ease-smooth"
        style={{ rotate: `${tilt.backing}deg`, translate: "0 26px" }}
      />
      <div
        className="absolute inset-0 drop-shadow-[0_6px_10px_rgb(40_25_10/0.22)] transition-[rotate,translate] duration-500 ease-smooth [rotate:var(--tilt)] group-hover/card:-translate-y-1.5 group-hover/card:rotate-0"
        style={{ "--tilt": `${tilt.page}deg` } as CSSProperties}
      >
        <div className="flex h-full flex-col overflow-hidden bg-notepad" style={PERFORATED}>
          <p className="flex flex-col px-5 pt-11">
            <span className="font-mono text-[11px]/[14px] font-medium tracking-[0.66px] text-red-900">
              <abbr title="All India Rank" className="no-underline">
                AIR
              </abbr>
            </span>
            <span className="font-serif text-[56px]/[56px] font-medium tracking-[-1.5px] text-neutral-900 [font-variation-settings:'SOFT'_0,'WONK'_0]">
              {topper.rank}
            </span>
            <span className="mt-2 font-display text-[17px]/[22px] font-semibold tracking-[-0.17px] text-neutral-900">
              {topper.name}
            </span>
            <span className="font-mono text-[11px]/[16px] font-medium tracking-[0.66px] text-neutral-600">
              {topper.exam}
            </span>
          </p>
          {topper.photo && (
            <div className="relative mt-auto h-[150px] w-full">
              <Image src={topper.photo} alt="" fill sizes="224px" className="object-contain object-bottom" />
            </div>
          )}
        </div>
        {/* As in the reference: the plate starts a little above the page's top edge and its right side
            overhangs the page; a tight shadow where it touches the paper and a softer one further out. */}
        <BinderClip className="absolute -top-[65px] -right-[17px] [filter:drop-shadow(0_1.5px_1px_rgb(40_10_10/0.35))_drop-shadow(2px_7px_8px_rgb(40_20_10/0.25))]" />
      </div>
    </div>
  );
}

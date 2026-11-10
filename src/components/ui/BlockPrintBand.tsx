import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";

/** The band's one 22px tile (a diamond between the two rules), used as a mask so the band takes any colour. */
const TILE = "url(/images/ornaments/block-print-tile.svg)";

type BlockPrintBandProps = {
  /** The band's colour (e.g. saffron on burnt or white, burnt on parchment). */
  colour: string;
  /** Its strength, 0 to 1. */
  opacity: number;
  /** Where it runs: its vertical place in the band, e.g. "top-6" or "bottom-[27px]". */
  className?: string;
  /** Moves the diamonds along by this many px (the Figma sets a band's lower strip 34px along). */
  shift?: number;
};

/**
 * The design's block-print band (Figma "bg – block-print band"): a row of diamonds between two hairline
 * rules, 22px tall, edging a section above and below its content. The tile repeats across the band's whole
 * width, so it runs from edge to edge of the screen however wide it is: put it straight inside the
 * full-width section, not inside the 1440px canvas. Decoration only.
 */
export default function BlockPrintBand({ colour, opacity, className, shift = 0 }: BlockPrintBandProps) {
  const mask: CSSProperties = {
    maskImage: TILE,
    WebkitMaskImage: TILE,
    maskRepeat: "repeat-x",
    WebkitMaskRepeat: "repeat-x",
    maskPosition: `calc(50% + ${shift}px) 0`,
    WebkitMaskPosition: `calc(50% + ${shift}px) 0`,
  };
  return <div aria-hidden="true" className={cx("pointer-events-none absolute inset-x-0 h-[22px]", className)} style={{ ...mask, backgroundColor: colour, opacity }} />;
}

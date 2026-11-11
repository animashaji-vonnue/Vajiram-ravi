import { Fragment } from "react";
import { cx } from "@/lib/cx";

type TextMarqueeProps = {
  /** The line, in parts: each is set in turn in ink and in orange, a saffron dot after each. */
  parts: string[];
  /** How far the line slides over the band's crossing of the screen, px (negative: to the left). */
  travel?: number;
  className?: string;
};

/** Enough copies of the line to fill the width of the canvas at any point of the slide. */
const COPIES = 4;

/**
 * A band of large, slow type between two sections, after wabcoffeeco.com's scrolling words: the line, in
 * the heading face at 132px, runs across the full width and slides sideways with the scroll (ui/
 * TextMotion, data-marquee: driven by the scroll position only, never on its own, and only while the band
 * is on screen). It is large brand type and decoration: its words are already on the page (the brand and
 * "Since 1976"), so assistive technology skips it (aria-hidden), and no text anyone needs to read moves. Without the script, or with reduced motion, the line is simply
 * there, still.
 */
export default function TextMarquee({ parts, travel = -560, className }: TextMarqueeProps) {
  return (
    <div data-marquee={travel} aria-hidden="true" className={cx("relative overflow-clip py-8 select-none", className)}>
      <div data-marquee-track className="-ml-40 flex w-max font-heading text-[132px]/[1] font-medium tracking-[-0.03em] whitespace-nowrap">
        {Array.from({ length: COPIES }, (_, copy) => (
          <Fragment key={copy}>
            {parts.map((part, i) => (
              <Fragment key={`${copy}-${i}`}>
                <span className={i % 2 ? "text-orange" : "text-ink"}>{part}</span>
                <span className="px-[0.32em] text-saffron">·</span>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

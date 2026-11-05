import { Fragment, type CSSProperties } from "react";

/**
 * A heading's text split into letters for the rise-in after wabcoffeeco.com: each word is a mask and each letter
 * rises up into it from below, a little after the one before, as the heading comes onto the screen. Put it inside
 * an element marked `data-split`; ScrollReveal starts it. `from` carries the letters' count on when a heading is
 * split in more than one piece, so the stagger runs on through them. Screen readers get the text in one piece.
 */
export default function SplitHeading({ text, from = 0 }: { text: string; from?: number }) {
  let index = from;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, w) => (
          <Fragment key={w}>
            {w > 0 && " "}
            <span className="split-word">
              {Array.from(word, (char, c) => (
                <span key={c} className="split-char" style={{ "--i": index++ } as CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  );
}

/** How many letters `SplitHeading` gives a piece of text, for the next piece's `from`. */
export function letterCount(text: string): number {
  return Array.from(text.replace(/ /g, "")).length;
}

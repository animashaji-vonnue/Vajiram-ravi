import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

/**
 * The design's invitation card in a short, 372 × 126 cut: cream paper with a burnt hairline, scalloped
 * corners and a peak at the top centre, and a gold inner border. Both outlines are the design's own
 * drawings. It stands beside a section heading: the note in the toppers band and the intro in the
 * batches band.
 *
 * The text goes in as children: 324px wide, 24px in from the sides, and centred between the inner
 * border's top and bottom edges, so a two-line intro and a four-line note both sit evenly. The card's
 * place in its row and its reveal come from the caller (`className`, `data-reveal` and other div props).
 */
export default function NoteCard({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div {...props} className={cx("relative h-[126.044px] w-[372px] shrink-0", className)}>
      <img
        src="/images/ornaments/note-card.svg"
        alt=""
        aria-hidden="true"
        width={373}
        height={126.044}
        className="pointer-events-none absolute top-0 left-[-0.5px] h-[126.044px] w-[373px] max-w-none"
      />
      <img
        src="/images/ornaments/note-inner-border.svg"
        alt=""
        aria-hidden="true"
        width={357.75}
        height={107.78}
        className="pointer-events-none absolute top-[10.15px] left-[6.625px] h-[107.78px] w-[357.75px] max-w-none"
      />
      <div className="absolute top-[16.6px] left-6 flex h-[101px] w-[324px] flex-col justify-center">{children}</div>
    </div>
  );
}

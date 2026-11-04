import Image from "next/image";
import type { StoryColour } from "@/data/home";

/** The card's size at full scale, from the design's centre card (3614:4898). */
export const STORY_CARD = { width: 760, height: 440 };

/**
 * Each colourway: its stamp (the perforated card in its colour, with a darker line just inside the edge)
 * and the colour of the inner frame line.
 */
const COLOURWAYS: Record<StoryColour, { stamp: string; line: string }> = {
  orange: { stamp: "/images/stories/stamp-orange.svg", line: "border-brand-600" },
  green: { stamp: "/images/stories/stamp-green.svg", line: "border-green-600" },
  yellow: { stamp: "/images/stories/stamp-yellow.svg", line: "border-yellow-600" },
  peach: { stamp: "/images/stories/stamp-peach.svg", line: "border-brand-400" },
};

type StoryCardProps = { name: string; meta: string; quote: string; photo: string; colour: StoryColour };

/**
 * A student's story as a postage stamp, after the design's "Figure" cards: a perforated card in one of
 * four colours with a thin frame line inside, the photo on the left, and on the right the quote, with the
 * student's name and rank at the foot.
 */
export default function StoryCard({ name, meta, quote, photo, colour }: StoryCardProps) {
  const way = COLOURWAYS[colour];
  return (
    <figure
      className="relative flex items-start gap-10 py-3.5 pr-9 pl-3.5"
      style={{ width: STORY_CARD.width, height: STORY_CARD.height }}
    >
      <Image src={way.stamp} alt="" fill sizes="760px" className="pointer-events-none" />
      <span aria-hidden="true" className={`absolute inset-3.5 border ${way.line}`} />

      <div className="relative h-full w-[340px] shrink-0 overflow-hidden">
        <Image src={photo} alt="" fill sizes="340px" className="object-cover" />
      </div>

      <div className="relative flex h-full min-w-0 flex-1 flex-col justify-between pt-[22px] pb-2.5">
        <blockquote className="font-display text-[30px]/[36px] font-medium tracking-[-0.45px] text-neutral-900">
          <p>“{quote}”</p>
        </blockquote>
        <figcaption className="flex flex-col gap-0.5">
          {/* Larger than the design's 16px and 14px: the card is shown at about 60%, and these must stay readable. */}
          <span className="font-display text-[22px]/[28px] font-semibold text-neutral-900">{name}</span>
          <span className="font-sans text-[18px]/[24px] font-medium text-neutral-800">{meta}</span>
        </figcaption>
      </div>
    </figure>
  );
}

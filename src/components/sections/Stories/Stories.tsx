import type { CSSProperties } from "react";
import Image from "next/image";
import { Eyebrow, Lead, SectionTitle } from "@/components/ui/Typography";
import { stories } from "@/data/home";
import StoryCard, { STORY_CARD } from "./StoryCard";

/**
 * The design (3693:409) draws the band 1440 wide; here it's a card inset 40px from each side of the canvas,
 * 1360 wide, so the border and the fan of cards are shrunk to match. The type keeps its design sizes.
 */
const FIT = 1360 / 1440;
/** How large the cards are shown in the fan (the full card is 760 × 440). */
const SCALE = 0.62 * FIT;
const CARD = { width: Math.round(STORY_CARD.width * SCALE), height: Math.round(STORY_CARD.height * SCALE) };
/**
 * Each card's place in the fan at the design's 1440 size, after the Pantry cards on pontofuba.com: a loose
 * overlapping row, each tilted a little differently and set at a slightly different height. Later cards sit
 * on top.
 */
const FAN = [
  { left: -5, top: 46, tilt: -8 },
  { left: 295, top: 84, tilt: 6 },
  { left: 595, top: 30, tilt: -3 },
  { left: 895, top: 72, tilt: 7 },
];
const FAN_SIZE = { width: Math.round(1360 * FIT), height: Math.round(420 * FIT) };

/**
 * "Hear it from our students", after the design's section 3693:409: an indigo card inside an azulejo border,
 * a centred white heading over the students' stories as stamp cards, fanned in an overlapping row after
 * pontofuba.com's Pantry. Pointing at a card, focusing it or tapping it pops it out, as there: it
 * straightens, grows a little, rises 50px and comes to the front, over half a second.
 */
export default function Stories() {
  return (
    <section id="stories" className="bg-white" aria-labelledby="stories-title">
      <div className="mx-auto w-canvas px-10 py-24">
        {/* Kept to the border's 1440 × 873 shape so its corners aren't stretched. */}
        <div className="relative flex aspect-[1440/873] flex-col items-center overflow-clip rounded-[20px] bg-indigo-800 pt-[100px] text-center">
          <Image
            src="/images/stories/border.svg"
            alt=""
            width={1440}
            height={873}
            className="pointer-events-none absolute inset-0 size-full max-w-none"
          />
          <div className="relative flex flex-col items-center gap-5">
            <Eyebrow tone="white" tagged tag="crest-white">
              {stories.eyebrow}
            </Eyebrow>
            <div className="flex flex-col items-center gap-2">
              <SectionTitle id="stories-title" tone="light">
                {stories.heading}
              </SectionTitle>
              <Lead tone="light">{stories.intro}</Lead>
            </div>
          </div>

          {/* Spaced so the lowest card ends just above the border's bottom band. */}
          <ul className="relative mt-[98px] shrink-0 text-left" style={FAN_SIZE} aria-label="Student stories">
            {stories.list.map((story, i) => (
              <li
                key={story.name}
                // Focusable, so keyboard and touch users can pop a card out too.
                tabIndex={0}
                className="absolute rotate-(--tilt) cursor-default transition-[rotate,scale,translate] duration-500 ease-smooth outline-offset-4 hover:z-40 hover:-translate-y-[50px] hover:scale-105 hover:rotate-0 focus-visible:z-40 focus-visible:-translate-y-[50px] focus-visible:scale-105 focus-visible:rotate-0"
                style={
                  {
                    left: FAN[i].left * FIT,
                    top: FAN[i].top * FIT,
                    width: CARD.width,
                    height: CARD.height,
                    "--tilt": `${FAN[i].tilt}deg`,
                  } as CSSProperties
                }
              >
                <div className="origin-top-left" style={{ scale: SCALE }}>
                  <StoryCard {...story} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

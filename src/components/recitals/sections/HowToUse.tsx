import { Reveal } from "@/components/recitals/Motion";
import { MarginMark, RosetteMark, SectionGlow, SectionGround } from "@/components/recitals/Ornaments";
import { SectionHead } from "@/components/recitals/Parts";
import { readingPasses, readingTotal } from "@/data/magazine";

/*
 * How to actually use an issue.
 *
 * The common failure is downloading every issue and reading none. Three passes with real
 * times attached turn the magazine from a thing you collect into a thing you schedule.
 *
 * The cards are a dealt hand, not a filing stack. Each one is a tall card rather than a
 * wide strip, and each lands further down, further right and turned a little further
 * round than the one before, so the finished group reads as three cards laid on a table
 * by someone. That is the whole difference from the contents stack above, which is wide
 * cards squared up on top of each other — same scroll mechanic, deliberately opposite
 * shape and alignment, so the two sections do not read as one idea used twice.
 *
 * Each pass is headed by a painted stroke, and the three run in flag order: saffron,
 * chakra blue in the middle, green. They are three separate paintings, not one stroke
 * recoloured — a single stroke used three times reads as a graphic element and the eye
 * catches the repeat at once.
 *
 * Only two things sit on the paint: the numeral, which is large and heavy enough to stay
 * legible on any of the three, and a solid white pill, which carries its own contrast.
 * Everything read at small size sits on the cream below. That division is what lets the
 * green and the blue be as deep as the flag instead of washed-out tints.
 */

type Pass = {
  /** The painted head. Flat colour on white, dropped onto the cream with multiply. */
  stroke: string;
  /**
   * Each stroke has a loaded end and a dry end, and the numeral has to sit on the loaded
   * one or it disappears into the frayed tail. The green was painted right to left, so it
   * is mirrored to bring its solid end under the numeral.
   */
  flip?: boolean;
  /** The stroke's colour at full strength, for the small label on the cream. */
  deep: string;
  /** Where this card lands in the hand: across, and how far round. */
  x: number;
  rotate: number;
};

/*
 * The hand moves across only slightly, and these three numbers are tied to GUTTER below.
 *
 * What shows down the left edge of a covered card is a tall sliver, and a sliver of body
 * text is text cut down the middle of a word — it reads as a rendering fault, not as a
 * card behind a card. So the sliver has to fall entirely inside the card's own side
 * margin. Its width is the step across (14px) plus the swing the rotation adds, which is
 * widest at the foot of the card: about 215px of half-height times the 2.5° difference
 * between neighbours, so roughly 9px. 23px in total, comfortably inside the 32px gutter.
 * Widen these, or pull the gutter in, and letters start appearing down the edge again.
 */
const PASSES: Pass[] = [
  { stroke: "/recitals/brush-saffron.webp", deep: "#b8470b", x: 0, rotate: -2 },
  { stroke: "/recitals/brush-blue.webp", deep: "#16357f", x: 14, rotate: 0.5 },
  { stroke: "/recitals/brush-green.webp", flip: true, deep: "#0f6b06", x: 28, rotate: 3 },
];

/** A card, upright rather than letterbox. */
const W = 330;
const H = 430;
/** Where the deck sits across the column, so the hand is centred under the heading. */
const INSET = 140;
/**
 * The card's side margin. It is doing structural work, not just breathing: it has to be
 * wider than the sliver a covered card shows, or the card in front crops letters rather
 * than blank paper. See the note on PASSES.
 */
const GUTTER = 32;

/** Where the first card parks, clear of the floating nav. */
const PARK = 132;
/**
 * The painted head, and what each parked card leaves showing once the next lands on it.
 *
 * These are the same number deliberately. A covered card then shows its painted head and
 * nothing else: the stroke, the numeral and the minutes, all of which survive being
 * cropped by the card in front. Any taller and the strip starts eating into the cream
 * and showing the first line of a title cut off halfway down its letters.
 */
const HEAD = 78;
const STEP = HEAD;
/** The paint itself, inset top and bottom so both ragged edges stay visible. */
const PAINT = 68;

export default function HowToUse() {
  return (
    <section id="how" className="relative bg-[#fdf8ef]" aria-labelledby="how-h">
      {/*
       * The same sheet, at the same strength, as every other light section. This one used
       * to carry a ruled "register" pattern over a different cream, which made the join
       * with the sections either side read as a change of paper.
       */}
      <SectionGround tint={0.2} />
      <SectionGlow at="bottom left" strength={0.17} />
      {/* A figure in the margin, struck faint. The section is not clipped: overflow-hidden
          here would turn it into a scroll container and break the sticky stack inside. */}
      <MarginMark src="/recitals/mark-desk.webp" className="bottom-14 left-6" size={370} opacity={0.24} />
      <MarginMark src="/recitals/mark-files.webp" className="bottom-8 right-6" size={340} opacity={0.18} />

      <div className="relative mx-auto flex w-full max-w-[1440px] items-start gap-20 px-20 py-24">
        <Reveal className="sticky top-32 w-[420px] shrink-0">
          <SectionHead
            id="how-h"
            eyebrow="How to use it"
            title="One issue, three passes, across the month it covers"
            lead="Reading it once and filing it away is the common mistake. These three passes are what turn an issue into marks."
          />
          <p className="mt-8 flex items-center gap-3 font-sans text-[15px]/[22px] font-medium text-r-ink-700">
            <RosetteMark size={14} className="text-r-amber" />
            {readingTotal}
          </p>
        </Reveal>

        {/*
         * The runway below the deck is a real element, not padding on this column.
         *
         * A sticky card is clamped to its container's CONTENT edge, so padding-bottom
         * buys no hold at all — with it, the last card got about 24px before the
         * container's edge dragged it back up, which is why the deck looked like it
         * swallowed the middle card and then lurched. The hold the finished hand gets is
         * exactly this spacer's height.
         */}
        <div className="relative min-w-0 flex-1">
          {readingPasses.map((pass, i) => {
            const paint = PASSES[i % PASSES.length];
            return (
              <div key={pass.title} className="sticky" style={{ top: PARK + i * STEP, zIndex: i + 1 }}>
                <article
                  className="mb-6 flex flex-col overflow-hidden rounded-2xl bg-[#fffbf2] shadow-[0_26px_50px_-30px_rgba(94,27,16,.55)]"
                  style={{
                    width: W,
                    height: H,
                    transform: `translateX(${INSET + paint.x}px) rotate(${paint.rotate}deg)`,
                  }}
                >
                  <div className="relative shrink-0" style={{ height: HEAD }}>
                    {/*
                     * Multiply drops the white the stroke was painted on, so it lands on
                     * the cream without carrying a box around with it.
                     */}
                    <span
                      className="pointer-events-none absolute left-0 block w-full mix-blend-multiply"
                      style={{
                        top: (HEAD - PAINT) / 2,
                        height: PAINT,
                        backgroundImage: `url(${paint.stroke})`,
                        backgroundSize: "100% 100%",
                        backgroundRepeat: "no-repeat",
                        transform: paint.flip ? "scaleX(-1)" : undefined,
                      }}
                      aria-hidden="true"
                    />
                    <div
                      className="relative flex h-full items-center justify-between"
                      style={{ paddingLeft: GUTTER, paddingRight: GUTTER }}
                    >
                      <span className="font-r-display text-[32px]/[38px] font-extrabold text-white">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full bg-white px-3 py-[5px] font-sans text-[12px]/[16px] font-semibold text-[#2e1a0e]/85">
                        {pass.minutes}
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex min-h-0 flex-1 flex-col gap-2.5 pt-5 pb-7"
                    style={{ paddingLeft: GUTTER, paddingRight: GUTTER }}
                  >
                    <span
                      className="font-sans text-[11px]/[15px] font-semibold tracking-[.14em] uppercase"
                      style={{ color: paint.deep }}
                    >
                      {pass.when}
                    </span>
                    <h3 className="font-r-editorial text-[23px]/[30px] font-bold text-[#2e1a0e]">{pass.title}</h3>
                    <p className="font-sans text-[15px]/[24px] font-medium text-[#2e1a0e]/70">{pass.body}</p>
                  </div>
                </article>
              </div>
            );
          })}
          <div className="h-[240px]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

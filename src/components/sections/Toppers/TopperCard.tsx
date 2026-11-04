import Photo from "@/components/ui/Photo";
import { stepped } from "@/components/ui/Buttons";
import type { Topper } from "@/data/home";

/** The card's size on the canvas, from the design's "Topper card · Name plate" (3614:4855). */
export const TOPPER_CARD = { width: 216, height: 336 };

/** The card's stepped outline (16px deep, in 8px steps) and the name plate's (8px deep, in 4px steps). */
const CARD_SHAPE = stepped(16, 8);
const PLATE_SHAPE = stepped(8, 4);

/** One stepped layer, cut from its own box so the steps keep their size whatever the box. */
function Layer({ inset, colour, shape }: { inset: string; colour: string; shape: string }) {
  return <span aria-hidden="true" className={`absolute ${inset} ${colour}`} style={{ clipPath: shape }} />;
}

/**
 * A topper's card, after the design's "Name plate" card: an ivory card inside a stepped border of gold,
 * rose and gold, the photo, and a stepped wine plate under it, edged in gold and rose, holding the All
 * India Rank, a thin gold divider, and the name with the exam below. Every card is the same size; a long
 * name wraps to a second line inside the plate. Without a topper it's an empty placeholder with the same frame.
 */
export default function TopperCard({ topper }: { topper?: Topper }) {
  return (
    <div
      className="relative flex flex-col gap-3 p-4"
      style={{ width: TOPPER_CARD.width, height: TOPPER_CARD.height }}
    >
      <Layer inset="inset-0" colour="bg-gold-600" shape={CARD_SHAPE} />
      <Layer inset="inset-[3px]" colour="bg-rose-500" shape={CARD_SHAPE} />
      <Layer inset="inset-[6px]" colour="bg-gold-600" shape={CARD_SHAPE} />
      <Layer inset="inset-[9px]" colour="bg-ivory" shape={CARD_SHAPE} />

      {topper?.photo ? (
        <Photo
          src={topper.photo}
          alt=""
          sizes="184px"
          position="50% 20%"
          className="relative h-[212px] w-[184px] shrink-0 overflow-hidden rounded-[4px] bg-sand-100"
        />
      ) : (
        <span className="relative block h-[212px] w-[184px] shrink-0 rounded-[4px] bg-sand-100" />
      )}

      <div className="relative flex h-20 w-full shrink-0 items-center gap-3 px-3.5">
        <Layer inset="inset-0" colour="bg-gold-600" shape={PLATE_SHAPE} />
        <Layer inset="inset-[3px]" colour="bg-rose-500" shape={PLATE_SHAPE} />
        <Layer inset="inset-[5px]" colour="bg-wine-800" shape={PLATE_SHAPE} />

        <p className="relative flex shrink-0 flex-col items-center">
          <span className="font-mono text-[10px]/[14px] font-medium tracking-[0.6px] text-gold-200">
            <abbr title="All India Rank" className="no-underline">
              AIR
            </abbr>
          </span>
          <span className="font-display text-[28px]/[30px] font-semibold tracking-[-0.56px] text-white">
            {topper ? topper.rank : "—"}
          </span>
        </p>
        <span aria-hidden="true" className="relative h-14 w-px shrink-0 bg-gold-200" />
        <p className="relative flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="line-clamp-2 font-display text-[16px]/[20px] font-semibold tracking-[-0.16px] text-white">
            {topper?.name ?? "Topper name"}
          </span>
          <span className="font-mono text-[10px]/[14px] font-medium tracking-[0.6px] whitespace-nowrap text-gold-200">
            {topper?.exam ?? "CSE 2025"}
          </span>
        </p>
      </div>
    </div>
  );
}

import Image from "next/image";
import { ArrowRightLgIcon } from "@/components/icons";
import { NUDGE, stepped } from "@/components/ui/Buttons";
import type { Programme, ProgrammeColour } from "@/data/home";
import { cx } from "@/lib/cx";
import FoundationArt from "./FoundationArt";

/** The card's size on the canvas, from the design's "Course card · Kangura K4" (3596:4111). */
export const PROGRAMME_CARD = { width: 448, height: 468 };

/** The card's stepped outline (16px deep, in 8px steps) and the arrow button's (8px deep, in 4px steps). */
const CARD_SHAPE = stepped(16, 8);
const BUTTON_SHAPE = stepped(8, 4);

/**
 * Each colourway: the edge and arrow button, the card's body, the tag and its label, the button's inset line,
 * and the rangoli line's colour (its own file).
 */
const COLOURWAY: Record<
  ProgrammeColour,
  { edge: string; body: string; tag: string; line: string; rangoli: string }
> = {
  brown: { edge: "bg-brown-700", body: "bg-yellow-50", tag: "bg-sun-100 text-brown-800", line: "bg-yellow-300", rangoli: "brown" },
  jade: { edge: "bg-jade-700", body: "bg-jade-50", tag: "bg-jade-100 text-jade-800", line: "bg-green-300", rangoli: "green" },
  blue: { edge: "bg-blue-800", body: "bg-blue-50", tag: "bg-blue-100 text-blue-800", line: "bg-blue-300", rangoli: "blue" },
  pink: { edge: "bg-pink-700", body: "bg-pink-50", tag: "bg-pink-100 text-pink-800", line: "bg-pink-300", rangoli: "pink" },
  orange: { edge: "bg-brand-600", body: "bg-brand-50", tag: "bg-brand-100 text-brand-800", line: "bg-brand-300", rangoli: "orange" },
  purple: { edge: "bg-purple-700", body: "bg-purple-50", tag: "bg-purple-100 text-purple-800", line: "bg-purple-300", rangoli: "purple" },
  red: { edge: "bg-red-700", body: "bg-red-50", tag: "bg-red-100 text-red-900", line: "bg-red-300", rangoli: "red" },
  sand: { edge: "bg-sand-800", body: "bg-sand-100", tag: "bg-sand-200 text-sand-800", line: "bg-sand-300", rangoli: "sand" },
};

/** Cuts the picture's top corners in the card's steps (the design's mask, a pixel larger all round). */
const STEPPED_TOP = {
  maskImage: "url(/images/programmes/mask-stepped-top.svg)",
  maskSize: "445px 233px",
  maskPosition: "-0.5px -0.5px",
  maskRepeat: "no-repeat",
};

/** One stepped layer, cut from its own box so the steps keep their size whatever the box. */
function Layer({ inset, colour, shape }: { inset: string; colour: string; shape: string }) {
  return <span aria-hidden="true" className={cx("absolute", inset, colour)} style={{ clipPath: shape }} />;
}

function Picture({ image, masked = true }: Pick<Programme, "image" | "masked">) {
  if (!image) {
    return (
      <div className="relative h-[232px] w-[444px] shrink-0" style={STEPPED_TOP}>
        <FoundationArt />
      </div>
    );
  }
  if (!masked) {
    // Zoomed in and cropped, as the design frames it.
    return (
      <div className="relative h-[232px] w-[444px] shrink-0 overflow-hidden">
        <Image
          src={image}
          alt=""
          width={1376}
          height={768}
          sizes="566px"
          className="absolute top-[-18%] left-[-13.66%] h-[136%] w-[127.32%] max-w-none"
        />
      </div>
    );
  }
  return (
    <div className="relative h-[232px] w-[444px] shrink-0" style={STEPPED_TOP}>
      <Image src={image} alt="" fill sizes="444px" className="object-cover" />
    </div>
  );
}

/**
 * A featured programme, after the design's "Course card · Kangura K4": a card in the programme's colours
 * with a stepped edge, its illustration under a stepped top, a rangoli line, a tag with the number of
 * courses, the name and a line about it, and a small stepped arrow button. The whole card is the link
 * (the name's link stretches over it); pointing at it nudges the arrow on.
 */
export default function ProgrammeCard({ programme }: { programme: Programme }) {
  const colours = COLOURWAY[programme.colour];
  return (
    <article
      className="group/card relative flex shrink-0 flex-col px-0.5 pt-0.5 has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-brand-700"
      style={{ width: PROGRAMME_CARD.width, height: PROGRAMME_CARD.height }}
    >
      <Layer inset="inset-0" colour={colours.edge} shape={CARD_SHAPE} />
      <Layer inset="inset-[2px]" colour={colours.body} shape={CARD_SHAPE} />

      <Picture image={programme.image} masked={programme.masked} />

      <div className="relative flex flex-1 flex-col justify-between px-[22px] pt-5 pb-6">
        <div className="flex flex-col items-start gap-3.5">
          <span aria-hidden="true" className="relative h-2 w-full">
            <Image
              src={`/images/programmes/zigzag-${colours.rangoli}.svg`}
              alt=""
              width={401.243}
              height={10.6793}
              className="absolute top-[-1.34px] left-[-0.64px] max-w-none"
            />
          </span>
          <p
            className={cx(
              "rounded-[4px] px-2.5 py-[5px] font-mono text-[11px]/[14px] font-medium tracking-[0.66px] uppercase",
              colours.tag,
            )}
          >
            {programme.courses} courses
          </p>
          <h3 className="font-display text-[22px]/[28px] font-semibold tracking-[-0.22px] text-neutral-900">
            <a href={programme.href} className="outline-none after:absolute after:inset-0">
              {programme.name}
            </a>
          </h3>
          <p className="font-sans text-[15px]/[22px] font-medium text-neutral-600">{programme.text}</p>
        </div>

        <span aria-hidden="true" className="relative flex size-11 items-center justify-center self-end">
          <Layer inset="inset-0" colour={colours.edge} shape={BUTTON_SHAPE} />
          <Layer inset="inset-[3px]" colour={colours.line} shape={BUTTON_SHAPE} />
          <Layer inset="inset-1" colour={colours.edge} shape={BUTTON_SHAPE} />
          <ArrowRightLgIcon
            width={18}
            height={18}
            className={cx("relative text-white", NUDGE, "group-hover/card:translate-x-[3px]")}
          />
        </span>
      </div>
    </article>
  );
}

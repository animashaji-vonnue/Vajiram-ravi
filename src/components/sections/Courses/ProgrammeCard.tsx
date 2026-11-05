import Photo from "@/components/ui/Photo";
import { stages, type BentoProgramme } from "@/data/programme-bento";
import { cx } from "@/lib/cx";
import { CARD_LINK } from "@/lib/hover";
import { ParallaxLayer } from "@/lib/parallax";

/*
 * One programme card (final design, e.g. "programme · Optional Subject Programme" 2257:8875): 308 × 220
 * with 16px corners and 22px padding. A monument photo, shown at its drawn strength over the cream paper
 * (the flagship card: over #3b2416), a dark legibility gradient over its lower 136px, the stage chip with
 * its butta and the 36px ↗ knob on top, and the title and meta line at the foot. The plain cards carry a
 * 1px #eadbc4 rule over everything, as drawn.
 *
 * Hover (motion spec, "Card hover"; linked cards only): CARD_LINK lifts the card with the hover shadow, the
 * photo zooms to 1.05, the gradient deepens (its foot from 82% to 92% ink) and the knob turns persimmon
 * while its ↗ turns white and nudges 2px up and right.
 *
 * Scroll (fine pointers, where ViewTimeline exists, motion allowed): the photo drifts 6% of the card's
 * height inside its clip as the card crosses the screen (lib/parallax); the hover zoom composes with it.
 */

const CARD = "relative flex h-[220px] w-[308px] flex-col items-start justify-between overflow-clip rounded-2xl p-[22px]";

/** The scrim is drawn to 92% and held at 89% opacity (82% at its foot, as drawn); hover lifts it to 100%. */
const SCRIM =
  "pointer-events-none absolute inset-x-0 bottom-0 h-[136.4px] bg-linear-to-b from-[rgba(41,18,8,0)] to-[rgba(41,18,8,0.92)] opacity-[.89] [transition:opacity_var(--dur-fast)_var(--ease-out)]";

const FADE = "[transition:opacity_var(--dur-fast)_var(--ease-out)]";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** The round ↗ knob: orange on the flagship card, #ffefd5 on the others; persimmon (#e8652a) on hover. */
function Knob({ featured, linked }: { featured: boolean; linked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "flex size-9 shrink-0 items-center justify-center rounded-full [transition:background-color_var(--dur-fast)_var(--ease-out)]",
        featured ? "bg-orange" : "bg-[#ffefd5]",
        linked && "group-hover/card:bg-[#e8652a]",
      )}
    >
      <span
        className={cx(
          "relative size-3.5 [transition:translate_var(--dur-fast)_var(--ease-out)]",
          linked && "group-hover/card:translate-x-[2px] group-hover/card:-translate-y-[2px]",
        )}
      >
        {!featured && (
          <img
            src="/images/courses/knob-arrow-burnt.svg"
            alt=""
            width={14}
            height={14}
            className={cx("absolute inset-0 size-3.5", FADE, linked && "group-hover/card:opacity-0")}
          />
        )}
        <img
          src="/images/courses/knob-arrow-white.svg"
          alt=""
          width={14}
          height={14}
          className={cx("absolute inset-0 size-3.5", FADE, !featured && "opacity-0", !featured && linked && "group-hover/card:opacity-100")}
        />
      </span>
    </span>
  );
}

export default function ProgrammeCard({ programme }: { programme: BentoProgramme }) {
  const featured = programme.featured ?? false;
  const linked = programme.href !== null;
  const stage = stages.find((s) => s.id === programme.stage)?.label ?? programme.stage;
  const meta = programme.courseCount ? `${programme.modes} · ${plural(programme.courseCount, "course")}` : programme.modes;

  const content = (
    <>
      {/* The photo drifts with the scroll in the card's clip (lib/parallax); its hover zoom stays on the image. */}
      <ParallaxLayer speed={4} className="absolute inset-0">
        <Photo
          src={programme.photo.src}
          alt=""
          sizes="308px"
          className="absolute inset-0"
          style={{ opacity: programme.photo.opacity }}
          imageClassName={linked ? "group-hover/card:scale-105" : undefined}
        />
      </ParallaxLayer>
      <span aria-hidden="true" className={cx(SCRIM, linked && "group-hover/card:opacity-100")} />

      <div className="relative flex w-full items-center justify-between">
        <span className={cx("flex items-center gap-1.5 rounded-full px-2.5 py-[5px]", featured ? "bg-white/15" : "bg-orange/10")}>
          <img
            src={featured ? "/images/courses/chip-butta-saffron.svg" : "/images/courses/chip-butta-burnt.svg"}
            alt=""
            aria-hidden="true"
            width={11}
            height={11}
            className="size-[11px] shrink-0"
          />
          <span
            className={cx("text-[11px]/[normal] font-bold tracking-[0.88px] whitespace-nowrap uppercase", featured ? "text-saffron" : "text-burnt")}
          >
            {stage}
          </span>
        </span>
        <Knob featured={featured} linked={linked} />
      </div>

      <div className="relative flex flex-col items-start gap-1.5">
        <h3 className="w-[264px] text-[20px]/[1.22] font-bold tracking-[-0.2px] text-cream">{programme.title}</h3>
        <p className="text-[13px]/[normal] whitespace-nowrap text-cream/82">{meta}</p>
      </div>

      {/* The plain cards' rule sits over the photo and the gradient, as drawn. */}
      {!featured && <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl border border-[#eadbc4]" />}
    </>
  );

  const surface = featured ? "bg-[#3b2416]" : "bg-cream";
  if (programme.href === null) return <div className={cx(CARD, surface)}>{content}</div>;
  return (
    <a href={programme.href} className={cx(CARD, CARD_LINK, surface)}>
      {content}
    </a>
  );
}

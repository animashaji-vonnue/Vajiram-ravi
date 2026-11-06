import { stages, type BentoProgramme } from "@/data/programme-bento";
import { cx } from "@/lib/cx";
import { CARD_LINK } from "@/lib/hover";

/*
 * One programme card (final design, e.g. "programme · Optional Subject Programme" 2257:8875): 308 × 220
 * with 16px corners and 22px padding, the stage chip with its butta and the 36px ↗ knob at the top, the
 * title and meta line at the foot. The plain cards are cream paper with a 1px #eadbc4 rule; the flagship
 * card is #3b2416 with cream text.
 *
 * The picture is the course's own illustration (public/images/courses/art, made by
 * scripts/course-art.py), in one style for all eight, "block-print vignettes": a peach disc printed with
 * the butta flower and ringed by a dotted border, cropped by the card's top, and on it one flat object
 * for the course (books and a globe for the GS foundation, a shelf of subjects, a protractor for CSAT,
 * an OMR sheet, an answer booklet, a checklist with a rosette, a diya lighting a diya for mentorship, the
 * candidate's chair under a question and an answer). It keeps to the card's upper right, clear of the chip
 * and the knob, so the title and meta sit on plain paper in ink and need no shade behind them.
 *
 * Hover (motion spec, "Card hover"; linked cards only): CARD_LINK lifts the card with the hover shadow, the
 * illustration swells to 1.04 about its centre, and the knob turns persimmon while its ↗ turns white and
 * nudges 2px up and right.
 */

const CARD = "relative flex h-[220px] w-[308px] flex-col items-start justify-between overflow-clip rounded-2xl p-[22px]";

/** The illustration's centre in the card's box, which the hover swell grows from. */
const ART_SWELL = "origin-[204px_64px] [transition:scale_var(--dur-base)_var(--ease-out)]";

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
      <img
        src={programme.art}
        alt=""
        aria-hidden="true"
        width={308}
        height={220}
        loading="lazy"
        decoding="async"
        className={cx("pointer-events-none absolute inset-0 size-full max-w-none", ART_SWELL, linked && "group-hover/card:scale-[1.04]")}
      />

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
        <h3 className={cx("w-[264px] text-[20px]/[1.22] font-bold tracking-[-0.2px]", featured ? "text-cream" : "text-ink")}>{programme.title}</h3>
        <p className={cx("text-[13px]/[normal] whitespace-nowrap", featured ? "text-cream/82" : "text-clay")}>{meta}</p>
      </div>

      {/* The plain cards' rule sits over the illustration, as drawn. */}
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

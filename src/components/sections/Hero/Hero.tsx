import Cta from "@/components/ui/Cta";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { achievements, achievementsLabel, hero } from "@/data/hero";
import { cx } from "@/lib/cx";
import Chakra from "./Chakra";
import { AT, ENTER, LINE, RISE, at } from "./enter";
import HeroFigure from "./HeroFigure";

/** The eyebrow's rule grows out from the label (as the ornament's own reveal does), with the fade. */
const EYEBROW_RULE =
  "[&_[data-eyebrow-rule]]:transition-[clip-path] [&_[data-eyebrow-rule]]:duration-400 [&_[data-eyebrow-rule]]:ease-out [&_[data-eyebrow-rule]]:delay-(--at) [&_[data-eyebrow-rule]]:starting:[clip-path:inset(0_100%_0_0)]";

/** The photo settles from a slight zoom, slower than the copy so it is still easing in as the copy lands. */
const SETTLE = "transition-[scale] duration-[1400ms] ease-out delay-(--at) starting:scale-[1.06]";

/** The short rule between two achievements, as drawn (38px, ink at 10%). */
const DIVIDER =
  "before:absolute before:top-1/2 before:left-0 before:h-[38px] before:w-px before:-translate-y-1/2 before:bg-ink/10";

/**
 * The outcome-led hero (Figma "01 · Hero", 2392:5234): a 1280 × 585 banner, 40px under the header, and the
 * achievements bar 20px below it.
 *
 * The banner (2392:5235) is the design's photo of four aspirants before Parliament with the flag and the
 * Ashoka chakra, a saffron sky and an orange ribbon at its foot. The copy sits on its sky at the left, 56px
 * in: the eyebrow, the heading (Newsreader 64, its emphasis in italic burnt), the lead and the two CTAs.
 * In the design the lead and buttons run over the people; here the photo is extended on its left (its own
 * sky, and the ribbon curling down towards the corner) so the people stand to the right of the copy, and
 * every line of text is on sky: the heading and lead in ink, the emphasis in burnt (AA for large text).
 *
 * The achievements bar (2392:5257): the three results of the content, evenly spread, each a laurel (burnt)
 * holding its figure in Newsreader, with the name and the exam beside it, and short rules between them.
 *
 * Motion (once, on load; see ./enter for how it waits for the intro curtain): the banner fades in while
 * the photo settles from 1.06 over 1.4s; the eyebrow (its rule growing out), then the heading line by line,
 * each rising 24px out of a 6px blur, 80ms apart; the lead; the CTAs; and the three achievements, each
 * rising as its figure rolls into place (./HeroFigure). Ambient: the chakra turns once every two minutes
 * while the banner is on screen (./Chakra). Reduced motion: everything is in place at once and the wheel
 * stands still.
 */
export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-h" className="bg-paper">
      <div className="mx-auto w-canvas px-20 pt-10">
        <div className={cx("relative isolate h-[585px] overflow-clip rounded-[27px] bg-cream", ENTER)} style={at(AT.art)}>
          {/* The art: the photo (without its wheel) and the wheel, which turns. Decoration. */}
          <div aria-hidden="true" className={cx("absolute inset-0", SETTLE)} style={at(AT.art)}>
            <img
              src="/images/hero/banner.webp"
              alt=""
              width={2059}
              height={941}
              fetchPriority="high"
              className="absolute inset-0 size-full max-w-none object-cover"
            />
            <Chakra />
          </div>

          <div className="relative flex flex-col items-start px-14 pt-14">
            <div className={cx(ENTER, EYEBROW_RULE)} style={at(AT.eyebrow)}>
              <EyebrowLeft reveal={false} labelClassName="text-burnt">
                {hero.eyebrow}
              </EyebrowLeft>
            </div>

            <h1 id="hero-h" className="mt-5 font-serif text-[64px]/[1.06] font-normal tracking-[-0.02em] text-ink">
              {hero.headline.map((line, i) => (
                <span key={i} className={cx("block whitespace-nowrap", LINE)} style={at(AT.lines[i])}>
                  {line.map((run) =>
                    run.em ? (
                      <em key={run.text} className="text-burnt italic">
                        {run.text}
                      </em>
                    ) : (
                      run.text
                    ),
                  )}
                </span>
              ))}
            </h1>

            {/* 440 wide, so it sets in three even lines, all on the sky. */}
            <p className={cx("mt-5 w-[440px] text-[17px]/[1.55] text-ink", RISE)} style={at(AT.lead)}>
              {hero.lead}
            </p>

            <div className="mt-8 flex items-start gap-3">
              <span className={cx("flex", RISE)} style={at(AT.ctas[0])}>
                <Cta variant="primary" size="lg" href={hero.primary.href}>
                  {hero.primary.label}
                </Cta>
              </span>
              <span className={cx("flex", RISE)} style={at(AT.ctas[1])}>
                <Cta variant="secondary" size="lg" href={hero.secondary.href}>
                  {hero.secondary.label}
                </Cta>
              </span>
            </div>
          </div>
        </div>

        <ul aria-label={achievementsLabel} className="mt-5 grid grid-cols-3 py-6">
          {achievements.map((item, i) => (
            <li
              key={item.name}
              data-enter
              className={cx("relative flex items-center justify-center gap-4", i > 0 && DIVIDER, RISE)}
              style={at(AT.achievements[i])}
            >
              <span className="relative flex h-[89px] w-[111px] shrink-0 items-center justify-center">
                <img src="/images/hero/laurel.svg" alt="" aria-hidden="true" width={111} height={89} className="absolute inset-0 size-full" />
                <span className="relative font-serif text-[32px]/[1.1] font-medium tracking-[-0.015em] whitespace-nowrap text-mahogany">
                  <HeroFigure value={item.figure} />
                </span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[17px]/[1.35] font-medium whitespace-nowrap text-ink">{item.name}</span>
                <span className="font-mono text-[12px]/[normal] tracking-[0.08em] text-clay uppercase">{item.exam}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

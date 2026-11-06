import Cta from "@/components/ui/Cta";
import IndianLink from "@/components/ui/IndianLink";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { heroIntro } from "@/data/hero";
import { cx } from "@/lib/cx";
import { AT, ENTER, RISE, at } from "./enter";
import HeroGlow from "./HeroGlow";
import NicheLines from "./NicheLines";
import Parallax from "./Parallax";
import PlaceRoll from "./PlaceRoll";
import ProofCard from "./ProofCard";

/** The eyebrow's rule grows out from the label (as the ornament's own reveal does), with the fade. */
const EYEBROW_RULE =
  "[&_[data-eyebrow-rule]]:transition-[clip-path] [&_[data-eyebrow-rule]]:duration-400 [&_[data-eyebrow-rule]]:ease-out [&_[data-eyebrow-rule]]:delay-(--at) [&_[data-eyebrow-rule]]:starting:[clip-path:inset(0_100%_0_0)]";

/**
 * The hero (Figma "01 Hero – Lady Justice niche (dark)", 2256:5586): an 820px mahogany band. At the left,
 * 88px down, the eyebrow, the 80px Newsreader heading with its saffron italic second line, the lead, the
 * two CTAs and the "New to UPSC?" link; at the right, Lady Justice in a gold-lined arched niche on a
 * saffron plinth line, with the proof card over its foot. Behind: the Sansad Bhavan line art at 16%, a
 * warm glow and a paper grain in overlay. Every layer sits on the 1440 canvas where Figma puts it.
 *
 * Motion (spec, "01 Hero"): a once-only load sequence in CSS (see ./enter and ./NicheLines), the glow's
 * slow breathing while in view (HeroGlow), and a light scroll parallax on the statue (0.9×) and the line
 * art (0.8×) (Parallax). None of it uses data-reveal: the hero is on screen at load. On every load the
 * sequence waits for the intro curtain (layout/Preloader, `--intro`).
 */
export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-h"
      className="relative isolate h-[820px] overflow-clip bg-linear-to-r from-mahogany to-[#3d1c0c]"
    >
      {/* The art, back to front as in Figma. No transform on the canvas boxes: the grain blends with all below it. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-y-0 left-1/2 -ml-[720px] w-canvas">
          <Parallax speed={0.8} className="absolute top-[29px] left-px h-[944px] w-canvas overflow-hidden opacity-16">
            <img
              src="/images/hero/sansad-bhavan-line-art.webp"
              alt=""
              width={626}
              height={626}
              decoding="async"
              className="absolute top-0 left-[7.95%] h-[128.18%] w-[84.03%] max-w-none"
            />
          </Parallax>
          <HeroGlow />
        </div>
        <img
          src="/images/hero/paper-grain.webp"
          alt=""
          width={1024}
          height={1440}
          decoding="async"
          className="absolute inset-0 size-full object-cover opacity-14 mix-blend-overlay"
        />
        <div className="absolute inset-y-0 left-1/2 -ml-[720px] w-canvas">
          <NicheLines />
          <Parallax speed={0.9} className="absolute top-[33px] left-[940px] h-[697px] w-[360px]">
            <img
              src="/images/hero/lady-justice.webp"
              alt=""
              width={517}
              height={1000}
              fetchPriority="high"
              className={cx(
                "size-full object-contain drop-shadow-[0_24px_40px_rgba(20,8,3,0.5)] starting:translate-y-8",
                ENTER,
              )}
              style={at(AT.statue)}
            />
          </Parallax>
          <div className="absolute top-[730px] left-[890px] h-0.5 w-[460px] bg-saffron/50" />
        </div>
      </div>

      <div className="relative mx-auto h-full w-canvas px-20 pt-[88px]">
        <div className="flex w-[640px] flex-col items-start gap-6">
          <div className={cx(ENTER, EYEBROW_RULE)} style={at(AT.eyebrow)}>
            <EyebrowLeft reveal={false}>{heroIntro.eyebrow}</EyebrowLeft>
          </div>

          <h1 id="hero-h" className="font-serif text-[80px]/[1.08] tracking-[-1.2px] whitespace-nowrap text-parchment">
            <span className={cx("block", RISE)} style={at(AT.headline)}>
              {heroIntro.headline}
            </span>
            <span className={cx("block text-saffron italic", RISE)} style={at(AT.accent)}>
              {/* Read once, in full; the rolling place below is for the eye. */}
              <span className="sr-only">{heroIntro.accent.text}</span>
              <span aria-hidden="true">
                {heroIntro.accent.lead} <PlaceRoll places={heroIntro.accent.places} />
              </span>
            </span>
          </h1>

          <p className={cx("w-[540px] text-[18px]/[28px] font-medium text-parchment/80", RISE)} style={at(AT.lead)}>
            {heroIntro.lead}
          </p>

          <div className="flex items-start gap-3">
            <span className={cx("flex", RISE)} style={at(AT.ctas)}>
              <Cta variant="primary-dark" size="lg" href={heroIntro.primary.href}>
                {heroIntro.primary.label}
              </Cta>
            </span>
            <span className={cx("flex", RISE)} style={at(AT.ctas + 60)}>
              <Cta variant="secondary-dark" size="lg" href={heroIntro.secondary.href}>
                {heroIntro.secondary.label}
              </Cta>
            </span>
          </div>

          <p className={cx("flex items-center gap-1.5 text-[15px]/[22px] font-medium whitespace-nowrap text-parchment/70", RISE)} style={at(AT.ctas + 120)}>
            {heroIntro.newToUpsc.text}
            <IndianLink tone="dark" underlined href={heroIntro.newToUpsc.href}>
              {heroIntro.newToUpsc.link}
            </IndianLink>
          </p>
        </div>

        <ProofCard />
      </div>
    </section>
  );
}

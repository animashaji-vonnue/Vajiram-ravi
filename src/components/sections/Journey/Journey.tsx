import { EyebrowLeft } from "@/components/ui/Ornament";
import { journeyIntro } from "@/data/journey";
import JourneyStages from "./JourneyStages";

/**
 * "UPSC preparation journey & academic support" (the client's IA 2; no Figma frame, so it is drawn in the
 * page's own language): a cream band edged above and below with the block-print band, holding the
 * left-aligned heading with its lead in a right-hand column, then the three stages of the examination as a
 * path, Prelims → Mains → Personality Test: a rail of numbered medallions strung on a thread, over the
 * chosen stage's panel.
 *
 * The whole band is one screen that stays put (JourneyStages pins it) while the page scrolls through the
 * three stages one after another; when the last has had its turn the band lets go and the page moves on.
 *
 * Motion: the heading block reveals as the band arrives (ScrollReveal, on the pinned screen); the rail draws
 * its thread and lights its medallions (StageRail); then the scroll moves the stages on, the filled thread
 * following it, and the panel cross-fades between stages (JourneyStages).
 */
export default function Journey() {
  const { heading } = journeyIntro;
  return (
    <section id="journey" aria-labelledby="journey-h" className="relative bg-cream">
      <JourneyStages
        heading={
          // The heading in three even lines at 820 wide; the lead beside it, standing on its last line.
          <div className="flex items-end justify-between">
            <div className="flex w-[820px] flex-col items-start gap-4">
              <EyebrowLeft>{journeyIntro.eyebrow}</EyebrowLeft>
              <h2 id="journey-h" data-reveal="heading" className="font-serif text-[56px]/[1.08] font-normal tracking-[-1.12px] text-ink">
                {heading.lead}{" "}
                <em data-reveal-em className="text-orange italic">
                  {heading.emphasis}
                </em>
              </h2>
            </div>
            <p data-reveal="sub" className="mb-1.5 w-[400px] text-[17px]/[1.55] text-clay">
              {journeyIntro.lead}
            </p>
          </div>
        }
      />
    </section>
  );
}

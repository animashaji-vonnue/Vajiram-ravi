import { journeyIntro } from "@/data/journey";
import JourneyStages from "./JourneyStages";

/**
 * "UPSC preparation journey & academic support" (the client's IA 2; no Figma frame, so it is drawn in the
 * page's own language): a cream band holding the
 * centred heading, then the three stages of the examination as a
 * path, Prelims → Mains → Interview: a rail of numbered medallions strung on a thread, over the
 * chosen stage's panel.
 *
 * The whole band is one screen that stays put (JourneyStages pins it) while the page scrolls through the
 * three stages one after another; when the last has had its turn the band lets go and the page moves on.
 *
 * Motion: the heading's letters rise in as the band arrives (ui/TextMotion, data-split), its orange words
 * catching a light now and then; the rail draws its thread and lights its medallions (StageRail); then the
 * scroll moves the stages on, the filled thread following it, the chosen medallion's halo breathing, and
 * the panel cross-fades between stages, its figures counting up as they are first seen (JourneyStages).
 */
export default function Journey() {
  const { heading } = journeyIntro;
  return (
    <section id="journey" aria-labelledby="journey-h" className="relative bg-cream">
      <JourneyStages
        heading={
          // The heading, centred, in two even lines (the client asked for no lead paragraph under it).
          <h2 id="journey-h" data-split className="mx-auto w-[820px] text-center font-heading text-[56px]/[1.08] font-normal tracking-[-1.12px] text-ink">
            {heading.lead}{" "}
            <em data-reveal-em className="text-orange italic">
              {heading.emphasis}
            </em>
          </h2>
        }
      />
    </section>
  );
}

import Cta from "@/components/ui/Cta";
import { closingCta } from "@/data/closing-cta";
import SunRise from "./SunRise";

/** The buttons follow the heading and text into view, 300ms behind them. */
const FOLLOW_MS = "300";

/**
 * The closing call to action above the footer, 720 tall: an orange-to-red band with the halo rings
 * and the sun disc rising from its foot (SunRise), and the call to action centred above them.
 * The primary button is the saffron one the counselling band uses on its orange (feedback item 42), beside
 * the white secondary. The band clips the disc.
 *
 * The band plays (SunRise, sunrisePlay.ts): the scroll raises the sun, the sun follows a mouse over it, the
 * heading's letters lift towards the pointer, and a press or tap anywhere but the buttons sends a halo
 * ripple out from the point.
 */
export default function ClosingCta() {
  return (
    <section id="closing" data-curtain aria-labelledby="closing-h" className="relative h-[720px] overflow-hidden bg-linear-to-b from-orange to-[#ae3b0f]">
      <div className="relative mx-auto h-full w-canvas">
        <SunRise />

        <div className="relative mx-auto flex w-[1240px] flex-col items-center gap-[22px] pt-24">
          <h2
            id="closing-h"
            data-split
            className="w-[1240px] text-center font-heading text-[68px]/[1.06] tracking-[-0.02em] whitespace-nowrap text-white"
          >
            {closingCta.title.lead}
            {/* "with" and the emphasis take the second line. */}
            <br />
            {closingCta.bridge}
            <em data-reveal-em className="text-[#fff1c2]">
              {closingCta.title.em}
            </em>
          </h2>
          <p data-words className="w-[560px] text-center text-[17px]/[1.55] text-white/90">
            {closingCta.text}
          </p>

          <div data-reveal data-reveal-delay={FOLLOW_MS} className="flex items-start gap-3">
            <Cta variant="primary-dark" size="lg" href={closingCta.primary.href}>
              {closingCta.primary.label}
            </Cta>
            <Cta variant="secondary" size="lg" href={closingCta.secondary.href}>
              {closingCta.secondary.label}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

import Cta from "@/components/ui/Cta";
import { EyebrowCentred } from "@/components/ui/Ornament";
import { aboutCards, aboutCta, aboutIntro } from "@/data/about";
import ArcCarousel from "./ArcCarousel";

/**
 * "About Vajiram & Ravi" (the client's IA 3, on the layout of Figma "07 · Why Students Choose V&R",
 * 2377:4515): a white band, the heading group centred over the arc carousel of six cards (the four
 * institutional facts, led by their figures, and the two ways of learning) and its controls (ArcCarousel),
 * then the button to the about page.
 *
 * Motion: the heading group, the controls and the button reveal with the section (ScrollReveal); the cards
 * spread from a pile along the arc as it comes into view, then turn as a carousel (ArcCarousel).
 */
export default function About() {
  const { heading } = aboutIntro;
  return (
    <section id="about" aria-labelledby="about-h" className="overflow-clip bg-white">
      <div className="mx-auto flex w-canvas flex-col items-center gap-12 py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <EyebrowCentred>{aboutIntro.eyebrow}</EyebrowCentred>
          {/* One sentence a line: the first two on the first, the third in orange italic on the second. */}
          <h2 id="about-h" data-reveal="heading" className="font-serif text-[56px]/[1.08] font-normal tracking-[-1.12px] text-ink">
            {heading.lead}
            <br />
            <em data-reveal-em className="text-orange italic">
              {heading.emphasis}
            </em>
          </h2>
          <p data-reveal="sub" className="w-[640px] text-[17px]/[1.55] text-clay">
            {aboutIntro.lead}
          </p>
        </div>

        <ArcCarousel cards={aboutCards} label={aboutIntro.carouselLabel} itemName={aboutIntro.itemName} />

        <div data-reveal>
          <Cta variant="primary" href={aboutCta.href}>
            {aboutCta.label}
          </Cta>
        </div>
      </div>
    </section>
  );
}

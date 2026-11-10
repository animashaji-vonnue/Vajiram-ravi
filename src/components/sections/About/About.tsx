import Cta from "@/components/ui/Cta";
import { EyebrowCentred } from "@/components/ui/Ornament";
import { aboutCards, aboutCta, aboutIntro } from "@/data/about";
import ArcCarousel from "./ArcCarousel";

/**
 * "About Vajiram & Ravi" (the client's IA 3, on the layout of Figma "07 · Why Students Choose V&R",
 * 2377:4515): a white band with Parliament House faintly behind it (Figma 2484:5280), the heading group
 * centred over the arc carousel of seven cards (the four institutional facts and the ways of learning) and
 * its controls (ArcCarousel), then the button to the about page.
 *
 * Motion: the heading group, the controls and the button reveal with the section (ScrollReveal); the cards
 * spread from a pile along the arc as it comes into view, then turn as a carousel (ArcCarousel).
 */
export default function About() {
  const { heading } = aboutIntro;
  return (
    <section id="about" aria-labelledby="about-h" className="relative isolate overflow-clip bg-white">
      {/*
        Parliament House at dusk (Figma 2484:5280), mirrored and at 10% over the white, as the band's ground,
        fading out towards the cards' foot. Decoration.
      */}
      <img
        src="/images/about/parliament.webp"
        alt=""
        aria-hidden="true"
        width={1920}
        height={1086}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute top-1.5 left-1/2 -z-10 w-[max(107%,1542px)] max-w-none -translate-x-1/2 -scale-x-100 opacity-[0.14] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
      />
      {/*
        In front of the photo, a light wash of the hero's gradient (Figma 2484:4261), multiplied in at a low
        opacity so Parliament takes its warmth, and fading out with the photo towards the foot. Decoration.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1060px] bg-[linear-gradient(143.9deg,#fab85c_7.69%,#ed781c_46.15%,#b8400f_84.62%)] opacity-[0.16] mix-blend-multiply [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
      />
      <div className="mx-auto flex w-canvas flex-col items-center gap-12 pt-24 pb-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <EyebrowCentred>{aboutIntro.eyebrow}</EyebrowCentred>
          {/* One sentence a line: the first two on the first, the third in orange italic on the second. */}
          <h2 id="about-h" data-reveal="heading" className="font-heading text-[56px]/[1.08] font-normal tracking-[-1.12px] text-ink">
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

        {/* Under the centre card, between the two arrows on the arc. */}
        <div data-reveal className="relative z-10 -mt-[118px]">
          <Cta variant="primary" href={aboutCta.href}>
            {aboutCta.label}
          </Cta>
        </div>
      </div>
    </section>
  );
}

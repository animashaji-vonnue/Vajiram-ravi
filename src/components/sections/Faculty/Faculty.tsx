import { EyebrowLeft } from "@/components/ui/Ornament";
import { educators, facultyIntro } from "@/data/faculty";
import FacultyCarousel from "./FacultyCarousel";

/**
 * "Learn from top educators" (Figma "10 · Faculty — subject gurus", 2271:10583), 1440 × 738: the warm
 * paper band (#ffefd5 with the page's paper texture at 45%), the left-aligned heading with its italic
 * emphasis and the carousel arrows at its right, the row of arch-portrait faculty cards, and the progress
 * line. Padding 72 / 80; 32px between the heading row, the cards and the line. The heading reveals in the
 * page's order (eyebrow, heading with its italic second beat, lead) and the cards rise in turn.
 */
export default function Faculty() {
  return (
    <section id="faculty" aria-labelledby="faculty-h" className="relative isolate overflow-clip bg-[#ffefd5]">
      <img
        src="/images/free-resources/paper-texture.webp"
        alt=""
        aria-hidden="true"
        width={1024}
        height={1440}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 -z-1 size-full max-w-none object-cover opacity-45"
      />
      <div className="mx-auto flex w-canvas flex-col items-start px-20 py-[72px]">
        <FacultyCarousel
          educators={educators}
          profileLabel={facultyIntro.profile}
          heading={
            <div className="flex flex-col items-start gap-3">
              <EyebrowLeft>{facultyIntro.eyebrow}</EyebrowLeft>
              <h2 id="faculty-h" data-reveal="heading" className="w-[700px] text-[48px]/[1.08] font-bold tracking-[-1.2px] text-ink">
                {facultyIntro.heading.lead}{" "}
                <em data-reveal-em className="font-serif text-[52px]/[1.08] font-normal text-burnt italic">
                  {facultyIntro.heading.emphasis}
                </em>
              </h2>
              <p data-reveal="sub" className="w-[620px] text-[16px]/[1.55] text-[#7a6a5c]">
                {facultyIntro.lead}
              </p>
            </div>
          }
        />
      </div>
    </section>
  );
}

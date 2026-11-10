import IndianLink from "@/components/ui/IndianLink";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { stories, storiesIntro } from "@/data/stories";
import Postcards from "./Postcards";

/**
 * Student stories & experiences (IA 8; Figma "09 · Student Stories", 2392:5350): a paper band with the
 * left-aligned heading row (eyebrow, heading with its italic second beat, lead) and under it the
 * students' words written on postcards, turning on a 3D ring after the `kevin` branch's stories (Postcards). "Watch Student Stories" goes
 * under the lead once that page exists (links.studentStories is null today), as on the educators' note.
 */
export default function SuccessStories() {
  const { eyebrow, heading, lead, cta } = storiesIntro;
  return (
    <section id="stories" aria-labelledby="stories-h" className="relative bg-paper">
      <div className="mx-auto w-canvas px-20 py-24">
        <Postcards
          stories={stories}
          heading={
            <div className="flex flex-col items-start gap-5">
              <EyebrowLeft>{eyebrow}</EyebrowLeft>
              <h2 id="stories-h" data-split className="w-[760px] font-heading text-[56px]/[1.08] font-normal tracking-[-0.02em] text-ink">
                {heading.lead}{" "}
                <em data-reveal-em className="text-orange italic">
                  {heading.emphasis}
                </em>
              </h2>
              <p data-words className="w-[640px] text-[17px]/[1.55] text-clay">
                {lead}
              </p>
              {cta.href !== null && (
                <span data-reveal="sub">
                  <IndianLink tone="light" href={cta.href}>
                    {cta.label}
                  </IndianLink>
                </span>
              )}
            </div>
          }
        />
      </div>
    </section>
  );
}

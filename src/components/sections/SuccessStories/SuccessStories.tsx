import IndianLink from "@/components/ui/IndianLink";
import { stories, storiesIntro } from "@/data/stories";
import Postcards from "./Postcards";

/**
 * Student stories & experiences (IA 8; Figma "09 · Student Stories", 2392:5350): a cream band with the
 * centred heading (its closing beat, "toppers and alumni", in orange; no lead, at the client's request), and under it the
 * students' words written on postcards, turning on a 3D ring after the `kevin` branch's stories (Postcards). "Watch student stories" goes
 * under the heading once that page exists (links.studentStories is null today), as on the educators' note.
 */
export default function SuccessStories() {
  const { heading, cta } = storiesIntro;
  return (
    <section id="stories" aria-labelledby="stories-h" className="relative bg-cream">
      <div className="mx-auto w-canvas px-20 pt-10 pb-24">
        <Postcards
          stories={stories}
          heading={
            <div className="mx-auto flex flex-col items-center gap-5 text-center">
              <h2 id="stories-h" data-split className="w-[760px] font-heading text-[56px]/[1.08] font-normal tracking-[-0.02em] text-ink">
                {heading.lead}{" "}
                <em data-reveal-em className="text-orange italic">
                  {heading.emphasis}
                </em>{" "}
                {heading.after}
              </h2>
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

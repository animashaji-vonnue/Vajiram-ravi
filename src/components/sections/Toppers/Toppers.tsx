import NoteCard from "@/components/ui/NoteCard";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { toppersByYear, toppersSection, toppersYear } from "@/data/toppers";
import ToppersCarousel from "./ToppersCarousel";

/**
 * The toppers band (Figma "03 · Results · Toppers CSE 2025", 2257:5843): a paper band, 906px tall on the
 * canvas. The heading and a scalloped note share the top row; below them, a carousel of stamp cards for
 * ranks 1 to 10, five at a time, with its progress line, arrows and a link to all the selections.
 *
 * There is no year switch in the final design. If one comes back, the motion spec has the cards cross-fade
 * over 200ms rather than slide (ui/CrossFade); `toppersByYear` already holds the earlier years.
 */
export default function Toppers() {
  const { heading } = toppersSection;
  return (
    <section id="toppers" aria-labelledby="toppers-h" className="bg-paper">
      <div className="mx-auto flex w-canvas flex-col gap-[52px] px-20 pt-[78px] pb-[112px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-[18px]">
            <EyebrowLeft>{toppersSection.eyebrow}</EyebrowLeft>
            {/* 700 wide, as drawn, so it breaks after "with". */}
            <h2 id="toppers-h" data-reveal="heading" className="w-[700px] font-serif text-[60px]/[1.04] font-normal tracking-[-1.5px] text-[#1a1714]">
              {heading.lead}{" "}
              <em data-reveal-em className="text-orange italic">
                {heading.emphasis}
              </em>
            </h2>
          </div>
          {/* The note card (ui/NoteCard) in a 194px box, so the top row is as tall as drawn. */}
          <div data-reveal="sub" className="h-[194px] w-[372px] shrink-0 pt-[35.45px]">
            <NoteCard>
              <p className="text-[15px]/[22px] font-medium text-clay">{toppersSection.note}</p>
            </NoteCard>
          </div>
        </div>

        <ToppersCarousel
          toppers={toppersByYear[toppersYear] ?? []}
          label={toppersSection.carouselLabel}
          stamp={toppersSection.stamp}
          cta={toppersSection.cta}
        />
      </div>
    </section>
  );
}

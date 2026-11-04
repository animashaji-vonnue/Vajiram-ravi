import { Eyebrow, SectionTitle } from "@/components/ui/Typography";
import { toppers } from "@/data/home";
import TopperCard from "./TopperCard";
import ToppersReel from "./ToppersReel";

/**
 * Toppers: a centred eyebrow and heading above the scroll-driven reel of topper cards, filled out with
 * empty placeholder cards (hidden from screen readers) until every topper is added.
 */
export default function Toppers() {
  const cards = Array.from({ length: Math.max(toppers.cards, toppers.list.length) }, (_, i) => {
    const topper = toppers.list[i];
    return { key: topper?.name ?? `placeholder-${i}`, placeholder: !topper, card: <TopperCard topper={topper} /> };
  });
  return (
    <section id="toppers" className="bg-white" aria-labelledby="toppers-title">
      <ToppersReel cards={cards}>
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow tone="maroon" tagged tag="crest">
            {toppers.eyebrow}
          </Eyebrow>
          <SectionTitle id="toppers-title">{toppers.heading}</SectionTitle>
        </div>
      </ToppersReel>
    </section>
  );
}

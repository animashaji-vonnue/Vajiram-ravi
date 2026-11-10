import { toppersSection } from "@/data/toppers";
import ToppersBoard from "./ToppersBoard";

/**
 * Our results (Figma "08 · Our Results & Student Stories", 2392:5005): the verified toppers, straight after
 * the hero. A paper band, centred: the eyebrow (it names the year on show), the heading in two lines as
 * drawn, then the toppers' masonry with the year ruler at its right, and the button to all selections.
 * The design's centred deck of AIR cards is where the grid starts: the cards are dealt out of it.
 *
 * The heading is rendered here; the year-dependent parts and all the motion are in ./ToppersBoard.
 */
export default function Toppers() {
  const { heading } = toppersSection;
  return (
    <section id="results" aria-labelledby="results-h" className="bg-paper">
      <div className="mx-auto w-canvas px-20 py-24">
        <ToppersBoard
          heading={
            // 700 wide, as drawn, so it breaks before "Vajiram & Ravi".
            <h2
              id="results-h"
              data-reveal="heading"
              className="mt-5 w-[700px] text-center font-serif text-[56px]/[1.08] font-normal tracking-[-0.02em] text-ink"
            >
              {heading.lead}{" "}
              <em data-reveal-em className="text-orange italic">
                {heading.emphasis}
              </em>
            </h2>
          }
        />
      </div>
    </section>
  );
}

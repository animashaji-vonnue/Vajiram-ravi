import { Button } from "@/components/ui/Buttons";
import { programmes } from "@/data/home";
import ProgrammeCard from "./ProgrammeCard";
import ProgrammesReel from "./ProgrammesReel";

/**
 * "Featured UPSC CSE programmes", after the design's section 3591:2114: on a marigold card in a tile border,
 * the heading and intro with a small "View all" button at the far right, over a row of programme cards that
 * slides sideways as the page scrolls (ProgrammesReel).
 */
export default function Programmes() {
  const cards = programmes.list.map((programme) => ({
    key: programme.name,
    card: <ProgrammeCard programme={programme} />,
  }));
  return (
    <section id="programmes" className="bg-white" aria-labelledby="programmes-title">
      <div className="mx-auto w-canvas px-10 py-24">
        <ProgrammesReel cards={cards}>
          <div className="flex items-end justify-between gap-20">
            <div className="flex flex-col gap-2">
              <h2 id="programmes-title" className="font-display text-[38px]/[45px] font-semibold text-brand-950">
                {programmes.heading}
              </h2>
              <p className="font-sans text-[18px]/[25px] font-medium text-brand-900">{programmes.intro}</p>
            </div>
            <Button href={programmes.viewAll.href} tone="secondary" size="xs">
              {programmes.viewAll.label}
            </Button>
          </div>
        </ProgrammesReel>
      </div>
    </section>
  );
}

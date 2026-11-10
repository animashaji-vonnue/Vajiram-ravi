import NoteCard from "@/components/ui/NoteCard";
import { batchesCopy } from "@/data/admissions";
import AdmissionsBoard from "./AdmissionsBoard";
import FeaturedBatch from "./FeaturedBatch";

/**
 * Upcoming Batches & Admissions (IA 5; Figma "04 · Upcoming Batches", 2377:4662): a white band.
 * The heading row with the lead on the note card at its right, the featured batch on its wide ticket
 * (FeaturedBatch), then the mode and month tabs with the round arrows, the railway-ticket track of the other
 * batches, and "View All Upcoming Batches" (AdmissionsBoard). The postcard form that a ticket's "Register
 * now" opens is the next section (Counselling).
 */
export default function Admissions() {
  const { title } = batchesCopy;
  return (
    <section id="batches" aria-labelledby="batches-h" className="relative bg-white">
      <div className="relative mx-auto flex w-canvas flex-col items-start gap-12 px-20 pt-24 pb-16">

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col items-start gap-4">
            <h2 id="batches-h" data-split className="w-[760px] font-heading text-[56px]/[1.08] tracking-[-0.02em] text-ink">
              {title.before}{" "}
              <em data-reveal-em className="text-orange italic">
                {title.em}
              </em>{" "}
              {title.after}
            </h2>
          </div>
          {/*
           * The lead on the note card of the toppers band (ui/NoteCard), as the design frames it. The card is
           * taller than the heading column, so it stands on the row's foot and rises into the band's top
           * padding: the row keeps its height.
           */}
          <div className="relative w-[372px] shrink-0 self-stretch">
            <div data-reveal="sub" className="absolute right-0 bottom-0">
              <NoteCard>
                <p className="text-[17px]/[1.55] text-clay">{batchesCopy.lead}</p>
              </NoteCard>
            </div>
          </div>
        </div>

        <FeaturedBatch />

        <AdmissionsBoard />
      </div>
    </section>
  );
}

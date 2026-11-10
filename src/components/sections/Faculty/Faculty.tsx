import IndianLink from "@/components/ui/IndianLink";
import NoteCard from "@/components/ui/NoteCard";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { educators, facultyIntro } from "@/data/faculty";
import EducatorRing from "./EducatorRing";

/**
 * Meet our educators (IA 7; Figma "06 · Meet Our Educators", 2377:4795): a white band. The heading row has the eyebrow, the heading with its italic second beat and the
 * lead on the left, and on the right the note card (the content's second paragraph) over the round
 * arrows. Under it the educators' portrait cards travel on a large ring (EducatorRing).
 *
 * "Meet Our Faculty" goes on the note card once the faculty page exists (links.faculty is null today):
 * until then a button that goes nowhere would only be a false promise, and the ring right below already
 * does what the note invites.
 */
export default function Faculty() {
  const { eyebrow, heading, lead, note, cta } = facultyIntro;
  return (
    <section id="educators" aria-labelledby="educators-h" className="relative isolate overflow-clip bg-white py-24">
      <EducatorRing
        educators={educators}
        heading={
          <div className="flex w-[720px] flex-col items-start gap-5">
            <EyebrowLeft>{eyebrow}</EyebrowLeft>
            <h2 id="educators-h" data-split className="font-heading text-[56px]/[1.08] font-normal tracking-[-0.02em] text-ink">
              {heading.lead}{" "}
              <em data-reveal-em className="text-orange italic">
                {heading.emphasis}
              </em>
            </h2>
            <p data-words className="w-[620px] text-[17px]/[1.55] text-clay">
              {lead}
            </p>
          </div>
        }
        note={
          <NoteCard data-reveal="sub">
            <p className="text-[16px]/[1.5] font-medium text-clay">{note}</p>
            {cta.href !== null && (
              <IndianLink tone="light" size="sm" href={cta.href} className="mt-2 self-start">
                {cta.label}
              </IndianLink>
            )}
          </NoteCard>
        }
      />
    </section>
  );
}

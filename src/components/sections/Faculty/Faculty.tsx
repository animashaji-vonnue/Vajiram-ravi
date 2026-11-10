import IndianLink from "@/components/ui/IndianLink";
import { educators, facultyIntro } from "@/data/faculty";
import EducatorFlow from "./EducatorFlow";

/**
 * Meet our educators (IA 7; Figma "06 · Meet Our Educators", 2377:4795): a cream band (the journey's).
 * The centred heading, its second beat in burnt orange (Mukta has no italics), and the lead; under them
 * the educators in the shared coverflow, with the centred educator introduced right under the big card
 * (EducatorFlow).
 *
 * "Meet our faculty" goes under the lead once the faculty page exists (links.faculty is null today):
 * until then a button that goes nowhere would only be a false promise, and the coverflow right below
 * already does what it invites.
 *
 * Motion (ui/TextMotion): the heading's letters rise in (data-split), the burnt words catching a light now
 * and then; the lead lights up word by word with the scroll (data-words); the coverflow rises into place
 * as it comes up the screen (data-rise).
 */
export default function Faculty() {
  const { heading, lead, cta } = facultyIntro;
  return (
    <section id="educators" aria-labelledby="educators-h" className="relative isolate overflow-clip bg-cream pt-24 pb-16">
      <div className="mx-auto flex w-canvas flex-col items-center gap-5 px-20 text-center">
        <h2 id="educators-h" data-split className="w-[820px] font-heading text-[56px]/[1.08] font-normal tracking-[-0.02em] text-ink">
          {heading.lead} <span className="text-burnt">{heading.emphasis}</span>
        </h2>
        <p data-words className="w-[640px] text-[18px]/[1.6] text-clay">
          {lead}
        </p>
        {cta.href !== null && (
          <IndianLink tone="light" size="sm" href={cta.href}>
            {cta.label}
          </IndianLink>
        )}
      </div>
      {/* The coverflow rises into place with the scroll (ui/TextMotion, data-rise, measured on this wrapper). */}
      <div className="mt-14">
        <div data-rise>
          <EducatorFlow educators={educators} />
        </div>
      </div>
    </section>
  );
}

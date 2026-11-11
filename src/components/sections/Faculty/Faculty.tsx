import IndianLink from "@/components/ui/IndianLink";
import { educators, facultyIntro } from "@/data/faculty";
import EducatorFlow from "./EducatorFlow";

/**
 * Meet our educators (IA 7; Figma "06 · Meet Our Educators", 2377:4795): a cream band (the journey's).
 * The centred heading, its second beat in burnt orange (Mukta has no italics), and the lead; under them
 * the educators on a circular carousel, a ring of bent portrait cards, with the educator at the front
 * introduced right under it (EducatorFlow, ui/CircularCarousel).
 *
 * "Meet our faculty" goes under the lead once the faculty page exists (links.faculty is null today):
 * until then a button that goes nowhere would only be a false promise, and the carousel right below
 * already does what it invites.
 *
 * Motion (ui/TextMotion): the heading's letters rise in quickly (data-split); the lead is simply there; the
 * carousel rises into place
 * once as it comes into view (data-rise, a 560ms rise), and its ring turns in once it is in view.
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
      {/* The carousel rises into place once as it comes into view (ui/TextMotion, data-rise). */}
      <div className="mt-14">
        <div data-rise>
          <EducatorFlow educators={educators} />
        </div>
      </div>
    </section>
  );
}

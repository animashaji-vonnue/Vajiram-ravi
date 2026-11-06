import NoteCard from "@/components/ui/NoteCard";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { batchesCopy } from "@/data/admissions";
import { contact } from "@/data/site";
import AdmissionsBoard from "./AdmissionsBoard";

/**
 * Admissions (Figma "Batches", 2257:9039): a white band framed by a double rule with diamonds at its
 * corners (DoubleRuleFrame). The heading row, then the mode and month tabs with the round arrows, the railway-ticket track of
 * the next batches, and "View all batches". The postcard form that "Register now" opens is the next
 * section (TalkToUs).
 */
export default function Admissions() {
  return (
    <section id="batches" aria-labelledby="batches-h" className="relative bg-white">
      <div className="relative mx-auto flex w-canvas flex-col items-start gap-12 px-20 pt-24 pb-16">
        <DoubleRuleFrame />

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col items-start gap-4">
            <EyebrowLeft>{batchesCopy.eyebrow}</EyebrowLeft>
            <h2 id="batches-h" data-reveal="heading" className="w-[760px] font-serif text-[60px]/[1.04] font-normal tracking-[-0.9px] text-[#161412]">
              {batchesCopy.heading}
            </h2>
          </div>
          {/*
           * The intro on the note card of the toppers band (ui/NoteCard). The card is taller than the
           * heading column, so it stands on the row's foot and rises into the band's top padding: the row
           * keeps its height and the board stays inside the double-rule frame, which is drawn to size.
           */}
          <div className="relative w-[372px] shrink-0 self-stretch">
            <div data-reveal="sub" className="absolute right-0 bottom-0">
              <NoteCard>
                <p className="text-[16px]/[1.55] text-[#6b6560]">
                  {batchesCopy.introBefore}{" "}
                  <a
                    href={contact.phoneHref}
                    className="underline-offset-[3px] [transition:color_var(--dur-fast)_var(--ease-out)] hover:text-ink hover:underline"
                  >
                    {contact.phone}
                  </a>{" "}
                  {batchesCopy.introAfter}
                </p>
              </NoteCard>
            </div>
          </div>
        </div>

        <AdmissionsBoard />
      </div>
    </section>
  );
}

/** The frame's four corner diamonds, 18px, at the corners of its box. */
const CORNERS = ["top-0 left-0", "bottom-[0.6px] left-0", "top-0 right-[0.6px]", "right-[0.6px] bottom-[0.6px]"];

/**
 * The band's frame, as drawn (Figma's 1410.6 × 873.6 drawing): a 1.2px maroon rule, a hairline 5px inside
 * it, and a diamond at each corner. Built from boxes rather than the drawing itself, so it fits the band
 * whatever its height: it keeps 14px from the band's top and foot, as at its drawn size. The hairline is a
 * 1px rule at 60%, which reads as the drawing's 0.6px stroke.
 */
function DoubleRuleFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute top-3.5 right-[13.4px] bottom-3.5 left-4">
      <span className="absolute top-[8.4px] right-0 bottom-0 left-[9.4px] border-[1.2px] border-[#7a1f12]" />
      <span className="absolute top-[13.7px] right-[6.3px] bottom-[6.3px] left-[14.7px] border border-[#7a1f12]/60" />
      {CORNERS.map((corner) => (
        <svg key={corner} viewBox="0 0 18 18" width={18} height={18} className={`absolute ${corner}`}>
          <path d="M9 0L18 9L9 18L0 9Z" fill="#7a1f12" />
        </svg>
      ))}
    </div>
  );
}

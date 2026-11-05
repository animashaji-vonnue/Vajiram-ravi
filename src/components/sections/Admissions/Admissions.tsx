import { EyebrowLeft } from "@/components/ui/Ornament";
import { batchesCopy } from "@/data/admissions";
import { contact } from "@/data/site";
import AdmissionsBoard from "./AdmissionsBoard";

/**
 * Admissions (Figma "Batches", 2257:9039): a white band framed by a double rule with diamonds at its
 * corners. The heading row, then the mode and month tabs with the round arrows, the railway-ticket track of
 * the next batches, and "View all batches". The postcard form that "Register now" opens is the next
 * section (TalkToUs).
 */
export default function Admissions() {
  return (
    <section id="batches" aria-labelledby="batches-h" className="relative bg-white">
      <div className="relative mx-auto flex w-canvas flex-col items-start gap-12 px-20 pt-24 pb-30">
        <img
          src="/images/admissions/frame-double-rule.svg"
          alt=""
          aria-hidden="true"
          width={1410.6}
          height={873.6}
          className="pointer-events-none absolute top-3.5 left-4 max-w-none"
        />

        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col items-start gap-4">
            <EyebrowLeft>{batchesCopy.eyebrow}</EyebrowLeft>
            <h2 id="batches-h" data-reveal="heading" className="w-[760px] font-serif text-[60px]/[1.04] font-normal tracking-[-0.9px] text-[#161412]">
              {batchesCopy.heading}
            </h2>
          </div>
          <div className="w-[406px] shrink-0">
            <p data-reveal="sub" className="w-[420px] text-[16px]/[1.55] text-[#6b6560]">
              {batchesCopy.introBefore}{" "}
              <a
                href={contact.phoneHref}
                className="underline-offset-[3px] [transition:color_var(--dur-fast)_var(--ease-out)] hover:text-ink hover:underline"
              >
                {contact.phone}
              </a>{" "}
              {batchesCopy.introAfter}
            </p>
          </div>
        </div>

        <AdmissionsBoard />
      </div>
    </section>
  );
}

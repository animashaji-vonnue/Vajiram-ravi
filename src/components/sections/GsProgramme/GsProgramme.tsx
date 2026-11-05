import CountUp from "@/components/ui/CountUp";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { flagship } from "@/data/flagship";
import EnrolButton from "./EnrolButton";
import KonarkWheel from "./KonarkWheel";

const formatMarks = (marks: number) => marks.toLocaleString("en-IN");

/**
 * Flagship GS Prelims & Mains Programme (final design "08 · Flagship GS · Konark sun wheel", 2257:8985),
 * 1440 × 620: an orange-to-maroon band with the slowly turning Konark wheel and its saffron ring at the
 * right, and at the left (80 in, 96 down, 640 wide) the eyebrow, the heading with its italic emphasis, the
 * text, two score boxes whose figures count up when the band comes into view, and the enrol button.
 */
export default function GsProgramme() {
  return (
    <section
      id="gs-programme"
      aria-labelledby="gs-programme-h"
      className="relative isolate overflow-clip bg-[linear-gradient(156.72deg,#ec5800_14.286%,#6e1e14_85.714%)]"
    >
      <div className="relative mx-auto h-[620px] w-canvas">
        <KonarkWheel />
        <img
          src="/images/gs-programme/wheel-ring.svg"
          alt=""
          aria-hidden="true"
          width={780}
          height={780}
          className="pointer-events-none absolute top-[-80px] left-[750px] size-[780px] max-w-none"
        />

        <div className="relative ml-20 flex w-[640px] flex-col items-start gap-[22px] pt-24">
          <div className="flex w-full flex-col items-start gap-3">
            {/* Drawn in the eyebrow's default orange, which all but vanishes on this band: saffron here, like the score labels. */}
            <EyebrowLeft labelClassName="text-saffron">{flagship.eyebrow}</EyebrowLeft>
            <h2 id="gs-programme-h" data-reveal="heading" className="w-[640px] text-[48px]/[1.08] font-bold tracking-[-1.2px] text-white">
              {flagship.title.lead}{" "}
              <em data-reveal-em className="font-serif text-[52px]/[1.08] font-normal tracking-[-0.78px] text-saffron italic">
                {flagship.title.em}
              </em>
            </h2>
            <p data-reveal="sub" className="w-[600px] text-[16px]/[1.55] text-white/88">
              {flagship.body}
            </p>
          </div>

          <div data-reveal-group className="flex items-start gap-4">
            {flagship.scores.map((score) => (
              <div
                key={score.stage}
                data-count-scope
                className="flex flex-col items-start gap-1 rounded-[14px] border border-white/25 bg-white/12 px-[19px] py-[15px] whitespace-nowrap"
              >
                <p className="text-[36px]/[normal] font-bold tracking-[-0.72px] text-white">
                  <CountUp value={`${formatMarks(score.gsMarks)}/${formatMarks(score.totalMarks)}`} />
                </p>
                <p data-count-label className="text-[11px]/[normal] font-bold tracking-[1.1px] text-saffron uppercase">
                  {score.stage} · {flagship.scoreCaption}
                </p>
              </div>
            ))}
          </div>

          <div data-reveal>
            <EnrolButton label={flagship.cta.label} programme={flagship.cta.enquiry} />
          </div>
        </div>
      </div>
    </section>
  );
}

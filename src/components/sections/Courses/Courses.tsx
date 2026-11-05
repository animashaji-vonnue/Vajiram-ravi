import Cta from "@/components/ui/Cta";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { coursesIntro, counsellingLine } from "@/data/programme-bento";
import ProgrammeGrid from "./ProgrammeGrid";

/** The corner diamonds of the frame that the rules drawing does not include (it holds the top-left one). */
const DIAMONDS = ["top-[11px] left-[1411px]", "top-[875px] left-[1411px]", "top-[875px] left-[11px]"];

/**
 * "Featured UPSC CSE programmes" (final design "07 · Programmes", 2257:8844), 1440 × 910 on cream: a
 * double rule with corner diamonds framing the band, the left-aligned heading with the stage tabs at its
 * right, the 4 × 2 grid of programme cards (see ProgrammeGrid), and a line pointing to a counsellor with
 * two buttons. Padding 96 / 80; 36px between the heading row, the grid and the button row.
 */
export default function Courses() {
  return (
    <section id="courses" aria-labelledby="courses-h" className="bg-cream">
      <div className="relative mx-auto flex w-canvas flex-col items-start gap-9 px-20 py-24">
        {/* The frame: decoration, placed on the 1440 canvas as drawn. */}
        <img
          src="/images/courses/frame-rules.svg"
          alt=""
          aria-hidden="true"
          width={1410.6}
          height={873.6}
          className="pointer-events-none absolute top-[11px] left-[11px] h-[873.6px] w-[1410.6px] max-w-none"
        />
        {DIAMONDS.map((position) => (
          <img
            key={position}
            src="/images/courses/frame-diamond.svg"
            alt=""
            aria-hidden="true"
            width={18}
            height={18}
            className={`pointer-events-none absolute size-[18px] ${position}`}
          />
        ))}

        <ProgrammeGrid
          intro={
            <div className="relative flex flex-col items-start gap-3">
              <EyebrowLeft>{coursesIntro.eyebrow}</EyebrowLeft>
              <h2 id="courses-h" data-reveal="heading" className="text-[48px]/[1.08] font-bold tracking-[-1.2px] whitespace-nowrap text-ink">
                {coursesIntro.title.lead}{" "}
                <em data-reveal-em className="font-serif text-[52px]/[1.08] font-normal text-burnt italic">
                  {coursesIntro.title.em}
                </em>
              </h2>
              <p data-reveal="sub" className="w-[620px] text-[16px]/[1.55] text-[#7a6a5c]">
                {coursesIntro.lead}
              </p>
            </div>
          }
        />

        <div data-reveal className="relative flex w-full items-center justify-center gap-3">
          <p className="text-[15px]/[normal] whitespace-nowrap text-[#7a6a5c]">{counsellingLine.text}</p>
          <Cta variant="primary" size="md" href={counsellingLine.cta.href}>
            {counsellingLine.cta.label}
          </Cta>
          <Cta variant="secondary" size="md" href={counsellingLine.viewAll.href}>
            {counsellingLine.viewAll.label}
          </Cta>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { Button } from "@/components/ui/Buttons";
import Photo from "@/components/ui/Photo";
import { whyChoose } from "@/data/home";
import Clipboard from "./Clipboard";
import DrawnArrow from "./DrawnArrow";

function Star() {
  return <Image src="/images/why/star.svg" alt="" width={52} height={52} className="shrink-0" />;
}

/**
 * "Why choose Vajiram & Ravi", after the design's section (3774:402), on a clipboard: on its sheet, the
 * three-line heading between two sky-blue stars, the intro and a two-line recap between thin side rules,
 * and the video photo with its "Click to watch the video" button. A red crayon arrow at the left of the sheet,
 * drawn in as it scrolls into view, curls down to the video button. The clipboard fades up as it scrolls in.
 */
export default function WhyChoose() {
  return (
    <section aria-labelledby="why-title" className="mx-auto w-canvas px-10 pt-32">
      <Clipboard>
        <div data-reveal className="relative flex flex-col items-center gap-14 px-10 pt-20 pb-10">
          {/* Crayon on the paper, so it takes the paper's tone rather than sitting on top of it. */}
          <DrawnArrow className="pointer-events-none absolute top-[352px] left-8 w-[160px] mix-blend-multiply" />
          <div className="flex items-start justify-center gap-12">
            <Star />
            <h2
              id="why-title"
              className="flex flex-col items-center font-display text-[48px]/[56px] font-medium tracking-[-0.96px] text-neutral-900"
            >
              <span className="text-amber">{whyChoose.eyebrow}</span>
              <span>{whyChoose.heading}</span>
              <span className="text-neutral-400">
                {whyChoose.ending}
                <span className="text-amber">.</span>
              </span>
            </h2>
            <Star />
          </div>

          <div className="flex w-[840px] flex-col items-center gap-6 border-x border-neutral-200 px-10 text-center font-sans text-[16px]/[24px] font-medium">
            <p className="text-neutral-500">{whyChoose.intro}</p>
            <p className="flex flex-col">
              <span className="text-neutral-900">{whyChoose.recap[0]}</span>
              <span className="text-amber">{whyChoose.recap[1]}</span>
            </p>
          </div>

          <div className="relative w-[1198px] shrink-0">
            <Photo
              src={whyChoose.video.photo}
              alt="Four civil servants in conversation outside a ministry building."
              sizes="1198px"
              className="relative aspect-[1198/674] w-full overflow-hidden rounded-[24px]"
            />
            <Button href={whyChoose.video.href} tone="secondary" icon="play" className="absolute top-8 left-8">
              {whyChoose.video.label}
            </Button>
          </div>
        </div>
      </Clipboard>
    </section>
  );
}

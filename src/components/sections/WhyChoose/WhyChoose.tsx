import Image from "next/image";
import { Button } from "@/components/ui/Buttons";
import { whyChoose } from "@/data/home";

/**
 * "Why choose Vajiram & Ravi", after the design's section 3575:1701: a three-line heading between two
 * stars, a short paragraph between two thin rules, and a photo card with a "watch the video" button.
 * The video isn't ready yet, so the button points nowhere for now ("#").
 */
export default function WhyChoose() {
  return (
    <section className="bg-white" aria-labelledby="why-title">
      <div className="mx-auto flex w-canvas flex-col items-center gap-14 px-10 pt-24 pb-20">
        <div className="flex items-start justify-center gap-12">
          <Image src="/images/why/star.svg" alt="" width={52} height={52} />
          <h2
            id="why-title"
            className="text-center font-display text-[48px]/[56px] font-medium tracking-[-0.96px] text-neutral-900"
          >
            <span className="block text-amber">{whyChoose.eyebrow}</span>
            <span className="block">{whyChoose.heading}</span>
            <span className="block text-neutral-400">
              {whyChoose.ending}
              <span className="text-amber">.</span>
            </span>
          </h2>
          <Image src="/images/why/star.svg" alt="" width={52} height={52} />
        </div>

        <div className="flex w-[840px] flex-col items-center gap-6 border-x border-neutral-200 px-10 text-center font-sans text-[16px]/[24px] font-medium">
          <p className="text-neutral-500">{whyChoose.intro}</p>
          <p className="text-neutral-900">
            <span className="block">{whyChoose.recap[0]}</span>
            <span className="block text-amber">{whyChoose.recap[1]}</span>
          </p>
        </div>

        {/* As wide as the success stories card (40px in from each side of the canvas), at the design's 1198 × 674 shape. */}
        <div className="relative flex aspect-[1198/674] w-full flex-col items-start overflow-hidden rounded-[24px] p-8">
          <Image src="/images/why/video-card.jpg" alt="" fill sizes="1360px" className="object-cover" />
          <Button
            href={whyChoose.video.href}
            tone="secondary"
            className="relative"
            icon={<Image src="/images/why/play.svg" alt="" width={20} height={20} />}
          >
            {whyChoose.video.label}
          </Button>
        </div>
      </div>
    </section>
  );
}

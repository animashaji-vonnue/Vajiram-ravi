import Image from "next/image";
import { Button } from "@/components/ui/Buttons";
import { practice } from "@/data/home";
import TornStrip, { PIN_HOLE, STRIP } from "./TornStrip";

/**
 * The practice banner, with its content from the design's matchbox banner (3722:42634) but in the paper
 * style of the reference: a strip of old paper torn from a sheet (TornStrip), pinned up with the red glass
 * pushpin from the reference photo, holding the heading, the line under it and the button. Two halftone
 * megaphone stickers call out to it from either side, stuck half over the paper's ends.
 */
export default function PracticeBanner() {
  return (
    <section aria-labelledby="practice-title" className="mx-auto w-canvas px-10 py-32">
      <div data-reveal className="relative mx-auto" style={{ width: STRIP.width, height: STRIP.height }}>
        <TornStrip className="absolute inset-0 [filter:drop-shadow(0_1px_1px_rgb(60_40_20/0.3))_drop-shadow(0_12px_18px_rgb(60_40_20/0.18))]" />
        <div className="relative flex h-full flex-col items-center justify-center gap-3 px-40 pt-6 text-center">
          <h2
            id="practice-title"
            className="font-noto-serif text-[40px]/[50px] font-bold tracking-[-0.6px] text-neutral-900"
          >
            {practice.heading}
          </h2>
          <p className="font-sans text-[18px]/[26px] font-medium text-neutral-700">{practice.intro}</p>
          <Button href={practice.cta.href} className="mt-6">
            {practice.cta.label}
          </Button>
        </div>
        {/* The pin's needle tip (12%, 94% of the image) lands on the hole drawn in the paper. */}
        <Image
          src="/images/practice/pushpin.webp"
          alt=""
          width={300}
          height={320}
          className="pointer-events-none absolute w-[112px] [filter:drop-shadow(5px_7px_3px_rgb(50_20_10/0.3))_drop-shadow(12px_16px_10px_rgb(50_20_10/0.18))]"
          style={{ left: PIN_HOLE.x - 112 * 0.12, top: PIN_HOLE.y - 119.5 * 0.94 }}
        />
        <Image
          src="/images/practice/megaphone-left.webp"
          alt=""
          width={736}
          height={736}
          className="pointer-events-none absolute top-1/2 -left-32 w-[270px] -translate-y-1/2 rotate-[-6deg] drop-shadow-[0_6px_8px_rgb(40_25_10/0.25)]"
        />
        <Image
          src="/images/practice/megaphone-right.webp"
          alt=""
          width={503}
          height={454}
          className="pointer-events-none absolute top-1/2 -right-28 w-[240px] -translate-y-1/2 rotate-[8deg] drop-shadow-[0_6px_8px_rgb(40_25_10/0.25)]"
        />
      </div>
    </section>
  );
}

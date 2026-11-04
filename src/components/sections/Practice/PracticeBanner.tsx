import Image from "next/image";
import { Button } from "@/components/ui/Buttons";
import { practice } from "@/data/home";

/**
 * The free answer-writing banner, after the design's matchbox label (3722:42634): a yellow cartouche with lotus
 * corners on a blue field inside a thin navy rule, holding a bold headline, a line of detail and a button.
 * Drawn 1440 × 400; here it's a card inset 40px from each side of the canvas, so the art is shrunk to keep its
 * shape. The type keeps its design sizes.
 */
export default function PracticeBanner() {
  return (
    <section className="bg-white" aria-labelledby="practice-title">
      <div className="mx-auto w-canvas px-10 py-24">
        <div className="relative flex aspect-[1440/400] flex-col items-center justify-center bg-blue-500 text-center">
          <span aria-hidden="true" className="absolute inset-3 border-[1.5px] border-blue-950" />
          <Image
            src="/images/practice/matchbox.svg"
            alt=""
            width={1440}
            height={400}
            className="pointer-events-none absolute inset-0 size-full max-w-none"
          />
          <div className="relative flex flex-col items-center gap-2">
            <h2
              id="practice-title"
              className="font-display text-[48px]/[56px] font-bold tracking-[-0.24px] text-blue-950"
            >
              {practice.heading}
            </h2>
            <p className="font-sans text-[18px]/[26px] font-medium text-blue-900">{practice.text}</p>
            <Button href={practice.cta.href} className="mt-5">
              {practice.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

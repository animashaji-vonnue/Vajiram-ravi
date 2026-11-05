import Image from "next/image";
import { Button } from "@/components/ui/Buttons";
import { ctaBanner } from "@/data/home";
import { cx } from "@/lib/cx";
import SplitHeading from "@/components/ui/SplitHeading";

/**
 * A kangura edge, the stepped battlement of Mughal walls, as a repeating 24px tile: the teeth hang from the
 * top of the band (or rise from its foot, `flip`) in the page's colour, so they follow it as it fades.
 */
function Kangura({ flip = false }: { flip?: boolean }) {
  const tile = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='12'><path d='M0 0H24V2H20V6H16V12H8V6H4V2H0Z'/></svg>`,
  )}")`;
  return (
    <span
      aria-hidden="true"
      className={cx("absolute inset-x-0 h-3 bg-(--page)", flip ? "bottom-0 -scale-y-100" : "top-0")}
      style={{ maskImage: tile, maskRepeat: "repeat-x", maskPosition: "center top" }}
    />
  );
}

/** The ornament either side of the eyebrow: a short rule, a small diamond, then a longer rule to the label. */
function Flourish({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <span aria-hidden="true" className={cx("flex items-center gap-2", mirrored && "-scale-x-100")}>
      <span className="h-px w-8 bg-brand-200/60" />
      <span className="size-1.5 rotate-45 bg-brand-300" />
      <span className="h-px w-14 bg-brand-200/60" />
    </span>
  );
}

/**
 * The closing call to action, after the design's CTA banner (3831:253), set in the site's type: Mughal arches
 * at sunrise under a deep brown wash, a kangura edge top and bottom, and centred on it the eyebrow between
 * diamond flourishes, the heading in the headline serif, a line in Noto Serif, the two buttons and the
 * phone number.
 */
export default function CtaBanner() {
  return (
    <section aria-labelledby="cta-title" className="relative isolate mt-24 overflow-hidden py-36 text-white">
      <Image src={ctaBanner.photo} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[rgb(43_15_5/0.62)]" />
      <Kangura />
      <Kangura flip />

      <div className="mx-auto flex w-canvas flex-col items-center px-10 text-center">
        <p className="flex items-center gap-4 font-noto-serif text-[16px]/[24px] font-bold tracking-[0.12em] text-brand-200 uppercase">
          <Flourish />
          {ctaBanner.eyebrow}
          <Flourish mirrored />
        </p>
        <h2
          data-split
          id="cta-title"
          className="mt-6 w-[900px] font-serif text-h2 font-normal [font-variation-settings:'SOFT'_0,'WONK'_0]"
        >
          <SplitHeading text={ctaBanner.heading} />
        </h2>
        <p className="mt-6 w-[600px] font-noto-serif text-[19px]/[30px] text-brand-100">{ctaBanner.intro}</p>
        <div className="mt-10 flex gap-4">
          <Button href={ctaBanner.primary.href}>{ctaBanner.primary.label}</Button>
          <Button href={ctaBanner.secondary.href} tone="secondary">
            {ctaBanner.secondary.label}
          </Button>
        </div>
        <p className="mt-6 font-noto-serif text-[15px]/[22px] text-brand-200">
          Prefer to call?{" "}
          <a href={ctaBanner.phone.href} className="font-semibold underline-offset-4 hover:underline">
            {ctaBanner.phone.label}
          </a>
          <span aria-hidden="true" className="mx-2">
            ·
          </span>
          {ctaBanner.hours}
        </p>
      </div>
    </section>
  );
}

import type { CSSProperties } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Buttons";
import { Eyebrow } from "@/components/ui/Typography";
import { gsProgramme } from "@/data/home";

/**
 * The four Recitals covers in the card's corners, from the design (3585:42707). `box` places the area the
 * tilted cover fills, measured from the corners of the 1392px design card (the card here is 1360); the 180 × 238 cover is centred in it at `tilt` degrees. While the
 * page is open each cover drifts (`lift` px up and `drift` px across) and sways `sway` degrees, over
 * `seconds`, starting `delay` seconds in, so the four never move together.
 */
const COVERS = [
  { src: "/images/gs/recitals-july.jpg", box: { left: 38.63, top: 64, width: 222.105, height: 267.973 }, tilt: 11, sway: 3, lift: -14, drift: 6, seconds: 7, delay: 0 },
  { src: "/images/gs/recitals-june.jpg", box: { right: 83.86, top: 88.31, width: 200.058, height: 252.782 }, tilt: -5, sway: -3, lift: -12, drift: -6, seconds: 8, delay: -2.5 },
  { src: "/images/gs/recitals-may.jpg", box: { left: 104.04, bottom: 92.43, width: 196.164, height: 249.976 }, tilt: -4, sway: 3, lift: -10, drift: 5, seconds: 9, delay: -4 },
  { src: "/images/gs/recitals-april.jpg", box: { right: 109.27, bottom: 42.62, width: 232.231, height: 274.476 }, tilt: 14, sway: -3, lift: -16, drift: -7, seconds: 7.5, delay: -1.2 },
];

/** An ornamental rule: an orange line tapering to a small star in the middle (design 3588:2098). */
function Rule() {
  return (
    <Image
      src="/images/gs/rule.svg"
      alt=""
      width={573.988}
      height={5.927}
      className="h-[5.927px] w-[573.988px] max-w-none"
    />
  );
}

/**
 * "Our flagship programme", after the design's section 3575:2050: a cream card with a centred heading,
 * a short description, the marks General Studies carries between two ornamental rules, and one call to
 * action, with the four latest Recitals covers floating in its corners.
 */
export default function GsProgramme() {
  return (
    <section className="bg-white" aria-labelledby="gs-title">
      <div className="mx-auto w-canvas px-10 py-24">
        {/* Cream with a tone-on-tone diamond checker (design 3704:42385), tiled from one diamond so it fits any width. */}
        <div className="relative flex flex-col items-center overflow-hidden rounded-[24px] bg-cream bg-[url(/images/gs/diamond-tile.svg)] bg-size-[99.3103px_94.1244px] px-10 pt-[120px] pb-[112px]">
          {COVERS.map((cover) => (
            <div
              key={cover.src}
              aria-hidden="true"
              className="pointer-events-none absolute flex items-center justify-center"
              style={cover.box}
            >
              <div
                className="relative h-[238px] w-[180px] rounded-[4px] shadow-[0_18px_32px_rgba(66,18,5,0.18)]"
                style={
                  {
                    "--tilt": `${cover.tilt}deg`,
                    "--sway": `${cover.sway}deg`,
                    "--lift": `${cover.lift}px`,
                    "--drift": `${cover.drift}px`,
                    rotate: "var(--tilt)",
                    animation: `float-cover ${cover.seconds}s ease-in-out ${cover.delay}s infinite`,
                  } as CSSProperties
                }
              >
                <Image src={cover.src} alt="" fill sizes="180px" className="rounded-[4px] object-cover" />
              </div>
            </div>
          ))}

          <div className="relative flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-5">
              <Eyebrow tone="maroon" tagged tag="crest">
                {gsProgramme.eyebrow}
              </Eyebrow>
              <h2
                id="gs-title"
                className="text-center font-display text-[88px]/[92px] font-medium tracking-[-2.64px] whitespace-nowrap text-brand-950"
              >
                {gsProgramme.heading.map((line, i) => (
                  <span key={line} className={i === gsProgramme.heading.length - 1 ? "block text-amber" : "block"}>
                    {line}
                  </span>
                ))}
              </h2>
            </div>
            <p className="w-[620px] text-center font-sans text-[18px]/[28px] font-medium text-neutral-600">
              {gsProgramme.intro}
            </p>
            {/* The marks between two ornamental rules, which are wider than the 448px block and run past it. */}
            <div className="flex w-[448px] flex-col items-center gap-5">
              <Rule />
              <div className="flex w-full flex-col items-center gap-1.5 text-center">
                {/* The dot sits exactly on the centre line, under the rules' stars; the two marks are set out
                    from it, one to each side. */}
                <p className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3.5 font-display text-[18px]/[24px] font-semibold whitespace-nowrap text-neutral-900">
                  <span className="justify-self-end">
                    <span className="text-amber">{gsProgramme.marks.prelims}</span> Prelims
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="justify-self-start">
                    <span className="text-amber">{gsProgramme.marks.mains}</span> Mains
                  </span>
                </p>
                <p className="font-sans text-[14px]/[20px] font-medium whitespace-nowrap text-neutral-500">
                  {gsProgramme.marks.caption}
                </p>
              </div>
              <Rule />
            </div>
            <Button href={gsProgramme.primary.href}>{gsProgramme.primary.label}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

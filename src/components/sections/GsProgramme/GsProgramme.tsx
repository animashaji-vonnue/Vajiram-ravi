import Image from "next/image";
import { gsProgramme } from "@/data/home";
import RiseOnEnter from "@/components/ui/RiseOnEnter";
import SplitHeading from "@/components/ui/SplitHeading";

/**
 * The rule above and below the marks, from the design (3588:2108): two tapering strokes meeting at a small star,
 * used as a mask so it prints in the section's dark brown.
 */
function Rule() {
  return (
    <span
      aria-hidden="true"
      className="block h-1.5 w-full bg-brown-950"
      style={{ maskImage: "url(/images/gs/rule.svg)", maskSize: "100% 100%" }}
    />
  );
}

/**
 * The photo's frame, after the brief's: a 512 × 880 panel whose middle runs the full width while its top and
 * bottom narrow to round arches, with a small curve easing each shoulder into the arch.
 */
const FRAME =
  "M0 140L60 140Q80 140 82 124A184 184 0 0 1 430 124Q432 140 452 140L512 140L512 740L452 740Q432 740 430 756A184 184 0 0 1 82 756Q80 740 60 740L0 740Z";

/** The ornament after the eyebrow, as on the site's other eyebrows: a short rule, a small diamond, then a longer rule. */
function Flourish() {
  return (
    <span aria-hidden="true" className="flex items-center gap-2">
      <span className="h-px w-10 bg-brown-950/45" />
      <span className="size-1.5 rotate-45 bg-brown-950" />
      <span className="h-px w-16 bg-brown-950/45" />
    </span>
  );
}

/**
 * One star of the motif over the eyebrow: a slim four-pointed star with an outlined round petal in each angle
 * between its points, in a gold gradient. `id` names the gradient, which each star needs its own of.
 */
function Star({ id, size }: { id: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e2b766" />
          <stop offset="0.55" stopColor="#c08540" />
          <stop offset="1" stopColor="#8f5b25" />
        </linearGradient>
      </defs>
      {[45, 135, 225, 315].map((angle) => (
        <ellipse
          key={angle}
          cx="20"
          cy="11.5"
          rx="4.6"
          ry="7"
          transform={`rotate(${angle} 20 20)`}
          stroke={`url(#${id})`}
          strokeWidth="1.6"
        />
      ))}
      <path d="M20 0L22.6 17.4L40 20L22.6 22.6L20 40L17.4 22.6L0 20L17.4 17.4Z" fill={`url(#${id})`} />
    </svg>
  );
}

/** The motif over the eyebrow: three gold stars, the middle one larger. */
function Motif() {
  return (
    <span aria-hidden="true" className="flex items-center gap-7">
      <Star id="gs-star-left" size={34} />
      <Star id="gs-star-middle" size={56} />
      <Star id="gs-star-right" size={34} />
    </span>
  );
}

/**
 * The GS programme, with the content of the design's section (3842:323) in the layout of the brief's sketch: on
 * light orange over a faint classroom photo, two columns. On the left the text (a motif of three gold stars, the
 * eyebrow, the heading, a lead line, the paragraph, the marks GS carries between two rules) with
 * Parliament House in line art under it; on the right a photo of two students in an arched frame.
 * As it comes onto the screen it rises into place and opens out to its full size (RiseOnEnter).
 */
export default function GsProgramme() {
  return (
    <section
      aria-labelledby="gs-title"
      className="relative isolate mt-24 overflow-hidden bg-[#ffd3a3] py-32 text-brown-950"
    >
      <RiseOnEnter />
      <Image
        src={gsProgramme.backdrop}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-[0.06] mix-blend-multiply"
      />
      <div className="mx-auto grid w-[1180px] grid-cols-[620px_1fr] gap-12">
        <div className="flex flex-col">
          <Motif />
          <p className="mt-6 flex items-center gap-4 font-noto-serif text-[16px]/[24px] font-bold tracking-[0.12em] text-brown-950 uppercase">
            {gsProgramme.eyebrow}
            <Flourish />
          </p>
          <h2
            data-split
            id="gs-title"
            className="mt-4 font-serif text-[50px]/[1.08] font-normal tracking-[-0.02em] [font-variation-settings:'SOFT'_0,'WONK'_0]"
          >
            <SplitHeading text={gsProgramme.heading} />
          </h2>
          <p className="mt-6 font-noto-serif text-[19px]/[31px] text-brown-950">{gsProgramme.lead}</p>
          <p className="mt-4 font-noto-serif text-[17px]/[28px] text-brown-950/85">{gsProgramme.body}</p>

          {/* The marks GS carries, between two rules, as in the design (3588:2108). */}
          <div className="mt-9 flex w-[574px] flex-col items-center gap-5 text-center">
            <Rule />
            <div className="flex flex-col items-center gap-1.5">
              <p className="font-noto-serif text-[18px]/[28px] font-semibold whitespace-pre">
                {gsProgramme.marks.list.map((mark, i) => (
                  <span key={mark.label}>
                    {i > 0 && "   ·   "}
                    <span className="font-serif text-[24px] font-normal tracking-[-0.01em] [font-variation-settings:'SOFT'_0,'WONK'_0]">
                      {mark.value}
                    </span>{" "}
                    {mark.label}
                  </span>
                ))}
              </p>
              <p className="font-noto-serif text-[15px]/[22px] text-brown-950/75">{gsProgramme.marks.caption}</p>
            </div>
            <Rule />
          </div>

          {/* The drawing's white paper drops out against the orange. */}
          <Image
            src={gsProgramme.illustration}
            alt=""
            width={2000}
            height={1131}
            sizes="620px"
            className="mt-8 h-[260px] w-full object-cover object-[center_55%] mix-blend-multiply"
          />
        </div>

        <div className="self-center drop-shadow-[0_24px_24px_rgb(40_20_10/0.3)]">
          <div className="relative h-[880px] w-[512px]" style={{ clipPath: `path("${FRAME}")` }}>
            <Image
              src={gsProgramme.photo.src}
              alt={gsProgramme.photo.alt}
              fill
              sizes="520px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

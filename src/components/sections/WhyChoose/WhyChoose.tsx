import Image from "next/image";
import type { CSSProperties } from "react";
import { whyChoose } from "@/data/home";
import CardOnScroll from "@/components/ui/CardOnScroll";
import { Lozenge, TitleRule } from "@/components/ui/Ornaments";
import PageFade from "@/components/ui/PageFade";
import SplitHeading from "@/components/ui/SplitHeading";

/** Noise as a CSS background: `freq` sets its grain (two numbers stretch it), `opacity` its strength, `size` its tile. */
const noise = (freq: string, opacity: number, octaves: number, size: number) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${opacity}'/%3E%3C/svg%3E")`;

/**
 * Old paper, as on kardo.co's Daftar pages, in the brief's peach (#FFE5B4): long, faint vertical fibres, soft
 * cloudy unevenness and a fine grain. Drawn in code.
 */
const PAPER: CSSProperties = {
  backgroundColor: "#ffe5b4",
  backgroundImage: [noise(".9", 0.08, 2, 240), noise(".08 .004", 0.12, 3, 600), noise(".003 .006", 0.1, 4, 1000)].join(
    ", ",
  ),
  backgroundBlendMode: "multiply, multiply, multiply",
};

/** The ornaments' colour, the palette's Giants orange (#FE5A1D). */
const BRONZE = "#fe5a1d";

/** A photo in a golden (#F3BB44) mat. */
function FramedPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="bg-[#f3bb44] p-6 shadow-[0_18px_40px_-24px_rgb(60_40_20/0.5)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image src={src} alt={alt} fill sizes="560px" className="object-cover" />
      </div>
    </div>
  );
}

/**
 * "Why choose Vajiram & Ravi", after the Daftar section on kardo.co: on old peach paper, a centred title
 * block (the name between orange double rules with a small lozenge under it, the name in Devanagari, and a
 * wide-spaced caption), then six reasons in pairs: two photos in orange mats, the second overlapping
 * the first's corner, each beside a heading in the headline serif (Fraunces) and a paragraph in Noto Serif.
 * It is a card on the page that opens to the full width as it reaches the top of the window (CardOnScroll), and
 * as it comes up the screen the page around it fades from orange to white (PageFade).
 */
export default function WhyChoose() {
  // The reasons in pairs: each pair is laid out as below, and the pairs follow one another down the page.
  const pairs = [];
  for (let i = 0; i < whyChoose.rows.length; i += 2) pairs.push(whyChoose.rows.slice(i, i + 2));
  return (
    <section
      aria-labelledby="why-title"
      // The card's resting clip, for the first paint before CardOnScroll takes over.
      className="mt-24 text-neutral-900 [clip-path:inset(0_32px_round_24px)]"
      style={PAPER}
    >
      <CardOnScroll />
      <PageFade />
      <div className="mx-auto w-canvas px-10 pt-36 pb-40">
        <header className="flex flex-col items-center text-center">
          <div className="flex w-full items-center gap-6">
            <TitleRule colour={BRONZE} />
            <h2
              data-split
              id="why-title"
              className="shrink-0 font-serif text-[64px]/[1] font-bold tracking-[-0.01em] uppercase [font-variation-settings:'SOFT'_0,'WONK'_0]"
            >
              <SplitHeading text={whyChoose.title} />
            </h2>
            <TitleRule colour={BRONZE} mirrored />
          </div>
          <Lozenge colour={BRONZE} className="mt-4" />
          <p lang="hi" className="mt-6 font-noto-serif text-[40px]/[1.2] font-medium">
            {whyChoose.titleHindi}
          </p>
          <p className="mt-12 font-noto-serif text-[24px]/[32px] tracking-[0.3em] uppercase">{whyChoose.caption}</p>
        </header>

        {/*
          In each pair the photos overlap as on kardo.co: the second sits over the first one's lower right
          corner, with each story beside its photo. Each story leads with its heading; the second is set to the
          right, against its photo.
        */}
        <div className="mx-auto mt-36 flex w-[1180px] flex-col gap-32">
          {pairs.map(([first, second]) => (
            <div key={first.heading}>
              <article className="grid grid-cols-[560px_1fr] items-start gap-[60px]">
                <FramedPhoto src={first.photo} alt={first.alt} />
                <div className="w-[460px] pt-6">
                  <h3 className="font-serif text-h3 font-normal [font-variation-settings:'SOFT'_0,'WONK'_0]">
                    {first.heading}
                  </h3>
                  <p className="mt-6 font-noto-serif text-[18px]/[32px] text-neutral-800">{first.body}</p>
                </div>
              </article>
              {second && (
                <article className="relative -mt-[140px] grid grid-cols-[380px_560px] items-start gap-[60px]">
                  <div className="pt-[230px] text-right">
                    <h3 className="font-serif text-h3 font-normal [font-variation-settings:'SOFT'_0,'WONK'_0]">
                      {second.heading}
                    </h3>
                    <p className="mt-6 font-noto-serif text-[18px]/[32px] text-neutral-800">{second.body}</p>
                  </div>
                  <FramedPhoto src={second.photo} alt={second.alt} />
                </article>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

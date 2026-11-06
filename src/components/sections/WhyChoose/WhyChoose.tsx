import CountUp from "@/components/ui/CountUp";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { closingSkyline } from "@/data/closing-cta";
import { reasons, whyChoose, type Reason } from "@/data/why-choose";
import { cx } from "@/lib/cx";
import ArchPhoto from "./ArchPhoto";
import SutraThread from "./SutraThread";
import Tilt from "./Tilt";

/**
 * "Why Vajiram & Ravi" (Figma "06 · Why Vajiram & Ravi", 2257:8718): a maroon band, 1005px tall on the
 * canvas, textured with temple line art (multiplied at 43%) under a left-to-right darkening. On the left the
 * arched Constitution photo with the orange "50+ years" badge under it; on the right the eyebrow, the
 * heading and lead, and six invitation cards in two columns.
 *
 * Motion spec "04 Why Vajiram & Ravi": the photo wipes up from the bottom (ArchPhoto); the cards rise with
 * the section reveal's stagger while their medallions turn in from -20°. The cards are not links, so they do
 * not lift; a medallion's scallop turns 10° under the pointer as a gentle response.
 *
 * Added motion: a faint saffron thread behind everything draws itself as the band is scrolled through
 * (SutraThread); the arch photo drifts inside its arch as it rises into view (ArchPhoto); each card leans up
 * to 4° toward a mouse pointer (Tilt, on a layer inside the card).
 */
export default function WhyChoose() {
  const { heading, badge, photo } = whyChoose;
  return (
    <section id="why-choose" aria-labelledby="why-h" className="relative isolate overflow-clip bg-[#5a160f]">
      {/* The band blends in sRGB like Figma's gradient. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <img
          src="/images/why-choose/band-texture.webp"
          alt=""
          width={577}
          height={1024}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full max-w-none object-cover opacity-43 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-linear-to-r/srgb from-[#5a160f]/20 to-[#3b2416]/85" />
      </div>

      {/* Over the band's texture, under the photo, the text and the cards. */}
      <SutraThread />

      <div className="relative mx-auto flex min-h-[1005px] w-canvas items-start gap-8 px-20 py-[72px]">
        <ArchPhoto src={photo.src} alt={photo.alt} />

        <div className="flex w-[764px] flex-col gap-7">
          <div className="flex flex-col items-start gap-3">
            <EyebrowLeft>{whyChoose.eyebrow}</EyebrowLeft>
            <h2 id="why-h" data-reveal="heading" className="w-[760px] text-[48px]/[1.08] font-bold tracking-[-1.2px] text-white">
              {heading.lead}{" "}
              <em data-reveal-em className="font-serif text-[52px]/[1.08] font-normal text-saffron italic">
                {heading.emphasis}
              </em>
            </h2>
            <p data-reveal="sub" className="w-[620px] text-[16px]/[1.55] text-white/78">
              {whyChoose.lead}
            </p>
          </div>

          {/* Two columns of 372 × 194 cards, 16px apart across and 10px down. */}
          <ul data-reveal-group className="grid w-[760px] grid-cols-2 gap-x-4 gap-y-2.5">
            {reasons.map((reason, i) => (
              <ReasonCard key={reason.title} reason={reason} number={String(i + 1).padStart(2, "0")} />
            ))}
          </ul>
        </div>

        {/*
          The badge (Figma "badge", 2271:11038): under the photo, 18px down and as wide as it, with a skyline of
          monuments along its foot. The label fades in once the figure lands.
        */}
        <div
          data-reveal="sm"
          data-count-scope
          className="absolute top-[690px] left-20 flex h-[95px] w-[460px] items-center gap-2.5 overflow-clip rounded-[14px] bg-orange px-4 py-3 whitespace-nowrap text-white"
        >
          <BadgeSkyline />
          <CountUp value={badge.figure} className="relative text-[32px]/[normal] font-bold tracking-[-0.64px]" />
          <p data-count-label className="relative text-[17px]/[1.3] font-medium">
            {badge.label[0]}
            <br />
            {badge.label[1]}
          </p>
        </div>
      </div>
    </section>
  );
}

/** The hover change, over --dur-base: the dark look fades in over the cream one, and the text recolours. */
const FADE = "[transition:opacity_var(--dur-base)_var(--ease-out)]";
const SHIFT = "[transition:color_var(--dur-base)_var(--ease-out)]";
/** The dark layer of a pair: unseen at rest, shown while the card is hovered. */
const ON_HOVER = `opacity-0 group-hover/reason:opacity-100 ${FADE}`;

/**
 * One invitation card (Figma "reason – … (invitation card)"): the design's card drawing (scalloped corners,
 * a peak at the top centre and a soft drop shadow) with its inner hairline, a numbered scalloped medallion,
 * the title over a rule-and-diamond divider, and the description.
 *
 * Every card rests cream with an orange medallion. The design's mahogany card with the saffron medallion
 * (drawn as card 01) is the hover state: while the pointer is over a card its dark drawings fade in over
 * the cream ones and the text turns cream, over --dur-base.
 */
function ReasonCard({ reason, number }: { reason: Reason; number: string }) {
  return (
    <li className="group/reason relative h-[194px] w-[372px]">
      {/* The tilt moves this layer only; the card itself keeps ScrollReveal's classes and its place. */}
      <Tilt className="absolute inset-0">
        {(["cream", "dark"] as const).map((art) => (
          <span key={art} aria-hidden="true" className={cx("absolute inset-0", art === "dark" && ON_HOVER)}>
            {/* The drawing includes its shadow, so it spills 22.5px out at the sides and 12.6px above. */}
            <img
              src={`/images/why-choose/card-${art}.svg`}
              alt=""
              width={417}
              height={239.101}
              className="pointer-events-none absolute top-[-12.61px] left-[-22.5px] h-[239.101px] w-[417px] max-w-none"
            />
            <img
              src={`/images/why-choose/inner-border-${art}.svg`}
              alt=""
              width={356.75}
              height={174.625}
              className="pointer-events-none absolute top-[11.75px] left-[7.625px] h-[174.625px] w-[356.75px] max-w-none"
            />
          </span>
        ))}

        {/*
          The medallion turns in from -20° with its card's reveal (ScrollReveal marks the card .rv-pre, then
          .rv-in with its start time in --d); afterwards the scallop turns 10° on hover, the number staying upright.
        */}
        <span
          aria-hidden="true"
          className="absolute top-8 left-6 size-14 [.rv-in_&]:[transition:rotate_var(--dur-slow)_var(--ease-out)_var(--d,0ms)] [.rv-pre_&]:-rotate-20"
        >
          <span className="absolute inset-0 [transition:rotate_var(--dur-fast)_var(--ease-out)] group-hover/reason:rotate-10">
            {(["cream", "dark"] as const).map((art) => (
              <span key={art} className={cx("absolute inset-0", art === "dark" && ON_HOVER)}>
                <img
                  src={`/images/why-choose/medallion-scallop-${art === "dark" ? "saffron" : "orange"}.svg`}
                  alt=""
                  width={56}
                  height={54.8}
                  className="absolute top-[0.6px] left-0 h-[54.8px] w-14 max-w-none"
                />
                <img src={`/images/why-choose/medallion-stitch-${art}.svg`} alt="" width={45} height={45} className="absolute top-[5.5px] left-[5.5px] size-[45px] max-w-none" />
              </span>
            ))}
          </span>
          <span className={cx("absolute inset-0 flex items-center justify-center font-serif text-[24px]/[27px] text-white group-hover/reason:text-mahogany", SHIFT)}>
            {number}
          </span>
        </span>

        {/*
          The divider sits 12px under the title, as on five of the drawn cards (the design drops card 04's to
          108px, against its description, though its title takes one line).
        */}
        <div className="absolute top-10 left-24 flex w-[252px] flex-col">
          <h3 className={cx("font-serif text-[23px]/[28px] font-normal text-mahogany group-hover/reason:text-cream", SHIFT)}>{reason.title}</h3>
          <span aria-hidden="true" className="relative mt-[11.5px] ml-3 block h-px w-[228px]">
            {(["cream", "dark"] as const).map((art) => (
              <span key={art} className={cx("absolute inset-0", art === "dark" && ON_HOVER)}>
                <img src={`/images/why-choose/divider-${art}.svg`} alt="" width={228} height={1} className="absolute inset-0 h-px w-[228px] max-w-none" />
                <img src={`/images/why-choose/diamond-${art}.svg`} alt="" width={8} height={8} className="absolute top-[-3.5px] left-[110px] size-2" />
              </span>
            ))}
          </span>
        </div>

        <p className={cx("absolute top-[110px] left-6 w-[324px] text-[15px]/[22px] font-medium text-clay group-hover/reason:text-cream/82", SHIFT)}>
          {reason.description}
        </p>
      </Tilt>
    </li>
  );
}

/**
 * The badge's skyline: monuments from the closing banner's skyline (the site's own drawings), placed along
 * the badge's foot as [name, left edge in px, scale]. Low buildings sit under the label, the tall ones
 * after it, so the text stays clear.
 */
const BADGE_SKYLINE = [
  ["Rashtrapati Bhavan", 160, 0.19],
  ["Gateway of India", 226, 0.24],
  ["Charminar", 272, 0.28],
  ["Lotus Temple", 322, 0.19],
  ["India Gate", 348, 0.22],
  ["Gopuram", 384, 0.22],
  ["Hawa Mahal", 414, 0.24],
] as const;

/**
 * Tone on tone: the mahogany silhouettes at 32% over the badge's orange read as a deeper burnt orange,
 * standing on the badge's foot (1px past it, so no sliver of orange shows under them). Decoration only.
 */
function BadgeSkyline() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-32">
      {BADGE_SKYLINE.map(([name, left, scale]) => {
        const monument = closingSkyline.find((item) => item.name === name);
        if (!monument) return null;
        const width = monument.width * scale;
        const height = monument.height * scale;
        return (
          <img
            key={name}
            src={monument.src}
            alt=""
            width={Math.round(width)}
            height={Math.round(height)}
            loading="lazy"
            className="absolute max-w-none"
            style={{ left, top: 96 - height, width, height }}
          />
        );
      })}
    </span>
  );
}

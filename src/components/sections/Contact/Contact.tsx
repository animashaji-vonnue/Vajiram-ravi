import IndianLink from "@/components/ui/IndianLink";
import { TURN } from "@/components/ui/Medallion";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { contactIntro, contactWays, type ContactWay } from "@/data/contact";
import { cx } from "@/lib/cx";
import { CARD_LINK } from "@/lib/hover";
import { ParallaxLayer } from "@/lib/parallax";

const ART = "/images/contact";

/**
 * The scalloped icon medallion at a card's head, 64px, from the design's own layers: the 14-lobed scallop
 * and its stitched ring turn round together while the card is hovered (as the arrow medallions do, see
 * ui/Medallion's TURN) while the icon stays upright. It is not ui/Medallion: that draws the 10-lobed arrow medallion, and this
 * one's scallop, colour (#ec5800) and stitch differ.
 */
function IconMedallion({ icon, dark }: Pick<ContactWay, "icon" | "dark">) {
  return (
    <span aria-hidden="true" className="absolute top-8 left-6 size-16">
      <span className={`absolute inset-0 ${TURN}`}>
        <img
          src={`${ART}/scallop-${dark ? "saffron" : "burnt"}.svg`}
          alt=""
          width={64}
          height={62.64}
          className="absolute top-[0.68px] left-0 h-[62.64px] w-16 max-w-none"
        />
        <img
          src={`${ART}/stitch-${dark ? "dark" : "light"}.svg`}
          alt=""
          width={53}
          height={53}
          className="absolute top-[5.5px] left-[5.5px] size-[53px] max-w-none"
        />
      </span>
      <img src={`${ART}/icon-${icon}.svg`} alt="" width={26} height={26} className="absolute top-[19px] left-[19px] size-[26px] max-w-none" />
    </span>
  );
}

/**
 * One way to reach us, 308 × 270: an invitation card with a notched frame and an arch at the top, the
 * whole card a link. Motion spec: it rises with the section's stagger; on hover it lifts 4px with a
 * deeper shadow, its medallion turns 30° and the link's underline draws.
 *   - The frame is not a rectangle, so its shadow is the design's own (drawn in the frame SVG) and the
 *     hover shadow is a second copy of the frame with a drop-shadow that fades in, instead of CARD_LINK's
 *     box-shadow (which would draw a rectangle around the notches).
 *   - The link at the foot is the Indian link's look as a span: the card is already the link.
 */
function WayCard({ way }: { way: ContactWay }) {
  const { dark } = way;
  const frame = `${ART}/card-${dark ? "dark" : "light"}.svg`;
  return (
    <a
      href={way.href}
      target={way.external ? "_blank" : undefined}
      rel={way.external ? "noopener noreferrer" : undefined}
      className={cx(CARD_LINK, "relative block h-[270px] w-[308px] shrink-0 shadow-none!")}
    >
      <img src={frame} alt="" aria-hidden="true" width={361} height={323.101} className="absolute top-[-14.6px] left-[-26.5px] h-[323.101px] w-[361px] max-w-none" />
      <img
        src={frame}
        alt=""
        aria-hidden="true"
        width={361}
        height={323.101}
        className="absolute top-[-14.6px] left-[-26.5px] h-[323.101px] w-[361px] max-w-none opacity-0 [filter:drop-shadow(var(--shadow-hover))] [transition:opacity_var(--dur-fast)_var(--ease-out)] group-hover/card:opacity-100"
      />
      <img
        src={`${ART}/inner-border-${dark ? "dark" : "light"}.svg`}
        alt=""
        aria-hidden="true"
        width={292.75}
        height={250.625}
        className="absolute top-[11.75px] left-[7.625px] h-[250.625px] w-[292.75px] max-w-none"
      />

      <IconMedallion icon={way.icon} dark={dark} />

      <h3 className={cx("absolute top-[110px] left-6 w-[260px] font-serif text-[24px]/[28px]", dark ? "text-cream" : "text-mahogany")}>{way.title}</h3>
      {/* The ornament divider: a rule broken by a small diamond. */}
      <img
        src={`${ART}/divider-${dark ? "dark" : "light"}.svg`}
        alt=""
        aria-hidden="true"
        width={260}
        height={1}
        className="absolute top-[149.5px] left-6 h-px w-[260px] max-w-none"
      />
      <img
        src={`${ART}/diamond-${dark ? "dark" : "light"}.svg`}
        alt=""
        aria-hidden="true"
        width={8}
        height={8}
        className="absolute top-[146px] left-[150px] size-2 max-w-none"
      />
      <p className={cx("absolute top-[162px] left-6 w-[260px] text-[14px]/[20px] font-medium", dark ? "text-cream/82" : "text-clay")}>{way.text}</p>

      <span className="absolute top-[222px] left-6 flex">
        <IndianLink tone={dark ? "dark" : "light"} href={null} className="cursor-pointer! text-[14px]/[20px]!">
          {way.cta}
        </IndianLink>
        {way.external && <span className="sr-only"> (opens in a new tab)</span>}
      </span>
    </a>
  );
}

/**
 * "What are you looking for?": the burnt band with the paper grain and the feathered temple collage in its
 * top-left corner, the heading, and the four ways to get in touch. The last card is the dark one.
 */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-h" className="relative overflow-hidden bg-burnt">
      <img
        src={`${ART}/paper-grain.webp`}
        alt=""
        aria-hidden="true"
        width={1024}
        height={1440}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover opacity-30 mix-blend-multiply"
      />
      <div className="relative mx-auto w-canvas px-20 pt-24 pb-24">
        {/*
          The temple collage, feathered to nothing at its edge by a radial mask. The picture drifts with the
          scroll under the still mask (lib/parallax: fine pointers, ViewTimeline, motion allowed).
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-260px] left-[-260px] size-[800px] opacity-28 mix-blend-multiply [mask-image:url(/images/contact/temple-collage-mask.svg)] [mask-size:800px_800px] [mask-repeat:no-repeat]"
        >
          <ParallaxLayer speed={5} className="absolute inset-0">
            <img src={`${ART}/temple-collage.webp`} alt="" width={736} height={1308} loading="lazy" decoding="async" className="size-full max-w-none object-cover" />
          </ParallaxLayer>
        </div>

        <div className="relative flex flex-col items-start gap-3">
          <EyebrowLeft labelClassName="text-cream">{contactIntro.eyebrow}</EyebrowLeft>
          <h2 id="contact-h" data-reveal="heading" className="font-serif text-[60px]/[1.08] tracking-[-0.9px] whitespace-nowrap text-white">
            {contactIntro.title.lead}
            <em data-reveal-em className="text-cream">
              {contactIntro.title.em}
            </em>
          </h2>
          <p data-reveal="sub" className="text-[18px]/[27px] font-bold whitespace-nowrap text-white/92">
            {contactIntro.lead}
          </p>
        </div>

        <div data-reveal-group className="relative mt-[47px] flex items-start gap-4">
          {contactWays.map((way) => (
            <WayCard key={way.title} way={way} />
          ))}
        </div>
      </div>
    </section>
  );
}

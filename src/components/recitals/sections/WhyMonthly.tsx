import { ArrowRightIcon } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/recitals/Motion";
import { Eyebrow, RosetteMark, RubberStamp } from "@/components/recitals/Ornaments";
import { whyMonthlyArguments, whyMonthlyStats } from "@/data/magazine";

/*
 * The one dark band on the page.
 *
 * It does two jobs. It gives the scroll a floor, so the parchment above and below reads as
 * light rather than relentless. And it is where the argument is made, which is the part a
 * reader should stop at: the case sits on the left and stays put while the four points
 * move past it, so the claim and its evidence are never separated.
 *
 * Deep ember brown, after two wrong answers.
 *
 * It was maroon first, which failed because it was a darker mix of the page's own orange:
 * the band read as the same colour turned down rather than as a change of material, and
 * gold on it sat too close in hue to carry an accent. Indigo fixed the accent and broke
 * something larger — it was the only cool hue anywhere on a page that is otherwise all
 * saffron and papaya, so instead of being the page's dark band it read as a different
 * site wedged into the middle of this one.
 *
 * The answer was not a third hue. This brown is dark enough to behave as near-black, so
 * it carries gold and cream at nine and fifteen to one, and warm enough to belong to the
 * family either side of it. The colour on this band comes from the accents, not from the
 * ground — which is what the first two attempts both got backwards. Laid as a gradient
 * with a saffron bloom at one shoulder so it has light in it rather than being flat.
 */

/**
 * The band sits on a photograph now rather than on a colour.
 *
 * A reading room at night, under a scrim of the same brown. The scrim carries alpha
 * instead of being opaque, which is the whole point: the desk lamps come through it as
 * warm points of light, so the ground has depth and incident in it that no gradient can
 * fake. It is also the right picture for the argument being made beside it.
 *
 * It has to stay a ground. The scrim is heavy enough that nothing in the photograph
 * competes with a line of type, and the section's own colour shows through underneath if
 * the image is slow or fails.
 */
const GROUND = "linear-gradient(168deg,#4c2b17 0%,#35200f 46%,#24150b 100%)";
const SCRIM = "linear-gradient(168deg,rgba(76,43,23,.58) 0%,rgba(53,32,15,.66) 46%,rgba(36,21,11,.74) 100%)";
/** Heat bleeding in from the page above, so the join is a transition and not a cut. */
const BLOOM =
  "radial-gradient(58% 48% at 88% -4%,#ff8a2b 0%,transparent 64%)," +
  "radial-gradient(44% 40% at 6% 104%,#f4c430 0%,transparent 68%)";

export default function WhyMonthly() {
  return (
    <section id="why" className="relative overflow-hidden" aria-labelledby="why-h" style={{ background: GROUND }}>
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/recitals/reading-room.webp)" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: SCRIM }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 opacity-[.28]" style={{ background: BLOOM }} aria-hidden="true" />
      {/*
       * No letterfield here any more. It was the ground before the photograph arrived,
       * and running both left two competing figures in the same space — the glyphs
       * cutting across the room, neither one legible as the thing behind the text. A
       * section gets one ground. The scripts moved to the FAQ, which has none.
       */}

      <div className="relative mx-auto flex w-full max-w-[1440px] items-start gap-20 px-20 py-24">
        {/* The case, held in place. */}
        <Reveal className="relative sticky top-24 w-[470px] shrink-0">
          {/*
           * Struck half into the gutter, across the corner of the figures, the way a
           * clerk's stamp lands on a form — partly on the box and partly off it. Centred
           * in its own empty space it would read as a logo, which is the opposite of the
           * effect.
           */}
          <RubberStamp
            size={158}
            rotate={-14}
            className="pointer-events-none absolute -right-20 bottom-24 text-r-saffron opacity-[.42]"
          />
          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Eyebrow className="text-r-saffron!">Why monthly</Eyebrow>
              <h2 id="why-h" className="font-r-editorial text-[40px]/[48px] font-bold text-r-paper">
                A month&rsquo;s compilation beats a month of scrolling
              </h2>
            </div>

            {/*
             * The cells are translucent rather than a flat fill. A solid colour here
             * would sit as four opaque patches on top of the gradient and cancel it
             * exactly where the eye goes first.
             */}
            <div className="grid grid-cols-2 gap-px bg-r-paper/20">
              {whyMonthlyStats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5 bg-[#35200f]/80 p-5 backdrop-blur-[2px]">
                  <p className="font-r-display text-[32px]/[36px] font-extrabold text-r-saffron">{stat.value}</p>
                  <p className="font-sans text-[14px]/[20px] font-medium text-r-sand/85">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <a
                href="#latest"
                className="group/btn inline-flex h-12 items-center gap-2.5 bg-r-saffron px-6 font-sans text-[15px]/[20px] font-semibold text-[#2a1708] transition-colors duration-250 hover:bg-r-amber"
              >
                Read the latest issue
                <ArrowRightIcon className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </a>
              <a
                href="#archive"
                className="inline-flex h-12 items-center px-5 font-sans text-[15px]/[20px] font-semibold text-r-sand underline decoration-r-sand/40 underline-offset-4 transition-colors duration-200 hover:text-r-paper hover:decoration-r-paper"
              >
                Browse all issues
              </a>
            </div>
          </div>
        </Reveal>

        {/* The evidence, moving past it. */}
        <Stagger className="min-w-0 flex-1" gap={0.08}>
          {whyMonthlyArguments.map((argument, i) => (
            <StaggerItem key={argument.title}>
              <article className="group/arg flex items-start gap-7 border-b border-r-paper/14 py-8 last:border-b-0 last:pb-0">
                <span className="relative w-14 shrink-0 pt-1">
                  <span className="font-r-display text-[30px]/[32px] font-extrabold text-r-paper/55 transition-colors duration-400 group-hover/arg:text-r-saffron">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <RosetteMark
                    size={11}
                    className="absolute top-0 -left-5 text-r-saffron opacity-0 transition-opacity duration-400 group-hover/arg:opacity-100"
                  />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                  <h3 className="font-r-editorial text-[22px]/[30px] font-bold text-r-paper">{argument.title}</h3>
                  <p className="font-sans text-[16px]/[26px] font-medium text-r-sand/80">{argument.body}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

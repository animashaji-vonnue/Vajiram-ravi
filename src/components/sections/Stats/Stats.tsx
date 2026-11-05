import { stats } from "@/data/home";
import { cx } from "@/lib/cx";
import SplitHeading from "@/components/ui/SplitHeading";

/**
 * Monument line art in a corner of the band, cut from the line-art drawings used elsewhere on the site and
 * printed in a faint white on the band, as the brief's reference does with its chhatri and elephant.
 */
function CornerArt({ src, side }: { src: string; side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      // Each drawing fills the left two thirds of its image, so at this height it fits the box whole: none of it
      // is cut off at the top or the side.
      className={cx(
        "absolute bottom-0 h-[320px] w-[390px] bg-white/20",
        side === "left" ? "left-0" : "right-0 -scale-x-100",
      )}
      style={{
        maskImage: `url(${src})`,
        maskSize: "auto 100%",
        maskPosition: "left bottom",
        maskRepeat: "no-repeat",
      }}
    />
  );
}

/**
 * The ornament either side of the heading, after the brief's "From our blog" heading: a short rule, a small
 * diamond, then a longer rule running to the label. `mirrored` turns it to face the heading from the right.
 */
function Flourish({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <span aria-hidden="true" className={cx("flex items-center gap-2", mirrored && "-scale-x-100")}>
      <span className="h-px w-10 bg-white/60" />
      <span className="size-1.5 rotate-45 bg-white" />
      <span className="h-px w-16 bg-white/60" />
    </span>
  );
}

/**
 * The stats band under the hero, after the brief's "Why shop with Rudhigat?" bar: an orange band (#FF8B00) with
 * monument line art in its corners, a heading in bold serif capitals between two diamond flourishes, and a row of
 * four stats, each a large figure over its label and a line of context, in white.
 */
export default function Stats() {
  return (
    <section aria-labelledby="stats-title" className="relative isolate overflow-hidden bg-[#ff8b00] py-16 text-white">
      <CornerArt src="/images/toppers/lineart-west.webp" side="left" />
      <CornerArt src="/images/toppers/lineart-east.webp" side="right" />

      <div className="relative mx-auto flex w-[1000px] flex-col items-center">
        <div className="flex items-center gap-4">
          <Flourish />
          <h2
            data-split
            id="stats-title"
            className="font-noto-serif text-[22px]/[30px] font-bold tracking-[0.06em] uppercase"
          >
            <SplitHeading text={stats.heading} />
          </h2>
          <Flourish mirrored />
        </div>

        {/* Each stat as in the design (3790:42691): the figure large, then its label and a line of context. */}
        <ul data-reveal-group className="mt-8 grid w-full grid-cols-4 gap-8">
          {stats.list.map((stat) => (
            <li key={stat.value} className="flex flex-col items-center text-center">
              <p className="font-display text-[56px]/[64px] font-medium">{stat.value}</p>
              <p className="mt-3 font-display text-[20px]/[28px] font-semibold">{stat.label}</p>
              <p className="mt-1 font-sans text-[16px]/[24px] font-medium text-white/85">{stat.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

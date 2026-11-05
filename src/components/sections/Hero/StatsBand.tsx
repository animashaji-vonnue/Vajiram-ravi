import { Fragment } from "react";
import CountUp from "@/components/ui/CountUp";
import { heroStats } from "@/data/hero";
import { cx } from "@/lib/cx";

/**
 * The stats band under the hero (Figma "04 · Stats band", 2256:5656): 150px of #351607 with the Taj at
 * dawn at 21% over it, and four figures 270px wide spread across the 1280 row, 30px down, with 56px
 * saffron dividers between them. Figures in Hanken Grotesk Bold 48 (white, the last two saffron), labels
 * 13.5px at 75% white, 130px wide.
 *
 * Motion spec, "02 Stats band": the figures count up from 0 together when the band is half in view
 * (CountUp: 1.2s, format kept, "+" last), and each label fades in 200ms after its figure lands
 * (`data-count-scope` / `data-count-label`, see globals.css). Once; reduced motion shows the final numbers.
 */
export default function StatsBand() {
  return (
    <section aria-label="Our record" className="relative isolate h-[150px] overflow-clip bg-[#351607]">
      <img
        src="/images/hero/stats-band-taj-dawn.webp"
        alt=""
        aria-hidden="true"
        width={735}
        height={490}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-21"
      />
      <ul className="relative mx-auto flex w-canvas items-center justify-between px-20 pt-[30px]">
        {heroStats.map((stat, i) => (
          <Fragment key={stat.label}>
            {i > 0 && <li aria-hidden="true" className="h-14 w-px shrink-0 bg-saffron/30" />}
            <li data-count-scope className="flex w-[270px] shrink-0 items-center gap-3.5">
              <p
                className={cx(
                  "font-sans text-[48px]/[normal] font-bold tracking-[-1.44px] whitespace-nowrap",
                  stat.accent ? "text-saffron" : "text-white",
                )}
              >
                <CountUp value={stat.value} />
              </p>
              <p data-count-label className="w-[130px] text-[13.5px]/[1.4] text-white/75">
                {stat.label}
              </p>
            </li>
          </Fragment>
        ))}
      </ul>
    </section>
  );
}

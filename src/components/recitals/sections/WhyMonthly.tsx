import { ArrowRightIcon } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/recitals/Motion";
import { DiamondMark, Eyebrow, patternStyle } from "@/components/recitals/Ornaments";
import { whyMonthlyArguments, whyMonthlyStats } from "@/data/magazine";

/*
 * The one dark band on the page.
 *
 * It does two jobs. It gives the scroll a floor, so the parchment above and below reads as
 * light rather than relentless. And it is where the argument is made, which is the part a
 * reader should stop at: the case sits on the left and stays put while the four points
 * move past it, so the claim and its evidence are never separated.
 */
export default function WhyMonthly() {
  return (
    <section id="why" className="relative bg-[#7c2a11]" aria-labelledby="why-h">
      <div className="pointer-events-none absolute inset-0" style={patternStyle("jali", "#ffcf6a", 0.07)} aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-[1440px] items-start gap-20 px-20 py-24">
        {/* The case, held in place. */}
        <Reveal className="sticky top-24 w-[470px] shrink-0">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Eyebrow className="text-r-amber!">Why monthly</Eyebrow>
              <h2 id="why-h" className="font-r-editorial text-[40px]/[48px] font-bold text-r-paper">
                A month&rsquo;s compilation beats a month of scrolling
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-px bg-r-paper/15">
              {whyMonthlyStats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5 bg-[#7c2a11] p-5">
                  <p className="font-r-display text-[32px]/[36px] font-extrabold text-r-amber">{stat.value}</p>
                  <p className="font-sans text-[14px]/[20px] font-medium text-r-sand/85">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <a
                href="#latest"
                className="group/btn inline-flex h-12 items-center gap-2.5 bg-r-amber px-6 font-sans text-[15px]/[20px] font-semibold text-r-oxblood transition-colors duration-250 hover:bg-r-saffron"
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
              <article className="group/arg flex items-start gap-7 border-b border-r-paper/12 py-8 last:border-b-0 last:pb-0">
                <span className="relative w-14 shrink-0 pt-1">
                  <span className="font-r-display text-[30px]/[32px] font-extrabold text-r-paper/25 transition-colors duration-400 group-hover/arg:text-r-amber">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <DiamondMark
                    size={5}
                    className="absolute top-0 -left-3 text-r-amber opacity-0 transition-opacity duration-400 group-hover/arg:opacity-100"
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

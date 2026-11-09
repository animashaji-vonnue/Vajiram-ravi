import { Reveal } from "@/components/recitals/Motion";
import { closing, footer } from "@/data/new-home";
import { Button, Container, Eyebrow, Flower, flowerPrint } from "./ui";

/** Two four-petal flowers, one turned 45°, make an eight-petal rosette. */
function Rosette({ className }: { className?: string }) {
  const petal = "M50 4C56 30 70 44 96 50 70 56 56 70 50 96 44 70 30 56 4 50 30 44 44 30 50 4Z";
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <path d={petal} fill="currentColor" />
      <path d={petal} fill="currentColor" transform="rotate(45 50 50)" opacity="0.6" />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
    </svg>
  );
}

/*
 * 11 — Final conversion opportunity.
 *
 * The whole band is saffron: the last thing on the page is the brand colour at full volume,
 * with ink type, which reads at over 6:1. Two large rosettes turn very slowly at the edges.
 */
export function Closing() {
  return (
    <section aria-labelledby="closing-title" className="relative isolate overflow-hidden bg-v-orange-500 py-28 text-v-ink lg:py-40">
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={flowerPrint("rgba(255,255,255,0.14)")} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_70%_at_50%_0%,rgba(255,194,61,0.6),transparent_70%)]" />
      <Rosette className="absolute -bottom-40 -left-40 -z-10 size-[520px] text-v-orange-400 motion-safe:animate-[v-turn_90s_linear_infinite]" />
      <Rosette className="absolute -top-44 -right-36 -z-10 size-[460px] text-v-orange-600/25 motion-safe:animate-[v-turn_120s_linear_infinite_reverse]" />

      <Container>
        <Reveal className="mx-auto flex max-w-[1000px] flex-col items-center text-center">
          <Eyebrow tone="orange">{closing.eyebrow}</Eyebrow>
          <h2
            id="closing-title"
            className="mt-6 max-w-[17ch] font-v-head text-[clamp(40px,5.4vw,84px)]/[1.0] font-extrabold tracking-[-0.03em] text-balance"
          >
            {closing.heading}
          </h2>
          <p className="mt-7 max-w-[60ch] font-v-body text-[18.5px]/[1.6] font-medium">{closing.description}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href={closing.primary.href} variant="ink">
              {closing.primary.label}
            </Button>
            <Button href={closing.secondary.href} variant="outline">
              {closing.secondary.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/*
 * 12 — Footer.
 */
export function Footer() {
  return (
    <footer className="relative bg-v-night pt-20 pb-10 text-v-paper">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
          <div>
            <a href="#top" className="inline-block rounded-2xl bg-v-paper px-4 py-3" aria-label="Vajiram & Ravi, back to top">
              <img src="/images/logo.webp" alt="" width={750} height={180} className="h-10 w-auto" />
            </a>
            <p className="mt-6 max-w-[40ch] font-v-body text-[16px]/[1.6] text-v-paper/70">{footer.description}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {footer.columns.map((col) => (
              <div key={col.heading}>
                <h2 className="flex items-start gap-2 font-v-head text-[17px]/[1.3] font-bold text-v-orange-300">
                  <Flower size={9} className="mt-[0.42em] text-v-orange-500" />
                  {col.heading}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="rounded-sm font-v-body text-[15.5px] text-v-paper/75 underline-offset-4 transition-colors duration-150 hover:text-v-paper hover:underline"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-v-paper/12 pt-8 font-v-body text-[14.5px] text-v-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="rounded-sm hover:text-v-paper hover:underline hover:underline-offset-4">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#top" className="rounded-sm text-v-orange-300 hover:underline hover:underline-offset-4">
                Back to top ↑
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}

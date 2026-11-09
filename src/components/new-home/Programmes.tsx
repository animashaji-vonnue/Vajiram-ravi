import { LaptopIcon, OpenBookIcon } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/recitals/Motion";
import { featured, otherProgrammesIntro, programmes, programmesIntro } from "@/data/new-home";
import { ArrowLink, Button, Container, Eyebrow, Flower, flowerPrint, Heading, Lead } from "./ui";

const optionIcons = [OpenBookIcon, LaptopIcon];

/*
 * 04 — Explore UPSC programmes.
 *
 * The flagship gets a split block: the pitch on saffron, the evidence (six highlights) on
 * cream beside it. The other eight are an index, numbered like a prospectus, because eight
 * identical cards would flatten them into one grey mass.
 */
export default function Programmes() {
  return (
    <section id="programmes" aria-labelledby="programmes-title" className="bg-v-paper py-24 lg:py-32">
      <Container>
        <Reveal className="mx-auto flex max-w-[860px] flex-col items-center text-center">
          <Eyebrow>{programmesIntro.eyebrow}</Eyebrow>
          <Heading id="programmes-title" className="mt-5 max-w-[16ch] text-v-ink">
            {programmesIntro.heading}
          </Heading>
          <Lead className="mt-6 text-v-ink-700">{programmesIntro.description}</Lead>
        </Reveal>

        <Reveal className="mt-16">
          <article
            aria-labelledby="featured-title"
            className="grid overflow-hidden rounded-[36px] shadow-[0_50px_90px_-60px_rgba(168,60,7,0.7)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
          >
            <div className="relative isolate bg-v-orange-500 p-7 text-v-ink sm:p-10 lg:p-14">
              <div aria-hidden="true" className="absolute inset-0 -z-10" style={flowerPrint("rgba(255,255,255,0.15)")} />
              <p className="inline-flex items-center gap-2 rounded-full bg-v-ink px-3.5 py-1.5 font-v-body text-[12.5px] font-bold tracking-[0.12em] text-v-paper uppercase">
                <Flower size={10} className="text-v-orange-400" />
                {featured.badge}
              </p>
              <p className="mt-7 font-v-body text-[13px]/[1.4] font-bold tracking-[0.14em] uppercase">{featured.eyebrow}</p>
              <h3
                id="featured-title"
                className="mt-3 max-w-[18ch] font-v-head text-[clamp(30px,3.1vw,46px)]/[1.05] font-extrabold tracking-[-0.02em] text-balance"
              >
                {featured.heading}
              </h3>
              <p className="mt-5 max-w-[54ch] font-v-body text-[17.5px]/[1.6] font-medium">{featured.description}</p>

              <ul className="mt-9 grid gap-6 sm:grid-cols-2">
                {featured.options.map((o, i) => {
                  const Icon = optionIcons[i];
                  return (
                    <li key={o.title} className="flex gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-v-ink text-v-orange-400">
                        <Icon className="size-5" />
                      </span>
                      <span>
                        <span className="block font-v-head text-[19px]/[1.2] font-bold">{o.title}</span>
                        <span className="mt-1 block font-v-body text-[15px]/[1.45] font-medium">{o.text}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button href={featured.primary.href} variant="ink">
                  {featured.primary.label}
                </Button>
                <Button href={featured.secondary.href} variant="outline">
                  {featured.secondary.label}
                </Button>
              </div>
              <p className="mt-5 flex items-center gap-2 font-v-body text-[15px] font-semibold">
                <Flower size={10} />
                {featured.note}
              </p>
            </div>

            <div className="bg-v-cream p-7 sm:p-10 lg:p-14">
              <p className="font-v-body text-[13px] font-bold tracking-[0.16em] text-v-orange-600 uppercase">Programme highlights</p>
              <Stagger className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2" gap={0.06}>
                {featured.highlights.map((h) => (
                  <StaggerItem key={h.title}>
                    {h.figure ? (
                      <p className="font-v-head text-[52px]/[0.9] font-extrabold tracking-[-0.03em] text-v-orange-600">{h.figure}</p>
                    ) : (
                      <p aria-hidden="true" className="grid h-[47px] items-end">
                        <span className="grid size-11 place-items-center rounded-full bg-v-orange-500 text-v-ink">
                          <Flower size={16} />
                        </span>
                      </p>
                    )}
                    <h4 className="mt-3 font-v-head text-[20px]/[1.2] font-bold text-v-ink">{h.title}</h4>
                    <p className="mt-1.5 font-v-body text-[15.5px]/[1.5] text-v-ink-700">{h.text}</p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </article>
        </Reveal>

        <div className="mt-24 lg:mt-32">
          <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Heading as="h3" className="max-w-[20ch] text-v-ink">
                {otherProgrammesIntro.heading}
              </Heading>
              <p className="mt-4 max-w-[62ch] font-v-body text-[17.5px]/[1.6] text-v-ink-700">{otherProgrammesIntro.description}</p>
            </div>
            <ArrowLink href={otherProgrammesIntro.link.href} className="shrink-0">
              {otherProgrammesIntro.link.label}
            </ArrowLink>
          </Reveal>

          <Stagger className="mt-10 grid md:grid-cols-2 md:gap-x-14" gap={0.05}>
            {programmes.map((p, i) => (
              <StaggerItem key={p.title} className="border-t border-v-line max-md:last:border-b md:[&:nth-last-child(-n+2)]:border-b">
                <a href={p.cta.href} className="group flex gap-5 rounded-[20px] py-7 transition-colors duration-200 sm:gap-7">
                  <span className="w-10 shrink-0 font-v-head text-[26px]/[1.1] font-extrabold text-v-orange-500 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="block font-v-head text-[23px]/[1.15] font-bold text-v-ink transition-colors duration-200 group-hover:text-v-orange-600">
                      {p.title}
                    </span>
                    <span className="mt-2 block max-w-[52ch] font-v-body text-[16px]/[1.55] text-v-ink-700">{p.description}</span>
                    <span className="mt-3 inline-block font-v-body text-[15px] font-semibold text-v-orange-600">{p.cta.label}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 grid size-12 shrink-0 place-items-center rounded-full border-2 border-v-line text-v-ink transition-[background-color,border-color,transform] duration-300 ease-v-out group-hover:-rotate-45 group-hover:border-v-orange-500 group-hover:bg-v-orange-500"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8h12M8.33 13.67 14 8 8.33 2.33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}

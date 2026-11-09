import type { ComponentType } from "react";
import { CalendarIcon, ChatBubbleIcon, ListChecksIcon, OpenBookIcon, PenLineIcon, QuoteMarkIcon, type IconProps } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/recitals/Motion";
import { latestIssue } from "@/data/magazine";
import { resources, resourcesIntro, type Resource } from "@/data/new-home";
import { cx } from "@/lib/cx";
import { ArrowLink, Button, Container, Eyebrow, flowerPrint, Heading, Lead } from "./ui";

function ChartIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path d="M3.5 18.5h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="5" y="10" width="3" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.5" y="5.5" width="3" height="10.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="8" width="3" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const icons: Record<string, ComponentType<IconProps>> = {
  "Prelims Pointers": ListChecksIcon,
  "Mains Articles": PenLineIcon,
  "Editorial Analysis": ChatBubbleIcon,
  "Pensive: Weekly Essay": QuoteMarkIcon,
  Infographics: ChartIcon,
  "Yojana & Kurukshetra Summaries": OpenBookIcon,
};

/*
 * 09 — Free study materials and resources.
 *
 * A newsstand, not a grid of equals: The Recitals is the flagship publication and gets the
 * big saffron tile with its current cover; daily current affairs, the most frequent read,
 * gets the dark tile; the six shorter formats sit below. Every tile says whether it is free.
 */
export default function Resources() {
  const [recitals, daily, ...rest] = resources;
  return (
    <section id="resources" aria-labelledby="resources-title" className="bg-v-paper py-24 lg:py-32">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
          <Reveal>
            <Eyebrow>{resourcesIntro.eyebrow}</Eyebrow>
            <Heading id="resources-title" className="mt-5 max-w-[15ch] text-v-ink">
              {resourcesIntro.heading}
            </Heading>
          </Reveal>
          <Reveal delay={0.1}>
            <Lead className="text-v-ink-700">{resourcesIntro.description}</Lead>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4" gap={0.06}>
          <StaggerItem className="md:col-span-2 lg:row-span-2">
            <article className="relative isolate flex h-full flex-col overflow-hidden rounded-[30px] bg-v-orange-500 p-7 text-v-ink sm:p-9">
              <div aria-hidden="true" className="absolute inset-0 -z-10" style={flowerPrint("rgba(255,255,255,0.15)")} />
              <div className="flex flex-col items-start lg:max-w-[58%]">
                <Access value={recitals.access} tone="orange" />
                <p className="mt-5 font-v-body text-[13px] font-bold tracking-[0.14em] uppercase">{recitals.category}</p>
                <h3 className="mt-2 font-v-head text-[clamp(34px,3.2vw,48px)]/[1] font-extrabold tracking-[-0.02em]">{recitals.title}</h3>
                <p className="mt-4 font-v-body text-[16.5px]/[1.55] font-medium">{recitals.description}</p>
                <Button href={recitals.cta.href} variant="ink" className="mt-7">
                  {recitals.cta.label}
                </Button>
              </div>
              <a
                href={recitals.cta.href}
                tabIndex={-1}
                aria-hidden="true"
                className="mx-auto mt-9 block w-[62%] max-w-[260px] rotate-[4deg] transition-transform duration-500 ease-v-out hover:rotate-0 lg:absolute lg:right-9 lg:bottom-9 lg:mt-0 lg:w-[34%]"
              >
                <img
                  src={latestIssue.cover}
                  alt=""
                  width={600}
                  height={800}
                  loading="lazy"
                  className="w-full rounded-md shadow-[0_30px_50px_-20px_rgba(58,20,7,0.7)] ring-1 ring-v-ink/10"
                />
                <span className="mt-2 block text-center font-v-body text-[12.5px] font-bold tracking-[0.1em] uppercase">{latestIssue.label} issue</span>
              </a>
            </article>
          </StaggerItem>

          <StaggerItem className="md:col-span-2">
            <article className="relative flex h-full flex-col items-start overflow-hidden rounded-[30px] bg-v-ink p-7 text-v-paper sm:p-9">
              <span className="absolute top-7 right-7 grid size-14 place-items-center rounded-full bg-v-orange-500 text-v-ink sm:top-9 sm:right-9">
                <CalendarIcon className="size-6" />
              </span>
              <Access value={daily.access} tone="dark" />
              <h3 className="mt-5 max-w-[14ch] font-v-head text-[clamp(28px,2.4vw,36px)]/[1.05] font-extrabold">{daily.title}</h3>
              <p className="mt-3 max-w-[46ch] font-v-body text-[16.5px]/[1.55] text-v-paper/80">{daily.description}</p>
              <ArrowLink href={daily.cta.href} tone="dark" className="mt-auto pt-6">
                {daily.cta.label}
              </ArrowLink>
            </article>
          </StaggerItem>

          {rest.map((r) => (
            <StaggerItem key={r.title}>
              <ResourceTile resource={r} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-12 flex justify-center">
          <Button href={resourcesIntro.cta.href} variant="outline">
            {resourcesIntro.cta.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}

function ResourceTile({ resource }: { resource: Resource }) {
  const Icon = icons[resource.title] ?? OpenBookIcon;
  return (
    <a
      href={resource.cta.href}
      className="group flex h-full flex-col rounded-[26px] border-2 border-v-line bg-v-paper p-6 transition-[border-color,transform,box-shadow] duration-300 ease-v-out hover:-translate-y-1 hover:border-v-orange-500 hover:shadow-[0_24px_40px_-30px_rgba(168,60,7,0.6)]"
    >
      <span className="flex items-center justify-between">
        <span className="grid size-12 place-items-center rounded-full bg-v-cream text-v-orange-600 transition-colors duration-300 group-hover:bg-v-orange-500 group-hover:text-v-ink">
          <Icon className="size-[22px]" />
        </span>
        <Access value={resource.access} tone="paper" />
      </span>
      <h3 className="mt-6 font-v-head text-[21px]/[1.15] font-bold text-v-ink">{resource.title}</h3>
      <p className="mt-2 font-v-body text-[15.5px]/[1.5] text-v-ink-700">{resource.description}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-v-body text-[15px] font-semibold text-v-orange-600">
        {resource.cta.label}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
          <path d="M2 8h12M8.33 13.67 14 8 8.33 2.33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}

function Access({ value, tone }: { value: Resource["access"]; tone: "paper" | "orange" | "dark" }) {
  const free = value === "Free to read";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-v-body text-[12px] font-bold tracking-[0.06em] uppercase",
        tone === "orange" && "bg-v-ink text-v-paper",
        tone === "dark" && "bg-v-orange-500 text-v-ink",
        tone === "paper" && (free ? "bg-v-sand text-v-ink" : "bg-v-ink text-v-paper"),
      )}
    >
      {free ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2.5 6.2 5 8.5l4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
      {value}
    </span>
  );
}

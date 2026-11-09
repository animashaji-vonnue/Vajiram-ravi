import { LaptopIcon, OpenBookIcon } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/recitals/Motion";
import { batches, batchesIntro, type Batch } from "@/data/new-home";
import { cx } from "@/lib/cx";
import { ArrowLink, Button, Container, Eyebrow, Heading, Lead } from "./ui";

/*
 * 05 — Upcoming batches and admissions.
 *
 * Each batch is a ticket: the start date on a saffron stub, torn along a perforation from
 * the details. The date is what people scan for, so it is the largest thing on each row.
 */
export default function Batches() {
  const { more } = batchesIntro;
  return (
    <section id="batches" aria-labelledby="batches-title" className="bg-v-cream py-24 lg:py-32">
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow>{batchesIntro.eyebrow}</Eyebrow>
            <Heading id="batches-title" className="mt-5 max-w-[15ch] text-v-ink">
              {batchesIntro.heading}
            </Heading>
            <Lead className="mt-6 text-v-ink-700">{batchesIntro.description}</Lead>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 rounded-[24px] border-2 border-dashed border-v-orange-500/45 p-6 sm:p-7">
            <p className="font-v-head text-[21px]/[1.2] font-bold text-v-ink">{more.heading}</p>
            <p className="mt-2 font-v-body text-[16px]/[1.5] text-v-ink-700">{more.text}</p>
            <ArrowLink href={more.cta.href} className="mt-4">
              {more.cta.label}
            </ArrowLink>
          </Reveal>
        </div>

        <Stagger className="flex flex-col gap-5" gap={0.1}>
          {batches.map((b, i) => (
            <StaggerItem key={i}>
              <Ticket batch={b} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

function Ticket({ batch }: { batch: Batch }) {
  const live = batch.mode === "LIVE-Online";
  return (
    <article
      aria-label={`${batch.programme}, starts ${batch.day} ${batch.month} ${batch.year}`}
      className="group relative grid grid-cols-[104px_1fr] overflow-hidden rounded-[24px] bg-v-paper shadow-[0_1px_0_var(--color-v-line),0_24px_50px_-36px_rgba(90,32,4,0.45)] transition-transform duration-300 ease-v-out hover:-translate-y-1 sm:grid-cols-[150px_1fr]"
    >
      <div className="flex flex-col items-center justify-center bg-v-orange-500 px-3 py-6 text-center text-v-ink">
        <p className="font-v-body text-[11.5px] font-bold tracking-[0.16em] uppercase">Starts</p>
        <p className="mt-1 font-v-head text-[clamp(52px,5vw,72px)]/[0.85] font-extrabold tracking-[-0.04em]">{batch.day}</p>
        <p className="mt-1.5 font-v-head text-[17px] font-bold">
          {batch.month} {batch.year}
        </p>
      </div>

      {/* Perforation: two punched notches and a dashed tear line. */}
      <span aria-hidden="true" className="absolute top-0 left-[104px] size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-v-cream sm:left-[150px]" />
      <span aria-hidden="true" className="absolute bottom-0 left-[104px] size-6 -translate-x-1/2 translate-y-1/2 rounded-full bg-v-cream sm:left-[150px]" />

      <div className="flex flex-col gap-5 border-l-2 border-dashed border-v-line p-5 sm:p-7 xl:flex-row xl:items-center xl:justify-between xl:gap-8">
        <div className="min-w-0">
          {batch.mode ? (
            <p
              className={cx(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 font-v-body text-[13px] font-bold",
                live ? "bg-v-ink text-v-paper" : "bg-v-sand text-v-ink",
              )}
            >
              {live ? (
                <span className="size-2 rounded-full bg-v-orange-500 motion-safe:animate-[v-pulse_1.6s_ease-out_infinite]" />
              ) : (
                <OpenBookIcon className="size-4" />
              )}
              {batch.mode}
              {live ? <LaptopIcon className="size-4 opacity-80" /> : null}
            </p>
          ) : null}
          <h3 className="mt-3 font-v-head text-[clamp(20px,1.8vw,24px)]/[1.15] font-bold text-v-ink">{batch.programme}</h3>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {batch.details.map((d) => (
              <div key={d.label}>
                <dt className="font-v-body text-[12px] font-bold tracking-[0.12em] text-v-ink-500 uppercase">{d.label}</dt>
                <dd className="mt-0.5 font-v-body text-[16px] font-semibold text-v-ink">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Button href={batch.cta.href} variant="outline" className="self-start xl:self-center">
          {batch.cta.label}
        </Button>
      </div>
    </article>
  );
}

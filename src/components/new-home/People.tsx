import { Reveal, Stagger, StaggerItem } from "@/components/recitals/Motion";
import { faculty } from "@/data/faculty";
import { educatorsIntro, storiesIntro, studentStories, type StudentStory } from "@/data/new-home";
import { cx } from "@/lib/cx";
import { ArrowLink, Button, Container, DraftNote, Eyebrow, Flower, Heading, Lead } from "./ui";

/*
 * 07 — Meet our educators, and 08 — Student stories.
 *
 * Both are about people, so both use the arch-topped portrait from the hero. The brief
 * forbids placeholder profiles and ready-made testimonials, so each section carries a
 * visible note until approved content arrives, and the stories show the interview prompt
 * each statement will answer instead of an invented quote.
 */

export function Educators() {
  return (
    <section id="educators" aria-labelledby="educators-title" className="bg-v-paper py-24 lg:py-32">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
          <Reveal>
            <Eyebrow>{educatorsIntro.eyebrow}</Eyebrow>
            <Heading id="educators-title" className="mt-5 max-w-[16ch] text-v-ink">
              {educatorsIntro.heading}
            </Heading>
          </Reveal>
          <Reveal delay={0.1}>
            <Lead className="text-v-ink-700">{educatorsIntro.description}</Lead>
            <ArrowLink href={educatorsIntro.cta.href} className="mt-5">
              {educatorsIntro.cta.label}
            </ArrowLink>
          </Reveal>
        </div>

        <DraftNote className="mt-10">{educatorsIntro.draftNote}</DraftNote>

        <Stagger className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-6" gap={0.07}>
          {faculty.map((f, i) => (
            <StaggerItem key={f.name} className={cx(i % 2 === 1 && "lg:translate-y-10")}>
              <a href="#" className="group block rounded-[20px]">
                <span className="relative block aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[20px] bg-v-sand">
                  <img
                    src={f.image}
                    alt={f.name}
                    width={640}
                    height={640}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 ease-v-out group-hover:scale-[1.05]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-t-full rounded-b-[20px] ring-0 ring-v-orange-500 transition-[box-shadow] duration-300 ring-inset group-hover:ring-[6px]"
                  />
                </span>
                <span className="mt-4 block font-v-head text-[20px]/[1.15] font-bold text-v-ink">{f.name}</span>
                <span className="mt-1 block font-v-body text-[15px]/[1.4] text-v-ink-700">{f.subject}</span>
                <span className="mt-2.5 inline-flex items-center gap-1.5 font-v-body text-[14.5px] font-semibold text-v-orange-600">
                  {educatorsIntro.profileCta}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                    <path d="M2 8h12M8.33 13.67 14 8 8.33 2.33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

export function Stories() {
  const [lead, ...rest] = studentStories;
  return (
    <section id="stories" aria-labelledby="stories-title" className="bg-v-cream py-24 lg:py-32">
      <Container>
        <Reveal className="flex flex-col items-start">
          <Eyebrow>{storiesIntro.eyebrow}</Eyebrow>
          <Heading id="stories-title" className="mt-5 max-w-[18ch] text-v-ink">
            {storiesIntro.heading}
          </Heading>
          <Lead className="mt-6 text-v-ink-700">{storiesIntro.description}</Lead>
          <DraftNote className="mt-8">{storiesIntro.draftNote}</DraftNote>
        </Reveal>

        <Stagger className="mt-12 grid gap-5 lg:grid-cols-2" gap={0.1}>
          <StaggerItem className="lg:col-span-2">
            <StoryCard story={lead} wide />
          </StaggerItem>
          {rest.map((s) => (
            <StaggerItem key={s.name}>
              <StoryCard story={s} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-12 flex justify-center">
          <Button href={storiesIntro.cta.href} variant="outline">
            {storiesIntro.cta.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}

function StoryCard({ story, wide }: { story: StudentStory; wide?: boolean }) {
  return (
    <article
      aria-label={`${story.name}, ${story.rank}`}
      className={cx(
        "grid h-full gap-7 rounded-[28px] bg-v-paper p-6 shadow-[0_1px_0_var(--color-v-line),0_24px_50px_-40px_rgba(90,32,4,0.45)] sm:p-8",
        wide && "lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-10 lg:p-10",
      )}
    >
      <header className={cx("flex items-center gap-5", wide && "lg:flex-col lg:items-start")}>
        <span
          className={cx(
            "relative block shrink-0 overflow-hidden rounded-t-full rounded-b-[16px] bg-v-orange-500",
            wide ? "h-[124px] w-[100px] lg:h-[250px] lg:w-[200px]" : "h-[124px] w-[100px]",
          )}
        >
          <img src={story.image} alt={story.name} width={560} height={560} loading="lazy" className="absolute bottom-0 left-1/2 w-[120%] max-w-none -translate-x-1/2" />
        </span>
        <span className="flex flex-col items-start">
          <span className="rounded-full bg-v-ink px-2.5 py-1 font-v-body text-[12.5px] font-bold tracking-[0.08em] text-v-paper uppercase">
            {story.rank} · {story.exam}
          </span>
          <span className="mt-2.5 font-v-head text-[22px]/[1.15] font-bold text-v-ink">{story.name}</span>
          <span className="mt-1 font-v-body text-[14.5px]/[1.4] text-v-ink-700">
            <span className="font-semibold text-v-ink">Programme chosen:</span> {story.programme}
          </span>
        </span>
      </header>

      <Prompt label="The experience" prompt={story.experiencePrompt} />
      <Prompt label="What they found valuable" prompt={story.valuablePrompt} />
    </article>
  );
}

/** Stand-in for a statement still to be collected: shows the question it will answer. */
function Prompt({ label, prompt }: { label: string; prompt: string }) {
  return (
    <div className="flex flex-col">
      <p className="flex items-center gap-2 font-v-body text-[12.5px] font-bold tracking-[0.14em] text-v-orange-600 uppercase">
        <Flower size={10} className="text-v-orange-500" />
        {label}
      </p>
      <div className="mt-3 flex flex-1 flex-col rounded-[18px] border-2 border-dashed border-v-line p-5">
        <svg width="28" height="22" viewBox="0 0 28 22" aria-hidden="true" className="text-v-orange-500">
          <path d="M11 0C4.5 2 1 6.5 1 13v9h10V12H5.7C5.9 7.9 8 5.2 11 4V0Zm16 0c-6.5 2-10 6.5-10 13v9h10V12h-5.3c.2-4.1 2.3-6.8 5.3-8V0Z" fill="currentColor" />
        </svg>
        <p className="mt-3 font-v-body text-[16.5px]/[1.5] text-v-ink-500 italic">
          <span className="not-italic font-semibold text-v-ink-700">Awaiting statement. </span>
          {prompt}
        </p>
      </div>
    </div>
  );
}

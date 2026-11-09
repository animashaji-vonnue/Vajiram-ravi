import type { ComponentType } from "react";
import { GraduationCapIcon, LaptopIcon, LocationPinIcon, TrendIcon, type IconProps } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/recitals/Motion";
import { about } from "@/data/new-home";
import { Button, Container, Eyebrow, Flower, flowerPrint, Heading, Lead } from "./ui";

const pointIcons: ComponentType<IconProps>[] = [TrendIcon, GraduationCapIcon, LaptopIcon];

/*
 * 03 — About Vajiram & Ravi.
 *
 * The page's one dark band, so the scroll has a rest between the bright journey above and the
 * programmes below. The founding year is set huge in saffron: it is the whole argument of the
 * section in four characters.
 */
export default function About() {
  const { presence } = about;
  return (
    <section id="about" aria-labelledby="about-title" className="relative isolate overflow-hidden bg-v-night py-24 text-v-paper lg:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-70" style={flowerPrint("rgba(244,106,18,0.09)", 40)} />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_50%_at_85%_20%,rgba(244,106,18,0.28),transparent_70%),radial-gradient(40%_40%_at_0%_100%,rgba(201,74,10,0.22),transparent_70%)]"
      />

      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
          <Reveal>
            <Eyebrow tone="dark">{about.eyebrow}</Eyebrow>
            <Heading id="about-title" className="mt-5 max-w-[15ch] text-v-paper">
              {about.heading}
            </Heading>
            <Lead className="mt-6 text-v-paper/80">{about.description}</Lead>
          </Reveal>

          <div className="lg:justify-self-end lg:text-right">
            <Stagger className="flex overflow-hidden font-v-head text-[clamp(112px,15vw,232px)] leading-[0.82] font-extrabold tracking-[-0.05em] text-v-orange-500 lg:justify-end" gap={0.09}>
              {about.founded.split("").map((d, i) => (
                <StaggerItem key={i} className="pb-[0.04em]">
                  <span aria-hidden="true">{d}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <span className="sr-only">Founded in {about.founded}</span>
            <Reveal delay={0.35}>
              <p className="mt-4 flex items-center gap-2.5 font-v-body text-[15px] font-semibold tracking-[0.08em] text-v-paper/75 uppercase lg:justify-end">
                <Flower size={11} className="text-v-orange-500" />
                {about.founder}
              </p>
            </Reveal>
          </div>
        </div>

        <Stagger className="mt-20 grid gap-10 md:grid-cols-3 md:gap-12" gap={0.1}>
          {about.points.map((p, i) => {
            const Icon = pointIcons[i];
            return (
              <StaggerItem key={p.title}>
                <span className="grid size-14 place-items-center rounded-full bg-v-orange-500 text-v-ink">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-6 font-v-head text-[23px]/[1.15] font-bold text-v-paper">{p.title}</h3>
                <p className="mt-3 max-w-[40ch] font-v-body text-[16.5px]/[1.6] text-v-paper/75">{p.text}</p>
              </StaggerItem>
            );
          })}
        </Stagger>

        <div className="mt-24 grid items-center gap-12 lg:mt-32 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
          <Reveal className="relative pb-14 sm:pr-20 lg:pb-16">
            <img
              src="/images/gallery/campus.webp"
              alt="The Vajiram & Ravi institute building in Old Rajinder Nagar, New Delhi"
              width={1264}
              height={848}
              loading="lazy"
              className="aspect-[16/10] w-full rounded-[28px] object-cover"
            />
            <img
              src="/images/gallery/library.webp"
              alt="Aspirants studying together in the library"
              width={1264}
              height={848}
              loading="lazy"
              className="absolute right-0 bottom-0 aspect-[4/3] w-[42%] rotate-[2.5deg] rounded-[22px] object-cover ring-8 ring-v-night"
            />
            <p className="absolute top-5 left-5 flex items-center gap-2 rounded-full bg-v-orange-500 py-2 pr-4 pl-3 font-v-body text-[14.5px] font-bold text-v-ink shadow-lg">
              <LocationPinIcon className="size-5" />
              {presence.location}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <Eyebrow tone="dark">{presence.eyebrow}</Eyebrow>
            <Heading as="h3" className="mt-4 max-w-[14ch] text-v-paper">
              {presence.heading}
            </Heading>
            <p className="mt-5 max-w-[46ch] font-v-body text-[17.5px]/[1.6] text-v-paper/80">{presence.description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={presence.primary.href} variant="white" external>
                {presence.primary.label}
              </Button>
              <Button href={presence.secondary.href} variant="outline-light">
                {presence.secondary.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

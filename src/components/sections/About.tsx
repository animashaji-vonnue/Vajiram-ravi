import Image from "next/image";
import type { ReactNode } from "react";
import { Clock, Mail, MapPin, Phone } from "iconoir-react";
import { about, contact, location } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionIntro";
import { cx } from "@/lib/cx";

const pad = (n: number) => String(n).padStart(2, "0");

/** One numbered part of the section: a rule, the number and title in the serif, a line beside them, then its content. */
function Part({
  id,
  number,
  title,
  text,
  children,
}: {
  id?: string;
  number: number;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="mt-32 scroll-mt-[110px]">
      <div className="fade-up grid grid-cols-[1fr_440px] items-end gap-20 border-t border-ink-900/15 pt-10">
        <h3 className="flex items-baseline gap-5 font-serif text-[52px]/[1.02] tracking-[-0.015em] text-ink-900">
          <span className="font-sans text-[18px] font-semibold text-saffron-600 tabular-nums">{pad(number)}</span>
          {title}
        </h3>
        <p className="pb-1.5 text-[18px]/[29px] text-muted">{text}</p>
      </div>
      <div className="mt-12">{children}</div>
    </div>
  );
}

/**
 * About Vajiram & Ravi, on white, from the general to the particular. First who the institute is: the label, the
 * headline with its last sentence in saffron italic, the intro and the supporting statement, and on a paper panel
 * what it does best. Then three numbered parts: its proven track record (the key figures large), its online and
 * offline classes (a card for each, with a photograph), and its location (a photograph of the centre beside an orange card with the address, hours, phone,
 * email and a button for directions).
 */
export default function About() {
  const [lead, accent] = about.headline.split(/(?<=\.)\s+/);
  const { record, classes } = about;

  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-[76px] bg-white py-32">
      <div className="mx-auto w-canvas px-12">
        {/* Who we are. */}
        <div className="fade-up grid grid-cols-[1fr_480px] items-end gap-20">
          <div>
            <Eyebrow className="text-muted">{about.eyebrow}</Eyebrow>
            <h2
              id="about-title"
              className="mt-6 font-serif text-[76px]/[1] tracking-[-0.02em] text-balance text-ink-900"
            >
              {lead} <em className="text-saffron-600 italic">{accent}</em>
            </h2>
          </div>
          <div className="pb-2">
            <p className="text-[19px]/[30px] text-ink-900">{about.intro}</p>
            <p className="mt-6 border-t border-line pt-5 font-serif text-[22px]/[1.3] text-ink-900 italic">
              {about.statement}
            </p>
          </div>
        </div>

        {/* What we do best. */}
        <div className="fade-up mt-16 rounded-[28px] bg-paper px-10 pt-9 pb-11">
          <p className="text-[13px] font-semibold tracking-[0.16em] text-ink-900 uppercase">What we do best</p>
          <ul className="mt-8 grid grid-cols-3 gap-12">
            {about.best.map((item, i) => (
              <li key={item.name} className="border-t border-ink-900/15 pt-6">
                <span className="ember-pill flex size-10 items-center justify-center rounded-full text-[14px] font-semibold text-white">
                  {pad(i + 1)}
                </span>
                <h4 className="mt-5 font-serif text-[30px]/[1.1] text-ink-900">{item.name}</h4>
                <p className="mt-3 text-[16px]/[25px] text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* 01 · A proven track record. */}
        <Part id="track-record" number={1} title={record.title} text={record.text}>
          <dl className="grid grid-cols-4 border-y border-ink-900/15">
            {record.stats.map((stat, i) => (
              <div key={stat.label} className={cx("flex flex-col px-8 py-9", i > 0 && "border-l border-ink-900/15")}>
                <dt className="order-2 mt-4 text-[15px]/[20px] font-semibold text-ink-900">{stat.label}</dt>
                <dd className="order-1 font-serif text-[80px]/[0.9] tracking-[-0.02em] text-ink-900">{stat.value}</dd>
                <dd className="order-3 mt-1 text-[14px]/[20px] text-muted">{stat.text}</dd>
              </div>
            ))}
          </dl>
        </Part>

        {/* 02 · Online and offline classes. */}
        <Part id="classes" number={2} title={classes.title} text={classes.text}>
          <div className="grid grid-cols-2 gap-6">
            {classes.modes.map((mode) => (
              <article key={mode.name} className="fade-up group overflow-clip rounded-[28px] bg-paper">
                <div className="relative h-[360px] overflow-clip">
                  <Image
                    src={mode.photo}
                    alt=""
                    fill
                    sizes="660px"
                    className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
                  />
                  <span className="ember-pill absolute top-6 left-6 rounded-full px-4 py-2 text-[13px] font-semibold tracking-[0.08em] text-white uppercase">
                    {mode.tag}
                  </span>
                </div>
                <div className="p-10">
                  <h4 className="font-serif text-[44px]/[1] text-ink-900">{mode.name}</h4>
                  <p className="mt-4 max-w-[520px] text-[18px]/[28px] text-muted">{mode.text}</p>
                </div>
              </article>
            ))}
          </div>
        </Part>

        {/* 03 · Our location. */}
        <Part id="location" number={3} title={about.location.title} text={about.location.text}>
          <div className="grid grid-cols-[1.3fr_1fr] gap-6">
            <div className="fade-up relative min-h-[480px] overflow-clip rounded-[28px] bg-paper-deep">
              <Image
                src={about.location.photo}
                alt="The Vajiram & Ravi centre"
                fill
                sizes="760px"
                className="object-cover"
              />
            </div>
            <div className="ember fade-up flex flex-col rounded-[28px] p-12 text-white">
              <p className="text-[13px] font-semibold tracking-[0.16em] uppercase">Our centre</p>
              <h4 className="mt-5 font-serif text-[48px]/[1.02] tracking-[-0.015em]">{location.area}</h4>
              <ul className="mt-8 flex flex-col gap-4 text-[17px]/[25px]">
                <li className="flex gap-3.5">
                  <MapPin width={20} height={20} strokeWidth={1.7} className="mt-0.5 shrink-0" />
                  {location.address}
                </li>
                <li className="flex gap-3.5">
                  <Clock width={20} height={20} strokeWidth={1.7} className="mt-0.5 shrink-0" />
                  {contact.hours}
                </li>
                <li>
                  <a href={contact.phoneHref} className="flex gap-3.5 hover:text-glow">
                    <Phone width={20} height={20} strokeWidth={1.7} className="mt-0.5 shrink-0" />
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`} className="flex gap-3.5 hover:text-glow">
                    <Mail width={20} height={20} strokeWidth={1.7} className="mt-0.5 shrink-0" />
                    {contact.email}
                  </a>
                </li>
              </ul>
              <div className="mt-auto pt-10">
                <Button href={location.directions} tone="light">
                  Get directions
                </Button>
                <p className="mt-4 text-[14px] text-white/90">{location.others}</p>
              </div>
            </div>
          </div>
        </Part>
      </div>
    </section>
  );
}

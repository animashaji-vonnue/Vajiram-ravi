import Image from "next/image";
import { Clock, MapPin, Phone } from "iconoir-react";
import { about, contact, location } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionIntro";
import { cx } from "@/lib/cx";

/**
 * About Vajiram & Ravi, on white, kept short: the label and headline beside a one-paragraph intro; the track record
 * as four figures in a ruled strip; then three cards, for the Classroom (offline) and LIVE-Online classes and, on
 * orange, the centre's location with its hours, phone and a button for directions.
 */
export default function About() {
  const [lead, accent] = about.headline.split(/(?<=\.)\s+/);
  const { record, classes } = about;

  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-[76px] bg-white py-28">
      <div className="mx-auto w-canvas px-12">
        <div className="fade-up grid grid-cols-[1fr_480px] items-end gap-20">
          <div>
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <h2
              id="about-title"
              className="mt-6 font-serif text-[64px]/[1.02] tracking-[-0.015em] text-balance text-ink-900"
            >
              {lead} <em className="text-saffron-600 italic">{accent}</em>
            </h2>
          </div>
          <p className="pb-2 text-[18px]/[29px] text-muted">{about.intro}</p>
        </div>

        {/* The track record. */}
        <dl id="track-record" aria-label={record.title} className="mt-14 grid grid-cols-4 border-y border-ink-900/15">
          {record.stats.map((stat, i) => (
            <div key={stat.label} className={cx("flex flex-col px-8 py-7", i > 0 && "border-l border-ink-900/15")}>
              <dt className="order-2 mt-3 text-[15px]/[20px] font-semibold text-ink-900">{stat.label}</dt>
              <dd className="order-1 font-serif text-[56px]/[0.9] tracking-[-0.02em] text-ink-900">{stat.value}</dd>
              <dd className="order-3 text-[14px]/[20px] text-muted">{stat.text}</dd>
            </div>
          ))}
        </dl>

        {/* Online and offline classes, and the centre. */}
        <div className="mt-10 grid grid-cols-3 gap-6">
          {classes.modes.map((mode) => (
            <article key={mode.name} className="fade-up group overflow-clip rounded-[24px] bg-paper">
              <div className="relative h-[200px] overflow-clip">
                <Image
                  src={mode.photo}
                  alt=""
                  fill
                  sizes="440px"
                  className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
                />
                <span className="ember-pill absolute top-4 left-4 rounded-full px-3 py-1.5 text-[12px] font-semibold tracking-[0.08em] text-white uppercase">
                  {mode.tag}
                </span>
              </div>
              <div className="p-7">
                <h3 className="font-serif text-[32px]/[1] text-ink-900">{mode.name}</h3>
                <p className="mt-3 text-[16px]/[25px] text-muted">{mode.text}</p>
              </div>
            </article>
          ))}

          <article
            id="location"
            className="ember fade-up flex scroll-mt-[110px] flex-col rounded-[24px] p-8 text-white"
          >
            <p className="text-[12px] font-semibold tracking-[0.16em] uppercase">{about.location.title}</p>
            <h3 className="mt-4 font-serif text-[32px]/[1.05]">{location.area}</h3>
            <ul className="mt-5 flex flex-col gap-3 text-[16px]/[23px]">
              <li className="flex gap-3">
                <MapPin width={19} height={19} strokeWidth={1.7} className="mt-0.5 shrink-0" />
                {location.address}
              </li>
              <li className="flex gap-3">
                <Clock width={19} height={19} strokeWidth={1.7} className="mt-0.5 shrink-0" />
                {contact.hours}
              </li>
              <li>
                <a href={contact.phoneHref} className="flex gap-3 hover:text-glow">
                  <Phone width={19} height={19} strokeWidth={1.7} className="mt-0.5 shrink-0" />
                  {contact.phone}
                </a>
              </li>
            </ul>
            <div className="mt-auto pt-7">
              <Button href={location.directions} tone="light" size="md">
                Get directions
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

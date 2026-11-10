"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check } from "iconoir-react";
import { programmes } from "@/data/content";
import { Button } from "@/components/ui/Button";
import SectionIntro, { Eyebrow } from "@/components/ui/SectionIntro";
import { prefersReducedMotion } from "@/lib/motion";
import { cx } from "@/lib/cx";

/** How long each photograph of the featured programme stays before the next fades in. */
const PHOTO_MS = 4500;

/**
 * The featured programme, General Studies Prelims & Mains, on a glass panel over the orange: its photographs
 * fading from one to the next, and beside them its name, line, benefits, who it suits, how it can be taken, its
 * duration and two buttons.
 */
function Featured() {
  const { featured } = programmes;
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = setInterval(() => setPhoto((p) => (p + 1) % featured.photos.length), PHOTO_MS);
    return () => clearInterval(timer);
  }, [featured.photos.length]);

  return (
    <article
      aria-labelledby="featured-programme"
      className="fade-up mt-16 grid grid-cols-[560px_1fr] overflow-hidden rounded-[36px] bg-white/10 ring-1 ring-white/25 backdrop-blur-sm"
    >
      <div className="relative min-h-[640px] overflow-hidden">
        {featured.photos.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="560px"
            className="object-cover transition-[opacity,scale] duration-[1200ms] ease-out-soft"
            style={{ opacity: i === photo ? 1 : 0, scale: i === photo ? "1" : "1.06" }}
          />
        ))}
        <span className="absolute top-6 left-6 rounded-full bg-white px-4 py-2 text-[13px] font-semibold tracking-[0.08em] text-saffron-700 uppercase">
          {featured.tag}
        </span>
      </div>

      <div className="flex flex-col p-14">
        <h3 id="featured-programme" className="font-serif text-[56px]/[1.02] tracking-[-0.015em] text-balance">
          {featured.name}
        </h3>
        <p className="mt-4 font-serif text-[24px]/[1.3] text-glow italic">{featured.line}</p>

        <ul className="mt-9 flex flex-col gap-3.5">
          {featured.benefits.map((benefit) => (
            <li key={benefit} className="flex gap-3.5 text-[17px]/[25px]">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-saffron-600">
                <Check width={14} height={14} strokeWidth={2.4} />
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <dl className="mt-10 grid grid-cols-3 gap-8 border-t border-white/30 pt-7">
          {[
            ["Who it's for", featured.for],
            ["Learning options", featured.mode],
            ["Duration", featured.duration],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="text-[13px] font-semibold tracking-[0.14em] text-white/85 uppercase">{term}</dt>
              <dd className="mt-2 text-[16px]/[24px] text-white">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-wrap gap-3 pt-10">
          <Button href={featured.href} tone="light">
            {featured.cta}
          </Button>
          <Button href="#batches" tone="ghost-light">
            See upcoming batches
          </Button>
        </div>
      </div>
    </article>
  );
}

/**
 * Explore UPSC programmes, on the orange ground: the intro, the featured General Studies Prelims & Mains programme,
 * then the other programmes as numbered tabs along a rule, with a white bar that slides to the chosen one. Under
 * them, a panel for the chosen programme: its name in the serif, its line, who it is for, the learning options and
 * the duration in a ruled list, and a button, beside a large photograph. Changing the tab cross-fades the photograph
 * and brings the new text in.
 */
export default function Programmes() {
  const { categories } = programmes;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [bar, setBar] = useState({ left: 0, width: 0 });

  // The indicator bar follows the chosen tab.
  useLayoutEffect(() => {
    const tab = tabs.current[active];
    if (tab) setBar({ left: tab.offsetLeft, width: tab.offsetWidth });
  }, [active]);

  const programme = categories[active];

  return (
    <section id="programmes" aria-labelledby="programmes-title" className="ember scroll-mt-[76px] py-32 text-white">
      <div className="mx-auto w-canvas px-12">
        <SectionIntro
          id="programmes-title"
          tone="ember"
          eyebrow={programmes.eyebrow}
          headline={programmes.headline}
          description={programmes.description}
        />

        <Featured />

        <Eyebrow className="mt-28 text-white" rule="bg-glow">
          More UPSC programmes
        </Eyebrow>
        <div role="tablist" aria-label="More UPSC programmes" className="relative mt-8 flex border-b border-white/30">
          {categories.map((c, i) => (
            <button
              key={c.name}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`programme-tab-${i}`}
              aria-selected={i === active}
              aria-controls="programme-panel"
              onClick={() => setActive(i)}
              className={cx(
                "flex flex-1 items-baseline gap-3 pt-2 pb-5 text-left transition-colors",
                i === active ? "text-white" : "text-white/75 hover:text-white",
              )}
            >
              <span className="text-[13px] font-semibold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[18px]/[24px] font-semibold">{c.name}</span>
            </button>
          ))}
          <span
            aria-hidden="true"
            className="absolute -bottom-px h-[3px] rounded-full bg-white transition-[left,width] duration-500 ease-out-soft"
            style={{ left: bar.left, width: bar.width }}
          />
        </div>

        <div
          id="programme-panel"
          role="tabpanel"
          aria-labelledby={`programme-tab-${active}`}
          className="mt-12 grid grid-cols-[minmax(0,1fr)_640px] gap-16"
        >
          <div key={programme.name} className="stage-in flex flex-col">
            <h3 className="font-serif text-[60px]/[1] tracking-[-0.015em]">{programme.name}</h3>
            <p className="mt-5 font-serif text-[26px]/[1.3] text-glow italic">{programme.line}</p>
            <dl className="mt-10 border-t border-white/30">
              {[
                ["Who it's for", programme.for],
                ["Learning options", programme.mode],
                ["Duration", programme.duration],
              ].map(([term, value]) => (
                <div key={term} className="grid grid-cols-[180px_1fr] border-b border-white/30 py-5">
                  <dt className="text-[13px] font-semibold tracking-[0.14em] text-white/85 uppercase">{term}</dt>
                  <dd className="text-[17px]/[25px] text-white">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto flex flex-wrap gap-3 pt-10">
              <Button href={programme.href} tone="light">
                {programme.cta}
              </Button>
              <Button href="#counselling" tone="ghost-light">
                Not sure? Ask a counsellor
              </Button>
            </div>
          </div>

          <div className="relative h-[520px] overflow-hidden rounded-[28px] bg-rust">
            {categories.map((c, i) => (
              <Image
                key={c.name}
                src={c.photo}
                alt=""
                fill
                sizes="640px"
                className="object-cover transition-[opacity,scale] duration-[900ms] ease-out-soft"
                style={{ opacity: i === active ? 1 : 0, scale: i === active ? "1" : "1.05" }}
              />
            ))}
            <span className="absolute bottom-6 left-6 rounded-full bg-ink-950/70 px-4 py-2 text-[14px] font-semibold backdrop-blur-sm">
              {String(active + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

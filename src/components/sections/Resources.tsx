import Image from "next/image";
import { Archive, ArrowRight, ArrowUpRight, Journal, List, PageEdit } from "iconoir-react";
import { resources } from "@/data/content";
import { Button } from "@/components/ui/Button";
import SectionIntro from "@/components/ui/SectionIntro";

const ICONS = { Journal, Archive, List, PageEdit };

/** Where each cover of The Recitals sits in the fan, and how far it moves out when the panel is pointed at. */
const FAN = [
  { x: 0, r: 8, z: 4 },
  { x: -50, r: 2, z: 3 },
  { x: -100, r: -4, z: 2 },
  { x: -150, r: -10, z: 1 },
];

/**
 * Free study materials and resources, on paper: the intro, then The Recitals on an orange panel (its name, what it
 * is and a button, with recent covers fanned in the corner, which spread when the panel is pointed at) beside the
 * other free resources (current affairs, previous year papers, the syllabus and model answers) as cards, each with
 * an icon, its name, a line and a link.
 */
export default function Resources() {
  const { recitals } = resources;
  return (
    <section id="resources" aria-labelledby="resources-title" className="scroll-mt-[76px] bg-paper py-32">
      <div className="mx-auto w-canvas px-12">
        <SectionIntro
          id="resources-title"
          eyebrow={resources.eyebrow}
          headline={resources.headline}
          description={resources.description}
        />

        <div className="mt-16 grid grid-cols-[1.2fr_1fr] gap-6">
          <article className="ember group fade-up flex min-h-[600px] flex-col rounded-[32px] p-12 text-white">
            <p className="text-[13px] font-semibold tracking-[0.16em] text-white uppercase">{recitals.tag}</p>
            <h3 className="mt-5 font-serif text-[72px]/[1] tracking-[-0.02em]">{recitals.name}</h3>
            <p className="mt-5 max-w-[360px] text-[17px]/[27px] text-white/95">{recitals.text}</p>
            <div className="mt-9">
              <Button href={recitals.href} tone="light">
                {recitals.cta}
              </Button>
            </div>

            {/* Recent covers, fanned in the corner. */}
            <div aria-hidden="true" className="absolute right-14 bottom-12 h-[233px] w-[180px]">
              {recitals.covers.map((src, i) => {
                const { x, r, z } = FAN[i];
                return (
                  <span
                    key={src}
                    className="absolute inset-0 overflow-hidden rounded-[10px] shadow-[0_24px_40px_-18px_rgb(60_15_0/0.7)] ring-1 ring-black/10 transition-transform duration-700 ease-out-soft [transform:translateX(var(--x))_rotate(var(--r))] group-hover:[transform:translateX(calc(var(--x)*1.35))_translateY(-10px)_rotate(calc(var(--r)*1.4))]"
                    style={{ zIndex: z, ["--x" as string]: `${x}px`, ["--r" as string]: `${r}deg` }}
                  >
                    <Image src={src} alt="" fill sizes="180px" className="object-cover" />
                  </span>
                );
              })}
            </div>
          </article>

          <ul className="grid grid-cols-2 gap-6">
            {resources.list.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <li key={item.name} className="fade-up">
                  <a
                    href={item.href}
                    className="group flex h-full flex-col rounded-[28px] bg-white p-8 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_50px_-30px_rgb(40_20_5/0.35)]"
                  >
                    <span className="ember-pill flex size-12 items-center justify-center rounded-full text-white">
                      <Icon width={22} height={22} strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-8 font-serif text-[32px]/[1.05] text-ink-900">{item.name}</h3>
                    <p className="mt-3 text-[16px]/[25px] text-muted">{item.text}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-semibold text-ink-900 group-hover:text-saffron-600">
                      Open
                      <ArrowRight
                        width={17}
                        height={17}
                        strokeWidth={1.8}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <a
          href="#"
          className="group mt-10 inline-flex items-center gap-2 text-[16px] font-semibold text-ink-900 hover:text-saffron-600"
        >
          See all free resources
          <ArrowUpRight
            width={18}
            height={18}
            strokeWidth={1.8}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </section>
  );
}

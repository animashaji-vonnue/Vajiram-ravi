"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "iconoir-react";
import { mentors } from "@/data/content";
import SectionIntro from "@/components/ui/SectionIntro";
import { cx } from "@/lib/cx";

/**
 * Meet our educators, on the orange ground: the intro, then one educator featured large (a tall portrait beside their name,
 * subject, qualifications, experience, a short introduction and a link to their full profile) and the others in a
 * supporting row of tall portraits. Pointing at a supporting portrait reveals the educator's subject; choosing it
 * brings them into the feature with a cross-fade. No small circular photos or uniform cards.
 */
export default function Mentors() {
  const list = mentors.list;
  const [featured, setFeatured] = useState(0);
  const mentor = list[featured];

  return (
    <section id="educators" aria-labelledby="mentors-title" className="ember scroll-mt-[76px] py-32 text-white">
      <div className="mx-auto w-canvas px-12">
        <SectionIntro
          id="mentors-title"
          tone="ember"
          eyebrow={mentors.eyebrow}
          headline={mentors.headline}
          description={mentors.description}
          statement={mentors.statement}
        />

        <div className="mt-16 grid grid-cols-[520px_1fr] gap-14">
          <div className="relative h-[660px] overflow-hidden rounded-[30px] bg-rust">
            {list.map((m, i) => (
              <Image
                key={m.name}
                src={m.photo}
                alt={i === featured ? `${m.name}, ${m.subject}` : ""}
                fill
                sizes="520px"
                className="object-cover transition-[opacity,scale] duration-[900ms] ease-out-soft"
                style={{ opacity: i === featured ? 1 : 0, scale: i === featured ? "1" : "1.05" }}
              />
            ))}
          </div>

          <div className="flex flex-col">
            <div key={mentor.name} className="stage-in">
              <p className="text-[13px] font-semibold tracking-[0.16em] text-glow uppercase">{mentor.subject}</p>
              <h3 className="mt-4 font-serif text-[72px]/[1] tracking-[-0.015em]">{mentor.name}</h3>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-white/30 py-6">
                <div>
                  <dt className="text-[13px] font-semibold tracking-[0.14em] text-white/85 uppercase">
                    Qualifications
                  </dt>
                  <dd className="mt-2 text-[17px]/[25px]">{mentor.credentials}</dd>
                </div>
                <div>
                  <dt className="text-[13px] font-semibold tracking-[0.14em] text-white/85 uppercase">Experience</dt>
                  <dd className="mt-2 text-[17px]/[25px]">{mentor.experience}</dd>
                </div>
              </dl>
              <p className="mt-6 max-w-[620px] text-[18px]/[29px] text-white/95">{mentor.intro}</p>
              <a
                href={mentor.href}
                className="group mt-8 inline-flex items-center gap-2 text-[16px] font-semibold text-white underline-offset-8 hover:underline"
              >
                View full profile
                <ArrowUpRight
                  width={18}
                  height={18}
                  strokeWidth={1.8}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>

            {/* The other educators: tall portraits that reveal their subject on hover and come forward when chosen. */}
            <ul
              className="mt-auto grid gap-3 pt-10"
              style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }}
            >
              {list.map((m, i) => (
                <li key={m.name}>
                  <button
                    type="button"
                    aria-pressed={i === featured}
                    aria-label={`${m.name}, ${m.subject}`}
                    onClick={() => setFeatured(i)}
                    className={cx(
                      "group relative block h-[220px] w-full overflow-hidden rounded-[20px] text-left transition-opacity",
                      i === featured ? "ring-2 ring-white" : "opacity-80 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={m.photo}
                      alt=""
                      fill
                      sizes="200px"
                      className="object-cover grayscale-[40%] transition-[scale,filter] duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <span className="absolute inset-0 bg-linear-to-t from-ink-950/95 via-ink-950/20 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-3">
                      <span className="block text-[14px]/[18px] font-semibold">{m.name}</span>
                      <span className="grid grid-rows-[0fr] text-[12px]/[16px] text-white/90 transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                        <span className="overflow-hidden">
                          <span className="block pt-1">{m.subject}</span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex justify-end">
          <a
            href="#"
            className="group inline-flex items-center gap-2 text-[16px] font-semibold text-white hover:text-glow"
          >
            Meet all our faculty
            <ArrowRight
              width={18}
              height={18}
              strokeWidth={1.8}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play } from "iconoir-react";
import { hero, stories } from "@/data/content";
import SectionIntro from "@/components/ui/SectionIntro";
import { cx } from "@/lib/cx";

type Story = {
  name: string;
  rank?: number;
  year?: number;
  photo?: string;
  film?: string;
  programme: string;
  support: string;
  improvement: string;
  outcome: string;
};

/**
 * The stories for each category. None is written for anyone: success stories carry the CSE 2025 achievers' names,
 * ranks and photos (their rank is the verified outcome) with their films and words still to be recorded, and the
 * other two categories hold clearly marked slots, with stand-in films, until real students' stories are in.
 */
const SLOT = {
  programme: "[The programme they chose]",
  support: "[The academic support that helped them]",
  improvement: "[What improved in their preparation]",
  outcome: "[Their verified outcome]",
};
const STORIES: Record<(typeof stories.categories)[number], Story[]> = {
  "Preparation experience": [0, 1, 2].map((i) => ({
    name: "[Student name]",
    film: stories.films[i % stories.films.length],
    ...SLOT,
  })),
  "Faculty experience": [0, 1].map((i) => ({
    name: "[Student name]",
    film: stories.films[(i + 1) % stories.films.length],
    ...SLOT,
  })),
  "Success stories": hero.years[2025].slice(0, 5).map((a) => ({
    name: a.name,
    rank: a.rank,
    year: a.year,
    photo: a.photo,
    ...SLOT,
    programme: a.programme,
    outcome: `AIR ${a.rank}, CSE ${a.year}`,
  })),
};

/**
 * Student stories, on white: the intro, a switch between the three categories, and a featured story (a large film,
 * or the achiever's portrait until their film is recorded, beside their name, rank and year, the programme they
 * chose, the academic support they had, what improved and their verified outcome) above a film strip of the
 * category's stories. Films never play on their own or with
 * sound until asked.
 */
export default function Stories() {
  const [category, setCategory] = useState<(typeof stories.categories)[number]>(stories.categories[0]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const film = useRef<HTMLVideoElement>(null);
  const list = STORIES[category];
  const story = list[Math.min(index, list.length - 1)];

  const choose = (i: number) => {
    setIndex(i);
    setPlaying(false);
  };

  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => void film.current?.play());
  };

  return (
    <section id="stories" aria-labelledby="stories-title" className="scroll-mt-[76px] bg-white py-32">
      <div className="mx-auto w-canvas px-12">
        <SectionIntro
          id="stories-title"
          eyebrow={stories.eyebrow}
          headline={stories.headline}
          description={stories.description}
          statement={stories.statement}
        />

        <div role="tablist" aria-label="Story categories" className="mt-14 inline-flex rounded-full bg-paper p-1.5">
          {stories.categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={c === category}
              onClick={() => {
                setCategory(c);
                choose(0);
              }}
              className={cx(
                "h-11 rounded-full px-6 text-[15px] font-semibold transition-colors",
                c === category ? "ember-pill text-white" : "text-ink-900/70 hover:text-ink-900",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div key={`${category}-${index}`} className="stage-in mt-10 grid grid-cols-[780px_1fr] gap-14">
          <div className="relative h-[440px] overflow-hidden rounded-[28px] bg-ink-900">
            {story.film ? (
              <>
                <video
                  ref={film}
                  src={story.film}
                  preload="metadata"
                  playsInline
                  controls={playing}
                  className="absolute inset-0 size-full object-cover"
                />
                {!playing && (
                  <button
                    type="button"
                    onClick={play}
                    aria-label={`Play ${story.name}'s story`}
                    className="group absolute inset-0 flex items-center justify-center bg-ink-950/30"
                  >
                    <span className="flex size-20 items-center justify-center rounded-full bg-white text-ink-900 transition-transform duration-300 group-hover:scale-110">
                      <Play width={30} height={30} className="translate-x-0.5" />
                    </span>
                  </button>
                )}
              </>
            ) : (
              <>
                {story.photo && (
                  <Image src={story.photo} alt={story.name} fill sizes="780px" className="object-cover object-top" />
                )}
                <span className="absolute bottom-5 left-5 rounded-full bg-ink-950/75 px-4 py-2 text-[14px] font-semibold text-white backdrop-blur-sm">
                  Film to be recorded
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {story.rank && (
              <p className="font-serif text-[22px] text-saffron-600">
                AIR {story.rank} · CSE {story.year}
              </p>
            )}
            <h3 className="mt-2 font-serif text-[54px]/[1.02] text-ink-900">{story.name}</h3>
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-6">
              {[
                ["Programme", story.programme],
                ["Academic support", story.support],
                ["What improved", story.improvement],
                ["Outcome", story.outcome],
              ].map(([term, value]) => (
                <div key={term}>
                  <dt className="text-[13px] font-semibold tracking-[0.14em] text-muted uppercase">{term}</dt>
                  <dd className="mt-2 text-[17px]/[26px] text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* The film strip: every story in the category, the featured one marked. */}
        <ul className="mt-10 flex gap-4 overflow-x-auto pb-2">
          {list.map((s, i) => (
            <li key={`${s.name}-${i}`} className="shrink-0">
              <button
                type="button"
                aria-pressed={i === index}
                onClick={() => choose(i)}
                className={cx(
                  "group relative block h-[150px] w-[230px] overflow-hidden rounded-[18px] bg-ink-900 text-left text-white transition-opacity",
                  i === index ? "ring-2 ring-saffron-500 ring-offset-2" : "opacity-75 hover:opacity-100",
                )}
              >
                {s.photo ? (
                  <Image src={s.photo} alt="" fill sizes="230px" className="object-cover object-top" />
                ) : (
                  s.film && (
                    <video
                      src={s.film}
                      preload="metadata"
                      muted
                      playsInline
                      className="absolute inset-0 size-full object-cover"
                    />
                  )
                )}
                <span className="absolute inset-0 bg-linear-to-t from-ink-950/90 to-transparent" />
                <span className="absolute bottom-3 left-3.5">
                  <span className="block text-[14px]/[18px] font-semibold">{s.name}</span>
                  {s.rank && (
                    <span className="block text-[12px] text-white/70">
                      AIR {s.rank} · CSE {s.year}
                    </span>
                  )}
                </span>
                {s.film && (
                  <span className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-ink-900">
                    <Play width={14} height={14} />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

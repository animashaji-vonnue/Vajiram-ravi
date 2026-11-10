"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check, GraduationCap } from "iconoir-react";
import { journey } from "@/data/content";
import { Eyebrow } from "@/components/ui/SectionIntro";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { clamp01, followScroll } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/motion";
import { cx } from "@/lib/cx";

type Stage = (typeof journey.stages)[number];

/** How far, in canvas pixels, the page scrolls to bring the next stage's card to the front. */
const STEP = 640;
/** How much further the page scrolls with the last card at the front before the deck moves on with the page. */
const END_HOLD = 320;
/** The share of each step for which the front card stays still before it lifts away. */
const HOLD = 0.3;
/** The header's height; the deck is held just under it. */
const HEADER = 76;
/** How often the front card adds the next piece of support. */
const TICK_MS = 1100;

const pad = (n: number) => String(n).padStart(2, "0");
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * The note floating at the foot of a stage's card, after lassie.ai's "Lassie working…" card: the institute's support
 * for the stage (its programmes, assessments and resources) coming in one by one, each marked with what it is.
 */
function StageNote({ stage, index, count, done }: { stage: Stage; index: number; count: number; done: number }) {
  const complete = done >= stage.support.length;
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-[520px] rounded-[22px] bg-paper/95 p-3 shadow-[0_24px_50px_-20px_rgb(20_10_0/0.45)] ring-1 ring-ink-900/5 backdrop-blur-md"
    >
      <div className="flex items-center justify-between px-2.5 pt-1.5 pb-3">
        <p className="flex items-center gap-2.5 text-[16px] font-semibold text-ink-900">
          <span className="flex size-7 items-center justify-center rounded-full bg-saffron-500 text-white">
            <GraduationCap width={16} height={16} strokeWidth={1.8} />
          </span>
          {complete ? `How we support your ${stage.name}` : `Preparing for ${stage.name}…`}
        </p>
        <span className="text-[13px] text-muted">
          Stage {index + 1} of {count}
        </span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {stage.support.map((item, j) => {
          const state = j < done ? "done" : j === done ? "now" : "next";
          return (
            <li key={item.label} className="flex items-center gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center">
                {state === "done" ? (
                  <span className="flex size-5 items-center justify-center rounded-full bg-saffron-500 text-white">
                    <Check width={13} height={13} strokeWidth={2.4} />
                  </span>
                ) : state === "now" ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-saffron-500 border-t-transparent motion-reduce:animate-none" />
                ) : (
                  <span className="size-4 rounded-full border border-ink-900/20" />
                )}
              </span>
              <span
                className={cx(
                  "flex h-11 flex-1 items-center justify-between gap-4 rounded-[12px] px-4 text-[15px] transition-colors duration-500",
                  state === "next" ? "bg-white/55 text-muted" : "bg-white text-ink-900",
                )}
              >
                {item.label}
                <span
                  className={cx(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-semibold transition-colors duration-500",
                    state === "done" ? "bg-saffron-50 text-saffron-700" : "text-muted",
                  )}
                >
                  {item.kind}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The UPSC preparation journey and how the institute supports it, after lassie.ai's "AI that runs the doctor's
 * office": the intro centred, then the examination's three stages (Prelims, Mains, the Personality Test) as a deck of
 * large rounded cards, each with a drawing of the stage, held under the header while the page scrolls. The front
 * card holds for a moment, then lifts up and away, and the card behind it comes forward to take its place. The cards
 * waiting behind peek out under the front one, a little smaller and in shade. Beside the front card, on alternate
 * sides, the stage's name and what it requires rise in; over its lower edge, a note gathers the institute's
 * programmes, assessments and resources for that stage. With reduced motion the cards simply take turns.
 */
export default function Journey() {
  const { stages } = journey;
  const count = stages.length;
  const track = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLOListElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const shades = useRef<(HTMLDivElement | null)[]>([]);
  const notes = useRef<(HTMLDivElement | null)[]>([]);
  const captions = useRef<(HTMLDivElement | null)[]>([]);
  const [front, setFront] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const still = prefersReducedMotion();
    return followScroll(
      () => -canvasTop(el),
      (scrolled) => {
        const viewport = window.innerHeight / getCanvasZoom();
        const top = -scrolled;
        // How far the deck has come up into the window before it is held (0 → 1), then how far through the stages
        // the page has scrolled, held still for the first part of each step and eased through the rest.
        const enter = clamp01((viewport - top) / Math.max(viewport - HEADER, 1));
        const raw = Math.min(count - 1, Math.max(0, (HEADER - top) / STEP));
        const whole = Math.floor(raw);
        const at = whole + easeInOut(clamp01((raw - whole - HOLD) / (1 - HOLD)));
        const cardHeight = deck.current?.offsetHeight ?? 500;
        const away = (viewport - HEADER) / 2 + cardHeight / 2 + 160;
        const current = Math.round(at);

        for (let i = 0; i < count; i++) {
          const card = cards.current[i];
          const shade = shades.current[i];
          const note = notes.current[i];
          const caption = captions.current[i];
          if (!card || !shade || !note || !caption) continue;
          const d = i - at;
          let y = 0;
          let scale = 1;
          let opacity = 1;
          let dim = 0;
          let shown = clamp01(1 - Math.abs(d) * 2.2) * (i === 0 ? enter : 1);
          if (still) {
            opacity = i === current ? 1 : 0;
            shown = opacity;
          } else if (d >= 0) {
            // Waiting behind: smaller, lower, in shade. The first card also settles in as the deck arrives.
            y = d * 28;
            scale = 1 - d * 0.055;
            opacity = clamp01(3 - d);
            dim = Math.min(0.45, d * 0.3);
            if (i === 0) {
              scale *= 0.94 + 0.06 * enter;
              y += (1 - enter) * 48;
            }
          } else {
            // Leaving: lifted up and out of the window.
            const gone = Math.min(-d, 1);
            y = -gone * away;
            opacity = gone >= 1 ? 0 : 1;
          }
          card.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
          card.style.opacity = String(opacity);
          card.style.visibility = opacity === 0 ? "hidden" : "visible";
          shade.style.opacity = String(dim);
          note.style.opacity = String(still ? opacity : clamp01(1 - Math.abs(d) * 2.5));
          caption.style.opacity = String(shown);
          caption.style.transform = `translate3d(0, ${still ? 0 : d * 40}px, 0)`;
        }
        setFront(Math.min(count - 1, Math.max(0, current)));
      },
      70,
    );
  }, [count]);

  // The front card gathers its support, one piece every little while; with reduced motion it shows complete.
  useEffect(() => {
    const total = stages[front].support.length;
    if (prefersReducedMotion()) {
      setTick(total);
      return;
    }
    setTick(0);
    const timer = setInterval(() => setTick((t) => Math.min(t + 1, total)), TICK_MS);
    return () => clearInterval(timer);
  }, [front, stages]);

  return (
    <section id="journey" aria-labelledby="journey-title" className="scroll-mt-[76px] bg-paper pt-36 pb-28">
      <div className="fade-up mx-auto flex w-canvas flex-col items-center px-12 text-center">
        <Eyebrow className="text-muted">{journey.eyebrow}</Eyebrow>
        <h2
          id="journey-title"
          className="mt-7 max-w-[900px] font-serif text-[76px]/[1] tracking-[-0.02em] text-balance text-ink-900"
        >
          {journey.headline}
        </h2>
        <p className="mt-8 max-w-[600px] text-[18px]/[29px] text-muted">{journey.description}</p>
        <p className="mt-5 font-serif text-[22px]/[1.3] text-ink-900 italic">{journey.statement}</p>
      </div>

      {/* The track the deck is held in while the page scrolls through the three stages. */}
      <div
        ref={track}
        className="mt-24"
        style={{ height: `calc(var(--vh, 100vh) + ${STEP * (count - 1) + END_HOLD}px)` }}
      >
        <div className="sticky top-[76px] flex h-[calc(var(--vh,100vh)-76px)] items-center justify-center">
          <ol
            ref={deck}
            aria-label="Stages of the examination"
            className="relative mb-16 h-[min(500px,calc(var(--vh,100vh)-260px))] w-[780px]"
          >
            {stages.map((s, i) => (
              <li key={s.name} className="absolute inset-0" style={{ zIndex: count - i }}>
                <div
                  ref={(node) => {
                    cards.current[i] = node;
                  }}
                  className="absolute inset-0 origin-bottom will-change-transform"
                >
                  {/* The stage, drawn: a test with an answer sheet, written answers, the interview board. */}
                  <div className="absolute inset-0 overflow-clip rounded-[40px] bg-paper-deep shadow-[0_30px_60px_-34px_rgb(40_20_5/0.5)] ring-1 ring-ink-900/10">
                    <Image src={s.photo} alt="" fill sizes="780px" className="object-cover" />
                    {/* A shade that deepens on the cards waiting behind. */}
                    <div
                      ref={(node) => {
                        shades.current[i] = node;
                      }}
                      className="absolute inset-0 bg-ink-950 opacity-0"
                    />
                  </div>
                  {/* The support note, over the lower part of the card and past its edge. */}
                  <div
                    ref={(node) => {
                      notes.current[i] = node;
                    }}
                    className="absolute inset-x-0 top-[62%]"
                  >
                    <StageNote
                      stage={s}
                      index={i}
                      count={count}
                      done={i < front ? s.support.length : i === front ? tick : 0}
                    />
                  </div>
                </div>

                {/* The stage's name and what it requires, beside the card on alternate sides. */}
                <div
                  ref={(node) => {
                    captions.current[i] = node;
                  }}
                  className={cx(
                    "absolute bottom-[10%] w-[250px]",
                    i % 2 === 0 ? "right-[calc(100%+48px)]" : "left-[calc(100%+48px)]",
                  )}
                >
                  <p className="text-[13px] font-semibold tracking-[0.16em] text-saffron-600 uppercase">
                    Stage {pad(i + 1)} · {s.full}
                  </p>
                  <h3 className="mt-3 font-serif text-[44px]/[1] tracking-[-0.01em] text-balance text-ink-900">
                    {s.name}
                  </h3>
                  <p className="mt-5 text-[13px] font-semibold tracking-[0.14em] text-ink-900 uppercase">
                    What it requires
                  </p>
                  <p className="mt-2 text-[15px]/[24px] text-muted">{s.requires}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

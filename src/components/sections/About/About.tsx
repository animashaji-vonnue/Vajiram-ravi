"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { aboutIntro, institutionCards, type InstitutionCard, type InstitutionIcon } from "@/data/about";
import { getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/motion";

/*
 * The scroll story, as shares of the pinned run (0 to 1):
 *   text     the heading has revealed itself on arrival, in the middle; through TEXT_UP it rises with its
 *            lead to the top of the band, where both stay
 *   stack    through STACK_IN the six cards rise together from below the band as one loose stack
 *   fan      through FAN the stack splits into the curved arc of Figma 2397:6766, card 01 at the front
 *   turn     through TURN the arc turns, resting on each card for a while at the front (in its dark look),
 *            while the glow behind takes that card's colour (after React Bits' "Gradient Carousel")
 */
const RUN = 2400;
const TEXT_UP = [0.04, 0.16] as const;
const STACK_IN = [0.16, 0.3] as const;
const FAN = [0.32, 0.44] as const;
const TURN = [0.48, 0.98] as const;
/** Where the heading rises to: its block's centre, on the stage. */
const TEXT_TOP_Y = 222;

/** The arc (Figma 2397:6766): the cards on a wheel 1600 px across, 11° apart; side cards at 264/280. */
const RADIUS = 1600;
const STEP_DEG = 11;
const SIDE_SCALE = 264 / 280;
/** The front card's centre on the 1440 × 900 stage. */
const CARD_CENTRE_Y = 548;
/** The stack's loose angles, in card order. */
const PILE_TILT = [-5, 4, -2.5, 6, -7, 2];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const span = (p: number, [a, b]: readonly [number, number]) => clamp01((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/**
 * The carousel's place for a share `t` of the turn: it moves from one card to the next in the middle half
 * of each step and rests on each card for the quarters either side, so the front card is always settled
 * (and readable) when the page stops.
 */
const restingTurn = (t: number, steps: number) => {
  const raw = t * steps;
  const base = Math.min(steps - 1, Math.floor(raw));
  const f = clamp01((raw - base - 0.12) / 0.76);
  return base + (0.5 - Math.cos(Math.PI * f) / 2);
};
/** Distance in places from the front, wrapped round the six cards: [-3, 3). */
const wrap = (n: number, count: number) => ((((n + count / 2) % count) + count) % count) - count / 2;

/**
 * About Vajiram & Ravi (IA 3): one pinned screen on the hero's orange gradient, with Parliament House
 * faint in it, told as a short film while the page scrolls on through it (the timings above):
 *   1. As it arrives, the eyebrow, the two-line heading and the lead reveal themselves in the middle, each
 *      word rising out of its line.
 *   2. Scrolling on, the heading and its lead rise to the top of the band and stay there.
 *   3. The six cards rise together from below as one loose stack.
 *   4. The stack splits and the cards fan out along the curve of the Figma arc (2397:6766).
 *   5. Scrolling on turns the arc, resting on each card at the front in its dark look, while a glow behind
 *      the arc takes on that card's colour.
 * Then the band lets go and the page goes on. On a screen shorter than the stage the stage scales down to
 * fit. The cards stay in the page in order for assistive technology. Reduced motion: no pin; the heading
 * and the arc are simply there.
 */
export default function About() {
  const { heading } = aboutIntro;
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [still, setStill] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [front, setFront] = useState(0);
  const count = institutionCards.length;

  useEffect(() => {
    const reduced = prefersReducedMotion();
    setStill(reduced);
    if (reduced) {
      setArrived(true);
      return;
    }
    // The text reveals itself as the band arrives.
    const frame = frameRef.current;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setArrived(true), { threshold: 0.45 });
    if (frame) io.observe(frame);

    let raf = 0;
    let shownFront = -1;
    let smooth = -1;
    const update = () => {
      raf = 0;
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;
      const zoom = getCanvasZoom();
      const screen = window.innerHeight / zoom;
      stage.style.transform = `scale(${Math.min(1, screen / 900).toFixed(4)})`;
      // The scroll's share of the run, eased towards smoothly frame by frame, so the cards glide.
      const goal = clamp01(-track.getBoundingClientRect().top / zoom / RUN);
      smooth = smooth < 0 ? goal : smooth + (goal - smooth) * 0.14;
      if (Math.abs(goal - smooth) < 0.0004) smooth = goal;
      const p = smooth;
      if (smooth !== goal) raf = requestAnimationFrame(update);

      // 2. The heading and its lead rise to the top together, a little smaller, and stay.
      const up = easeInOut(span(p, TEXT_UP));
      const text = textRef.current;
      if (text) {
        text.style.transform = `translate(-50%, calc(-50% - ${(up * (450 - TEXT_TOP_Y)).toFixed(1)}px)) scale(${(1 - up * 0.16).toFixed(4)})`;
      }

      // 3–5. The cards: in from below as one stack, then the arc, then the turning carousel.
      const rise = easeOut(span(p, STACK_IN));
      const fan = easeInOut(span(p, FAN));
      const position = restingTurn(span(p, TURN), count - 1);
      const at = Math.round(position);
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        // The stack rises as one; the cards lower in the pile come up a touch later, so it lands with weight.
        const lift = clamp01(rise * 1.15 - i * 0.03);
        const below = (1 - easeOut(lift)) * 760;
        const offset = wrap(i - position, count) * fan;
        const distance = Math.abs(offset);
        const scale = 1 - (1 - SIDE_SCALE) * Math.min(1, distance);
        const tilt = PILE_TILT[i] * (1 - fan);
        // In the stack card 01 lies on top; on the arc the front one does.
        const z = fan < 0.5 ? count - i : 10 - Math.round(distance * 2);
        const fade = clamp01((3 - distance) / 0.5);
        el.style.transform = `translateY(${below.toFixed(1)}px) translateY(${RADIUS}px) rotate(${(offset * STEP_DEG).toFixed(3)}deg) translateY(${-RADIUS}px) rotate(${tilt.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
        el.style.opacity = String(Math.min(lift > 0 ? 1 : 0, fade));
        el.style.zIndex = String(z);
        // The dark look follows the card at the front: full while it rests there, gone a third of a place out.
        const darkness = fan > 0.6 ? clamp01(1 - distance * 3) : i === 0 ? fan : 0;
        el.querySelectorAll<HTMLElement>("[data-dark]").forEach((layer) => (layer.style.opacity = String(darkness)));
        const light = el.querySelector<HTMLElement>("[data-light]");
        if (light) light.style.opacity = String(1 - darkness);
      });

      // The glow behind the arc takes the front card's colour.
      const glow = glowRef.current;
      if (glow) glow.style.opacity = String(0.7 * fan);
      if (at !== shownFront) {
        shownFront = at;
        setFront(at);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count]);

  const words = (text: string, from: number, className?: string) =>
    text.split(" ").map((word, i) => (
      <Fragment key={`${word}-${i}`}>
      {i > 0 && " "}
      <span className="inline-block overflow-clip pb-[0.08em] align-top">
        <span
          className={cx("inline-block [transition:translate_900ms_cubic-bezier(0.22,1,0.36,1),opacity_900ms_cubic-bezier(0.22,1,0.36,1)]", className)}
          style={{
            translate: arrived ? "0 0" : "0 105%",
            opacity: arrived ? 1 : 0,
            transitionDelay: still ? "0ms" : `${(from + i) * 45}ms`,
          }}
        >
          {word}
        </span>
      </span>
      </Fragment>
    ));

  const leadWords = heading.lead.split(" ").length;
  const tint = institutionCards[front]?.paper[1] ?? institutionCards[0].paper[1];

  return (
    <section id="about" aria-labelledby="about-h" className="relative isolate">
      <div ref={trackRef} className="relative" style={{ height: still ? undefined : `calc(100svh / var(--canvas-zoom, 1) + ${RUN}px)` }}>
        <div
          ref={frameRef}
          className={cx("relative flex items-center justify-center overflow-clip", still ? "py-16" : "sticky top-0 h-[calc(100svh/var(--canvas-zoom,1))]")}
          style={{
            backgroundColor: "#ed781c",
            backgroundImage:
              "radial-gradient(50% 50% at 50% 50%, rgb(255 217 153 / 0.25), rgb(255 217 153 / 0)), linear-gradient(143.9deg, #fab85c 7.69%, #ed781c 46.15%, #b8400f 84.62%)",
          }}
        >
          {/* Parliament House, mirrored, multiplied faintly into the orange. Decoration. */}
          <img
            src="/images/about/parliament.webp"
            alt=""
            aria-hidden="true"
            width={1920}
            height={1086}
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute bottom-0 left-1/2 w-[max(107%,1542px)] max-w-none -translate-x-1/2 -scale-x-100 opacity-[0.14] mix-blend-multiply"
          />
          {/* The glow behind the arc, in the colour of the card at the front. */}
          <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[620px] w-[980px] -translate-x-1/2 -translate-y-[40%] rounded-full opacity-0 blur-[90px] [transition:background-color_700ms_var(--ease-out)]"
            style={{ backgroundColor: still ? "transparent" : tint }}
          />

          <div ref={stageRef} className="relative h-[900px] w-[1440px] shrink-0 origin-center">
            {/* 1–2. The heading, centred: it reveals itself on arrival, then rises to the top of the band. */}
            <div
              ref={textRef}
              className={cx("absolute left-1/2 z-20 flex w-[1240px] flex-col items-center gap-5 text-center", still ? "top-16" : "top-1/2")}
              style={{ transform: still ? "translateX(-50%)" : "translate(-50%, -50%)" }}
            >
              {/* Two lines: the first sentence pair, then the emphasis. */}
              <h2 id="about-h" className="font-heading text-[52px]/[1.1] font-normal tracking-[-0.02em] whitespace-nowrap text-white">
                {words(heading.lead, 0)}{" "}
                <br />
                {words(heading.emphasis, leadWords, "text-[#fff1c2]")}
              </h2>
              <p
                data-lead
                className="w-[1000px] text-[18px]/[1.6] text-white/92 [transition:opacity_900ms_var(--ease-out),translate_900ms_var(--ease-out)]"
                style={{ opacity: arrived ? 1 : 0, translate: arrived ? "0 0" : "0 16px", transitionDelay: still ? "0ms" : "650ms" }}
              >
                {aboutIntro.lead}
              </p>
            </div>

            {/* 3–5. The cards: a stack, then the arc, then the turning carousel. */}
            <ul aria-label="Why Vajiram & Ravi" className={cx(still && "relative top-[330px] h-[560px]")}>
              {institutionCards.map((card, i) => (
                <li
                  key={card.number}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="absolute left-[580px] h-[388px] w-[280px] will-change-transform"
                  style={
                    still
                      ? {
                          top: 0,
                          transform: `translateY(${RADIUS}px) rotate(${wrap(i, count) * STEP_DEG}deg) translateY(${-RADIUS}px) scale(${i === 0 ? 1 : SIDE_SCALE})`,
                          zIndex: 10 - Math.abs(wrap(i, count)) * 2,
                        }
                      : { top: CARD_CENTRE_Y - 194, opacity: 0 }
                  }
                >
                  <Card card={card} darkOnStart={still && i === 0} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A card (Figma 2397:6766): 280 × 388, 22px corners, on its light paper with a white hairline, the scalloped
 * orange medallion with its icon, the title, the rule-and-diamond divider and the sentence. The dark look
 * of the card at the front (maroon to rust, saffron hairline, white title) lies over it and fades in.
 */
function Card({ card, darkOnStart }: { card: InstitutionCard; darkOnStart: boolean }) {
  const [from, to] = card.paper;
  return (
    <article
      className="relative flex size-full flex-col items-center gap-3.5 overflow-clip rounded-[22px] px-[22px] pt-7 pb-[26px] text-center shadow-[0_28px_50px_rgb(89_38_13/0.3)]"
      style={{ backgroundImage: `linear-gradient(140deg, ${from} 7.4%, ${to} 81.5%)` }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[22px] border border-white/70" />
      {/* The dark look, faded in while the card is at the front. */}
      <span
        data-dark
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[22px] border border-saffron/35 bg-[linear-gradient(140.8deg,#5a1a10_7.4%,#b4501e_81.5%)]"
        style={{ opacity: darkOnStart ? 1 : 0 }}
      />
      <Medallion icon={card.icon} />
      <div className="relative grid">
        {/* The title and sentence in ink on the paper, and in cream over the dark look. */}
        <div data-light className="col-start-1 row-start-1 flex flex-col items-center gap-3.5" style={{ opacity: darkOnStart ? 0 : 1 }}>
          <h3 className="w-[220px] font-heading text-[25px]/[1.15] font-normal text-[#2b1206]">{card.title}</h3>
          <img src="/images/about/divider-light.svg" alt="" aria-hidden="true" width={150} height={10} className="h-2.5 w-[150px]" />
          <p className="w-[220px] text-[14px]/[1.55] font-medium text-[#6b4a3a]">{card.text}</p>
        </div>
        <div aria-hidden="true" data-dark className="col-start-1 row-start-1 flex flex-col items-center gap-3.5" style={{ opacity: darkOnStart ? 1 : 0 }}>
          <span className="w-[220px] font-heading text-[25px]/[1.15] text-white">{card.title}</span>
          <img src="/images/about/divider-dark.svg" alt="" width={150} height={10} className="h-2.5 w-[150px]" />
          <span className="w-[220px] text-[15px]/[1.55] font-medium text-white">{card.text}</span>
        </div>
      </div>
    </article>
  );
}

/**
 * The scalloped medallion (Figma "medallion"): orange scallop and cream stitch, as drawn, with the card's
 * icon in white where the number was.
 */
function Medallion({ icon }: { icon: InstitutionIcon }) {
  return (
    <span aria-hidden="true" className="relative block size-14 shrink-0">
      <img src="/images/about/medallion-scallop-orange.svg" alt="" width={56} height={54.8} className="absolute top-[0.6px] left-0 h-[54.8px] w-14 max-w-none" />
      <img src="/images/about/medallion-stitch-cream.svg" alt="" width={45} height={45} className="absolute top-[5.5px] left-[5.5px] size-[45px] max-w-none" />
      <span className="absolute inset-0 flex items-center justify-center text-white">
        <Icon icon={icon} />
      </span>
    </span>
  );
}

/**
 * The cards' line icons, 22px: a trophy for the track record, a teacher at the board for the faculty, a
 * student with a mentor's tick for personalised learning, books for the resources, a map pin for the
 * location, and a screen beside a classroom desk for the learning modes.
 */
function Icon({ icon }: { icon: InstitutionIcon }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      {icon === "trophy" && (
        <>
          <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
          <path d="M8 6H5a3 3 0 0 0 3 3.5M16 6h3a3 3 0 0 1-3 3.5M12 13v4M8.5 20h7M9.5 17h5" />
        </>
      )}
      {icon === "faculty" && (
        <>
          <rect x={10} y={3.5} width={11} height={8.5} rx={1} />
          <circle cx={5.5} cy={8} r={2.2} />
          <path d="M2.5 20.5v-4.25a3 3 0 0 1 3-3h1.75l3.25-2.75" />
        </>
      )}
      {icon === "mentor" && (
        <>
          <circle cx={9} cy={8} r={3} />
          <path d="M3.5 19.5c0-3.2 2.5-5.5 5.5-5.5s5.5 2.3 5.5 5.5" />
          <path d="m15.5 10 2 2 4-4" />
        </>
      )}
      {icon === "books" && (
        <>
          <path d="M12 6.5c-1.8-1.4-4.6-2-8-1.8v12.6c3.4-.2 6.2.4 8 1.8 1.8-1.4 4.6-2 8-1.8V4.7c-3.4-.2-6.2.4-8 1.8Z" />
          <path d="M12 6.5v12.6" />
        </>
      )}
      {icon === "location" && (
        <>
          <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
          <circle cx={12} cy={9.5} r={2.5} />
        </>
      )}
      {icon === "modes" && (
        <>
          <rect x={3} y={4.5} width={18} height={11.5} rx={1.5} />
          <path d="M8 20h8M12 16v4" />
          <path d="m10.5 8 4 2.25-4 2.25Z" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

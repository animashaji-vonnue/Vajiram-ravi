import Cta from "@/components/ui/Cta";
import { programmes, programmesClosing, programmesIntro, shelfIntro } from "@/data/programmes";
import { contact } from "@/data/site";
import FlagshipCard from "./FlagshipCard";
import CourseShelf from "./CourseShelf";

/**
 * The newspaper collage (Figma "ned 2/3/4"): the three cuttings repeated across the whole upper band of the
 * section, edge to edge of the screen and from the band's top to below the card, toned to sepia and
 * multiplied into the cream, under a cream veil that keeps the heading and the card legible and fades the
 * collage out before the shelf. Decoration only. It drifts down slowly as the page scrolls past, so the
 * card seems to float over it (ui/TextMotion, data-drift).
 */
const CUTTINGS = ["/images/programmes/newsprint-left.webp", "/images/programmes/newsprint-centre.webp", "/images/programmes/newsprint-right.webp"];

function Newsprint() {
  return (
    <div
      aria-hidden="true"
      data-drift="90"
      className="pointer-events-none absolute -top-24 -bottom-20 left-1/2 grid w-[max(calc(100vw/var(--canvas-zoom,1)),1440px)] -translate-x-1/2 grid-cols-4 grid-rows-2 overflow-clip"
    >
      {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
        <img
          key={n}
          src={CUTTINGS[(n + Math.floor(n / 4)) % 3]}
          alt=""
          width={736}
          height={1308}
          loading="lazy"
          decoding="async"
          className="size-full max-w-none object-cover opacity-30 mix-blend-multiply sepia-[0.45]"
          style={{ transform: n % 2 ? "scaleX(-1)" : undefined }}
        />
      ))}
      {/* The cream veil: fuller behind the heading, thinner behind the card, closing in again at the foot. */}
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_248_236/0.86)_0%,rgb(255_248_236/0.66)_32%,rgb(255_248_236/0.5)_70%,rgb(255_248_236/1)_100%)]" />
    </div>
  );
}

/**
 * Explore UPSC Programmes (IA 4; Figma "03 · Explore Our Programmes", 2377:4612): a cream band, as the
 * journey section's (feedback 25), with the section's heading, then the flagship General Studies
 * programme on its orange card over the newspaper collage (FlagshipCard), then "All our UPSC programmes"
 * with every programme group as a book on the wooden course shelf and its category filter (CourseShelf),
 * and under them a card pointing to the counsellors. The copy is the `kevin` branch's (data/programmes).
 * Padding 96 / 96; 48px from the heading to the card, 96px from the card to the shelf.
 */
export default function Programmes() {
  const { title } = programmesIntro;
  return (
    <section id="programmes" aria-labelledby="programmes-h" className="relative overflow-clip bg-cream">
      <div className="relative mx-auto flex w-canvas flex-col items-start px-20 pt-24">
        {/* The upper band: the heading and the flagship programme, on the newspaper collage. */}
        <div className="relative w-full">
          <Newsprint />
          <div className="relative mx-auto flex w-[820px] flex-col items-center text-center">
            <h2 id="programmes-h" data-split className="font-heading text-[56px]/[1.08] tracking-[-0.02em] text-ink">
              {title.before}{" "}
              <em data-reveal-em className="text-orange italic">
                {title.em}
              </em>{" "}
              {title.after}
            </h2>
          </div>

          <div className="relative mt-12 w-full">
            <FlagshipCard />
          </div>
        </div>

        {/* The course shelf: its heading, then the filter and the books on their planks (CourseShelf). */}
        <div className="relative mt-24 w-full">
          <h3 data-split className="text-center font-heading text-[48px]/[1.15] tracking-[-0.02em] text-ink">
            <span className="block whitespace-nowrap">
              {shelfIntro.title.before}
              <em data-reveal-em className="text-orange italic">
                {shelfIntro.title.em}
              </em>
              {shelfIntro.title.after}
            </span>
            <span className="block whitespace-nowrap">{shelfIntro.title.line2}</span>
          </h3>
          <div className="mt-8">
            <CourseShelf programmes={programmes} />
          </div>
        </div>

        <div className="relative w-full pt-14 pb-24">
          {/*
            The client's closing line, as a card under the shelf: a counsellor's headset in
            a burnt disc, the question and the line, then the phone number and the button to the counselling form.
          */}
          <aside
            data-reveal
            aria-labelledby="programmes-help-h"
            className="relative mx-auto flex w-[1040px] items-center gap-7 rounded-[20px] border border-[#eadbc4] bg-white/85 py-7 pr-8 pl-7 shadow-rest backdrop-blur-sm"
          >
            <span aria-hidden="true" className="flex size-16 shrink-0 items-center justify-center rounded-full bg-burnt text-white">
              <svg viewBox="0 0 24 24" width={30} height={30} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
                <rect x={3} y={13} width={4} height={6} rx={1.5} />
                <rect x={17} y={13} width={4} height={6} rx={1.5} />
                <path d="M19 19v.5a2.5 2.5 0 0 1-2.5 2.5H13" />
              </svg>
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 id="programmes-help-h" className="font-heading text-[26px]/[1.2] font-normal text-ink">
                {programmesClosing.question}
              </h3>
              <p className="text-[17px]/[1.5] text-clay">
                {programmesClosing.text}{" "}
                <a href={contact.phoneHref} className="font-semibold whitespace-nowrap text-burnt underline decoration-burnt/30 underline-offset-4 [transition:text-decoration-color_var(--dur-fast)_var(--ease-out)] hover:decoration-burnt">
                  {contact.phone}
                </a>
                <span className="whitespace-nowrap"> · {contact.hours}</span>
              </p>
            </div>
            <Cta variant="primary" size="lg" href={programmesClosing.cta.href}>
              {programmesClosing.cta.label}
            </Cta>
          </aside>
        </div>
      </div>
    </section>
  );
}

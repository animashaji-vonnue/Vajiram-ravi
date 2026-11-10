import Cta from "@/components/ui/Cta";
import { programmes, programmesClosing, programmesIntro, shelfIntro } from "@/data/programmes";
import { contact } from "@/data/site";
import FlagshipCard from "./FlagshipCard";
import CourseShelf from "./CourseShelf";

/**
 * The newspaper collage (Figma "ned 2/3/4"): the three cuttings repeated across the whole upper band of the
 * section, edge to edge of the screen and from the band's top to the wall, under a paper veil that keeps
 * the heading and the card legible. Decoration only.
 */
const CUTTINGS = ["/images/programmes/newsprint-left.webp", "/images/programmes/newsprint-centre.webp", "/images/programmes/newsprint-right.webp"];

function Newsprint() {
  return (
    <div
      aria-hidden="true"
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
          className="size-full max-w-none object-cover opacity-40 grayscale-[30%]"
          style={{ transform: n % 2 ? "scaleX(-1)" : undefined }}
        />
      ))}
      {/* The paper veil: lighter behind the heading, thinner behind the card. */}
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgb(255_255_255/0.86)_0%,rgb(255_255_255/0.7)_32%,rgb(255_255_255/0.5)_100%)]" />
    </div>
  );
}

/**
 * Explore UPSC Programmes (IA 4; Figma "03 · Explore Our Programmes", 2377:4612): a white band with the
 * site's heading row (eyebrow, heading, lead), then the featured General Studies programme on the frosted
 * card over the newspaper collage (FlagshipCard), "More UPSC programmes" with every programme group as a
 * cover on the course shelf, eight on two shelves of four (CourseShelf), and under them on the wall a card
 * pointing to the counsellors. The copy is the `kevin` branch's (data/programmes). Padding 96 / 80;
 * 56px from the heading to the card and from the cards to the closing line.
 */
export default function Programmes() {
  const { title } = programmesIntro;
  return (
    <section id="programmes" aria-labelledby="programmes-h" className="relative overflow-clip bg-white">
      <div className="relative mx-auto flex w-canvas flex-col items-start px-20 pt-24">
        {/* The upper band: the heading and the featured programme, on the newspaper collage. */}
        <div className="relative w-full">
        <Newsprint />
        <div className="relative mx-auto flex w-[820px] flex-col items-center gap-4 text-center">
          <h2 id="programmes-h" data-split className="font-heading text-[56px]/[1.08] tracking-[-0.02em] text-ink">
            {title.before}{" "}
            <em data-reveal-em className="text-orange italic">
              {title.em}
            </em>{" "}
            {title.after}
          </h2>
          <p data-words className="w-[640px] text-[17px]/[1.55] text-clay">
            {programmesIntro.lead}
          </p>
        </div>

        <div className="relative mt-14 w-full">
          <FlagshipCard />
        </div>
        </div>

        {/*
          "More UPSC programmes": the heading and its lead, then every programme group on the shelf
          (CourseShelf), in the `kevin` branch's design (7df11c6), in front of a library: a soft photograph of
          full bookshelves running the full width of the screen, washed in the page's paper so the covers and
          the type stay clear, and feathered into the white above (globals.css, .shelf-wall).
        */}
        <div className="relative mt-20 w-full pt-24 pb-20">
          <div aria-hidden="true" className="shelf-wall pointer-events-none absolute inset-y-0 left-1/2 w-[max(calc(100vw/var(--canvas-zoom,1)),1440px)] -translate-x-1/2 overflow-clip">
            <div data-par className="absolute -inset-y-[8%] inset-x-0">
              <img src="/images/programmes/library-shelves.webp" alt="" width={1168} height={880} loading="lazy" decoding="async" className="size-full max-w-none object-cover" />
            </div>
          </div>
          <div className="relative w-full">
            <div className="relative mx-auto flex w-[820px] flex-col items-center gap-4 text-center">
              <h3 data-split className="font-heading text-[48px]/[1.1] tracking-[-0.02em] text-ink">
                {shelfIntro.title.lead}
                <em data-reveal-em className="text-orange italic">
                  {shelfIntro.title.em}
                </em>
              </h3>
              <p data-words className="w-[600px] text-[18px]/[1.6] text-clay">
                {shelfIntro.intro}
              </p>
            </div>
            <div className="relative mt-8 w-full">
              <CourseShelf programmes={programmes} />
            </div>
          </div>

          {/*
            The client's closing line, as a card pinned to the wall under the shelves: a counsellor's headset in
            a burnt disc, the question and the line, then the phone number and the button to the counselling form.
          */}
          <aside
            data-reveal
            aria-labelledby="programmes-help-h"
            className="relative mx-auto mt-16 flex w-[1040px] items-center gap-7 rounded-[20px] border border-[#eadbc4] bg-white/85 py-7 pr-8 pl-7 shadow-rest backdrop-blur-sm"
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

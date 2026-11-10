import Cta from "@/components/ui/Cta";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { programmes, programmesClosing, programmesIntro, shelfIntro } from "@/data/programmes";
import FlagshipCard from "./FlagshipCard";
import CourseShelf from "./CourseShelf";

/**
 * The newspaper collage behind the flagship card (Figma "ned 2/3/4"): three cuttings at 47%, placed on the
 * 1440 canvas as drawn around the card, from 120px above its top. The drawing starts with the card; here the
 * heading row sits above it, so the collage fades in under the heading's foot and out again past the card's
 * foot, leaving the heading and the programme cards on plain white. Decoration only.
 */
const CUTTINGS = [
  { src: "/images/programmes/newsprint-left.webp", position: "top-[22px] left-[-7px]" },
  { src: "/images/programmes/newsprint-centre.webp", position: "top-[13px] left-[516px]" },
  { src: "/images/programmes/newsprint-right.webp", position: "top-0 left-[1033px]" },
];

function Newsprint() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-[-120px] left-[-80px] h-[1080px] w-canvas [mask-image:linear-gradient(to_bottom,transparent_56px,#000_170px,#000_700px,transparent_900px)]"
    >
      {CUTTINGS.map((cutting) => (
        <img
          key={cutting.src}
          src={cutting.src}
          alt=""
          width={528}
          height={937}
          loading="lazy"
          decoding="async"
          className={`absolute h-[937px] w-[528px] max-w-none object-cover opacity-47 ${cutting.position}`}
        />
      ))}
    </div>
  );
}

/**
 * Explore UPSC Programmes (IA 4; Figma "03 · Explore Our Programmes", 2377:4612): a white band with the
 * site's heading row (eyebrow, heading, lead), then the featured General Studies programme on the frosted
 * card over the newspaper collage (FlagshipCard), "More UPSC programmes" with every programme group as a
 * cover on the course shelf, eight on two shelves of four (CourseShelf), and the line pointing to the
 * counsellors with its button. The copy is the `kevin` branch's (data/programmes). Padding 96 / 80;
 * 56px from the heading to the card and from the cards to the closing line.
 */
export default function Programmes() {
  const { title } = programmesIntro;
  return (
    <section id="programmes" aria-labelledby="programmes-h" className="relative overflow-clip bg-white">
      <div className="relative mx-auto flex w-canvas flex-col items-start px-20 py-24">
        <div className="relative flex w-[820px] flex-col items-start gap-4">
          <EyebrowLeft>{programmesIntro.eyebrow}</EyebrowLeft>
          <h2 id="programmes-h" data-split className="font-heading text-[56px]/[1.08] tracking-[-0.02em] text-ink">
            {title.before}{" "}
            <em data-reveal-em className="text-orange italic">
              {title.em}
            </em>
          </h2>
          <p data-words className="w-[640px] text-[17px]/[1.55] text-clay">
            {programmesIntro.lead}
          </p>
        </div>

        <div className="relative mt-14 w-full">
          <Newsprint />
          <FlagshipCard />
        </div>

        {/*
          "More UPSC programmes": kevin's wall heading, then every programme group on the shelf (CourseShelf),
          all on a plastered wall that runs the full width of the screen (globals.css, .shelf-wall).
        */}
        <div className="relative mt-20 w-full pt-16 pb-16">
          <div aria-hidden="true" className="shelf-wall pointer-events-none absolute inset-y-0 left-1/2 w-[max(calc(100vw/var(--canvas-zoom,1)),1440px)] -translate-x-1/2" />
          <div className="relative flex w-full flex-col items-center gap-3 text-center">
            <h3 data-split className="font-heading text-[36px]/[1.15] tracking-[-0.015em] text-ink">{shelfIntro.title}</h3>
            <p data-words className="w-[520px] text-[17px]/[1.55] text-clay">
              {shelfIntro.intro}
            </p>
          </div>
          <div className="relative mt-12 w-full">
            <CourseShelf programmes={programmes} />
          </div>
        </div>

        <div data-reveal className="relative mt-14 flex w-full items-center justify-center gap-5">
          <p className="text-[17px]/[1.55] text-clay">{programmesClosing.text}</p>
          <Cta variant="primary" size="md" href={programmesClosing.cta.href}>
            {programmesClosing.cta.label}
          </Cta>
        </div>
      </div>
    </section>
  );
}

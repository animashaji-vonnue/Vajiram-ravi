import Cta from "@/components/ui/Cta";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { programmes, programmesClosing, programmesIntro } from "@/data/programmes";
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
 * site's heading row (eyebrow, heading, lead), then the flagship General Studies programme on the frosted
 * card over the newspaper collage (FlagshipCard), every other programme family of the institute as a cover
 * on the course shelf, ten on two shelves of five (CourseShelf), and the line pointing to the counsellors
 * with its button. Padding 96 / 80;
 * 56px from the heading to the card and from the cards to the closing line.
 */
export default function Programmes() {
  const { title } = programmesIntro;
  return (
    <section id="programmes" aria-labelledby="programmes-h" className="relative overflow-clip bg-white">
      <div className="relative mx-auto flex w-canvas flex-col items-start px-20 py-24">
        <div className="relative flex w-[820px] flex-col items-start gap-4">
          <EyebrowLeft>{programmesIntro.eyebrow}</EyebrowLeft>
          <h2 id="programmes-h" data-reveal="heading" className="font-serif text-[56px]/[1.08] tracking-[-0.02em] text-ink">
            {title.before}{" "}
            <em data-reveal-em className="text-orange italic">
              {title.em}
            </em>{" "}
            {title.after}
          </h2>
          <p data-reveal="sub" className="w-[640px] text-[17px]/[1.55] text-clay">
            {programmesIntro.lead}
          </p>
        </div>

        <div className="relative mt-14 w-full">
          <Newsprint />
          <FlagshipCard />
        </div>

        {/* The course shelf: every other programme family as a cover, five to a shelf (CourseShelf). */}
        <div className="relative mt-20 w-full">
          <CourseShelf programmes={programmes} />
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

import CountUp from "@/components/ui/CountUp";
import Cta from "@/components/ui/Cta";
import IndianLink from "@/components/ui/IndianLink";
import { flagshipProgramme, gsCourses, gsCoursesLabel, type GsCourse } from "@/data/programmes";
import { cx } from "@/lib/cx";
import { CARD_LINK } from "@/lib/hover";

/** The card's frosted paper, as drawn: peach-cream at 74% over the newspaper collage, blurred 6px. */
const FROST =
  "bg-[linear-gradient(157.89deg,rgb(255_244_228/0.74)_14.286%,rgb(255_226_189/0.74)_85.714%)] backdrop-blur-[6px]";

/**
 * The flagship programme, 01 General Studies – Prelims & Mains (Figma "GS card", 2377:4616): the frosted
 * 1280px card with a warm glow low at its right and the lotus mark cropped by its top right corner.
 *   - At the top, the programme's number, title and sentence, and the button to its page.
 *   - Under them, the programme's five figures in one row on a white panel, each figure over its label.
 *   - Then the heart of it, the courses under General Studies PCM as vajiramandravi.com lists them: the
 *     Prelims & Mains programme in the classroom and LIVE-Online, each tile with its mode, its exam year,
 *     its length, the site's figures for it and a link to its page. (The two-year Fledgling is the first
 *     card of the grid below.)
 *
 * The card is its own (nested) section, labelled by its title, so its reveal and its counters wait for the
 * card itself rather than the tall band: the figures roll up (ui/CountUp) once half the card is in view,
 * their labels following as each lands. The course tiles lift on hover (CARD_LINK) and are links as a
 * whole. Reduced motion: the figures are simply there.
 */
export default function FlagshipCard() {
  const programme = flagshipProgramme;
  return (
    <section aria-labelledby="flagship-programme-h" data-reveal className={`relative w-full overflow-clip rounded-2xl px-14 pt-12 pb-14 ${FROST}`}>
      <img
        src="/images/programmes/glow.svg"
        alt=""
        aria-hidden="true"
        width={1020}
        height={820}
        className="pointer-events-none absolute top-10 left-[540px] h-[820px] w-[1020px] max-w-none"
      />
      <img
        src="/images/programmes/lotus-mark.svg"
        alt=""
        aria-hidden="true"
        width={520}
        height={520}
        className="pointer-events-none absolute top-[-250px] left-[1020px] size-[520px] max-w-none"
      />

      <div className="relative flex items-end justify-between gap-12">
        <div className="flex w-[720px] flex-col items-start">
          <p className="flex items-center gap-3 font-mono text-[12px]/[16px] tracking-[0.08em] text-[#a8431a]">
            {programme.number}
            <span aria-hidden="true" className="h-px w-10 bg-burnt/45" />
          </p>
          <h3 id="flagship-programme-h" className="mt-4 font-serif text-[48px]/[1.06] tracking-[-0.02em] text-ink">
            {programme.title}
          </h3>
          <p className="mt-4 w-[600px] text-[17px]/[1.55] text-clay">{programme.text}</p>
        </div>
        <Cta variant="primary" size="lg" href={programme.cta.href} className="mb-1">
          {programme.cta.label}
        </Cta>
      </div>

      <dl className="relative mt-9 grid grid-cols-5 rounded-2xl bg-white/75 py-5 shadow-rest">
        {programme.figures.map((figure) => (
          <div
            key={figure.label}
            data-count-scope
            className="flex flex-col items-center gap-1.5 border-l border-[#eadbc4] px-4 text-center first:border-l-0"
          >
            <dd className="font-serif text-[40px]/[1.1] font-light tracking-[-0.01em] whitespace-nowrap text-ink">
              <CountUp value={figure.value} />
            </dd>
            <dt data-count-label className="font-mono text-[11px]/[15px] tracking-[0.08em] text-[#a8431a] uppercase">
              {figure.label}
            </dt>
          </div>
        ))}
      </dl>

      <h4 className="relative mt-10 flex items-center gap-3 font-mono text-[12px]/[16px] tracking-[0.08em] text-[#a8431a] uppercase">
        {gsCoursesLabel}
        <span aria-hidden="true" className="h-px w-14 bg-burnt/45" />
      </h4>
      <ul className="relative mt-4 grid grid-cols-2 gap-4">
        {gsCourses.map((course) => (
          <li key={course.name} className="flex">
            <CourseTile course={course} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * One course: its mode (LIVE-Online with a small live dot), its exam year, its name, its length, the site's
 * figures for it, and "Explore course" at the foot. The whole tile is the link (the Indian link's ::after
 * reaches over it), named for the course.
 */
function CourseTile({ course }: { course: GsCourse }) {
  const live = course.mode === "LIVE-Online";
  const linked = course.href !== null;
  return (
    <article className={cx("relative flex w-full flex-col items-start rounded-2xl border border-[#eadbc4] bg-white/90 p-5", linked && CARD_LINK)}>
      <div className="flex w-full items-center justify-between">
        <span
          className={cx(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px]/[14px] tracking-[0.08em] uppercase",
            live ? "bg-saffron/25 text-[#8a3a12]" : "bg-burnt/10 text-[#a8431a]",
          )}
        >
          {live && <span aria-hidden="true" className="size-1.5 rounded-full bg-burnt motion-safe:animate-pulse" />}
          {course.mode}
        </span>
        <span className="font-mono text-[11px]/[14px] tracking-[0.08em] text-clay uppercase">{course.target}</span>
      </div>
      <h5 className="mt-4 font-serif text-[22px]/[1.2] text-ink">{course.name}</h5>
      <p className="mt-3 text-[14px]/[1.4] font-semibold text-ink">{course.length}</p>
      <p className="mt-1 text-[13.5px]/[1.5] text-clay">{course.facts}</p>
      <div className="mt-auto pt-5">
        <IndianLink
          tone="light"
          size="sm"
          href={course.href}
          ariaLabel={`Explore the ${course.name}`}
          className="after:absolute after:inset-0 after:rounded-2xl"
        >
          Explore course
        </IndianLink>
      </div>
    </article>
  );
}

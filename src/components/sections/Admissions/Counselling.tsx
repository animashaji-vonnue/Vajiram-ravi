import { counsellingCopy, learningModes } from "@/data/admissions";
import { programmeChoices } from "@/data/programmes";
import { contact } from "@/data/site";
import GuidanceButton from "./GuidanceButton";
import Postcard from "./Postcard";

/**
 * The band's lattice: a jaali of interlocking circles (each 48px circle passing through its neighbours'
 * centres), drawn in white hairlines at 6%. It reads as fine stone tracery, not as dots.
 */
const JAALI = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><g fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.8'><circle cx='0' cy='0' r='24'/><circle cx='48' cy='0' r='24'/><circle cx='0' cy='48' r='24'/><circle cx='48' cy='48' r='24'/><circle cx='24' cy='24' r='24'/></g></svg>",
)}")`;

/**
 * Counselling & Academic Guidance (IA 6; Figma "05 · Personalised Counselling", 2377:4839): on the left
 * the heading, the paragraph, "Get expert guidance" (it puts the focus in the form) and the phone line with
 * the hours; on the right the postcard form (Postcard). "Register now" on a batch ticket scrolls here with
 * its programme filled in (requestEnquiry).
 *
 * The ground is a deep burnt orange, darkest behind the heading and at the band's sides, with a brighter
 * orange glow behind the postcard, under the jaali lattice (above). The heading, the paragraph and the
 * phone line are all white: on this ground only white reaches 4.5:1 for text this size.
 */
export default function Counselling() {
  const { title } = counsellingCopy;
  return (
    <section id="counselling" data-curtain aria-labelledby="counselling-h" className="relative isolate overflow-clip bg-[#7e2b06]">
      {/* The darker sides: the band deepens towards its left and right edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#6a2405_0%,#94360a_30%,#a63e0b_55%,#94360a_82%,#6a2405_100%)]"
      />

      {/* The lighter glow behind the postcard, centred on it (the card's middle is 1010px across the canvas). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 w-canvas -translate-x-1/2">
        <div className="absolute top-1/2 left-[1010px] h-[1000px] w-[1200px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,#ec6a14_0%,rgba(222,92,14,0.75)_40%,rgba(190,72,10,0.3)_72%,transparent_100%)]" />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: JAALI, backgroundSize: "48px 48px" }} />

      <div className="relative mx-auto flex w-canvas items-center justify-between px-20 py-24">
        <div className="relative flex w-[500px] shrink-0 flex-col items-start">
          <h2 id="counselling-h" data-split className="font-heading text-[56px]/[1.08] tracking-[-0.02em] text-white">
            {title.before}{" "}
            <em data-reveal-em className="text-white italic">
              {title.em}
            </em>{" "}
            {title.after}
          </h2>
          <div data-words className="mt-5 flex w-[480px] flex-col gap-3 text-[17px]/[1.55] text-white">
            {counsellingCopy.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div data-reveal className="mt-8 flex flex-col items-start gap-5">
            <GuidanceButton label={counsellingCopy.cta} />
            <a
              href={contact.phoneHref}
              className="flex items-center gap-2.5 rounded-[14px] bg-mahogany/25 px-[18px] py-3.5 whitespace-nowrap text-white [transition:background-color_var(--dur-fast)_var(--ease-out),scale_80ms_var(--ease-out)] hover:bg-mahogany/40 pointer-coarse:active:scale-[.98]"
            >
              <span className="font-heading text-[22px]/[26px]">{contact.phone}</span>
              <span className="text-[14px]/[20px] font-bold whitespace-pre text-white/90">{`·  ${contact.hours}`}</span>
            </a>
          </div>
        </div>

        <Postcard programmes={programmeChoices} modes={learningModes} />
      </div>
    </section>
  );
}

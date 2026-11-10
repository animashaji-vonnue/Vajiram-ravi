import { counsellingCopy, learningModes } from "@/data/admissions";
import { programmeChoices } from "@/data/programmes";
import { contact } from "@/data/site";
import GuidanceButton from "./GuidanceButton";
import Postcard from "./Postcard";

/**
 * The ground and pattern of the `anima/magazine-page` branch's "Need help choosing?" band: its deep orange,
 * a print of small four-petalled flowers in white at 8% on a 40px repeat, and a glow of brighter orange
 * from the top left corner.
 */
const FLOWER_PRINT = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 34 34'><path d='M17 9.5C18.1 12.3 19.7 13.9 22.5 15 19.7 16.1 18.1 17.7 17 20.5 15.9 17.7 14.3 16.1 11.5 15 14.3 13.9 15.9 12.3 17 9.5Z' fill='rgba(255,255,255,0.08)'/><circle cx='0' cy='32' r='1.4' fill='rgba(255,255,255,0.08)'/><circle cx='34' cy='32' r='1.4' fill='rgba(255,255,255,0.08)'/></svg>",
)}")`;

/**
 * Counselling & Academic Guidance (IA 6; Figma "05 · Personalised Counselling", 2377:4839): the band on
 * the anima branch's ground and flower print (above). On the left the eyebrow, the heading, the two paragraphs, "Get Expert Guidance" (it puts
 * the focus in the form) and the phone line with the hours; on the right the postcard form (Postcard).
 * "Register now" on a batch ticket scrolls here with its programme filled in (requestEnquiry).
 *
 * The paragraphs are white rather than the dark bands' cream at 80%: on this deep orange only white
 * reaches 4.5:1 for text this size.
 */
export default function Counselling() {
  const { title } = counsellingCopy;
  return (
    <section id="counselling" data-curtain aria-labelledby="counselling-h" className="relative isolate overflow-clip bg-[#c94a0a]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: FLOWER_PRINT, backgroundSize: "40px 40px" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_0%_0%,rgba(255,138,43,0.55),transparent_70%)]" />

      <div className="relative mx-auto flex w-canvas items-center justify-between px-20 py-24">
        <div className="relative flex w-[500px] shrink-0 flex-col items-start">
          <h2 id="counselling-h" data-split className="font-heading text-[56px]/[1.08] tracking-[-0.02em] text-white">
            {title.before}{" "}
            <em data-reveal-em className="text-saffron italic">
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

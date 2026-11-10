import BlockPrintBand from "@/components/ui/BlockPrintBand";
import { EyebrowLeft } from "@/components/ui/Ornament";
import { counsellingCopy, learningModes } from "@/data/admissions";
import { programmeChoices } from "@/data/programmes";
import { contact } from "@/data/site";
import GuidanceButton from "./GuidanceButton";
import Postcard from "./Postcard";
import ScriptRows from "./ScriptRows";

/**
 * Counselling & Academic Guidance (IA 6; Figma "05 · Personalised Counselling", 2377:4839): the burnt band
 * with a paper grain multiplied over it, a block-print band 24px in from its top and its foot (the lower
 * one set 34px along, as drawn), and three faint rows of Indian-script letters drifting very slowly
 * (ScriptRows). On the left the eyebrow, the heading, the two paragraphs, "Get Expert Guidance" (it puts
 * the focus in the form) and the phone line with the hours; on the right the postcard form (Postcard).
 * "Register now" on a batch ticket scrolls here with its programme filled in (requestEnquiry).
 *
 * The paragraphs are white rather than the dark bands' cream at 80%: on this burnt orange only white
 * reaches 4.5:1 for text this size.
 */
export default function Counselling() {
  const { title } = counsellingCopy;
  return (
    <section id="counselling" aria-labelledby="counselling-h" className="relative overflow-clip bg-burnt">
      <img
        src="/images/talk-to-us/paper-grain.webp"
        alt=""
        aria-hidden="true"
        width={1024}
        height={1440}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover opacity-28 mix-blend-multiply"
      />

      {/* The saffron block-print bands run the full width of the screen, the lower one 34px along, as drawn. */}
      <BlockPrintBand colour="#f4c430" opacity={0.55} className="top-6" />
      <BlockPrintBand colour="#f4c430" opacity={0.55} className="bottom-6" shift={34} />

      <div className="relative mx-auto flex w-canvas items-center justify-between px-20 py-24">
        <ScriptRows />

        <div className="relative flex w-[500px] shrink-0 flex-col items-start">
          <EyebrowLeft tone="dark" labelClassName="text-white">
            {counsellingCopy.eyebrow}
          </EyebrowLeft>
          <h2 id="counselling-h" data-reveal="heading" className="mt-4 font-serif text-[56px]/[1.08] tracking-[-0.02em] text-white">
            {title.before}{" "}
            <em data-reveal-em className="text-saffron italic">
              {title.em}
            </em>{" "}
            {title.after}
          </h2>
          <div data-reveal="sub" className="mt-5 flex w-[480px] flex-col gap-3 text-[17px]/[1.55] text-white">
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
              <span className="font-serif text-[22px]/[26px]">{contact.phone}</span>
              <span className="text-[14px]/[20px] font-bold whitespace-pre text-white/90">{`·  ${contact.hours}`}</span>
            </a>
          </div>
        </div>

        <Postcard programmes={programmeChoices} modes={learningModes} />
      </div>
    </section>
  );
}

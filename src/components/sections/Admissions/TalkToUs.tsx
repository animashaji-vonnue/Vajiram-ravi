import { EyebrowLeft } from "@/components/ui/Ornament";
import { enquiryProgrammes, talkToUsCopy, timePreferences } from "@/data/admissions";
import { contact } from "@/data/site";
import Postcard from "./Postcard";

/**
 * Talk to us (Figma "08 Talk to us · India Post postcard form", 2258:9692): a burnt band with a paper grain
 * multiplied over it and a faint row of Indian script glyphs (static). On the left the eyebrow, the heading,
 * the text and the phone pill; on the right the postcard form. "Register now" anywhere on the page scrolls
 * here (requestEnquiry) with its programme filled in.
 */
export default function TalkToUs() {
  return (
    <section id="counsellor" aria-labelledby="counsellor-h" className="relative overflow-clip bg-burnt">
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

      <div className="relative mx-auto flex w-canvas items-start px-20 pt-[81px] pb-24">
        <img
          src="/images/talk-to-us/script-glyphs.svg"
          alt=""
          aria-hidden="true"
          width={1280}
          height={56.432}
          className="pointer-events-none absolute top-[462px] left-20 max-w-none"
        />

        <div className="relative mt-[15px] flex w-[500px] shrink-0 flex-col items-start gap-4">
          {/* The design draws this eyebrow's butta and rule in cream: the shared orange ones, turned white. */}
          <EyebrowLeft tone="dark">
            {talkToUsCopy.eyebrow}
          </EyebrowLeft>
          <h2 id="counsellor-h" data-reveal="heading" className="w-[500px] font-serif text-[60px]/[1.08] font-normal tracking-[-0.9px] text-white">
            {talkToUsCopy.heading}{" "}
            <em data-reveal-em className="text-cream italic">
              {talkToUsCopy.headingEm}
            </em>
          </h2>
          <p data-reveal="sub" className="w-[470px] text-[18px]/[27px] font-bold text-white/95">
            {talkToUsCopy.text}
          </p>
          <a
            data-reveal
            href={contact.phoneHref}
            className="flex items-center gap-2.5 rounded-[14px] bg-mahogany/25 px-[18px] py-3.5 whitespace-nowrap text-white [transition:background-color_var(--dur-fast)_var(--ease-out),scale_80ms_var(--ease-out)] hover:bg-mahogany/40 pointer-coarse:active:scale-[.98]"
          >
            <span className="font-serif text-[22px]/[26px]">{contact.phone}</span>
            <span className="text-[14px]/[20px] font-bold whitespace-pre text-white/90">{`·  ${contact.hours}`}</span>
          </a>
        </div>

        <Postcard programmes={enquiryProgrammes} timePreferences={timePreferences} className="ml-[75px]" />
      </div>
    </section>
  );
}

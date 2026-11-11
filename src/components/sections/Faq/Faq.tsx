import { faqEntries, faqIntro } from "@/data/faq-chat";
import FaqList from "./FaqList";
import FaqSeal from "./FaqSeal";

/** FAQPage structured data (approved answers only), so search engines read the questions as such. */
const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqEntries.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

/**
 * Frequently asked questions (IA 10; Figma "11 · FAQ", 2392:7383): a cream band with the centred heading and the Vajiram & Ravi seal (the logo's mark in a
 * lettered wax seal) pressed beside it, and the questions in a 788px column numbered 1, 2, 3… in the
 * margin, one open at a time, the open one on a tinted panel.
 *
 * The band grows with its questions (the client's seven): nothing in it is drawn to a fixed height.
 * Motion: the heading's letters rise in, quickly (ui/TextMotion, data-split); the seal is pressed on
 * after it (FaqSeal) and turns a little with the scroll (data-turn),
 * and the questions follow one by one (data-stagger).
 */
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-h" className="relative bg-cream">
      <div className="relative mx-auto w-canvas px-20 pt-[104px] pb-12">

        <div className="relative mx-auto flex w-[900px] flex-col items-center">
          <h2 id="faq-h" data-split className="w-[720px] text-center font-heading text-[56px]/[1.08] tracking-[-0.02em] text-ink">
            {faqIntro.title}
            {/* The answer takes the second line. */}
            <br />
            <em data-reveal-em className="text-orange italic">
              {faqIntro.accent}
            </em>
          </h2>
          {/* The seal turns a little with the scroll, as if the band were moving under it (ui/TextMotion, data-turn). */}
          <span data-turn="24" className="absolute -top-2 -right-5">
            <FaqSeal className="relative" />
          </span>

          <div className="mt-12 border-b border-[rgb(94_23_16/0.25)] [transition:border-color_var(--dur-base)_var(--ease-in-out)] has-[>div>div:last-child_[aria-expanded=true]]:border-transparent">
            <FaqList entries={faqEntries} />
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </section>
  );
}

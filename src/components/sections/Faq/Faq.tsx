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
 * Frequently asked questions (IA 10; Figma "11 · FAQ", 2392:7383): a paper band with the centred eyebrow and heading with the V&R wax seal pressed beside
 * it, and the questions in a 788px column with roman numerals in the margin, one open at a time.
 *
 * The band grows with its questions (the client's seven): nothing in it is drawn to a fixed height.
 * Motion: the heading rises with the section
 * reveal, the seal is pressed on after it (FaqSeal), and the questions follow one by one (data-reveal).
 */
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-h" className="relative bg-paper">
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
          <FaqSeal className="absolute top-[18px] right-[6px]" />

          <div className="mt-12 border-b border-[rgb(94_23_16/0.25)]">
            <FaqList entries={faqEntries} />
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </section>
  );
}

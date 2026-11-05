import { faqEntries, faqFooter, faqIntro } from "@/data/faq-chat";
import FaqScroll from "./FaqScroll";

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
 * Frequently asked questions (Figma "11 · FAQ — the scroll", 2258:9884): a maroon band with a skyline
 * silhouette at 8% and a gold frame, and the questions on a parchment scroll between two gilded rods.
 * A plain full-bleed band, 780px tall as drawn.
 */
export default function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-h"
      className="relative isolate overflow-clip bg-[#2c0b07] bg-[linear-gradient(180deg,rgb(94_23_16/0.9)_0%,rgb(44_11_7/0.4)_100%)]"
    >
      <img
        src="/images/faq/skyline.webp"
        alt=""
        aria-hidden="true"
        width={734}
        height={284}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 -z-1 size-full max-w-none object-cover opacity-8"
      />
      <FaqScroll entries={faqEntries} intro={faqIntro} footer={faqFooter} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </section>
  );
}

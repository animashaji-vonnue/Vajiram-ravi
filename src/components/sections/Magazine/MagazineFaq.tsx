import FaqList from "@/components/sections/Faq/FaqList";
import { SectionTitle } from "@/components/ui/Typography";
import { magazineFaqs } from "@/data/magazine";

export default function MagazineFaq() {
  return (
    <section id="magazine-faq" aria-labelledby="mfaq-h">
      <div className="relative mx-auto flex w-canvas flex-col items-center gap-12 px-60 pt-8 pb-16">
        <div data-reveal className="flex w-[960px] justify-center">
          <SectionTitle id="mfaq-h" className="whitespace-nowrap">
            Questions about the magazine
          </SectionTitle>
        </div>
        <FaqList items={magazineFaqs} />
      </div>
    </section>
  );
}

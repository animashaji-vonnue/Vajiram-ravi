import CtaBanner from "@/components/sections/CtaBanner/CtaBanner";
import Faculty from "@/components/sections/Faculty/Faculty";
import Faq from "@/components/sections/Faq/Faq";
import GsProgramme from "@/components/sections/GsProgramme/GsProgramme";
import Hero from "@/components/sections/Hero/Hero";
import Resources from "@/components/sections/Resources/Resources";
import Stats from "@/components/sections/Stats/Stats";
import Testimonials from "@/components/sections/Testimonials/Testimonials";
import Toppers from "@/components/sections/Toppers/Toppers";
import WhyChoose from "@/components/sections/WhyChoose/WhyChoose";
import ScrollReveal from "@/components/ui/ScrollReveal";

/**
 * Version 4 of the homepage, built section by section. Earlier versions are kept in git under the `v1` to `v3` tags.
 * The page's own colour (`--page`), orange, shows in the gaps between sections and round the hero and toppers as
 * they draw in on scroll; it fades to white as the "Why Vajiram & Ravi" section comes up (PageFade).
 */
export default function HomePage() {
  return (
    <main id="main" className="bg-(--page) [--page:#ff8b00]">
      <span id="top" />
      <Hero />
      <Stats />
      <Toppers />
      <WhyChoose />
      <CtaBanner />
      <GsProgramme />
      <Faculty />
      <Resources />
      <Testimonials />
      <Faq />
      <ScrollReveal />
    </main>
  );
}

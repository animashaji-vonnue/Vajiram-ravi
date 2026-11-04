import Hero from "@/components/sections/Hero/Hero";
import PracticeBanner from "@/components/sections/Practice/PracticeBanner";
import Stats from "@/components/sections/Stats/Stats";
import Toppers from "@/components/sections/Toppers/Toppers";
import WhyChoose from "@/components/sections/WhyChoose/WhyChoose";
import ScrollReveal from "@/components/ui/ScrollReveal";

/** Version 3 of the homepage, built section by section. Versions 1 and 2 are kept in git under the `v1` and `v2` tags. */
export default function HomePage() {
  return (
    <main id="main">
      <span id="top" />
      <Hero />
      <Stats />
      <Toppers />
      <WhyChoose />
      <PracticeBanner />
      <ScrollReveal />
    </main>
  );
}

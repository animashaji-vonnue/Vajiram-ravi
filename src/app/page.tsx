import GsProgramme from "@/components/sections/GsProgramme/GsProgramme";
import Hero from "@/components/sections/Hero/Hero";
import PracticeBanner from "@/components/sections/Practice/PracticeBanner";
import Programmes from "@/components/sections/Programmes/Programmes";
import Stories from "@/components/sections/Stories/Stories";
import Toppers from "@/components/sections/Toppers/Toppers";
import WhyChoose from "@/components/sections/WhyChoose/WhyChoose";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionDivider from "@/components/ui/SectionDivider";

/** Version 2 of the homepage, built section by section. Version 1 is kept in git under the `v1` tag. */
export default function HomePage() {
  return (
    <main id="main">
      <span id="top" />
      <Hero />
      {/* The hero ends on its indigo frame, with no space of its own below. */}
      <SectionDivider className="pt-24" />
      <Toppers />
      <SectionDivider />
      <WhyChoose />
      <SectionDivider />
      <GsProgramme />
      <SectionDivider />
      <Stories />
      <SectionDivider />
      <Programmes />
      <SectionDivider />
      <PracticeBanner />
      <ScrollReveal />
    </main>
  );
}

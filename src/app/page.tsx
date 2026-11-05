import Admissions from "@/components/sections/Admissions/Admissions";
import ClosingCta from "@/components/sections/ClosingCta/ClosingCta";
import Contact from "@/components/sections/Contact/Contact";
import Locations from "@/components/sections/Contact/Locations";
import Courses from "@/components/sections/Courses/Courses";
import Faculty from "@/components/sections/Faculty/Faculty";
import Faq from "@/components/sections/Faq/Faq";
import FreeResources from "@/components/sections/FreeResources/FreeResources";
import GsProgramme from "@/components/sections/GsProgramme/GsProgramme";
import Hero from "@/components/sections/Hero/Hero";
import StatsBand from "@/components/sections/Hero/StatsBand";
import TalkToUs from "@/components/sections/Admissions/TalkToUs";
import SuccessStories from "@/components/sections/SuccessStories/SuccessStories";
import Toppers from "@/components/sections/Toppers/Toppers";
import WhyChoose from "@/components/sections/WhyChoose/WhyChoose";
import ScrollReveal from "@/components/ui/ScrollReveal";

/**
 * The homepage, in the order of the Figma frame "the final design" (2258:10453), with the faculty band
 * ("10 · Faculty — subject gurus", 2271:10583) after the flagship programme. The header (utility bar, main
 * header and announcement strip) and the footer come from the root layout.
 */
export default function HomePage() {
  return (
    <main id="main">
      <span id="top" />
      <Hero />
      <StatsBand />
      <Toppers />
      <WhyChoose />
      <Courses />
      <GsProgramme />
      <Faculty />
      <Admissions />
      <TalkToUs />
      <SuccessStories />
      <FreeResources />
      <Faq />
      <Contact />
      <Locations />
      <ClosingCta />
      <ScrollReveal />
    </main>
  );
}

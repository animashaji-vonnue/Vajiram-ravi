import AnnouncementBar from "@/components/layout/AnnouncementBar";
import About from "@/components/sections/About/About";
import Admissions from "@/components/sections/Admissions/Admissions";
import Counselling from "@/components/sections/Admissions/Counselling";
import ClosingCta from "@/components/sections/ClosingCta/ClosingCta";
import Locations from "@/components/sections/Contact/Locations";
import Faculty from "@/components/sections/Faculty/Faculty";
import Faq from "@/components/sections/Faq/Faq";
import FreeResources from "@/components/sections/FreeResources/FreeResources";
import Hero from "@/components/sections/Hero/Hero";
import Journey from "@/components/sections/Journey/Journey";
import Programmes from "@/components/sections/Programmes/Programmes";
import SuccessStories from "@/components/sections/SuccessStories/SuccessStories";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TextMotion from "@/components/ui/TextMotion";

/**
 * The homepage, in the order of the client's information architecture (10 Nov 2026), laid out after the
 * Figma frame 2377:4172:
 *   1. the outcome-led hero with the UPSC CSE 2025 toppers (#hero)
 *   2. the UPSC preparation journey and the academic support at each stage (#journey)
 *   3. about Vajiram & Ravi (#about)
 *   4. the UPSC programmes (#programmes)
 *   5. upcoming batches and admissions (#batches)
 *   6. counselling and academic guidance (#counselling)
 *   7. the educators (#educators)
 *   8. student stories (#stories)
 *   9. free study materials (#resources)
 *   10. FAQs (#faq), then the campuses (#locations)
 *   11. the final call to action (#closing)
 * The announcement ticker runs between the hero and the journey. The header (utility bar and main header)
 * and the footer (12) come from the root layout.
 */
export default function HomePage() {
  return (
    <main id="main">
      <span id="top" />
      <Hero />
      <AnnouncementBar />
      <Journey />
      <About />
      <Programmes />
      <Admissions />
      <Counselling />
      <Faculty />
      <SuccessStories />
      <FreeResources />
      <Faq />
      <Locations />
      <ClosingCta />
      <ScrollReveal />
      <TextMotion />
    </main>
  );
}

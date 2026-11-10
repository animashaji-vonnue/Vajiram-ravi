import About from "@/components/sections/About";
import Batches from "@/components/sections/Batches";
import Closing from "@/components/sections/Closing";
import Counselling from "@/components/sections/Counselling";
import Faq from "@/components/sections/Faq";
import Hero from "@/components/sections/Hero";
import Journey from "@/components/sections/Journey";
import Life from "@/components/sections/Life";
import Mentors from "@/components/sections/Mentors";
import Programmes from "@/components/sections/Programmes";
import Resources from "@/components/sections/Resources";
import Stories from "@/components/sections/Stories";

/**
 * Version 5 of the homepage: a new design from scratch, after mastersunion.org, allen.in, maven.com and
 * sbs.ox.ac.uk, with manifesto.blandina.org's orange and lassie.ai's deck. It follows a twelve-part information
 * architecture (the twelfth, the footer, is in the layout):
 *
 *  1 an outcome-led hero · 2 the UPSC preparation journey and the institute's support · 3 about the institute (who
 *  it is, its track record, its online and offline classes and its location) · 4 programmes · 5 batches and
 *  admissions · 6 counselling · 7 educators · 8 student stories · 9 free resources · life at the institute, in film ·
 *  10 FAQs · 11 a final invitation.
 *
 * Earlier versions are kept in git under the `v1` to `v4` tags.
 */
export default function HomePage() {
  return (
    <main id="main">
      <span id="top" />
      <Hero />
      <Journey />
      <About />
      <Programmes />
      <Batches />
      <Counselling />
      <Mentors />
      <Stories />
      <Resources />
      <Life />
      <Faq />
      <Closing />
    </main>
  );
}

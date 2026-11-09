import type { Metadata } from "next";
import { SmoothScroll } from "@/components/recitals/Motion";
import { Header, Ticker } from "@/components/new-home/Chrome";
import Hero from "@/components/new-home/Hero";
import Journey from "@/components/new-home/Journey";
import About from "@/components/new-home/About";
import Programmes from "@/components/new-home/Programmes";
import Batches from "@/components/new-home/Batches";
import Guidance from "@/components/new-home/Guidance";
import { Educators, Stories } from "@/components/new-home/People";
import Resources from "@/components/new-home/Resources";
import Faq from "@/components/new-home/Faq";
import { Closing, Footer } from "@/components/new-home/Closing";

export const metadata: Metadata = {
  title: "Vajiram & Ravi — UPSC Civil Services Preparation since 1976",
  description:
    "Prepare for the Civil Services Examination with structured academic programmes, experienced subject educators and focused guidance across Prelims, Mains and the Personality Test.",
};

/*
 * The new homepage, built from the content brief "Vajiram & Ravi – Homepage Content Copy".
 * Standalone: it carries its own ticker, header and footer, so the old homepage chrome is hidden.
 */
export default function NewHomePage() {
  return (
    <main id="main" data-newhome className="min-h-svh bg-v-paper font-v-body text-v-ink">
      <span id="top" />
      <SmoothScroll />
      <Ticker />
      <Header />
      <Hero />
      <Journey />
      <About />
      <Programmes />
      <Batches />
      <Guidance />
      <Educators />
      <Stories />
      <Resources />
      <Faq />
      <Closing />
      <Footer />
    </main>
  );
}

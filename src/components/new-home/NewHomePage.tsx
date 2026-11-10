import type { Metadata } from "next";
import { SmoothScroll } from "@/components/recitals/Motion";
import { Header, Ticker } from "./Chrome";
import Hero from "./Hero";
import Journey from "./Journey";
import About from "./About";
import Programmes from "./Programmes";
import Batches from "./Batches";
import Guidance from "./Guidance";
import { Educators, Stories } from "./People";
import Resources from "./Resources";
import Faq from "./Faq";
import { Closing, Footer } from "./Closing";

export const newHomeMetadata: Metadata = {
  title: "Vajiram & Ravi — UPSC Civil Services Preparation since 1976",
  description:
    "Prepare for the Civil Services Examination with structured academic programmes, experienced subject educators and focused guidance across Prelims, Mains and the Personality Test.",
};

/*
 * The new homepage, built from the content brief "Vajiram & Ravi – Homepage Content Copy".
 * Standalone: it carries its own ticker, header and footer, so the old homepage chrome is hidden.
 * Served at "/" (the site's homepage) and at "/new-home", so links shared earlier keep working.
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

import type { Metadata } from "next";
import { SmoothScroll } from "@/components/recitals/Motion";
import RecitalsHeader from "@/components/recitals/RecitalsHeader";
import StickyCta from "@/components/recitals/StickyCta";
import Archive from "@/components/recitals/sections/Archive";
import Faq from "@/components/recitals/sections/Faq";
import Hero from "@/components/recitals/sections/Hero";
import HowToUse from "@/components/recitals/sections/HowToUse";
import InsideIssue from "@/components/recitals/sections/InsideIssue";
import ReadAlongside from "@/components/recitals/sections/ReadAlongside";
import RecitalsFooter from "@/components/recitals/sections/RecitalsFooter";
import WhyMonthly from "@/components/recitals/sections/WhyMonthly";

export const metadata: Metadata = {
  title: "The Recitals — Monthly Current Affairs Magazine for UPSC | Vajiram & Ravi",
  description:
    "A month of news rewritten the way UPSC asks it: Prelims MCQs, Mains model answers and an ethics case study. Every issue since May 2019, free to download.",
};

/*
 * The Recitals, in reading order:
 *   the current issue, everything ever published, what is in one, how to work through it,
 *   why monthly beats daily, what else to read, and the questions people ask.
 *
 * The page is standalone while it is being designed, so it carries its own header, footer
 * and navigation rather than the homepage chrome.
 */
export default function RecitalsPage() {
  return (
    <main id="main" data-recitals className="bg-r-paper">
      <SmoothScroll />
      <RecitalsHeader />

      <Hero />
      <Archive />
      <InsideIssue />
      <HowToUse />
      <WhyMonthly />
      <ReadAlongside />
      <Faq />
      <RecitalsFooter />

      <StickyCta />
    </main>
  );
}

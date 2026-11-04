import type { Metadata } from "next";
import ClosingCta from "@/components/sections/ClosingCta/ClosingCta";
import InsideIssue from "@/components/sections/Magazine/InsideIssue";
import IssueArchive from "@/components/sections/Magazine/IssueArchive";
import MagazineFaq from "@/components/sections/Magazine/MagazineFaq";
import MagazineHero from "@/components/sections/Magazine/MagazineHero";
import PortalBand from "@/components/sections/Magazine/PortalBand";
import UseByStage from "@/components/sections/Magazine/UseByStage";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "The Recitals – Monthly Current Affairs Magazine | Vajiram & Ravi",
  description:
    "Vajiram & Ravi's monthly current affairs magazine for UPSC, written as Prelims MCQs, Mains answers and case studies. Every issue since May 2019 is a free PDF.",
};

export default function MagazinePage() {
  return (
    <main id="main">
      <span id="top" />
      <MagazineHero />
      <InsideIssue />
      <IssueArchive />
      <UseByStage />
      <PortalBand />
      <MagazineFaq />
      <ClosingCta />
      <ScrollReveal />
    </main>
  );
}

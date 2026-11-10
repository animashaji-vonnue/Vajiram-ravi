/** Site footer (Figma 2392:7437; IA 12): the brand and contact block, three link columns, the line-art skyline, the giant wordmark and the legal bar. */

import { links, type Href } from "./links";

/** A footer link. Its address comes from data/links; one whose page does not exist yet renders as text. */
export type FooterLink = { label: string; href: Href };

/** The brand line under the logo (IA 12, the client's copy of 10 Nov 2026). */
export const footerTagline = "Preparing aspirants for the Civil Services Examination since 1976.";

/** The footer's three link columns, as the client listed them. */
export const footerColumns: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "About Us", href: links.aboutUs },
      { label: "General Studies", href: links.gsCourse },
      { label: "Optional Subjects", href: links.optionalSubject },
      { label: "Test Series", href: links.testSeries },
      { label: "Mentorship", href: links.mentorship },
      { label: "Interview Guidance", href: links.interviewGuidance },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "The Recitals", href: links.theRecitals },
      { label: "Current Affairs", href: links.dailyCurrentAffairs },
      { label: "Study Materials", href: links.studyMaterial },
      { label: "Prelims Pointers", href: links.prelimsPointers },
      { label: "Mains Articles", href: links.mainsArticles },
    ],
  },
  {
    heading: "Support",
    links: [
      // The footer's own contact block (#contact) holds the addresses, phone and email.
      { label: "Contact Us", href: "#contact" },
      { label: "Counselling", href: "#counselling" },
      { label: "FAQs", href: "#faq" },
      { label: "Upcoming Batches", href: "#batches" },
    ],
  },
];

/** The heading of the contact block. Its campuses come from data/contact, its phone and email from data/site. */
export const footerContactHeading = "Contact";
// TODO: the client's content asks for social media links; the live site lists none yet, so the footer has none.

export const footerWordmark = "Vajiram & Ravi";

export const footerCopyright = "© 2026 Vajiram & Ravi. All rights reserved";

export const footerLegal: FooterLink[] = [
  { label: "Terms and Conditions", href: links.termsAndConditions },
  { label: "Privacy Policy", href: links.privacyPolicy },
  { label: "Grievance Redressal", href: links.grievanceRedressal },
];

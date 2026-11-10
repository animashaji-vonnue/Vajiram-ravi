/** Site footer (Figma 2392:7437; IA 12): the brand and contact block, three link columns, the giant photo-filled wordmark and the legal bar. All labels in sentence case (feedback item 9). */

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
      { label: "About us", href: links.aboutUs },
      { label: "General Studies", href: links.gsCourse },
      { label: "Optional subjects", href: links.optionalSubject },
      { label: "Test series", href: links.testSeries },
      { label: "Mentorship", href: links.mentorship },
      { label: "Interview guidance", href: links.interviewGuidance },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "The Recitals", href: links.theRecitals },
      { label: "Current affairs", href: links.dailyCurrentAffairs },
      { label: "Study materials", href: links.studyMaterial },
      { label: "Prelims pointers", href: links.prelimsPointers },
      { label: "Mains articles", href: links.mainsArticles },
    ],
  },
  {
    heading: "Support",
    links: [
      // The footer's own contact block (#contact) holds the addresses, phone and email.
      { label: "Contact us", href: "#contact" },
      { label: "Counselling", href: "#counselling" },
      { label: "FAQs", href: "#faq" },
      { label: "Upcoming batches", href: "#batches" },
    ],
  },
];

/** The heading of the contact block. Its campuses come from data/contact, its phone and email from data/site. */
export const footerContactHeading = "Contact";
// TODO: the client's content asks for social media links; the live site lists none yet, so the footer has none.

export const footerWordmark = "Vajiram & Ravi";

/**
 * The photographs seen through the wordmark's letters, in turn (feedback item 43); the first is the ground.
 * TODO: dummy institute photos from the other sections; swap in the client's own (or a short campus video
 * poster) when they arrive.
 */
export const footerWordmarkPhotos = [
  "/images/locations/campus-exterior.webp",
  "/images/programmes/featured-classroom.webp",
  "/images/programmes/featured-library.webp",
  "/images/programmes/featured-mentoring.webp",
];

export const footerCopyright = "© 2026 Vajiram & Ravi. All rights reserved";

export const footerLegal: FooterLink[] = [
  { label: "Terms and conditions", href: links.termsAndConditions },
  { label: "Privacy policy", href: links.privacyPolicy },
  { label: "Grievance redressal", href: links.grievanceRedressal },
];

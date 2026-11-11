/**
 * Site footer, with the contents of Figma "Footer – v5 (minimal)" (2567:4286): the logo row, six link
 * columns, the social links and the legal bar; under the columns, the giant photo-filled wordmark
 * (feedback item 43). All labels in sentence case (feedback item 9).
 */

import { links, type Href } from "./links";
import { menuColumns } from "./site";

/** A footer link. Its address comes from data/links; one whose page does not exist yet renders as text. */
export type FooterLink = { label: string; href: Href };

/**
 * The six columns, left to right as in the Figma: the institute's own pages, then the same lists as the
 * header's mega menus (data/site), so the two never drift apart.
 */
export const footerColumns: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Vajiram & Ravi",
    links: [
      { label: "About us", href: links.aboutUs },
      { label: "Careers", href: links.careers },
      // The campus section holds the addresses, the phone and the map.
      { label: "Contact us", href: "#locations" },
      { label: "FAQs", href: "#faq" },
    ],
  },
  menuColumns.courses,
  menuColumns.testSeries,
  menuColumns.upscExam,
  menuColumns.examUpdates,
  menuColumns.freeResources,
];

export type SocialName = "youtube" | "facebook" | "instagram" | "telegram" | "quora" | "whatsapp";

/**
 * The social links, in the Figma's order. Each icon is the Figma's brand mark
 * (`/images/footer/social-<name>.svg`), painted in the link colour.
 * TODO: the client has not given the channels' addresses yet; until then each shows as a plain icon.
 */
export const footerSocial: { name: SocialName; label: string; href: Href }[] = [
  { name: "youtube", label: "YouTube", href: null },
  { name: "facebook", label: "Facebook", href: null },
  { name: "instagram", label: "Instagram", href: null },
  { name: "telegram", label: "Telegram", href: null },
  { name: "quora", label: "Quora", href: null },
  { name: "whatsapp", label: "WhatsApp channel", href: null },
];

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

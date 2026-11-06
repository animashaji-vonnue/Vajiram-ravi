import { RosetteMark } from "@/components/recitals/Ornaments";
import { contact } from "@/data/site";
import { issues, magazine } from "@/data/magazine";

/*
 * The page's own footer. Deliberately short: this page is about one thing, so the footer
 * closes it rather than opening a second site.
 *
 * It used to be a flat maroon panel with the painting laid on it as a watermark, and the
 * white-and-gold on that maroon was the weakest colour on the page — gold sitting on a
 * dark orange is the same hue twice, so nothing read as an accent and the whole block
 * went muddy.
 *
 * So the footer is now a time of day rather than a panel. It opens in the same deep
 * ember brown the section above ends on, warms down through it, and finishes on a lit
 * horizon with the building standing against it. That is what the painting was always
 * better suited to: multiply on a dark ground turns it into a silhouette, and a
 * silhouette needs something behind it to be a silhouette against. The links sit high on
 * the dark, where they have the contrast they need; the colour is spent at the bottom of
 * the page where there is nothing left to read.
 *
 * The brown matters as much as the dawn. This footer was briefly indigo, which made the
 * last two screens of the page the only cool thing on it — the join at the top of the
 * band read as a seam between two different sites.
 */

/**
 * Night at the top, a warm horizon at the foot — but the very bottom turns back towards
 * the dark. The copyright line lives down there, and on the open glow it was pale text on
 * bright orange at about 2.5:1, which is unreadable. So the light peaks behind the
 * building and is spent before it reaches the last rule.
 */
const SKY = "linear-gradient(180deg,#24150b 0%,#35200f 36%,#5a3520 64%,#7b4428 88%,#3b210f 100%)";
/** The sun just under the skyline, which is what makes the building read as a cut-out. */
const DAWN = "radial-gradient(58% 54% at 50% 82%,#ffa23c 0%,#e2725b 36%,transparent 74%)";

const COLUMNS = [
  {
    heading: "The Recitals",
    links: [
      { label: "Latest issue", href: "#latest" },
      { label: "The archive", href: "#archive" },
      { label: "Inside an issue", href: "#inside" },
      { label: "How to use it", href: "#how" },
    ],
  },
  {
    heading: "Read alongside",
    links: [
      { label: "Yojana Summary", href: "#alongside" },
      { label: "Kurukshetra Summary", href: "#alongside" },
      { label: "Prelims Quick Revision", href: "#alongside" },
      { label: "GS Mains Probable", href: "#alongside" },
    ],
  },
  {
    heading: "Current affairs",
    links: [
      { label: "Daily Prelims Pointers", href: "#" },
      { label: "Mains Articles", href: "#" },
      { label: "Editorial Analysis", href: "#" },
      { label: "Current Affairs Course", href: "#" },
    ],
  },
];

export default function RecitalsFooter() {
  return (
    <footer className="relative overflow-hidden" aria-label="Footer" style={{ background: SKY }}>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%]" style={{ background: DAWN }} aria-hidden="true" />

      {/*
       * Multiply is what makes this a silhouette rather than a picture pasted on: the
       * painting's cream paper leaves the sky almost untouched while the building itself
       * drops to near-black against the light behind it.
       */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-contain bg-bottom bg-no-repeat opacity-90 mix-blend-multiply"
        style={{ backgroundImage: "url(/recitals/parliament.png)" }}
        aria-hidden="true"
      />

      {/*
       * Dark ground at the very foot, painted over the horizon and the building alike.
       *
       * The copyright line sits down here, and on the open dawn it was pale text on lit
       * orange at roughly 2.5:1 — technically present, actually unreadable. Rather than
       * dim the sunrise everywhere, the light is simply spent before the last rule, which
       * is also what the building wants: something solid to stand on.
       */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px]"
        style={{ background: "linear-gradient(to top,#24150b 0%,#24150b 34%,transparent 100%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-20 pt-20 pb-10">
        <div className="flex items-start justify-between gap-20">
          <div className="flex w-[330px] shrink-0 flex-col gap-4">
            <p className="font-r-display text-[30px]/[34px] font-extrabold text-r-paper">
              The <span className="font-extrabold text-r-saffron">Recitals</span>
            </p>
            <p className="font-sans text-[15px]/[24px] font-medium text-r-sand/80">
              {issues.length} issues, every month since {magazine.firstIssue}. Free to read and download, with no
              sign-in and no email.
            </p>
            <p className="flex items-center gap-2 pt-1 font-sans text-[14px]/[21px] font-medium text-r-sand/65">
              <RosetteMark size={13} className="text-r-saffron" />
              {contact.phone} · {contact.hours}
            </p>
          </div>

          <div className="flex flex-1 justify-between gap-12">
            {COLUMNS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-4">
                <h3 className="font-sans text-[12px]/[16px] font-semibold tracking-[.16em] text-r-saffron uppercase">
                  {column.heading}
                </h3>
                <div className="flex flex-col items-start gap-3">
                  {column.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="font-sans text-[14px]/[21px] font-medium whitespace-nowrap text-r-sand/75 transition-colors duration-200 hover:text-r-paper"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*
         * The horizon has to be given room, or the skyline runs up behind the link
         * columns and the whole foot of the page turns to mush.
         */}
        <div className="h-[clamp(180px,20vw,300px)]" aria-hidden="true" />

        <div className="flex items-center justify-between border-t border-r-paper/20 pt-7 font-sans text-[13px]/[20px] font-medium text-r-paper/75">
          <p>© 2026 Vajiram &amp; Ravi. All rights reserved.</p>
          <div className="flex gap-7">
            <a href="#" className="transition-colors duration-200 hover:text-r-paper">
              Terms and Conditions
            </a>
            <a href="#" className="transition-colors duration-200 hover:text-r-paper">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

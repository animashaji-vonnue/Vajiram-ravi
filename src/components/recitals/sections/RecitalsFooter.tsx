import { FlowerMark } from "@/components/recitals/Ornaments";
import { contact } from "@/data/site";
import { issues, magazine } from "@/data/magazine";

/*
 * The page's own footer. Deliberately short: this page is about one thing, so the footer
 * closes it rather than opening a second site. It sits on the ink ground the FAQ seam
 * hands it, so the page ends dark instead of trailing off.
 */

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
    <footer className="relative overflow-hidden bg-[#60200e]" aria-label="Footer">
      {/*
       * The painted Parliament standing across the foot of the page, instead of a
       * stamped pattern. Multiply is what makes it work on a dark ground: the painting's
       * cream paper leaves the colour almost untouched while the building itself deepens,
       * so it reads as a watermark pressed into the page rather than a picture pasted on.
       */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] bg-contain bg-bottom bg-no-repeat opacity-70 mix-blend-multiply"
        style={{ backgroundImage: "url(/recitals/parliament.png)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-20 pt-20 pb-10">
        <div className="flex items-start justify-between gap-20">
          <div className="flex w-[330px] shrink-0 flex-col gap-4">
            <p className="font-r-display text-[30px]/[34px] font-extrabold text-r-paper">
              The <span className="font-extrabold text-r-amber">Recitals</span>
            </p>
            <p className="font-sans text-[15px]/[24px] font-medium text-r-sand/75">
              {issues.length} issues, every month since {magazine.firstIssue}. Free to read and download, with no
              sign-in and no email.
            </p>
            <p className="flex items-center gap-2 pt-1 font-sans text-[14px]/[21px] font-medium text-r-sand/60">
              <FlowerMark size={10} className="text-r-amber" />
              {contact.phone} · {contact.hours}
            </p>
          </div>

          <div className="flex flex-1 justify-between gap-12">
            {COLUMNS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-4">
                <h3 className="font-sans text-[12px]/[16px] font-semibold tracking-[.16em] text-r-amber uppercase">
                  {column.heading}
                </h3>
                <div className="flex flex-col items-start gap-3">
                  {column.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="font-sans text-[14px]/[21px] font-medium whitespace-nowrap text-r-sand/70 transition-colors duration-200 hover:text-r-paper"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-r-paper/12 pt-7 font-sans text-[13px]/[20px] font-medium text-r-sand/55">
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

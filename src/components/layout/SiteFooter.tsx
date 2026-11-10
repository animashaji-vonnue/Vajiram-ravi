import FooterWordmark from "@/components/sections/ClosingCta/FooterWordmark";
import LinkOrText from "@/components/ui/LinkOrText";
import Photo from "@/components/ui/Photo";
import { campuses } from "@/data/contact";
import { footerColumns, footerContactHeading, footerCopyright, footerLegal, footerTagline, footerWordmark, footerWordmarkPhotos } from "@/data/footer";
import { contact } from "@/data/site";
import { cx } from "@/lib/cx";

/** The footer's warm greys: link text and the column heads. */
const TEXT = "text-[#6e655c]";

/**
 * A footer link (motion spec): it turns burnt as an underline draws in under it from the left. The
 * underline is a background line so it follows the text onto a second line where a label wraps; a page
 * that does not exist yet stays plain text.
 */
const LINK =
  "bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[position:0_100%] bg-[length:0%_1px] [box-decoration-break:clone] [transition:color_var(--dur-fast)_var(--ease-out),background-size_var(--dur-fast)_var(--ease-out)] hover:bg-[length:100%_1px] hover:text-burnt focus-visible:bg-[length:100%_1px] focus-visible:text-burnt";

function FooterLink({ href, children }: { href: string | null; children: string }) {
  return (
    <LinkOrText href={href} className={href ? LINK : undefined}>
      {children}
    </LinkOrText>
  );
}

/**
 * The cream footer after the closing call to action (IA 12; Figma "14 · Footer", 2392:7437): the brand
 * block (logo, the one-line promise and the contact details: both campuses, the phone with its hours, the
 * email) beside the client's three link columns (Explore, Resources, Support), the giant wordmark, bold and
 * filled with photographs of the institute (FooterWordmark), and the legal bar. "Contact us" in the
 * Support column jumps to the contact block (#contact).
 */
export default function SiteFooter() {
  return (
    <footer className="relative bg-cream">
      <div className="relative mx-auto flex w-canvas flex-col items-center gap-12 px-20 pt-22 pb-8">
        <div data-stagger className={cx("relative flex w-[1280px] items-start justify-between", TEXT)}>
          <div className="flex w-[420px] shrink-0 flex-col items-start gap-5">
            <a href="#top" aria-label="Vajiram & Ravi, back to top" className="block">
              <Photo src="/images/logo.webp" alt="" sizes="176px" className="relative h-10 w-44 bg-cream" />
            </a>
            <p className="w-[380px] font-heading text-[20px]/[1.35] text-ink">{footerTagline}</p>
            <address id="contact" className="flex scroll-mt-32 flex-col items-start gap-3 text-[13.5px]/[1.5] not-italic">
              <h2 className="font-heading text-[17px]/[normal] text-[#1a1714]">{footerContactHeading}</h2>
              {campuses.map((campus) => (
                <p key={campus.id} className="w-[360px]">
                  <span className="font-semibold text-ink">{campus.city}</span> · {campus.address}
                </p>
              ))}
              <p className="whitespace-nowrap">
                <a href={contact.phoneHref} className={LINK}>
                  {contact.phone}
                </a>
                {` · ${contact.hours}`}
              </p>
              <a href={`mailto:${contact.email}`} className={cx("whitespace-nowrap", LINK)}>
                {contact.email}
              </a>
            </address>
          </div>
          {footerColumns.map((column) => (
            <div key={column.heading} className="flex w-[200px] shrink-0 flex-col items-start gap-3">
              <h2 className="w-[200px] font-heading text-[17px]/[normal] text-[#1a1714]">{column.heading}</h2>
              <ul className="flex w-[200px] flex-col items-start gap-3 text-[13.5px]/[1.4]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <FooterWordmark text={footerWordmark} photos={footerWordmarkPhotos} />

        {/* Never pre-hidden by a reveal: at the very foot of the page it might never reach the reveal line. */}
        <div className={cx("flex w-[1280px] items-start justify-between border-t border-[#1a1714]/12 pt-5 text-[13px]/[normal] whitespace-nowrap", TEXT)}>
          <p>{footerCopyright}</p>
          <nav aria-label="Legal" className="flex items-start gap-6">
            {footerLegal.map((link) => (
              <FooterLink key={link.label} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

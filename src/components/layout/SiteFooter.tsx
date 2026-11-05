import FooterSkyline from "@/components/layout/FooterSkyline";
import FooterWordmark from "@/components/sections/ClosingCta/FooterWordmark";
import LinkOrText from "@/components/ui/LinkOrText";
import { Flourish } from "@/components/ui/Ornament";
import Photo from "@/components/ui/Photo";
import { footerColumns, footerCopyright, footerLegal, footerWordmark } from "@/data/footer";
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
 * The paper footer after the closing call to action (Figma 2258:10170): the logo and email beside six link
 * columns, the line-art skyline of Raisina Hill behind them (built like a construction, FooterSkyline), the flourish, the giant orange wordmark
 * (whose letters arrive one by one, FooterWordmark) and the legal bar.
 */
export default function SiteFooter() {
  return (
    <footer className="relative bg-paper">
      <div className="relative mx-auto flex w-canvas flex-col items-center gap-12 px-20 pt-22 pb-8">
        {/* The skyline in fine line art, behind the columns; it is built stroke by stroke as the footer comes into view. */}
        <FooterSkyline className="pointer-events-none absolute top-[315.35px] left-20" />

        <div data-reveal-group className={cx("relative flex w-[1280px] items-start justify-between", TEXT)}>
          <div className="flex w-[230px] shrink-0 flex-col items-start gap-4">
            <a href="#top" aria-label="Vajiram & Ravi, back to top" className="block">
              <Photo src="/images/logo.webp" alt="" sizes="176px" className="relative h-10 w-44 bg-paper" />
            </a>
            <a href={`mailto:${contact.email}`} className={cx("text-[13.5px]/[normal] whitespace-nowrap", LINK)}>
              {contact.email}
            </a>
          </div>
          {footerColumns.map((column) => (
            <div key={column.heading} className="flex w-[156px] shrink-0 flex-col items-start gap-3">
              <h2 className="w-[156px] font-serif text-[17px]/[normal] text-[#1a1714]">{column.heading}</h2>
              <ul className="flex w-[152px] flex-col items-start gap-3 text-[13.5px]/[1.4]">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Flourish className="h-[46px]! w-50!" />

        <FooterWordmark text={footerWordmark} />

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

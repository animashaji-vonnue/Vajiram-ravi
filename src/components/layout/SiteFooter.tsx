import FooterWordmark from "@/components/sections/ClosingCta/FooterWordmark";
import LinkOrText from "@/components/ui/LinkOrText";
import Photo from "@/components/ui/Photo";
import { footerColumns, footerCopyright, footerLegal, footerSocial, footerWordmark } from "@/data/footer";
import { cx } from "@/lib/cx";

/** The footer's warm grey for links and small print, and its hairline. */
const TEXT = "text-[#6e655c]";
const RULE = "border-[#1a1714]/12";

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
 * The cream footer after the closing call to action, with the contents of Figma "Footer – v5 (minimal)"
 * (2567:4286): the logo and, opposite it on the right, the social icons (the Figma's brand marks, painted
 * in the link colour, burnt on hover), over a hairline; six link columns (Vajiram & Ravi, Courses, Test series &
 * mentorship, UPSC exam, Exam updates, Free resources), their heads in Mukta semibold capitals (the client's ask; 16px, spaced a little, so the capitals do not
 * shout), their links at the header's 16px, in the warm
 * grey; then the giant wordmark pressed into the paper (FooterWordmark, debossed); then the legal bar
 * over a hairline.
 */
export default function SiteFooter() {
  return (
    <footer className="relative bg-cream">
      <div className="relative mx-auto flex w-canvas flex-col items-center gap-12 px-20 pt-16 pb-8">
        {/* The logo row, fading in out of a soft blur as it comes into view (ui/TextMotion, data-fade): the
            logo on the left, the social icons opposite it on the right. */}
        <div data-fade className={cx("flex w-[1280px] items-center justify-between border-b pb-6", RULE)}>
          <a href="#top" aria-label="Vajiram & Ravi, back to top" className="block">
            <Photo src="/images/logo.webp" alt="" sizes="156px" className="relative h-[52px] w-[156px] bg-cream" />
          </a>
          <ul aria-label="Vajiram & Ravi on social media" className={cx("flex items-center gap-3", TEXT)}>
            {footerSocial.map((social) => {
              const mark = `url(/images/footer/social-${social.name}.svg) center / contain no-repeat`;
              return (
                <li key={social.name}>
                  <LinkOrText
                    href={social.href}
                    ariaLabel={social.label}
                    target={social.href ? "_blank" : undefined}
                    className="flex size-8 items-center justify-center rounded-full [transition:color_var(--dur-fast)_var(--ease-out),background-color_var(--dur-fast)_var(--ease-out)] hover:bg-burnt/10 hover:text-burnt"
                  >
                    <span aria-hidden="true" className="block size-5 bg-current" style={{ mask: mark, WebkitMask: mark }} />
                    {!social.href && <span className="sr-only">{social.label}</span>}
                  </LinkOrText>
                </li>
              );
            })}
          </ul>
        </div>

        {/* The six columns. */}
        {/* At 16px the longest links would push the columns together, so the columns share the width in
            proportion (the test series column, with the longest links, widest) and a long link wraps. */}
        <nav aria-label="Footer" data-stagger className={cx("grid w-[1280px] grid-cols-[0.7fr_1.1fr_1.35fr_1fr_0.95fr_1.1fr] items-start gap-x-8", TEXT)}>
          {footerColumns.map((column) => (
            <div key={column.heading} className="flex flex-col items-start gap-3.5">
              <h2 className="font-heading text-[16px]/[22px] font-semibold tracking-[0.06em] whitespace-nowrap text-ink uppercase">{column.heading}</h2>
              <ul className="flex flex-col items-start gap-3.5 text-[16px]/[22px] font-medium text-pretty">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <FooterWordmark text={footerWordmark} />

        {/* The legal bar. Never pre-hidden by a reveal: at the very foot of the page it might never reach the reveal line. */}
        <div className={cx("flex w-[1280px] flex-col items-start", TEXT)}>
          <div className={cx("flex w-full items-start justify-between border-t pt-6 text-[14px]/[20px] whitespace-nowrap", RULE)}>
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
      </div>
    </footer>
  );
}

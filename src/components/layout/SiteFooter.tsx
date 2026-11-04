import { footerColumns, legalLinks, socialLinks } from "@/data/site";

export default function SiteFooter() {
  return (
    <footer data-chrome className="border-t border-neutral-200 bg-white">
      <div className="relative mx-auto flex w-canvas flex-col gap-12 px-14 pt-16 pb-8">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
          <a href="/#top" aria-label="Back to top">
            <span
              className="block h-[42.41px] w-[176px] bg-contain bg-center bg-no-repeat [background-image:var(--image-logo)]"
              role="img"
              aria-label="Vajiram & Ravi logo"
            />
          </a>
        </div>
        <div className="flex items-start justify-between">
          {footerColumns.map((column) => (
            <div className="flex flex-col gap-3.5 whitespace-nowrap" key={column.heading}>
              <h4 className="font-display text-[12px]/[19px] font-bold text-neutral-900 uppercase">{column.heading}</h4>
              <div className="flex flex-col items-start gap-3.5">
                {column.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-display text-[14px]/[21px] font-medium text-neutral-500 transition-colors duration-200 hover:text-neutral-900"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <Icon />
              </a>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-neutral-200 pt-6 font-sans text-[14px]/[21px] font-medium whitespace-nowrap text-neutral-500">
            <p>© 2026 Vajiram &amp; Ravi. All rights reserved</p>
            <div className="flex gap-6">
              {legalLinks.map((link) => (
                <a key={link.label} href={link.href} className="transition-colors duration-200 hover:text-neutral-900">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

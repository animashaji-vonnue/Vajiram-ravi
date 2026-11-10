import { Phone } from "iconoir-react";
import { contact, nav } from "@/data/content";
import { Button } from "@/components/ui/Button";

/**
 * The header: a white bar that stays at the top, with a hairline under it, the logo on the left, the page's
 * sections in the middle and, on the right, the counsellors' number and the button to speak to them.
 */
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-[76px] border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full w-canvas items-center justify-between px-12">
        <a href="#top" aria-label="Vajiram & Ravi, home">
          <span
            aria-hidden="true"
            className="block h-10 w-[176px] bg-no-repeat [background-image:var(--image-logo)] [background-position:0_50%] [background-size:100%_106.67%]"
          />
        </a>
        <nav aria-label="Main">
          <ul className="flex gap-9">
            {nav.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-[15px] font-medium text-ink-900/80 transition-colors hover:text-saffron-600"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-6">
          <a href={contact.phoneHref} className="flex items-center gap-2 text-[15px] font-semibold text-ink-900">
            <Phone width={18} height={18} strokeWidth={1.8} className="text-saffron-600" />
            {contact.phone}
          </a>
          <Button href="#counselling" size="md" arrow={false}>
            Speak to a counsellor
          </Button>
        </div>
      </div>
    </header>
  );
}

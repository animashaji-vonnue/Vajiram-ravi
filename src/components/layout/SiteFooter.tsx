import { Facebook, Instagram, Mail, MapPin, Phone, Telegram, Whatsapp, Youtube } from "iconoir-react";
import type { ComponentType, SVGProps } from "react";
import { contact, footer, location } from "@/data/content";

const SOCIAL: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  YouTube: Youtube,
  Instagram,
  Facebook,
  Telegram,
  WhatsApp: Whatsapp,
};

/**
 * The footer, on the orange ground: the logo with the centre's location and the counsellors' phone and email, beside
 * four columns of links (the main navigation, programmes, resources and the institute); and along the foot the
 * copyright, the social links and the policies.
 */
export default function SiteFooter() {
  return (
    <footer className="ember text-white">
      <div className="mx-auto w-canvas px-12">
        <div className="grid grid-cols-[1fr_repeat(4,170px)] gap-12 pt-24 pb-16">
          <div>
            <a
              href="#top"
              aria-label="Vajiram & Ravi, back to the top"
              className="inline-flex rounded-[14px] bg-white px-4 py-2.5"
            >
              <span
                aria-hidden="true"
                className="block h-9 w-[158px] bg-no-repeat [background-image:var(--image-logo)] [background-position:0_50%] [background-size:100%_106.67%]"
              />
            </a>
            <h2 className="mt-10 text-[13px] font-semibold tracking-[0.16em] text-white/80 uppercase">Visit us</h2>
            <ul className="mt-4 flex flex-col gap-3 text-[16px]/[23px]">
              <li className="flex gap-3">
                <MapPin width={18} height={18} strokeWidth={1.8} className="mt-0.5 shrink-0 text-white/85" />
                <span>
                  {location.area}
                  <span className="block text-white/85">{location.address}</span>
                </span>
              </li>
              <li>
                <a href={contact.phoneHref} className="flex items-center gap-3 hover:text-glow">
                  <Phone width={18} height={18} strokeWidth={1.8} className="text-white/85" />
                  {contact.phone}
                  <span className="text-white/85">· {contact.hours}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 hover:text-glow">
                  <Mail width={18} height={18} strokeWidth={1.8} className="text-white/85" />
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-[13px] font-semibold tracking-[0.16em] text-white/80 uppercase">{column.title}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[16px] text-white transition-colors hover:text-glow">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/30 py-7 text-[14px] text-white/90">
          <p>© 2026 Vajiram &amp; Ravi. All rights reserved.</p>
          <ul className="flex gap-2">
            {footer.social.map((item) => {
              const Icon = SOCIAL[item.name];
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    aria-label={item.name}
                    className="flex size-10 items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:border-white hover:text-white"
                  >
                    <Icon width={18} height={18} strokeWidth={1.6} />
                  </a>
                </li>
              );
            })}
          </ul>
          <ul className="flex gap-6">
            {footer.policies.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

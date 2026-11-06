import Image from "next/image";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  NavArrowRight,
  Phone,
  Telegram,
  User,
  Whatsapp,
  Youtube,
} from "iconoir-react";
import type { ComponentType, SVGProps } from "react";
import { footer } from "@/data/site";
import SplitHeading from "@/components/ui/SplitHeading";

/** The social marks: Iconoir's where it has one, and the design's own white mark for Quora, which Iconoir lacks. */
function Quora(props: SVGProps<SVGSVGElement>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a 20px brand mark, shown as drawn
    <img src="/images/footer/quora.svg" alt="" width={props.width as number} height={props.height as number} />
  );
}
const SOCIAL_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  YouTube: Youtube,
  Facebook,
  Instagram,
  Telegram,
  Quora,
  "WhatsApp channel": Whatsapp,
};

/** The contact cards' icons, Iconoir's. */
const CONTACT_ICONS = { user: User, whatsapp: Whatsapp, mail: Mail, phone: Phone };

/**
 * The warm colour field behind the card, from the design: five soft ellipses in the brand's oranges and browns,
 * blurred together. Positions and sizes are the design's, in canvas pixels on its 1408 × 740 card; they are drawn as
 * shares of the card so the field stretches over the contact block above the links.
 */
const FIELD = { width: 1408, height: 740 };
const BLOBS = [
  { src: "/images/footer/blob-1.svg", left: -220, top: -260, width: 820, height: 620 },
  { src: "/images/footer/blob-2.svg", left: -160, top: 260, width: 900, height: 760 },
  { src: "/images/footer/blob-3.svg", left: 760, top: -260, width: 520, height: 380 },
  { src: "/images/footer/blob-4.svg", left: 760, top: 180, width: 820, height: 700 },
  { src: "/images/footer/blob-5.svg", left: 1050, top: -200, width: 700, height: 900 },
];

/**
 * The site footer, after the design's "Footer – v7 (card · warm colour field)" (3347:42630) with its contact block
 * (3267:42644) on the same card, the way zaro.ai runs its last call to action into its footer: a rounded card in the
 * brand's darkest brown over a blurred field of warm oranges. It opens with the contact block (the heading, then four
 * cards for counselling, WhatsApp, email and phone) between the Qutub Minar and the Charminar in light line art; then
 * the logo on a white pill and four columns of links in groups (courses; test series and mentorship with the
 * institute's own pages; the UPSC exam; exam updates with free resources); along the foot, under a hairline, the
 * copyright, the social links and the policies.
 */
export default function SiteFooter() {
  return (
    <footer className="bg-white px-4 py-5">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-[#431105] px-14 pt-14 pb-10 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 blur-[90px]">
          {BLOBS.map((blob) => (
            // eslint-disable-next-line @next/next/no-img-element -- decorative shapes, blurred together
            <img
              key={blob.src}
              src={blob.src}
              alt=""
              className="absolute max-w-none"
              style={{
                left: `${(blob.left / FIELD.width) * 100}%`,
                top: `${(blob.top / FIELD.height) * 100}%`,
                width: `${(blob.width / FIELD.width) * 100}%`,
                height: `${(blob.height / FIELD.height) * 100}%`,
              }}
            />
          ))}
        </div>
        {/* A wash of the card's brown over the colour field, so the white text reads on every part of it. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#431105]/35" />

        {/*
          The contact block, from the design's "CTA updated" (3267:42644), opening the footer on the same card as the
          links, as zaro.ai's last call to action runs on into its footer. The Qutub Minar and the Charminar stand at
          either side of it in light line art.
        */}
        <section aria-labelledby="contact-title" className="relative pt-10 pb-24">
          {/*
            The drawings are pale lines on white paper: inverted, the paper goes black and drops out under a screen
            blend, and brightened after that, the lines come out light.
          */}
          <Image
            src={footer.contact.monuments.left}
            alt=""
            width={752}
            height={1344}
            sizes="340px"
            className="absolute bottom-0 left-[-120px] -z-10 h-[640px] w-auto opacity-50 mix-blend-screen [filter:invert(1)_brightness(4)]"
          />
          <Image
            src={footer.contact.monuments.right}
            alt=""
            width={752}
            height={1344}
            sizes="300px"
            className="absolute right-[-70px] bottom-[-34px] -z-10 h-[540px] w-auto opacity-50 mix-blend-screen [filter:invert(1)_brightness(4)]"
          />

          <div className="flex flex-col items-center text-center">
            <p className="font-display text-[14px]/[21px] font-semibold tracking-[0.08em] text-white/75 uppercase">
              {footer.contact.eyebrow}
            </p>
            <h2
              data-split
              id="contact-title"
              className="mt-5 font-serif text-[48px]/[1.1] font-normal tracking-[-0.02em] [font-variation-settings:'SOFT'_0,'WONK'_0]"
            >
              <SplitHeading text={footer.contact.heading} />
            </h2>
            <p className="mt-3 font-sans text-[18px]/[25px] font-medium text-white/75">{footer.contact.intro}</p>
          </div>

          <ul data-reveal-group className="mx-auto mt-12 grid w-[1080px] grid-cols-4 gap-4">
            {footer.contact.cards.map((card) => {
              const Icon = CONTACT_ICONS[card.icon];
              return (
                <li
                  key={card.title}
                  className="flex flex-col gap-6 rounded-[20px] border border-neutral-200 bg-white p-6 text-left"
                >
                  <Icon width={32} height={32} strokeWidth={1.5} className="text-[#d1570e]" />
                  <div className="flex flex-1 flex-col gap-3">
                    <h3 className="font-display text-[20px]/[27px] font-semibold text-balance text-neutral-900">
                      {card.title}
                    </h3>
                    <p className="font-sans text-[15px]/[22px] font-medium text-neutral-500">
                      {card.text}
                      {"detail" in card && <span className="block text-neutral-700">{card.detail}</span>}
                    </p>
                  </div>
                  <a
                    href={card.action.href}
                    className="group flex items-center gap-1.5 border-t border-neutral-200 pt-6 font-display text-[16px]/[22px] font-semibold text-[#ae3b0f]"
                  >
                    {card.action.label}
                    <ArrowRight width={16} height={16} className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <a
          href="#top"
          aria-label="Vajiram & Ravi, back to the top"
          className="mt-20 inline-flex rounded-[14px] bg-white px-[18px] py-2.5"
        >
          <span
            aria-hidden="true"
            className="block h-9 w-[152px] bg-no-repeat [background-image:var(--image-logo)] [background-position:0_50%] [background-size:100%_106.67%]"
          />
        </a>

        <nav aria-label="Footer" className="mt-16 grid grid-cols-4 gap-8">
          {footer.columns.map((column, i) => (
            <div key={i} className="flex flex-col gap-12">
              {column.map((group) => (
                <div key={group.title}>
                  <h2 className="font-display text-[12px]/[16px] font-semibold tracking-[0.04em] uppercase">
                    {group.title}
                  </h2>
                  <ul className="mt-6 flex flex-col gap-3">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="group inline-flex items-center gap-1 font-display text-[14px]/[21px] font-medium text-white/90 transition-colors hover:text-white"
                        >
                          {link.label}
                          <NavArrowRight
                            aria-hidden="true"
                            width={12}
                            height={12}
                            strokeWidth={2}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="mt-16 flex items-center justify-between border-t border-white/40 pt-6">
          <div className="flex items-center gap-8">
            <p className="font-sans text-[14px]/[21px] font-medium">{footer.copyright}</p>
            <ul className="flex gap-3">
              {footer.social.map((item) => {
                const Icon = SOCIAL_ICONS[item.name];
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      aria-label={item.name}
                      className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                    >
                      <Icon width={20} height={20} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <ul className="flex gap-6 font-sans text-[14px]/[21px] font-medium">
            {footer.policies.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="text-white/90 transition-colors hover:text-white hover:underline">
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

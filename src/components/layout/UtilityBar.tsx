import { contact, utilityBar } from "@/data/site";

/**
 * The 39px mahogany line at the very top (Figma "Header / Utility bar", 2258:10448): the admissions
 * number and hours in 14px Source Sans 3 Medium at 85% parchment, centred, with "Contact us" after them in 16px
 * SemiBold saffron, underlined. The number is a tel: link whose underline draws in on hover, as on the
 * page's other text links; "Contact us" thickens its line instead. SiteHeader slides this bar away
 * once the page has scrolled.
 */
export default function UtilityBar() {
  return (
    <div className="h-[39px] bg-mahogany">
      <p className="mx-auto flex h-full w-canvas items-center justify-center gap-2.5 px-10">
        <span className="text-[14px]/[21px] font-medium whitespace-pre text-parchment/85">
          {`${utilityBar.lead} `}
          <a href={contact.phoneHref} className="group/tel relative">
            {contact.phone}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current [transition:scale_var(--dur-fast)_var(--ease-out)] group-hover/tel:scale-x-100"
            />
          </a>
          {`  ·  ${contact.hours}`}
        </span>
        <a
          href={utilityBar.link.href}
          className="text-[16px]/[23px] font-semibold whitespace-nowrap text-saffron underline decoration-1 [text-underline-position:from-font] [transition:text-decoration-thickness_var(--dur-fast)_var(--ease-out)] hover:decoration-2"
        >
          {utilityBar.link.label}
        </a>
      </p>
    </div>
  );
}

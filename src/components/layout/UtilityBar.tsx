import { contact } from "@/data/site";

/** Thin yellow strip above the header with the admissions phone line. */
export default function UtilityBar() {
  return (
    <div data-chrome="utility" className="flex justify-center bg-sun-200 px-10 py-2" role="note">
      <div className="flex items-center gap-2.5">
        <span className="text-center font-display text-[14px]/[21px] font-medium whitespace-pre text-neutral-900">
          {`For registration or seat allotment, call ${contact.phone}  ·  ${contact.hours}`}
        </span>
        <a
          className="font-display text-[16px]/[23px] font-semibold text-brand-700 underline decoration-from-font [text-underline-position:from-font] transition-colors duration-200 hover:text-brand-800"
          href="/#contact"
        >
          Contact us
        </a>
      </div>
    </div>
  );
}

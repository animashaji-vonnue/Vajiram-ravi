import { useId } from "react";
import IndianLink from "@/components/ui/IndianLink";
import type { FooterLink } from "@/data/footer";
import type { Menu } from "@/data/site";
import { cx } from "@/lib/cx";

/*
 * The panel a header menu opens (All Courses, Study Materials, UPSC Exam). The design draws no panels,
 * so this one is built in the final palette: a paper card with a hairline border, Mukta column
 * heads, ink links that turn burnt as an underline draws in under them, and an Indian link to the full
 * listing at its foot. It hangs 8px under the main header, its column text in line with its trigger's
 * label.
 *
 * Motion spec: it fades in as it drops 8px into place (--dur-base, --ease-out), and leaves in 70% of
 * that with --ease-in. Closed, it is invisible and inert, so its links are out of the tab order.
 */

/** A dense menu link: no medallion, just the Indian link's underline draw. A missing page stays text. */
function MenuLink({ link }: { link: FooterLink }) {
  const text = "relative inline-block text-[15px]/[22px] font-medium whitespace-nowrap";
  if (link.href === null) return <span className={cx(text, "text-clay")}>{link.label}</span>;
  return (
    <a
      href={link.href}
      className={cx(text, "group/ml text-ink [transition:color_var(--dur-instant)_var(--ease-out)] hover:text-burnt focus-visible:text-burnt")}
    >
      {link.label}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current [transition:scale_var(--dur-fast)_var(--ease-out)] group-hover/ml:scale-x-100 group-focus-visible/ml:scale-x-100"
      />
    </a>
  );
}

type MegaMenuProps = {
  id: string;
  menu: Menu;
  open: boolean;
};

export default function MegaMenu({ id, menu, open }: MegaMenuProps) {
  const uid = useId();
  return (
    <div
      id={id}
      inert={!open}
      className={cx(
        // 28px below its 39px trigger is 8px below the 80px header; the transparent bridge above keeps the
        // pointer "inside" while it crosses that gap.
        "absolute top-[calc(100%+28px)] -left-3.5 z-10 w-max rounded-xl border border-[#e8e4df] bg-paper p-7 shadow-hover",
        "before:absolute before:inset-x-0 before:-top-7 before:h-7",
        open
          ? "visible translate-y-0 opacity-100 [transition:opacity_var(--dur-base)_var(--ease-out),translate_var(--dur-base)_var(--ease-out),visibility_0s]"
          : "invisible -translate-y-(--rise-sm) opacity-0 [transition:opacity_calc(var(--dur-base)*0.7)_var(--ease-in),translate_calc(var(--dur-base)*0.7)_var(--ease-in),visibility_0s_calc(var(--dur-base)*0.7)]",
      )}
    >
      <div className="flex gap-12">
        {menu.columns.map((column, i) => (
          <div key={column.heading} className="flex flex-col">
            <p id={`${uid}-${i}`} className="font-heading text-[20px]/[26px] font-medium text-ink">
              {column.heading}
            </p>
            <ul aria-labelledby={`${uid}-${i}`} className="mt-4 flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <MenuLink link={link} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t border-[#e8e4df] pt-5">
        <IndianLink tone="light" href={menu.more.href}>
          {menu.more.label}
        </IndianLink>
      </div>
    </div>
  );
}

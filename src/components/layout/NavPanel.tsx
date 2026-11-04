import Photo from "@/components/ui/Photo";
import type { NavMenu } from "@/data/site";
import { cx } from "@/lib/cx";

type NavPanelProps = {
  id: string;
  menu: NavMenu;
  open: boolean;
  /** Set once the header is hovered or focused, so the feature picture is ready when the panel opens. */
  warm: boolean;
  /** Called when a link is chosen, so the header can close the panel. */
  onNavigate: () => void;
  /** Receives the content box, which the header measures to size the shared background. */
  contentRef: (element: HTMLDivElement | null) => void;
};

/** Short lists stay in one column; longer ones flow down into two or three. */
function columns(count: number): string {
  if (count > 10) return "columns-3";
  if (count > 5) return "columns-2";
  return "columns-1";
}

/**
 * One header menu's contents: a small heading and the links on the left, and a feature card with a
 * picture on the right. The panels for all the menus sit in the same place under the header bar and
 * crossfade as you move between items (SiteHeader draws the shared background behind them).
 * A closed panel is faded out, hidden and `inert`, so nothing in it can be focused or read out.
 */
export default function NavPanel({ id, menu, open, warm, onNavigate, contentRef }: NavPanelProps) {
  return (
    // The top padding bridges the gap under the bar, so the pointer can cross it without closing the panel.
    <div
      id={id}
      inert={!open}
      className={cx(
        "absolute top-full left-0 w-full pt-2 transition-[opacity,visibility] duration-200 ease-smooth",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <div ref={contentRef} className="grid grid-cols-[1fr_300px] gap-10 p-6">
        <div>
          <p className="font-mono text-[12px]/[16px] font-medium tracking-[0.72px] text-neutral-500 uppercase">
            {menu.heading}
          </p>
          <ul className={cx("mt-3 gap-x-6", columns(menu.links.length))}>
            {menu.links.map((link) => (
              <li key={link.label} className="break-inside-avoid">
                <a
                  href={link.href}
                  onClick={onNavigate}
                  className="-mx-2 flex min-h-9 items-center rounded-lg px-2 py-1.5 font-display text-[15px]/[22px] font-medium text-neutral-800 transition-colors duration-200 hover:bg-brand-50 hover:text-brand-700 focus-visible:rounded-lg focus-visible:-outline-offset-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={menu.feature.href}
          onClick={onNavigate}
          className="group/feature flex flex-col gap-2.5 self-start rounded-xl focus-visible:rounded-xl"
        >
          <Photo
            className="relative h-[150px] w-full overflow-hidden rounded-xl bg-neutral-300 transition-opacity duration-300 group-hover/feature:opacity-90"
            src={menu.feature.image}
            alt=""
            sizes="300px"
            loading={warm ? "eager" : "lazy"}
          />
          <span className="font-display text-[16px]/[22px] font-medium text-neutral-900">{menu.feature.title}</span>
          <span className="font-sans text-[14px]/[20px] text-neutral-600">{menu.feature.text}</span>
        </a>
      </div>
    </div>
  );
}

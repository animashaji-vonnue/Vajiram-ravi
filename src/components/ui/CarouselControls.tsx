import { CarouselChevronIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

/*
 * Arrows and dots shared by PeekCarousel and TrackCarousel. Both carousels mark their root with
 * `group/car`; the arrows fade in while that root is hovered or holds keyboard focus, and stay
 * visible on touch screens.
 */

const ARROW =
  "pointer-events-none absolute z-3 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-control bg-white text-[#1f1f1f] opacity-0 shadow-[0_16px_40px_-8px_rgba(28,25,23,.1),0_2px_4px_rgba(28,25,23,.05)] [transition:opacity_.2s_ease-out,translate_.25s_var(--ease-smooth),background-color_.2s,box-shadow_.2s] hover:bg-neutral-50 hover:shadow-[0_18px_40px_-8px_rgba(28,25,23,.18),0_2px_4px_rgba(28,25,23,.06)] active:bg-neutral-100 group-hover/car:pointer-events-auto group-hover/car:translate-x-0 group-hover/car:opacity-100 group-has-[:focus-visible]/car:pointer-events-auto group-has-[:focus-visible]/car:translate-x-0 group-has-[:focus-visible]/car:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-100";

type CarouselArrowProps = {
  direction: "prev" | "next";
  label: string;
  onClick: () => void;
  /** Positioning classes (top and left/right). */
  className: string;
  /** Hides the arrow at either end of a track carousel. */
  hidden?: boolean;
};

export function CarouselArrow({ direction, label, onClick, className, hidden = false }: CarouselArrowProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cx(ARROW, direction === "prev" ? "-translate-x-2" : "translate-x-2", hidden && "invisible", className)}
    >
      <CarouselChevronIcon className={direction === "prev" ? "-scale-x-100" : undefined} />
    </button>
  );
}

export const DOTS = "flex h-3.5 items-center gap-0.5";

type CarouselDotProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

/** A page marker: a small square turned on its corner, light grey, or burnt orange for the page on view. */
export function CarouselDot({ label, active, onClick }: CarouselDotProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-label={label}
      aria-selected={active}
      onClick={onClick}
      className="relative flex size-3.5 items-center justify-center after:absolute after:-inset-x-px after:-inset-y-2 focus-visible:rounded-sm focus-visible:outline-offset-2"
    >
      <span
        className={cx(
          "size-2.5 rotate-45 transition-colors duration-300",
          active ? "bg-brand-600" : "bg-neutral-300 hover:bg-neutral-400",
        )}
      />
    </button>
  );
}

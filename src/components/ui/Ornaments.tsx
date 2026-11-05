import { cx } from "@/lib/cx";

/**
 * The rule either side of a title, after the brief's "Our collections" heading: a double line that runs in from
 * the edge, then a small outlined diamond with a scroll on either side, ending at the title. It fills the room it is
 * given unless `className` sets a width. Drawn for the left; `mirrored` turns it to face the title from the right.
 */
export function TitleRule({
  colour,
  mirrored = false,
  className,
}: {
  colour: string;
  mirrored?: boolean;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={cx("flex flex-1 items-center", mirrored && "-scale-x-100", className)}>
      <span className="h-[5px] flex-1 border-y" style={{ borderColor: colour }} />
      <svg
        width="64"
        height="20"
        viewBox="0 0 64 20"
        fill="none"
        stroke={colour}
        strokeWidth="1.2"
        className="shrink-0"
      >
        <path d="M0 10H14" />
        <path d="M14 10C18 10 19 6 22 6C24.5 6 24.5 9 22.5 9" strokeLinecap="round" />
        <path d="M14 10C18 10 19 14 22 14C24.5 14 24.5 11 22.5 11" strokeLinecap="round" />
        <path d="M32 3L39 10L32 17L25 10Z" />
        <circle cx="32" cy="10" r="1.8" fill={colour} stroke="none" />
        <path d="M39 10C43 10 44 6 47 6" strokeLinecap="round" />
        <path d="M39 10C43 10 44 14 47 14" strokeLinecap="round" />
        <path d="M47 10H64" />
      </svg>
    </span>
  );
}

/** The small ornament under a title: short double lines meeting a diamond framed in a lozenge. */
export function Lozenge({ colour, className }: { colour: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="120"
      height="22"
      viewBox="0 0 120 22"
      fill="none"
      stroke={colour}
      strokeWidth="1.2"
      className={className}
    >
      <path d="M2 9H40M2 13H40M80 9H118M80 13H118" />
      <path d="M40 11C44 11 46 5 52 5H68C74 5 76 11 80 11C76 11 74 17 68 17H52C46 17 44 11 40 11Z" />
      <path d="M60 4L67 11L60 18L53 11Z" />
      <path d="M60 7.5L63.5 11L60 14.5L56.5 11Z" fill={colour} stroke="none" />
    </svg>
  );
}

import type { ReactNode } from "react";
import Medallion from "@/components/ui/Medallion";
import type { Href } from "@/data/links";
import { cx } from "@/lib/cx";

/*
 * The "Indian link" (motion spec): text with the round arrow medallion after it, used for "Register
 * now", "View on maps", "Read the analysis", "See how the preparation works" and card links. On hover an
 * underline draws left to right under the text (an already-underlined link thickens its line from 1px to
 * 2px instead), the medallion's arrow nudges 2px; pressing nudges it 5px.
 */

const TONE = {
  /** On light papers: burnt text and a burnt medallion. */
  light: { text: "text-burnt", medallion: "burnt" },
  /** On dark bands: saffron text and a saffron medallion. */
  dark: { text: "text-saffron", medallion: "saffron" },
} as const;

type IndianLinkProps = {
  children: ReactNode;
  tone: keyof typeof TONE;
  /** A link; null for a page that does not exist yet (plain text); omit and pass onClick for a button. */
  href?: Href;
  onClick?: () => void;
  target?: string;
  /** Underlined at rest, as drawn (the hover then thickens the line). Otherwise the line draws on hover. */
  underlined?: boolean;
  /** "md": 15px Source Sans 3 Bold with the 26px medallion, as on most links. "sm": 13px with a 24px medallion, for links inside small cards. */
  size?: "md" | "sm";
  /** Medallion size in px, when it differs from the size's own. */
  medallion?: number;
  /** Extra text styles (colour, spacing). */
  className?: string;
  ariaLabel?: string;
};

export default function IndianLink({ children, tone, href, onClick, target, underlined = false, size = "md", medallion, className, ariaLabel }: IndianLinkProps) {
  const look = TONE[tone];
  const medallionSize = medallion ?? (size === "sm" ? 24 : 26);
  const classes = cx(
    "group/medal inline-flex items-center font-sans font-bold whitespace-nowrap",
    size === "sm" ? "gap-1.5 text-[13px]/[18px]" : "gap-2 text-[15px]/[22px]",
    look.text,
    className,
  );
  const content = (
    <>
      <span
        className={cx(
          "relative",
          underlined &&
            "underline decoration-1 underline-offset-[3px] [transition:text-decoration-thickness_var(--dur-fast)_var(--ease-out)] group-hover/medal:decoration-2",
        )}
      >
        {children}
        {!underlined && (
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-current [transition:scale_var(--dur-fast)_var(--ease-out)] group-hover/medal:scale-x-100"
          />
        )}
      </span>
      <Medallion tone={look.medallion} size={medallionSize} pressNudge />
    </>
  );

  if (href === null) return <span className={cx(classes, "cursor-default")}>{content}</span>;
  if (href !== undefined) {
    return (
      <a href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} aria-label={ariaLabel} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={cx(classes, "cursor-pointer")}>
      {content}
    </button>
  );
}

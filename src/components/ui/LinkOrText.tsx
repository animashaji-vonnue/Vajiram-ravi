import type { ReactNode } from "react";
import type { Href } from "@/data/links";

type LinkOrTextProps = {
  href: Href;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  target?: string;
};

/**
 * A link when its page exists, plain text when it does not yet (`href` null, see data/links), so the page
 * never shows a link that goes nowhere. Addresses off this page open in the same tab, like the live site's.
 */
export default function LinkOrText({ href, className, children, ariaLabel, target }: LinkOrTextProps) {
  if (href === null) return <span className={className}>{children}</span>;
  return (
    <a href={href} className={className} aria-label={ariaLabel} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  );
}

import { ArrowRight } from "iconoir-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/**
 * The site's buttons: rounded pills, after mastersunion.org's.
 * - saffron: the institute's colour, for the main action in a section.
 * - light: white, for the main action on ink.
 * - ghost-light: an outline on ink. ghost-dark: an outline on paper or white.
 * An arrow follows the label and nudges right on hover.
 */
export type ButtonTone = "saffron" | "light" | "ghost-light" | "ghost-dark";

const TONE: Record<ButtonTone, string> = {
  saffron: "bg-saffron-500 text-white hover:bg-saffron-600",
  light: "bg-white text-ink-900 hover:bg-paper",
  "ghost-light": "border border-white/35 text-white hover:border-white hover:bg-white/10",
  "ghost-dark": "border border-ink-900/25 text-ink-900 hover:border-ink-900 hover:bg-ink-900/5",
};

const SIZE = {
  md: "h-11 gap-2 px-5 text-[15px]",
  lg: "h-14 gap-2.5 px-7 text-[16px]",
};

export function Button({
  href,
  children,
  tone = "saffron",
  size = "lg",
  arrow = true,
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: ButtonTone;
  size?: keyof typeof SIZE;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cx(
        "group/button inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap transition-colors duration-200",
        SIZE[size],
        TONE[tone],
        className,
      )}
    >
      {children}
      {arrow && (
        <ArrowRight
          width={18}
          height={18}
          strokeWidth={1.8}
          className="transition-transform duration-300 ease-out-soft group-hover/button:translate-x-1"
        />
      )}
    </a>
  );
}

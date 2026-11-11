"use client";

import type { ReactNode } from "react";
import Medallion, { type MedallionTone } from "@/components/ui/Medallion";
import type { Href } from "@/data/links";
import { cx } from "@/lib/cx";
import { pressRipple } from "@/lib/pressRipple";

/*
 * The site's button (after Figma "CTA / Indian", 2262:5786): an 8px-rounded button in Source Sans 3
 * SemiBold with the round arrow medallion at its right. Five variants and two sizes:
 *   primary         the brand orange (burnt) with white text and a cream medallion
 *   ink             ink with cream text and a saffron medallion (on orange bands)
 *   primary-dark    saffron with ink text and an ink medallion (on dark bands)
 *   secondary       white with an ink border and text and a burnt medallion
 *   secondary-dark  a cream outline with cream text and the arrow alone, no disc (on dark bands)
 * Its character (globals.css, .cta): a fine dash-dot thread stitched just inside the edge, the rhythm of
 * the journey's garland thread and the eyebrow rules. Hover behaves as the `kevin` branch's buttons do: the
 * fill steps one shade deeper over 200ms (an outline variant firms its border and takes a faint tint) and
 * the arrow slides 4px on (ui/Medallion, 300ms), and the button pops to 104% with a springy overshoot.
 * Pressing sinks it to 96% and sets off the press ripple shared with the carousel arrows (lib/pressRipple),
 * here a little stronger; focus shows the saffron ring, the hover fill and the pop.
 * A button given a set width keeps its label at the left and the medallion at the right end.
 * Disabled dims to 40% and ignores hover; loading keeps the label and swaps the medallion for a spinner
 * (and back) with the icon-swap transition below.
 * `icon` puts an icon in the medallion in place of the arrow (the header's phone).
 */

/**
 * Each variant's ground: --cta-hover the one-shade-deeper fill on hover, --cta-stitch the thread's colour,
 * --press-ring the press pulse (its ground).
 */
const VARIANT = {
  primary: {
    root: "bg-burnt text-white [--cta-hover:#b04900] [--cta-stitch:rgb(255_248_236/0.45)] [--press-ring:#cc5500]",
    medallion: "cream",
  },
  ink: {
    root: "bg-ink text-cream [--cta-hover:#3d271b] [--cta-stitch:rgb(244_196_48/0.45)] [--press-ring:#2a1a12]",
    medallion: "saffron",
  },
  "primary-dark": {
    root: "bg-saffron text-ink [--cta-hover:#e6b624] [--cta-stitch:rgb(42_26_18/0.35)] [--press-ring:#f4c430]",
    medallion: "ink",
  },
  secondary: {
    root: "border border-ink/22 bg-white text-ink hover:border-ink [--cta-hover:#fbf3e6] [--cta-stitch:rgb(204_85_0/0.4)] [--press-ring:#cc5500]",
    medallion: "burnt",
  },
  "secondary-dark": {
    root: "border border-cream/55 text-cream hover:border-cream [--cta-hover:rgb(255_248_236/0.1)] [--cta-stitch:rgb(255_248_236/0.4)] [--press-ring:#f4c430]",
    medallion: "bare",
  },
} as const satisfies Record<string, { root: string; medallion: MedallionTone }>;

export type CtaVariant = keyof typeof VARIANT;

/** lg: 52px tall, 16px label, 30px medallion. md: 44px tall, 15px label, 26px medallion. */
const SIZE = {
  lg: { root: "h-[52px] pl-6 pr-[11px] text-[16px]/[22px]", medallion: 30 },
  md: { root: "h-11 pl-5 pr-[9px] text-[15px]/[21px]", medallion: 26 },
} as const;

/**
 * The icon swap between the medallion and the loading spinner (after chanhdai's "Icon Swap", credited to
 * Emil Kowalski): the leaving one shrinks to 25%, fades and blurs to 4px while the arriving one grows from
 * there to its full size, over --dur-base on --ease-out (no overshoot). Visibility follows at the end, so
 * the hidden one is not painted at rest. Reduced motion: an instant swap (the global rule, and here too).
 */
const SWAP =
  "[transition:scale_var(--dur-base)_var(--ease-out),opacity_var(--dur-base)_var(--ease-out),filter_var(--dur-base)_var(--ease-out),visibility_var(--dur-base)_var(--ease-out)] motion-reduce:[transition:none]";
const SWAPPED_OUT = "invisible scale-25 opacity-0 blur-[4px]";

const BASE =
  "cta group/medal relative isolate inline-flex shrink-0 cursor-pointer items-center justify-between gap-3.5 rounded-lg font-sans font-semibold whitespace-nowrap";

type CtaProps = {
  children: ReactNode;
  variant: CtaVariant;
  size?: keyof typeof SIZE;
  /** A link; null for a page that does not exist yet (renders as plain text); omit for a button. */
  href?: Href;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
  /** 40% and inert. */
  disabled?: boolean;
  /** Submitting: the label stays, the medallion becomes a spinner, and clicks are ignored. */
  loading?: boolean;
  /** An icon inside the medallion instead of its arrow. */
  icon?: ReactNode;
  /** For a button that opens a dialog or menu. */
  hasPopup?: "dialog" | "menu";
  className?: string;
};

export default function Cta({
  children,
  variant,
  size = "lg",
  href,
  target,
  rel,
  onClick,
  type = "button",
  ariaLabel,
  disabled = false,
  loading = false,
  icon,
  hasPopup,
  className,
}: CtaProps) {
  const look = VARIANT[variant];
  const dims = SIZE[size];
  const classes = cx(BASE, look.root, dims.root, (disabled || loading) && "pointer-events-none", disabled && "opacity-40", className);
  const content = (
    <>
      {/* The press ripple, clipped to the button; the thread just inside its edge. */}
      <span data-ripple aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]" />
      <svg aria-hidden="true" className="cta-stitch -z-10" fill="none">
        <rect x={0.5} y={0.5} rx={5} stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeDasharray="10 6 0.5 6" />
      </svg>
      <span>{children}</span>
      {/* The medallion and the spinner share its 30/26px box and swap in place (see SWAP). */}
      <span className="relative flex shrink-0" style={{ width: dims.medallion, height: dims.medallion }} aria-hidden="true">
        <Medallion tone={look.medallion} size={dims.medallion} className={cx(SWAP, loading && SWAPPED_OUT)}>
          {icon}
        </Medallion>
        <span className={cx("absolute inset-0 flex items-center justify-center", SWAP, !loading && SWAPPED_OUT)}>
          {/* It turns only while loading, and freezes (rather than snapping back) as it swaps out. */}
          <span
            className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent [animation-duration:.8s] [animation-timing-function:linear]"
            style={{ animationPlayState: loading ? "running" : "paused" }}
          />
        </span>
      </span>
    </>
  );

  if (href === null) return <span className={cx(classes, "cursor-default")}>{content}</span>;
  if (href !== undefined) {
    return (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
        onPointerDown={disabled ? undefined : pressRipple}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        className={classes}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      type={disabled ? "button" : type}
      onClick={disabled || loading ? undefined : onClick}
      onPointerDown={disabled || loading ? undefined : pressRipple}
      aria-label={ariaLabel}
      aria-haspopup={hasPopup}
      aria-disabled={disabled || undefined}
      aria-busy={loading || undefined}
      className={classes}
    >
      {content}
    </button>
  );
}

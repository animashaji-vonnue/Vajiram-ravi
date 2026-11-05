import type { ReactNode } from "react";
import Medallion, { type MedallionTone } from "@/components/ui/Medallion";
import type { Href } from "@/data/links";
import { cx } from "@/lib/cx";

/*
 * The button of the final design (Figma "CTA / Indian", 2262:5786): an 8px-rounded button in Hanken
 * Grotesk SemiBold with the scalloped arrow medallion at its right. Four variants and two sizes, as drawn:
 *   primary         ink with cream text and a saffron medallion
 *   primary-dark    saffron with ink text and an ink medallion (on dark bands)
 *   secondary       white with an ink border and text and a burnt medallion
 *   secondary-dark  a cream outline with cream text and a saffron medallion (on dark bands)
 * Motion spec: on hover the fill darkens 8% (secondary: the border turns burnt) while the medallion turns
 * 30° and its arrow slides 3px; pressing scales it to 0.98 for 80ms; focus shows the saffron ring.
 * Disabled dims to 40% and ignores hover; loading keeps the label and swaps the medallion for a spinner
 * (and back) with the icon-swap transition below.
 * `icon` puts an icon in the medallion in place of the arrow (the header's phone): the scallop still turns.
 */

const VARIANT = {
  primary: { root: "bg-ink text-cream hover:bg-[#271811]", medallion: "saffron" },
  "primary-dark": { root: "bg-saffron text-ink hover:bg-[#e0b42c]", medallion: "ink" },
  secondary: { root: "border border-ink/22 bg-white text-ink hover:border-burnt", medallion: "burnt" },
  "secondary-dark": { root: "border border-cream/55 text-cream hover:border-burnt", medallion: "saffron" },
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
  "group/medal relative inline-flex shrink-0 cursor-pointer items-center gap-3.5 rounded-lg font-sans font-semibold whitespace-nowrap [transition:background-color_var(--dur-fast)_var(--ease-out),border-color_var(--dur-fast)_var(--ease-out),scale_80ms_var(--ease-out)] active:scale-[.98]";

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

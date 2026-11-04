import Image from "next/image";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type EyebrowProps = {
  children: ReactNode;
  tone?: "brown" | "rust" | "neutral" | "green" | "saffron" | "maroon" | "white";
  tagged?: boolean;
  /**
   * The tag in the tagged style: a coloured tag shape, or "crest" / "crest-green", a maroon or green badge
   * with the lotus mark, or "crest-white", a white badge with a green mark, for bold backgrounds.
   */
  tag?: "dark" | "amber" | "green" | "crest" | "crest-green" | "crest-white";
  /** Renders the label as the section's heading, for sections without a separate title. */
  as?: "p" | "h2";
  id?: string;
};

const EYEBROW_TONE = {
  brown: "text-brown-700",
  rust: "text-brand-900",
  neutral: "text-neutral-600",
  green: "text-green-800",
  saffron: "text-saffron-400",
  maroon: "text-red-800",
  white: "text-white",
};

/** The crest badges: the tile's colour and the mark on it, at the mark's own size. */
const LIGHT_MARK = { mark: "/images/icons/eyebrow-crest.svg", width: 18.7787, height: 18.7891 };
const CREST = {
  crest: { tile: "bg-red-800", ...LIGHT_MARK },
  "crest-green": { tile: "bg-green-700", ...LIGHT_MARK },
  "crest-white": { tile: "bg-white", mark: "/images/icons/eyebrow-crest-green.svg", width: 18.7656, height: 18.7656 },
};

const TAG_IMAGE = {
  dark: "/images/icons/eyebrow-tag.svg",
  amber: "/images/icons/eyebrow-tag-amber.svg",
  green: "/images/icons/eyebrow-tag-green.svg",
};

/**
 * Small label above a section heading, e.g. "WHY CHOOSE VAJIRAM & RAVI". `tagged` is the newer
 * style: uppercase, led by a small dark tag shape.
 */
export function Eyebrow({ children, tone = "brown", tagged = false, tag = "dark", as: Label = "p", id }: EyebrowProps) {
  const label = (
    <Label
      id={id}
      className={cx(
        "font-display text-[14px]/[21px] font-semibold whitespace-nowrap",
        EYEBROW_TONE[tone],
        tagged && "uppercase",
      )}
    >
      {children}
    </Label>
  );
  if (!tagged) return label;
  return (
    <div className="flex items-center gap-2.5">
      {tag === "crest" || tag === "crest-green" || tag === "crest-white" ? (
        <span className={cx("flex size-6 items-center justify-center rounded-[5px]", CREST[tag].tile)}>
          <Image src={CREST[tag].mark} alt="" width={CREST[tag].width} height={CREST[tag].height} />
        </span>
      ) : (
        <Image src={TAG_IMAGE[tag]} alt="" width={18} height={10} />
      )}
      {label}
    </div>
  );
}

type SectionTitleProps = {
  id: string;
  children: ReactNode;
  /** "dark" text for light sections, "light" for dark or bold ones. */
  tone?: "dark" | "light";
  className?: string;
};

/** The 40px section heading. Use `className` for width and alignment only. */
export function SectionTitle({ id, children, tone = "dark", className }: SectionTitleProps) {
  return (
    <h2
      id={id}
      className={cx(
        "font-display text-[40px]/[47px] font-semibold",
        tone === "dark" ? "text-neutral-900" : "text-white",
        className,
      )}
    >
      {children}
    </h2>
  );
}

type LeadProps = { children: ReactNode; className?: string; tone?: "muted" | "body" | "light" };

const LEAD_TONE = { muted: "text-neutral-500", body: "text-neutral-600", light: "text-white" };

/** The 18px intro paragraph under a section heading. Use `className` for width and alignment only. */
export function Lead({ children, className, tone = "muted" }: LeadProps) {
  return (
    <p className={cx("font-sans text-[18px]/[25px] font-medium", LEAD_TONE[tone], className)}>{children}</p>
  );
}

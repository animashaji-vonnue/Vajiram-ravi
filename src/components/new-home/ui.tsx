import type { CSSProperties, ReactNode } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { cx } from "@/lib/cx";

/*
 * Shared pieces for the new homepage. Server components only: no state, no effects.
 */

/** The page column. 1280px of content with a 20px gutter on phones and 40px on desktop. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-10", className)}>{children}</div>;
}

/** Four-petal flower: the page's one ornament, used as a full stop in eyebrows, bullets and separators. */
export function Flower({ className, size = 12 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <path d="M12 2.5C13.9 7 17 10.1 21.5 12 17 13.9 13.9 17 12 21.5 10.1 17 7 13.9 2.5 12 7 10.1 10.1 7 12 2.5Z" fill="currentColor" />
    </svg>
  );
}

type Tone = "paper" | "orange" | "dark";

/** Small capitals label above a heading, led by the flower. */
export function Eyebrow({ children, tone = "paper", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <p
      className={cx(
        "flex items-center gap-2.5 font-v-body text-[13px]/[16px] font-bold tracking-[0.16em] uppercase",
        tone === "paper" && "text-v-orange-600",
        tone === "orange" && "text-v-ink",
        tone === "dark" && "text-v-orange-300",
        className,
      )}
    >
      <Flower size={12} className={tone === "orange" ? "text-v-ink" : "text-v-orange-500"} />
      {children}
    </p>
  );
}

/** Section heading. Mukta ExtraBold, tight, sized to the window. */
export function Heading({
  children,
  as: Tag = "h2",
  className,
  id,
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
}) {
  return (
    <Tag
      id={id}
      className={cx(
        "font-v-head font-extrabold tracking-[-0.02em] text-balance",
        Tag === "h2" && "text-[clamp(32px,3.7vw,54px)]/[1.04]",
        Tag === "h3" && "text-[clamp(26px,2.4vw,36px)]/[1.08]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Body lead paragraph. Source Sans at a comfortable reading size, capped near 62 characters. */
export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("max-w-[62ch] font-v-body text-[18px]/[1.6] text-pretty", className)}>{children}</p>;
}

type ButtonVariant = "saffron" | "ink" | "outline" | "outline-light" | "white";

const buttonBase =
  "group/btn inline-flex h-[52px] shrink-0 items-center gap-3 rounded-full font-v-body text-[16.5px] font-semibold whitespace-nowrap transition-[background-color,color,border-color,transform] duration-200 ease-v-out active:scale-[0.97] focus-visible:outline-offset-4";

const variants: Record<ButtonVariant, { button: string; knob?: string }> = {
  saffron: {
    button: "bg-v-orange-500 pr-1.5 pl-6 text-v-ink hover:bg-v-orange-400",
    knob: "bg-v-ink text-v-paper",
  },
  ink: {
    button: "bg-v-ink pr-1.5 pl-6 text-v-paper hover:bg-v-maroon",
    knob: "bg-v-orange-500 text-v-ink",
  },
  white: {
    button: "bg-v-paper pr-1.5 pl-6 text-v-ink hover:bg-v-cream",
    knob: "bg-v-orange-500 text-v-ink",
  },
  outline: {
    button: "border-2 border-v-ink px-6 text-v-ink hover:bg-v-ink hover:text-v-paper",
  },
  "outline-light": {
    button: "border-2 border-v-paper/80 px-6 text-v-paper hover:border-v-paper hover:bg-v-paper hover:text-v-ink",
  },
};

/** Pill button rendered as a link. The filled ones carry a round arrow knob that nudges on hover. */
export function Button({
  href,
  children,
  variant = "saffron",
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
}) {
  const v = variants[variant];
  return (
    <a
      href={href}
      className={cx(buttonBase, v.button, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      {v.knob ? (
        <span className={cx("grid size-10 place-items-center rounded-full transition-transform duration-200 ease-v-out group-hover/btn:translate-x-0.5", v.knob)}>
          <ArrowRightIcon className="size-4" />
        </span>
      ) : null}
    </a>
  );
}

/** Text link with an arrow. Underlines on hover, arrow nudges. */
export function ArrowLink({
  href,
  children,
  className,
  tone = "paper",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  tone?: Tone;
}) {
  return (
    <a
      href={href}
      className={cx(
        "group/link inline-flex items-center gap-2 rounded-sm font-v-body text-[16px] font-semibold",
        tone === "paper" && "text-v-orange-600",
        tone === "orange" && "text-v-ink",
        tone === "dark" && "text-v-orange-300",
        className,
      )}
    >
      <span className="underline decoration-current/0 decoration-2 underline-offset-[5px] transition-[text-decoration-color] duration-200 group-hover/link:decoration-current">
        {children}
      </span>
      <ArrowRightIcon className="size-4 transition-transform duration-200 ease-v-out group-hover/link:translate-x-1" />
    </a>
  );
}

/**
 * A reviewer's note, for places where the brief says real content must replace what is shown.
 * Deliberately looks like a sticky annotation, not part of the design, so it cannot be mistaken for copy.
 */
export function DraftNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      role="note"
      className={cx(
        "inline-flex max-w-[70ch] items-start gap-2.5 rounded-xl border border-dashed border-v-orange-600/50 bg-v-marigold/20 px-4 py-2.5 font-v-body text-[14px]/[1.45] text-v-ink-700",
        className,
      )}
    >
      <span className="mt-px shrink-0 rounded-md bg-v-ink px-1.5 py-0.5 text-[11px] font-bold tracking-[0.08em] text-v-paper uppercase">
        Content needed
      </span>
      <span>{children}</span>
    </p>
  );
}

/**
 * The flower, tiled. Used as a quiet print on the orange fields so they read as printed
 * cloth rather than flat fills. `color` is any CSS colour; keep the opacity low.
 */
export function flowerPrint(color = "rgba(255,255,255,0.14)", size = 34): CSSProperties {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 34 34'><path d='M17 9.5C18.1 12.3 19.7 13.9 22.5 15 19.7 16.1 18.1 17.7 17 20.5 15.9 17.7 14.3 16.1 11.5 15 14.3 13.9 15.9 12.3 17 9.5Z' fill='${color}'/><circle cx='0' cy='32' r='1.4' fill='${color}'/><circle cx='34' cy='32' r='1.4' fill='${color}'/></svg>`;
  return { backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, backgroundSize: `${size}px ${size}px` };
}

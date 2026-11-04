import type { Issue } from "@/data/magazine";
import { cx } from "@/lib/cx";

type CoverProps = {
  issue: Issue;
  /** Classes for the outer frame: width, position and any transforms. The cover keeps the magazine's 260:336 page ratio. */
  className?: string;
  /** The hero cover is above the fold, so it loads eagerly. */
  priority?: boolean;
};

/**
 * A magazine cover in a thin frame, with the faint spine shadow of a printed issue.
 * The covers live on the magazine's CDN, so this is a plain <img> rather than next/image.
 * The outer span carries the caller's layout classes; the inner one is the positioned frame.
 */
export default function Cover({ issue, className, priority }: CoverProps) {
  return (
    <span className={cx("block rounded-[10px]", className)}>
      <span className="relative block aspect-[260/336] overflow-hidden rounded-[inherit] bg-media after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[linear-gradient(to_right,rgba(0,0,0,.14),rgba(0,0,0,0)_9%)] after:shadow-[inset_0_0_0_1px_rgba(28,25,23,.08)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={issue.cover}
          alt={`${issue.label} cover of The Recitals`}
          width={260}
          height={336}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="size-full object-cover"
        />
      </span>
    </span>
  );
}

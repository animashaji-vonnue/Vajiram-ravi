"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { cx } from "@/lib/cx";

type PhotoProps = {
  src: string;
  alt: string;
  /** Rendered width on the 1440px canvas, e.g. "302px"; lets next/image pick the right file size. */
  sizes: string;
  /** Classes for the frame. They must position it (`relative` or `absolute`) and fix its size; the image fills it. */
  className: string;
  /**
   * Classes for the image itself, e.g. a card's hover zoom (`group-hover/card:scale-104`). Its opacity
   * fades over 300ms and its scale and filter move over 600ms, so only the end state needs setting.
   */
  imageClassName?: string;
  style?: CSSProperties;
  id?: string;
  /** "cover" fills the frame and may crop; "contain" shows the whole image. */
  fit?: "cover" | "contain";
  /** Above the fold: load at once instead of lazily. */
  priority?: boolean;
};

/**
 * A photo in a fixed frame (motion spec, "Images"): it loads lazily below the fold, the frame shows the
 * section's paper colour until it arrives (give the frame a background), and it fades in over 300ms. The
 * frame never changes size, so nothing shifts.
 */
export default function Photo({ src, alt, sizes, className, imageClassName, style, id, fit = "cover", priority = false }: PhotoProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={className} style={style} id={id}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={cx(
          fit === "contain" ? "object-contain" : "object-cover",
          "[transition:opacity_300ms_var(--ease-out),scale_600ms_var(--ease-out),filter_600ms_var(--ease-out)]",
          loaded ? "opacity-100" : "opacity-0",
          imageClassName,
        )}
      />
    </div>
  );
}

/*
 * Shared hover and press classes from the motion spec, so every card and control reacts the same way.
 * Hover styles only apply on devices that hover (Tailwind's `hover:` already checks `(hover: hover)`); on
 * touch, cards get a press state instead.
 */

/**
 * A card that links somewhere ("Cards"): at rest --shadow-rest; on hover it lifts --lift (4px) with
 * --shadow-hover, and any medallion inside turns. On touch, pressing scales it to 0.98. Put it on the
 * card's <a>. Pair with CARD_IMAGE_ZOOM on its photo. Non-link cards stay still: don't use it there.
 */
export const CARD_LINK =
  "group/card group/medal shadow-rest [transition:translate_var(--dur-fast)_var(--ease-out),box-shadow_var(--dur-fast)_var(--ease-out),scale_80ms_var(--ease-out)] hover:-translate-y-1 hover:shadow-hover pointer-coarse:active:scale-[.98]";

/** The photo inside a linked card zooms to 1.04 (Photo's imageClassName; Photo moves it over 600ms). */
export const CARD_IMAGE_ZOOM = "group-hover/card:scale-104";

/** A button's press: scale 0.98 for 80ms. */
export const PRESS = "active:scale-[.98] [transition-property:scale] duration-80";

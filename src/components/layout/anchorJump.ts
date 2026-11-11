/**
 * Sent on window just before something scrolls the page to a section by script (a search result), so
 * the header stays hidden for the trip and the section lands right under the 80px
 * sticky header (lib/smoothScroll's HEADER_OFFSET). Clicks on in-page links need no event: the header
 * sees those itself.
 */
export const ANCHOR_JUMP_EVENT = "header:anchor-jump";

/**
 * Sent on window (cancelable, detail `{ href, replace }`) to ask for a section jump: the stairs curtain
 * covers the screen, the page jumps to the section under it and the curtain lifts off it
 * (layout/SectionJump). The header's in-page links get it on their own; the search asks with this.
 */
export const SECTION_JUMP_EVENT = "page:section-jump";

export type SectionJumpDetail = { href: string; replace?: boolean };

/**
 * Asks for a section jump to `href` ("#section"). Returns false when nothing took it (no curtain on the
 * page), so the caller can scroll there as before.
 */
export function requestSectionJump(href: string, replace = false): boolean {
  const event = new CustomEvent<SectionJumpDetail>(SECTION_JUMP_EVENT, { cancelable: true, detail: { href, replace } });
  return !window.dispatchEvent(event);
}

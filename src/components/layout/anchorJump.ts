/**
 * Sent on window just before something scrolls the page to a section by script (a search result), so
 * the header stays hidden for the trip and the section lands right under the 80px
 * sticky header (lib/smoothScroll's HEADER_OFFSET). Clicks on in-page links need no event: the header
 * sees those itself.
 */
export const ANCHOR_JUMP_EVENT = "header:anchor-jump";

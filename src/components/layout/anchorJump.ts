/**
 * Sent on window just before something scrolls the page to a section by script (a search result), so
 * the header keeps its utility bar tucked away for the trip and the section lands right under the 120px
 * sticky header (lib/smoothScroll's HEADER_OFFSET). Clicks on in-page links need no event: the header
 * sees those itself.
 */
export const ANCHOR_JUMP_EVENT = "header:anchor-jump";

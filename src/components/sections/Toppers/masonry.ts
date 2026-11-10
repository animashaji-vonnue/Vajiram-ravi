/*
 * The results grid's geometry, in canvas px: a masonry after React Bits' "Masonry" (each card goes into the
 * column that is shortest so far, so the columns interlock), and the stacked deck (Figma 2392:5020 to
 * 2392:5044) the cards are dealt from.
 */

/** The grid beside the year ruler: 1280 less the ruler (112) and the 48px between them. */
export const GRID_WIDTH = 1120;
const COLUMNS = 5;
const GAP = 20;
const COLUMN_WIDTH = (GRID_WIDTH - GAP * (COLUMNS - 1)) / COLUMNS;

/**
 * Card heights by place in the year's list (rank order), so AIR 1 is always the tallest. They are chosen
 * so that ten cards (a full top ten) close flush at 600px; shorter years leave some columns shorter, as a
 * masonry does.
 */
const HEIGHTS = [364, 250, 300, 230, 280, 350, 330, 300, 280, 216];

export type Slot = { x: number; y: number; w: number; h: number };

/** Where each of `count` cards sits. */
export function masonry(count: number): Slot[] {
  const columns = new Array<number>(COLUMNS).fill(0);
  return Array.from({ length: count }, (_, i) => {
    const h = HEIGHTS[i % HEIGHTS.length];
    const column = columns.indexOf(Math.min(...columns));
    const slot = { x: column * (COLUMN_WIDTH + GAP), y: columns[column], w: COLUMN_WIDTH, h };
    columns[column] += h + GAP;
    return slot;
  });
}

/** The grid's height for the longest of the years, so the band keeps one height whichever year is shown. */
export function gridHeight(counts: number[]): number {
  return Math.max(...counts.map((count) => Math.max(0, ...masonry(count).map((slot) => slot.y + slot.h))));
}

/** The deck's cards are 300px tall (243 at most wide), as drawn. */
const DECK_HEIGHT = 300;
const DECK_WIDTH = 243;

/**
 * Each card's place in the stacked deck, as drawn: AIR 1 on top and a little lower, the next ones peeking
 * out above it, the fifth turned 6.4°; the rest lie square beneath them.
 */
const DECK_POSES = [
  { dx: 0, dy: 14, turn: 0 },
  { dx: 3, dy: -5, turn: -2.5 },
  { dx: -4, dy: -12, turn: 2 },
  { dx: 2, dy: -14, turn: -4.5 },
  { dx: 8, dy: -9, turn: 6.4 },
];

/**
 * The transform that puts the card at `slot` into its place in the deck at the grid's centre (the card's
 * transform origin is its centre): moved there, turned and scaled to the deck's card size.
 */
export function deckTransform(slot: Slot, index: number, gridHeightPx: number): string {
  const pose = DECK_POSES[index] ?? { dx: 0, dy: -10, turn: index % 2 ? 3 : -3 };
  const scale = Math.min(DECK_HEIGHT / slot.h, DECK_WIDTH / slot.w);
  const tx = GRID_WIDTH / 2 + pose.dx - (slot.x + slot.w / 2);
  const ty = gridHeightPx / 2 + pose.dy - (slot.y + slot.h / 2);
  return `translate(${tx}px, ${ty}px) rotate(${pose.turn}deg) scale(${scale.toFixed(3)})`;
}

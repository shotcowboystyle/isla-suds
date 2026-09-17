import {describe, it, expect} from 'vitest';
import {accentIndicesFor} from './JumboMarquee';

/**
 * The marquee renders 5 rows x 4 tiles over a 5-word list. These are the shapes
 * the old generator got wrong: it only produced 6 entries for 8 rows (so the
 * last rows accented nothing), it picked one word per *row* rather than per
 * tile (so the accent painted as a repeated vertical column), and it used
 * Math.random inside a useMemo, which disagreed between server and client.
 */
const ROWS = 5;
const TILES = 4;
const WORDS = 5;

const everyCell = (fn: (row: number, tile: number) => void) => {
  for (let row = 0; row < ROWS; row++) {
    for (let tile = 0; tile < TILES; tile++) fn(row, tile);
  }
};

describe('accentIndicesFor', () => {
  it('always lands on real, distinct words', () => {
    everyCell((row, tile) => {
      const indices = accentIndicesFor(row, tile, WORDS);
      expect(indices).toHaveLength(2);
      expect(new Set(indices).size).toBe(indices.length);
      for (const index of indices) {
        expect(Number.isInteger(index)).toBe(true);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(WORDS);
      }
    });
  });

  it('starts each tile of a row on a different word', () => {
    for (let row = 0; row < ROWS; row++) {
      const firsts = Array.from({length: TILES}, (_, tile) => accentIndicesFor(row, tile, WORDS)[0]);
      expect(new Set(firsts).size).toBe(TILES);
    }
  });

  it('offsets each row, so no two rows share a tile pattern', () => {
    const rows = Array.from({length: ROWS}, (_, row) =>
      Array.from({length: TILES}, (_, tile) => accentIndicesFor(row, tile, WORDS).join('+')).join(','),
    );
    expect(new Set(rows).size).toBe(ROWS);
  });

  it('is deterministic, so SSR and the client agree', () => {
    expect(accentIndicesFor(3, 2, WORDS)).toEqual(accentIndicesFor(3, 2, WORDS));
  });

  it('degrades on short word lists instead of producing NaN or duplicates', () => {
    expect(accentIndicesFor(0, 0, 0)).toEqual([]);
    expect(accentIndicesFor(2, 1, 1)).toEqual([0]);
    expect(new Set(accentIndicesFor(1, 1, 2)).size).toBe(2);
  });
});

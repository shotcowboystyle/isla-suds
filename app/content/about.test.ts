import {describe, it, expect} from 'vitest';
import {ABOUT_PAGE} from './about';

/** Every visible string in the copy file, flattened. */
function allCopy(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allCopy);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allCopy);
  return [];
}

const copy = allCopy(ABOUT_PAGE).join(' ');

describe('ABOUT_PAGE content', () => {
  it('has meta for the route', () => {
    expect(ABOUT_PAGE.meta.title).toContain('Isla Suds');
    expect(ABOUT_PAGE.meta.description.length).toBeGreaterThan(50);
  });

  it('reads the hero as one sentence pair', () => {
    const {lead, stamp, trail} = ABOUT_PAGE.hero;
    expect(`${lead} ${stamp} ${trail}`).toBe('Made in our kitchen. Named for our daughter.');
  });

  it('tells only the story the owner confirmed (2026-10-07)', () => {
    // Not true: no founder named Sarah, no corporate exit, no Depression-era grandmother.
    expect(copy).not.toMatch(/sarah|corporate|maternity|depression|grandmother|lard/i);
    // Not ingredients.
    expect(copy).not.toMatch(/honey|clay|botanical/i);
    // True, and the page depends on them.
    expect(copy).toMatch(/family recipe/i);
    expect(copy).toMatch(/farmers market/i);
    expect(copy).toMatch(/goat milk/i);
    expect(ABOUT_PAGE.made.cureWeeks).toBe(6);
    expect(ABOUT_PAGE.isla.quote).toBe("If we wouldn't use it on Isla's skin, we don't sell it.");
  });

  it('follows the fragrance and punctuation rules', () => {
    expect(copy).toMatch(/no added fragrance/i);
    expect(copy).not.toMatch(/unscented|fragrance-free/i);
    expect(copy).not.toContain('—');
  });

  it('gives every polaroid and market frame alt text', () => {
    for (const item of [...ABOUT_PAGE.made.photos, ...ABOUT_PAGE.market.frames]) {
      expect(item.alt.length).toBeGreaterThan(10);
    }
  });
});

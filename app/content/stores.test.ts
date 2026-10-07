import {describe, it, expect} from 'vitest';
import {LOCATIONS_PAGE, STORE_POSTCARDS} from './stores';

describe('stores content', () => {
  it('gives every shop its own postcard, both Odd Ducks included', () => {
    const total = LOCATIONS_PAGE.stores.reduce((n, store) => n + store.locations.length, 0);
    expect(STORE_POSTCARDS).toHaveLength(total);
    expect(STORE_POSTCARDS.filter((s) => s.storeName === 'Odd Duck Market').map((s) => s.city)).toEqual([
      'North Charleston',
      'Summerville',
    ]);
    expect(new Set(STORE_POSTCARDS.map((s) => s.id)).size).toBe(total);
  });

  it("folds each retailer's logo into each of its shops", () => {
    for (const shop of STORE_POSTCARDS) {
      expect(shop.logo).toBeTruthy();
      expect(shop.note).toMatch(/goat/i);
      expect(shop.postcard).toBeTruthy();
    }
  });

  it('keeps the retailer list other pages read', () => {
    expect(LOCATIONS_PAGE.stores.map((s) => s.name)).toEqual(['Odd Duck Market', 'Sewee Outpost']);
  });

  it('follows the punctuation rule', () => {
    const copy = JSON.stringify(LOCATIONS_PAGE);
    expect(copy).not.toContain('—');
    expect(copy).not.toMatch(/unscented|fragrance-free/i);
  });
});

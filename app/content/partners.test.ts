import {describe, expect, it} from 'vitest';
import {DEFAULT_VENUE, PERKS, TERMS, VENUE_IDS, toVenue} from './partners';

describe('toVenue', () => {
  it('accepts every real venue id', () => {
    VENUE_IDS.forEach((id) => expect(toVenue(id)).toBe(id));
  });

  it('falls back to the default for missing or unknown values', () => {
    expect(toVenue(null)).toBe(DEFAULT_VENUE);
    expect(toVenue('')).toBe(DEFAULT_VENUE);
    expect(toVenue('bowling-alley')).toBe(DEFAULT_VENUE);
  });

  it('does not treat prototype keys as venues', () => {
    expect(toVenue('toString')).toBe(DEFAULT_VENUE);
    expect(toVenue('__proto__')).toBe(DEFAULT_VENUE);
  });
});

describe('partner terms', () => {
  it('prices agree with the published discount', () => {
    expect(TERMS.wholesale).toBe(TERMS.retail * (1 - TERMS.discountPercent / 100));
  });

  it('the pricing perk quotes the same numbers', () => {
    const pricing = PERKS.find((perk) => perk.price);
    expect(pricing?.price).toEqual({pay: TERMS.wholesale, sell: TERMS.retail});
    expect(pricing?.body).toContain(`$${TERMS.wholesale}`);
  });
});

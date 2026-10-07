import {describe, it, expect} from 'vitest';
import {FOOTER} from './footer';

/** Every visible string in the copy file, flattened (pop states included). */
function allCopy(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (typeof value === 'function') return [0, 3, 10].map((n) => String(value(n)));
  if (Array.isArray(value)) return value.flatMap(allCopy);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allCopy);
  return [];
}

const copy = allCopy(FOOTER).join(' ');

describe('FOOTER content', () => {
  it('signs off with the bath-time goodbye', () => {
    expect(`${FOOTER.signoff.lead} ${FOOTER.signoff.sticker}`).toBe('See you in the tub.');
  });

  it('writes the hashtag so it reads as words', () => {
    expect(FOOTER.hashtag).toBe('#SoapIsDope');
    expect(FOOTER.hashtag).not.toContain('_');
  });

  it('counts only the pops the visitor made', () => {
    expect(FOOTER.pops(0)).toBe('Go on, pop one.');
    expect(FOOTER.pops(3)).toBe('3 popped. So relaxing.');
    expect(FOOTER.pops(12)).toBe('Okay. Back to the bath.');
  });

  it('follows the voice, fragrance and punctuation rules', () => {
    expect(copy).not.toMatch(/unscented|fragrance-free/i);
    expect(copy).not.toMatch(/artisanal|curated|elevate|exclusive/i);
    expect(copy).not.toContain('—');
  });
});

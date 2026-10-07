import {describe, it, expect} from 'vitest';
import {CONTACT_PAGE} from './contact';

/** Every visible string in the copy file, flattened (functions sampled). */
function allCopy(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (typeof value === 'function') return [String(value('Sam'))];
  if (Array.isArray(value)) return value.flatMap(allCopy);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allCopy);
  return [];
}

const copy = allCopy(CONTACT_PAGE).join(' ');

describe('CONTACT_PAGE content', () => {
  it('keeps the reply-time promise the owner confirmed (2026-10-07)', () => {
    expect(CONTACT_PAGE.hero.body).toMatch(/24-48 hours/);
    expect(CONTACT_PAGE.meta.description).toMatch(/24-48 hours/);
    expect(CONTACT_PAGE.taken.body).toMatch(/24-48 hours/);
  });

  it('still announces the page as Contact', () => {
    expect(CONTACT_PAGE.meta.title).toMatch(/contact/i);
    expect(CONTACT_PAGE.hero.srLead).toMatch(/contact/i);
  });

  it('sends the same subject values to the inbox as before the redesign', () => {
    expect(CONTACT_PAGE.slip.subject.options.map((o) => o.value)).toEqual([
      'General Inquiry',
      'Order Support',
      'Wholesale',
      'Press/Media',
      'Other',
    ]);
  });

  it('follows the voice, fragrance and punctuation rules', () => {
    expect(copy).not.toMatch(/unscented|fragrance-free/i);
    expect(copy).not.toMatch(/artisanal|curated|elevate|our lovely team/i);
    expect(copy).not.toContain('—');
  });
});

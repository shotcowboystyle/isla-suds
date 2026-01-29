import {describe, expect, it} from 'vitest';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_NARRATIVE,
  PRODUCT_DESCRIPTIONS,
  getProductDescription,
  getScentNarrative,
  SCENT_NARRATIVES,
} from './products';

describe('getScentNarrative', () => {
  it('returns metafield value when provided', () => {
    const metafieldValue = 'Custom scent narrative from CMS';
    const result = getScentNarrative('any-handle', metafieldValue);

    expect(result).toBe(metafieldValue);
  });

  it('returns fallback narrative for known product handle when metafield is null', () => {
    // Assuming 'lavender-dreams' will be in SCENT_NARRATIVES
    const handle = 'lavender-dreams';
    const result = getScentNarrative(handle, null);

    expect(result).toBe(SCENT_NARRATIVES[handle]);
  });

  it('returns fallback narrative for known product handle when metafield is undefined', () => {
    const handle = 'citrus-sunrise';
    const result = getScentNarrative(handle);

    expect(result).toBe(SCENT_NARRATIVES[handle]);
  });

  it('returns default narrative for unknown product handle with no metafield', () => {
    const unknownHandle = 'unknown-product-xyz';
    const result = getScentNarrative(unknownHandle);

    expect(result).toBe(DEFAULT_NARRATIVE);
  });

  it('prefers metafield value over fallback even for known handles', () => {
    const metafieldValue = 'CMS override narrative';
    const knownHandle = 'lavender-dreams';
    const result = getScentNarrative(knownHandle, metafieldValue);

    expect(result).toBe(metafieldValue);
  });

  it('returns default narrative for unknown handle with null metafield', () => {
    const unknownHandle = 'non-existent-product';
    const result = getScentNarrative(unknownHandle, null);

    expect(result).toBe(DEFAULT_NARRATIVE);
  });
});

describe('SCENT_NARRATIVES', () => {
  it('contains evocative scent narratives for product handles', () => {
    expect(SCENT_NARRATIVES).toBeDefined();
    expect(typeof SCENT_NARRATIVES).toBe('object');

    // Verify at least some expected handles exist with evocative copy
    expect(SCENT_NARRATIVES['lavender-dreams']).toBeDefined();
    expect(typeof SCENT_NARRATIVES['lavender-dreams']).toBe('string');
    expect(SCENT_NARRATIVES['lavender-dreams'].length).toBeGreaterThan(10);
  });

  it('has narratives that are sensory and evocative', () => {
    // Check that narratives are not empty and have substance
    const narratives = Object.values(SCENT_NARRATIVES);
    narratives.forEach((narrative) => {
      expect(narrative.length).toBeGreaterThan(20); // Evocative copy should be substantial
      expect(typeof narrative).toBe('string');
    });
  });
});

describe('DEFAULT_NARRATIVE', () => {
  it('is defined and is a non-empty string', () => {
    expect(DEFAULT_NARRATIVE).toBeDefined();
    expect(typeof DEFAULT_NARRATIVE).toBe('string');
    expect(DEFAULT_NARRATIVE.length).toBeGreaterThan(0);
  });

  it('matches expected fallback text', () => {
    expect(DEFAULT_NARRATIVE).toBe('Discover the essence of craftsmanship.');
  });
});

describe('getProductDescription', () => {
  it('returns API description when provided and non-empty', () => {
    const apiDescription = 'API-provided product description.';
    const result = getProductDescription('any-handle', apiDescription);

    expect(result).toBe(apiDescription);
  });

  it('trims API description and still prefers it when not empty after trim', () => {
    const apiDescription = '  Trimmed API description.  ';
    const result = getProductDescription('any-handle', apiDescription);

    expect(result).toBe(apiDescription.trim());
  });

  it('falls back to PRODUCT_DESCRIPTIONS map when API description is empty', () => {
    const handle = 'lavender-dreams';
    const result = getProductDescription(handle, '');

    expect(result).toBe(PRODUCT_DESCRIPTIONS[handle]);
  });

  it('falls back to PRODUCT_DESCRIPTIONS map when API description is undefined', () => {
    const handle = 'citrus-sunrise';
    const result = getProductDescription(handle);

    expect(result).toBe(PRODUCT_DESCRIPTIONS[handle]);
  });

  it('returns DEFAULT_DESCRIPTION for unknown handle with no API description', () => {
    const handle = 'unknown-product-handle';
    const result = getProductDescription(handle);

    expect(result).toBe(DEFAULT_DESCRIPTION);
  });
});

describe('DEFAULT_DESCRIPTION', () => {
  it('is defined and is a non-empty string', () => {
    expect(DEFAULT_DESCRIPTION).toBeDefined();
    expect(typeof DEFAULT_DESCRIPTION).toBe('string');
    expect(DEFAULT_DESCRIPTION.length).toBeGreaterThan(0);
  });
});

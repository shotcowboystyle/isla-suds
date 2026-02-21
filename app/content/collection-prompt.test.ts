import {describe, expect, it} from 'vitest';
import {
  COLLECTION_PROMPT_COPY,
  VARIETY_PACK_PRODUCTS,
  type CollectionPromptContent,
} from './collection-prompt';

describe('collection-prompt content', () => {
  describe('CollectionPromptContent interface', () => {
    it('exports CollectionPromptContent type', () => {
      // Type-only test - ensures interface is exported correctly
      const content: CollectionPromptContent = {
        headline: 'Test Headline',
        description: 'Test Description',
        buttonText: 'Test Button',
        dismissLabel: 'Test Dismiss',
      };
      expect(content).toBeDefined();
    });
  });

  describe('COLLECTION_PROMPT_COPY', () => {
    it('exports COLLECTION_PROMPT_COPY as named export', () => {
      expect(COLLECTION_PROMPT_COPY).toBeDefined();
    });

    it('has required headline property', () => {
      expect(COLLECTION_PROMPT_COPY.headline).toBeDefined();
      expect(typeof COLLECTION_PROMPT_COPY.headline).toBe('string');
      expect(COLLECTION_PROMPT_COPY.headline.length).toBeGreaterThan(0);
    });

    it('has required description property', () => {
      expect(COLLECTION_PROMPT_COPY.description).toBeDefined();
      expect(typeof COLLECTION_PROMPT_COPY.description).toBe('string');
      expect(COLLECTION_PROMPT_COPY.description.length).toBeGreaterThan(0);
    });

    it('has required buttonText property', () => {
      expect(COLLECTION_PROMPT_COPY.buttonText).toBeDefined();
      expect(typeof COLLECTION_PROMPT_COPY.buttonText).toBe('string');
      expect(COLLECTION_PROMPT_COPY.buttonText.length).toBeGreaterThan(0);
    });

    it('has required dismissLabel property', () => {
      expect(COLLECTION_PROMPT_COPY.dismissLabel).toBeDefined();
      expect(typeof COLLECTION_PROMPT_COPY.dismissLabel).toBe('string');
      expect(COLLECTION_PROMPT_COPY.dismissLabel.length).toBeGreaterThan(0);
    });

    it('uses warm, non-pushy tone in headline', () => {
      const warmWords = ['loving', 'love', 'enjoy', 'collection'];
      const headline = COLLECTION_PROMPT_COPY.headline.toLowerCase();
      const hasWarmTone = warmWords.some((word) => headline.includes(word));
      expect(hasWarmTone).toBe(true);
    });
  });

  describe('VARIETY_PACK_PRODUCTS', () => {
    it('exports VARIETY_PACK_PRODUCTS as named export', () => {
      expect(VARIETY_PACK_PRODUCTS).toBeDefined();
    });

    it('contains exactly 4 products', () => {
      expect(VARIETY_PACK_PRODUCTS).toHaveLength(4);
    });

    it('each product has handle and name properties', () => {
      VARIETY_PACK_PRODUCTS.forEach((product) => {
        expect(product.handle).toBeDefined();
        expect(typeof product.handle).toBe('string');
        expect(product.handle.length).toBeGreaterThan(0);

        expect(product.name).toBeDefined();
        expect(typeof product.name).toBe('string');
        expect(product.name.length).toBeGreaterThan(0);
      });
    });

    it('each product has an image property', () => {
      VARIETY_PACK_PRODUCTS.forEach((product) => {
        expect(product.image).toBeDefined();
      });
    });

    it('contains expected soap varieties', () => {
      const handles = VARIETY_PACK_PRODUCTS.map((p) => p.handle);
      expect(handles).toContain('lavender');
      expect(handles).toContain('lemongrass');
      expect(handles).toContain('eucalyptus');
      expect(handles).toContain('rosemary-sea-salt');
    });
  });
});

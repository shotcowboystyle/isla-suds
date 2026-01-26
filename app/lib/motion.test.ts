import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {prefersReducedMotion, fadeInVariants, scaleInVariants, slideUpVariants} from './motion';

describe('prefersReducedMotion', () => {
  const originalWindow = globalThis.window;
  const originalMatchMedia = globalThis.window.matchMedia;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.window = originalWindow;
    window.matchMedia = originalMatchMedia;
  });

  it('should return false during SSR (no window object)', () => {
    // @ts-expect-error - Simulating SSR environment
    global.window = undefined;

    const result = prefersReducedMotion();

    expect(result).toBe(false);
  });

  it('should return false when prefers-reduced-motion is not set', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return {matches: false} as MediaQueryList;
      }
      return {matches: false} as MediaQueryList;
    });

    const result = prefersReducedMotion();

    expect(result).toBe(false);
  });

  it('should return true when prefers-reduced-motion is set', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return {matches: true} as MediaQueryList;
      }
      return {matches: false} as MediaQueryList;
    });

    const result = prefersReducedMotion();

    expect(result).toBe(true);
  });

  it('should handle matchMedia errors gracefully', () => {
    window.matchMedia = vi.fn().mockImplementation(() => {
      throw new Error('matchMedia not supported');
    });

    // Should not throw
    const result = prefersReducedMotion();

    // Should return safe fallback
    expect(result).toBe(false);
  });
});

describe('Animation Variants', () => {
  describe('fadeInVariants', () => {
    it('should have correct structure', () => {
      expect(fadeInVariants).toHaveProperty('hidden');
      expect(fadeInVariants).toHaveProperty('visible');
      expect(fadeInVariants.hidden).toEqual({opacity: 0});
      expect(fadeInVariants.visible).toEqual({opacity: 1});
    });
  });

  describe('scaleInVariants', () => {
    it('should have correct structure', () => {
      expect(scaleInVariants).toHaveProperty('hidden');
      expect(scaleInVariants).toHaveProperty('visible');
      expect(scaleInVariants.hidden).toEqual({opacity: 0, scale: 0.95});
      expect(scaleInVariants.visible).toEqual({opacity: 1, scale: 1});
    });
  });

  describe('slideUpVariants', () => {
    it('should have correct structure', () => {
      expect(slideUpVariants).toHaveProperty('hidden');
      expect(slideUpVariants).toHaveProperty('visible');
      expect(slideUpVariants.hidden).toEqual({opacity: 0, y: 20});
      expect(slideUpVariants.visible).toEqual({opacity: 1, y: 0});
    });
  });
});

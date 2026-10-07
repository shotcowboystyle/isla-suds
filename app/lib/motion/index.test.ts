import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {prefersReducedMotion} from './index';
import {PIN_PRIORITY} from './tokens';

describe('PIN_PRIORITY', () => {
  it('descends by page position', () => {
    const order = [PIN_PRIORITY.productsList, PIN_PRIORITY.videoSection, PIN_PRIORITY.testimonials];
    expect(order).toEqual([...order].sort((a, b) => b - a));
    expect(new Set(order).size).toBe(order.length);
  });
});

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

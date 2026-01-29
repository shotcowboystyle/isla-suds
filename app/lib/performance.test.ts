import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {measureTextureReveal, getTextureRevealTiming} from './performance';

describe('performance utilities', () => {
  beforeEach(() => {
    // Clear performance marks and measures before each test
    performance.clearMarks();
    performance.clearMeasures();
  });

  afterEach(() => {
    // Clean up after tests
    performance.clearMarks();
    performance.clearMeasures();
  });

  describe('measureTextureReveal', () => {
    it('creates performance marks for start and end', async () => {
      const callback = vi.fn().mockResolvedValue(undefined);

      await measureTextureReveal(callback);

      // Check that marks were created
      const marks = performance.getEntriesByType('mark');
      const startMark = marks.find((m) => m.name === 'texture-reveal-start');
      const endMark = marks.find((m) => m.name === 'texture-reveal-end');

      expect(startMark).toBeDefined();
      expect(endMark).toBeDefined();
      expect(callback).toHaveBeenCalled();
    });

    it('creates a performance measure for texture reveal duration', async () => {
      const callback = vi.fn().mockResolvedValue(undefined);

      await measureTextureReveal(callback);

      // Check that measure was created
      const measures = performance.getEntriesByType('measure');
      const revealMeasure = measures.find(
        (m) => m.name === 'texture-reveal',
      );

      expect(revealMeasure).toBeDefined();
      expect(revealMeasure?.duration).toBeGreaterThanOrEqual(0);
    });

    it('executes the callback between start and end marks', async () => {
      let callbackExecuted = false;
      const callback = vi.fn(async () => {
        callbackExecuted = true;
        // Check that start mark exists when callback runs
        const startMark = performance.getEntriesByName('texture-reveal-start');
        expect(startMark.length).toBeGreaterThan(0);
      });

      await measureTextureReveal(callback);

      expect(callbackExecuted).toBe(true);
      expect(callback).toHaveBeenCalled();
    });

    it('handles callback errors gracefully', async () => {
      const error = new Error('Test error');
      const callback = vi.fn().mockRejectedValue(error);

      // Should not throw, should handle error
      await expect(measureTextureReveal(callback)).rejects.toThrow('Test error');

      // Marks should still be created even if callback fails
      const marks = performance.getEntriesByType('mark');
      const startMark = marks.find((m) => m.name === 'texture-reveal-start');
      expect(startMark).toBeDefined();
    });
  });

  describe('getTextureRevealTiming', () => {
    it('returns the most recent texture reveal timing', async () => {
      const callback = vi.fn().mockResolvedValue(undefined);

      await measureTextureReveal(callback);

      const timing = getTextureRevealTiming();

      expect(timing).toBeDefined();
      expect(timing).toBeGreaterThanOrEqual(0);
      expect(typeof timing).toBe('number');
    });

    it('returns null when no texture reveal has been measured', () => {
      const timing = getTextureRevealTiming();

      expect(timing).toBeNull();
    });

    it('returns the duration in milliseconds', async () => {
      const callback = vi.fn().mockResolvedValue(undefined);

      // Add small delay to ensure measurable duration
      await measureTextureReveal(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      const timing = getTextureRevealTiming();

      expect(timing).toBeGreaterThan(0);
      expect(timing).toBeLessThan(1000); // Should be under 1 second
    });
  });
});

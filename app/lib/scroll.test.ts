import GSAP from 'gsap';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {initLenis, destroyLenis, getLenis} from './scroll';

// Mock Lenis with proper constructor
vi.mock('lenis', () => {
  const MockLenis = vi.fn(function (this: any) {
    this.raf = vi.fn();
    this.destroy = vi.fn();
    this.on = vi.fn();
  });
  return {
    default: MockLenis,
  };
});

/** matchMedia stub: desktop + motion allowed unless overridden. */
function stubMatchMedia({desktop = true, reduceMotion = false} = {}) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    if (query === '(min-width: 1024px)') {
      return {matches: desktop} as MediaQueryList;
    }
    if (query === '(prefers-reduced-motion: reduce)') {
      return {matches: reduceMotion} as MediaQueryList;
    }
    return {matches: false} as MediaQueryList;
  });
}

describe('initLenis', () => {
  const originalWindow = globalThis.window;
  const originalMatchMedia = globalThis.window.matchMedia;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
    destroyLenis();
    globalThis.window = originalWindow;
    window.matchMedia = originalMatchMedia;
  });

  it('should return null during SSR (no window object)', async () => {
    // @ts-expect-error - Simulating SSR environment
    global.window = undefined;

    const result = await initLenis();

    expect(result).toBeNull();
  });

  it('should return null on mobile viewport (<1024px)', async () => {
    stubMatchMedia({desktop: false});

    const result = await initLenis();

    expect(result).toBeNull();
  });

  it('should return null when prefers-reduced-motion is set', async () => {
    stubMatchMedia({reduceMotion: true});

    const result = await initLenis();

    expect(result).toBeNull();
  });

  it('should initialize Lenis on desktop viewport (≥1024px)', async () => {
    stubMatchMedia();

    const result = await initLenis();

    expect(result).not.toBeNull();
    expect(getLenis()).toBe(result);
  });

  it('should drive Lenis from the GSAP ticker, not a private RAF loop', async () => {
    stubMatchMedia();

    const tickerSpy = vi.spyOn(GSAP.ticker, 'add');
    const lagSmoothingSpy = vi.spyOn(GSAP.ticker, 'lagSmoothing');
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');

    const instance = await initLenis();

    expect(tickerSpy).toHaveBeenCalledTimes(1);
    // Lag smoothing must be off so Lenis and ScrollTrigger never diverge.
    expect(lagSmoothingSpy).toHaveBeenCalledWith(0);
    expect(rafSpy).not.toHaveBeenCalled();

    // gsap.ticker passes seconds; Lenis expects milliseconds.
    const tick = tickerSpy.mock.calls[0][0] as (time: number) => void;
    tick(2);
    expect(instance?.raf).toHaveBeenCalledWith(2000);

    tickerSpy.mockRestore();
    lagSmoothingSpy.mockRestore();
    rafSpy.mockRestore();
  });

  it('should forward smoothed scroll position to ScrollTrigger', async () => {
    stubMatchMedia();

    const instance = await initLenis();

    expect(instance?.on).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should not re-initialize if Lenis instance already exists', async () => {
    stubMatchMedia();

    const tickerSpy = vi.spyOn(GSAP.ticker, 'add');

    const firstCall = await initLenis();
    const secondCall = await initLenis();

    // Should return same instance
    expect(firstCall).toBe(secondCall);
    // Ticker callback should only be registered once (first call only)
    expect(tickerSpy).toHaveBeenCalledTimes(1);

    tickerSpy.mockRestore();
  });

  it('should handle initialization errors gracefully', async () => {
    stubMatchMedia();

    // Mock Lenis to throw an error
    const Lenis = await import('lenis');
    vi.mocked(Lenis.default).mockImplementationOnce(function () {
      throw new Error('Lenis initialization failed');
    } as unknown as typeof Lenis.default);

    const result = await initLenis();

    // Source silently returns null on error (progressive enhancement fallback)
    expect(result).toBeNull();
  });
});

describe('destroyLenis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be safe to call when Lenis is not initialized', () => {
    // Should not throw
    expect(() => destroyLenis()).not.toThrow();
  });

  it('should detach the ticker callback and destroy the instance', async () => {
    stubMatchMedia();

    const tickerRemoveSpy = vi.spyOn(GSAP.ticker, 'remove');
    const lagSmoothingSpy = vi.spyOn(GSAP.ticker, 'lagSmoothing');

    const instance = await initLenis();
    destroyLenis();

    expect(tickerRemoveSpy).toHaveBeenCalled();
    expect(instance?.destroy).toHaveBeenCalled();
    // GSAP's lag-smoothing defaults are restored once Lenis is gone.
    expect(lagSmoothingSpy).toHaveBeenLastCalledWith(500, 33);
    expect(getLenis()).toBeNull();

    tickerRemoveSpy.mockRestore();
    lagSmoothingSpy.mockRestore();
  });

  it('should handle destroy errors gracefully', async () => {
    stubMatchMedia();

    const instance = await initLenis();

    // Mock destroy to throw an error
    if (instance) {
      vi.spyOn(instance, 'destroy').mockImplementationOnce(() => {
        throw new Error('Destroy failed');
      });
    }

    // Should not throw
    expect(() => destroyLenis()).not.toThrow();
    expect(getLenis()).toBeNull();
  });

  it('should be safe to call multiple times', () => {
    expect(() => {
      destroyLenis();
      destroyLenis();
      destroyLenis();
    }).not.toThrow();
  });
});

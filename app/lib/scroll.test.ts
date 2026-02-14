import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {initLenis, destroyLenis} from './scroll';

// Mock Lenis with proper constructor
vi.mock('lenis', () => {
  const MockLenis = vi.fn(function (this: any) {
    this.raf = vi.fn();
    this.destroy = vi.fn();
  });
  return {
    default: MockLenis,
  };
});

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
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (query === '(min-width: 1024px)') {
        return {matches: false} as MediaQueryList;
      }
      if (query === '(prefers-reduced-motion: reduce)') {
        return {matches: false} as MediaQueryList;
      }
      return {matches: false} as MediaQueryList;
    });

    const result = await initLenis();

    expect(result).toBeNull();
  });

  it('should return null when prefers-reduced-motion is set', async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (query === '(min-width: 1024px)') {
        return {matches: true} as MediaQueryList;
      }
      if (query === '(prefers-reduced-motion: reduce)') {
        return {matches: true} as MediaQueryList;
      }
      return {matches: false} as MediaQueryList;
    });

    const result = await initLenis();

    expect(result).toBeNull();
  });

  it('should initialize Lenis on desktop viewport (≥1024px)', async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (query === '(min-width: 1024px)') {
        return {matches: true} as MediaQueryList;
      }
      if (query === '(prefers-reduced-motion: reduce)') {
        return {matches: false} as MediaQueryList;
      }
      return {matches: false} as MediaQueryList;
    });

    // Mock requestAnimationFrame - don't call callback to avoid infinite recursion
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => {
        return 1;
      });

    const result = await initLenis();

    expect(result).not.toBeNull();
    expect(rafSpy).toHaveBeenCalled();
  });

  it('should not re-initialize if Lenis instance already exists', async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (query === '(min-width: 1024px)') {
        return {matches: true} as MediaQueryList;
      }
      if (query === '(prefers-reduced-motion: reduce)') {
        return {matches: false} as MediaQueryList;
      }
      return {matches: false} as MediaQueryList;
    });

    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => {
        return 1;
      });

    const firstCall = await initLenis();
    const secondCall = await initLenis();

    // Should return same instance
    expect(firstCall).toBe(secondCall);
    // RAF should only be set up once (first call only)
    expect(rafSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle initialization errors gracefully', async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (query === '(min-width: 1024px)') {
        return {matches: true} as MediaQueryList;
      }
      if (query === '(prefers-reduced-motion: reduce)') {
        return {matches: false} as MediaQueryList;
      }
      return {matches: false} as MediaQueryList;
    });

    // Mock Lenis to throw an error
    const Lenis = await import('lenis');
    vi.mocked(Lenis.default).mockImplementationOnce(() => {
      throw new Error('Lenis initialization failed');
    });

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const result = await initLenis();

    expect(result).toBeNull();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to initialize Lenis smooth scroll'),
      expect.any(Error),
    );

    consoleWarnSpy.mockRestore();
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

  it('should cancel requestAnimationFrame and destroy instance', async () => {
    // Setup: Initialize Lenis first
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (query === '(min-width: 1024px)') {
        return {matches: true} as MediaQueryList;
      }
      if (query === '(prefers-reduced-motion: reduce)') {
        return {matches: false} as MediaQueryList;
      }
      return {matches: false} as MediaQueryList;
    });

    const cancelRafSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {});

    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => {
        return 123; // Mock RAF ID
      });

    await initLenis();
    destroyLenis();

    expect(cancelRafSpy).toHaveBeenCalled();
    cancelRafSpy.mockRestore();
    rafSpy.mockRestore();
  });

  it('should handle destroy errors gracefully', async () => {
    // Setup: Initialize Lenis first
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (query === '(min-width: 1024px)') {
        return {matches: true} as MediaQueryList;
      }
      if (query === '(prefers-reduced-motion: reduce)') {
        return {matches: false} as MediaQueryList;
      }
      return {matches: false} as MediaQueryList;
    });

    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => {
        return 1;
      });

    const instance = await initLenis();

    // Mock destroy to throw an error
    if (instance) {
      vi.spyOn(instance, 'destroy').mockImplementationOnce(() => {
        throw new Error('Destroy failed');
      });
    }

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    // Should not throw
    expect(() => destroyLenis()).not.toThrow();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to destroy Lenis instance'),
      expect.any(Error),
    );

    consoleWarnSpy.mockRestore();
    rafSpy.mockRestore();
  });

  it('should be safe to call multiple times', () => {
    expect(() => {
      destroyLenis();
      destroyLenis();
      destroyLenis();
    }).not.toThrow();
  });
});

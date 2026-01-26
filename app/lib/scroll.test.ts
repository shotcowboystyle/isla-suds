import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {initLenis, destroyLenis} from './scroll';

// Mock Lenis
vi.mock('@studio-freight/lenis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      raf: vi.fn(),
      destroy: vi.fn(),
    })),
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

  it('should return null during SSR (no window object)', () => {
    // @ts-expect-error - Simulating SSR environment
    global.window = undefined;

    const result = initLenis();

    expect(result).toBeNull();
  });

  it('should return null on mobile viewport (<1024px)', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (query === '(min-width: 1024px)') {
        return {matches: false} as MediaQueryList;
      }
      if (query === '(prefers-reduced-motion: reduce)') {
        return {matches: false} as MediaQueryList;
      }
      return {matches: false} as MediaQueryList;
    });

    const result = initLenis();

    expect(result).toBeNull();
  });

  it('should return null when prefers-reduced-motion is set', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (query === '(min-width: 1024px)') {
        return {matches: true} as MediaQueryList;
      }
      if (query === '(prefers-reduced-motion: reduce)') {
        return {matches: true} as MediaQueryList;
      }
      return {matches: false} as MediaQueryList;
    });

    const result = initLenis();

    expect(result).toBeNull();
  });

  it('should initialize Lenis on desktop viewport (≥1024px)', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (query === '(min-width: 1024px)') {
        return {matches: true} as MediaQueryList;
      }
      if (query === '(prefers-reduced-motion: reduce)') {
        return {matches: false} as MediaQueryList;
      }
      return {matches: false} as MediaQueryList;
    });

    // Mock requestAnimationFrame
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 1;
      });

    const result = initLenis();

    expect(result).not.toBeNull();
    expect(rafSpy).toHaveBeenCalled();
  });

  it('should not re-initialize if Lenis instance already exists', () => {
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
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 1;
      });

    const firstCall = initLenis();
    const secondCall = initLenis();

    // Should return same instance
    expect(firstCall).toBe(secondCall);
    // RAF should only be set up once
    expect(rafSpy).toHaveBeenCalledTimes(2); // Once per initLenis call, but instance reused
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
    const Lenis = await import('@studio-freight/lenis');
    vi.mocked(Lenis.default).mockImplementationOnce(() => {
      throw new Error('Lenis initialization failed');
    });

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const result = initLenis();

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

  it('should cancel requestAnimationFrame and destroy instance', () => {
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
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 123; // Mock RAF ID
      });

    initLenis();
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
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 1;
      });

    initLenis();

    // Mock destroy to throw an error
    const Lenis = await import('@studio-freight/lenis');
    const mockInstance = vi.mocked(Lenis.default).mock.results[0]?.value;
    if (mockInstance) {
      vi.mocked(mockInstance.destroy).mockImplementationOnce(() => {
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

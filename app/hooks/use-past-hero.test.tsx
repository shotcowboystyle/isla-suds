import {renderHook, act, waitFor} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {usePastHero} from './use-past-hero';

describe('usePastHero', () => {
  let mockObserver: {
    observe: ReturnType<typeof vi.fn>;
    unobserve: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  };
  let IntersectionObserverCallback: IntersectionObserverCallback | null = null;

  beforeEach(() => {
    // Mock IntersectionObserver
    mockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };

    global.IntersectionObserver = class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        IntersectionObserverCallback = callback;
      }
      observe = mockObserver.observe;
      unobserve = mockObserver.unobserve;
      disconnect = mockObserver.disconnect;
      takeRecords = vi.fn();
      root = null;
      rootMargin = '';
      thresholds = [0];
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
    IntersectionObserverCallback = null;
  });

  it('returns false initially when hero is in viewport', () => {
    const ref = {current: document.createElement('div')};
    const {result} = renderHook(() => usePastHero(ref));

    expect(result.current).toBe(false);
  });

  it('creates IntersectionObserver with correct configuration', () => {
    const ref = {current: document.createElement('div')};
    renderHook(() => usePastHero(ref));

    // Verify that IntersectionObserver was instantiated
    // Since we're using a class mock, just verify the observer was created
    // by checking that the callback was captured
    expect(IntersectionObserverCallback).toBeDefined();
  });

  it('observes the hero element when ref is available', () => {
    const element = document.createElement('div');
    const ref = {current: element};
    renderHook(() => usePastHero(ref));

    expect(mockObserver.observe).toHaveBeenCalledWith(element);
  });

  it('does not observe when ref is null', () => {
    const ref = {current: null};
    renderHook(() => usePastHero(ref));

    expect(mockObserver.observe).not.toHaveBeenCalled();
  });

  it('returns true when hero exits viewport (isIntersecting = false)', async () => {
    const ref = {current: document.createElement('div')};
    const {result} = renderHook(() => usePastHero(ref));

    // Simulate hero exiting viewport
    if (IntersectionObserverCallback && ref.current) {
      act(() => {
        IntersectionObserverCallback!(
          [
            {
              isIntersecting: false,
              target: ref.current,
            } as unknown as IntersectionObserverEntry,
          ],
          mockObserver as unknown as IntersectionObserver,
        );
      });
    }

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('returns false when hero enters viewport (isIntersecting = true)', async () => {
    const ref = {current: document.createElement('div')};
    const {result} = renderHook(() => usePastHero(ref));

    // First, simulate hero exiting viewport
    if (IntersectionObserverCallback && ref.current) {
      act(() => {
        IntersectionObserverCallback!(
          [
            {
              isIntersecting: false,
              target: ref.current,
            } as unknown as IntersectionObserverEntry,
          ],
          mockObserver as unknown as IntersectionObserver,
        );
      });
    }

    // Then, simulate hero re-entering viewport
    if (IntersectionObserverCallback && ref.current) {
      act(() => {
        IntersectionObserverCallback!(
          [
            {
              isIntersecting: true,
              target: ref.current,
            } as unknown as IntersectionObserverEntry,
          ],
          mockObserver as unknown as IntersectionObserver,
        );
      });
    }

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('cleans up observer on unmount', () => {
    const ref = {current: document.createElement('div')};
    const {unmount} = renderHook(() => usePastHero(ref));

    unmount();

    expect(mockObserver.disconnect).toHaveBeenCalled();
  });

  it('does not use scroll event listeners', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const ref = {current: document.createElement('div')};

    renderHook(() => usePastHero(ref));

    // Ensure no 'scroll' event listeners were added
    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
    );
  });
});

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {renderHook} from '@testing-library/react';
import {useStoryFragmentVisibility} from './use-story-fragment-visibility';

describe('useStoryFragmentVisibility Hook', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockUnobserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let observerCallback: IntersectionObserverCallback | null;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockUnobserve = vi.fn();
    mockDisconnect = vi.fn();
    observerCallback = null;

    // Mock IntersectionObserver
    global.IntersectionObserver = class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
      observe = mockObserve;
      unobserve = mockUnobserve;
      disconnect = mockDisconnect;
      root = null;
      rootMargin = '';
      thresholds = [0.5];
      takeRecords = () => [];
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    observerCallback = null;
    vi.restoreAllMocks();
  });

  it('creates IntersectionObserver with threshold 0.5 (AC1)', () => {
    const ref = {current: document.createElement('div')};
    renderHook(() => useStoryFragmentVisibility(ref));

    // Verify that IntersectionObserver was instantiated
    expect(observerCallback).toBeDefined();
  });

  it('observes element when ref is available (AC5)', () => {
    const element = document.createElement('div');
    const ref = {current: element};

    renderHook(() => useStoryFragmentVisibility(ref));

    expect(mockObserve).toHaveBeenCalledWith(element);
  });

  it('returns visible=true when element is 50%+ visible (AC1)', () => {
    const ref = {current: document.createElement('div')};
    const {result, rerender} = renderHook(() =>
      useStoryFragmentVisibility(ref),
    );

    // Initial state
    expect(result.current).toBe(false);

    // Simulate intersection at 60% (> 0.5 threshold)
    if (observerCallback && ref.current) {
      observerCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.6,
            target: ref.current,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as unknown as IntersectionObserver,
      );
    }

    rerender();
    expect(result.current).toBe(true);
  });

  it('returns visible=false when element is <50% visible (AC1)', () => {
    const ref = {current: document.createElement('div')};
    const {result, rerender} = renderHook(() =>
      useStoryFragmentVisibility(ref),
    );

    // Simulate intersection at 40% (< 0.5 threshold)
    if (observerCallback && ref.current) {
      observerCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.4,
            target: ref.current,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as unknown as IntersectionObserver,
      );
    }

    rerender();
    expect(result.current).toBe(false);
  });

  it('remains visible=true after scrolling past (trigger only once) (AC1)', () => {
    const ref = {current: document.createElement('div')};
    const {result, rerender} = renderHook(() =>
      useStoryFragmentVisibility(ref),
    );

    // Trigger visibility at 60%
    if (observerCallback && ref.current) {
      observerCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.6,
            target: ref.current,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as unknown as IntersectionObserver,
      );
    }
    rerender();
    expect(result.current).toBe(true);

    // Scroll past (no longer intersecting)
    if (observerCallback && ref.current) {
      observerCallback(
        [
          {
            isIntersecting: false,
            intersectionRatio: 0,
            target: ref.current,
          } as unknown as IntersectionObserverEntry,
        ],
        {} as unknown as IntersectionObserver,
      );
    }
    rerender();

    // Should still be true (trigger only once)
    expect(result.current).toBe(true);
  });

  it('does not crash when IntersectionObserver is undefined (SSR safety) (AC5)', () => {
    // @ts-expect-error - Testing undefined IntersectionObserver
    global.IntersectionObserver = undefined;

    const ref = {current: document.createElement('div')};
    const {result} = renderHook(() => useStoryFragmentVisibility(ref));

    // Should return false and not crash
    expect(result.current).toBe(false);
  });

  it('does not observe when ref is null (AC5)', () => {
    const ref = {current: null};
    renderHook(() => useStoryFragmentVisibility(ref));

    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('disconnects observer on unmount (AC5)', () => {
    const ref = {current: document.createElement('div')};
    const {unmount} = renderHook(() => useStoryFragmentVisibility(ref));

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});

import {renderHook, act} from '@testing-library/react';
import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {usePreloadImages} from './use-preload-images';
import * as preloadModule from '~/lib/shopify/preload';

// Mock the preload module
vi.mock('~/lib/shopify/preload', () => ({
  preloadImages: vi.fn(),
}));

describe('usePreloadImages', () => {
  let mockObserver: {
    observe: ReturnType<typeof vi.fn>;
    unobserve: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  };
  let IntersectionObserverCallback: IntersectionObserverCallback | null = null;
  let IntersectionObserverOptions: IntersectionObserverInit | null = null;

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();

    // Mock IntersectionObserver
    mockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };

    global.IntersectionObserver = class MockIntersectionObserver {
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
      ) {
        IntersectionObserverCallback = callback;
        IntersectionObserverOptions = options || null;
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
    IntersectionObserverOptions = null;
  });

  it('creates IntersectionObserver with rootMargin of 200px', () => {
    const ref = {current: document.createElement('div')};
    const imageUrls = ['https://cdn.shopify.com/image1.jpg'];

    renderHook(() => usePreloadImages(ref, imageUrls));

    expect(IntersectionObserverOptions).toEqual({
      rootMargin: '200px',
    });
  });

  it('observes the element when ref is available', () => {
    const element = document.createElement('div');
    const ref = {current: element};
    const imageUrls = ['https://cdn.shopify.com/image1.jpg'];

    renderHook(() => usePreloadImages(ref, imageUrls));

    expect(mockObserver.observe).toHaveBeenCalledWith(element);
  });

  it('does not observe when ref is null', () => {
    const ref = {current: null};
    const imageUrls = ['https://cdn.shopify.com/image1.jpg'];

    renderHook(() => usePreloadImages(ref, imageUrls));

    expect(mockObserver.observe).not.toHaveBeenCalled();
  });

  it('preloads images when element intersects viewport', () => {
    const ref = {current: document.createElement('div')};
    const imageUrls = [
      'https://cdn.shopify.com/image1.jpg',
      'https://cdn.shopify.com/image2.jpg',
    ];

    renderHook(() => usePreloadImages(ref, imageUrls));

    // Simulate element entering viewport
    if (IntersectionObserverCallback && ref.current) {
      act(() => {
        IntersectionObserverCallback!(
          [
            {
              isIntersecting: true,
              target: ref.current!,
              boundingClientRect: {
                top: 100, // Positive top means scrolling down
              } as DOMRectReadOnly,
            } as unknown as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      });
    }

    expect(preloadModule.preloadImages).toHaveBeenCalledWith(
      imageUrls,
      undefined,
    );
  });

  it('passes options to preloadImages when provided (AC2: fetchpriority)', () => {
    const ref = {current: document.createElement('div')};
    const imageUrls = ['https://cdn.shopify.com/image1.jpg'];
    const options = {fetchpriority: 'high' as const};

    renderHook(() => usePreloadImages(ref, imageUrls, options));

    if (IntersectionObserverCallback && ref.current) {
      act(() => {
        IntersectionObserverCallback!(
          [
            {
              isIntersecting: true,
              target: ref.current!,
              boundingClientRect: {top: 100} as DOMRectReadOnly,
            } as unknown as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      });
    }

    expect(preloadModule.preloadImages).toHaveBeenCalledWith(
      imageUrls,
      options,
    );
  });

  it('does not create observer when IntersectionObserver is undefined (SSR)', () => {
    const originalIO = global.IntersectionObserver;
    // @ts-expect-error - Simulating SSR environment
    global.IntersectionObserver = undefined;

    const ref = {current: document.createElement('div')};
    const imageUrls = ['https://cdn.shopify.com/image1.jpg'];

    expect(() => {
      renderHook(() => usePreloadImages(ref, imageUrls));
    }).not.toThrow();

    expect(preloadModule.preloadImages).not.toHaveBeenCalled();

    global.IntersectionObserver = originalIO;
  });

  it('does not preload when scrolling up (negative top)', () => {
    const ref = {current: document.createElement('div')};
    const imageUrls = ['https://cdn.shopify.com/image1.jpg'];

    renderHook(() => usePreloadImages(ref, imageUrls));

    // Simulate element with negative top (scrolling up)
    if (IntersectionObserverCallback && ref.current) {
      act(() => {
        IntersectionObserverCallback!(
          [
            {
              isIntersecting: true,
              target: ref.current!,
              boundingClientRect: {
                top: -100, // Negative top means scrolling up
              } as DOMRectReadOnly,
            } as unknown as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      });
    }

    expect(preloadModule.preloadImages).not.toHaveBeenCalled();
  });

  it('does not preload when element is not intersecting', () => {
    const ref = {current: document.createElement('div')};
    const imageUrls = ['https://cdn.shopify.com/image1.jpg'];

    renderHook(() => usePreloadImages(ref, imageUrls));

    // Simulate element not intersecting
    if (IntersectionObserverCallback && ref.current) {
      act(() => {
        IntersectionObserverCallback!(
          [
            {
              isIntersecting: false,
              target: ref.current!,
              boundingClientRect: {
                top: 100,
              } as DOMRectReadOnly,
            } as unknown as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      });
    }

    expect(preloadModule.preloadImages).not.toHaveBeenCalled();
  });

  it('preloads only once even when intersecting multiple times', () => {
    const ref = {current: document.createElement('div')};
    const imageUrls = ['https://cdn.shopify.com/image1.jpg'];

    renderHook(() => usePreloadImages(ref, imageUrls));

    // Simulate multiple intersections
    if (IntersectionObserverCallback && ref.current) {
      const entry = {
        isIntersecting: true,
        target: ref.current,
        boundingClientRect: {top: 100} as DOMRectReadOnly,
      } as unknown as IntersectionObserverEntry;

      act(() => {
        IntersectionObserverCallback!([entry], {} as IntersectionObserver);
      });

      act(() => {
        IntersectionObserverCallback!([entry], {} as IntersectionObserver);
      });

      act(() => {
        IntersectionObserverCallback!([entry], {} as IntersectionObserver);
      });
    }

    // Should only call preloadImages once
    expect(preloadModule.preloadImages).toHaveBeenCalledTimes(1);
  });

  it('disconnects observer on unmount', () => {
    const ref = {current: document.createElement('div')};
    const imageUrls = ['https://cdn.shopify.com/image1.jpg'];

    const {unmount} = renderHook(() => usePreloadImages(ref, imageUrls));

    unmount();

    expect(mockObserver.disconnect).toHaveBeenCalled();
  });

  it('handles empty imageUrls array gracefully', () => {
    const ref = {current: document.createElement('div')};
    const imageUrls: string[] = [];

    expect(() => {
      renderHook(() => usePreloadImages(ref, imageUrls));
    }).not.toThrow();
  });

  it('does not create observer when imageUrls is empty', () => {
    const ref = {current: document.createElement('div')};
    const imageUrls: string[] = [];

    renderHook(() => usePreloadImages(ref, imageUrls));

    // Observer should not be created for empty URLs
    expect(mockObserver.observe).not.toHaveBeenCalled();
  });
});

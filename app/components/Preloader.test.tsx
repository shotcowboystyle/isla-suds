import {act, render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {Preloader} from './Preloader';

vi.mock('~/lib/motion/refresh', () => ({holdScrollRefresh: () => () => {}}));
vi.mock('~/lib/scroll', () => ({getLenis: () => null}));

describe('Preloader timing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // The page is still loading: the overlay must not wait for `window.load`.
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('hands off to the page when the overlay starts fading, not after a load wait', () => {
    const onComplete = vi.fn();
    const {container} = render(<Preloader onComplete={onComplete} />);

    // Entrance (1450ms), then the exit up to the overlay fade (700ms). Separate
    // acts so React commits the popping state and starts the exit timers.
    act(() => vi.advanceTimersByTime(1450));
    act(() => vi.advanceTimersByTime(699));
    expect(onComplete).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(container.firstChild).not.toBeNull();

    // Unmounts once the exit (900ms) has finished.
    act(() => vi.advanceTimersByTime(200));
    expect(container.firstChild).toBeNull();
  });
});

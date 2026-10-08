import {afterEach, describe, expect, it, vi} from 'vitest';

const refresh = vi.fn();
vi.mock('gsap', () => ({default: {registerPlugin: vi.fn()}}));
vi.mock('gsap/ScrollTrigger', () => ({ScrollTrigger: {refresh: () => refresh()}}));

const {holdScrollRefresh, requestScrollRefresh} = await import('./refresh');

describe('holdScrollRefresh', () => {
  afterEach(() => {
    vi.useRealTimers();
    refresh.mockClear();
  });

  it('drops refreshes while held and runs exactly one on release', () => {
    vi.useFakeTimers();
    const release = holdScrollRefresh();

    requestScrollRefresh();
    requestScrollRefresh();
    vi.advanceTimersToNextFrame();
    expect(refresh).not.toHaveBeenCalled();

    release();
    release(); // idempotent: a second release must not unbalance the hold count
    vi.advanceTimersToNextFrame();
    expect(refresh).toHaveBeenCalledTimes(1);

    requestScrollRefresh();
    vi.advanceTimersToNextFrame();
    expect(refresh).toHaveBeenCalledTimes(2);
  });
});

import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';

// Define mocks
const mocks = vi.hoisted(() => {
  return {
    prefersReducedMotion: vi.fn(() => false),
  };
});

vi.mock('~/lib/motion', () => {
  const MockMotionDiv = ({children, className, ...props}: any) => {
    return (
      <div data-testid="motion-div" className={className} {...props}>
        {children}
      </div>
    );
  };
  return {
    MotionDiv: MockMotionDiv,
    prefersReducedMotion: mocks.prefersReducedMotion,
  };
});

import {DevMotion} from './DevMotion';

describe('DevMotion', () => {
  const originalWindow = globalThis.window;
  const originalMatchMedia = globalThis.window.matchMedia;

  beforeEach(() => {
    vi.clearAllMocks();
    window.matchMedia = originalMatchMedia;
    mocks.prefersReducedMotion.mockReturnValue(false);
  });

  afterEach(() => {
    globalThis.window = originalWindow;
    window.matchMedia = originalMatchMedia;
  });

  it('should render motion components after hydration when motion is enabled', async () => {
    mocks.prefersReducedMotion.mockReturnValue(false);

    render(<DevMotion />);

    await waitFor(() => {
      expect(screen.getByText('Framer Motion Test')).toBeInTheDocument();
    });

    expect(
      screen.queryByText('Static Content (No Animation)'),
    ).not.toBeInTheDocument();
  });

  it('should render static fallback when prefers-reduced-motion is set', async () => {
    mocks.prefersReducedMotion.mockReturnValue(true);

    render(<DevMotion />);

    await waitFor(() => {
      expect(screen.getByText('Framer Motion Test')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Static Content (No Animation)'),
    ).toBeInTheDocument();
  });

  it('should show warning when reduced motion is detected', async () => {
    mocks.prefersReducedMotion.mockReturnValue(true);

    render(<DevMotion />);

    await waitFor(() => {
      expect(
        screen.getByText(/Reduced motion preference detected/),
      ).toBeInTheDocument();
    });
  });
});

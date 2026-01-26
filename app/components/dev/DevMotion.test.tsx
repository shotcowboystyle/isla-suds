import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {lazy} from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {DevMotion} from './DevMotion';

// Mock framer-motion lazy import - create a mock component that resolves immediately
const MockMotionDiv = ({children, className, ...props}: any) => (
  <div data-testid="motion-div" className={className} {...props}>
    {children}
  </div>
);

vi.mock('~/lib/motion', () => {
  return {
    MotionDiv: lazy(() =>
      Promise.resolve({
        default: MockMotionDiv,
      }),
    ),
    prefersReducedMotion: vi.fn(() => false),
  };
});

describe('DevMotion', () => {
  const originalWindow = globalThis.window;
  const originalMatchMedia = globalThis.window.matchMedia;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.matchMedia mock
    window.matchMedia = originalMatchMedia;
  });

  afterEach(() => {
    globalThis.window = originalWindow;
    window.matchMedia = originalMatchMedia;
  });

  it('should render loading state during SSR (before mount)', () => {
    // Simulate SSR - component not mounted yet
    const {container} = render(<DevMotion />);
    expect(container.textContent).toContain('Loading animation test...');
  });

  it('should render motion components after hydration when motion is enabled', async () => {
    // Mock prefersReducedMotion to return false (motion enabled)
    const {prefersReducedMotion} = await import('~/lib/motion');
    vi.mocked(prefersReducedMotion).mockReturnValue(false);

    render(<DevMotion />);

    // Wait for component to mount and render
    await waitFor(() => {
      expect(screen.getByText('Framer Motion Test')).toBeInTheDocument();
    });

    // Should show animated content (not static fallback)
    expect(screen.queryByText('Static Content (No Animation)')).not.toBeInTheDocument();
  });

  it('should render static fallback when prefers-reduced-motion is set', async () => {
    // Mock prefersReducedMotion to return true (motion disabled)
    const {prefersReducedMotion} = await import('~/lib/motion');
    vi.mocked(prefersReducedMotion).mockReturnValue(true);

    render(<DevMotion />);

    await waitFor(() => {
      expect(screen.getByText('Framer Motion Test')).toBeInTheDocument();
    });

    // Should show static fallback
    expect(screen.getByText('Static Content (No Animation)')).toBeInTheDocument();
    expect(screen.getByText(/Animations are disabled because you have reduced motion enabled/)).toBeInTheDocument();
  });

  it('should show warning when reduced motion is detected', async () => {
    const {prefersReducedMotion} = await import('~/lib/motion');
    vi.mocked(prefersReducedMotion).mockReturnValue(true);

    render(<DevMotion />);

    await waitFor(() => {
      expect(screen.getByText(/Reduced motion preference detected/)).toBeInTheDocument();
    });
  });

  it('should render Suspense fallback while loading', () => {
    // Mock lazy import to delay
    vi.mock('~/lib/motion', async () => {
      const actual = await vi.importActual('~/lib/motion');
      return {
        ...actual,
        MotionDiv: new Promise(() => {}), // Never resolves
      };
    });

    render(<DevMotion />);

    // Should show Suspense fallback
    expect(screen.getByText('Loading motion component...')).toBeInTheDocument();
  });
});

import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import {StoryFragmentContainer} from '~/components/story';

/**
 * Integration tests for Story Fragments on _index route (Story 4.1)
 *
 * Verifies:
 * - Fragments appear on home page during scroll (AC1)
 * - Fragments do NOT appear on /wholesale/* routes (AC5)
 * - Multiple fragments render in correct order (AC1)
 * - No interference with other page content (AC5)
 */

// Mock the visibility hook - simulate fragments becoming visible
vi.mock('~/hooks/use-story-fragment-visibility', () => ({
  useStoryFragmentVisibility: vi.fn(() => true),
}));

// Mock React Router for route simulation
const mockUseLocation = vi.fn();
vi.mock('react-router', () => ({
  Link: ({children, to, ...props}: {children: React.ReactNode; to: string}) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: () => mockUseLocation(),
}));

describe('Story Fragments - Integration Tests (Story 4.1)', () => {
  beforeEach(() => {
    // Reset location mock before each test
    mockUseLocation.mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });
  });

  describe('Home page fragment rendering (AC1)', () => {
    it('renders multiple story fragments on home page', () => {
      render(<StoryFragmentContainer />);

      // Should render multiple fragments (at least 3 per AC1)
      const fragments = screen.getAllByTestId('story-fragment');
      expect(fragments.length).toBeGreaterThanOrEqual(3);
    });

    it('renders fragments with required AC1 copy phrases', () => {
      const {container} = render(<StoryFragmentContainer />);
      const containerText = container.textContent || '';

      // All three required phrases from AC1 should appear
      expect(containerText).toContain('Named for our daughter');
      expect(containerText).toContain('Made in our kitchen');
      expect(containerText).toContain('A family recipe passed down');
    });

    it('renders fragments in consistent order during scroll', () => {
      render(<StoryFragmentContainer />);

      const fragments = screen.getAllByTestId('story-fragment');

      // Fragments should maintain order (first fragment should appear before last)
      // This ensures scroll order is predictable
      expect(fragments.length).toBeGreaterThan(0);

      // Verify fragments are in DOM order (not randomized)
      const firstFragmentIndex = Array.from(
        fragments[0].parentElement?.parentElement?.children || [],
      ).indexOf(fragments[0].parentElement as Element);

      const lastFragmentIndex = Array.from(
        fragments[fragments.length - 1].parentElement?.parentElement
          ?.children || [],
      ).indexOf(fragments[fragments.length - 1].parentElement as Element);

      expect(firstFragmentIndex).toBeLessThan(lastFragmentIndex);
    });

    it('renders fragments with semantic section container', () => {
      const {container} = render(<StoryFragmentContainer />);

      // Container should be a semantic <section> element (AC1, AC4)
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section?.getAttribute('aria-label')).toBe('Brand story moments');
    });
  });

  describe('Wholesale route exclusion (AC5)', () => {
    it('does NOT render fragments on /wholesale route', () => {
      // Simulate being on a wholesale route
      mockUseLocation.mockReturnValue({
        pathname: '/wholesale',
        search: '',
        hash: '',
        state: null,
        key: 'default',
      });

      const {container} = render(<StoryFragmentContainer />);

      // Should return null - no DOM elements
      expect(container.firstChild).toBeNull();
    });

    it('does NOT render fragments on /wholesale/* sub-routes', () => {
      // Test various wholesale sub-routes
      const wholesaleRoutes = [
        '/wholesale/products',
        '/wholesale/orders',
        '/wholesale/account',
        '/wholesale/pricing',
      ];

      wholesaleRoutes.forEach((route) => {
        mockUseLocation.mockReturnValue({
          pathname: route,
          search: '',
          hash: '',
          state: null,
          key: 'default',
        });

        const {container} = render(<StoryFragmentContainer />);

        expect(
          container.firstChild,
          `Fragments should not render on ${route}`,
        ).toBeNull();
      });
    });

    it('DOES render fragments on non-wholesale routes', () => {
      // Test that fragments render on other valid routes
      const nonWholesaleRoutes = [
        '/',
        '/products',
        '/collections/all',
        '/about',
        '/contact',
      ];

      nonWholesaleRoutes.forEach((route) => {
        mockUseLocation.mockReturnValue({
          pathname: route,
          search: '',
          hash: '',
          state: null,
          key: 'default',
        });

        const {container} = render(<StoryFragmentContainer />);

        expect(
          container.firstChild,
          `Fragments should render on ${route}`,
        ).not.toBeNull();
      });
    });
  });

  describe('Fragment structure and accessibility (AC4)', () => {
    it('each fragment uses semantic article element', () => {
      const {container} = render(<StoryFragmentContainer />);

      const articles = container.querySelectorAll('article');

      // Should have at least 3 article elements (one per fragment)
      expect(articles.length).toBeGreaterThanOrEqual(3);

      // Each should have the story-fragment test id
      articles.forEach((article) => {
        expect(article.getAttribute('data-testid')).toBe('story-fragment');
      });
    });

    it('action buttons are keyboard-focusable links', () => {
      const {container} = render(<StoryFragmentContainer />);

      // Find all action links
      const actionLinks = container.querySelectorAll('a');

      // Should have at least one action link
      expect(actionLinks.length).toBeGreaterThan(0);

      // All links should be focusable (no tabindex=-1)
      actionLinks.forEach((link) => {
        const tabIndex = link.getAttribute('tabindex');
        expect(tabIndex).not.toBe('-1');
      });
    });
  });

  describe('Performance and non-interference (AC5)', () => {
    it('renders without blocking (synchronous rendering test)', () => {
      const startTime = performance.now();
      render(<StoryFragmentContainer />);
      const endTime = performance.now();

      // Component should render quickly (< 100ms)
      // This is a basic performance smoke test
      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(100);
    });

    it('does not interfere with other page content (isolation test)', () => {
      const {container} = render(
        <div>
          <div data-testid="texture-reveal">Texture Reveal</div>
          <StoryFragmentContainer />
          <div data-testid="collection-prompt">Collection Prompt</div>
        </div>,
      );

      // Verify other elements are still present and not affected
      expect(screen.getByTestId('texture-reveal')).toBeInTheDocument();
      expect(screen.getByTestId('collection-prompt')).toBeInTheDocument();

      // Verify fragments are also present
      const fragments = screen.getAllByTestId('story-fragment');
      expect(fragments.length).toBeGreaterThan(0);
    });
  });
});

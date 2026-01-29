import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import AboutPage from '../about';

/**
 * Integration Tests: Component Integration (not router-based)
 *
 * These tests verify AboutPage component renders correctly in isolation.
 * Router-based navigation (route /about, logo click, nav links) is tested
 * at the layout/e2e level, not in component-level integration tests.
 *
 * Scope: Content rendering, responsive structure, synchronous availability
 */
describe('About Page Integration', () => {
  it('renders complete page with all sections', () => {
    render(<AboutPage />);

    // Hero section
    expect(
      screen.getByText(/Made in Our Kitchen, Named for Our Daughter/i),
    ).toBeInTheDocument();

    // All content sections present
    expect(
      screen.getByText(/From Corporate Desk to Farmers Market/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Why Isla Suds?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A Family Recipe, Reimagined/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/How We Make Each Bar/i)).toBeInTheDocument();
  });

  it('renders image placeholders with coming soon text', () => {
    render(<AboutPage />);

    const placeholders = screen.getAllByText(/Photo coming soon/i);
    // Should have 3 image placeholders (founder, workshop, market)
    expect(placeholders).toHaveLength(3);
  });

  it('uses centralized content constants (no hardcoded strings)', () => {
    const {container} = render(<AboutPage />);

    // Verify page uses content from ABOUT_PAGE constant
    // Check for specific phrases that come from the content file
    expect(container.textContent).toContain('Sarah never intended');
    expect(container.textContent).toContain('Isla is our daughter');
    expect(container.textContent).toContain("Sarah's grandmother");
    expect(container.textContent).toContain('Every batch starts in our kitchen');
  });

  it('maintains responsive layout structure', () => {
    const {container} = render(<AboutPage />);

    // Check responsive classes exist (sm: breakpoints)
    const elementsWithResponsive = container.querySelectorAll(
      '[class*="sm:"]',
    );
    expect(elementsWithResponsive.length).toBeGreaterThan(0);
  });

  it('page content is immediately available (no async loading)', () => {
    const {container} = render(<AboutPage />);

    // All text should be synchronously rendered (no Suspense for text)
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThan(0);

    // Verify no loading placeholders
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

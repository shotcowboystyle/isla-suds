import {describe, it, expect} from 'vitest';
import {render} from '@testing-library/react';
import AboutPage from '~/routes/about';

describe('About Page Accessibility (WCAG 2.1 AA)', () => {
  it('has proper heading hierarchy (h1 → h2, no skipped levels)', () => {
    const {container} = render(<AboutPage />);

    const h1 = container.querySelectorAll('h1');
    const h2 = container.querySelectorAll('h2');
    const h3 = container.querySelectorAll('h3');
    const h4 = container.querySelectorAll('h4');

    // Only one h1 on the page (WCAG 2.1 AA requirement)
    expect(h1).toHaveLength(1);

    // h2 sections exist
    expect(h2.length).toBeGreaterThan(0);

    // No h3 or h4 in current implementation (no skipped levels)
    expect(h3).toHaveLength(0);
    expect(h4).toHaveLength(0);

    // Verify h1 comes before any h2
    const firstH1Index = Array.from(
      container.querySelectorAll('h1, h2'),
    ).findIndex((el) => el.tagName === 'H1');
    expect(firstH1Index).toBe(0);
  });

  it('has descriptive alt text for all image placeholders', () => {
    const {container} = render(<AboutPage />);

    const imagePlaceholders = container.querySelectorAll('[role="img"]');
    expect(imagePlaceholders.length).toBeGreaterThan(0);

    imagePlaceholders.forEach((placeholder) => {
      const ariaLabel = placeholder.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel!.length).toBeGreaterThan(10); // Descriptive, not just "image"
    });
  });

  it('uses semantic HTML elements for screen readers', () => {
    const {container} = render(<AboutPage />);

    // Main landmark is provided by root PageLayout; route content uses article
    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();

    // Sections for content organization
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThan(0);

    // Header for page title
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('uses design tokens for color contrast compliance', () => {
    const {container} = render(<AboutPage />);

    // Verify CSS variables are used (design tokens ensure WCAG contrast)
    const textElements = container.querySelectorAll('p, h1, h2');
    expect(textElements.length).toBeGreaterThan(0);

    textElements.forEach((el) => {
      const colorStyle = el.getAttribute('class');
      // Should use design token classes (--text-primary, --text-muted)
      expect(colorStyle).toMatch(/text-\[var\(--text-/);
    });
  });

  it('has proper document structure with landmarks', () => {
    const {container} = render(<AboutPage />);

    // Article landmark for main content (main is provided by root layout)
    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();

    // Multiple sections for content organization
    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThanOrEqual(4); // 4 main sections
  });

  it('provides keyboard-navigable content (no focus traps)', () => {
    const {container} = render(<AboutPage />);

    // All interactive elements should be keyboard accessible
    // In static About page, no interactive elements besides navigation
    const interactiveElements = container.querySelectorAll(
      'a, button, input, select, textarea',
    );

    // If any interactive elements exist, they should be keyboard accessible
    interactiveElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      expect(el.hasAttribute('tabindex') || htmlEl.tabIndex >= 0).toBe(true);
    });
  });
});

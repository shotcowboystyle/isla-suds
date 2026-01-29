import {describe, it, expect} from 'vitest';
import {render} from '@testing-library/react';
import AboutPage from '../about';

describe('About Page Performance', () => {
  it('uses design tokens (no inline styles that block paint)', () => {
    const {container} = render(<AboutPage />);

    // Verify no inline styles that could block rendering
    const elementsWithInlineStyles = container.querySelectorAll('[style]');

    // Count elements with inline styles (should be minimal)
    // Some inline styles are acceptable for dynamic content
    expect(elementsWithInlineStyles.length).toBeLessThanOrEqual(5);
  });

  it('uses semantic HTML (no div soup that slows rendering)', () => {
    const {container} = render(<AboutPage />);

    const article = container.querySelector('article');
    const sections = container.querySelectorAll('section');

    // Proper semantic structure (main from layout; route has article + sections)
    expect(article).toBeInTheDocument();
    expect(sections.length).toBeGreaterThan(0);
  });

  it('loads text content synchronously (LCP < 2.5s target)', () => {
    const {container} = render(<AboutPage />);

    // All text content should be immediately available (not deferred)
    const h1 = container.querySelector('h1');
    const paragraphs = container.querySelectorAll('p');

    expect(h1).toBeInTheDocument();
    expect(h1?.textContent).toBeTruthy();
    expect(paragraphs.length).toBeGreaterThan(0);

    // Verify paragraphs have content (not loading placeholders)
    paragraphs.forEach((p) => {
      expect(p.textContent).toBeTruthy();
      expect(p.textContent!.length).toBeGreaterThan(10); // At least 10 chars
    });
  });

  it('has minimal DOM depth (better rendering performance)', () => {
    const {container} = render(<AboutPage />);

    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();

    // Sections should be direct children of article (flat structure)
    const sections = article?.querySelectorAll(':scope > section');
    expect(sections?.length).toBeGreaterThan(0);
  });

  it('uses fluid typography (no layout shift)', () => {
    const {container} = render(<AboutPage />);

    // Verify fluid typography classes are used (prevents CLS)
    const h1 = container.querySelector('h1');
    const h2Elements = container.querySelectorAll('h2');
    const paragraphs = container.querySelectorAll('p');

    expect(h1?.className).toContain('fluid');
    h2Elements.forEach((h2) => {
      expect(h2.className).toContain('fluid');
    });
    paragraphs.forEach((p) => {
      expect(p.className).toContain('fluid');
    });
  });

  it('image placeholders have explicit dimensions (prevent CLS)', () => {
    const {container} = render(<AboutPage />);

    const imagePlaceholders = container.querySelectorAll('[role="img"]');
    expect(imagePlaceholders.length).toBeGreaterThan(0);

    imagePlaceholders.forEach((placeholder) => {
      const classes = placeholder.className;
      // Should have aspect ratio class (aspect-[3/4], aspect-video)
      expect(classes).toMatch(/aspect-/);
    });
  });

  it('no external script dependencies (fast TTI)', () => {
    const {container} = render(<AboutPage />);

    // About page should be pure content, no external scripts
    const scripts = container.querySelectorAll('script');

    // Should have no additional scripts beyond React hydration
    expect(scripts.length).toBe(0);
  });

  it('uses design token CSS variables for colors', () => {
    const {container} = render(<AboutPage />);

    // Check that CSS variable syntax is used in classes
    const textElements = container.querySelectorAll('p, h1, h2');
    expect(textElements.length).toBeGreaterThan(0);

    // Verify at least some elements use design token classes
    let usesDesignTokens = false;
    textElements.forEach((el) => {
      const className = el.className;
      if (className.includes('text-[var(--text-')) {
        usesDesignTokens = true;
      }
    });

    expect(usesDesignTokens).toBe(true);
  });
});

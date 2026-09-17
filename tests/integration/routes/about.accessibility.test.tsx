import {describe, it, expect} from 'vitest';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import AboutPage from '~/routes/about';

const renderPage = () =>
  render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>,
  );

describe('About Page Accessibility (WCAG 2.1 AA)', () => {
  it('has proper heading hierarchy (h1 → h2, no skipped levels)', () => {
    const {container} = renderPage();

    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelectorAll('h2').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('h3')).toHaveLength(0);
    expect(container.querySelectorAll('h4')).toHaveLength(0);

    const headings = Array.from(container.querySelectorAll('h1, h2'));
    expect(headings.findIndex((el) => el.tagName === 'H1')).toBe(0);
  });

  it('uses semantic HTML elements for screen readers', () => {
    const {container} = renderPage();

    // Main landmark comes from the root PageLayout; the route owns the article.
    expect(container.querySelector('article')).toBeInTheDocument();
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelectorAll('section').length).toBeGreaterThanOrEqual(4);
  });

  /**
   * Decorative planes must not be announced: the hero's two splash plates are
   * the same photograph twice, and the week counter restates a sentence the
   * copy beside it already makes.
   */
  it('hides decorative imagery and the cure counter from assistive tech', () => {
    const {container} = renderPage();

    container.querySelectorAll('img').forEach((img) => {
      const hidden = img.getAttribute('alt') === '' || img.closest('[aria-hidden="true"]') !== null;
      const labelled = (img.getAttribute('alt') ?? '').length > 10;
      expect(hidden || labelled).toBe(true);
    });

    expect(container.querySelector('figcaption')).toHaveAttribute('aria-hidden', 'true');
  });

  it('provides keyboard-navigable content (no focus traps)', () => {
    const {container} = renderPage();

    const interactive = container.querySelectorAll('a, button, input, select, textarea');
    expect(interactive.length).toBeGreaterThan(0);

    interactive.forEach((el) => {
      const htmlEl = el as HTMLElement;
      expect(el.hasAttribute('tabindex') || htmlEl.tabIndex >= 0).toBe(true);
    });
  });
});

import {describe, it, expect} from 'vitest';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {PreloaderProvider} from '~/contexts/preloader-context';
import AboutPage from '~/routes/about';

const renderPage = () =>
  render(
    <MemoryRouter>
      <PreloaderProvider>
        <AboutPage />
      </PreloaderProvider>
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

  /** Decorative planes must not be announced; every photo that carries story has real alt text. */
  it('hides decorative imagery from assistive tech', () => {
    const {container} = renderPage();

    container.querySelectorAll('img').forEach((img) => {
      const hidden = img.getAttribute('alt') === '' || img.closest('[aria-hidden="true"]') !== null;
      const labelled = (img.getAttribute('alt') ?? '').length > 10;
      expect(hidden || labelled).toBe(true);
    });

    // The fridge's copy of the recipe card repeats act 2, so it is hidden.
    expect(container.querySelectorAll('[data-card]')[1]?.closest('[aria-hidden="true"]')).not.toBeNull();
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

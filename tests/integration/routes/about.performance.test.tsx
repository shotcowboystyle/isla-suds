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

describe('About Page Performance', () => {
  it('ships no inline styles that block paint', () => {
    const {container} = renderPage();

    // GSAP writes transforms at runtime; the server payload should carry none.
    expect(container.querySelectorAll('[style]').length).toBe(0);
  });

  /**
   * Every act renders eagerly. ScrollTrigger measures start and end positions
   * once against the whole document, so a section that arrives after hydration
   * pushes every trigger below it into the wrong place.
   */
  it('renders all acts synchronously (no deferred sections)', () => {
    const {container} = renderPage();

    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();
    expect(article!.querySelectorAll(':scope > section').length).toBeGreaterThanOrEqual(4);
    expect(container.querySelector('h1')?.textContent).toBeTruthy();

    container.querySelectorAll('p').forEach((p) => {
      // No empty placeholder paragraphs ("Then two." is the shortest real one).
      expect(p.textContent!.trim().length).toBeGreaterThan(5);
    });
  });

  it('gives every image explicit dimensions (prevent CLS)', () => {
    const {container} = renderPage();

    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);

    images.forEach((img) => {
      expect(img.getAttribute('width')).toBeTruthy();
      expect(img.getAttribute('height')).toBeTruthy();
    });
  });

  it('no external script dependencies (fast TTI)', () => {
    const {container} = renderPage();

    expect(container.querySelectorAll('script').length).toBe(0);
  });
});

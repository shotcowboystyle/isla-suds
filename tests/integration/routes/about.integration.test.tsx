import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {ABOUT_PAGE} from '~/content/about';
import AboutPage from '~/routes/about';

/**
 * Integration Tests: Component Integration (not router-based)
 *
 * Verifies the About route renders the whole story in one pass. Router-based
 * navigation is covered at the layout/e2e level; the MemoryRouter here only
 * exists because the closing section links into the store.
 *
 * Scope: content rendering, the lifted pull quote, synchronous availability.
 */
const renderPage = () =>
  render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>,
  );

describe('About Page Integration', () => {
  it('renders every section of the story', () => {
    renderPage();

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent(/made in our kitchen/i);
    expect(screen.getByText(/From Corporate Desk to Farmers Market/i)).toBeInTheDocument();
    expect(screen.getByText(/Why Isla Suds\?/i)).toBeInTheDocument();
    expect(screen.getByText(/A Family Recipe, Reimagined/i)).toBeInTheDocument();
    expect(screen.getByText(/How We Make Each Bar/i)).toBeInTheDocument();
  });

  it('uses centralized content constants (no hardcoded strings)', () => {
    const {container} = renderPage();

    expect(container.textContent).toContain('Sarah never intended');
    expect(container.textContent).toContain('Isla is our daughter');
    expect(container.textContent).toContain("Sarah's grandmother");
    expect(container.textContent).toContain('Every batch starts in our kitchen');
  });

  /**
   * The peak line is lifted out of its paragraph so it can carry a screen on
   * its own. Rendering it in both places would read it twice to a screen
   * reader, so the paragraph must render without it.
   */
  it('renders the pull quote exactly once, as a blockquote', () => {
    const {container} = renderPage();

    const quote = container.querySelector('blockquote');
    expect(quote).toHaveTextContent(ABOUT_PAGE.islaNameSake.pullQuote);

    const occurrences = container.textContent!.split(ABOUT_PAGE.islaNameSake.pullQuote).length - 1;
    expect(occurrences).toBe(1);
  });

  it('links out to the store and the store locator', () => {
    renderPage();

    expect(screen.getByRole('link', {name: ABOUT_PAGE.close.primary.label})).toHaveAttribute(
      'href',
      ABOUT_PAGE.close.primary.href,
    );
    expect(screen.getByRole('link', {name: ABOUT_PAGE.close.secondary.label})).toHaveAttribute(
      'href',
      ABOUT_PAGE.close.secondary.href,
    );
  });

  it('page content is immediately available (no async loading)', () => {
    const {container} = renderPage();

    expect(container.querySelectorAll('p').length).toBeGreaterThan(0);
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

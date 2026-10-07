import {describe, it, expect} from 'vitest';
import {render, screen, within} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {ABOUT_PAGE} from '~/content/about';
import {PreloaderProvider} from '~/contexts/preloader-context';
import AboutPage from '~/routes/about';

/**
 * Integration Tests: Component Integration (not router-based)
 *
 * Verifies the About route renders the whole story in one pass. Router-based
 * navigation is covered at the layout/e2e level; the MemoryRouter here only
 * exists because the closing section links into the store.
 *
 * Scope: content rendering, the card's text, the promise, synchronous availability.
 */
const renderPage = () =>
  render(
    <MemoryRouter>
      <PreloaderProvider>
        <AboutPage />
      </PreloaderProvider>
    </MemoryRouter>,
  );

describe('About Page Integration', () => {
  it('renders every section of the story', () => {
    renderPage();

    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent(/made in our kitchen/i);
    expect(screen.getByText(ABOUT_PAGE.recipe.heading)).toBeInTheDocument();
    expect(screen.getByText(ABOUT_PAGE.made.heading)).toBeInTheDocument();
    expect(screen.getByText(ABOUT_PAGE.market.heading)).toBeInTheDocument();
    expect(screen.getByText(ABOUT_PAGE.isla.heading)).toBeInTheDocument();
  });

  it('writes the recipe card as real text, not an image', () => {
    renderPage();

    // The fridge holds a second, aria-hidden copy; act 2's card is the first.
    const card = screen.getAllByText(ABOUT_PAGE.recipe.card.title)[0].closest('[data-card]') as HTMLElement;
    expect(within(card).getByText('+ goat milk')).toBeInTheDocument();
    expect(within(card).getByText(/no added fragrance/i)).toBeInTheDocument();
  });

  it('renders the inspection checklist and the promise exactly once', () => {
    const {container} = renderPage();

    ABOUT_PAGE.isla.checklist.forEach((item) => expect(screen.getByText(item)).toBeInTheDocument());
    expect(container.querySelector('blockquote')).toHaveTextContent(ABOUT_PAGE.isla.quote);
    expect(container.textContent!.split(ABOUT_PAGE.isla.quote).length - 1).toBe(1);
  });

  it('links out to the store and the store locator', () => {
    renderPage();

    expect(screen.getByRole('link', {name: ABOUT_PAGE.close.primary.label})).toHaveAttribute(
      'href',
      ABOUT_PAGE.close.primary.href,
    );
    // "Find a store" appears in the market act and the close; both go to the locator.
    screen
      .getAllByRole('link', {name: ABOUT_PAGE.close.secondary.label})
      .forEach((link) => expect(link).toHaveAttribute('href', ABOUT_PAGE.close.secondary.href));
  });

  it('page content is immediately available (no async loading)', () => {
    const {container} = renderPage();

    expect(container.querySelectorAll('p').length).toBeGreaterThan(0);
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

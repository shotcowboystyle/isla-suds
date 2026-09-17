import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import AboutPage from '~/routes/about';

const renderPage = () =>
  render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>,
  );

describe('About Page', () => {
  it('renders the story headline as the only h1', () => {
    const {container} = renderPage();

    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toMatch(/made in our kitchen/i);
    expect(h1s[0].textContent).toMatch(/named for our daughter/i);
  });

  it('wraps the page in an article with a hero header', () => {
    const {container} = renderPage();

    expect(container.querySelector('article')).toBeInTheDocument();
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('renders every chapter heading', () => {
    renderPage();

    expect(screen.getByRole('heading', {level: 2, name: /family recipe/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 2, name: /from corporate desk/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 2, name: /how we make/i})).toBeInTheDocument();
    expect(screen.getByRole('heading', {level: 2, name: /why isla suds/i})).toBeInTheDocument();
  });
});

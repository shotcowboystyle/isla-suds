import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import AboutPage from '~/routes/about';

describe('About Page', () => {
  it('renders page title', () => {
    render(<AboutPage />);
    expect(
      screen.getByRole('heading', {level: 1, name: /made in our kitchen/i}),
    ).toBeInTheDocument();
  });

  it('renders with proper semantic HTML structure', () => {
    const {container} = render(<AboutPage />);
    // Main landmark is provided by root PageLayout; route renders article inside it
    expect(container.querySelector('article')).toBeInTheDocument();
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('has all content sections', () => {
    render(<AboutPage />);

    // Check for main sections (h2 headings)
    expect(
      screen.getByRole('heading', {level: 2, name: /from corporate desk/i}),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {level: 2, name: /why isla suds/i}),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {level: 2, name: /family recipe/i}),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {level: 2, name: /how we make/i}),
    ).toBeInTheDocument();
  });
});

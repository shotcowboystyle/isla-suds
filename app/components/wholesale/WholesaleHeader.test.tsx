import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {describe, expect, it, vi} from 'vitest';
import {WholesaleHeader} from './WholesaleHeader';

vi.mock('react-router', async (importActual) => {
  const actual = (await importActual()) as Record<string, unknown>;
  return {
    ...actual,
    useFetcher: () => ({
      submit: vi.fn().mockResolvedValue(undefined),
      state: 'idle' as const,
      data: undefined,
    }),
  };
});

describe('WholesaleHeader — New Order nav link', () => {
  it('renders "New Order" link in the navigation', () => {
    render(
      <MemoryRouter initialEntries={['/wholesale']}>
        <WholesaleHeader customerName="Alex" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', {name: /new order/i})).toBeInTheDocument();
  });

  it('"New Order" link navigates to /wholesale/order', () => {
    render(
      <MemoryRouter initialEntries={['/wholesale']}>
        <WholesaleHeader customerName="Alex" />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', {name: /new order/i});
    expect(link).toHaveAttribute('href', '/wholesale/order');
  });

  it('"New Order" link is an anchor element (keyboard accessible)', () => {
    render(
      <MemoryRouter initialEntries={['/wholesale']}>
        <WholesaleHeader customerName="Alex" />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', {name: /new order/i});
    expect(link.tagName).toBe('A');
  });

  it('marks "New Order" link as aria-current="page" when on /wholesale/order', () => {
    render(
      <MemoryRouter initialEntries={['/wholesale/order']}>
        <WholesaleHeader customerName="Alex" />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', {name: /new order/i});
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark "New Order" link as aria-current when on other pages', () => {
    render(
      <MemoryRouter initialEntries={['/wholesale']}>
        <WholesaleHeader customerName="Alex" />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', {name: /new order/i});
    expect(link).not.toHaveAttribute('aria-current', 'page');
  });
});

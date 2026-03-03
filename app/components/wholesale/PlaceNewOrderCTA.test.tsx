import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import {describe, expect, it} from 'vitest';
import {PlaceNewOrderCTA} from './PlaceNewOrderCTA';

describe('PlaceNewOrderCTA', () => {
  it('renders "Place New Order" text', () => {
    render(
      <MemoryRouter>
        <PlaceNewOrderCTA />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('link', {name: /place new order/i}),
    ).toBeInTheDocument();
  });

  it('links to the wholesale order page', () => {
    render(
      <MemoryRouter>
        <PlaceNewOrderCTA />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', {name: /place new order/i});
    expect(link).toHaveAttribute('href', '/wholesale/order');
  });

  it('is an anchor element (keyboard focusable)', () => {
    render(
      <MemoryRouter>
        <PlaceNewOrderCTA />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', {name: /place new order/i});
    expect(link.tagName).toBe('A');
  });

  it('renders without requiring order data (visible regardless of order history)', () => {
    // Component must render with no props — no order data dependency
    render(
      <MemoryRouter>
        <PlaceNewOrderCTA />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('link', {name: /place new order/i}),
    ).toBeInTheDocument();
  });
});

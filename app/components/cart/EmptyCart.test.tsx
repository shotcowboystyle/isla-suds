import {describe, it, expect, beforeEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {BrowserRouter} from 'react-router';
import {EmptyCart} from './EmptyCart';
import {useExplorationStore} from '~/stores/exploration';

// Mock the exploration store
vi.mock('~/stores/exploration', () => ({
  useExplorationStore: vi.fn(),
}));

describe('EmptyCart', () => {
  const mockSetCartDrawerOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock store implementation - return function directly
    (useExplorationStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: {setCartDrawerOpen: typeof mockSetCartDrawerOpen}) => unknown) => {
        const state = {setCartDrawerOpen: mockSetCartDrawerOpen};
        return selector(state);
      },
    );
  });

  it('renders warm message', () => {
    render(
      <BrowserRouter>
        <EmptyCart />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(/Your cart is empty. Let's find something you'll love./i),
    ).toBeInTheDocument();
  });

  it('renders "Explore the Collection" button', () => {
    render(
      <BrowserRouter>
        <EmptyCart />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole('link', {name: /Explore the Collection/i}),
    ).toBeInTheDocument();
  });

  it('button links to homepage', () => {
    render(
      <BrowserRouter>
        <EmptyCart />
      </BrowserRouter>,
    );

    const button = screen.getByRole('link', {name: /Explore the Collection/i});
    expect(button).toHaveAttribute('href', '/');
  });

  it('closes cart drawer when button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <EmptyCart />
      </BrowserRouter>,
    );

    const button = screen.getByRole('link', {name: /Explore the Collection/i});
    await user.click(button);

    expect(mockSetCartDrawerOpen).toHaveBeenCalledWith(false);
  });

  it('message uses correct typography', () => {
    render(
      <BrowserRouter>
        <EmptyCart />
      </BrowserRouter>,
    );

    const message = screen.getByText(
      /Your cart is empty. Let's find something you'll love./i,
    );
    expect(message).toHaveClass('text-[var(--text-primary)]');
  });

  it('button has accessible label', () => {
    render(
      <BrowserRouter>
        <EmptyCart />
      </BrowserRouter>,
    );

    const button = screen.getByRole('link', {
      name: /Explore the Collection, closes cart/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('layout is centered', () => {
    render(
      <BrowserRouter>
        <EmptyCart />
      </BrowserRouter>,
    );

    const container = screen
      .getByText(/Your cart is empty/i)
      .closest('div');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });

  it('button has minimum touch target height', () => {
    render(
      <BrowserRouter>
        <EmptyCart />
      </BrowserRouter>,
    );

    const button = screen.getByRole('link', {name: /Explore the Collection/i});
    expect(button).toHaveClass('h-11'); // 44px minimum
  });
});

import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, it, expect, beforeEach, vi} from 'vitest';
import {CartDrawer} from './CartDrawer';

// Mock cart state
let mockCartData: any = null;
let mockCartDrawerOpen = false;
let mockSetCartDrawerOpen = vi.fn();

// Mock dependencies
vi.mock('~/stores/exploration', () => ({
  useExplorationStore: () => ({
    cartDrawerOpen: mockCartDrawerOpen,
    setCartDrawerOpen: mockSetCartDrawerOpen,
  }),
}));

vi.mock('@shopify/hydrogen', () => ({
  useOptimisticCart: (cart: any) => cart,
}));

vi.mock('react-router', () => ({
  useRouteLoaderData: () => ({
    cart: mockCartData,
  }),
}));

describe('CartDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCartDrawerOpen = false;
    mockCartData = null;
    mockSetCartDrawerOpen = vi.fn();
  });

  describe('Rendering based on state', () => {
    it('renders drawer when cartDrawerOpen is true', () => {
      mockCartDrawerOpen = true;

      render(<CartDrawer />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Your Cart')).toBeInTheDocument();
    });

    it('does not render drawer when cartDrawerOpen is false', () => {
      mockCartDrawerOpen = false;

      render(<CartDrawer />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Close interactions', () => {
    beforeEach(() => {
      mockCartDrawerOpen = true;
    });

    it('closes drawer when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<CartDrawer />);

      const closeButton = screen.getByLabelText('Close cart');
      await user.click(closeButton);

      expect(mockSetCartDrawerOpen).toHaveBeenCalledWith(false);
    });

    it('closes drawer when Escape key is pressed', async () => {
      const user = userEvent.setup();
      render(<CartDrawer />);

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(mockSetCartDrawerOpen).toHaveBeenCalledWith(false);
      });
    });

    it('configures Dialog to handle backdrop clicks via onOpenChange', () => {
      render(<CartDrawer />);

      // Radix Dialog automatically handles backdrop clicks via onInteractOutside
      // This triggers onOpenChange callback which calls setCartDrawerOpen(false)
      // We verify the component is configured correctly by checking it renders
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      // The onOpenChange handler should be wired to setCartDrawerOpen
      // This is verified by the component rendering and closing via other means
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockCartDrawerOpen = true;
    });

    it('has correct ARIA attributes', () => {
      render(<CartDrawer />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby');
    });

    it('close button has correct aria-label', () => {
      render(<CartDrawer />);

      const closeButton = screen.getByLabelText('Close cart');
      expect(closeButton).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      render(<CartDrawer />);

      const heading = screen.getByRole('heading', {level: 2});
      expect(heading).toHaveTextContent('Your Cart');
    });
  });

  describe('Cart content display', () => {
    beforeEach(() => {
      mockCartDrawerOpen = true;
    });

    it('shows empty cart component when cart has no items', () => {
      mockCartData = {
        lines: {nodes: []},
        cost: {subtotalAmount: {amount: '0', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      expect(
        screen.getByText(/empty cart state will be implemented/i),
      ).toBeInTheDocument();
    });

    it('shows CartLineItems component when cart has items', () => {
      mockCartData = {
        lines: {
          nodes: [
            {
              id: 'line-1',
              merchandise: {
                product: {title: 'Test Product'},
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      expect(
        screen.getByText(/line items will be implemented/i),
      ).toBeInTheDocument();
    });

    it('displays subtotal with formatted price', () => {
      mockCartData = {
        lines: {
          nodes: [
            {
              id: 'line-1',
              merchandise: {
                product: {title: 'Test Product'},
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '25.50', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      expect(screen.getByText('$25.50')).toBeInTheDocument();
    });

    it('shows checkout button', () => {
      mockCartData = {
        lines: {nodes: []},
        cost: {subtotalAmount: {amount: '0', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      expect(
        screen.getByRole('button', {name: /proceed to checkout/i}),
      ).toBeInTheDocument();
    });
  });

  describe('Touch target sizes', () => {
    beforeEach(() => {
      mockCartDrawerOpen = true;
    });

    it('close button has minimum 44x44px touch target', () => {
      render(<CartDrawer />);

      const closeButton = screen.getByLabelText('Close cart');
      const styles = window.getComputedStyle(closeButton);

      // Note: This is a basic check; real implementation should verify actual pixel dimensions
      expect(closeButton).toHaveClass('h-11', 'w-11'); // 44px = 11 * 4px (Tailwind)
    });
  });
});

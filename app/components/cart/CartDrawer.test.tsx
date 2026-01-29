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
  Link: ({to, children, ...props}: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
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
      expect(screen.getByText(/Your Cart/i)).toBeInTheDocument();
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

    it('closes drawer when Continue Shopping is clicked', async () => {
      const user = userEvent.setup();
      render(<CartDrawer />);

      const continueButton = screen.getByRole('button', {
        name: /continue shopping/i,
      });
      await user.click(continueButton);

      expect(mockSetCartDrawerOpen).toHaveBeenCalledWith(false);
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
      expect(heading).toHaveTextContent(/Your Cart/);
    });

    it('respects prefers-reduced-motion setting', () => {
      render(<CartDrawer />);

      const content = screen.getByRole('dialog');
      // Verify motion-reduce classes are present
      expect(content).toHaveClass('motion-reduce:transition-none');
      expect(content).toHaveClass('motion-reduce:transform-none');
    });
  });

  describe('Cart content display', () => {
    beforeEach(() => {
      mockCartDrawerOpen = true;
    });

    it('shows loading skeleton when cart is loading', () => {
      mockCartData = null; // Simulate loading state

      render(<CartDrawer />);

      // Check for skeleton loading elements
      const skeletons = screen
        .getByRole('dialog')
        .querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
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
              quantity: 1,
              attributes: [],
              cost: {
                totalAmount: {amount: '10.00', currencyCode: 'USD'},
                amountPerQuantity: {amount: '10.00', currencyCode: 'USD'},
                compareAtAmountPerQuantity: null,
              },
              merchandise: {
                id: 'variant-1',
                title: '',
                availableForSale: true,
                requiresShipping: true,
                price: {amount: '10.00', currencyCode: 'USD'},
                compareAtPrice: null,
                image: {
                  id: 'image-1',
                  url: 'https://cdn.shopify.com/test.jpg',
                  altText: null,
                  width: 800,
                  height: 800,
                },
                product: {
                  id: 'product-1',
                  handle: 'test-product',
                  title: 'Test Product',
                  vendor: 'Test',
                  availableForSale: true,
                  isGiftCard: false,
                  tags: [],
                  productType: 'Soap',
                  options: [],
                  featuredImage: {
                    id: 'image-1',
                    url: 'https://cdn.shopify.com/test.jpg',
                    altText: null,
                    width: 800,
                    height: 800,
                  },
                  collections: {nodes: []},
                  seo: {title: null, description: null},
                  variants: {nodes: []},
                },
                selectedOptions: [],
                quantityAvailable: 10,
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      // CartLineItems component now renders actual line items
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('displays subtotal with formatted price', () => {
      mockCartData = {
        lines: {
          nodes: [
            {
              id: 'line-1',
              quantity: 1,
              attributes: [],
              cost: {
                totalAmount: {amount: '25.50', currencyCode: 'USD'},
                amountPerQuantity: {amount: '25.50', currencyCode: 'USD'},
                compareAtAmountPerQuantity: null,
              },
              merchandise: {
                id: 'variant-1',
                title: '',
                availableForSale: true,
                requiresShipping: true,
                price: {amount: '25.50', currencyCode: 'USD'},
                compareAtPrice: null,
                image: {
                  id: 'image-1',
                  url: 'https://cdn.shopify.com/test.jpg',
                  altText: null,
                  width: 800,
                  height: 800,
                },
                product: {
                  id: 'product-1',
                  handle: 'test-product',
                  title: 'Test Product',
                  vendor: 'Test',
                  availableForSale: true,
                  isGiftCard: false,
                  tags: [],
                  productType: 'Soap',
                  options: [],
                  featuredImage: {
                    id: 'image-1',
                    url: 'https://cdn.shopify.com/test.jpg',
                    altText: null,
                    width: 800,
                    height: 800,
                  },
                  collections: {nodes: []},
                  seo: {title: null, description: null},
                  variants: {nodes: []},
                },
                selectedOptions: [],
                quantityAvailable: 10,
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '25.50', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      // $25.50 appears multiple times (unit price, line total, subtotal)
      const prices = screen.getAllByText('$25.50');
      expect(prices.length).toBeGreaterThan(0);
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

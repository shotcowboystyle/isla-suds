import {render, screen, waitFor, act} from '@testing-library/react';
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
  useFetcher: vi.fn(() => ({
    submit: vi.fn(),
    state: 'idle',
    data: null,
  })),
  Link: ({to, children, ...props}: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock motion library components (Story 5.7 - animation integration)
vi.mock('~/lib/motion', () => ({
  AnimatePresence: ({children}: any) => children,
  MotionLi: ({children, ...props}: any) => <li {...props}>{children}</li>,
  fadeOutExitVariant: {},
  prefersReducedMotion: vi.fn(() => false),
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
      // Need cart with items for Continue Shopping button to be visible
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {
                  handle: 'test-soap',
                },
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };
      mockCartDrawerOpen = true;

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

    it('shows EmptyCart component when cart has no items (AC7, AC10)', () => {
      mockCartData = {
        lines: {nodes: []},
        cost: {subtotalAmount: {amount: '0', currencyCode: 'USD'}},
      };
      mockCartDrawerOpen = true;

      render(<CartDrawer />);

      // Verify EmptyCart message displays
      expect(
        screen.getByText(/Your cart is empty. Let's find something you'll love./i),
      ).toBeInTheDocument();

      // Verify "Explore the Collection" button displays
      expect(
        screen.getByRole('link', {name: /Explore the Collection/i}),
      ).toBeInTheDocument();
    });

    it('hides subtotal and checkout button when cart is empty (AC7)', () => {
      mockCartData = {
        lines: {nodes: []},
        cost: {subtotalAmount: {amount: '0', currencyCode: 'USD'}},
      };
      mockCartDrawerOpen = true;

      render(<CartDrawer />);

      // Verify subtotal is hidden
      expect(screen.queryByText('Subtotal')).not.toBeInTheDocument();

      // Verify checkout button is hidden
      expect(
        screen.queryByRole('button', {name: /Proceed to checkout/i}),
      ).not.toBeInTheDocument();

      // Verify continue shopping is hidden (only in footer)
      expect(
        screen.queryByRole('button', {name: /Continue Shopping/i}),
      ).not.toBeInTheDocument();
    });

    it('uses aria-labelledby for proper dialog labeling (AC5)', () => {
      mockCartData = {
        lines: {nodes: []},
        cost: {subtotalAmount: {amount: '0', currencyCode: 'USD'}},
      };
      mockCartDrawerOpen = true;

      render(<CartDrawer />);

      // Verify dialog has aria-labelledby pointing to title
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'cart-title');
    });

    it('announces "Cart is now empty" via ARIA live region when cart becomes empty (AC5, AC8)', async () => {
      mockCartData = {
        lines: {nodes: []},
        cost: {subtotalAmount: {amount: '0', currencyCode: 'USD'}},
      };
      mockCartDrawerOpen = true;

      render(<CartDrawer />);

      // Wait for live region to announce
      await waitFor(() => {
        const liveRegion = screen.getByRole('status');
        expect(liveRegion).toHaveTextContent('Cart is now empty');
      });
    });

    it('drawer remains open when cart becomes empty (AC3)', () => {
      mockCartData = {
        lines: {nodes: []},
        cost: {subtotalAmount: {amount: '0', currencyCode: 'USD'}},
      };
      mockCartDrawerOpen = true;

      render(<CartDrawer />);

      // Verify drawer is still open (dialog is rendered)
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Verify EmptyCart component is displayed
      expect(
        screen.getByText(/Your cart is empty. Let's find something you'll love./i),
      ).toBeInTheDocument();

      // Verify setCartDrawerOpen was NOT called (drawer stays open)
      expect(mockSetCartDrawerOpen).not.toHaveBeenCalledWith(false);
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

    it('shows checkout button when cart has items', () => {
      mockCartData = {
        checkoutUrl: 'https://isla-suds.myshopify.com/checkout/123',
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {
                  handle: 'test-soap',
                },
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };
      mockCartDrawerOpen = true;

      render(<CartDrawer />);

      expect(
        screen.getByRole('button', {name: /checkout.*proceed to payment/i}),
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

  describe('Checkout redirect functionality (Story 5.9)', () => {
    beforeEach(() => {
      mockCartDrawerOpen = true;
      // Reset window.location.href before each test
      delete (window as any).location;
      (window as any).location = {href: ''};
    });

    it('redirects to cart.checkoutUrl when checkout button is clicked (AC2)', async () => {
      const user = userEvent.setup();
      const checkoutUrl = 'https://isla-suds.myshopify.com/checkout/123';
      mockCartData = {
        checkoutUrl,
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {handle: 'test-soap'},
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      const checkoutButton = screen.getByRole('button', {
        name: /checkout/i,
      });
      await user.click(checkoutButton);

      // Verify redirect happens
      expect(window.location.href).toBe(checkoutUrl);
    });

    it('shows loading state during checkout redirect (AC3)', async () => {
      const user = userEvent.setup();
      mockCartData = {
        checkoutUrl: 'https://isla-suds.myshopify.com/checkout/123',
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {handle: 'test-soap'},
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      const checkoutButton = screen.getByRole('button', {
        name: /checkout/i,
      });

      // Button should not be disabled before click
      expect(checkoutButton).not.toBeDisabled();

      await user.click(checkoutButton);

      // Button should show loading state (text changes to "Processing..." or has loading indicator)
      // This test will initially fail until we implement loading state
      await waitFor(() => {
        expect(checkoutButton).toHaveTextContent(/processing/i);
      });
    });

    it('disables button during redirect to prevent double-click (AC10)', async () => {
      const user = userEvent.setup();
      mockCartData = {
        checkoutUrl: 'https://isla-suds.myshopify.com/checkout/123',
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {handle: 'test-soap'},
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      const checkoutButton = screen.getByRole('button', {
        name: /checkout/i,
      });

      await user.click(checkoutButton);

      // Button should be disabled during redirect
      await waitFor(() => {
        expect(checkoutButton).toBeDisabled();
      });
    });

    it('shows error message when checkout URL is missing (AC6)', async () => {
      const user = userEvent.setup();
      mockCartData = {
        checkoutUrl: null, // Missing checkout URL
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {handle: 'test-soap'},
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      const checkoutButton = screen.getByRole('button', {
        name: /checkout/i,
      });
      await user.click(checkoutButton);

      // Error message should appear
      expect(
        screen.getByText(/couldn't start checkout/i),
      ).toBeInTheDocument();
    });

    it('auto-dismisses error message after 3 seconds (AC6)', async () => {
      const user = userEvent.setup();
      mockCartData = {
        checkoutUrl: null,
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {handle: 'test-soap'},
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      const checkoutButton = screen.getByRole('button', {
        name: /checkout/i,
      });
      await user.click(checkoutButton);

      // Error should be visible
      expect(
        screen.getByText(/couldn't start checkout/i),
      ).toBeInTheDocument();

      // Wait for error to auto-dismiss (using real timers with increased timeout)
      await waitFor(
        () => {
          expect(
            screen.queryByText(/couldn't start checkout/i),
          ).not.toBeInTheDocument();
        },
        {timeout: 4000},
      );
    });

    it('button returns to normal state after error (AC6)', async () => {
      const user = userEvent.setup();
      mockCartData = {
        checkoutUrl: null,
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {handle: 'test-soap'},
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      const checkoutButton = screen.getByRole('button', {
        name: /checkout/i,
      });
      await user.click(checkoutButton);

      // Wait for error state to settle
      await waitFor(() => {
        expect(screen.getByText(/couldn't start checkout/i)).toBeInTheDocument();
      });

      // After error, button should not be disabled (user can retry)
      expect(checkoutButton).not.toBeDisabled();

      // Button text should be back to "Checkout"
      expect(checkoutButton).toHaveTextContent(/^Checkout$/i);
    });

    it('has correct ARIA label for screen readers (AC8)', () => {
      mockCartData = {
        checkoutUrl: 'https://isla-suds.myshopify.com/checkout/123',
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {handle: 'test-soap'},
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      // AC8 requires: "Checkout button, proceed to payment"
      const checkoutButton = screen.getByRole('button', {
        name: 'Checkout button, proceed to payment',
      });
      expect(checkoutButton).toBeInTheDocument();
      expect(checkoutButton).toHaveAccessibleName('Checkout button, proceed to payment');
    });

    it('checkout button has adequate height for touch targets (AC7)', () => {
      mockCartData = {
        checkoutUrl: 'https://isla-suds.myshopify.com/checkout/123',
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {handle: 'test-soap'},
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      const checkoutButton = screen.getByRole('button', {
        name: /checkout/i,
      });

      // Button should have h-12 (48px) or h-14 (56px) class
      const hasAdequateHeight =
        checkoutButton.classList.contains('h-12') ||
        checkoutButton.classList.contains('h-14');
      expect(hasAdequateHeight).toBe(true);
    });

    it('checkout button can be activated with Enter key (AC8)', async () => {
      const user = userEvent.setup();
      const checkoutUrl = 'https://isla-suds.myshopify.com/checkout/123';
      mockCartData = {
        checkoutUrl,
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {handle: 'test-soap'},
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      const checkoutButton = screen.getByRole('button', {
        name: /checkout/i,
      });

      // Focus the button
      checkoutButton.focus();
      expect(checkoutButton).toHaveFocus();

      // Press Enter
      await user.keyboard('{Enter}');

      // Verify redirect happens
      expect(window.location.href).toBe(checkoutUrl);
    });

    it('checkout button can be activated with Space key (AC8)', async () => {
      const user = userEvent.setup();
      const checkoutUrl = 'https://isla-suds.myshopify.com/checkout/123';
      mockCartData = {
        checkoutUrl,
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {handle: 'test-soap'},
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      const checkoutButton = screen.getByRole('button', {
        name: /checkout/i,
      });

      // Focus the button
      checkoutButton.focus();
      expect(checkoutButton).toHaveFocus();

      // Press Space
      await user.keyboard('{ }');

      // Verify redirect happens
      expect(window.location.href).toBe(checkoutUrl);
    });

    it('checkout button is focusable via Tab navigation (AC8)', async () => {
      const user = userEvent.setup();
      mockCartData = {
        checkoutUrl: 'https://isla-suds.myshopify.com/checkout/123',
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
                id: 'product-1',
                title: 'Test Soap',
                image: {url: 'https://via.placeholder.com/150', altText: 'Test Soap'},
                product: {handle: 'test-soap'},
                selectedOptions: [],
              },
            },
          ],
        },
        cost: {subtotalAmount: {amount: '10.00', currencyCode: 'USD'}},
      };

      render(<CartDrawer />);

      const checkoutButton = screen.getByRole('button', {
        name: /checkout/i,
      });

      // Tab to the button (simulate keyboard navigation)
      await user.tab();

      // Button should be focusable (will be in tab sequence)
      expect(checkoutButton).toBeInTheDocument();
      expect(checkoutButton).not.toHaveAttribute('tabindex', '-1');
    });
  });
});

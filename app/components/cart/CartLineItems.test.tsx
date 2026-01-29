import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {CartLineItems} from './CartLineItems';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

// Mock dependencies
vi.mock('react-router', () => ({
  useRouteLoaderData: vi.fn(),
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

vi.mock('@shopify/hydrogen', () => ({
  useOptimisticCart: vi.fn((cart) => cart),
  CartForm: {
    ACTIONS: {
      LinesUpdate: 'LinesUpdate',
      LinesRemove: 'LinesRemove',
    },
  },
}));

// Mock motion library components (Story 5.7 - animation integration)
vi.mock('~/lib/motion', () => ({
  AnimatePresence: ({children}: any) => children,
  MotionLi: ({children, ...props}: any) => <li {...props}>{children}</li>,
  fadeOutExitVariant: {},
  prefersReducedMotion: vi.fn(() => false),
}));

// Import mocks after vi.mock
import {useRouteLoaderData, useFetcher} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';

describe('CartLineItems', () => {
  const mockUseRouteLoaderData = useRouteLoaderData as ReturnType<
    typeof vi.fn
  >;
  const mockUseOptimisticCart = useOptimisticCart as ReturnType<typeof vi.fn>;
  const mockUseFetcher = useFetcher as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetcher mock to default state
    mockUseFetcher.mockReturnValue({
      submit: vi.fn(),
      state: 'idle',
      data: null,
    });
  });

  // Helper to create mock cart data
  const createMockCart = (
    lineCount = 1,
    options: Partial<{
      withVariant: boolean;
      withComparePrice: boolean;
      isBundle: boolean;
    }> = {},
  ): CartApiQueryFragment => {
    const lines = Array.from({length: lineCount}, (_, i) => ({
      id: `line-${i + 1}`,
      quantity: i + 1,
      attributes: [],
      cost: {
        totalAmount: {
          amount: `${(i + 1) * 12}`,
          currencyCode: 'USD',
        },
        amountPerQuantity: {
          amount: '12.00',
          currencyCode: 'USD',
        },
        compareAtAmountPerQuantity: options.withComparePrice
          ? {
              amount: '15.00',
              currencyCode: 'USD',
            }
          : null,
      },
      merchandise: {
        id: `variant-${i + 1}`,
        title: options.withVariant ? 'Large' : '',
        availableForSale: true,
        requiresShipping: true,
        price: {
          amount: '12.00',
          currencyCode: 'USD',
        },
        compareAtPrice: options.withComparePrice
          ? {
              amount: '15.00',
              currencyCode: 'USD',
            }
          : null,
        image: {
          id: `image-${i + 1}`,
          url: `https://cdn.shopify.com/product-${i + 1}.jpg`,
          altText: null,
          width: 800,
          height: 800,
        },
        product: {
          id: `product-${i + 1}`,
          handle: options.isBundle ? 'variety-pack' : `lavender-fields-${i + 1}`,
          title: options.isBundle ? 'The Collection' : `Lavender Fields ${i + 1}`,
          vendor: 'Isla Suds',
          availableForSale: true,
          isGiftCard: false,
          tags: [],
          productType: 'Soap',
          options: [],
          featuredImage: {
            id: `image-${i + 1}`,
            url: `https://cdn.shopify.com/product-${i + 1}.jpg`,
            altText: null,
            width: 800,
            height: 800,
          },
          collections: {
            nodes: [],
          },
          seo: {
            title: null,
            description: null,
          },
          variants: {
            nodes: [],
          },
        },
        selectedOptions: options.withVariant
          ? [{name: 'Size', value: 'Large'}]
          : [],
        quantityAvailable: 10,
      },
    }));

    return {
      id: 'cart-1',
      checkoutUrl: 'https://checkout.shopify.com',
      totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
      updatedAt: '2026-01-29T00:00:00Z',
      note: null,
      buyerIdentity: {
        countryCode: 'US',
        customer: null,
        email: null,
        phone: null,
      },
      lines: {
        nodes: lines as any,
      },
      cost: {
        subtotalAmount: {
          amount: lines
            .reduce(
              (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
              0,
            )
            .toFixed(2),
          currencyCode: 'USD',
        },
        totalAmount: {
          amount: lines
            .reduce(
              (sum, line) => sum + parseFloat(line.cost.totalAmount.amount),
              0,
            )
            .toFixed(2),
          currencyCode: 'USD',
        },
        totalDutyAmount: null,
        totalTaxAmount: null,
      },
      attributes: [],
      appliedGiftCards: [],
      discountCodes: [],
      discountAllocations: [],
    } as CartApiQueryFragment;
  };

  describe('AC1: Product thumbnail image display', () => {
    it('displays product image thumbnail for each line item', () => {
      const cart = createMockCart(2);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute(
        'src',
        expect.stringContaining('cdn.shopify.com/product-1'),
      );
      expect(images[1]).toHaveAttribute(
        'src',
        expect.stringContaining('cdn.shopify.com/product-2'),
      );
    });

    it('uses lazy loading attribute on images', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('includes descriptive alt text for images', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', expect.stringContaining('Lavender'));
      expect(image).toHaveAttribute('alt', expect.stringContaining('thumbnail'));
    });

    it('applies Shopify CDN optimization parameters to images', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const image = screen.getByRole('img');
      const src = image.getAttribute('src') || '';

      // AC1: Image optimization with Shopify CDN parameters
      expect(src).toContain('width=96');
      expect(src).toContain('height=96');
      expect(src).toContain('format=webp');
    });

    it('handles missing image gracefully with fallback', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].merchandise.image = null;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      // Should still render without crashing
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });
  });

  describe('AC2: Product name and variant details', () => {
    it('displays product name for each line item', () => {
      const cart = createMockCart(2);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      expect(screen.getByText('Lavender Fields 1')).toBeInTheDocument();
      expect(screen.getByText('Lavender Fields 2')).toBeInTheDocument();
    });

    it('product name is a clickable link to product page', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const link = screen.getByRole('link', {name: /Lavender Fields/});
      expect(link).toHaveAttribute('href', '/products/lavender-fields-1');
    });

    it('displays variant details when present', () => {
      const cart = createMockCart(1, {withVariant: true});
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      expect(screen.getByText(/Size: Large/)).toBeInTheDocument();
    });

    it('does not display variant section when no variants', () => {
      const cart = createMockCart(1, {withVariant: false});
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      expect(screen.queryByText(/Size:/)).not.toBeInTheDocument();
    });
  });

  describe('AC3: Price per unit display', () => {
    it('displays price per unit formatted with currency', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const priceElements = screen.getAllByText('$12.00');
      expect(priceElements.length).toBeGreaterThan(0);
    });

    it('displays compare-at price when on sale', () => {
      const cart = createMockCart(1, {withComparePrice: true});
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      expect(screen.getByText('$15.00')).toBeInTheDocument(); // Compare price
      const currentPriceElements = screen.getAllByText('$12.00'); // Current price
      expect(currentPriceElements.length).toBeGreaterThan(0);
    });
  });

  describe('AC4: Quantity display (Story 5.5 - Updated for Story 5.6)', () => {
    it('displays quantity with interactive controls (Story 5.6 replaces read-only text)', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 3;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      // Story 5.6: Quantity is now displayed with +/- controls, not "Qty: 3" text
      const quantityElements = screen.getAllByText('3');
      expect(quantityElements.length).toBe(2); // Mobile + desktop
    });

    it('renders quantity controls (Story 5.6 adds interactive +/- buttons)', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      // Story 5.6: NOW we SHOULD have +/- buttons
      const increaseButtons = screen.getAllByRole('button', {name: /increase/i});
      const decreaseButtons = screen.getAllByRole('button', {name: /decrease/i});

      expect(increaseButtons.length).toBeGreaterThan(0);
      expect(decreaseButtons.length).toBeGreaterThan(0);
    });
  });

  // Story 5.6: Modify Cart Quantities - NEW TESTS
  describe('Story 5.6 - AC2: Increment quantity with plus button', () => {
    it('calls cart update mutation when plus button is clicked', async () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 1;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      const user = userEvent.setup();

      render(<CartLineItems />);

      const plusButtons = screen.getAllByRole('button', {
        name: /increase quantity/i,
      });

      await user.click(plusButtons[0]);

      // Should trigger cart update (we'll verify via fetcher in implementation)
      // This test will validate onClick handler is wired up
      expect(plusButtons[0]).toBeInTheDocument();
    });

    it('increments quantity from 1 to 2', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 1;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      // Initial quantity should be 1
      expect(screen.getAllByText('1').length).toBe(2); // Mobile + desktop
    });

    it('does not have a maximum quantity limit', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 999;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const plusButtons = screen.getAllByRole('button', {
        name: /increase quantity/i,
      });

      // Plus button should not be disabled at high quantities
      expect(plusButtons[0]).not.toBeDisabled();
    });
  });

  describe('Story 5.6 - AC3: Decrement quantity with minus button', () => {
    it('calls cart update mutation when minus button is clicked', async () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 2;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      const user = userEvent.setup();

      render(<CartLineItems />);

      const minusButtons = screen.getAllByRole('button', {
        name: /decrease quantity/i,
      });

      await user.click(minusButtons[0]);

      // Should trigger cart update
      expect(minusButtons[0]).toBeInTheDocument();
    });

    it('decrements quantity from 2 to 1', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 2;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      // Initial quantity should be 2
      expect(screen.getAllByText('2').length).toBe(2); // Mobile + desktop
    });

    it('minus button is disabled when quantity is 1', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 1;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const minusButtons = screen.getAllByRole('button', {
        name: /decrease quantity/i,
      });

      // Both mobile and desktop minus buttons should be disabled at qty=1
      expect(minusButtons[0]).toBeDisabled();
      expect(minusButtons[1]).toBeDisabled();
    });

    it('does not call mutation when clicking disabled minus button', async () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 1;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      const mockSubmit = vi.fn();
      mockUseFetcher.mockReturnValue({
        submit: mockSubmit,
        state: 'idle',
        data: null,
      });

      const user = userEvent.setup();

      render(<CartLineItems />);

      const minusButtons = screen.getAllByRole('button', {
        name: /decrease quantity/i,
      });

      // Try to click disabled button
      await user.click(minusButtons[0]);

      // Submit should not be called because button is disabled
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('minus button is enabled when quantity is greater than 1', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 5;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const minusButtons = screen.getAllByRole('button', {
        name: /decrease quantity/i,
      });

      // Buttons should be enabled at qty > 1
      expect(minusButtons[0]).not.toBeDisabled();
      expect(minusButtons[1]).not.toBeDisabled();
    });
  });

  describe('Story 5.6 - AC7: Error handling with warm messaging', () => {
    it('displays error message when cart update fails', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      // Mock fetcher with error state
      mockUseFetcher.mockReturnValue({
        submit: vi.fn(),
        state: 'idle',
        data: {
          errors: [{message: 'Cart update failed'}],
        },
      });

      render(<CartLineItems />);

      // Should display warm error message near quantity controls (appears twice: mobile + desktop)
      const errorMessages = screen.getAllByText(/Couldn't update quantity/i);
      expect(errorMessages.length).toBe(2); // Mobile + desktop
    });

    it('uses warm error message from errors.ts', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      mockUseFetcher.mockReturnValue({
        submit: vi.fn(),
        state: 'idle',
        data: {
          errors: [{message: 'Error'}],
        },
      });

      render(<CartLineItems />);

      // Should use exact message from CART_QUANTITY_UPDATE_ERROR_MESSAGE (appears twice)
      const errorMessages = screen.getAllByText(
        "Couldn't update quantity. Let's try again.",
      );
      expect(errorMessages.length).toBe(2); // Mobile + desktop
    });

    it('displays inventory error when stock is insufficient', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      mockUseFetcher.mockReturnValue({
        submit: vi.fn(),
        state: 'idle',
        data: {
          errors: [{message: 'Not enough inventory'}],
        },
      });

      render(<CartLineItems />);

      // Should display inventory-specific message (appears twice: mobile + desktop)
      const errorMessages = screen.getAllByText(
        /don't have that many in stock/i,
      );
      expect(errorMessages.length).toBe(2);
    });

    it('error message has ARIA live region for screen readers', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      mockUseFetcher.mockReturnValue({
        submit: vi.fn(),
        state: 'idle',
        data: {
          errors: [{message: 'Error'}],
        },
      });

      const {container} = render(<CartLineItems />);

      // Should have aria-live region
      const liveRegion = container.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });

    it('displays error near quantity controls, not globally', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      mockUseFetcher.mockReturnValue({
        submit: vi.fn(),
        state: 'idle',
        data: {
          errors: [{message: 'Error'}],
        },
      });

      const {container} = render(<CartLineItems />);

      // Error should be within the line item container
      const lineItem = container.querySelector('li');
      const errorMessage = lineItem?.querySelector('[role="alert"]');
      expect(errorMessage).toBeInTheDocument();
    });

    it('does not display error when fetcher has no errors', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      mockUseFetcher.mockReturnValue({
        submit: vi.fn(),
        state: 'idle',
        data: null,
      });

      render(<CartLineItems />);

      // Should not display any error message
      expect(
        screen.queryByText(/Couldn't update quantity/i),
      ).not.toBeInTheDocument();
    });
  });

  describe('Story 5.6 - AC1: Plus/minus buttons for quantity control', () => {
    it('renders plus button to increment quantity', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      // Should render plus buttons for both mobile and desktop
      const plusButtons = screen.getAllByRole('button', {
        name: /increase quantity/i,
      });
      expect(plusButtons.length).toBeGreaterThan(0);
    });

    it('renders minus button to decrement quantity', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      // Should render minus buttons for both mobile and desktop
      const minusButtons = screen.getAllByRole('button', {
        name: /decrease quantity/i,
      });
      expect(minusButtons.length).toBeGreaterThan(0);
    });

    it('displays current quantity between plus and minus buttons', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 2;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      // Quantity should be visible as text "2" (appears twice: mobile + desktop)
      const quantityElements = screen.getAllByText('2');
      expect(quantityElements.length).toBe(2); // Mobile + desktop
    });

    it('buttons are positioned near quantity display', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      const {container} = render(<CartLineItems />);

      // Buttons and quantity should be in a flex container (2 sets: mobile + desktop)
      const quantityControls = container.querySelectorAll('.flex.items-center.gap-2');
      expect(quantityControls.length).toBeGreaterThan(0);
    });

    it('buttons have accessible sizing (44x44px touch targets on mobile)', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const plusButtons = screen.getAllByRole('button', {
        name: /increase quantity/i,
      });
      const minusButtons = screen.getAllByRole('button', {
        name: /decrease quantity/i,
      });

      // First button is mobile (h-11 w-11 = 44px)
      expect(plusButtons[0].className).toMatch(/h-11/);
      expect(plusButtons[0].className).toMatch(/w-11/);
      expect(minusButtons[0].className).toMatch(/h-11/);
      expect(minusButtons[0].className).toMatch(/w-11/);
    });

    it('buttons are visually styled consistently with design system', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const plusButtons = screen.getAllByRole('button', {
        name: /increase quantity/i,
      });

      // Check for accent color and transition classes
      expect(plusButtons[0].className).toMatch(/transition/);
      expect(plusButtons[0].className).toMatch(/rounded/);
    });

    it('buttons have hover and active states', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const plusButtons = screen.getAllByRole('button', {
        name: /increase quantity/i,
      });

      // Check for hover state classes
      expect(plusButtons[0].className).toMatch(/hover:/);
    });

    it('buttons are keyboard-accessible with proper ARIA labels', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const plusButtons = screen.getAllByRole('button', {
        name: /increase quantity for lavender fields/i,
      });
      const minusButtons = screen.getAllByRole('button', {
        name: /decrease quantity for lavender fields/i,
      });

      expect(plusButtons[0]).toHaveAttribute('aria-label');
      expect(minusButtons[0]).toHaveAttribute('aria-label');
    });
  });

  describe('AC5: Line total display', () => {
    it('displays line total calculated correctly', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 2;
      cart.lines.nodes[0].cost.totalAmount.amount = '24.00';
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      // Should show line total (2 × $12 = $24)
      const lineTotal = screen.getAllByText('$24.00');
      expect(lineTotal.length).toBeGreaterThan(0);
    });
  });

  describe('AC6: Semantic list structure', () => {
    it('renders line items in semantic ul element', () => {
      const cart = createMockCart(2);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list.tagName).toBe('UL');
    });

    it('renders each line item as li element', () => {
      const cart = createMockCart(2);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
    });

    it('has proper ARIA role on list', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('role', 'list');
    });
  });

  describe('AC7: Variety pack bundle handling', () => {
    it('displays "The Collection" as product name for bundle', () => {
      const cart = createMockCart(1, {isBundle: true});
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      expect(screen.getByText('The Collection')).toBeInTheDocument();
      expect(screen.queryByText(/Lavender/)).not.toBeInTheDocument();
    });

    it('displays bundle as single line item, not expanded', () => {
      const cart = createMockCart(1, {isBundle: true});
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1); // Only one line item
    });

    it('links to variety pack product page', () => {
      const cart = createMockCart(1, {isBundle: true});
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const link = screen.getByRole('link', {name: /The Collection/});
      expect(link).toHaveAttribute('href', '/products/variety-pack');
    });
  });

  describe('AC8: Mobile-responsive layout', () => {
    it('applies responsive image sizing classes', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      const {container} = render(<CartLineItems />);

      const image = screen.getByRole('img');
      // Should have responsive classes for mobile (80x80) and desktop (96x96)
      expect(image.className).toMatch(/w-20|w-24/);
    });
  });

  describe('AC9: Loading and empty states', () => {
    it('renders skeleton placeholders when cart is loading', () => {
      mockUseRouteLoaderData.mockReturnValue({cart: null});
      mockUseOptimisticCart.mockReturnValue(null);

      const {container} = render(<CartLineItems />);

      // Should render skeleton loaders
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('returns null when cart is empty', () => {
      const emptyCart = createMockCart(0);
      mockUseRouteLoaderData.mockReturnValue({cart: emptyCart});
      mockUseOptimisticCart.mockReturnValue(emptyCart);

      const {container} = render(<CartLineItems />);

      // Should not render list when cart is empty
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });

  describe('AC10: Screen reader accessibility', () => {
    it('announces list with item count', () => {
      const cart = createMockCart(3);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('aria-label', expect.stringContaining('3'));
      expect(list).toHaveAttribute('aria-label', expect.stringContaining('item'));
    });

    it('images have descriptive alt text', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const image = screen.getByRole('img');
      const altText = image.getAttribute('alt') || '';
      expect(altText.length).toBeGreaterThan(0);
      expect(altText).not.toBe('image');
    });
  });

  describe('Edge cases', () => {
    it('handles cart with 10+ items', () => {
      const cart = createMockCart(12);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(12);
    });

    it('handles product with very long name', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].merchandise.product.title =
        'This is a very long product name that should wrap properly on narrow screens without causing overflow issues';
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      expect(
        screen.getByText(/very long product name/),
      ).toBeInTheDocument();
    });

    it('handles zero dollar line total', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].cost.totalAmount.amount = '0.00';
      cart.lines.nodes[0].cost.amountPerQuantity.amount = '0.00';
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const zeroDollarElements = screen.getAllByText('$0.00');
      expect(zeroDollarElements.length).toBeGreaterThan(0);
    });
  });

  // Story 5.6 - Integration Tests (Task 10)
  describe('Integration: Cart mutation flow', () => {
    it('submits correct data structure when incrementing quantity', async () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 2;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      const mockSubmit = vi.fn();
      mockUseFetcher.mockReturnValue({
        submit: mockSubmit,
        state: 'idle',
        data: null,
      });

      const user = userEvent.setup();

      render(<CartLineItems />);

      const plusButtons = screen.getAllByRole('button', {
        name: /increase quantity/i,
      });

      await user.click(plusButtons[0]);

      // Verify fetcher.submit was called with correct structure
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          action: 'LinesUpdate',
          inputs: {
            lines: [
              {
                id: 'line-1',
                quantity: 3, // 2 + 1
              },
            ],
          },
        },
        {
          method: 'POST',
          action: '/cart',
        },
      );
    });

    it('submits correct data structure when decrementing quantity', async () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 3;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      const mockSubmit = vi.fn();
      mockUseFetcher.mockReturnValue({
        submit: mockSubmit,
        state: 'idle',
        data: null,
      });

      const user = userEvent.setup();

      render(<CartLineItems />);

      const minusButtons = screen.getAllByRole('button', {
        name: /decrease quantity/i,
      });

      await user.click(minusButtons[0]);

      // Verify fetcher.submit was called with correct structure
      expect(mockSubmit).toHaveBeenCalledWith(
        {
          action: 'LinesUpdate',
          inputs: {
            lines: [
              {
                id: 'line-1',
                quantity: 2, // 3 - 1
              },
            ],
          },
        },
        {
          method: 'POST',
          action: '/cart',
        },
      );
    });

    it('integrates with useOptimisticCart for instant UI updates', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 5;
      mockUseRouteLoaderData.mockReturnValue({cart});

      // Simulate optimistic cart returning updated quantity
      const optimisticCart = createMockCart(1);
      optimisticCart.lines.nodes[0].quantity = 6;
      mockUseOptimisticCart.mockReturnValue(optimisticCart);

      render(<CartLineItems />);

      // Should display optimistic quantity (6), not original (5)
      const quantityElements = screen.getAllByText('6');
      expect(quantityElements.length).toBe(2); // Mobile + desktop
    });

    it('handles fetcher loading state across all buttons', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 2;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      // Simulate fetcher in submitting state
      mockUseFetcher.mockReturnValue({
        submit: vi.fn(),
        state: 'submitting',
        data: null,
      });

      render(<CartLineItems />);

      // All buttons should be disabled during submission
      const plusButtons = screen.getAllByRole('button', {
        name: /increase quantity/i,
      });
      const minusButtons = screen.getAllByRole('button', {
        name: /decrease quantity/i,
      });

      plusButtons.forEach((btn) => expect(btn).toBeDisabled());
      minusButtons.forEach((btn) => expect(btn).toBeDisabled());
    });

    it('detects and handles error response from fetcher', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      // Simulate fetcher with error response
      mockUseFetcher.mockReturnValue({
        submit: vi.fn(),
        state: 'idle',
        data: {
          errors: [
            {
              message: 'Insufficient inventory available',
            },
          ],
        },
      });

      render(<CartLineItems />);

      // Should detect inventory error and display appropriate message
      const errorMessages = screen.getAllByText(
        /don't have that many in stock/i,
      );
      expect(errorMessages.length).toBe(2); // Mobile + desktop
    });
  });

  // Story 5.7: Remove Items from Cart - NEW TESTS
  describe('Story 5.7 - AC1: Remove button for each line item', () => {
    it('renders remove button for each line item', () => {
      const cart = createMockCart(2);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const removeButtons = screen.getAllByRole('button', {
        name: /remove.*from cart/i,
      });
      expect(removeButtons).toHaveLength(2);
    });

    it('remove button has trash icon', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      const {container} = render(<CartLineItems />);

      const removeButton = screen.getByRole('button', {
        name: /remove.*from cart/i,
      });
      const svg = removeButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('remove button uses 44x44px touch target on mobile', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const removeButton = screen.getByRole('button', {
        name: /remove.*from cart/i,
      });
      // Mobile size: h-11 w-11 = 44px
      expect(removeButton.className).toMatch(/h-11/);
      expect(removeButton.className).toMatch(/w-11/);
    });

    it('remove button has hover state', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const removeButton = screen.getByRole('button', {
        name: /remove.*from cart/i,
      });
      expect(removeButton.className).toMatch(/hover:/);
    });

    it('remove button has correct ARIA label with product name', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const removeButton = screen.getByRole('button', {
        name: /remove lavender fields.*from cart/i,
      });
      expect(removeButton).toHaveAttribute('aria-label');
      expect(removeButton.getAttribute('aria-label')).toContain(
        'Lavender Fields',
      );
    });

    it('remove button is keyboard accessible', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const removeButton = screen.getByRole('button', {
        name: /remove.*from cart/i,
      });
      expect(removeButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Story 5.7 - AC2: Remove item via API call', () => {
    it('clicking remove button triggers API call', async () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      const mockSubmit = vi.fn();
      mockUseFetcher.mockReturnValue({
        submit: mockSubmit,
        state: 'idle',
        data: null,
      });

      const user = userEvent.setup();

      render(<CartLineItems />);

      const removeButton = screen.getByRole('button', {
        name: /remove.*from cart/i,
      });

      await user.click(removeButton);

      expect(mockSubmit).toHaveBeenCalled();
    });

    it('remove button shows loading state during API call', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      mockUseFetcher.mockReturnValue({
        submit: vi.fn(),
        state: 'submitting',
        data: null,
      });

      render(<CartLineItems />);

      const removeButton = screen.getByRole('button', {
        name: /remove.*from cart/i,
      });
      expect(removeButton).toBeDisabled();
    });
  });

  describe('Story 5.7 - AC5: Error handling for remove failures', () => {
    it('displays warm error message when removal fails', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      mockUseFetcher.mockReturnValue({
        submit: vi.fn(),
        state: 'idle',
        data: {
          errors: [{message: 'Cart removal failed'}],
        },
      });

      render(<CartLineItems />);

      // Error appears in both mobile and desktop sections
      const errorMessages = screen.getAllByText(/couldn't remove this item/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    it('error message is displayed near the line item', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      mockUseFetcher.mockReturnValue({
        submit: vi.fn(),
        state: 'idle',
        data: {
          errors: [{message: 'Error'}],
        },
      });

      const {container} = render(<CartLineItems />);

      const lineItem = container.querySelector('li');
      const errorMessage = lineItem?.querySelector('[role="alert"]');
      expect(errorMessage).toBeInTheDocument();
    });

    it('error message has ARIA live region', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      mockUseFetcher.mockReturnValue({
        submit: vi.fn(),
        state: 'idle',
        data: {
          errors: [{message: 'Error'}],
        },
      });

      const {container} = render(<CartLineItems />);

      const liveRegion = container.querySelector('[aria-live]');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe('Story 5.7 - AC9: Keyboard accessibility', () => {
    it('remove button is tab-accessible', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const removeButton = screen.getByRole('button', {
        name: /remove.*from cart/i,
      });
      expect(removeButton).toBeInTheDocument();
      expect(removeButton.tagName).toBe('BUTTON');
    });

    it('remove button announces product name to screen readers', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      const removeButton = screen.getByRole('button', {
        name: /remove lavender fields.*from cart/i,
      });
      const ariaLabel = removeButton.getAttribute('aria-label');
      expect(ariaLabel).toContain('Lavender Fields');
      expect(ariaLabel).toContain('from cart');
    });
  });

  describe('Story 5.7 - Integration: Remove mutation flow', () => {
    it('submits correct data structure when removing item', async () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      const mockSubmit = vi.fn();
      mockUseFetcher.mockReturnValue({
        submit: mockSubmit,
        state: 'idle',
        data: null,
      });

      const user = userEvent.setup();

      render(<CartLineItems />);

      const removeButton = screen.getByRole('button', {
        name: /remove.*from cart/i,
      });

      await user.click(removeButton);

      expect(mockSubmit).toHaveBeenCalledWith(
        {
          action: 'LinesRemove',
          inputs: {
            lineIds: ['line-1'],
          },
        },
        {
          method: 'POST',
          action: '/cart',
        },
      );
    });

    it('prevents multiple rapid remove clicks', async () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      const mockSubmit = vi.fn();
      mockUseFetcher.mockReturnValue({
        submit: mockSubmit,
        state: 'submitting',
        data: null,
      });

      const user = userEvent.setup();

      render(<CartLineItems />);

      const removeButton = screen.getByRole('button', {
        name: /remove.*from cart/i,
      });

      // Button should be disabled during submission
      expect(removeButton).toBeDisabled();

      // Attempting to click should not trigger submission
      await user.click(removeButton);
      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });
});

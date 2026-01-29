import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import {CartLineItems} from './CartLineItems';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

// Mock dependencies
vi.mock('react-router', () => ({
  useRouteLoaderData: vi.fn(),
  Link: ({to, children, ...props}: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@shopify/hydrogen', () => ({
  useOptimisticCart: vi.fn((cart) => cart),
}));

// Import mocks after vi.mock
import {useRouteLoaderData} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';

describe('CartLineItems', () => {
  const mockUseRouteLoaderData = useRouteLoaderData as ReturnType<
    typeof vi.fn
  >;
  const mockUseOptimisticCart = useOptimisticCart as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
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

  describe('AC4: Quantity display', () => {
    it('displays quantity as read-only text', () => {
      const cart = createMockCart(1);
      cart.lines.nodes[0].quantity = 3;
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      // Should have quantity text (appears twice: mobile + desktop)
      const qtyElements = screen.getAllByText(/Qty: 3/);
      expect(qtyElements.length).toBeGreaterThan(0);
    });

    it('does not render quantity input controls', () => {
      const cart = createMockCart(1);
      mockUseRouteLoaderData.mockReturnValue({cart});
      mockUseOptimisticCart.mockReturnValue(cart);

      render(<CartLineItems />);

      // Should not have +/- buttons or input fields
      expect(
        screen.queryByRole('button', {name: /increase/i}),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', {name: /decrease/i}),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
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
});

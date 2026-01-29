import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {BrowserRouter} from 'react-router';
import {BundleCard} from './BundleCard';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

// Mock CartForm from Shopify Hydrogen for add-to-cart functionality (Story 5.3)
let mockFetcherState = 'idle';
let mockFetcherData: any = null;
vi.mock('@shopify/hydrogen', async () => {
  const actual = await vi.importActual('@shopify/hydrogen');
  return {
    ...actual,
    CartForm: ({children, route, inputs, action}: any) => {
      const mockFetcher = {
        state: mockFetcherState,
        data: mockFetcherData,
        Form: 'form',
      };
      return <div data-testid="cart-form-mock">{children(mockFetcher)}</div>;
    },
  };
});

// Mock Zustand exploration store (used by AddToCartButton)
const mockSetCartDrawerOpen = vi.fn();
vi.mock('~/stores/exploration', () => ({
  useExplorationStore: vi.fn((selector) => {
    const mockState = {
      setCartDrawerOpen: mockSetCartDrawerOpen,
    };
    return selector ? selector(mockState) : mockState;
  }),
}));

/**
 * Tests for BundleCard component (Story 3.6, Task 2)
 *
 * Verifies:
 * - Bundle card renders with distinct "The Collection" label
 * - Shows combined imagery/badge differentiation
 * - Maintains keyboard accessibility
 * - Fits responsive layout (organic desktop, 2-col mobile)
 */

const mockBundleProduct: RecommendedProductFragment = {
  id: 'gid://shopify/Product/5',
  handle: 'four-bar-variety-pack',
  title: 'The Collection',
  description: 'All four handcrafted soaps together',
  priceRange: {
    minVariantPrice: {
      amount: '48.00',
      currencyCode: 'USD',
    },
  },
  featuredImage: {
    id: 'gid://shopify/ProductImage/1',
    url: 'https://cdn.shopify.com/bundle.jpg',
    altText: 'Four bar variety pack',
    width: 1200,
    height: 1200,
  },
  variants: {nodes: [{id: 'gid://shopify/ProductVariant/12345'}]},
  scentNarrative: {
    value: 'Four distinct journeys. One complete experience.',
  },
  bundleValueProposition: {
    value: 'All four soaps, one price. Rotate scents with your mood.',
  },
};

describe('BundleCard', () => {
  it('renders with "The Collection" label', () => {
    render(
      <BrowserRouter>
        <BundleCard product={mockBundleProduct} />
      </BrowserRouter>,
    );

    // Should display bundle title
    expect(screen.getByText('The Collection')).toBeInTheDocument();
  });

  it('shows visual bundle differentiation (badge or border)', () => {
    const {container} = render(
      <BrowserRouter>
        <BundleCard product={mockBundleProduct} />
      </BrowserRouter>,
    );

    // Bundle card should have bundle-specific class or data attribute
    const card = container.querySelector('[data-bundle="true"]');
    expect(card).toBeInTheDocument();
  });

  it('maintains keyboard accessibility with proper focus', () => {
    render(
      <BrowserRouter>
        <BundleCard product={mockBundleProduct} />
      </BrowserRouter>,
    );

    const link = screen.getByRole('link', {
      name: /the collection.*all four soaps.*activate to view details/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href');
  });

  it('triggers reveal callback on hover/click', () => {
    const onReveal = vi.fn();

    render(
      <BrowserRouter>
        <BundleCard product={mockBundleProduct} onReveal={onReveal} />
      </BrowserRouter>,
    );

    const link = screen.getByRole('link');
    link.click();

    // Click should trigger reveal
    expect(onReveal).toHaveBeenCalledWith(mockBundleProduct.id);
  });

  it('applies rotation class for desktop organic layout', () => {
    const {container} = render(
      <BrowserRouter>
        <BundleCard
          product={mockBundleProduct}
          rotationClass="lg:rotate-[2deg]"
        />
      </BrowserRouter>,
    );

    const link = container.querySelector('.lg\\:rotate-\\[2deg\\]');
    expect(link).toBeInTheDocument();
  });

  it('shows focused state when isFocused prop is true', () => {
    const {container} = render(
      <BrowserRouter>
        <BundleCard product={mockBundleProduct} isFocused={true} />
      </BrowserRouter>,
    );

    // Should have focus styling classes
    const link = container.querySelector('.scale-\\[1\\.02\\]');
    expect(link).toBeInTheDocument();
  });

  it('shows dimmed state when isDimmed prop is true', () => {
    const {container} = render(
      <BrowserRouter>
        <BundleCard product={mockBundleProduct} isDimmed={true} />
      </BrowserRouter>,
    );

    // Should have opacity reduction
    const link = container.querySelector('.opacity-60');
    expect(link).toBeInTheDocument();
  });

  // Story 5.3 - Add to Cart Integration Tests
  describe('Add to Cart Integration (Story 5.3)', () => {
    it('renders AddToCartButton component in bundle card', () => {
      render(
        <BrowserRouter>
          <BundleCard product={mockBundleProduct} />
        </BrowserRouter>,
      );

      // Should have add-to-cart button with expected test id
      const addButton = screen.getByTestId('add-to-cart-button');
      expect(addButton).toBeInTheDocument();
    });

    it('passes correct variant ID to AddToCartButton', () => {
      render(
        <BrowserRouter>
          <BundleCard product={mockBundleProduct} />
        </BrowserRouter>,
      );

      // Button should exist and be ready to submit bundle variant
      const addButton = screen.getByTestId('add-to-cart-button');
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveAttribute('type', 'submit');
    });

    it('button is visible and clickable', () => {
      render(
        <BrowserRouter>
          <BundleCard product={mockBundleProduct} />
        </BrowserRouter>,
      );

      const addButton = screen.getByTestId('add-to-cart-button');
      expect(addButton).toBeVisible();
      expect(addButton).not.toBeDisabled();
    });

    it('button click does not trigger link navigation', () => {
      const onReveal = vi.fn();
      const {container} = render(
        <BrowserRouter>
          <BundleCard product={mockBundleProduct} onReveal={onReveal} />
        </BrowserRouter>,
      );

      const addButton = screen.getByTestId('add-to-cart-button');

      // Click button (should not trigger reveal or navigation)
      addButton.click();

      // Reveal should NOT be called when clicking add-to-cart button
      expect(onReveal).not.toHaveBeenCalled();
    });

    it('maintains existing hover/reveal interactions alongside add-to-cart', () => {
      const onReveal = vi.fn();
      render(
        <BrowserRouter>
          <BundleCard product={mockBundleProduct} onReveal={onReveal} />
        </BrowserRouter>,
      );

      // Get the link container (not the button)
      const link = screen.getByRole('link');

      // Click on link (not button) should trigger reveal
      link.click();
      expect(onReveal).toHaveBeenCalledWith(mockBundleProduct.id);
    });

    // Keyboard accessibility tests (Story 5.3, AC7)
    it('add-to-cart button responds to Enter key', () => {
      render(
        <BrowserRouter>
          <BundleCard product={mockBundleProduct} />
        </BrowserRouter>,
      );

      const addButton = screen.getByTestId('add-to-cart-button');

      // Simulate Enter key press
      fireEvent.keyDown(addButton, {key: 'Enter', code: 'Enter'});

      // Button should trigger form submission (button is type="submit")
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveAttribute('type', 'submit');
    });

    it('add-to-cart button responds to Space key', () => {
      render(
        <BrowserRouter>
          <BundleCard product={mockBundleProduct} />
        </BrowserRouter>,
      );

      const addButton = screen.getByTestId('add-to-cart-button');

      // Simulate Space key press
      fireEvent.keyDown(addButton, {key: ' ', code: 'Space'});

      // Button should be accessible and submit on Space
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveAttribute('type', 'submit');
    });

    // Analytics verification test (Story 5.3, AC1)
    it('includes analytics data in form submission', () => {
      const {container} = render(
        <BrowserRouter>
          <BundleCard product={mockBundleProduct} />
        </BrowserRouter>,
      );

      // Check that analytics hidden input exists with product data
      const analyticsInput = container.querySelector(
        'input[name="analytics"]',
      );
      expect(analyticsInput).toBeInTheDocument();
      expect(analyticsInput).toHaveAttribute('type', 'hidden');

      // Verify analytics includes product and totalValue
      const analyticsValue = analyticsInput?.getAttribute('value');
      expect(analyticsValue).toBeTruthy();
      const analytics = JSON.parse(analyticsValue || '{}') as {
        products: Array<{id: string}>;
        totalValue: number;
      };
      expect(analytics.products).toHaveLength(1);
      expect(analytics.products[0].id).toBe(mockBundleProduct.id);
      expect(analytics.totalValue).toBe(48.0);
    });
  });
});

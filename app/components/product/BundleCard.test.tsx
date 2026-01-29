import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router';
import {BundleCard} from './BundleCard';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

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
});

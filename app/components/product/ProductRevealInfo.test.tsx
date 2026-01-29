import {describe, it, expect} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {BUNDLE_HANDLE} from '~/content/products';
import {ProductRevealInfo} from './ProductRevealInfo';
import type {
  MoneyFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';

describe('ProductRevealInfo', () => {
  const mockProduct: RecommendedProductFragment = {
    id: 'gid://shopify/Product/123',
    title: 'Lavender Dreams Soap',
    handle: 'lavender-dreams',
    description: 'A soothing lavender soap with calming properties.',
    priceRange: {
      minVariantPrice: {
        amount: '12.00',
        currencyCode: 'USD',
      },
    },
    featuredImage: {
      id: 'gid://shopify/ProductImage/456',
      url: 'https://example.com/image.jpg',
      altText: 'Lavender soap',
      width: 800,
      height: 800,
    },
    scentNarrative: {
      value: 'Lavender fields in Provence',
    },
  };

  it('renders product name with fluid-heading typography', () => {
    render(<ProductRevealInfo product={mockProduct} />);

    const heading = screen.getByText('Lavender Dreams Soap');
    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain('text-fluid-heading');
  });

  it('renders formatted price with currency symbol', () => {
    render(<ProductRevealInfo product={mockProduct} />);

    const price = screen.getByText('$12.00');
    expect(price).toBeInTheDocument();
  });

  it('renders product description', () => {
    render(<ProductRevealInfo product={mockProduct} />);

    const description = screen.getByText(/soothing lavender soap/i);
    expect(description).toBeInTheDocument();
  });

  it('does not throw or trigger side effects when Add to Cart is clicked', () => {
    render(<ProductRevealInfo product={mockProduct} />);

    const button = screen.getByRole('button', {
      name: /add lavender dreams soap to cart/i,
    });

    // Clicking the placeholder button must be a safe no-op until Epic 5
    expect(() => {
      fireEvent.click(button);
    }).not.toThrow();
  });

  it('renders Add to Cart button with accessible label', () => {
    render(<ProductRevealInfo product={mockProduct} />);

    const button = screen.getByRole('button', {
      name: /add lavender dreams soap to cart/i,
    });
    expect(button).toBeInTheDocument();
  });

  it('Add to Cart button has focus ring styling', () => {
    render(<ProductRevealInfo product={mockProduct} />);

    const button = screen.getByRole('button', {
      name: /add.*to cart/i,
    });
    expect(button.className).toContain('focus-visible:ring');
  });

  it('Add to Cart button is keyboard focusable', () => {
    render(<ProductRevealInfo product={mockProduct} />);

    const button = screen.getByRole('button', {
      name: /add.*to cart/i,
    });
    expect(button).not.toHaveAttribute('disabled');
    expect(button.tabIndex).toBe(0);
  });

  it('truncates long description to 1-2 sentences', () => {
    const longDescProduct = {
      ...mockProduct,
      description:
        'This is a very long description. It has multiple sentences. This is the third sentence. And a fourth one. Even a fifth sentence here.',
    };

    render(<ProductRevealInfo product={longDescProduct} />);

    const description = screen.getByText(/very long description/i);
    // Should not contain the fifth sentence
    expect(description.textContent).not.toContain('fifth sentence');
  });

  it('handles missing description with fallback', () => {
    const noDescProduct = {
      ...mockProduct,
      description: '',
    };

    render(<ProductRevealInfo product={noDescProduct} />);

    // Component should still render without crashing
    expect(screen.getByText('Lavender Dreams Soap')).toBeInTheDocument();
    expect(screen.getByText('$12.00')).toBeInTheDocument();
  });

  it('renders product info in the expected visual/read order', () => {
    const {container} = render(<ProductRevealInfo product={mockProduct} />);

    const heading = screen.getByText('Lavender Dreams Soap');
    const price = screen.getByText('$12.00');
    const description = screen.getByText(/soothing lavender soap/i);
    const button = screen.getByRole('button', {
      name: /add lavender dreams soap to cart/i,
    });

    const headingIndex = Array.from(container.querySelectorAll('*')).indexOf(
      heading,
    );
    const priceIndex = Array.from(container.querySelectorAll('*')).indexOf(
      price,
    );
    const descriptionIndex = Array.from(
      container.querySelectorAll('*'),
    ).indexOf(description);
    const buttonIndex = Array.from(container.querySelectorAll('*')).indexOf(
      button,
    );

    expect(headingIndex).toBeLessThan(priceIndex);
    expect(priceIndex).toBeLessThan(descriptionIndex);
    expect(descriptionIndex).toBeLessThan(buttonIndex);
  });

  it('formats price with different currencies', () => {
    const eurProduct: RecommendedProductFragment = {
      ...mockProduct,
      priceRange: {
        minVariantPrice: {
          amount: '10.50',
          currencyCode: 'EUR' as const,
        },
      },
    };

    render(<ProductRevealInfo product={eurProduct} />);

    // Should show Euro symbol or EUR
    const price = screen.getByText(/€10\.50|10\.50/);
    expect(price).toBeInTheDocument();
  });

  it('prefers variantPrice over product priceRange when provided', () => {
    const variantPrice: MoneyFragment = {
      amount: '15.00',
      currencyCode: 'USD',
    };

    render(
      <ProductRevealInfo product={mockProduct} variantPrice={variantPrice} />,
    );

    // Should show variant price instead of product minVariantPrice
    expect(screen.getByText('$15.00')).toBeInTheDocument();
  });

  it('displays bundle value proposition for variety pack (Story 3.6)', () => {
    const bundleProduct: RecommendedProductFragment = {
      ...mockProduct,
      id: 'gid://shopify/Product/5',
      title: 'The Collection',
      handle: BUNDLE_HANDLE,
      description: 'All four handcrafted soaps together.',
      priceRange: {
        minVariantPrice: {
          amount: '48.00',
          currencyCode: 'USD',
        },
      },
      bundleValueProposition: {
        value: 'All four soaps, one price. Rotate scents with your mood.',
      },
    };

    render(<ProductRevealInfo product={bundleProduct} />);

    expect(screen.getByText('The Collection')).toBeInTheDocument();
    expect(
      screen.getByText(
        'All four soaps, one price. Rotate scents with your mood.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('$48.00')).toBeInTheDocument();
  });
});

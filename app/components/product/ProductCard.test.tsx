import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ProductCard} from './ProductCard';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

// Mock Hydrogen Image component
vi.mock('@shopify/hydrogen', () => ({
  Image: ({alt}: {alt: string}) => <img alt={alt} />,
}));

// Mock useVariantUrl hook
vi.mock('~/lib/variant-url', () => ({
  useVariantUrl: (handle: string) => `/products/${handle}`,
}));

// Mock React Router
vi.mock('react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ({
    pathname: '/products/test',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  }),
}));

const mockProduct: RecommendedProductFragment = {
  id: 'gid://shopify/Product/1',
  title: 'Lavender Bliss',
  handle: 'lavender-bliss',
  priceRange: {
    minVariantPrice: {
      amount: '12.00',
      currencyCode: 'USD',
    },
  },
  featuredImage: {
    id: 'gid://shopify/ProductImage/1',
    url: 'https://cdn.shopify.com/lavender.jpg',
    altText: 'Lavender soap',
    width: 800,
    height: 800,
  },
};

describe('ProductCard', () => {
  it('renders product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Lavender soap');
  });

  it('renders product title', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Lavender Bliss')).toBeInTheDocument();
  });

  it('renders as a focusable link', () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('lavender-bliss'));
  });

  it('uses empty alt when product has no featuredImage altText', () => {
    const productNoAlt = {
      ...mockProduct,
      featuredImage: {
        ...mockProduct.featuredImage!,
        altText: null,
      },
    };

    render(<ProductCard product={productNoAlt} />);

    // When alt is empty string, image is "presentation" role (decorative)
    const img = screen.getByAltText('');
    expect(img).toBeInTheDocument();
  });

  it('renders placeholder block when featuredImage is null (reserves space, avoids CLS)', () => {
    const productNoImage = {
      ...mockProduct,
      featuredImage: null,
    };

    const {container} = render(<ProductCard product={productNoImage} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Lavender Bliss')).toBeInTheDocument();
    const placeholder = container.querySelector('.aspect-square');
    expect(placeholder).toBeInTheDocument();
  });

  it('applies rotationClass when provided (full string so Tailwind emits CSS)', () => {
    const {container} = render(
      <ProductCard product={mockProduct} rotationClass="lg:rotate-[3deg]" />,
    );

    const card = container.querySelector('a');
    expect(card?.className).toContain('lg:rotate-[3deg]');
  });

  it('uses lg-prefixed rotation class so rotation applies only on desktop', () => {
    const {container} = render(
      <ProductCard product={mockProduct} rotationClass="lg:rotate-[-2deg]" />,
    );

    const card = container.querySelector('a');
    expect(card?.className).toContain('lg:rotate-[-2deg]');
    const classes = card?.className.split(/\s+/) || [];
    const hasStandaloneRotation = classes.some(
      (cls) => cls.startsWith('rotate-') && !cls.startsWith('lg:'),
    );
    expect(hasStandaloneRotation).toBe(false);
  });

  it('uses focus-visible for keyboard focus styling', () => {
    const {container} = render(<ProductCard product={mockProduct} />);

    const card = container.querySelector('a');
    expect(card?.className).toContain('focus-visible:ring');
  });
});

import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
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
  description: 'Soothing lavender soap',
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
variants: {nodes: [{id: 'gid://shopify/ProductVariant/12345'}]},
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
    variants: {nodes: [{id: 'gid://shopify/ProductVariant/12345'}]},
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

  // Story 3.2: Texture reveal interaction tests
  describe('texture reveal interaction', () => {
    it('calls onReveal callback on mouse enter (desktop hover)', () => {
      const onReveal = vi.fn();
      render(<ProductCard product={mockProduct} onReveal={onReveal} />);

      const card = screen.getByRole('link');
      fireEvent.mouseEnter(card);

      expect(onReveal).toHaveBeenCalledWith(mockProduct.id);
    });

    it('calls onReveal callback on click (mobile tap)', () => {
      const onReveal = vi.fn();
      const {container} = render(
        <ProductCard product={mockProduct} onReveal={onReveal} />,
      );

      const card = container.querySelector('a');
      card?.click();

      expect(onReveal).toHaveBeenCalledWith(mockProduct.id);
    });

    it('calls onReveal callback on keyboard Enter', () => {
      const onReveal = vi.fn();
      const {container} = render(
        <ProductCard product={mockProduct} onReveal={onReveal} />,
      );

      const card = container.querySelector('a');
      card?.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}),
      );

      expect(onReveal).toHaveBeenCalledWith(mockProduct.id);
    });

    it('calls onReveal callback on keyboard Space', () => {
      const onReveal = vi.fn();
      const {container} = render(
        <ProductCard product={mockProduct} onReveal={onReveal} />,
      );

      const card = container.querySelector('a');
      card?.dispatchEvent(
        new KeyboardEvent('keydown', {key: ' ', bubbles: true}),
      );

      expect(onReveal).toHaveBeenCalledWith(mockProduct.id);
    });

    it('does not call onReveal if callback not provided', () => {
      const {container} = render(<ProductCard product={mockProduct} />);

      const card = container.querySelector('a');
      // Should not throw when onReveal is undefined
      expect(() => {
        card?.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
        card?.click();
      }).not.toThrow();
    });
  });
});

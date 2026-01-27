import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ConstellationGrid} from './ConstellationGrid';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

// Mock Hydrogen Image component
vi.mock('@shopify/hydrogen', () => ({
  Image: ({
    alt,
    'data-testid': testId,
  }: {
    alt: string;
    'data-testid'?: string;
  }) => <img alt={alt} data-testid={testId} />,
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

const mockProducts: RecommendedProductFragment[] = [
  {
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
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Citrus Sunrise',
    handle: 'citrus-sunrise',
    priceRange: {
      minVariantPrice: {
        amount: '12.00',
        currencyCode: 'USD',
      },
    },
    featuredImage: {
      id: 'gid://shopify/ProductImage/2',
      url: 'https://cdn.shopify.com/citrus.jpg',
      altText: 'Citrus soap',
      width: 800,
      height: 800,
    },
  },
  {
    id: 'gid://shopify/Product/3',
    title: 'Mint Meadow',
    handle: 'mint-meadow',
    priceRange: {
      minVariantPrice: {
        amount: '12.00',
        currencyCode: 'USD',
      },
    },
    featuredImage: {
      id: 'gid://shopify/ProductImage/3',
      url: 'https://cdn.shopify.com/mint.jpg',
      altText: 'Mint soap',
      width: 800,
      height: 800,
    },
  },
  {
    id: 'gid://shopify/Product/4',
    title: 'Rose Garden',
    handle: 'rose-garden',
    priceRange: {
      minVariantPrice: {
        amount: '12.00',
        currencyCode: 'USD',
      },
    },
    featuredImage: {
      id: 'gid://shopify/ProductImage/4',
      url: 'https://cdn.shopify.com/rose.jpg',
      altText: 'Rose soap',
      width: 800,
      height: 800,
    },
  },
];

describe('ConstellationGrid', () => {
  it('renders all 4 product cards', () => {
    render(<ConstellationGrid products={mockProducts} />);

    expect(screen.getByText('Lavender Bliss')).toBeInTheDocument();
    expect(screen.getByText('Citrus Sunrise')).toBeInTheDocument();
    expect(screen.getByText('Mint Meadow')).toBeInTheDocument();
    expect(screen.getByText('Rose Garden')).toBeInTheDocument();
  });

  it('applies snap-start class when className includes it', () => {
    const {container} = render(
      <ConstellationGrid products={mockProducts} className="snap-start" />,
    );

    const section = container.querySelector('section');
    expect(section?.className).toContain('snap-start');
  });

  it('renders as a section element with constellation role', () => {
    const {container} = render(<ConstellationGrid products={mockProducts} />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section?.getAttribute('aria-label')).toBe(
      'Product constellation grid',
    );
  });

  it('all product cards are keyboard focusable', () => {
    render(<ConstellationGrid products={mockProducts} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);

    links.forEach((link) => {
      expect(link).toHaveAttribute('href');
      // Links are naturally focusable, no explicit tabIndex needed
    });
  });

  it('product cards have meaningful accessible names', () => {
    render(<ConstellationGrid products={mockProducts} />);

    // Each card link should have accessible text content
    expect(screen.getByRole('link', {name: /lavender bliss/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /citrus sunrise/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /mint meadow/i})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: /rose garden/i})).toBeInTheDocument();
  });

  it('renders null when no products provided', () => {
    const {container} = render(<ConstellationGrid products={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when empty products array provided', () => {
    const {container} = render(<ConstellationGrid products={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

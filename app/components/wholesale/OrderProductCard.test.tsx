import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {OrderProductCard} from './OrderProductCard';

// Mock Hydrogen components
vi.mock('@shopify/hydrogen', () => ({
  Image: ({data, className}: {data: {url: string; altText?: string | null}; className?: string}) => (
    <img src={data.url} alt={data.altText ?? ''} className={className} />
  ),
  Money: ({data}: {data: {amount: string; currencyCode: string}}) => (
    <span>{data.currencyCode} {data.amount}</span>
  ),
}));

const mockProduct = {
  id: 'gid://shopify/Product/1',
  title: 'Lavender Bar Soap',
  handle: 'lavender-bar-soap',
  featuredImage: {
    url: 'https://cdn.shopify.com/lavender.jpg',
    altText: 'Lavender Bar Soap',
    width: 800,
    height: 800,
  },
  variant: {
    id: 'gid://shopify/ProductVariant/1',
    availableForSale: true,
    price: {
      amount: '6.00',
      currencyCode: 'USD' as const,
    },
  },
};

describe('OrderProductCard', () => {
  it('renders the product title', () => {
    render(<OrderProductCard product={mockProduct} />);

    expect(screen.getByText('Lavender Bar Soap')).toBeInTheDocument();
  });

  it('renders the product image with correct alt text', () => {
    render(<OrderProductCard product={mockProduct} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Lavender Bar Soap');
    expect(img).toHaveAttribute('src', 'https://cdn.shopify.com/lavender.jpg');
  });

  it('renders the wholesale unit price', () => {
    render(<OrderProductCard product={mockProduct} />);

    expect(screen.getByText(/USD 6\.00/)).toBeInTheDocument();
  });

  it('renders the per unit label from wholesaleContent', () => {
    render(<OrderProductCard product={mockProduct} />);

    expect(screen.getByText(/per unit/i)).toBeInTheDocument();
  });

  it('uses empty alt when featuredImage altText is null', () => {
    const product = {
      ...mockProduct,
      featuredImage: {...mockProduct.featuredImage, altText: null},
    };
    render(<OrderProductCard product={product} />);

    expect(screen.getByAltText('')).toBeInTheDocument();
  });

  it('renders a placeholder when featuredImage is null', () => {
    const product = {...mockProduct, featuredImage: null};
    render(<OrderProductCard product={product} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Lavender Bar Soap')).toBeInTheDocument();
  });

  it('renders with aria-label matching the product title', () => {
    render(<OrderProductCard product={mockProduct} />);

    const article = screen.getByRole('article', {name: 'Lavender Bar Soap'});
    expect(article).toBeInTheDocument();
  });

  it('renders the product title as a heading', () => {
    render(<OrderProductCard product={mockProduct} />);

    const heading = screen.getByRole('heading', {name: 'Lavender Bar Soap'});
    expect(heading).toBeInTheDocument();
  });
});

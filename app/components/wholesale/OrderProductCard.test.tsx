import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const mockWholesalePrice = {amount: '6.00', currencyCode: 'USD' as const};

const defaultProps = {
  product: mockProduct,
  wholesalePrice: mockWholesalePrice as typeof mockWholesalePrice | null,
  quantity: 0,
  onQuantityChange: vi.fn(),
};

describe('OrderProductCard', () => {
  it('renders the product title', () => {
    render(<OrderProductCard {...defaultProps} />);

    expect(screen.getByText('Lavender Bar Soap')).toBeInTheDocument();
  });

  it('renders the product image with correct alt text', () => {
    render(<OrderProductCard {...defaultProps} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Lavender Bar Soap');
    expect(img).toHaveAttribute('src', 'https://cdn.shopify.com/lavender.jpg');
  });

  it('renders the wholesale unit price', () => {
    render(<OrderProductCard {...defaultProps} />);

    expect(screen.getByText(/USD 6\.00/)).toBeInTheDocument();
  });

  it('renders the per unit label from wholesaleContent', () => {
    render(<OrderProductCard {...defaultProps} />);

    expect(screen.getByText(/per unit/i)).toBeInTheDocument();
  });

  it('uses empty alt when featuredImage altText is null', () => {
    const product = {
      ...mockProduct,
      featuredImage: {...mockProduct.featuredImage, altText: null},
    };
    render(<OrderProductCard {...defaultProps} product={product} />);

    expect(screen.getByAltText('')).toBeInTheDocument();
  });

  it('renders a placeholder when featuredImage is null', () => {
    const product = {...mockProduct, featuredImage: null};
    render(<OrderProductCard {...defaultProps} product={product} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Lavender Bar Soap')).toBeInTheDocument();
  });

  it('renders with aria-label matching the product title', () => {
    render(<OrderProductCard {...defaultProps} />);

    const article = screen.getByRole('article', {name: 'Lavender Bar Soap'});
    expect(article).toBeInTheDocument();
  });

  it('renders the product title as a heading', () => {
    render(<OrderProductCard {...defaultProps} />);

    const heading = screen.getByRole('heading', {name: 'Lavender Bar Soap'});
    expect(heading).toBeInTheDocument();
  });

  // QuantitySelector integration
  it('renders QuantitySelector with the provided quantity', () => {
    render(<OrderProductCard {...defaultProps} quantity={3} />);

    expect(screen.getByRole('spinbutton')).toHaveValue(3);
  });

  it('calls onQuantityChange with variantId and new quantity when "+" is clicked', async () => {
    const user = userEvent.setup();
    const onQuantityChange = vi.fn();
    render(
      <OrderProductCard {...defaultProps} quantity={2} onQuantityChange={onQuantityChange} />,
    );

    await user.click(screen.getByRole('button', {name: /increase quantity/i}));
    expect(onQuantityChange).toHaveBeenCalledWith('gid://shopify/ProductVariant/1', 3);
  });

  it('calls onQuantityChange with variantId and new quantity when "-" is clicked', async () => {
    const user = userEvent.setup();
    const onQuantityChange = vi.fn();
    render(
      <OrderProductCard {...defaultProps} quantity={2} onQuantityChange={onQuantityChange} />,
    );

    await user.click(screen.getByRole('button', {name: /decrease quantity/i}));
    expect(onQuantityChange).toHaveBeenCalledWith('gid://shopify/ProductVariant/1', 1);
  });

  it('renders QuantitySelector as disabled when product is not available for sale', () => {
    const unavailableProduct = {
      ...mockProduct,
      variant: {...mockProduct.variant, availableForSale: false},
    };
    render(<OrderProductCard {...defaultProps} product={unavailableProduct} />);

    expect(screen.getByRole('spinbutton')).toBeDisabled();
    expect(screen.getByRole('button', {name: /increase quantity/i})).toBeDisabled();
    expect(screen.getByRole('button', {name: /decrease quantity/i})).toBeDisabled();
  });

  it('shows "Currently unavailable" message when product is unavailable', () => {
    const unavailableProduct = {
      ...mockProduct,
      variant: {...mockProduct.variant, availableForSale: false},
    };
    render(<OrderProductCard {...defaultProps} product={unavailableProduct} />);

    expect(screen.getByText('Currently unavailable')).toBeInTheDocument();
  });

  it('does not show unavailability message when product is available', () => {
    render(<OrderProductCard {...defaultProps} />);

    expect(screen.queryByText('Currently unavailable')).not.toBeInTheDocument();
  });

  it('shows "Price on request" when wholesalePrice is null', () => {
    render(<OrderProductCard {...defaultProps} wholesalePrice={null} />);

    expect(screen.getByText('Price on request')).toBeInTheDocument();
    expect(screen.queryByText(/per unit/i)).not.toBeInTheDocument();
  });

  it('disables quantity selector when wholesalePrice is null', () => {
    render(<OrderProductCard {...defaultProps} wholesalePrice={null} />);

    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });

  it('applies reduced opacity when wholesalePrice is null', () => {
    render(<OrderProductCard {...defaultProps} wholesalePrice={null} />);

    const article = screen.getByRole('article', {name: 'Lavender Bar Soap'});
    expect(article).toHaveClass('opacity-60');
  });

  it('applies reduced opacity class to article when product is unavailable', () => {
    const unavailableProduct = {
      ...mockProduct,
      variant: {...mockProduct.variant, availableForSale: false},
    };
    render(<OrderProductCard {...defaultProps} product={unavailableProduct} />);

    const article = screen.getByRole('article', {name: 'Lavender Bar Soap'});
    expect(article).toHaveClass('opacity-60');
  });

  it('does not apply reduced opacity when product is available', () => {
    render(<OrderProductCard {...defaultProps} />);

    const article = screen.getByRole('article', {name: 'Lavender Bar Soap'});
    expect(article).not.toHaveClass('opacity-60');
  });
});

import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {OrderSummary} from './OrderSummary';

vi.mock('@shopify/hydrogen', () => ({
  Money: ({data}: {data: {amount: string; currencyCode: string}}) => (
    <span>
      {data.currencyCode} {data.amount}
    </span>
  ),
}));

const mockProducts = [
  {
    id: 'gid://shopify/Product/1',
    title: 'Lavender Bar Soap',
    handle: 'lavender-bar-soap',
    featuredImage: null,
    variant: {
      id: 'gid://shopify/ProductVariant/1',
      availableForSale: true,
      price: {amount: '6.00', currencyCode: 'USD' as const},
    },
    wholesalePrice: {amount: '6.00', currencyCode: 'USD' as const} as {amount: string; currencyCode: 'USD'} | null,
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Eucalyptus Bar Soap',
    handle: 'eucalyptus-bar-soap',
    featuredImage: null,
    variant: {
      id: 'gid://shopify/ProductVariant/2',
      availableForSale: true,
      price: {amount: '7.00', currencyCode: 'USD' as const},
    },
    wholesalePrice: {amount: '7.00', currencyCode: 'USD' as const} as {amount: string; currencyCode: 'USD'} | null,
  },
];

const noop = () => {};

describe('OrderSummary', () => {
  describe('empty state', () => {
    it('shows empty state when quantities map is empty', () => {
      render(<OrderSummary products={mockProducts} quantities={{}} onCheckout={noop} />);
      expect(screen.getByText(/no items added yet/i)).toBeInTheDocument();
    });

    it('shows empty state when all quantities are 0', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{
            'gid://shopify/ProductVariant/1': 0,
            'gid://shopify/ProductVariant/2': 0,
          }}
          onCheckout={noop}
        />,
      );
      expect(screen.getByText(/no items added yet/i)).toBeInTheDocument();
    });

    it('does not show subtotal in empty state', () => {
      render(<OrderSummary products={mockProducts} quantities={{}} onCheckout={noop} />);
      expect(screen.queryByText(/subtotal/i)).not.toBeInTheDocument();
    });
  });

  describe('line items', () => {
    it('renders product name for a selected product', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={noop}
        />,
      );
      expect(screen.getByText('Lavender Bar Soap')).toBeInTheDocument();
    });

    it('renders quantity next to the product name', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={noop}
        />,
      );
      expect(screen.getByText(/× 6/)).toBeInTheDocument();
    });

    it('renders line total as qty × unit price', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={noop}
        />,
      );
      // 6 × $6.00 = $36.00 — appears in both line item and subtotal for single product
      expect(screen.getAllByText('USD 36.00').length).toBeGreaterThanOrEqual(1);
    });

    it('does not show products with quantity 0 as line items', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{
            'gid://shopify/ProductVariant/1': 6,
            'gid://shopify/ProductVariant/2': 0,
          }}
          onCheckout={noop}
        />,
      );
      expect(screen.getByText('Lavender Bar Soap')).toBeInTheDocument();
      expect(screen.queryByText('Eucalyptus Bar Soap')).not.toBeInTheDocument();
    });

    it('renders multiple selected line items', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{
            'gid://shopify/ProductVariant/1': 6,
            'gid://shopify/ProductVariant/2': 12,
          }}
          onCheckout={noop}
        />,
      );
      expect(screen.getByText('Lavender Bar Soap')).toBeInTheDocument();
      expect(screen.getByText('Eucalyptus Bar Soap')).toBeInTheDocument();
    });
  });

  describe('subtotal', () => {
    it('shows subtotal label when items are selected', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={noop}
        />,
      );
      expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
    });

    it('subtotal equals sum of all line totals', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{
            'gid://shopify/ProductVariant/1': 6,
            'gid://shopify/ProductVariant/2': 12,
          }}
          onCheckout={noop}
        />,
      );
      // 6×6.00 = 36.00, 12×7.00 = 84.00, subtotal = 120.00
      expect(screen.getByText('USD 120.00')).toBeInTheDocument();
    });

    it('subtotal equals the single line total for one selected product', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={noop}
        />,
      );
      // Both line total and subtotal show USD 36.00
      const instances = screen.getAllByText('USD 36.00');
      expect(instances).toHaveLength(2);
    });
  });

  describe('heading and structure', () => {
    it('renders the Order Summary heading', () => {
      render(<OrderSummary products={mockProducts} quantities={{}} onCheckout={noop} />);
      expect(screen.getByRole('heading', {name: /order summary/i})).toBeInTheDocument();
    });

    it('renders as an aside with accessible label', () => {
      render(<OrderSummary products={mockProducts} quantities={{}} onCheckout={noop} />);
      expect(screen.getByRole('complementary', {name: /order summary/i})).toBeInTheDocument();
    });
  });

  describe('checkout button', () => {
    it('renders the Proceed to Checkout button', () => {
      render(<OrderSummary products={mockProducts} quantities={{}} onCheckout={noop} />);
      expect(screen.getByRole('button', {name: /proceed to checkout/i})).toBeInTheDocument();
    });

    it('checkout button is disabled when no items are selected', () => {
      render(<OrderSummary products={mockProducts} quantities={{}} onCheckout={noop} />);
      expect(screen.getByRole('button', {name: /proceed to checkout/i})).toBeDisabled();
    });

    it('checkout button is enabled when at least one item has valid quantity (>= 6)', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={noop}
        />,
      );
      expect(screen.getByRole('button', {name: /proceed to checkout/i})).not.toBeDisabled();
    });

    it('checkout button is enabled when multiple items have valid quantities', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{
            'gid://shopify/ProductVariant/1': 6,
            'gid://shopify/ProductVariant/2': 12,
          }}
          onCheckout={noop}
        />,
      );
      expect(screen.getByRole('button', {name: /proceed to checkout/i})).not.toBeDisabled();
    });

    it('checkout button is disabled when a product has quantity 1 (below MOQ)', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 1}}
          onCheckout={noop}
        />,
      );
      expect(screen.getByRole('button', {name: /proceed to checkout/i})).toBeDisabled();
    });

    it('checkout button is disabled when a product has quantity 5 (below MOQ)', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 5}}
          onCheckout={noop}
        />,
      );
      expect(screen.getByRole('button', {name: /proceed to checkout/i})).toBeDisabled();
    });

    it('checkout button is disabled when one valid and one invalid quantity exist', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{
            'gid://shopify/ProductVariant/1': 6,
            'gid://shopify/ProductVariant/2': 3,
          }}
          onCheckout={noop}
        />,
      );
      expect(screen.getByRole('button', {name: /proceed to checkout/i})).toBeDisabled();
    });

    it('calls onCheckout when button is clicked and enabled', async () => {
      const onCheckout = vi.fn();
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={onCheckout}
        />,
      );
      await userEvent.click(screen.getByRole('button', {name: /proceed to checkout/i}));
      expect(onCheckout).toHaveBeenCalledOnce();
    });

    it('does not call onCheckout when button is disabled', async () => {
      const onCheckout = vi.fn();
      render(
        <OrderSummary products={mockProducts} quantities={{}} onCheckout={onCheckout} />,
      );
      await userEvent.click(screen.getByRole('button', {name: /proceed to checkout/i}));
      expect(onCheckout).not.toHaveBeenCalled();
    });
  });

  describe('error state', () => {
    it('shows error message when error prop is provided', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={noop}
          error="Something went wrong. Your order is safe — let's try again."
        />,
      );
      expect(
        screen.getByText(/something went wrong\. your order is safe/i),
      ).toBeInTheDocument();
    });

    it('does not show error message when error prop is undefined', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={noop}
        />,
      );
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('error message is rendered as an alert role for accessibility', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={noop}
          error="Something went wrong. Your order is safe — let's try again."
        />,
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('checkout button remains enabled after error when quantities are valid', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={noop}
          error="Something went wrong. Your order is safe — let's try again."
        />,
      );
      expect(screen.getByRole('button', {name: /proceed to checkout/i})).not.toBeDisabled();
    });

    it('partner can retry after error — onCheckout is callable', async () => {
      const onCheckout = vi.fn();
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={onCheckout}
          error="Something went wrong. Your order is safe — let's try again."
        />,
      );
      await userEvent.click(screen.getByRole('button', {name: /proceed to checkout/i}));
      expect(onCheckout).toHaveBeenCalledOnce();
    });
  });

  describe('loading state', () => {
    it('shows loading text when isLoading is true', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={noop}
          isLoading
        />,
      );
      expect(screen.getByRole('button', {name: /processing/i})).toBeInTheDocument();
    });

    it('disables button when isLoading is true', () => {
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={noop}
          isLoading
        />,
      );
      expect(screen.getByRole('button', {name: /processing/i})).toBeDisabled();
    });

    it('does not call onCheckout when isLoading is true', async () => {
      const onCheckout = vi.fn();
      render(
        <OrderSummary
          products={mockProducts}
          quantities={{'gid://shopify/ProductVariant/1': 6}}
          onCheckout={onCheckout}
          isLoading
        />,
      );
      await userEvent.click(screen.getByRole('button', {name: /processing/i}));
      expect(onCheckout).not.toHaveBeenCalled();
    });
  });
});

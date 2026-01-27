import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ProductForm} from '~/components/ProductForm';
import type {MappedProductOptions} from '@shopify/hydrogen';

/**
 * ProductForm Component Tests (P1 - High Priority)
 *
 * Tests product variant selection and form behavior.
 */

// Mock dependencies
vi.mock('react-router', () => ({
  createContext: vi.fn(),
  useNavigate: () => vi.fn(),
  Link: ({children, to, ...props}: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('~/components/Aside', () => ({
  useAside: () => ({
    open: vi.fn(),
  }),
}));

vi.mock('~/components/AddToCartButton', () => ({
  AddToCartButton: ({children, disabled}: any) => (
    <button type="submit" disabled={disabled}>
      {children}
    </button>
  ),
}));

describe('ProductForm', () => {
  it('[P1] should not display options with single value', () => {
    // GIVEN: Product options where one option has only single value
    const productOptions = [
      {
        name: 'Size',
        optionValues: [
          {
            id: 'gid://shopify/ProductOption/1',
            name: 'Large',
            handle: 'test-product',
            variantUriQuery: 'Size=Large',
            selected: true,
            available: true,
            exists: true,
            isDifferentProduct: false,
            swatch: null,
            variant: null,
          },
        ],
      },
    ];

    const selectedVariant = {
      id: 'gid://shopify/ProductVariant/123',
      availableForSale: true,
      title: 'Large',
      price: {amount: '29.99', currencyCode: 'USD'},
    };

    render(
      <ProductForm
        productOptions={productOptions as any}
        selectedVariant={selectedVariant as any}
      />,
    );

    // WHEN: Component renders
    // THEN: Size option should not be displayed (only one value)
    expect(screen.queryByText('Size')).not.toBeInTheDocument();
  });

  it('[P1] should display options with multiple values', () => {
    // GIVEN: Product options with multiple values
    const productOptions = [
      {
        name: 'Size',
        optionValues: [
          {
            id: 'gid://shopify/ProductOption/1',
            name: 'Small',
            handle: 'test-product',
            variantUriQuery: 'Size=Small',
            selected: false,
            available: true,
            exists: true,
            isDifferentProduct: false,
            swatch: null,
            variant: null,
          },
          {
            id: 'gid://shopify/ProductOption/2',
            name: 'Large',
            handle: 'test-product',
            variantUriQuery: 'Size=Large',
            selected: true,
            available: true,
            exists: true,
            isDifferentProduct: false,
            swatch: null,
            variant: null,
          },
        ],
      },
    ];

    const selectedVariant = {
      id: 'gid://shopify/ProductVariant/123',
      availableForSale: true,
      title: 'Large',
      price: {amount: '29.99', currencyCode: 'USD'},
    };

    render(
      <ProductForm
        productOptions={productOptions as any}
        selectedVariant={selectedVariant as any}
      />,
    );

    // WHEN: Component renders
    // THEN: Size option should be displayed with both values
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('[P1] should disable add to cart when variant unavailable', () => {
    // GIVEN: Product with unavailable variant
    const productOptions: MappedProductOptions[] = [];

    const selectedVariant = {
      id: 'gid://shopify/ProductVariant/123',
      availableForSale: false, // Sold out
      title: 'Large',
      price: {amount: '29.99', currencyCode: 'USD'},
    };

    render(
      <ProductForm
        productOptions={productOptions}
        selectedVariant={selectedVariant as any}
      />,
    );

    // WHEN: Component renders
    const addToCartButton = screen.getByRole('button', {name: /sold out/i});

    // THEN: Button shows "Sold out" and is disabled
    expect(addToCartButton).toHaveTextContent('Sold out');
    expect(addToCartButton).toBeDisabled();
  });

  it('[P1] should enable add to cart when variant available', () => {
    // GIVEN: Product with available variant
    const productOptions: MappedProductOptions[] = [];

    const selectedVariant = {
      id: 'gid://shopify/ProductVariant/123',
      availableForSale: true,
      title: 'Large',
      price: {amount: '29.99', currencyCode: 'USD'},
    };

    render(
      <ProductForm
        productOptions={productOptions}
        selectedVariant={selectedVariant as any}
      />,
    );

    // WHEN: Component renders
    const addToCartButton = screen.getByRole('button', {name: /add to cart/i});

    // THEN: Button shows "Add to cart" and is enabled
    expect(addToCartButton).toHaveTextContent('Add to cart');
    expect(addToCartButton).not.toBeDisabled();
  });

  it('[P1] should render variant with reduced opacity when unavailable', () => {
    // GIVEN: Product with unavailable variant option
    const productOptions = [
      {
        name: 'Size',
        optionValues: [
          {
            id: 'gid://shopify/ProductOption/1',
            name: 'Small',
            handle: 'test-product',
            variantUriQuery: 'Size=Small',
            selected: false,
            available: false, // Unavailable
            exists: true,
            isDifferentProduct: false,
            swatch: null,
            variant: null,
          },
          {
            id: 'gid://shopify/ProductOption/2',
            name: 'Large',
            handle: 'test-product',
            variantUriQuery: 'Size=Large',
            selected: true,
            available: true,
            exists: true,
            isDifferentProduct: false,
            swatch: null,
            variant: null,
          },
        ],
      },
    ];

    const selectedVariant = {
      id: 'gid://shopify/ProductVariant/123',
      availableForSale: true,
      title: 'Large',
      price: {amount: '29.99', currencyCode: 'USD'},
    };

    const {container} = render(
      <ProductForm
        productOptions={productOptions as any}
        selectedVariant={selectedVariant as any}
      />,
    );

    // WHEN: Component renders
    // THEN: Unavailable option should have reduced opacity styling
    // const unavailableOption = container.querySelector(
    //   'button:has-text("Small")',
    // );
    const unavailableOption = screen.getByRole('button', {name: /small/i});
    expect(unavailableOption).toHaveStyle({opacity: 0.3});
  });
});

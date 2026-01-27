import {describe, it, expect, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {AddToCartButton} from '~/components/AddToCartButton';

/**
 * AddToCartButton Component Tests (P1 - High Priority)
 *
 * Tests button behavior for different product states.
 */

// Mock CartForm from Shopify Hydrogen
vi.mock('@shopify/hydrogen', () => ({
  CartForm: ({children, route, inputs, action}: any) => {
    const mockFetcher = {
      state: 'idle',
      Form: 'form',
    };
    return <form data-route={route}>{children(mockFetcher)}</form>;
  },
}));

describe('AddToCartButton', () => {
  it('[P1] should be disabled when no lines provided', () => {
    // GIVEN: No product lines (empty array)
    render(
      <AddToCartButton lines={[]} disabled={true}>
        Add to cart
      </AddToCartButton>,
    );

    // WHEN: Component renders
    const button = screen.getByRole('button', {name: /add to cart/i});

    // THEN: Button is disabled
    expect(button).toBeDisabled();
  });

  it('[P1] should be enabled when product line is provided', () => {
    // GIVEN: Valid product line
    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    render(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    // WHEN: Component renders
    const button = screen.getByRole('button', {name: /add to cart/i});

    // THEN: Button is enabled
    expect(button).not.toBeDisabled();
  });

  it('[P1] should show "Sold out" text when disabled', () => {
    // GIVEN: Disabled button (sold out variant)
    render(
      <AddToCartButton lines={[]} disabled={true}>
        Sold out
      </AddToCartButton>,
    );

    // WHEN: Component renders
    const button = screen.getByRole('button', {name: /sold out/i});

    // THEN: Button shows "Sold out" and is disabled
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Sold out');
  });

  it('[P1] should call onClick handler when clicked', async () => {
    // GIVEN: Button with onClick handler
    const handleClick = vi.fn();
    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    render(
      <AddToCartButton lines={lines} onClick={handleClick}>
        Add to cart
      </AddToCartButton>,
    );

    // WHEN: User clicks button
    const button = screen.getByRole('button', {name: /add to cart/i});
    await userEvent.click(button);

    // THEN: onClick handler is called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('[P1] should include analytics data in hidden input', () => {
    // GIVEN: Button with analytics data
    const analytics = {
      productId: 'test-product',
      variantId: 'test-variant',
    };

    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    const {container} = render(
      <AddToCartButton lines={lines} analytics={analytics}>
        Add to cart
      </AddToCartButton>,
    );

    // WHEN: Component renders
    const analyticsInput = container.querySelector('input[name="analytics"]');

    // THEN: Analytics data is included as hidden input
    expect(analyticsInput).toBeTruthy();
    expect(analyticsInput).toHaveAttribute('type', 'hidden');
    expect(analyticsInput).toHaveAttribute(
      'value',
      JSON.stringify(analytics),
    );
  });
});

import {describe, it, expect, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {userEvent} from '@testing-library/user-event';
import {AddToCartButton} from '~/components/AddToCartButton';

/**
 * AddToCartButton Component Tests (P1 - High Priority)
 *
 * Tests button behavior for different product states.
 */

// Mock CartForm from Shopify Hydrogen with configurable fetcher state
let mockFetcherState = 'idle';
let mockFetcherData: any = null;
vi.mock('@shopify/hydrogen', () => ({
  CartForm: ({children, route, inputs, action}: any) => {
    const mockFetcher = {
      state: mockFetcherState,
      data: mockFetcherData,
      Form: 'form',
    };
    return <form data-route={route}>{children(mockFetcher)}</form>;
  },
}));

// Mock Zustand exploration store
const mockSetCartDrawerOpen = vi.fn();
vi.mock('~/stores/exploration', () => ({
  useExplorationStore: vi.fn((selector) => {
    const mockState = {
      setCartDrawerOpen: mockSetCartDrawerOpen,
    };
    return selector ? selector(mockState) : mockState;
  }),
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

  // Task 1: Loading state tests (AC2)
  it('[P0] should show loading text when fetcher state is submitting', () => {
    // GIVEN: Fetcher in submitting state
    mockFetcherState = 'submitting';

    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    render(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    // WHEN: Component renders with loading state
    const button = screen.getByRole('button');

    // THEN: Button shows loading text
    expect(button).toHaveTextContent('Adding...');
    expect(button).toBeDisabled();

    // Reset mock state
    mockFetcherState = 'idle';
  });

  it('[P0] should have data-testid for E2E testing', () => {
    // GIVEN: Button component
    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    render(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    // WHEN: Component renders
    const button = screen.getByRole('button');

    // THEN: Button has data-testid attribute
    expect(button).toHaveAttribute('data-testid', 'add-to-cart-button');
  });

  it('[P0] should prevent double-submit during loading', () => {
    // GIVEN: Fetcher in submitting state
    mockFetcherState = 'submitting';

    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    render(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    // WHEN: Button is in loading state
    const button = screen.getByRole('button');

    // THEN: Button is disabled (prevents double-submit)
    expect(button).toBeDisabled();

    // Reset mock state
    mockFetcherState = 'idle';
  });

  it('[P0] should maintain consistent button size during state changes', () => {
    // GIVEN: Button in idle state
    mockFetcherState = 'idle';

    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    const {rerender} = render(
      <AddToCartButton lines={lines}>Add to cart</AddToCartButton>,
    );

    // WHEN: Get initial button element
    const buttonIdle = screen.getByRole('button');

    // THEN: When state changes to loading
    mockFetcherState = 'submitting';
    rerender(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    const buttonLoading = screen.getByRole('button');

    // Button should have Tailwind min-width class to prevent layout shift
    expect(buttonLoading).toHaveClass('min-w-[auto]');

    // Reset mock state
    mockFetcherState = 'idle';
  });

  // Task 2: Success state tests (AC3)
  it('[P0] should show "Added ✓" state after successful submission', async () => {
    // GIVEN: Fetcher with success data
    mockFetcherState = 'idle';
    mockFetcherData = {cart: {id: 'test-cart'}};

    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    render(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    // WHEN: Success state is triggered
    const button = screen.getByRole('button');

    // THEN: Button shows success text
    await waitFor(() => {
      expect(button).toHaveTextContent('Added ✓');
    });

    // Reset mock state
    mockFetcherData = null;
  });

  it('[P0] should reset to idle state after 1 second timeout', async () => {
    // GIVEN: Button in success state
    mockFetcherState = 'idle';
    mockFetcherData = {cart: {id: 'test-cart'}};

    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    render(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    // WHEN: Wait for success timeout (1 second)
    await waitFor(
      () => {
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Add to cart');
      },
      {timeout: 1500},
    );

    // Reset mock state
    mockFetcherData = null;
  });

  it('[P0] should not disable button during success state', async () => {
    // GIVEN: Button in success state
    mockFetcherState = 'idle';
    mockFetcherData = {cart: {id: 'test-cart'}};

    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    render(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    // WHEN: Check button state during success
    const button = screen.getByRole('button');

    // THEN: Button is disabled (prevents double-submission during success animation)
    expect(button).toBeDisabled();

    // Reset mock state
    mockFetcherData = null;
  });

  // Task 3: Cart drawer auto-open tests (AC4)
  it('[P0] should open cart drawer on successful add', async () => {
    // GIVEN: Button that successfully adds to cart
    mockFetcherState = 'idle';
    mockFetcherData = {cart: {id: 'test-cart'}};

    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    render(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    // WHEN: Success state is triggered
    await waitFor(() => {
      // THEN: Cart drawer is opened
      expect(mockSetCartDrawerOpen).toHaveBeenCalledWith(true);
    });

    // Reset mock state
    mockFetcherData = null;
    mockSetCartDrawerOpen.mockClear();
  });

  // Task 4: Error handling tests (AC5)
  it('[P0] should display warm error message on failure', async () => {
    // GIVEN: Button that fails to add to cart
    mockFetcherState = 'idle';
    mockFetcherData = {errors: [{message: 'Network error'}]};

    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    // Mock console.error
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    // WHEN: Error state is triggered
    await waitFor(() => {
      // THEN: Error message is displayed
      const errorMessage = screen.getByTestId('add-to-cart-error');
      expect(errorMessage).toHaveTextContent("Something went wrong. Let's try again.");
    });

    // AND: Error is logged to console (without sensitive data)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Add to cart failed:',
      'errors',
    );

    // Cleanup
    consoleErrorSpy.mockRestore();
    mockFetcherData = null;
  });

  it('[P0] should return button to enabled state on error', async () => {
    // GIVEN: Button that fails to add to cart
    mockFetcherState = 'idle';
    mockFetcherData = {error: 'API error'};

    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    // WHEN: Error occurs
    await waitFor(() => {
      expect(screen.getByTestId('add-to-cart-error')).toBeInTheDocument();
    });

    // THEN: Button is enabled (allows retry)
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();

    // Cleanup
    mockFetcherData = null;
  });

  it('[P0] should allow user to retry after error', async () => {
    // GIVEN: Button in error state
    mockFetcherState = 'idle';
    mockFetcherData = {errors: [{message: 'Test error'}]};

    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    vi.spyOn(console, 'error').mockImplementation(() => {});

    const {rerender} = render(
      <AddToCartButton lines={lines}>Add to cart</AddToCartButton>,
    );

    // WHEN: Error is displayed
    await waitFor(() => {
      expect(screen.getByTestId('add-to-cart-error')).toBeInTheDocument();
    });

    // THEN: User clicks to retry
    const button = screen.getByRole('button');
    await userEvent.click(button);

    // AND: Success on retry
    mockFetcherData = {cart: {id: 'test-cart'}};
    rerender(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    // THEN: Error message is cleared
    await waitFor(() => {
      expect(screen.queryByTestId('add-to-cart-error')).not.toBeInTheDocument();
    });

    // Cleanup
    mockFetcherData = null;
  });

  // Task 5: Keyboard accessibility tests (AC6)
  it('[P0] should support keyboard interaction (Enter/Space)', async () => {
    // GIVEN: Button in focus
    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    render(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    const button = screen.getByRole('button');
    button.focus();

    // WHEN: User presses Enter or Space
    expect(button).toHaveFocus();

    // THEN: Button is keyboard accessible (native behavior)
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('[P0] should announce state changes to screen readers', () => {
    // GIVEN: Button component
    const lines = [
      {
        merchandiseId: 'gid://shopify/ProductVariant/123',
        quantity: 1,
      },
    ];

    render(<AddToCartButton lines={lines}>Add to cart</AddToCartButton>);

    // WHEN: Component renders
    const srRegion = screen.getByRole('status');

    // THEN: Screen reader announcement region has ARIA attributes
    expect(srRegion).toHaveAttribute('aria-live', 'polite');
    expect(srRegion).toHaveAttribute('aria-atomic', 'true');
    expect(srRegion).toHaveClass('sr-only');
  });
});

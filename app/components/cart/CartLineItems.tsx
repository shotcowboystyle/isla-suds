import * as React from 'react';
import {useRouteLoaderData, Link, useFetcher} from 'react-router';
import {useOptimisticCart, CartForm} from '@shopify/hydrogen';
import {cn} from '~/utils/cn';
import {formatMoney} from '~/utils/format-money';
import {
  CART_QUANTITY_UPDATE_ERROR_MESSAGE,
  CART_QUANTITY_INVENTORY_ERROR_MESSAGE,
  CART_QUANTITY_NETWORK_ERROR_MESSAGE,
} from '~/content/errors';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';

/**
 * CartLineItems Component
 * Story 5.5: Display Cart Line Items
 *
 * Displays cart line items with:
 * - Product thumbnail images
 * - Product names and variant details
 * - Prices (unit and line total)
 * - Quantities (read-only)
 * - Semantic HTML and accessibility
 */
export function CartLineItems() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const originalCart = rootData?.cart as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);

  // Loading state
  if (!rootData?.cart) {
    return <CartLineItemsSkeleton />;
  }

  // Empty state (handled by CartDrawer)
  if (!cart?.lines?.nodes?.length) {
    return null;
  }

  const itemCount = cart.lines.nodes.length;

  return (
    <ul
      // eslint-disable-next-line jsx-a11y/no-redundant-roles
      role="list" // Required for screen readers when CSS removes list semantics (AC6, AC10)
      aria-label={`Shopping cart with ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
      className="space-y-4"
    >
      {cart.lines.nodes.map((line) => (
        <CartLineItem key={line.id} line={line} cart={cart as CartApiQueryFragment} />
      ))}
    </ul>
  );
}

/**
 * Individual cart line item
 * Story 5.6: Added quantity controls with increment/decrement handlers
 */
function CartLineItem({
  line,
  cart,
}: {
  line: CartApiQueryFragment['lines']['nodes'][0];
  cart: CartApiQueryFragment;
}) {
  const {merchandise, quantity} = line;
  const {product, image, selectedOptions} = merchandise;

  // Story 5.6: useFetcher for cart mutations
  const fetcher = useFetcher();
  const isUpdating = fetcher.state === 'submitting';

  // Story 5.6 Task 7: Error handling with warm messaging (AC7)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Detect and handle fetcher errors
  React.useEffect(() => {
    if (fetcher.data && 'errors' in fetcher.data && fetcher.data.errors) {
      const errors = fetcher.data.errors as Array<{message: string}>;
      if (errors.length > 0) {
        const errorMsg = errors[0].message.toLowerCase();

        // Differentiate error types
        let message = CART_QUANTITY_UPDATE_ERROR_MESSAGE;

        if (
          errorMsg.includes('inventory') ||
          errorMsg.includes('stock') ||
          errorMsg.includes('available')
        ) {
          message = CART_QUANTITY_INVENTORY_ERROR_MESSAGE;
        } else if (
          errorMsg.includes('network') ||
          errorMsg.includes('connection') ||
          errorMsg.includes('timeout')
        ) {
          message = CART_QUANTITY_NETWORK_ERROR_MESSAGE;
        }

        setErrorMessage(message);

        // Log error for debugging (AC7)
        console.error('Cart quantity update error:', errors[0]);

        // Auto-dismiss after 3 seconds (AC7)
        const timer = setTimeout(() => {
          setErrorMessage(null);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [fetcher.data]);

  // Story 5.6 Task 2: Increment quantity handler (AC2)
  const handleIncrement = () => {
    const newQuantity = quantity + 1;

    fetcher.submit(
      {
        action: CartForm.ACTIONS.LinesUpdate,
        inputs: {
          lines: [
            {
              id: line.id,
              quantity: newQuantity,
            },
          ],
        },
      },
      {
        method: 'POST',
        action: '/cart',
      },
    );
  };

  // Story 5.6 Task 3: Decrement quantity handler (AC3)
  const handleDecrement = () => {
    // Defensive: prevent decrement below 1 (button should already be disabled)
    if (quantity <= 1) return;

    const newQuantity = quantity - 1;

    fetcher.submit(
      {
        action: CartForm.ACTIONS.LinesUpdate,
        inputs: {
          lines: [
            {
              id: line.id,
              quantity: newQuantity,
            },
          ],
        },
      },
      {
        method: 'POST',
        action: '/cart',
      },
    );
  };

  // Calculate prices
  const lineTotal = line.cost.totalAmount;
  const pricePerUnit = line.cost.amountPerQuantity;
  const compareAtPrice = line.cost.compareAtAmountPerQuantity;

  // Format prices
  const formattedLineTotal = formatMoney(
    lineTotal.amount,
    lineTotal.currencyCode,
  );
  const formattedUnitPrice = formatMoney(
    pricePerUnit.amount,
    pricePerUnit.currencyCode,
  );
  const formattedComparePrice = compareAtPrice
    ? formatMoney(compareAtPrice.amount, compareAtPrice.currencyCode)
    : null;

  // Product URL
  const productUrl = `/products/${product.handle}`;

  // Variant details
  const variantText =
    selectedOptions?.length > 0
      ? selectedOptions.map((opt) => `${opt.name}: ${opt.value}`).join(', ')
      : null;

  // Image optimization
  const imageUrl = image?.url
    ? `${image.url}?width=96&height=96&format=webp`
    : null;
  const altText = `${product.title} thumbnail`;

  return (
    <li className="flex gap-4">
      {/* Product Image */}
      <div className="flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={altText}
            loading="lazy"
            width="96"
            height="96"
            onError={(e) => {
              // AC1: Graceful fallback for broken images
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) {
                (fallback as HTMLElement).style.display = 'flex';
              }
            }}
            className={cn(
              'rounded object-cover',
              'w-20 h-20 sm:w-24 sm:h-24',
              'bg-neutral-100',
            )}
          />
        ) : null}
        {/* Fallback icon for broken/missing images (AC1) */}
        <div
          style={{display: imageUrl ? 'none' : 'flex'}}
          className={cn(
            'rounded flex items-center justify-center',
            'w-20 h-20 sm:w-24 sm:h-24',
            'bg-neutral-100 text-neutral-400',
          )}
          aria-label="No image available"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      </div>

      {/* Content - Mobile: Stacked, Desktop: Inline */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-1">
          <Link
            to={productUrl}
            className={cn(
              'text-[var(--text-primary)] hover:text-[var(--accent-primary)]',
              'transition-colors',
              'text-base font-medium',
            )}
          >
            {product.title}
          </Link>

          {/* Variant Details */}
          {variantText && (
            <span className="text-sm text-[var(--text-muted)]">
              {variantText}
            </span>
          )}

          {/* Quantity Controls - Mobile Only */}
          <div className="sm:hidden flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1 || isUpdating}
                className={cn(
                  'inline-flex items-center justify-center rounded transition-colors',
                  'h-11 w-11', // 44px touch target for mobile
                  quantity <= 1 || isUpdating
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-dark)]',
                )}
                aria-label={`Decrease quantity for ${product.title}`}
                aria-disabled={quantity <= 1}
              >
                {isUpdating ? '...' : '−'}
              </button>

              <span
                className="text-base font-medium min-w-[2ch] text-center"
                aria-label={`Quantity: ${quantity}`}
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                disabled={isUpdating}
                className={cn(
                  'inline-flex items-center justify-center rounded transition-colors',
                  'h-11 w-11', // 44px touch target for mobile
                  isUpdating
                    ? 'bg-neutral-200 text-neutral-400 cursor-wait'
                    : 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-dark)]',
                )}
                aria-label={`Increase quantity for ${product.title}`}
              >
                {isUpdating ? '...' : '+'}
              </button>
            </div>

            {/* Error message - Mobile (AC7) */}
            {errorMessage && (
              <div
                role="alert"
                aria-live="polite"
                className="text-sm text-red-600 mt-1"
              >
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* Pricing - Desktop: Right-aligned Column */}
        <div className="flex flex-col gap-1 items-start sm:items-end">
          {/* Unit Price */}
          <div className="flex items-center gap-2">
            {formattedComparePrice && (
              <span className="text-sm text-[var(--text-muted)] line-through">
                {formattedComparePrice}
              </span>
            )}
            <span className="text-sm text-[var(--text-muted)]">
              {formattedUnitPrice}
            </span>
          </div>

          {/* Quantity Controls - Desktop Only */}
          <div className="hidden sm:flex flex-col gap-1 items-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1 || isUpdating}
                className={cn(
                  'inline-flex items-center justify-center rounded transition-colors',
                  'h-8 w-8', // 32px button for desktop
                  quantity <= 1 || isUpdating
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-dark)]',
                )}
                aria-label={`Decrease quantity for ${product.title}`}
                aria-disabled={quantity <= 1}
              >
                {isUpdating ? '...' : '−'}
              </button>

              <span
                className="text-base font-medium min-w-[2ch] text-center"
                aria-label={`Quantity: ${quantity}`}
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                disabled={isUpdating}
                className={cn(
                  'inline-flex items-center justify-center rounded transition-colors',
                  'h-8 w-8', // 32px button for desktop
                  isUpdating
                    ? 'bg-neutral-200 text-neutral-400 cursor-wait'
                    : 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-dark)]',
                )}
                aria-label={`Increase quantity for ${product.title}`}
              >
                {isUpdating ? '...' : '+'}
              </button>
            </div>

            {/* Error message - Desktop (AC7) */}
            {errorMessage && (
              <div
                role="alert"
                aria-live="polite"
                className="text-sm text-red-600"
              >
                {errorMessage}
              </div>
            )}
          </div>

          {/* Line Total */}
          <span className="text-base font-medium text-[var(--text-primary)]">
            {formattedLineTotal}
          </span>
        </div>
      </div>
    </li>
  );
}

/**
 * Loading skeleton for cart line items
 */
function CartLineItemsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({length: 3}).map((_, i) => (
        <div key={`skeleton-${i}`} className="flex gap-4 animate-pulse">
          {/* Image skeleton */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-neutral-200 rounded flex-shrink-0" />

          {/* Content skeleton */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 bg-neutral-200 rounded w-2/3" />
            <div className="h-3 bg-neutral-200 rounded w-1/2" />
            <div className="h-3 bg-neutral-200 rounded w-1/4 mt-auto" />
          </div>

          {/* Price skeleton (desktop) */}
          <div className="hidden sm:flex flex-col gap-2 items-end">
            <div className="h-3 bg-neutral-200 rounded w-16" />
            <div className="h-3 bg-neutral-200 rounded w-12" />
            <div className="h-4 bg-neutral-200 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

import * as React from 'react';
import {useRouteLoaderData,Link} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import {cn} from '~/utils/cn';
import {formatMoney} from '~/utils/format-money';
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

          {/* Quantity - Mobile Only */}
          <span className="sm:hidden text-sm text-[var(--text-muted)]">
            Qty: {quantity}
          </span>
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

          {/* Quantity - Desktop Only */}
          <span className="hidden sm:inline text-sm text-[var(--text-muted)]">
            Qty: {quantity}
          </span>

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

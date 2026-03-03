import * as React from 'react';
import {Suspense} from 'react';
import {useOptimisticCart} from '@shopify/hydrogen';
import {prefersReducedMotion} from '~/lib/motion';
import {CartLineItem} from './CartLineItem';
import {CartLineItemsSkeleton} from './CartLineItemsSkeleton';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

/**
 * CartLineItems Component
 * Story 5.5: Display Cart Line Items
 * Story 5.7: Added remove functionality with fade-out animation (AC3)
 *
 * Displays cart line items with:
 * - Product thumbnail images
 * - Product names and variant details
 * - Prices (unit and line total)
 * - Quantities with +/- controls
 * - Remove buttons with animated fade-out
 * - Semantic HTML and accessibility
 */
export function CartLineItems({originalCart}: {originalCart: CartApiQueryFragment | null}) {
  const cart = useOptimisticCart(originalCart);

  // Loading state
  if (!originalCart) {
    return <CartLineItemsSkeleton />;
  }

  // Empty state (handled by CartDrawer)
  if (!cart?.lines?.nodes?.length) {
    return null;
  }

  const itemCount = cart.lines.nodes.length;
  const reducedMotion = prefersReducedMotion();

  return (
    <Suspense fallback={<CartLineItemsSkeleton />}>
      <ul aria-label={`Shopping cart with ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`} className="space-y-4">
        {cart.lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} cart={cart as CartApiQueryFragment} reducedMotion={reducedMotion} />
        ))}
      </ul>
    </Suspense>
  );
}

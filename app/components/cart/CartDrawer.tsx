import * as React from 'react';
import {useRouteLoaderData} from 'react-router';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {useOptimisticCart} from '@shopify/hydrogen';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';
import {CartLineItems} from './CartLineItems';
import {EmptyCart} from './EmptyCart';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';

export function CartDrawer() {
  const {cartDrawerOpen, setCartDrawerOpen} = useExplorationStore();
  const rootData = useRouteLoaderData<RootLoader>('root');
  const originalCart = rootData?.cart as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);

  const itemCount = cart?.lines?.nodes?.length ?? 0;
  const subtotal = cart?.cost?.subtotalAmount;

  // Format money helper
  const formatMoney = (
    amount?: {amount?: string; currencyCode?: string} | null,
  ) => {
    if (!amount?.amount || !amount?.currencyCode) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: amount.currencyCode,
    }).format(parseFloat(amount.amount));
  };

  return (
    <DialogPrimitive.Root
      open={cartDrawerOpen}
      onOpenChange={setCartDrawerOpen}
    >
      <DialogPrimitive.Portal>
        {/* Backdrop */}
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm',
            'transition-opacity duration-200',
            'data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
            'motion-reduce:transition-none',
          )}
        />

        {/* Drawer */}
        <DialogPrimitive.Content
          aria-labelledby="cart-title"
          aria-describedby="cart-description"
          className={cn(
            'fixed right-0 top-0 z-50 h-full',
            'w-full sm:w-[90%] md:max-w-[480px]',
            'bg-[var(--canvas-base)] shadow-xl',
            'flex flex-col',
            'transform transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'data-[state=open]:translate-x-0',
            'data-[state=closed]:translate-x-full',
            'motion-reduce:transition-none motion-reduce:transform-none',
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 p-4">
            <div>
              <DialogPrimitive.Title
                id="cart-title"
                className="text-lg font-semibold text-[var(--text-primary)]"
              >
                Your Cart
              </DialogPrimitive.Title>
              <DialogPrimitive.Description
                id="cart-description"
                className="sr-only"
              >
                Shopping cart with {itemCount} items
              </DialogPrimitive.Description>
            </div>

            {/* Close Button */}
            <DialogPrimitive.Close
              aria-label="Close cart"
              className={cn(
                'h-11 w-11 rounded-full',
                'flex items-center justify-center',
                'hover:bg-neutral-100 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]',
              )}
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
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </DialogPrimitive.Close>
          </div>

          {/* Cart Contents - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {itemCount === 0 ? <EmptyCart /> : <CartLineItems />}
          </div>

          {/* Footer - Subtotal & Checkout */}
          <div className="border-t border-neutral-200 p-4 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-muted)]">Subtotal</span>
              <span className="font-medium text-[var(--text-primary)]">
                {subtotal ? formatMoney(subtotal) : '—'}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              className={cn(
                'w-full py-3 rounded',
                'bg-[var(--accent-primary)] text-white',
                'font-medium',
                'hover:opacity-90 transition-opacity',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]',
              )}
              aria-label={`Proceed to checkout with ${itemCount} items, total ${subtotal ? formatMoney(subtotal) : '$0.00'}`}
            >
              Proceed to Checkout
            </button>

            {/* Continue Shopping Link */}
            <button
              type="button"
              onClick={() => setCartDrawerOpen(false)}
              className="w-full text-center text-[var(--accent-primary)] underline hover:no-underline"
            >
              Continue Shopping
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

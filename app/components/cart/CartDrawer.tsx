import * as React from 'react';
import {useRouteLoaderData} from 'react-router';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {useOptimisticCart} from '@shopify/hydrogen';
import {CHECKOUT_ERROR_MESSAGE} from '~/content/errors';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';
import {formatMoney} from '~/utils/format-money';
import {CartLineItems} from './CartLineItems';
import {EmptyCart} from './EmptyCart';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';

export function CartDrawer() {
  const {cartDrawerOpen, setCartDrawerOpen} = useExplorationStore();
  const rootData = useRouteLoaderData<RootLoader>('root');
  const originalCart = rootData?.cart as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);

  const isLoading = !rootData?.cart;
  const itemCount = cart?.lines?.nodes?.length ?? 0;
  const subtotal = cart?.cost?.subtotalAmount;
  const [liveMessage, setLiveMessage] = React.useState('');
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);
  const errorTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Announce when cart becomes empty
  React.useEffect(() => {
    if (itemCount === 0 && !isLoading && cartDrawerOpen) {
      setLiveMessage('Cart is now empty');
      // Clear message after announcement
      const timer = setTimeout(() => setLiveMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [itemCount, isLoading, cartDrawerOpen]);

  // Format money - uses centralized utility
  const formatSubtotal = () => {
    if (!subtotal?.currencyCode) return '—';
    // Handle zero/null amount cases
    const amount = subtotal?.amount ?? '0';
    return formatMoney(amount, subtotal.currencyCode);
  };

  // Cleanup error timer on unmount
  React.useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  // Handle checkout redirect (Story 5.9 - AC2, AC3, AC6, AC10)
  const handleCheckout = () => {
    // Clear any existing error timer to prevent multiple timers
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    // AC6: Validate checkoutUrl exists
    if (!cart?.checkoutUrl) {
      setCheckoutError(CHECKOUT_ERROR_MESSAGE);
      // Auto-dismiss error after 3 seconds (AC6)
      errorTimerRef.current = setTimeout(() => {
        setCheckoutError(null);
        errorTimerRef.current = null;
      }, 3000);
      return;
    }

    try {
      // AC3: Set loading state (prevents double-click - AC10)
      setIsCheckingOut(true);
      setCheckoutError(null);

      // AC2: Redirect to Shopify checkout in same tab
      window.location.href = cart.checkoutUrl;
    } catch (error) {
      // AC6: Handle redirect failure
      setCheckoutError(CHECKOUT_ERROR_MESSAGE);
      setIsCheckingOut(false);

      // Auto-dismiss error after 3 seconds
      errorTimerRef.current = setTimeout(() => {
        setCheckoutError(null);
        errorTimerRef.current = null;
      }, 3000);
    }
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
          aria-describedby={itemCount === 0 ? 'cart-empty-description' : 'cart-description'}
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
                Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </DialogPrimitive.Title>
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
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-neutral-200 rounded" />
                <div className="h-20 bg-neutral-200 rounded" />
                <div className="h-20 bg-neutral-200 rounded" />
              </div>
            ) : itemCount === 0 ? (
              <EmptyCart />
            ) : (
              <CartLineItems />
            )}
          </div>

          {/* Footer - Subtotal & Checkout - Only show when cart has items (AC4) */}
          {itemCount > 0 && (
            <div className="border-t border-neutral-200 p-4 space-y-4">
              {/* Subtotal (AC5) */}
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">Subtotal</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {formatSubtotal()}
                </span>
              </div>

              {/* Error message (AC6) */}
              {checkoutError && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="text-sm text-red-600"
                >
                  {checkoutError}
                </div>
              )}

              {/* Checkout Button (AC1, AC2, AC3, AC7, AC8, AC9, AC10) */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={cn(
                  'w-full h-14 rounded', // AC7: 56px height for touch targets
                  'bg-[var(--accent-primary)] text-white', // AC9: Design tokens
                  'font-medium text-base',
                  'hover:opacity-90', // AC9: Hover state
                  'active:scale-[0.98] active:opacity-80', // AC9: Active state with subtle press effect
                  'disabled:opacity-50 disabled:cursor-not-allowed', // AC3, AC10: Disabled during loading
                  'transition-all duration-150',
                  'flex items-center justify-center gap-2',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)]',
                )}
                aria-label="Checkout button, proceed to payment" // AC8: Screen reader label with "button"
              >
                {isCheckingOut ? (
                  <>
                    <Spinner />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Checkout'
                )}
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
          )}

          {/* ARIA live region for cart state announcements */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {liveMessage}
          </div>

          {/* Hidden descriptions for screen readers */}
          {itemCount === 0 ? (
            <div id="cart-empty-description" className="sr-only">
              Your shopping cart is empty
            </div>
          ) : (
            <div id="cart-description" className="sr-only">
              Shopping cart with {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/**
 * Spinner component for loading states (Story 5.9)
 * Used in checkout button during redirect
 */
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

import * as React from 'react';
import {useRouteLoaderData, Await} from 'react-router';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {useOptimisticCart} from '@shopify/hydrogen';
import {CHECKOUT_ERROR_MESSAGE} from '~/content/errors';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';
import {formatMoney} from '~/utils/format-money';
import styles from './CartDrawer.module.css';
import {CartLineItems} from './CartLineItems';
import {EmptyCart} from './EmptyCart';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';

export function CartDrawer() {
  const {cartDrawerOpen, setCartDrawerOpen} = useExplorationStore();
  const rootData = useRouteLoaderData<RootLoader>('root');

  return (
    <DialogPrimitive.Root open={cartDrawerOpen} onOpenChange={setCartDrawerOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm',
            'motion-reduce:transition-none',
            styles.overlay,
          )}
        />

        <DialogPrimitive.Content
          aria-labelledby="cart-title"
          className={cn(
            'fixed right-0 top-0 z-999999 h-full',
            'bg-white shadow-xl',
            'flex flex-col',
            'motion-reduce:animation-none',
            styles.drawer,
          )}
        >
          <React.Suspense fallback={<CartDrawerLoading />}>
            <Await resolve={rootData?.cart}>
              {(cartData) => <CartDrawerContent originalCart={cartData as CartApiQueryFragment | null} />}
            </Await>
          </React.Suspense>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function CartDrawerContent({originalCart}: {originalCart: CartApiQueryFragment | null}) {
  const {cartDrawerOpen, setCartDrawerOpen} = useExplorationStore();
  const cart = useOptimisticCart(originalCart);

  const isLoading = false;
  const itemCount = cart?.lines?.nodes?.length ?? 0;
  const subtotal = cart?.cost?.subtotalAmount;
  const [liveMessage, setLiveMessage] = React.useState('');
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);
  const errorTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (itemCount === 0 && !isLoading && cartDrawerOpen) {
      setLiveMessage('Cart is now empty');
      const timer = setTimeout(() => setLiveMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [itemCount, isLoading, cartDrawerOpen]);

  const formatSubtotal = () => {
    if (!subtotal?.currencyCode) return '—';
    const amount = subtotal?.amount ?? '0';
    return formatMoney(amount, subtotal.currencyCode);
  };

  React.useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  const handleCheckout = () => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    if (!cart?.checkoutUrl) {
      setCheckoutError(CHECKOUT_ERROR_MESSAGE);
      errorTimerRef.current = setTimeout(() => {
        setCheckoutError(null);
        errorTimerRef.current = null;
      }, 3000);
      return;
    }

    try {
      setIsCheckingOut(true);
      setCheckoutError(null);

      window.location.href = cart.checkoutUrl;
    } catch (error) {
      setCheckoutError(CHECKOUT_ERROR_MESSAGE);
      setIsCheckingOut(false);

      errorTimerRef.current = setTimeout(() => {
        setCheckoutError(null);
        errorTimerRef.current = null;
      }, 3000);
    }
  };

  return (
    <>
      <div id="cart-description" className="sr-only">
        {itemCount === 0
          ? 'Your shopping cart is empty'
          : `Shopping cart with ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
      </div>

      <div className="flex items-center justify-between border-b border-neutral-200 p-4">
        <div>
          <DialogPrimitive.Title id="cart-title" className={styles['cart-title']}>
            Cart{' '}
            <span className="text-(--text-muted)">
              ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
          </DialogPrimitive.Title>
        </div>

        <DialogPrimitive.Close
          aria-label="Close cart"
          className={cn(
            'h-11 w-11 rounded-full text-neutral-700',
            'flex items-center justify-center',
            'hover:bg-neutral-800 hover:text-neutral-100 cursor-pointer transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-black',
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
          <CartLineItems originalCart={originalCart} />
        )}
      </div>

      {itemCount > 0 && (
        <div className="border-t border-neutral-200 p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-(--text-muted)">Subtotal</span>
            <span className="font-medium text-(--text-primary)">{formatSubtotal()}</span>
          </div>

          {checkoutError && (
            <div role="alert" aria-live="assertive" className="text-sm text-red-600">
              {checkoutError}
            </div>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className={cn(
              'w-full h-14 rounded',
              'bg-accent text-white',
              'font-medium text-base',
              'hover:opacity-90',
              'active:scale-[0.98] active:opacity-80',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all duration-150',
              'flex items-center justify-center gap-2',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent',
            )}
            aria-label="Checkout button, proceed to payment"
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

          <button
            type="button"
            onClick={() => setCartDrawerOpen(false)}
            className="w-full text-center text-accent underline hover:no-underline"
          >
            Continue Shopping
          </button>
        </div>
      )}

      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>
    </>
  );
}

function CartDrawerLoading() {
  const {setCartDrawerOpen} = useExplorationStore();

  return (
    <>
      <div className="flex items-center justify-between border-b border-neutral-200 p-4">
        <div>
          <DialogPrimitive.Title id="cart-title" className={styles['cart-title']}>
            Cart
          </DialogPrimitive.Title>
        </div>

        <DialogPrimitive.Close
          aria-label="Close cart"
          onClick={() => setCartDrawerOpen(false)}
          className={cn(
            'h-11 w-11 rounded-full text-neutral-700',
            'flex items-center justify-center',
            'hover:bg-neutral-800 hover:text-neutral-100 cursor-pointer transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent',
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

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-neutral-200 rounded" />
          <div className="h-20 bg-neutral-200 rounded" />
          <div className="h-20 bg-neutral-200 rounded" />
        </div>
      </div>
    </>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

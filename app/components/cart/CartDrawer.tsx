import * as React from 'react';
import {useRouteLoaderData, Await} from 'react-router';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {useOptimisticCart} from '@shopify/hydrogen';
import chunky from '~/components/ui/ChunkyButton.module.css';
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
            'flex flex-col',
            'motion-reduce:animation-none',
            styles.drawer,
          )}
        >
          <React.Suspense fallback={<CartDrawerLoading />}>
            <Await resolve={rootData?.cart} errorElement={<CartDrawerError />}>
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

      <div className={styles.header}>
        <DialogPrimitive.Title id="cart-title" className={styles['cart-title']}>
          Cart{' '}
          <span className={styles.count}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </DialogPrimitive.Title>

        <CloseButton />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-20 rounded-[14px] bg-(--color-black)/10" />
            <div className="h-20 rounded-[14px] bg-(--color-black)/10" />
            <div className="h-20 rounded-[14px] bg-(--color-black)/10" />
          </div>
        ) : itemCount === 0 ? (
          <EmptyCart />
        ) : (
          <CartLineItems originalCart={originalCart} />
        )}
      </div>

      {itemCount > 0 && (
        <div className={styles.footer}>
          <div className={styles.subtotal}>
            <span className={styles['subtotal-label']}>Subtotal</span>
            <span className={styles['subtotal-amount']}>{formatSubtotal()}</span>
          </div>

          {checkoutError && (
            <div role="alert" aria-live="assertive" className={styles.failure}>
              {checkoutError}
            </div>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className={cn(chunky.chunky, styles.checkout, 'h-14')}
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
            className={cn(chunky.chunky, chunky.cream, styles.secondary)}
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
  return (
    <>
      <div className={styles.header}>
        <DialogPrimitive.Title id="cart-title" className={styles['cart-title']}>
          Cart
        </DialogPrimitive.Title>

        <CloseButton />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4 animate-pulse">
          <div className="h-20 rounded-[14px] bg-(--color-black)/10" />
          <div className="h-20 rounded-[14px] bg-(--color-black)/10" />
          <div className="h-20 rounded-[14px] bg-(--color-black)/10" />
        </div>
      </div>
    </>
  );
}

function CartDrawerError() {
  return (
    <>
      <div className={styles.header}>
        <DialogPrimitive.Title id="cart-title" className={styles['cart-title']}>
          Cart
        </DialogPrimitive.Title>
        <CloseButton />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-base font-bold">Couldn&rsquo;t load your cart &mdash; try refreshing.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={cn(chunky.chunky, chunky.cream, 'flex min-h-12 px-6 text-lg')}
        >
          Refresh page
        </button>
      </div>
    </>
  );
}

function CloseButton() {
  return (
    <DialogPrimitive.Close
      aria-label="Close cart"
      className={cn(chunky.chunky, chunky.cream, styles['icon-button'], 'h-11 w-11')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </DialogPrimitive.Close>
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

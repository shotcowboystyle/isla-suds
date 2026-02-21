import {useEffect, useRef, useState} from 'react';
import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {ADD_TO_CART_ERROR_MESSAGE, ADD_TO_CART_BUTTON_STATES} from '~/content/errors';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';

function AddToCartFormContent({
  analytics,
  children,
  disabled,
  fetcher,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  fetcher: FetcherWithComponents<any>;
  onClick?: () => void;
}) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setCartDrawerOpen = useExplorationStore((state) => state.setCartDrawerOpen);

  const isLoading = fetcher.state === 'submitting';
  const isSuccess = showSuccess;

  // Detect successful submission and trigger success state
  useEffect(() => {
    // Clear existing timeout when fetcher data changes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Check for errors in fetcher data
    if (fetcher.data && !isLoading && (fetcher.data.errors || fetcher.data.error)) {
      setError(ADD_TO_CART_ERROR_MESSAGE);
      return;
    }

    // Check for successful submission
    if (fetcher.data && !isLoading) {
      // Performance instrumentation (NFR5 <200ms requirement)
      performance.mark('add-to-cart-success');

      // Clear any previous errors (important for retry flow)
      setError(null);

      // Check prefers-reduced-motion before animating success state
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setShowSuccess(true);

      // Open cart drawer on successful add (AC4)
      setCartDrawerOpen(true);

      // Reset to idle after 1 second (or immediately if reduced motion)
      const timeout = prefersReducedMotion ? 0 : 1000;
      timeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
      }, timeout);
    }

    // Cleanup timeout on unmount or when deps change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fetcher.data, isLoading, setCartDrawerOpen]);

  // Determine button text based on state
  let buttonText: React.ReactNode = children;
  let ariaLabel = '';

  if (isLoading) {
    buttonText = ADD_TO_CART_BUTTON_STATES.LOADING;
    ariaLabel = 'Adding product to cart';
  } else if (isSuccess) {
    buttonText = ADD_TO_CART_BUTTON_STATES.SUCCESS;
    ariaLabel = 'Product added to cart';
  } else if (error) {
    ariaLabel = ADD_TO_CART_ERROR_MESSAGE;
  }

  return (
    <>
      <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />
      <button
        type="submit"
        onClick={() => {
          // Performance mark for button click
          performance.mark('add-to-cart-start');

          // Clear error on retry
          if (error) {
            setError(null);
          }

          onClick?.();
        }}
        disabled={disabled ?? (fetcher.state !== 'idle' || isSuccess)}
        data-testid="add-to-cart-button"
        className={cn('min-w-auto')}
      >
        {buttonText}
      </button>

      {/* Screen reader announcements (AC6) */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {ariaLabel}
      </div>

      {/* Error message display (AC5) */}
      {error && (
        <div role="alert" data-testid="add-to-cart-error" className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </>
  );
}

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS?.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <AddToCartFormContent analytics={analytics} disabled={disabled} fetcher={fetcher} onClick={onClick}>
          {children}
        </AddToCartFormContent>
      )}
    </CartForm>
  );
}

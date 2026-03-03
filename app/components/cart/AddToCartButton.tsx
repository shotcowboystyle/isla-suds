import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {ADD_TO_CART_ERROR_MESSAGE, ADD_TO_CART_BUTTON_STATES} from '~/content/errors';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';

/** Shape of data returned by the cart route action (/cart) via CartForm fetcher */
interface CartActionData {
  cart?: unknown;
  errors?: unknown;
  error?: unknown;
  warnings?: unknown;
  analytics?: {cartId?: string};
}

export const AddToCartButton = forwardRef<
  HTMLButtonElement,
  {
    analytics?: unknown;
    children: React.ReactNode;
    disabled?: boolean;
    lines: Array<OptimisticCartLineInput>;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
  } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>
>(({analytics, children, disabled, lines, onClick, className, ...props}, ref) => {
  const fetcher = useFetcher<CartActionData>();
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

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Performance mark for button click
    performance.mark('add-to-cart-start');

    // Clear error on retry
    if (error) {
      setError(null);
    }

    if (onClick) {
      onClick(e);
    }

    // Construct form data to submit to the Hydrogen cart action
    const formData = new FormData();
    formData.append(
      'cartFormInput',
      JSON.stringify({
        action: CartForm.ACTIONS?.LinesAdd,
        inputs: {lines},
      }),
    );
    if (analytics) {
      formData.append('analytics', JSON.stringify(analytics));
    }

    void fetcher.submit(formData, {method: 'POST', action: '/cart'});
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleAddToCart}
      disabled={disabled ?? (fetcher.state !== 'idle' || isSuccess)}
      data-testid="add-to-cart-button"
      className={cn('min-w-auto relative', className)}
      {...props}
    >
      {buttonText}

      {/* Screen reader announcements (AC6) */}
      <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {ariaLabel}
      </span>

      {/* Error message display (AC5) */}
      {error && (
        <span
          role="alert"
          data-testid="add-to-cart-error"
          className="absolute top-full left-0 mt-2 text-sm text-red-600 w-max pointer-events-none"
        >
          {error}
        </span>
      )}
    </button>
  );
});

AddToCartButton.displayName = 'AddToCartButton';

import * as React from 'react';
import {Suspense, useEffect} from 'react';
import {useFetcher} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogClose,
} from '~/components/ui/Dialog';
import {
  COLLECTION_PROMPT_COPY,
  VARIETY_PACK_PRODUCTS,
} from '~/content/collection-prompt';
import {COLLECTION_PROMPT_ADD_ERROR_MESSAGE} from '~/content/errors';
import {MotionDiv, prefersReducedMotion} from '~/lib/motion';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';

/**
 * CollectionPrompt component props
 */
export interface CollectionPromptProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** Variety pack variant ID for cart mutation (Story 4.3, Task 4) */
  variantId?: string;
}

/**
 * CollectionPrompt component (Story 4.2 + 4.3)
 *
 * Displays warm, non-pushy collection prompt after user explores 2+ products
 * Features (4.2):
 * - Radix Dialog for accessibility (focus trap, keyboard nav)
 * - Framer Motion animation with reduced-motion support
 * - All 4 product images in responsive grid
 * - 44x44px touch targets, 4.5:1 color contrast
 * - SSR-safe with graceful fallbacks
 * Features (4.3):
 * - Cart mutation via Hydrogen + React Router fetcher
 * - Loading, success, error states with warm messaging
 * - Auto-close after 1s on success
 * - Zustand state update on success
 */
export function CollectionPrompt({
  open,
  onClose,
  variantId,
}: CollectionPromptProps) {
  const fetcher = useFetcher<{
    cart?: {id: string};
    errors?: Array<{message: string}>;
  }>();
  const setStoryMomentShown = useExplorationStore(
    (state) => state.setStoryMomentShown,
  );
  const setCartDrawerOpen = useExplorationStore(
    (state) => state.setCartDrawerOpen,
  );

  // Button state derived from fetcher (Story 4.3, AC2, AC3, AC7)
  const isLoading =
    fetcher.state === 'submitting' || fetcher.state === 'loading';
  const isSuccess =
    fetcher.state === 'idle' &&
    fetcher.data?.cart &&
    !fetcher.data?.errors?.length;
  const isError = Boolean(fetcher.data?.errors?.length);

  // Handle cart mutation (Story 4.3, AC1, Task 3)
  const handleAddToCart = () => {
    if (!variantId) {
      console.warn('[CollectionPrompt] Variety pack variant ID not found');
      return;
    }

    const formData = new FormData();
    formData.append('cartAction', CartForm.ACTIONS.LinesAdd);
    formData.append(
      'lines',
      JSON.stringify([
        {
          merchandiseId: variantId,
          quantity: 1,
        },
      ]),
    );

    void fetcher.submit(formData, {
      method: 'POST',
      action: '/cart',
    });
  };

  // Auto-close after 1 second on success (Story 4.3, AC4, Task 5)
  useEffect(() => {
    if (isSuccess) {
      const shouldReduceMotion =
        typeof window !== 'undefined' && prefersReducedMotion();
      const delay = shouldReduceMotion ? 0 : 1000;

      const timer = setTimeout(() => {
        // Update Zustand state AFTER success (Story 4.3, AC5, Task 6)
        setStoryMomentShown(true);
        // Open cart drawer on success (Story 5.3, AC4)
        setCartDrawerOpen(true);
        onClose();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose, setStoryMomentShown, setCartDrawerOpen]);

  // Button text based on state (Story 4.3, AC2, AC3)
  const getButtonText = () => {
    if (isLoading) return 'Adding...';
    if (isSuccess) return 'Added! ✓';
    return COLLECTION_PROMPT_COPY.buttonText;
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPortal>
        <DialogOverlay className="bg-black/60" />
        <DialogContent
          data-testid="collection-prompt"
          className={cn(
            'max-w-2xl w-[calc(100vw-2rem)] p-8',
            'bg-[var(--canvas-elevated)] border-[var(--text-muted)]',
            'sm:w-full',
          )}
        >
          {/* Dialog Title (required for accessibility) */}
          <DialogTitle className="fluid-heading text-[var(--text-primary)] mb-2">
            {COLLECTION_PROMPT_COPY.headline}
          </DialogTitle>

          {/* Dialog Description (required for accessibility) */}
          <DialogDescription className="fluid-body text-[var(--text-muted)] mb-6">
            {COLLECTION_PROMPT_COPY.description}
          </DialogDescription>

          {/* Product Images Grid */}
          <div className={cn('grid grid-cols-2 gap-4 mb-6', 'sm:grid-cols-4')}>
            {VARIETY_PACK_PRODUCTS.map((product) => (
              <div key={product.handle} className="text-center">
                {/* Product image placeholder - will be replaced with actual Shopify images */}
                <div className="aspect-square bg-[var(--canvas-base)] rounded-lg mb-2">
                  {/* TODO: Replace with actual product image from Shopify */}
                  <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
                    {product.name}
                  </div>
                </div>
                <p className="text-sm text-[var(--text-primary)]">
                  {product.name}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button (Story 4.3, AC1, AC2, AC3) */}
          <button
            type="button"
            disabled={isLoading || isSuccess || !variantId}
            className={cn(
              'w-full py-3 px-6',
              'bg-[var(--accent-primary)] text-white',
              'rounded-lg',
              'font-semibold',
              'transition-opacity',
              'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2',
              // Touch target minimum (44x44px)
              'min-h-[44px] min-w-[44px]',
              // Disabled state (Story 4.3, AC2)
              (isLoading || isSuccess || !variantId) &&
                'opacity-60 cursor-not-allowed',
              // Hover only when enabled
              !(isLoading || isSuccess || !variantId) && 'hover:opacity-90',
            )}
            onClick={handleAddToCart}
          >
            {getButtonText()}
          </button>

          {/* Success announcement for screen readers (Story 4.3, AC3, Code Review) */}
          {isSuccess && (
            <div
              role="status"
              aria-live="polite"
              className="sr-only"
              aria-atomic="true"
            >
              Added! Variety pack added to cart.
            </div>
          )}

          {/* Error message (Story 4.3, AC7, Task 7) */}
          {isError && (
            <div
              role="status"
              aria-live="polite"
              className="mt-2 text-sm text-[var(--text-muted)] text-center"
            >
              {COLLECTION_PROMPT_ADD_ERROR_MESSAGE}
            </div>
          )}

          {/* Close Button (X) */}
          <DialogClose
            aria-label={COLLECTION_PROMPT_COPY.dismissLabel}
            className={cn(
              'absolute top-4 right-4',
              'w-11 h-11', // 44x44px minimum touch target
              'rounded-full',
              'flex items-center justify-center',
              'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2',
              'transition-colors',
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

/**
 * CollectionPromptWithAnimation component
 *
 * Wraps CollectionPrompt with Framer Motion animation
 * Uses Suspense for graceful fallback if Framer Motion fails
 * Respects prefers-reduced-motion
 */
export function CollectionPromptWithAnimation(props: CollectionPromptProps) {
  const shouldReduceMotion =
    typeof window !== 'undefined' && prefersReducedMotion();

  // If reduced motion, render static prompt (no animation)
  if (shouldReduceMotion) {
    return <CollectionPrompt {...props} />;
  }

  // Use Suspense with static fallback for Framer Motion dynamic import
  return (
    <Suspense fallback={<CollectionPrompt {...props} />}>
      <AnimatedPrompt {...props} />
    </Suspense>
  );
}

/**
 * AnimatedPrompt component (internal)
 * Uses Framer Motion for fade-in animation
 */
function AnimatedPrompt(props: CollectionPromptProps) {
  return (
    <MotionDiv
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1], // --ease-out-expo
      }}
    >
      <CollectionPrompt {...props} />
    </MotionDiv>
  );
}

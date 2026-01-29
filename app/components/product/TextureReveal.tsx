import * as React from 'react';
import {Suspense} from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {useOptimisticCart} from '@shopify/hydrogen';
import {useCollectionPromptTrigger} from '~/hooks/use-collection-prompt-trigger';
import {MotionDiv, prefersReducedMotion} from '~/lib/motion';
import {useExplorationStore} from '~/stores/exploration';
import {cn} from '~/utils/cn';
import {CollectionPromptWithAnimation} from './CollectionPrompt';
import {ProductRevealInfo} from './ProductRevealInfo';
import {ScentNarrative} from './ScentNarrative';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

/**
 * TextureReveal component props
 *
 * Props interface following project naming convention: ComponentNameProps
 */
export interface TextureRevealProps {
  /** Product data for display and accessibility */
  product: RecommendedProductFragment;
  /** Whether the reveal is currently open */
  isOpen: boolean;
  /** Callback when reveal should close */
  onClose: () => void;
  /** URL to the texture macro image (should be preloaded from Story 3.1) */
  textureImageUrl: string;
  /** Optional scent narrative copy to display after reveal animation */
  scentNarrative?: string;
  /** Callback when animation completes (for performance measurement) */
  onAnimationComplete?: () => void;
  /** Variety pack variant ID for collection prompt cart mutation (Story 4.3) */
  varietyPackVariantId?: string;
}

/**
 * TextureReveal - Texture macro image reveal component
 *
 * Displays product texture in an accessible dialog overlay.
 * Uses Radix Dialog for keyboard navigation and screen reader support.
 *
 * CRITICAL Performance Requirements:
 * - Images MUST be preloaded before reveal (Story 3.1)
 * - Animation must use GPU-composited properties ONLY (transform, opacity)
 * - <100ms from trigger to visual reveal (Performance Contract)
 *
 * Accessibility:
 * - Keyboard navigable (Enter/Space to open, Escape to close)
 * - Screen reader announces "Texture view expanded for [product name]"
 * - Focus trap when open, returns focus on close
 * - DOM/read order for content matches AC6:
 *   image → scent narrative → product name → price → description → Add to Cart
 */
/**
 * Animation variants for texture reveal
 * Uses GPU-composited properties only (transform: scale, opacity)
 * Duration: 300ms (--duration-reveal token)
 * Easing: cubic-bezier(0.16, 1, 0.3, 1) (--ease-out-expo)
 */
const revealVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3, // 300ms - matches --duration-reveal
      ease: [0.16, 1, 0.3, 1] as const, // --ease-out-expo
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2, // Faster exit
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
} as const;

export const TextureReveal = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  TextureRevealProps
>(
  (
    {
      product,
      isOpen,
      onClose,
      textureImageUrl,
      scentNarrative,
      onAnimationComplete,
      varietyPackVariantId,
    },
    ref,
  ) => {
    // Check for reduced motion preference
    const shouldReduceMotion = prefersReducedMotion();

    // Track when reveal animation has completed to show narrative
    const [revealAnimationComplete, setRevealAnimationComplete] =
      React.useState(false);

    // State for collection prompt (Story 4.2, Task 5)
    const [showCollectionPrompt, setShowCollectionPrompt] =
      React.useState(false);

    // Get exploration state actions
    const addProductExplored = useExplorationStore(
      (state) => state.addProductExplored,
    );
    const setStoryMomentShown = useExplorationStore(
      (state) => state.setStoryMomentShown,
    );

    // Get cart data for prompt trigger (Story 4.3, Task 1)
    const optimisticCart = useOptimisticCart();
    const cartLines = (optimisticCart?.lines as unknown as any)?.nodes || [];

    // Check if collection prompt should be triggered (Story 4.2 + 4.3)
    const {shouldShowPrompt} = useCollectionPromptTrigger({cartLines});

    // Reset animation completion state when dialog closes
    React.useEffect(() => {
      if (!isOpen) {
        setRevealAnimationComplete(false);
      } else if (shouldReduceMotion) {
        // For reduced motion, show narrative immediately
        setRevealAnimationComplete(true);
      }
    }, [isOpen, shouldReduceMotion]);

    // Handle animation completion for performance measurement (AC2, AC3)
    const handleAnimationComplete = React.useCallback(() => {
      // Only call callback when animation completes (not on exit)
      if (isOpen) {
        setRevealAnimationComplete(true);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    }, [isOpen, onAnimationComplete]);

    /**
     * Internal close handler - Story 3.5, Task 1 + Story 4.2, Task 5
     *
     * Single source of truth for all close mechanisms:
     * - Close button click (AC1)
     * - Outside click/tap on overlay (AC2)
     * - Escape key press (AC3)
     *
     * Responsibilities:
     * - Mark product as explored in exploration store (AC5)
     * - Check if collection prompt should be shown (Story 4.2)
     * - Trigger close animation (or instant close for reduced motion) (AC4)
     * - Invoke external onClose callback
     * - NO network requests (AC6)
     *
     * Focus management handled by Radix Dialog (AC7)
     */
    const handleCloseReveal = React.useCallback(() => {
      // Update exploration state: mark this product as explored
      // This runs on close so users who opened the reveal are tracked
      addProductExplored(product.id);

      // Trigger parent close handler
      // This updates parent state and triggers close animation
      onClose();

      // Story 4.2: After reveal closes, check if collection prompt should show
      // Wait for reveal exit animation to complete (~200ms) before showing prompt
      setTimeout(() => {
        if (shouldShowPrompt) {
          setShowCollectionPrompt(true);
          setStoryMomentShown(true); // Mark as shown to prevent re-trigger
        }
      }, 250); // Slightly longer than exit animation (200ms)
    }, [
      addProductExplored,
      product.id,
      onClose,
      shouldShowPrompt,
      setStoryMomentShown,
    ]);

    return (
      <>
        <DialogPrimitive.Root
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) handleCloseReveal();
          }}
        >
          <DialogPrimitive.Portal>
            {/* Overlay (click/tap to close - AC2) */}
            <DialogPrimitive.Overlay
              data-testid="texture-reveal-overlay"
              className={cn(
                'fixed inset-0 z-50 bg-black/80',
                'transition-opacity duration-300',
                'data-[state=closed]:opacity-0 data-[state=open]:opacity-100',
                'motion-reduce:transition-none',
              )}
            />

            {/* Content */}
            <DialogPrimitive.Content
              ref={ref}
              aria-label={`Texture view expanded for ${product.title}`}
              className={cn(
                'fixed left-[50%] top-[50%] z-[51]',
                'w-[90vw]',
                'translate-x-[-50%] translate-y-[-50%]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]',
              )}
            >
              {/* Visually hidden title for screen readers */}
              <DialogPrimitive.Title className="sr-only">
                {product.title} texture view
              </DialogPrimitive.Title>

              {/* Visually hidden description for screen readers */}
              <DialogPrimitive.Description className="sr-only">
                Close-up view of {product.title} soap texture showing detail and
                quality
              </DialogPrimitive.Description>

              {/* Texture image with Framer Motion animation */}
              {/* Suspense for lazy-loaded MotionDiv (graceful fallback) */}
              <Suspense
                fallback={
                  // Static fallback if Framer Motion fails to load (AC5)
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-[var(--canvas-elevated)]">
                    <img
                      src={textureImageUrl}
                      alt={`${product.title} texture close-up`}
                      loading="eager"
                      className="h-full w-full object-cover"
                    />
                    {/* Include content in fallback too, without motion dependencies */}
                    <div className="absolute bottom-0 left-0 right-0">
                      {/* Scent narrative */}
                      {scentNarrative && (
                        <div className="p-4 bg-gradient-to-t from-black/60 to-transparent">
                          <p className="text-fluid-body text-white italic">
                            {scentNarrative}
                          </p>
                        </div>
                      )}
                      {/* Product information - Story 3.4 */}
                      <ProductRevealInfo product={product} />
                    </div>
                  </div>
                }
              >
                <MotionDiv
                  initial="hidden"
                  animate={isOpen ? 'visible' : 'hidden'}
                  exit="exit"
                  variants={shouldReduceMotion ? undefined : revealVariants}
                  onAnimationComplete={handleAnimationComplete}
                  className="relative aspect-square overflow-hidden rounded-lg bg-[var(--canvas-elevated)]"
                >
                  <img
                    src={textureImageUrl}
                    alt={`${product.title} texture close-up`}
                    loading="eager"
                    className="h-full w-full object-cover"
                  />
                  {/* Content overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0">
                    {/* Scent narrative - fades in after reveal animation completes */}
                    {scentNarrative && (
                      <ScentNarrative
                        narrative={scentNarrative}
                        isVisible={revealAnimationComplete}
                      />
                    )}
                    {/* Product information - Story 3.4 - shows after animation */}
                    {revealAnimationComplete && (
                      <ProductRevealInfo product={product} />
                    )}
                  </div>
                </MotionDiv>
              </Suspense>

              {/* Close button for explicit dismissal (AC1: accessible label includes product name; 44px min touch target) */}
              <DialogPrimitive.Close
                className={cn(
                  'absolute right-4 top-4 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/90',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]',
                  'hover:bg-white transition-colors',
                )}
                aria-label={`Close texture view for ${product.title}`}
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
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>

        {/* Collection Prompt (Story 4.2 + 4.3) - animated, appears after reveal closes */}
        <CollectionPromptWithAnimation
          open={showCollectionPrompt}
          onClose={() => setShowCollectionPrompt(false)}
          variantId={varietyPackVariantId}
        />
      </>
    );
  },
);

TextureReveal.displayName = 'TextureReveal';

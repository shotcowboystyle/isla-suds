import * as React from 'react';
import {Suspense} from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {MotionDiv, prefersReducedMotion} from '~/lib/motion';
import {cn} from '~/utils/cn';
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
  /** Callback when animation completes (for performance measurement) */
  onAnimationComplete?: () => void;
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
>(({product, isOpen, onClose, textureImageUrl, onAnimationComplete}, ref) => {
  // Check for reduced motion preference
  const shouldReduceMotion = prefersReducedMotion();

  // Handle animation completion for performance measurement (AC2, AC3)
  const handleAnimationComplete = React.useCallback(() => {
    // Only call callback when animation completes (not on exit)
    if (isOpen && onAnimationComplete) {
      onAnimationComplete();
    }
  }, [isOpen, onAnimationComplete]);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
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
            'w-[90vw] max-w-2xl',
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
            </MotionDiv>
          </Suspense>

          {/* Close button for explicit dismissal */}
          <DialogPrimitive.Close
            className={cn(
              'absolute right-4 top-4 rounded-full bg-white/90 p-2',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]',
              'hover:bg-white transition-colors',
            )}
            aria-label="Close texture view"
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
  );
});

TextureReveal.displayName = 'TextureReveal';

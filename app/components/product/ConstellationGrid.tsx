import {useMemo, useState, useEffect, useCallback, useRef} from 'react';
import {useExplorationActions} from '~/hooks/use-exploration-state';
import {usePreloadImages} from '~/hooks/use-preload-images';
import {measureTextureReveal} from '~/lib/performance';
import {getOptimizedImageUrl} from '~/lib/shopify/preload';
import {cn} from '~/utils/cn';
import {ProductCard} from './ProductCard';
import {TextureReveal} from './TextureReveal';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

export interface ConstellationGridProps {
  products: RecommendedProductFragment[] | null;
  className?: string;
}

/**
 * ConstellationGrid component - Organic product layout
 *
 * Desktop (≥1024px):
 * - Organic positions with subtle rotations (-3° to +3°)
 * - CSS transform-based layout (no scroll listeners)
 * - Subtle hover effects (GPU-composited only)
 *
 * Mobile (<1024px):
 * - Simple 2-column grid
 * - No rotations
 * - Fluid from 320px to 1024px
 *
 * Accessibility:
 * - All cards keyboard focusable
 * - Focus order follows visual flow
 * - Visible focus indicators
 */
export function ConstellationGrid({
  products,
  className,
}: ConstellationGridProps) {
  // Hooks must be called unconditionally before any early returns
  const [focusedProductId, setFocusedProductId] = useState<string | null>(null);
  const [revealedProductId, setRevealedProductId] = useState<string | null>(
    null,
  );
  const {addProductExplored, incrementTextureReveals} = useExplorationActions();
  const gridRef = useRef<HTMLElement>(null);

  // Extract and optimize image URLs for preloading (Story 3.1, AC2)
  // Using featuredImage URLs as texture macro images will be in Story 3.2
  const imageUrls = useMemo(
    () =>
      products
        ?.map((product) => product.featuredImage?.url)
        .filter((url): url is string => Boolean(url))
        .map((url) => getOptimizedImageUrl(url)) ?? [],
    [products],
  );

  // Preload images when constellation approaches viewport (Story 3.1, AC2: fetchpriority)
  const preloadOptions = useMemo(() => ({fetchpriority: 'high' as const}), []);
  usePreloadImages(gridRef, imageUrls, preloadOptions);

  // Handle focus state and track exploration
  const handleProductFocus = useCallback(
    (productId: string) => {
      setFocusedProductId(productId);
      addProductExplored(productId);
    },
    [addProductExplored],
  );

  // Clear focus state
  const handleClearFocus = useCallback(() => {
    setFocusedProductId(null);
  }, []);

  // Handle texture reveal trigger (Story 3.2)
  const handleProductReveal = useCallback(
    (productId: string) => {
      // Track exploration and increment reveal counter
      addProductExplored(productId);
      incrementTextureReveals();

      // Mark start of texture reveal (AC2, AC3)
      if (typeof performance !== 'undefined') {
        performance.mark('texture-reveal-start');
      }

      // Set revealed product immediately for UI responsiveness
      setRevealedProductId(productId);
    },
    [addProductExplored, incrementTextureReveals],
  );

  // Handle animation completion for performance measurement (AC2, AC3)
  const handleAnimationComplete = useCallback(() => {
    // Mark end of texture reveal animation and create measure
    if (typeof performance !== 'undefined') {
      try {
        performance.mark('texture-reveal-end');
        performance.measure(
          'texture-reveal',
          'texture-reveal-start',
          'texture-reveal-end',
        );
      } catch (error) {
        // Safe to ignore: mark creation may fail if start mark missing
        if (import.meta.env.DEV) {
          console.warn('[TextureReveal] Performance mark failed:', error);
        }
      }
    }
  }, []);

  // Close texture reveal
  const handleCloseReveal = useCallback(() => {
    setRevealedProductId(null);
  }, []);

  // Handle click outside to clear focus (AC3: any click not on a product card clears)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!focusedProductId) return;
      const target = event.target as HTMLElement;
      // Clear when click is not on any product card (inside or outside section)
      if (!target.closest?.('.product-card')) {
        handleClearFocus();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [focusedProductId, handleClearFocus]);

  // Handle Escape key to clear focus
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && focusedProductId) {
        handleClearFocus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedProductId, handleClearFocus]);

  // Find the currently revealed product for TextureReveal component
  const revealedProduct = useMemo(
    () => products?.find((p) => p.id === revealedProductId) ?? null,
    [products, revealedProductId],
  );

  // Get texture image URL for revealed product (using featuredImage as texture for now)
  const textureImageUrl = useMemo(() => {
    if (!revealedProduct?.featuredImage?.url) return '';
    return getOptimizedImageUrl(
      revealedProduct.featuredImage.url,
      1200,
      'webp',
    );
  }, [revealedProduct]);

  // Early return after all hooks
  if (!products || products.length === 0) {
    return null;
  }

  // Full class strings so Tailwind JIT includes them (no dynamic concatenation).
  const rotationClasses = [
    'lg:rotate-[-2deg]',
    'lg:rotate-[3deg]',
    'lg:rotate-[-3deg]',
    'lg:rotate-[2deg]',
  ] as const;
  // Organic desktop placement: irregular grid areas so layout feels hand-placed (AC1).
  const placementClasses = [
    'lg:col-start-1 lg:row-start-1',
    'lg:col-start-3 lg:row-start-1',
    'lg:col-start-2 lg:row-start-2',
    'lg:col-start-1 lg:row-start-3',
  ] as const;

  return (
    <section
      ref={gridRef}
      className={cn(
        'constellation-grid',
        'py-[var(--space-2xl)] px-[var(--space-md)]',
        className,
      )}
      aria-label="Product constellation grid"
    >
      {/* Mobile: 2-column grid. Desktop: organic positions via custom grid placement + rotations */}
      <div
        className={cn(
          'grid grid-cols-2 gap-[var(--space-md)]',
          'lg:grid-cols-4 lg:gap-[var(--space-lg)] lg:max-w-6xl lg:mx-auto',
        )}
      >
        {products.map((product, index) => {
          const i = index % 4;
          const isFocused = focusedProductId === product.id;
          const isDimmed = focusedProductId !== null && !isFocused;

          return (
            <div
              key={product.id}
              className={cn('min-w-0', placementClasses[i])}
            >
              <ProductCard
                product={product}
                rotationClass={rotationClasses[i]}
                loading={index < 2 ? 'eager' : 'lazy'}
                isFocused={isFocused}
                isDimmed={isDimmed}
                onFocus={handleProductFocus}
                onClearFocus={handleClearFocus}
                onReveal={handleProductReveal}
              />
            </div>
          );
        })}
      </div>

      {/* Texture reveal modal (Story 3.2) */}
      {revealedProduct && (
        <TextureReveal
          product={revealedProduct}
          isOpen={revealedProductId !== null}
          onClose={handleCloseReveal}
          textureImageUrl={textureImageUrl}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </section>
  );
}

import {Link} from 'react-router';
import {Image, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useVariantUrl} from '~/lib/variant-url';
import {cn} from '~/utils/cn';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

export interface BundleCardProps {
  product: RecommendedProductFragment;
  /** Desktop-only rotation: use full Tailwind class string so JIT includes it (e.g. "lg:rotate-[3deg]"). */
  rotationClass?: string;
  loading?: 'eager' | 'lazy';
  /** Whether this card is currently focused (Story 2.4) */
  isFocused?: boolean;
  /** Whether this card should be dimmed because another is focused (Story 2.4) */
  isDimmed?: boolean;
  /** Callback when card enters focused state (Story 2.4) */
  onFocus?: (productId: string) => void;
  /** Callback to clear all focus state (Story 2.4) */
  onClearFocus?: () => void;
  /** Callback when texture reveal should trigger (Story 3.2) */
  onReveal?: (productId: string) => void;
}

/**
 * BundleCard component for variety pack bundle display (Story 3.6)
 *
 * Renders the bundle (The Collection) with:
 * - Distinct visual differentiation (subtle border/badge)
 * - "The Collection" label
 * - Same interaction patterns as ProductCard
 * - Keyboard accessible with visible focus
 * - Responsive layout (organic desktop, 2-col mobile)
 */
export function BundleCard({
  product,
  rotationClass,
  loading,
  isFocused = false,
  isDimmed = false,
  onFocus,
  onClearFocus,
  onReveal,
}: BundleCardProps) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const variantId = product.variants.nodes[0]?.id;

  // Handle hover/tap to focus and reveal (Story 2.4, Story 3.2)
  const handleMouseEnter = () => {
    if (onFocus) {
      onFocus(product.id);
    }
    if (onReveal) {
      onReveal(product.id);
    }
  };

  // Handle click for mobile tap reveal (Story 3.2)
  const handleClick = (event: React.MouseEvent) => {
    if (onReveal) {
      event.preventDefault(); // Prevent navigation when triggering reveal
      onReveal(product.id);
    }
  };

  // Handle keyboard activation (Enter/Space) for focus and reveal (Story 2.4, Story 3.2)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent default link navigation on Space
      if (onFocus) {
        onFocus(product.id);
      }
      if (onReveal) {
        onReveal(product.id);
      }
    }
  };

  return (
    <Link
      className={cn(
        'product-card group block',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) focus-visible:ring-offset-2',
        'transition-all duration-300',
        // Hover effect on desktop only (GPU-composited)
        'lg:hover:scale-[1.02] lg:hover:z-10',
        // Desktop-only rotation; full class names from parent so Tailwind emits CSS
        rotationClass,
        // Focus state (Story 2.4) - GPU-composited properties only
        isFocused && 'scale-[1.02] shadow-lg z-10',
        // Dimmed state when another card is focused (Story 2.4)
        isDimmed && 'opacity-60',
      )}
      prefetch="intent"
      to={variantUrl}
      aria-label={`${product.title}, all four soaps, activate to view details`}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-bundle="true"
    >
      <div
        className={cn(
          'relative aspect-square overflow-hidden rounded-lg bg-(--canvas-elevated)',
          // Bundle differentiation: subtle border with accent color (Story 3.6, AC1)
          'ring-2 ring-(--accent-primary)/20',
        )}
      >
        {/* AC1: Single featuredImage; use a composite image in Shopify for "all 4" imagery */}
        {image ? (
          <Image
            alt={image.altText || ''}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="size-full bg-(--canvas-elevated)" aria-hidden title="" />
        )}

        {/* Bundle badge overlay (Story 3.6, AC1) */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-(--accent-primary) text-white text-xs font-medium rounded">
          Bundle
        </div>
      </div>

      <div className="mt-(--space-sm) px-(--space-sm)">
        <h3 className="text-fluid-small font-medium text-(--text-primary)">{product.title}</h3>
        {/* Subtle indicator that this is all 4 soaps (Story 3.6, AC2) */}
        <p className="text-xs text-(--text-muted) mt-1">All 4 soaps</p>

        {/* Add to Cart Button (Story 5.3) */}
        <div
          className="mt-[var(--space-sm)]"
          onClick={(e) => {
            // Stop propagation to prevent link navigation when clicking button
            e.stopPropagation();
          }}
        >
          {variantId ? (
            <AddToCartButton
              lines={
                [
                  {
                    merchandiseId: variantId,
                    quantity: 1,
                  },
                ] as OptimisticCartLineInput[]
              }
              analytics={{
                products: [product],
                totalValue: parseFloat(product.priceRange.minVariantPrice.amount),
              }}
            >
              Add to Cart
            </AddToCartButton>
          ) : (
            <div className="text-sm text-(--text-muted) text-center" role="alert">
              Product unavailable
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

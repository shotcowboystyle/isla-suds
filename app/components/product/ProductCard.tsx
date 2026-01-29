import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variant-url';
import {cn} from '~/utils/cn';
import type {RecommendedProductFragment} from 'storefrontapi.generated';

export interface ProductCardProps {
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
 * ProductCard component for constellation grid display
 *
 * Renders a single product with:
 * - Image with aspect ratio (prevents CLS)
 * - Optional rotation (desktop only)
 * - Keyboard accessible with visible focus
 * - Meaningful alt text
 */
export function ProductCard({
  product,
  rotationClass,
  loading,
  isFocused = false,
  isDimmed = false,
  onFocus,
  onClearFocus,
  onReveal,
}: ProductCardProps) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

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
      data-testid="product-card"
      className={cn(
        'product-card group block',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2',
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
      aria-label={`View ${product.title}`}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="aspect-square overflow-hidden rounded-lg bg-[var(--canvas-elevated)]">
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
          <div
            className="size-full bg-[var(--canvas-elevated)]"
            aria-hidden
            title=""
          />
        )}
      </div>

      <div className="mt-[var(--space-sm)] px-[var(--space-sm)]">
        <h3
          data-testid="product-name"
          className="text-fluid-small font-medium text-[var(--text-primary)]"
        >
          {product.title}
        </h3>
        <p
          data-testid="product-price"
          className="text-fluid-small text-[var(--text-muted)] mt-[var(--space-xs)]"
        >
          ${product.priceRange.minVariantPrice.amount}
        </p>
      </div>
    </Link>
  );
}

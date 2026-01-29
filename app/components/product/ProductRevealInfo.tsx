import * as React from 'react';
import {type OptimisticCartLineInput} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {
  BUNDLE_HANDLE,
  getProductDescription,
  getBundleValueProposition,
} from '~/content/products';
import {cn} from '~/utils/cn';
import {formatMoney} from '~/utils/format-money';
import type {
  MoneyFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';

/**
 * ProductRevealInfo component props
 *
 * Props interface following project naming convention: ComponentNameProps
 */
export interface ProductRevealInfoProps {
  /** Product data from Storefront API */
  product: RecommendedProductFragment;
  /**
   * Optional variant price (e.g., from a selected variant).
   * If provided, this price takes precedence over product.priceRange.
   */
  variantPrice?: MoneyFragment;
  /** Optional className for styling customization */
  className?: string;
}

/**
 * ProductRevealInfo - Display product name, price, and description in texture reveal
 *
 * Shows product purchase context within the TextureReveal dialog:
 * - Product name with fluid-heading typography
 * - Formatted price with currency symbol
 * - Brief description (1-2 sentences)
 * - Add to Cart button (styled placeholder until Epic 5)
 *
 * Accessibility:
 * - 4.5:1 contrast for all text (WCAG 2.1 AA)
 * - Keyboard-focusable button with visible focus ring
 * - Accessible button label includes product name
 *
 * Story 3.4 - AC1, AC2, AC3, AC4, AC6
 */
export const ProductRevealInfo = React.forwardRef<
  HTMLDivElement,
  ProductRevealInfoProps
>(({product, variantPrice, className}, ref) => {
  // Prefer selected variant price when provided; fall back to product minVariantPrice (AC2)
  const money = variantPrice ?? product.priceRange.minVariantPrice;

  // Format price with currency symbol and locale-aware formatting (AC2)
  const formattedPrice = formatMoney(money.amount, money.currencyCode);

  // Detect bundle product (Story 3.6)
  const isBundle = product.handle === BUNDLE_HANDLE;
  const variantId = product.variants.nodes[0]?.id;

  // Get bundle value proposition if this is a bundle (Story 3.6, Task 4)
  const bundleValueProp = isBundle
    ? getBundleValueProposition(
        product.handle,
        product.bundleValueProposition?.value,
      )
    : null;

  // Get description with fallback (AC3)
  const description = getProductDescription(
    product.handle,
    product.description,
  );

  // Truncate description to 1-2 sentences if needed
  const truncatedDescription = React.useMemo(() => {
    if (!description) return '';

    // Split by sentence boundaries (., !, ?)
    const sentences = description.match(/[^.!?]+[.!?]+/g) || [description];

    // Take first 2 sentences maximum
    const brief = sentences.slice(0, 2).join(' ').trim();

    return brief;
  }, [description]);

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-3 p-4',
        'bg-gradient-to-t from-black/60 to-transparent',
        className,
      )}
    >
      {/* Product name with fluid-heading typography (AC1) */}
      <h3 className="text-fluid-heading text-white font-semibold">
        {product.title}
      </h3>

      {/* Bundle value proposition (Story 3.6, Task 4) */}
      {bundleValueProp && (
        <p className="text-fluid-body text-white/90 italic">
          {bundleValueProp}
        </p>
      )}

      {/* Formatted price (AC2) */}
      <p className="text-fluid-body text-white font-medium">{formattedPrice}</p>

      {/* Brief description (AC3) */}
      {truncatedDescription && (
        <p className="text-fluid-body text-white/90 leading-relaxed">
          {truncatedDescription}
        </p>
      )}

      {/* Add to Cart button (Story 5.3 for bundles) (AC4, AC6) */}
      {isBundle ? (
        <div className="mt-2">
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
                totalValue: parseFloat(money.amount),
              }}
            >
              Add to Cart
            </AddToCartButton>
          ) : (
            <div
              className="text-fluid-body text-white/90 text-center"
              role="alert"
            >
              Product unavailable
            </div>
          )}
        </div>
      ) : (
        // Placeholder button for individual products (until Story 5.2 adds real functionality)
        <button
          type="button"
          disabled
          aria-label={`Add ${product.title} to cart — Available in bundle only`}
          title="Individual soaps available in the variety pack bundle"
          className={cn(
            'mt-2 px-6 py-3 rounded-lg',
            'bg-[var(--accent-primary)] text-white font-semibold',
            'opacity-50 cursor-not-allowed',
          )}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
});

ProductRevealInfo.displayName = 'ProductRevealInfo';

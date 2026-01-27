/**
 * Product Variant Factory
 *
 * Creates test variant data for product option testing.
 * Compatible with Shopify Storefront API variant structure.
 */

export type TestVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  } | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
};

let variantIdCounter = 1;

/**
 * Create a test product variant
 *
 * @example
 * const variant = createVariant({ availableForSale: false });
 * const sizeVariant = createVariant({
 *   selectedOptions: [{ name: 'Size', value: 'Large' }]
 * });
 */
export function createVariant(
  overrides: Partial<TestVariant> = {},
): TestVariant {
  const variantId = `gid://shopify/ProductVariant/${variantIdCounter++}`;

  return {
    id: variantId,
    title: 'Default Title',
    availableForSale: true,
    price: {
      amount: '29.99',
      currencyCode: 'USD',
    },
    compareAtPrice: null,
    selectedOptions: [],
    ...overrides,
  };
}

/**
 * Create multiple variants (useful for products with multiple options)
 *
 * @example
 * const sizeVariants = createVariants([
 *   { selectedOptions: [{ name: 'Size', value: 'Small' }] },
 *   { selectedOptions: [{ name: 'Size', value: 'Large' }] },
 * ]);
 */
export function createVariants(
  variantOverrides: Array<Partial<TestVariant>>,
): TestVariant[] {
  return variantOverrides.map((override) => createVariant(override));
}

/**
 * Reset factory counter (useful for test isolation)
 */
export function resetVariantFactory(): void {
  variantIdCounter = 1;
}

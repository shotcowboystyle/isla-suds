/**
 * Product Factory
 *
 * Creates test product data with faker for parallel-safe test execution.
 * Install @faker-js/faker for random data generation.
 */

// TODO: Install @faker-js/faker for production use
// import {faker} from '@faker-js/faker';

/**
 * Test product data structure compatible with Shopify Storefront API.
 */
export type TestProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  price?: number;
  compareAtPrice?: number;
  variantId?: string;
};

let productIdCounter = 1;

/**
 * Create a test product with optional overrides
 *
 * @example
 * const product = createProduct({ title: 'Test Soap' });
 * const unavailableProduct = createProduct({ availableForSale: false });
 */
export function createProduct(overrides: Partial<TestProduct> = {}): TestProduct {
  const id = `gid://shopify/Product/${productIdCounter++}`;

  return {
    id,
    title: `Test Product ${productIdCounter}`,
    handle: `test-product-${productIdCounter}`,
    description: 'A test product for automated testing',
    availableForSale: true,
    price: 29.99,
    compareAtPrice: 39.99,
    variantId: `gid://shopify/ProductVariant/${productIdCounter}`,
    ...overrides,
  };
}

/**
 * Create multiple test products
 *
 * @example
 * const products = createProducts(5);
 */
export function createProducts(count: number): TestProduct[] {
  return Array.from({length: count}, () => createProduct());
}

/**
 * Reset factory counter (useful for test isolation)
 */
export function resetProductFactory(): void {
  productIdCounter = 1;
}

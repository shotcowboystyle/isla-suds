/**
 * Product Fixture
 *
 * Provides product testing utilities with automatic cleanup.
 */

import {test as base} from '@playwright/test';
import {createProduct, resetProductFactory} from '../factories/product.factory';

type ProductFixture = {
  /**
   * Create a product with test data
   */
  testProduct: ReturnType<typeof createProduct>;
};

export const test = base.extend<ProductFixture>({
  testProduct: async ({page}, use) => {
    // Setup: Create product with factory
    const product = createProduct();

    // Provide to test
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(product);

    // Cleanup: Reset factory (ensures test isolation)
    resetProductFactory();
  },
});

export {expect} from '@playwright/test';

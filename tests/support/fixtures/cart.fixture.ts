/**
 * Cart Fixture
 *
 * Provides cart testing utilities with automatic cleanup.
 */

import {test as base} from '@playwright/test';
import {createCart, resetCartFactory} from '../factories/cart.factory';

type CartFixture = {
  /**
   * Create a cart with test data
   */
  testCart: ReturnType<typeof createCart>;
};

export const test = base.extend<CartFixture>({
  testCart: async ({page}, use) => {
    // Setup: Create cart with factory
    const cart = createCart({lineCount: 2});

    // Provide to test
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(cart);

    // Cleanup: Reset factory (ensures test isolation)
    resetCartFactory();
  },
});

export {expect} from '@playwright/test';

/**
 * Cart Factory
 *
 * Creates test cart data for cart flow testing.
 * Compatible with Shopify Storefront API cart structure.
 */

export type TestCartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
    };
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
};

export type TestCart = {
  id: string;
  lines: {
    nodes: TestCartLine[];
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  totalQuantity: number;
};

let cartIdCounter = 1;
let lineIdCounter = 1;

/**
 * Create a test cart line item
 *
 * @example
 * const line = createCartLine({ quantity: 2 });
 */
export function createCartLine(
  overrides: Partial<TestCartLine> = {},
): TestCartLine {
  const lineId = `gid://shopify/CartLine/${lineIdCounter++}`;
  const merchandiseId = `gid://shopify/ProductVariant/${lineIdCounter}`;

  return {
    id: lineId,
    quantity: 1,
    merchandise: {
      id: merchandiseId,
      title: 'Test Variant',
      product: {
        title: 'Test Product',
        handle: 'test-product',
      },
    },
    cost: {
      totalAmount: {
        amount: '29.99',
        currencyCode: 'USD',
      },
    },
    ...overrides,
  };
}

/**
 * Create a test cart with optional lines
 *
 * @example
 * const emptyCart = createCart();
 * const cartWithItems = createCart({ lineCount: 3 });
 */
export function createCart(options: {lineCount?: number} = {}): TestCart {
  const {lineCount = 0} = options;
  const cartId = `gid://shopify/Cart/${cartIdCounter++}`;

  const lines = Array.from({length: lineCount}, () => createCartLine());

  const totalAmount = lines.reduce((sum, line) => {
    return sum + parseFloat(line.cost.totalAmount.amount) * line.quantity;
  }, 0);

  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    id: cartId,
    lines: {
      nodes: lines,
    },
    cost: {
      totalAmount: {
        amount: totalAmount.toFixed(2),
        currencyCode: 'USD',
      },
    },
    totalQuantity,
  };
}

/**
 * Reset factory counters (useful for test isolation)
 */
export function resetCartFactory(): void {
  cartIdCounter = 1;
  lineIdCounter = 1;
}

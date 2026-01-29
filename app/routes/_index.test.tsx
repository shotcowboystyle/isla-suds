import {describe, it, expect, vi} from 'vitest';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';

/**
 * Tests for _index route loader - Bundle support (Story 3.6, Task 1)
 *
 * Verifies:
 * - Loader queries for 5 products (4 individuals + 1 bundle)
 * - Bundle product metafields are fetched
 * - Query has explicit limit (no unbounded queries)
 */

describe('_index loader - bundle support', () => {
  it('queries for 5 products including variety pack bundle', async () => {
    // Mock storefront context - handles both queries via implementation check
    const mockStorefront = {
      query: vi.fn().mockImplementation((queryString: string) => {
        // Return appropriate response based on which query is called
        if (queryString.includes('FeaturedCollection')) {
          return Promise.resolve({
            collections: {
              nodes: [{id: 'gid://shopify/Collection/1', title: 'Featured'}],
            },
          });
        }
        if (queryString.includes('RecommendedProducts')) {
          return Promise.resolve({
            products: {
              nodes: [
                {id: 'gid://shopify/Product/1', handle: 'lavender-dreams'},
                {id: 'gid://shopify/Product/2', handle: 'citrus-sunrise'},
                {id: 'gid://shopify/Product/3', handle: 'forest-calm'},
                {id: 'gid://shopify/Product/4', handle: 'ocean-breeze'},
                {
                  id: 'gid://shopify/Product/5',
                  handle: 'four-bar-variety-pack',
                },
              ],
            },
          });
        }
        return Promise.resolve({});
      }),
    };

    const mockContext = {
      storefront: mockStorefront,
    };

    // Dynamic import to avoid module-level side effects
    const {loader} = await import('./_index');

    // Call loader
    await loader({
      context: mockContext,
      params: {},
      request: new Request('http://localhost:3000/'),
    } as any);

    // Find the products query call
    const productsQueryCall = mockStorefront.query.mock.calls.find((call) =>
      call[0].includes('RecommendedProducts'),
    );
    expect(productsQueryCall).toBeDefined();

    const productsQueryString = productsQueryCall?.[0];

    // Assert query contains "first: 5" for explicit limit
    expect(productsQueryString).toContain('first: 5');
  });

  it('fetches bundle value proposition metafield', async () => {
    // Mock query response with bundle metafields
    const mockStorefront = {
      query: vi.fn().mockImplementation((queryString: string) => {
        if (queryString.includes('FeaturedCollection')) {
          return Promise.resolve({
            collections: {
              nodes: [{id: 'gid://shopify/Collection/1', title: 'Featured'}],
            },
          });
        }
        if (queryString.includes('RecommendedProducts')) {
          return Promise.resolve({
            products: {
              nodes: [
                {
                  id: 'gid://shopify/Product/5',
                  handle: 'four-bar-variety-pack',
                  bundleValueProposition: {
                    value:
                      'All four soaps, one price. Rotate scents with your mood.',
                  },
                },
              ],
            },
          });
        }
        return Promise.resolve({});
      }),
    };

    const mockContext = {
      storefront: mockStorefront,
    };

    const {loader} = await import('./_index');

    await loader({
      context: mockContext,
      params: {},
      request: new Request('http://localhost:3000/'),
    } as any);

    const productsQueryCall = mockStorefront.query.mock.calls.find((call) =>
      call[0].includes('RecommendedProducts'),
    );
    const queryString = productsQueryCall?.[0];

    // Assert query includes bundleValueProposition metafield
    expect(queryString).toContain('bundleValueProposition');
    expect(queryString).toContain('custom');
    expect(queryString).toContain('bundle_value_proposition');
  });

  it('loader returns typed bundle data', async () => {
    // Mock complete bundle product
    const mockBundleProduct = {
      id: 'gid://shopify/Product/5',
      handle: 'four-bar-variety-pack',
      title: 'The Collection',
      description: 'All four handcrafted soaps together',
      priceRange: {
        minVariantPrice: {
          amount: '48.00',
          currencyCode: 'USD',
        },
      },
      featuredImage: {
        id: 'gid://shopify/ProductImage/1',
        url: 'https://cdn.shopify.com/bundle.jpg',
        altText: 'Four bar variety pack',
        width: 1200,
        height: 1200,
      },
      scentNarrative: {
        value: 'Four distinct journeys. One complete experience.',
      },
      bundleValueProposition: {
        value: 'All four soaps, one price. Rotate scents with your mood.',
      },
    };

    const mockStorefront = {
      query: vi.fn().mockImplementation((queryString: string) => {
        if (queryString.includes('FeaturedCollection')) {
          return Promise.resolve({
            collections: {
              nodes: [{id: 'gid://shopify/Collection/1', title: 'Featured'}],
            },
          });
        }
        if (queryString.includes('RecommendedProducts')) {
          return Promise.resolve({
            products: {
              nodes: [mockBundleProduct],
            },
          });
        }
        return Promise.resolve({});
      }),
    };

    const mockContext = {
      storefront: mockStorefront,
    };

    const {loader} = await import('./_index');

    const result = await loader({
      context: mockContext,
      params: {},
      request: new Request('http://localhost:3000/'),
    } as any);

    // Verify loader returns promise for recommended products
    expect(result.recommendedProducts).toBeDefined();

    // Await the deferred data
    const data = await result.recommendedProducts;

    // Verify bundle product is in results
    const bundleProduct = data?.products.nodes.find(
      (p: any) => p.handle === 'four-bar-variety-pack',
    );

    expect(bundleProduct).toBeDefined();
    expect(bundleProduct?.title).toBe('The Collection');
    expect(bundleProduct?.bundleValueProposition?.value).toBe(
      'All four soaps, one price. Rotate scents with your mood.',
    );
  });
});

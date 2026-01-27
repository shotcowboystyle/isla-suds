import {Suspense} from 'react';
import {Await, useLoaderData, Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import {HeroSection} from '~/components/story';
import {cn} from '~/utils/cn';
import type {Route} from './+types/_index';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <HeroSection />
      {/* Story 2.2: Snap sections for mobile scroll-snap */}
      <FeaturedCollection
        collection={data.featuredCollection}
        className="snap-start"
      />
      <RecommendedProducts
        products={data.recommendedProducts}
        className="snap-start"
      />
    </div>
  );
}

function FeaturedCollection({
  collection,
  className,
}: {
  collection: FeaturedCollectionFragment;
  className?: string;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className={cn('featured-collection', className)}
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}

      <h2>{collection.title}</h2>
    </Link>
  );
}

function RecommendedProducts({
  products,
  className,
}: {
  products: Promise<RecommendedProductsQuery | null>;
  className?: string;
}) {
  return (
    <div className={cn('recommended-products', className)}>
      <h2>Recommended Products</h2>
      <Suspense
        fallback={
          <div
            className="min-h-[280px] grid grid-cols-2 sm:grid-cols-4 gap-4"
            aria-hidden
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-[var(--canvas-elevated)] rounded animate-pulse"
              />
            ))}
          </div>
        }
      >
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

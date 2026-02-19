import {useRef} from 'react';
import {redirect, useLoaderData} from 'react-router';
import {useGSAP} from '@gsap/react';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {TestimonialsSection} from '~/components/story';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import type {Route} from './+types/collections.$handle';
import type {ProductItemFragment} from 'storefrontapi.generated';

gsap.registerPlugin(ScrollTrigger);

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
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
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = textRef.current;
      if (!el) return;

      const distance = el.offsetWidth / 2; // Assuming duplicated text for seamless loop

      // Simple continuous scroll
      gsap.to(el, {
        x: -distance,
        duration: 20,
        ease: 'none',
        repeat: -1,
      });
    },
    {scope: containerRef},
  );

  return (
    <div className="collection">
      <div ref={containerRef} className="bg-milk pt-[20vw] pb-[60px] md:pt-[120px] lg:pt-[130px]">
        {collection.title === 'Featured' ? (
          <div ref={containerRef} className="overflow-hidden whitespace-nowrap py-4">
            <div ref={textRef} className="inline-block">
              <h1 className="-tracking-[1.1vw] uppercase mr-[6vw] text-[23.5vw] bolder leading-[105%] text-black text-nowrap inline-block">
                Explore
                <span className="text-accent mx-20">Our Full</span>
                Collection
              </h1>
              <h1 className="-tracking-[1.1vw] uppercase mr-[6vw] text-[23.5vw] bolder leading-[105%] text-black text-nowrap inline-block">
                Explore
                <span className="text-accent">Our Full</span>
                Collection
              </h1>
            </div>
          </div>
        ) : (
          <h1 className="text-black">{collection.title}</h1>
        )}

        {collection.title === 'Featured' ? (
          <div className="justify-center items-center mt-[3vw] flex sm:px-4 text-center">
            <p className="collection-description text-[4.5vw] md:text-[1.04vw] leading-[115%] w-full px-[5vw] pb-[5vw] text-black">
              Browse all our bold and fresh cleansers, ready to fuel your next bath. Discover your favorite today!
            </p>
          </div>
        ) : (
          <p className="collection-description">{collection.description}</p>
        )}

        <div className="pb-[4vw] sm:px-4 md:px-[2vw] my-[4vw] md:my-[10vw]">
          <PaginatedResourceSection<ProductItemFragment>
            connection={collection.products}
            resourcesClassName="products-grid grid gap-4 auto-cols-[1fr] grid-cols-[1fr] sm:grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr] grid-rows-[auto_auto]"
          >
            {({node: product, index}) => (
              <ProductItem key={product.id} product={product} loading={index < 8 ? 'eager' : undefined} />
            )}
          </PaginatedResourceSection>
        </div>

        <TestimonialsSection />

        <Analytics.CollectionView
          data={{
            collection: {
              id: collection.id,
              handle: collection.handle,
            },
          }}
        />
      </div>
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

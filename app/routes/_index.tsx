import {lazy, Suspense, useEffect, useRef, useState, type RefObject} from 'react';
import {Await, useLoaderData, Link, useOutletContext, useLocation} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {ConstellationGrid} from '~/components/product';
import {HeroSection} from '~/components/story/HeroSection';
import {productsListHandles} from '~/content/products';
import {cn} from '~/utils/cn';
import type {Route} from './+types/_index';
import type {ScrollSmoother as ScrollSmootherType} from 'gsap/ScrollSmoother';
import type {FeaturedCollectionFragment, RecommendedProductsQuery, ProductsListQuery} from 'storefrontapi.generated';

const MessageSection = lazy(() =>
  import('~/components/story/MessageSection').then((m) => ({default: m.MessageSection})),
);
const ProductsList = lazy(() => import('~/components/story/ProductsList').then((m) => ({default: m.ProductsList})));
const IngredientsSection = lazy(() =>
  import('~/components/story/Ingredients').then((m) => ({default: m.IngredientsSection})),
);
const BenefitsSection = lazy(() => import('~/components/story/Benefits').then((m) => ({default: m.BenefitsSection})));
const VideoSection = lazy(() => import('~/components/story/VideoSection').then((m) => ({default: m.VideoSection})));
const TestimonialsSection = lazy(() =>
  import('~/components/story/Testimonials').then((m) => ({default: m.TestimonialsSection})),
);
const LocalStores = lazy(() => import('~/components/story/LocalStores').then((m) => ({default: m.LocalStores})));

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Isla Suds | Gentle Goat Milk Soap for Sensitive Skin'},
    {
      name: 'description',
      content:
        'Isla Suds crafts gentle, unscented goat milk soap for sensitive and reactive skin. 100% clean, natural ingredients — no dyes, no fragrances, just nourishing care.',
    },
  ];
};

const PRODUCTS_LIST_QUERY = `#graphql
  query ProductsList(
    $country: CountryCode
    $language: LanguageCode
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: 10, query: $query) {
      nodes {
        id
        title
        handle
        availableForSale
        variants(first: 1) {
          nodes {
            id
            title
            availableForSale
            image {
              url
              altText
              width
              height
            }
            price {
              amount
              currencyCode
            }
            product {
              title
              handle
            }
          }
        }
      }
    }
  }
` as const;

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
  const [{collections}, {products}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(PRODUCTS_LIST_QUERY, {
      variables: {
        query: productsListHandles.map((handle) => `(handle:${handle})`).join(' OR '),
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
  ]);

  return {
    featuredCollection: collections.nodes[0],
    productsList: products.nodes,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront.query(RECOMMENDED_PRODUCTS_QUERY).catch((error: Error) => {
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
  const localHeroRef = useRef<HTMLElement>(null);
  const outletContext = useOutletContext() as {heroRef?: RefObject<HTMLElement>} | undefined;
  const heroRef = outletContext?.heroRef ?? localHeroRef;

  const location = useLocation();
  const smootherRef = useRef<ScrollSmootherType | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([import('gsap'), import('gsap/ScrollSmoother'), import('gsap/ScrollTrigger'), import('@gsap/react')])
      .then(([{default: gsap}, {ScrollSmoother}, {ScrollTrigger}, {useGSAP}]) => {
        if (cancelled) {
          return;
        }

        gsap.registerPlugin(ScrollSmoother, ScrollTrigger, useGSAP);

        // Refresh ScrollTrigger to ensure start/end positions are correct
        ScrollTrigger.refresh();

        smootherRef.current = ScrollSmoother.create({
          smooth: 3, // Smoothness duration in seconds
          effects: true, // Enable data-speed and data-lag effects
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          normalizeScroll: true, // Normalizes touch/wheel events for smoother scrolling
          ignoreMobileResize: true, // Prevents resizing issues on mobile
        });
      })
      .catch((error: Error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
      if (smootherRef.current) {
        smootherRef.current.kill();
        smootherRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    smootherRef.current?.scrollTo(0, false);
  }, [location.pathname]);

  return (
    <div className="home">
      <div className={cn('flex flex-col bg-transparent')}>
        <div className="block bg-black overflow-hidden">
          <HeroSection ref={heroRef} />
        </div>

        <div className="z-1">
          <Suspense fallback={null}>
            <MessageSection />
            <ProductsList products={data.productsList} />
            <IngredientsSection />
            <div className="block bg-black relative">
              <BenefitsSection />
              <VideoSection />
            </div>
            <TestimonialsSection />
            <LocalStores />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function FeaturedCollection({collection, className}: {collection: FeaturedCollectionFragment; className?: string}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link className={cn('featured-collection', className)} to={`/collections/${collection.handle}`}>
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}

      <h2 className="text-black">{collection.title}</h2>
    </Link>
  );
}

function ConstellationProducts({
  products,
  className,
}: {
  products: Promise<RecommendedProductsQuery | null>;
  className?: string;
}) {
  return (
    <Suspense
      fallback={
        <div className={cn('min-h-[400px] px-4 py-12', className)} aria-hidden aria-label="Loading products">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 lg:max-w-6xl lg:mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-(--canvas-elevated) rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <Await resolve={products}>
        {(response: RecommendedProductsQuery | null) => (
          <ConstellationGrid products={response?.products.nodes || null} className={className} />
        )}
      </Await>
    </Suspense>
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
    description
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
    variants(first: 1) {
      nodes {
        id
      }
    }
    scentNarrative: metafield(namespace: "custom", key: "scent_narrative") {
      value
    }
    bundleValueProposition: metafield(namespace: "custom", key: "bundle_value_proposition") {
      value
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 5, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

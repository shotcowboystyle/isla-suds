import {Suspense, useEffect, useRef, useState, type RefObject} from 'react';
import {Await, useLoaderData, Link, useOutletContext, useLocation} from 'react-router';
import {useGSAP} from '@gsap/react';
import {Image} from '@shopify/hydrogen';
import GSAP from 'gsap';
import {ScrollSmoother} from 'gsap/ScrollSmoother';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ConstellationGrid} from '~/components/product';
import {
  BenefitsSection,
  HeroSection,
  // InfiniteMarquee,
  IngredientsSection,
  LocalStores,
  MessageSection,
  // Philosophy,
  ProductsList,
  // StickyPlaySection,
  // StoryFragmentContainer,
  TestimonialsSection,
  VideoSection,
} from '~/components/story';
import {cn} from '~/utils/cn';
import type {Route} from './+types/_index';
import type {FeaturedCollectionFragment, RecommendedProductsQuery} from 'storefrontapi.generated';

GSAP.registerPlugin(ScrollSmoother, ScrollTrigger, useGSAP);

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

  const [isTouch, setIsTouch] = useState(false);

  const location = useLocation();
  const smootherRef = useRef<ScrollSmoother | null>(null);

  // useEffect(() => {
  //   const handleOnLoad = () => {
  //     ScrollTrigger.refresh();
  //   };

  //   window.addEventListener('load', () => handleOnLoad);
  //   return () => window.addEventListener('load', () => handleOnLoad);
  // }, []);

  useEffect(() => {
    const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsTouch(touchQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    touchQuery.addEventListener('change', handleChange);
    return () => touchQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (isTouch) {
      const lastWidth = window.innerWidth;

      const handleResize = () => {
        const currentWidth = window.innerWidth;
        if (currentWidth === lastWidth || currentWidth < lastWidth + 100) return;

        ScrollTrigger.refresh();
        window.location.reload();
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isTouch]);

  useGSAP(
    () => {
      if (!isTouch) {
        // create the scrollSmoother before your scrollTriggers
        smootherRef.current = ScrollSmoother.create({
          smooth: 2, // how long (in seconds) it takes to "catch up" to the native scroll position
          effects: false, // looks for data-speed and data-lag attributes on elements
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          normalizeScroll: true,
          ignoreMobileResize: true,
        });
      }
    },
    {dependencies: [isTouch], revertOnUpdate: true},
  );

  useGSAP(() => {
    smootherRef.current?.scrollTo(0, false);
  }, [location.pathname]);

  return (
    <div id="smooth-wrapper" className="home">
      <div id="smooth-content" className="flex flex-col pb-[100vh] z-0">
        <div className="block bg-black overflow-hidden z-2">
          <HeroSection ref={heroRef} />
        </div>

        {/* <div className="overflow-scroll mb-[100vh] z-2"> */}
        <div className="overflow-scroll z-2">
          <MessageSection />
          <ProductsList />
          <IngredientsSection />
          <div className="block bg-black relative">
            <BenefitsSection />
            <VideoSection />
          </div>
          <TestimonialsSection />

          {/* Story 4.1: Story fragments interleaved organically (AC1) */}
          {/* <StoryFragmentContainer fragmentIndices={[0, 1]} /> */}
          {/* Story 2.2: Snap sections for mobile scroll-snap */}
          {/* <FeaturedCollection collection={data.featuredCollection} className="snap-start" /> */}
          {/* Story 4.1: Story fragments between sections */}
          {/* <StoryFragmentContainer fragmentIndices={[2, 3]} /> */}
          {/* Story 2.3: Constellation grid layout */}
          {/* <ConstellationProducts products={data.recommendedProducts} className="snap-start" /> */}
          {/* Story 4.1: Story fragments after product sections */}
          {/* <StoryFragmentContainer fragmentIndices={[4, 5, 6, 7]} /> */}

          <LocalStores />
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

      <h2>{collection.title}</h2>
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
              <div key={i} className="aspect-square bg-[var(--canvas-elevated)] rounded-lg animate-pulse" />
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

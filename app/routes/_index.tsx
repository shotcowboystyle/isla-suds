import {lazy, Suspense, useEffect} from 'react';
import {useLoaderData} from 'react-router';
import {HeroSection} from '~/components/story/HeroSection';
import {productsListHandles} from '~/content/products';
import {
  PRODUCTS_LIST_QUERY,
  FEATURED_COLLECTION_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
} from '~/graphql/product/ProductList';
import {createMeta} from '~/utils/meta';
import type {Route} from './+types/_index';

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
  import('~/components/Testimonials').then((m) => ({default: m.TestimonialsSection})),
);
const LocalStores = lazy(() => import('~/components/LocalStores').then((m) => ({default: m.LocalStores})));

export const meta: Route.MetaFunction = createMeta({
  title: 'Isla Suds | Gentle Goat Milk Soap for Sensitive Skin',
  description:
    'Isla Suds crafts gentle, unscented goat milk soap for sensitive and reactive skin. 100% clean, natural ingredients — no dyes, no fragrances, just nourishing care.',
});

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
  const recommendedProducts = context.storefront.query(RECOMMENDED_PRODUCTS_QUERY).catch((_error: Error) => {
    // Safe to continue: recommended products are non-critical below-fold content
    return null;
  });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    let cancelled = false;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('@gsap/react')])
      .then(([{default: gsap}, {ScrollTrigger}, {useGSAP}]) => {
        if (cancelled) {
          return;
        }

        gsap.registerPlugin(ScrollTrigger, useGSAP);

        // Refresh ScrollTrigger to ensure start/end positions are correct
        ScrollTrigger.refresh();
      })
      .catch((_error: Error) => {
        // Safe to continue: GSAP is a progressive enhancement, page works without it
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="home flex flex-col bg-transparent">
      {/* <div className="block bg-black overflow-hidden"> */}
      <div className="block bg-black overflow-visible">
        <HeroSection />
      </div>

      <div className="z-2 overflow-visible relative">
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
  );
}

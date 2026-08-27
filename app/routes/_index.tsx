import {useLoaderData} from 'react-router';
import {LocalStores} from '~/components/LocalStores';
import {BenefitsSection} from '~/components/story/Benefits';
import {HeroSection} from '~/components/story/HeroSection';
import {IngredientsSection} from '~/components/story/Ingredients';
import {MessageSection} from '~/components/story/MessageSection';
import {ProductsList} from '~/components/story/ProductsList';
import {VideoSection} from '~/components/story/VideoSection';
import {TestimonialsSection} from '~/components/Testimonials';
import {productsListHandles} from '~/content/products';
import {PRODUCTS_LIST_QUERY, FEATURED_COLLECTION_QUERY} from '~/graphql/product/ProductList';
import {createMeta} from '~/utils/meta';
import type {Route} from './+types/_index';

export const meta: Route.MetaFunction = createMeta({
  title: 'Isla Suds | Gentle Goat Milk Soap for Sensitive Skin',
  description:
    'Isla Suds crafts gentle, unscented goat milk soap for sensitive and reactive skin. 100% clean, natural ingredients — no dyes, no fragrances, just nourishing care.',
});

export async function loader(args: Route.LoaderArgs) {
  return loadCriticalData(args);
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
 * Sections render eagerly rather than through `React.lazy`.
 *
 * The page is one continuous scroll score with three pinned scenes. Streaming
 * sections in after hydration means ScrollTrigger measures a document that is
 * one viewport tall, and every start/end below the hero is computed against a
 * layout that does not exist yet. Rendering the whole story up front also lets
 * the build extract each section's CSS module into a blocking stylesheet
 * instead of injecting it when its chunk lands.
 *
 * The bundle cost is negligible: every section already imports gsap statically,
 * so the `gsap` chunk was being pulled by the first lazy section regardless.
 */
export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="home flex flex-col bg-transparent">
      <div className="block bg-black overflow-visible">
        <HeroSection />
      </div>

      <div className="z-2 overflow-visible relative">
        <MessageSection />
        <ProductsList products={data.productsList} />
        <IngredientsSection />

        <div className="block bg-black relative">
          <BenefitsSection />
          <VideoSection />
        </div>

        <TestimonialsSection />
        <LocalStores />
      </div>
    </div>
  );
}

import {redirect, useLoaderData} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductLandingPage} from '~/components/product/landing/ProductLandingPage';
import {PRODUCT_QUERY} from '~/graphql/product/ProductDetail';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {seoTags, SITE_NAME} from '~/utils/meta';
import type {Route} from './+types/products.$handle';

export const meta: Route.MetaFunction = ({data}) => {
  const product = data?.product;
  if (!product) return seoTags({title: `Soap | ${SITE_NAME}`});
  const variant = product.selectedOrFirstAvailableVariant;
  const image = variant?.image?.url;
  return [
    ...seoTags({
      title: `${product.seo?.title || product.title} | ${SITE_NAME}`,
      description: product.seo?.description || product.description.slice(0, 160),
      image,
      type: 'product',
    }),
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image,
        sku: variant?.sku || undefined,
        brand: {'@type': 'Brand', name: product.vendor || SITE_NAME},
        offers: variant && {
          '@type': 'Offer',
          price: variant.price.amount,
          priceCurrency: variant.price.currencyCode,
          availability: variant.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      },
    },
  ];
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

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: Route.LoaderArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  return (
    <>
      <ProductLandingPage product={product} />
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </>
  );
}

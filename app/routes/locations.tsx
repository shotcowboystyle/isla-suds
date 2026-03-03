import {useSearchParams, useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {LocationsPage} from '~/components/locations/LocationsPage';
import {LOCATIONS_PAGE} from '~/content/stores';
import {MONEY_FRAGMENT} from '~/lib/fragments';
import {cn} from '~/utils/cn';
import type {Route} from './+types/locations';

export const meta: Route.MetaFunction = () => {
  return [{title: LOCATIONS_PAGE.meta.title}, {name: 'description', content: LOCATIONS_PAGE.meta.description}];
};

const COLLECTION_ITEM_FRAGMENT = `#graphql
  ${MONEY_FRAGMENT}
  fragment CollectionItem on Product {
    id
    handle
    title
    availableForSale
    variants(first: 1) {
      nodes {
        id
        availableForSale
        price {
          ...Money
        }
      }
    }
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...Money
      }
      maxVariantPrice {
        ...Money
      }
    }
  }
` as const;

const CATALOG_QUERY = `#graphql
  query Catalog($first: Int, $last: Int, $startCursor: String, $endCursor: String) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;

export async function loader({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 20});
  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);
  return {products};
}

export default function Locations() {
  const {products} = useLoaderData<typeof loader>();

  return <LocationsPage products={products} />;
}

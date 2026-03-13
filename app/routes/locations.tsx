import {useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {LocationsPage} from '~/components/locations/LocationsPage';
import {LOCATIONS_PAGE} from '~/content/stores';
import {PRODUCT_ITEM_FRAGMENT} from '~/lib/fragments';
import {createMeta} from '~/utils/meta';
import type {Route} from './+types/locations';

export const meta: Route.MetaFunction = createMeta(LOCATIONS_PAGE.meta);

const CATALOG_QUERY = `#graphql
  query LocationsCatalog($first: Int, $last: Int, $startCursor: String, $endCursor: String) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductItem
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
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

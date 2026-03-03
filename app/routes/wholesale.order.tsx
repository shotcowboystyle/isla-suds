import {useState} from 'react';
import {useLoaderData} from 'react-router';
import {OrderProductCard} from '~/components/wholesale/OrderProductCard';
import {wholesaleContent} from '~/content/wholesale';
import {cn} from '~/utils/cn';
import type {Route} from './+types/wholesale.order';

export const meta: Route.MetaFunction = () => {
  return [{title: `${wholesaleContent.order.pageTitle} | Isla Suds`}];
};

const WHOLESALE_PRODUCT_FRAGMENT = `#graphql
  fragment WholesaleProductFields on Product {
    id
    title
    handle
    featuredImage {
      url
      altText
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        price {
          amount
          currencyCode
        }
      }
    }
  }
` as const;

const WHOLESALE_PRODUCTS_QUERY = `#graphql
  ${WHOLESALE_PRODUCT_FRAGMENT}
  query WholesaleProducts(
    $country: CountryCode
    $language: LanguageCode
    $buyer: BuyerInput
    $handle1: String!
    $handle2: String!
    $handle3: String!
    $handle4: String!
  ) @inContext(country: $country, language: $language, buyer: $buyer) {
    soap1: product(handle: $handle1) {
      ...WholesaleProductFields
    }
    soap2: product(handle: $handle2) {
      ...WholesaleProductFields
    }
    soap3: product(handle: $handle3) {
      ...WholesaleProductFields
    }
    soap4: product(handle: $handle4) {
      ...WholesaleProductFields
    }
  }
` as const;

export async function loader({context}: Route.LoaderArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  const [handle1, handle2, handle3, handle4] = wholesaleContent.catalog.productHandles;

  const {soap1, soap2, soap3, soap4} = await context.storefront.query(
    WHOLESALE_PRODUCTS_QUERY,
    {
      variables: {
        buyer: customerAccessToken ? {customerAccessToken} : undefined,
        handle1,
        handle2,
        handle3,
        handle4,
      },
    },
  );

  const products = [soap1, soap2, soap3, soap4]
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map(({variants, ...rest}) => ({
      ...rest,
      variant: variants.nodes[0],
    }));

  return {products};
}

export default function WholesaleOrderPage() {
  const {products} = useLoaderData<typeof loader>();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (variantId: string, quantity: number) => {
    setQuantities((prev) => ({...prev, [variantId]: quantity}));
  };

  return (
    <div>
      <div className={cn('mb-8')}>
        <h1 className={cn('text-2xl font-semibold text-[--text-primary]')}>
          {wholesaleContent.order.pageTitle}
        </h1>
        <p className={cn('mt-1 text-sm text-[--text-muted]')}>
          {wholesaleContent.order.pageSubtitle}
        </p>
      </div>

      <div
        className={cn(
          'grid grid-cols-1 gap-6',
          'sm:grid-cols-2',
        )}
      >
        {products.map((product) => (
          <OrderProductCard
            key={product.id}
            product={product}
            quantity={quantities[product.variant.id] ?? 0}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </div>
    </div>
  );
}

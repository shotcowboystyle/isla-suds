import {useEffect, useState} from 'react';
import {useFetcher, useLoaderData} from 'react-router';
import {OrderProductCard} from '~/components/wholesale/OrderProductCard';
import {OrderSummary} from '~/components/wholesale/OrderSummary';
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

interface CheckoutActionResponse {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

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

export async function action({request, context}: Route.ActionArgs): Promise<CheckoutActionResponse> {
  const customerId = await context.session.get('customerId');

  if (!customerId) {
    return {
      success: false,
      error: wholesaleContent.auth.sessionExpired,
    };
  }

  const formData = await request.formData();
  const rawQuantities = formData.get('quantities');

  if (!rawQuantities || typeof rawQuantities !== 'string') {
    return {success: false, error: wholesaleContent.auth.genericError};
  }

  const quantities = JSON.parse(rawQuantities) as Record<string, number>;

  // Server-side quantity validation: each must be 0 or >= 6 (NFR6)
  for (const [, qty] of Object.entries(quantities)) {
    if (qty > 0 && qty < 6) {
      return {
        success: false,
        error: wholesaleContent.order.moqError,
      };
    }
  }

  // Build lines array — skip 0 quantities
  const lines = Object.entries(quantities)
    .filter(([, qty]) => qty >= 6)
    .map(([merchandiseId, quantity]) => ({merchandiseId, quantity}));

  if (lines.length === 0) {
    return {success: false, error: wholesaleContent.auth.genericError};
  }

  try {
    const customerAccessToken = await context.session.get('customerAccessToken');

    const result = await context.cart.create({
      lines,
      buyerIdentity: customerAccessToken ? {customerAccessToken} : undefined,
    });

    if (result.errors?.length) {
      return {success: false, error: wholesaleContent.auth.genericError};
    }

    if (!result.cart?.checkoutUrl) {
      return {success: false, error: wholesaleContent.auth.genericError};
    }

    context.cart.setCartId(result.cart.id);

    return {success: true, checkoutUrl: result.cart.checkoutUrl};
  } catch {
    // Safe to catch: cart creation failure returns error response, no re-throw needed
    return {success: false, error: wholesaleContent.auth.genericError};
  }
}

export default function WholesaleOrderPage() {
  const {products} = useLoaderData<typeof loader>();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const fetcher = useFetcher<CheckoutActionResponse>();

  const isLoading = fetcher.state === 'submitting';

  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.checkoutUrl) {
      window.location.href = fetcher.data.checkoutUrl;
    }
  }, [fetcher.data]);

  const handleQuantityChange = (variantId: string, quantity: number) => {
    setQuantities((prev) => ({...prev, [variantId]: quantity}));
  };

  const handleCheckout = () => {
    fetcher.submit(
      {quantities: JSON.stringify(quantities)},
      {method: 'POST'},
    );
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

      <div className={cn('flex flex-col gap-6', 'sm:flex-row sm:items-start')}>
        <div className={cn('flex-1 grid grid-cols-1 gap-6', 'sm:grid-cols-2')}>
          {products.map((product) => (
            <OrderProductCard
              key={product.id}
              product={product}
              quantity={quantities[product.variant.id] ?? 0}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>

        <div className={cn('sm:w-72 sm:shrink-0', 'lg:w-80')}>
          <OrderSummary
            products={products}
            quantities={quantities}
            onCheckout={handleCheckout}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

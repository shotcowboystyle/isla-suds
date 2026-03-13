import {useEffect, useState} from 'react';
import {useFetcher, useLoaderData} from 'react-router';
import {OrderProductCard} from '~/components/wholesale/OrderProductCard';
import {OrderSummary} from '~/components/wholesale/OrderSummary';
import {wholesaleContent} from '~/content/wholesale';
import {cn} from '~/utils/cn';
import {createMeta} from '~/utils/meta';
import type {Route} from './+types/wholesale.order';

export const meta: Route.MetaFunction = createMeta({title: `${wholesaleContent.order.pageTitle} | Isla Suds`});

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
        metafield(namespace: "wholesale", key: "price") {
          value
          type
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

  const {soap1, soap2, soap3, soap4} = await context.storefront.query(WHOLESALE_PRODUCTS_QUERY, {
    variables: {
      buyer: customerAccessToken ? {customerAccessToken} : undefined,
      handle1,
      handle2,
      handle3,
      handle4,
    },
  });

  const products = [soap1, soap2, soap3, soap4]
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map(({variants, ...rest}) => {
      const variant = variants.nodes[0];
      const metafieldValue = variant.metafield?.value;

      let wholesalePrice: typeof variant.price | null = null;
      if (metafieldValue) {
        try {
          const amount = variant.metafield?.type === 'money'
            ? (JSON.parse(metafieldValue) as {amount: string}).amount
            : metafieldValue;
          wholesalePrice = {amount, currencyCode: variant.price.currencyCode};
        } catch (error) {
          console.error('Failed to parse wholesale price metafield:', error);
          wholesalePrice = null;
        }
      }

      return {...rest, variant, wholesalePrice};
    });

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

  // Validate variant IDs are available for sale and have a wholesale price
  const customerAccessToken = await context.session.get('customerAccessToken');
  const [handle1, handle2, handle3, handle4] = wholesaleContent.catalog.productHandles;
  
  const {soap1, soap2, soap3, soap4} = await context.storefront.query(WHOLESALE_PRODUCTS_QUERY, {
    variables: {
      buyer: customerAccessToken ? {customerAccessToken} : undefined,
      handle1,
      handle2,
      handle3,
      handle4,
    },
  });

  const validProducts = [soap1, soap2, soap3, soap4].filter((p): p is NonNullable<typeof p> => Boolean(p));
  const validVariantIds = new Set<string>();
  
  for (const p of validProducts) {
    const variant = p.variants.nodes[0];
    const metafieldValue = variant.metafield?.value;
    let hasPrice = false;
    
    if (metafieldValue) {
      if (variant.metafield?.type === 'money') {
        try {
          hasPrice = !!(JSON.parse(metafieldValue) as {amount: string}).amount;
        } catch {
          hasPrice = false;
        }
      } else {
        hasPrice = true;
      }
    }
    
    if (variant.availableForSale && hasPrice) {
      validVariantIds.add(variant.id);
    }
  }

  // Build lines array — skip 0 quantities and ensure the item is valid
  const lines = Object.entries(quantities)
    .filter(([merchandiseId, qty]) => qty >= 6 && validVariantIds.has(merchandiseId))
    .map(([merchandiseId, quantity]) => ({merchandiseId, quantity}));

  if (lines.length === 0) {
    return {success: false, error: "No valid items selected for order."};
  }

  try {
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
  const checkoutError = fetcher.data?.success === false ? fetcher.data.error : undefined;

  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.checkoutUrl) {
      window.location.href = fetcher.data.checkoutUrl;
    }
  }, [fetcher.data]);

  const handleQuantityChange = (variantId: string, quantity: number) => {
    setQuantities((prev) => ({...prev, [variantId]: quantity}));
  };

  const handleCheckout = () => {
    fetcher.submit({quantities: JSON.stringify(quantities)}, {method: 'POST'}).catch(() => {
      // Safe to catch: cart creation failure returns error response, no re-throw needed
      return {success: false, error: wholesaleContent.auth.genericError};
    });
  };

  return (
    <div>
      <div className={cn('mb-8')}>
        <h1 className={cn('text-2xl font-semibold text-[--text-primary]')}>{wholesaleContent.order.pageTitle}</h1>
        <p className={cn('mt-1 text-sm text-[--text-muted]')}>{wholesaleContent.order.pageSubtitle}</p>
      </div>

      <div className={cn('flex flex-col gap-6', 'sm:flex-row sm:items-start')}>
        <div className={cn('flex-1 grid grid-cols-1 gap-6', 'sm:grid-cols-2')}>
          {products.map((product) => (
            <OrderProductCard
              key={product.id}
              product={product}
              wholesalePrice={product.wholesalePrice}
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
            error={checkoutError}
          />
        </div>
      </div>
    </div>
  );
}

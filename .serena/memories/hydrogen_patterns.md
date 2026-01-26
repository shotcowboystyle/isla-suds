# Hydrogen Framework Patterns

## Hydrogen Context

### Creating Context (server.ts)

```typescript
import {createHydrogenRouterContext} from '@shopify/hydrogen';

const hydrogenContext = createHydrogenRouterContext({
  env: context.env,
  cache,
  waitUntil: context.waitUntil,
  cart: {
    queryFragment: CART_QUERY_FRAGMENT,
  },
  session: await AppSession.init(request, [context.env.SESSION_SECRET]),
  i18n: {language: 'EN', country: 'US'},
});
```

### Using Context in Loaders

```typescript
export async function loader({context}: Route.LoaderArgs) {
  const {storefront, cart} = context;

  // Query storefront
  const {products} = await storefront.query(PRODUCTS_QUERY);

  // Get cart
  const cartData = await cart.get();

  return {products, cart: cartData};
}
```

## Storefront API

### GraphQL Queries

```typescript
// In route or loader
const {product} = await context.storefront.query(PRODUCT_QUERY, {
  variables: {handle},
  cache: context.storefront.CacheLong(),
});
```

### Cache Strategies

- `CacheNone()` - No caching
- `CacheShort()` - Short cache (1 minute)
- `CacheLong()` - Long cache (1 hour)
- `CacheCustom()` - Custom cache duration

### Fragment Usage

```typescript
// Define in app/lib/fragments.ts
export const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFragment on Product {
    id
    title
    handle
    vendor
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

// Use in queries
const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;
```

## Cart Operations

### Get Cart

```typescript
const cart = await context.cart.get();
```

### Add to Cart

```typescript
export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();
  const cartInput = {
    lines: [
      {
        merchandiseId: formData.get('merchandiseId'),
        quantity: parseInt(formData.get('quantity')),
      },
    ],
  };

  await context.cart.addLines(cartInput.lines);
  return redirect('/cart');
}
```

### Update Cart Lines

```typescript
await context.cart.updateLines([
  {
    id: lineId,
    quantity: newQuantity,
  },
]);
```

### Remove from Cart

```typescript
await context.cart.removeLines([lineId]);
```

## Session Management

### Custom Session Implementation

```typescript
// app/lib/session.ts
export class AppSession implements HydrogenSession {
  #sessionStorage;
  #session;
  isPending = false;

  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));
    return new this(session, storage);
  }

  get(key: string) {
    return this.#session.get(key);
  }

  set(key: string, value: any) {
    this.isPending = true;
    this.#session.set(key, value);
  }

  async commit() {
    if (!this.isPending) return;
    this.isPending = false;
    return await this.#sessionStorage.commitSession(this.#session);
  }
}
```

### Using Session

```typescript
// In loader or action
const userId = context.session.get('userId');
context.session.set('userId', '123');

// Commit session if changed
const headers = new Headers();
if (context.session.isPending) {
  headers.set('Set-Cookie', await context.session.commit());
}
```

## Customer Account API

### Authentication

```typescript
// Check if customer is logged in
const {data, errors} = await context.customerAccount.query(
  CUSTOMER_DETAILS_QUERY,
);

if (errors?.length || !data?.customer) {
  throw redirect('/account/login');
}
```

### Querying Customer Data

```typescript
export async function loader({context}: Route.LoaderArgs) {
  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_ORDERS_QUERY,
    {variables: {first: 10}},
  );

  return {orders: data?.customer?.orders};
}
```

### Mutations

```typescript
export async function action({request, context}: Route.ActionArgs) {
  const formData = await request.formData();

  const {data, errors} = await context.customerAccount.mutate(
    CUSTOMER_UPDATE_MUTATION,
    {
      variables: {
        customer: {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
        },
      },
    },
  );

  return {success: !errors};
}
```

## Meta Tags & SEO

### Route Meta Function

```typescript
export const meta: Route.MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: data.product.title},
    {name: 'description', content: data.product.description},
    {property: 'og:title', content: data.product.title},
    {property: 'og:image', content: data.product.featuredImage?.url},
  ];
};
```

## Data Loading Patterns

### Deferred Data (Streaming SSR)

```typescript
export async function loader({ context }: Route.LoaderArgs) {
  // Critical data (awaited)
  const criticalData = await context.storefront.query(CRITICAL_QUERY);

  // Deferred data (streamed later)
  const deferredData = context.storefront.query(DEFERRED_QUERY);

  return defer({
    critical: criticalData,
    deferred: deferredData, // Promise passed to client
  });
}

// In component
function Component() {
  const { critical, deferred } = useLoaderData<typeof loader>();

  return (
    <div>
      <div>{critical.title}</div>
      <Suspense fallback={<Loading />}>
        <Await resolve={deferred}>
          {(data) => <DeferredContent data={data} />}
        </Await>
      </Suspense>
    </div>
  );
}
```

## Error Handling

### Loader Errors

```typescript
export async function loader({context, params}: Route.LoaderArgs) {
  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {handle: params.handle},
  });

  if (!product) {
    throw new Response('Not Found', {status: 404});
  }

  return {product};
}
```

### Action Errors

```typescript
export async function action({request, context}: Route.ActionArgs) {
  try {
    const result = await context.cart.addLines(lines);
    return {success: true};
  } catch (error) {
    return {
      success: false,
      error: 'Failed to add to cart',
    };
  }
}
```

## Analytics

### Shopify Analytics Integration

```typescript
// In app/root.tsx
import { Analytics } from '@shopify/hydrogen';

export default function App() {
  return (
    <html>
      <body>
        <Outlet />
        <Analytics />
      </body>
    </html>
  );
}
```

## Internationalization (i18n)

### Setting Language and Country

```typescript
const hydrogenContext = createHydrogenRouterContext({
  // ...
  i18n: {
    language: 'EN',
    country: 'US',
  },
});
```

### Using in Queries

```typescript
// Hydrogen automatically passes @inContext to all queries
const {products} = await context.storefront.query(PRODUCTS_QUERY);
// Query runs with language: EN, country: US context
```

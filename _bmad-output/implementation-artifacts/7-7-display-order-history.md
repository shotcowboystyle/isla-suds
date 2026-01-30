# Story 7.7: Display Order History

Status: ready-for-dev

## Story

As a **wholesale partner**,
I want **to view my order history**,
so that **I can reference past orders and track my purchases**.

## Acceptance Criteria

**Given** I am logged into the wholesale portal
**When** I navigate to Order History (link or tab)
**Then** I see a list of past orders:

- Order date
- Order number
- Total amount
- Status (Fulfilled, Processing, etc.)
- "View Details" link
  **And** orders are sorted newest first
  **And** pagination or "Load more" if many orders
  **And** clicking "View Details" shows full order breakdown

**FRs addressed:** FR27

## Tasks / Subtasks

- [ ] Create order history route (AC: 1)
  - [ ] Set up `app/routes/wholesale.orders.tsx`
  - [ ] Add navigation link from dashboard
- [ ] Fetch order history via Customer Account API (AC: 2)
  - [ ] Query orders with pagination support
  - [ ] Sort by processedAt descending
- [ ] Display order list (AC: 3)
  - [ ] Build OrderHistoryList component
  - [ ] Show date, order number, total, status
- [ ] Add "View Details" link for each order (AC: 4)
  - [ ] Link to individual order page
  - [ ] Route: `/wholesale/orders/:orderId`
- [ ] Implement pagination (AC: 5)
  - [ ] Load more button (simple MVP approach)
  - [ ] Or infinite scroll (advanced)
- [ ] Create order details page (AC: 6)
  - [ ] Set up `app/routes/wholesale.orders.$orderId.tsx`
  - [ ] Show full order breakdown
  - [ ] Include line items, shipping, payment info

## Dev Notes

### Critical Architecture Requirements

**Data Fetching:**
- Use Shopify Customer Account API
- Query paginated orders (default: 10 per page)
- MUST include limit (bounded queries rule)
- Sort newest first: `sortKey: PROCESSED_AT, reverse: true`

**Navigation Pattern:**
- Add "Order History" link to wholesale header/navigation
- Breadcrumb: Dashboard → Order History
- Individual order: Dashboard → Order History → Order #1234

**Performance:**
- Don't load all orders at once (unbounded query violation)
- Use pagination or cursor-based loading
- Cache order list with short TTL (5 min)

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| Routes | wholesale.orders.tsx, wholesale.orders.$orderId.tsx |
| API | Shopify Customer Account API |
| Pagination | Cursor-based (Shopify standard) |
| Content | app/content/wholesale.ts |
| UI | Table or list layout |

### File Structure

```
app/
  routes/
    wholesale.orders.tsx                    # Order history list (NEW)
    wholesale.orders.$orderId.tsx           # Order details (NEW)
  components/
    wholesale/
      OrderHistoryList.tsx                  # Order list (NEW)
      OrderHistoryItem.tsx                  # Single order row (NEW)
      OrderDetails.tsx                      # Full order breakdown (NEW)
  graphql/
    customer-account/
      GetOrderHistory.ts                    # Paginated orders query (NEW)
      GetOrderDetails.ts                    # Single order query (NEW)
```

### GraphQL Query for Order History

```graphql
#graphql
query GetOrderHistory($customerId: ID!, $first: Int!, $after: String) {
  customer(id: $customerId) {
    orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        cursor
        node {
          id
          name
          orderNumber
          processedAt
          financialStatus
          fulfillmentStatus
          currentTotalPrice {
            amount
            currencyCode
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
}
```

### Loader Implementation

```typescript
// app/routes/wholesale.orders.tsx
export async function loader({ request, context }: Route.LoaderArgs) {
  const session = context.session;
  const customerId = session.get('customerId');

  if (!customerId) {
    throw redirect('/wholesale/login');
  }

  // Get cursor from URL for pagination
  const url = new URL(request.url);
  const after = url.searchParams.get('after') || undefined;

  const ordersData = await context.customerAccount.query({
    query: GET_ORDER_HISTORY_QUERY,
    variables: {
      customerId,
      first: 10, // BOUNDED QUERY: MUST have limit
      after,
    },
    cache: context.storefront.CacheShort(),
  });

  return {
    orders: ordersData.customer.orders.edges.map((edge) => edge.node),
    pageInfo: ordersData.customer.orders.pageInfo,
  };
}
```

### Order History List Component

```typescript
// app/components/wholesale/OrderHistoryList.tsx
export function OrderHistoryList({ orders, pageInfo }: OrderHistoryListProps) {
  if (orders.length === 0) {
    return (
      <div className={cn("text-center py-12")}>
        <p className={cn("text-text-muted")}>
          {WHOLESALE_DASHBOARD.noOrdersMessage}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className={cn("text-2xl font-semibold mb-6")}>Order History</h1>

      {/* Order list */}
      <div className={cn("space-y-4")}>
        {orders.map((order) => (
          <OrderHistoryItem key={order.id} order={order} />
        ))}
      </div>

      {/* Load more */}
      {pageInfo.hasNextPage && (
        <LoadMoreButton cursor={pageInfo.endCursor} />
      )}
    </div>
  );
}
```

### Order History Item Component

```typescript
// app/components/wholesale/OrderHistoryItem.tsx
export function OrderHistoryItem({ order }: { order: Order }) {
  return (
    <div className={cn(
      "rounded-lg bg-canvas-elevated p-6",
      "border border-gray-200",
      "flex items-center justify-between"
    )}>
      <div className={cn("flex-1")}>
        {/* Order date */}
        <p className={cn("text-sm text-text-muted mb-1")}>
          {formatOrderDate(order.processedAt)}
        </p>

        {/* Order number */}
        <p className={cn("font-semibold text-text-primary")}>
          Order #{order.orderNumber}
        </p>

        {/* Order total */}
        <p className={cn("text-sm text-text-muted mt-1")}>
          {formatCurrency(order.currentTotalPrice)}
        </p>
      </div>

      {/* Status badge */}
      <OrderStatusBadge status={order.fulfillmentStatus} />

      {/* View details link */}
      <Link
        to={`/wholesale/orders/${order.id}`}
        className={cn("ml-4 text-accent-primary hover:underline")}
      >
        View Details
      </Link>
    </div>
  );
}
```

### Pagination: Load More Button

```typescript
// Simple load more approach (MVP)
function LoadMoreButton({ cursor }: { cursor: string }) {
  const navigate = useNavigate();

  return (
    <div className={cn("text-center mt-6")}>
      <Button
        onClick={() => {
          navigate(`/wholesale/orders?after=${cursor}`);
        }}
      >
        Load More Orders
      </Button>
    </div>
  );
}
```

**Alternative: Infinite Scroll**
- Use Intersection Observer
- Trigger when user scrolls near bottom
- Append new orders to existing list
- More complex but better UX

### Order Details Page

```typescript
// app/routes/wholesale.orders.$orderId.tsx
export async function loader({ params, context }: Route.LoaderArgs) {
  const { orderId } = params;

  const orderData = await context.customerAccount.query({
    query: GET_ORDER_DETAILS_QUERY,
    variables: { orderId },
  });

  if (!orderData.order) {
    throw new Response('Order not found', { status: 404 });
  }

  return { order: orderData.order };
}

export default function OrderDetailsPage() {
  const { order } = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Breadcrumb */}
      <nav className={cn("mb-6")}>
        <Link to="/wholesale">Dashboard</Link> →{' '}
        <Link to="/wholesale/orders">Order History</Link> → Order #{order.orderNumber}
      </nav>

      {/* Order details */}
      <OrderDetails order={order} />
    </div>
  );
}
```

### Order Details Component

```typescript
// app/components/wholesale/OrderDetails.tsx
export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className={cn("space-y-6")}>
      {/* Order header */}
      <div>
        <h1 className={cn("text-2xl font-semibold")}>
          Order #{order.orderNumber}
        </h1>
        <p className={cn("text-sm text-text-muted")}>
          {formatOrderDate(order.processedAt)}
        </p>
        <OrderStatusBadge status={order.fulfillmentStatus} />
      </div>

      {/* Line items */}
      <div>
        <h2 className={cn("text-lg font-semibold mb-4")}>Items</h2>
        {order.lineItems.edges.map(({ node }) => (
          <OrderLineItem key={node.id} item={node} />
        ))}
      </div>

      {/* Order summary */}
      <div className={cn("border-t pt-4")}>
        <div className={cn("flex justify-between mb-2")}>
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotalPrice)}</span>
        </div>
        <div className={cn("flex justify-between mb-2")}>
          <span>Shipping</span>
          <span>{formatCurrency(order.shippingCost)}</span>
        </div>
        <div className={cn("flex justify-between mb-2")}>
          <span>Tax</span>
          <span>{formatCurrency(order.totalTax)}</span>
        </div>
        <div className={cn("flex justify-between text-lg font-semibold")}>
          <span>Total</span>
          <span>{formatCurrency(order.currentTotalPrice)}</span>
        </div>
      </div>

      {/* Shipping address */}
      {order.shippingAddress && (
        <div>
          <h2 className={cn("text-lg font-semibold mb-2")}>Shipping Address</h2>
          <address className={cn("not-italic text-text-muted")}>
            {order.shippingAddress.formatted.join('\n')}
          </address>
        </div>
      )}
    </div>
  );
}
```

### Navigation Integration

**Add Order History Link:**

```typescript
// app/components/wholesale/WholesaleHeader.tsx
<nav>
  <Link to="/wholesale">Dashboard</Link>
  <Link to="/wholesale/orders">Order History</Link>
  {/* Logout button */}
</nav>
```

### GraphQL Query for Order Details

```graphql
#graphql
query GetOrderDetails($orderId: ID!) {
  order(id: $orderId) {
    id
    name
    orderNumber
    processedAt
    financialStatus
    fulfillmentStatus
    currentTotalPrice {
      amount
      currencyCode
    }
    subtotalPrice {
      amount
      currencyCode
    }
    totalTax {
      amount
      currencyCode
    }
    shippingCost {
      amount
      currencyCode
    }
    lineItems(first: 50) {
      edges {
        node {
          id
          title
          quantity
          variant {
            id
            title
            image {
              url
              altText
            }
          }
          originalTotalPrice {
            amount
            currencyCode
          }
          discountedTotalPrice {
            amount
            currencyCode
          }
        }
      }
    }
    shippingAddress {
      formatted
    }
  }
}
```

### Testing Requirements

**Unit Tests:**
- OrderHistoryList renders with orders
- OrderHistoryList shows empty state
- OrderHistoryItem displays correctly
- OrderDetails shows full order breakdown
- Load more button works

**Integration Tests:**
- Order history loader fetches paginated orders
- Order details loader fetches single order
- Navigation between pages works
- Pagination loads next page
- 404 for invalid order ID

**Test Location:**
- `app/components/wholesale/OrderHistoryList.test.tsx`
- `app/components/wholesale/OrderDetails.test.tsx`
- `tests/integration/wholesale-order-history.test.ts`

### Performance Considerations

**Pagination:**
- Default 10 orders per page (balance UX and performance)
- Cursor-based pagination (Shopify standard)
- Cache each page separately (5 min TTL)

**Order Details:**
- Fetch on-demand when user clicks "View Details"
- Cache individual orders (longer TTL: 15 min, less likely to change)
- Limit line items to 50 (reasonable for wholesale orders)

### Project Context Critical Rules

1. **Bounded Queries:** MUST include `first: 10` (no unbounded queries)
2. **Caching:** Use Hydrogen CacheShort() for performance
3. **Error Handling:** Catch API errors, show friendly fallback
4. **Content:** Empty state message from `app/content/wholesale.ts`
5. **Navigation:** Clear breadcrumbs for user orientation

### Anti-Patterns to Avoid

- ❌ Don't query all orders at once (unbounded query violation)
- ❌ Don't use complex pagination libraries (Shopify cursor-based sufficient)
- ❌ Don't show technical errors to users
- ❌ Don't forget to cache queries (performance optimization)
- ❌ Don't over-design UI (simple list sufficient for MVP)

### Edge Cases

**No Orders:**
- Show empty state with friendly message
- Link to product catalog (future enhancement)

**Large Orders:**
- Limit line items to 50 in query
- If more, show "View full order in Shopify" link

**Invalid Order ID:**
- Return 404 response
- Show friendly error: "Order not found"
- Link back to order history

**Pagination Edge Cases:**
- Last page: Hide "Load More" button
- First load: Start with most recent orders
- Error loading next page: Show retry option

### Future Enhancements (Document as TODOs)

1. **Search/Filter:**
   - Search by order number
   - Filter by date range
   - Filter by status

2. **Export:**
   - Download order history as CSV
   - Useful for accounting/expense reporting

3. **Reorder from History:**
   - Add "Reorder" button to order details
   - Same functionality as Story 7.6

4. **Order Tracking:**
   - Show tracking numbers for fulfilled orders
   - Link to carrier tracking pages

### References

- [Source: project-context.md#Bounded Queries] - MUST have LIMIT clause
- [Source: project-context.md#Hydrogen-Specific Rules] - Customer Account API, caching
- [Source: project-context.md#Error Handling] - Catch and log pattern
- [Source: CLAUDE.md#React Router Patterns] - Loader and Link patterns
- [Source: project-context.md#Navigation] - Breadcrumb UX

### Dependencies

**Story 7.1:** B2B authentication
**Story 7.2:** Wholesale layout
**Story 7.3:** Login page
**Story 7.4:** Dashboard route

**Validation:** Customer Account API must return order history data.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- Customer Account API paginated queries documented
- Cursor-based pagination pattern (Shopify standard)
- Order history list and details page structure
- Navigation and breadcrumb patterns
- Caching strategy for performance optimization
- Component hierarchy for order display
- Testing strategy for components and integration
- Edge cases thoroughly covered
- Future enhancements documented for iteration planning
- Bounded queries enforced (MUST include limit)

**Historical reference** - Enables partners to track purchases and reference past orders.

### File List

Files to create:
- app/routes/wholesale.orders.tsx
- app/routes/wholesale.orders.$orderId.tsx
- app/components/wholesale/OrderHistoryList.tsx
- app/components/wholesale/OrderHistoryItem.tsx
- app/components/wholesale/OrderDetails.tsx
- app/components/wholesale/OrderHistoryList.test.tsx
- app/components/wholesale/OrderDetails.test.tsx
- app/graphql/customer-account/GetOrderHistory.ts
- app/graphql/customer-account/GetOrderDetails.ts
- tests/integration/wholesale-order-history.test.ts

Files to modify:
- app/components/wholesale/WholesaleHeader.tsx (add Order History link)
- app/content/wholesale.ts (add empty state message)

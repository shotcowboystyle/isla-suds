# Story 7.5: Display Last Order on Dashboard

Status: ready-for-dev

## Story

As a **wholesale partner**,
I want **to see my last order front and center when I log in**,
so that **I can reorder instantly without searching**.

## Acceptance Criteria

**Given** I am logged into the wholesale portal
**When** I view the dashboard
**Then** I see my last order displayed prominently:

- Order date
- Items with quantities (e.g., "12x Lavender, 12x Lemongrass...")
- Order total
- Order status (Fulfilled, etc.)
  **And** last order is fetched via Shopify Customer Account API
  **And** if no previous orders, message: "No orders yet. Ready to stock up?"
  **And** last order section is above the fold on desktop

**FRs addressed:** FR24

## Tasks / Subtasks

- [ ] Fetch last order via Customer Account API (AC: 1)
  - [ ] Query orders with limit=1, sort by date desc
  - [ ] Extract order details in loader
- [ ] Display order date (AC: 2)
  - [ ] Format date for readability (e.g., "Dec 15, 2025")
  - [ ] Use Intl.DateTimeFormat for locale support
- [ ] Display order items with quantities (AC: 3)
  - [ ] Show line items: "[qty]x [product name]"
  - [ ] Handle multi-line item orders
  - [ ] Truncate if too many items (e.g., "12x Lavender, 12x Lemongrass, +3 more")
- [ ] Display order total (AC: 4)
  - [ ] Format currency (USD)
  - [ ] Show wholesale pricing
- [ ] Display order status (AC: 5)
  - [ ] Map Shopify status to friendly labels
  - [ ] Visual indicator (badge/color)
- [ ] Handle no previous orders (AC: 6)
  - [ ] Show message from `app/content/wholesale.ts`
  - [ ] "No orders yet. Ready to stock up?"
  - [ ] Encourage first order
- [ ] Position above the fold (AC: 7)
  - [ ] Top section of dashboard (after acknowledgment)
  - [ ] Visible without scrolling on desktop
  - [ ] Mobile: Top priority content

## Dev Notes

### Critical Architecture Requirements

**Above the Fold Priority:**
- Last order is MOST IMPORTANT info for wholesale partners
- Enables one-click reorder (Story 7.6) immediately
- Desktop: Visible on page load (no scroll)
- Mobile: First content after header

**Data Fetching Strategy:**
- Use Shopify Customer Account API (NOT Storefront API)
- B2B orders accessible via Customer Account API
- Query limited to last order only (performance)
- Cache with short TTL (orders can update frequently)

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| Route | `app/routes/wholesale._index.tsx` (extend loader) |
| API | Shopify Customer Account API |
| Content | app/content/wholesale.ts |
| UI | LastOrder component in components/wholesale/ |
| Styling | Tailwind CSS with design tokens |

### File Structure

```
app/
  routes/
    wholesale._index.tsx                    # Extend existing loader
  components/
    wholesale/
      LastOrder.tsx                         # Last order display (NEW)
      OrderLineItem.tsx                     # Line item component (NEW)
  content/
    wholesale.ts                            # No orders message
  graphql/
    customer-account/
      GetLastOrder.ts                       # GraphQL query (NEW)
```

### GraphQL Query for Last Order

```graphql
#graphql
query GetLastOrder($customerId: ID!) {
  customer(id: $customerId) {
    orders(first: 1, sortKey: PROCESSED_AT, reverse: true) {
      edges {
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
          lineItems(first: 10) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Loader Extension

```typescript
// app/routes/wholesale._index.tsx
export async function loader({ context }: Route.LoaderArgs) {
  const session = context.session;
  const customerId = session.get('customerId');

  if (!customerId) {
    throw redirect('/wholesale/login');
  }

  // Existing customer fetch
  const customer = await context.customerAccount.query({
    query: GET_CUSTOMER_QUERY,
    variables: { id: customerId },
  });

  // NEW: Fetch last order
  const ordersData = await context.customerAccount.query({
    query: GET_LAST_ORDER_QUERY,
    variables: { customerId },
  });

  const lastOrder = ordersData.customer.orders.edges[0]?.node || null;

  return {
    partnerName: customer.firstName,
    storeCount: 3,
    lastOrder, // NEW
  };
}
```

### Component Implementation

```typescript
// app/components/wholesale/LastOrder.tsx
import { WHOLESALE_DASHBOARD } from '~/content/wholesale';

interface LastOrderProps {
  order: Order | null;
}

export function LastOrder({ order }: LastOrderProps) {
  if (!order) {
    return (
      <div className={cn("mb-8 rounded-lg bg-canvas-elevated p-6")}>
        <p className={cn("text-text-muted")}>
          {WHOLESALE_DASHBOARD.noOrdersMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("mb-8 rounded-lg bg-canvas-elevated p-6")}>
      <h2 className={cn("text-xl font-semibold mb-4")}>Last Order</h2>

      {/* Order date */}
      <p className={cn("text-sm text-text-muted mb-2")}>
        {formatOrderDate(order.processedAt)}
      </p>

      {/* Order items */}
      <div className={cn("mb-4")}>
        {order.lineItems.edges.map(({ node }) => (
          <OrderLineItem key={node.id} item={node} />
        ))}
      </div>

      {/* Order total */}
      <p className={cn("text-lg font-semibold")}>
        {formatCurrency(order.currentTotalPrice)}
      </p>

      {/* Order status */}
      <OrderStatusBadge status={order.fulfillmentStatus} />
    </div>
  );
}
```

### Date Formatting

```typescript
// Utility function
function formatOrderDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

// Example: "Dec 15, 2025"
```

### Currency Formatting

```typescript
function formatCurrency(price: { amount: string; currencyCode: string }): string {
  const amount = parseFloat(price.amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  }).format(amount);
}

// Example: "$324.00"
```

### Line Items Display

**Truncation Strategy:**
- Show first 3-4 items fully
- If more items: "12x Lavender, 12x Lemongrass, +3 more items"
- Click "+3 more" to expand (optional, MVP can skip)

```typescript
// app/components/wholesale/OrderLineItem.tsx
interface OrderLineItemProps {
  item: {
    title: string;
    quantity: number;
    variant?: { title: string };
  };
}

export function OrderLineItem({ item }: OrderLineItemProps) {
  const displayTitle = item.variant?.title
    ? `${item.title} - ${item.variant.title}`
    : item.title;

  return (
    <p className={cn("text-text-primary")}>
      {item.quantity}x {displayTitle}
    </p>
  );
}
```

### Order Status Mapping

```typescript
const STATUS_LABELS: Record<string, string> = {
  FULFILLED: 'Fulfilled',
  UNFULFILLED: 'Processing',
  PARTIALLY_FULFILLED: 'Partially Fulfilled',
  SCHEDULED: 'Scheduled',
};

function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] || status;
}
```

### Status Badge Component

```typescript
export function OrderStatusBadge({ status }: { status: string }) {
  const label = getStatusLabel(status);
  const variant = status === 'FULFILLED' ? 'success' : 'default';

  return (
    <span className={cn(
      "inline-block px-3 py-1 rounded-full text-sm",
      variant === 'success'
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-800"
    )}>
      {label}
    </span>
  );
}
```

### Caching Strategy

**Hydrogen Cache Pattern:**
```typescript
// In loader
const ordersData = await context.customerAccount.query({
  query: GET_LAST_ORDER_QUERY,
  variables: { customerId },
  cache: context.storefront.CacheShort(), // 5 min cache
});
```

**Rationale:**
- Orders don't change frequently
- 5-minute cache reduces API calls
- Still fresh enough for reorder flow

### Edge Cases & Error Handling

**No Orders:**
- Show friendly message
- Encourage first order
- Message from `app/content/wholesale.ts`

**API Error:**
- Catch error in loader
- Show generic message: "Unable to load order history. Please refresh."
- Log error for debugging

**Many Line Items:**
- Truncate display after 4 items
- Show "+X more items" indicator
- MVP: No expand functionality needed

**Missing Data:**
- If order missing fields, use fallbacks
- Date missing: "Recent order"
- Total missing: "See order details"

### Testing Requirements

**Unit Tests:**
- LastOrder component renders with order data
- LastOrder shows no orders message
- Date formatting works correctly
- Currency formatting works correctly
- Line items display properly
- Status badge shows correct variant

**Integration Tests:**
- Dashboard loader fetches last order
- Last order displays on dashboard
- No orders shows correct message
- API error handled gracefully

**Test Location:**
- `app/components/wholesale/LastOrder.test.tsx`
- `tests/integration/wholesale-dashboard.test.ts`

### Project Context Critical Rules

1. **Bounded Queries:** MUST include `first: 1` (no unbounded queries)
2. **Currency:** Use Intl.NumberFormat (locale-aware)
3. **Dates:** Use Intl.DateTimeFormat (locale-aware)
4. **Content:** No orders message in `app/content/wholesale.ts`
5. **Error Handling:** Catch and log errors, show friendly fallback

### Anti-Patterns to Avoid

- ❌ Don't query all orders (unbounded) - use `first: 1`
- ❌ Don't manually format currency (use Intl.NumberFormat)
- ❌ Don't hardcode date formats (use Intl.DateTimeFormat)
- ❌ Don't show technical errors to users
- ❌ Don't over-design line item display (simple list sufficient)

### References

- [Source: project-context.md#Bounded Queries] - MUST have LIMIT clause
- [Source: project-context.md#Hydrogen-Specific Rules] - Customer Account API, caching
- [Source: project-context.md#Error Handling] - Catch and log pattern
- [Source: CLAUDE.md#GraphQL Patterns] - Query structure
- [Source: project-context.md#User Trust Patterns] - Warm messaging

### Dependencies

**Story 7.1:** B2B authentication
**Story 7.2:** Wholesale layout
**Story 7.3:** Login page
**Story 7.4:** Dashboard route exists

**Validation:** Dashboard route must be created in Story 7.4 before extending.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- Customer Account API query structure for orders documented
- Loader extension pattern for fetching last order
- Component design with proper data display
- Date and currency formatting using Intl APIs
- Order status mapping and badge component
- Caching strategy for performance optimization
- Edge cases and error handling thoroughly covered
- Testing approach for components and integration
- Bounded queries enforced (MUST include limit)
- Anti-patterns highlighted to prevent common mistakes

**Reorder enablement** - Critical foundation for one-click reorder in Story 7.6.

### File List

Files to create:
- app/components/wholesale/LastOrder.tsx
- app/components/wholesale/OrderLineItem.tsx
- app/components/wholesale/OrderStatusBadge.tsx
- app/components/wholesale/LastOrder.test.tsx
- app/graphql/customer-account/GetLastOrder.ts

Files to modify:
- app/routes/wholesale._index.tsx (extend loader)
- app/content/wholesale.ts (add no orders message)

# Story 7.4: Display Partner Acknowledgment Message

Status: ready-for-dev

## Story

As a **wholesale partner**,
I want **to see a personalized acknowledgment when I log in**,
so that **I feel valued as a partner, not just a transaction**.

## Acceptance Criteria

**Given** I am logged into the wholesale portal
**When** I view the dashboard
**Then** I see a personalized message:

- "Isla Suds is in [X] local stores. Thanks for being one of them, [Partner Name]."
  **And** partner name comes from Shopify B2B customer `firstName`
  **And** store count is configured (hardcoded for MVP: 3)
  **And** message template is in `app/content/wholesale.ts`
  **And** message appears at top of dashboard

**FRs addressed:** FR26

## Tasks / Subtasks

- [ ] Create wholesale dashboard route (AC: 1)
  - [ ] Set up `app/routes/wholesale._index.tsx`
  - [ ] Fetch B2B customer data in loader
- [ ] Load B2B customer data (AC: 2)
  - [ ] Use Shopify Customer Account API
  - [ ] Extract firstName from customer object
- [ ] Create acknowledgment message component (AC: 3)
  - [ ] Build PartnerAcknowledgment component
  - [ ] Display personalized message
- [ ] Configure store count (AC: 4)
  - [ ] Hardcode count = 3 for MVP
  - [ ] Define in `app/content/wholesale.ts`
  - [ ] Document for future dynamic configuration
- [ ] Define message template (AC: 5)
  - [ ] Create template in `app/content/wholesale.ts`
  - [ ] Support variable interpolation: {storeCount}, {partnerName}
- [ ] Position message at top of dashboard (AC: 6)
  - [ ] Place above other dashboard content
  - [ ] Visible without scrolling
  - [ ] Mobile-friendly layout

## Dev Notes

### Critical Architecture Requirements

**User Trust Patterns (THE FIVE COMMANDMENTS #4):**
- Warm, personal tone builds trust
- Partners should feel valued, not transactional
- Personalization shows attention to individual relationships
- Simple acknowledgment creates positive emotional connection

**Content Centralization:**
- ALL user-facing copy in `app/content/wholesale.ts`
- Message templates support variable interpolation
- Easy to update copy without code changes
- Future: Could load from Shopify metafields for founder control

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| Route | `app/routes/wholesale._index.tsx` |
| Data | Shopify Customer Account API (loader) |
| Content | app/content/wholesale.ts (templates) |
| UI | Simple text component |
| Styling | Tailwind CSS with design tokens |

### File Structure

```
app/
  routes/
    wholesale._index.tsx                    # Dashboard route (NEW)
  components/
    wholesale/
      PartnerAcknowledgment.tsx             # Acknowledgment message (NEW)
  content/
    wholesale.ts                            # Message template
```

### React Router 7 Loader Pattern

```typescript
// app/routes/wholesale._index.tsx
import type { Route } from './+types/wholesale._index';

export async function loader({ context }: Route.LoaderArgs) {
  const session = context.session;
  const customerId = session.get('customerId');

  if (!customerId) {
    throw redirect('/wholesale/login');
  }

  // Fetch B2B customer data
  const customer = await context.customerAccount.query({
    query: GET_CUSTOMER_QUERY,
    variables: { id: customerId },
  });

  return {
    partnerName: customer.firstName,
    storeCount: 3, // MVP hardcoded, future: fetch from config
  };
}

export default function WholesaleDashboard() {
  const { partnerName, storeCount } = useLoaderData<typeof loader>();

  return (
    <div>
      <PartnerAcknowledgment
        partnerName={partnerName}
        storeCount={storeCount}
      />
      {/* Other dashboard content */}
    </div>
  );
}
```

### Content Template

**app/content/wholesale.ts:**

```typescript
export const WHOLESALE_DASHBOARD = {
  acknowledgmentTemplate: (partnerName: string, storeCount: number) =>
    `Isla Suds is in ${storeCount} local stores. Thanks for being one of them, ${partnerName}.`,
  noOrdersMessage: "No orders yet. Ready to stock up?",
} as const;
```

**Template Interpolation:**
- `{partnerName}` → B2B customer `firstName`
- `{storeCount}` → Hardcoded `3` for MVP
- Future: Support last name, store name, custom messages

### Component Implementation

```typescript
// app/components/wholesale/PartnerAcknowledgment.tsx
import { WHOLESALE_DASHBOARD } from '~/content/wholesale';

interface PartnerAcknowledgmentProps {
  partnerName: string;
  storeCount: number;
}

export function PartnerAcknowledgment({
  partnerName,
  storeCount,
}: PartnerAcknowledgmentProps) {
  const message = WHOLESALE_DASHBOARD.acknowledgmentTemplate(
    partnerName,
    storeCount,
  );

  return (
    <div className={cn(
      "mb-8 rounded-lg bg-canvas-elevated p-6",
      "border border-gray-200"
    )}>
      <p className={cn("text-lg text-text-primary")}>
        {message}
      </p>
    </div>
  );
}
```

### GraphQL Query for Customer Data

```graphql
#graphql
query GetCustomer($id: ID!) {
  customer(id: $id) {
    id
    firstName
    lastName
    email
    company {
      id
      name
    }
  }
}
```

### Styling Guidelines

**Design Tokens:**
- Background: `bg-canvas-elevated` (cards, modals)
- Text: `text-text-primary` (body text)
- Spacing: `mb-8 p-6` (comfortable whitespace)

**Typography:**
- Size: `text-lg` (slightly larger for prominence)
- Weight: Regular (not bold, warm not shouty)
- Color: Primary text color (high contrast)

**Layout:**
- Position: Top of dashboard, above other content
- Width: Full width of content area
- Mobile: Same layout, responsive padding

### Customer Account API Considerations

**Data Structure:**
- `customer.firstName` - Partner's first name
- `customer.lastName` - Available if needed in future
- `customer.company.name` - Store name (future use)
- `customer.company.id` - Company association (validates B2B status)

**Error Handling:**
- If firstName is null/empty: Use fallback "Partner"
- If company is null: Redirect to login (not a B2B customer)
- API errors: Show generic acknowledgment without personalization

### Testing Requirements

**Unit Tests:**
- PartnerAcknowledgment renders with correct message
- Template interpolation works correctly
- Handles edge cases (empty name, null values)

**Integration Tests:**
- Dashboard loader fetches customer data
- Acknowledgment displays on dashboard
- Redirects to login if not authenticated
- Shows fallback if firstName missing

**Test Location:**
- `app/components/wholesale/PartnerAcknowledgment.test.tsx`
- `tests/integration/wholesale-dashboard.test.ts`

### Future Enhancements (Document as TODOs)

1. **Dynamic Store Count:**
   - Fetch from Shopify metafields or admin API
   - Founder can update without code deploy

2. **Custom Messages:**
   - Support different messages for different partners
   - Seasonal or promotional messaging

3. **Store Name Display:**
   - "Thanks for being one of them, [Partner Name] from [Store Name]."

4. **Last Order Context:**
   - "Your last order was [X] days ago. Ready to restock?"

### Project Context Critical Rules

1. **Content Centralization:** ALL copy in `app/content/wholesale.ts`
2. **No Over-Engineering:** Simple template function, not a templating engine
3. **Warm Tone:** Personal, appreciative (not corporate or generic)
4. **Error Recovery:** Graceful fallbacks if data missing
5. **Mobile-Friendly:** Message readable on small screens

### Anti-Patterns to Avoid

- ❌ Don't create complex templating system (simple function interpolation sufficient)
- ❌ Don't fetch extra data not needed (just firstName)
- ❌ Don't add animations or transitions (wholesale is functional)
- ❌ Don't make message dismissible (it's valuable context)
- ❌ Don't hardcode message in component (use centralized content)

### References

- [Source: project-context.md#Content Centralization] - B2B copy location
- [Source: project-context.md#User Trust Patterns] - Warm messaging approach
- [Source: project-context.md#Hydrogen-Specific Rules] - Customer Account API
- [Source: CLAUDE.md#React Router Patterns] - Loader pattern
- [Source: project-context.md#Design Token Naming] - Color and spacing tokens

### Dependencies

**Story 7.1:** B2B authentication must work
**Story 7.2:** Wholesale layout must exist
**Story 7.3:** Login page creates session with customer ID

**Validation:** Ensure customer data available in session before loading dashboard.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- React Router 7 loader pattern for fetching customer data
- Content centralization strategy with template interpolation
- User trust pattern emphasized (warm, personal tone)
- Component design with proper styling and accessibility
- GraphQL query structure for Customer Account API
- Error handling and fallback strategies defined
- Testing approach for unit and integration tests
- Future enhancements documented for iteration planning
- Anti-patterns highlighted to prevent over-engineering

**Emotional connection** - Small detail that builds partner loyalty and trust.

### File List

Files to create:
- app/routes/wholesale._index.tsx (dashboard route)
- app/components/wholesale/PartnerAcknowledgment.tsx
- app/components/wholesale/PartnerAcknowledgment.test.tsx
- tests/integration/wholesale-dashboard.test.ts

Files to modify:
- app/content/wholesale.ts (add dashboard templates)
- app/graphql/ (add GetCustomer query if not exists)

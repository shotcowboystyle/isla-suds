# Story 7.3: Implement Wholesale Login Page

Status: ready-for-dev

## Story

As a **wholesale partner**,
I want **to log in to the dedicated wholesale portal**,
so that **I can access my account and place orders**.

## Acceptance Criteria

**Given** I navigate to `/wholesale/login`
**When** the page loads
**Then** I see:

- Clean login form (email, password)
- "Log In" button
- Link: "Forgot password?"
- Clear indication this is the wholesale portal
  **And** successful login redirects to `/wholesale` dashboard
  **And** failed login shows friendly error: "That didn't work. Check your email and password."
  **And** form is accessible with proper labels and error announcements

**FRs addressed:** FR23

## Tasks / Subtasks

- [ ] Create `/wholesale/login` route (AC: 1)
  - [ ] Set up route file `app/routes/wholesale.login.tsx`
  - [ ] Implement login form UI
- [ ] Build clean login form (AC: 2)
  - [ ] Email input with proper label
  - [ ] Password input with proper label
  - [ ] Form validation (required fields)
- [ ] Add "Log In" button (AC: 3)
  - [ ] Use Button component from ui/
  - [ ] Loading state during authentication
  - [ ] Accessible button with aria-label
- [ ] Add "Forgot password?" link (AC: 4)
  - [ ] Link to Shopify password reset flow
  - [ ] Accessible link text
- [ ] Add wholesale portal branding (AC: 5)
  - [ ] Clear header: "Wholesale Partner Portal"
  - [ ] Copy from `app/content/wholesale.ts`
- [ ] Implement authentication action (AC: 6)
  - [ ] Use Shopify Customer Account API
  - [ ] Verify B2B customer status
  - [ ] Create session on success
  - [ ] Redirect to `/wholesale` dashboard
- [ ] Add friendly error messaging (AC: 7)
  - [ ] Show error from `app/content/wholesale.ts`
  - [ ] "That didn't work. Check your email and password."
  - [ ] Non-B2B customer error: friendly rejection
- [ ] Verify accessibility (AC: 8)
  - [ ] Proper form labels
  - [ ] Error announcements via aria-live
  - [ ] Keyboard navigation
  - [ ] Screen reader testing

## Dev Notes

### Critical Architecture Requirements

**Authentication Pattern (from Story 7.1):**
- Use Shopify Customer Account API
- Session management via `app/lib/session.ts` (AppSession class)
- Cookie-based sessions with `SESSION_SECRET` env var
- Verify B2B customer status after authentication

**Form Handling:**
- Use React Router 7 `action` function for form submission
- `useFetcher()` for optimistic UI updates
- Return error messages via action response

**Error Messaging (THE FIVE COMMANDMENTS #4):**
- Warm, friendly tone (NEVER technical jargon)
- Centralized in `app/content/wholesale.ts`
- Examples:
  - Login failed: "That didn't work. Check your email and password."
  - Not B2B: "This portal is for wholesale partners. Shop our products at [link]."
  - Account locked: "Your account needs attention. Email us at [email]."

### Technical Stack

| Component | Implementation |
|-----------|---------------|
| Route | `app/routes/wholesale.login.tsx` |
| Form | React Router 7 action pattern |
| Auth API | Shopify Customer Account API |
| Session | AppSession (app/lib/session.ts) |
| UI | Button from ui/, custom form layout |
| Content | app/content/wholesale.ts |

### File Structure

```
app/
  routes/
    wholesale.login.tsx         # Login route (NEW)
  content/
    wholesale.ts                # Error messages, copy
  components/
    ui/
      Button.tsx                # Existing component
      Input.tsx                 # May need to create
```

### React Router 7 Action Pattern

```typescript
// app/routes/wholesale.login.tsx
import type { Route } from './+types/wholesale.login';

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  try {
    // Authenticate via Shopify Customer Account API
    const customer = await context.customerAccount.login({ email, password });

    // Verify B2B status
    if (!customer.company) {
      return { error: WHOLESALE_ERRORS.notB2BCustomer };
    }

    // Create session
    const session = context.session;
    session.set('customerId', customer.id);
    session.set('isB2B', true);

    // Redirect to dashboard
    return redirect('/wholesale', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error) {
    return { error: WHOLESALE_ERRORS.loginFailed };
  }
}

export default function WholesaleLogin() {
  const fetcher = useFetcher<typeof action>();
  const actionData = fetcher.data;

  return (
    <div>
      <h1>Wholesale Partner Portal</h1>
      <fetcher.Form method="post">
        {/* Form fields */}
        {actionData?.error && <p role="alert">{actionData.error}</p>}
      </fetcher.Form>
    </div>
  );
}
```

### Content Centralization

**app/content/wholesale.ts:**

```typescript
export const WHOLESALE_COPY = {
  loginTitle: 'Wholesale Partner Portal',
  loginSubtitle: 'Log in to manage your orders',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  loginButton: 'Log In',
  forgotPassword: 'Forgot password?',
} as const;

export const WHOLESALE_ERRORS = {
  loginFailed: "That didn't work. Check your email and password.",
  notB2BCustomer: "This portal is for wholesale partners. Shop our products at the main store.",
  accountLocked: "Your account needs attention. Email us at wholesale@islasuds.com.",
} as const;
```

### Accessibility Requirements (WCAG 2.1 AA)

**Form Labels:**
```tsx
<label htmlFor="email">Email</label>
<input id="email" name="email" type="email" required />
```

**Error Announcements:**
```tsx
<div role="alert" aria-live="polite">
  {actionData?.error}
</div>
```

**Keyboard Navigation:**
- Tab order: Email → Password → Log In → Forgot Password
- Enter key submits form
- Focus states visible

**Screen Reader:**
- Form purpose announced: "Wholesale Partner Portal Login Form"
- Error messages announced via aria-live
- Loading state announced: "Logging in..."

### Testing Requirements

**Integration Tests (P1 - High Priority):**
- Happy path: B2B customer logs in, redirected to dashboard
- Error: Invalid credentials show friendly error
- Error: Non-B2B customer rejected with warm message
- Form validation: Empty fields prevented
- Session: Created correctly on successful login
- Accessibility: Form labels and errors announced

**Test Location:**
- `tests/integration/wholesale-login.test.ts`

**Test Data:**
- Mock Customer Account API responses
- Fixtures in `tests/fixtures/shopify/customer-account-responses.ts`

### Security Considerations

- Password field MUST have `type="password"` (no plaintext)
- Form MUST use HTTPS in production (Oxygen handles this)
- Session cookie MUST have `httpOnly`, `secure`, `sameSite` attributes
- Rate limiting for login attempts (future enhancement, document as TODO)
- CSRF protection via React Router (built-in)

### UI Design Guidance

**Clean, Functional Layout:**
- Centered login card (max-width: 400px)
- Ample whitespace (not cramped)
- Clear visual hierarchy (title → form → link)
- NO decorative elements
- Mobile-friendly (responsive design)

**Button States:**
- Default: Clickable, clear CTA
- Loading: Show "Logging in..." with disabled state
- Disabled: Prevent double-submit

### Project Context Critical Rules

1. **Bundle Budget:** Login page is lightweight (<10KB), no dynamic imports needed
2. **Performance:** Fast first paint (<200ms), minimal JavaScript
3. **Exception Handling:** Catch authentication errors, show friendly message (NEVER expose API errors)
4. **Content:** ALL user-facing strings from `app/content/wholesale.ts`
5. **Accessibility:** Form MUST be fully keyboard accessible with screen reader support

### Anti-Patterns to Avoid

- ❌ Don't use complex form libraries (React Hook Form, Formik) - React Router's built-in forms sufficient
- ❌ Don't show technical error messages ("API Error 500") - use friendly copy
- ❌ Don't hardcode strings in component - use centralized content
- ❌ Don't use client-side only validation - validate in action too
- ❌ Don't forget loading states - user needs feedback during async operations

### References

- [Source: project-context.md#Hydrogen-Specific Rules] - Customer Account API usage
- [Source: project-context.md#Content Centralization] - B2B copy location
- [Source: project-context.md#Exception Handling] - Error handling rules
- [Source: project-context.md#Accessibility Testing] - WCAG 2.1 AA compliance
- [Source: CLAUDE.md#React Router Patterns] - Action and loader patterns

### Dependency: Story 7.1

**Blocker:** Story 7.1 (B2B authentication validation) must be completed first.
- Confirms Customer Account API configuration
- Validates B2B customer detection logic
- Establishes session management pattern

**Validation:** Run Story 7.1 tests before implementing this story.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (SM Agent - YOLO Mode)

### Completion Notes

Story created with comprehensive context analysis:
- React Router 7 action pattern for form handling documented
- Shopify Customer Account API authentication flow detailed
- Error messaging strategy with warm, friendly tone
- Accessibility requirements fully specified (WCAG 2.1 AA)
- Content centralization enforced (app/content/wholesale.ts)
- Security considerations highlighted (session cookies, HTTPS)
- Testing strategy aligned with P1 priority
- UI design guidance for clean, functional layout
- Anti-patterns documented to prevent over-engineering

**Entry point to wholesale portal** - Critical user experience for B2B customers.

### File List

Files to create:
- app/routes/wholesale.login.tsx
- tests/integration/wholesale-login.test.ts

Files to modify:
- app/content/wholesale.ts (add login copy and error messages)
- tests/fixtures/shopify/customer-account-responses.ts (add mock data if needed)

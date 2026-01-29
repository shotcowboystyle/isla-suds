# Story 6.7: Create Contact Page

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **visitor**,
I want **to access a Contact page if I need help**,
So that **I can reach the founder with questions or issues**.

## Acceptance Criteria

**Given** I navigate to `/contact`
**When** the page loads
**Then** I see:

- Warm heading: "Let's Talk" or "Get in Touch"
- Contact form with: Name, Email, Message fields
- Alternative: Direct email address displayed
- Expected response time: "We'll get back to you within 24-48 hours"

**And** form submission sends email to founder (Shopify Forms or third-party)
**And** success message: "Thanks for reaching out! We'll be in touch soon."
**And** form is accessible: proper labels, error messages, keyboard navigation
**And** page is linked from footer and checkout error states

## Tasks / Subtasks

- [ ] **Task 1: Create contact page route** (AC: Page loads at /contact)
  - [ ] Create `app/routes/contact.tsx`
  - [ ] Define loader (no data needed)
  - [ ] Define meta function (title, description for SEO)
  - [ ] Export default component
- [ ] **Task 2: Build contact form UI** (AC: Form fields)
  - [ ] Create form with fields: Name, Email, Message
  - [ ] Add warm heading: "Let's Talk" or "Get in Touch"
  - [ ] Add subheading with response time: "We'll get back to you within 24-48 hours"
  - [ ] Style form with design tokens
  - [ ] Add submit button: "Send Message"
  - [ ] Use semantic HTML (`<form>`, `<label>`, `<input>`, `<textarea>`)
- [ ] **Task 3: Implement form submission handler** (AC: Form sends email)
  - [ ] Define action function for form submission
  - [ ] Use React Router's `<Form>` component (not plain `<form>`)
  - [ ] Parse form data from request
  - [ ] Integrate with Shopify Forms app or email service
  - [ ] Handle submission success and errors
- [ ] **Task 4: Add email sending integration** (AC: Email to founder)
  - [ ] Option A: Use Shopify Forms app (recommended)
  - [ ] Option B: Use SendGrid/Postmark API
  - [ ] Configure recipient email (founder's email)
  - [ ] Format email with: Name, Email, Message
  - [ ] Test email delivery
- [ ] **Task 5: Implement success/error states** (AC: Success message, error handling)
  - [ ] Show success message after submission: "Thanks for reaching out! We'll be in touch soon."
  - [ ] Clear form after success
  - [ ] Show warm error message if submission fails
  - [ ] Use optimistic UI with `useFetcher` for better UX
- [ ] **Task 6: Add form validation** (AC: Accessible, proper labels/errors)
  - [ ] Client-side validation: required fields, email format
  - [ ] Server-side validation in action function
  - [ ] Display field-specific error messages
  - [ ] Ensure ARIA attributes for screen readers
  - [ ] Test keyboard navigation (Tab order)
- [ ] **Task 7: Add alternative contact method** (AC: Direct email displayed)
  - [ ] Display founder's email as clickable `mailto:` link
  - [ ] Add text: "Or email us directly at [email]"
  - [ ] Position below form as fallback option
- [ ] **Task 8: Link contact page from footer** (AC: Linked from footer)
  - [ ] Update footer component to include "Contact" link
  - [ ] Verify link navigates to `/contact`
  - [ ] Test from all pages
- [ ] **Task 9: Write tests for contact page** (AC: All criteria)
  - [ ] Test: Page loads at `/contact`
  - [ ] Test: Form renders all fields
  - [ ] Test: Form submission sends email
  - [ ] Test: Success message displays
  - [ ] Test: Error handling works
  - [ ] Test: Keyboard navigation
  - [ ] Test: ARIA labels for accessibility
- [ ] **Task 10: Update completion notes and file list** (AC: All criteria)

## Dev Notes

### Implementation Context

This story requires **Hydrogen route implementation** - real code in the Hydrogen app.

**New files:**
- `app/routes/contact.tsx` - Contact page route with loader, action, component

**Modified files:**
- `app/components/Footer.tsx` - Add "Contact" link (or update if already present from Story 4.5)

**Previous work:**
- Story 4.5 created Footer with navigation links - may already have Contact placeholder
- This story implements the actual `/contact` page

### React Router Route Structure

**File:** `app/routes/contact.tsx`

```typescript
import type { Route } from "./+types/contact";
import { Form, json, redirect } from "react-router";

// Loader: no data needed for contact page
export async function loader({ context }: Route.LoaderArgs) {
  return json({
    meta: {
      title: "Contact Us - Isla Suds",
      description: "Get in touch with Isla Suds. We'd love to hear from you."
    }
  });
}

// Action: handle form submission
export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const message = String(formData.get("message") || "");

  // Validation
  if (!name || !email || !message) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  // TODO: Send email via Shopify Forms or external service

  return json({ success: true });
}

// Meta function
export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data.meta.title },
    { name: "description", content: data.meta.description },
  ];
}

// Component
export default function Contact() {
  // TODO: Implement form UI
}
```

### Form Integration Options

**Option A: Shopify Forms App (Recommended)**

- Install "Shopify Forms" app from App Store
- Create contact form in app dashboard
- Get form ID
- Use Shopify Forms API in action function

**Option B: External Email Service**

- Use SendGrid, Postmark, or Resend API
- Store API key in env var
- Call API from action function
- More control, but requires API setup

**Recommendation:** Start with **Option A** (Shopify Forms) for simplicity.

### Form UI Implementation

**Component structure:**

```typescript
export default function Contact() {
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher<typeof action>();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-fluid-heading mb-4">Let's Talk</h1>
      <p className="text-fluid-body text-[var(--text-muted)] mb-8">
        We'll get back to you within 24-48 hours.
      </p>

      {actionData?.success ? (
        <div className="p-4 bg-[var(--canvas-elevated)] rounded-lg">
          <p>Thanks for reaching out! We'll be in touch soon.</p>
        </div>
      ) : (
        <fetcher.Form method="post" className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={fetcher.state === "submitting"}
            className="px-6 py-3 bg-[var(--accent-primary)] text-white rounded"
          >
            {fetcher.state === "submitting" ? "Sending..." : "Send Message"}
          </button>
        </fetcher.Form>
      )}

      <div className="mt-8 pt-8 border-t">
        <p className="text-[var(--text-muted)]">
          Or email us directly at{" "}
          <a href="mailto:hello@islasuds.com" className="text-[var(--accent-primary)]">
            hello@islasuds.com
          </a>
        </p>
      </div>
    </div>
  );
}
```

### Email Sending Implementation

**Using Shopify Forms API:**

```typescript
export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const message = String(formData.get("message") || "");

  // Validation
  if (!name || !email || !message) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  // Send via Shopify Forms API
  try {
    // TODO: Replace with actual Shopify Forms API call
    // const response = await fetch("https://forms.shopify.com/...", {
    //   method: "POST",
    //   body: JSON.stringify({ name, email, message }),
    // });

    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
```

### Accessibility Requirements

**WCAG 2.1 AA compliance:**

- ✅ All form fields have `<label>` elements
- ✅ Labels are associated via `htmlFor` attribute
- ✅ Required fields marked with `required` attribute
- ✅ Error messages have `role="alert"` for screen readers
- ✅ Form is keyboard navigable (Tab order: Name → Email → Message → Submit)
- ✅ Focus indicators visible on all fields
- ✅ Color contrast 4.5:1 for text

**Testing:**
- Test with keyboard only (no mouse)
- Test with screen reader (VoiceOver/NVDA)
- Verify all fields are announced
- Verify error messages are announced

### Form Validation

**Client-side validation:**

```typescript
<input
  type="email"
  id="email"
  name="email"
  required
  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
  aria-describedby="email-error"
/>
```

**Server-side validation:**

```typescript
// In action function
if (!email.includes("@")) {
  return json({
    fieldErrors: { email: "Please enter a valid email" }
  }, { status: 400 });
}
```

### Error Handling

**Warm error messages (from project-context.md):**

- "Something went wrong sending your message. Please try again."
- "We're having trouble right now. Try emailing us directly at hello@islasuds.com"

**Never show:**
- Stack traces
- API error codes
- Technical jargon

### Footer Link Integration

**Update Footer component:**

```typescript
// In app/components/Footer.tsx
<nav>
  <Link to="/">Home</Link>
  <Link to="/about">About</Link>
  <Link to="/contact">Contact</Link>
  <Link to="/wholesale/login">Wholesale</Link>
</nav>
```

**Verify link exists from Story 4.5** - may just need to make route functional.

### Testing Approach

**Manual testing:**

1. Navigate to `/contact`
2. Fill out form
3. Submit
4. Verify email received (if integrated)
5. Test validation (empty fields, invalid email)
6. Test keyboard navigation
7. Test on mobile

**Unit tests:**

```typescript
// contact.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Contact from "./contact";

describe("Contact Page", () => {
  it("renders contact form", () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });

  it("shows success message after submission", async () => {
    // TODO: Test form submission
  });
});
```

### Project Structure Notes

**New files:**
- `app/routes/contact.tsx` - Contact page route

**Modified files:**
- `app/components/Footer.tsx` - Add/activate Contact link (if not already present)

**Alignment with architecture:**
- ✅ Uses React Router route pattern (Architecture.md)
- ✅ Semantic HTML for accessibility (project-context.md)
- ✅ Warm error messaging (NFR22)
- ✅ Design tokens for styling (project-context.md)

**Previous related stories:**
- Story 4.5 created Footer with navigation links - Contact link may be placeholder

### Content Centralization

**Contact page copy should go in:**
- `app/content/contact.ts` (new file)

```typescript
export const CONTACT_COPY = {
  heading: "Let's Talk",
  subheading: "We'll get back to you within 24-48 hours.",
  successMessage: "Thanks for reaching out! We'll be in touch soon.",
  errorMessage: "Something went wrong. Please try again or email us directly.",
  emailFallback: "Or email us directly at",
};
```

**NEVER hardcode user-facing strings in components.**

### References

- [Source: epics.md lines 1335-1358 - Story 6.7 requirements]
- [Source: epics.md line 46 - FR46: Contact page]
- [Source: project-context.md lines 161-176 - React patterns]
- [Source: project-context.md lines 412-440 - Exception handling]
- [Source: project-context.md lines 769-775 - Accessibility gotchas]
- [React Router Docs: Actions](https://reactrouter.com/en/main/route/action)
- [Shopify Forms App](https://apps.shopify.com/shopify-forms)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

_To be filled by Dev agent during implementation_

### Completion Notes List

_To be filled by Dev agent during implementation_

### File List

**New files:**
- `app/routes/contact.tsx` - Contact page route with form
- `app/routes/contact.test.tsx` - Unit tests
- `app/content/contact.ts` - Centralized copy

**Modified files:**
- `app/components/Footer.tsx` - Activate Contact link (if needed)
- `app/components/layout/Footer.tsx` - Alternative path if nested

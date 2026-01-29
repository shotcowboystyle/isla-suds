# Story 6.6: Include Day 3 Survey Link in Confirmation Email

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **customer**,
I want **to receive a survey link in my order confirmation**,
So that **I can share my experience after trying the soap**.

## Acceptance Criteria

**Given** I complete a purchase
**When** I receive the order confirmation email
**Then** the email includes:

- Teaser text: "We'd love to hear about your first shower with Isla Suds."
- Link to external survey (Typeform or similar)
- Survey link is trackable (UTM parameters or unique ID)

**And** survey asks:
- "How was your first shower?" (emotional options: "I slept better", "I felt like myself again", etc.)
- Story recall question: "What do you remember about Isla Suds?" (open text)

**And** survey is configured in external tool (Typeform/Google Forms)
**And** link is added to Shopify order confirmation template

## Tasks / Subtasks

- [ ] **Task 1: Create Day 3 survey in external tool** (AC: Survey configured)
  - [ ] Choose survey tool (Typeform recommended, Google Forms alternative)
  - [ ] Create new survey project
  - [ ] Add survey title: "Tell us about your Isla Suds experience"
  - [ ] Configure survey questions per AC
- [ ] **Task 2: Configure survey questions** (AC: Survey questions)
  - [ ] Question 1: "How was your first shower with Isla Suds?"
    - Type: Multiple choice (emotional response)
    - Options:
      - "I slept better"
      - "I felt like myself again"
      - "My skin felt softer"
      - "It was relaxing"
      - "Other (please specify)"
  - [ ] Question 2: "What do you remember about Isla Suds?"
    - Type: Open text / Long answer
    - Help text: "We'd love to hear what stuck with you"
- [ ] **Task 3: Configure survey tracking** (AC: Survey link trackable)
  - [ ] Enable response tracking in survey tool
  - [ ] Add UTM parameters to survey URL (e.g., ?utm_source=email&utm_campaign=order_confirmation)
  - [ ] Configure unique response IDs if available
  - [ ] Test tracking parameters
- [ ] **Task 4: Add survey link to order confirmation email** (AC: Link in email)
  - [ ] Open Shopify notification template (from Story 6.2)
  - [ ] Locate Day 3 survey section (placeholder added in 6.2)
  - [ ] Replace placeholder with actual survey link
  - [ ] Add teaser text: "We'd love to hear about your first shower with Isla Suds."
  - [ ] Style link as button or prominent text link
- [ ] **Task 5: Test survey flow end-to-end** (AC: All criteria)
  - [ ] Complete test order
  - [ ] Receive confirmation email
  - [ ] Click survey link
  - [ ] Complete survey
  - [ ] Verify response is recorded
  - [ ] Test on mobile email client
- [ ] **Task 6: Configure survey results access** (AC: Founder can view responses)
  - [ ] Set up survey tool account for founder
  - [ ] Configure email notifications for new responses
  - [ ] Create guide for viewing/exporting responses
  - [ ] Update story completion notes

## Dev Notes

### Implementation Context

This story has **two parts:**

1. **External survey creation** - Use Typeform or Google Forms (no code)
2. **Email template update** - Add link to Shopify notification template (Story 6.2)

**No Hydrogen code changes** - all configuration in external tools.

### Survey Tool Options

**Option A: Typeform (Recommended)**

**Pros:**
- Beautiful, branded UI
- Great mobile experience
- Built-in analytics
- Conditional logic support
- Professional appearance

**Cons:**
- Paid (free tier limited to 10 questions, 100 responses/month)

**Option B: Google Forms**

**Pros:**
- Free, unlimited responses
- Easy setup
- Good enough for MVP
- Integrates with Google Sheets

**Cons:**
- Less polished UI
- Generic branding
- Basic analytics

**Recommendation:** Start with **Google Forms** for MVP, upgrade to Typeform if budget allows.

### Survey Question Design

**Question 1: "How was your first shower with Isla Suds?"**

**Format:** Multiple choice (single select)

**Options (emotional responses):**
- "I slept better" (relaxation benefit)
- "I felt like myself again" (identity reconnection)
- "My skin felt softer" (tangible benefit)
- "It was relaxing" (general wellbeing)
- "It reminded me to slow down" (mindfulness)
- "Other (please specify)" (open text follow-up)

**Rationale:** These options capture emotional/experiential benefits beyond product features. Aligns with brand's "permission to slow down" philosophy.

**Question 2: "What do you remember about Isla Suds?"**

**Format:** Long answer (open text)

**Help text:** "We'd love to hear what stuck with you—whether it's a scent, the story, or just a feeling."

**Rationale:** Story recall measures brand memorability. Open text allows unexpected insights.

### Survey Link Tracking

**UTM parameters for email link:**

```
https://forms.google.com/your-form-id?utm_source=email&utm_campaign=order_confirmation&utm_medium=day3_survey
```

**Or for Typeform:**

```
https://form.typeform.com/to/your-form-id?utm_source=email&utm_campaign=order_confirmation
```

**Benefits:**
- Track survey source (vs. social shares, etc.)
- Measure email → survey conversion rate
- Analyze which channels drive engagement

**Note:** Some survey tools also support hidden fields for order ID tracking.

### Email Template Integration

**From Story 6.2 (Order Confirmation Email):**

Story 6.2 added a placeholder for the Day 3 survey link. Now we replace it with the actual link.

**Email section:**

```
---

We'd love to hear about your first shower with Isla Suds.

[Take our 2-minute survey] → https://forms.google.com/...?utm_source=email

Your feedback helps us craft even better experiences.

---
```

**Styling:**
- Make link prominent (button or bold text link)
- Use brand color for link (teal: #3a8a8c)
- Keep copy warm and inviting

### Testing Approach

**End-to-end test:**

1. **Create survey:**
   - Set up in Google Forms or Typeform
   - Add questions per AC
   - Test form submission
2. **Add to email:**
   - Update Shopify notification template
   - Add survey link with UTM parameters
3. **Complete test order:**
   - Use test payment card
   - Receive confirmation email
4. **Click survey link:**
   - Verify link works
   - Complete survey
   - Check response is recorded
5. **Mobile test:**
   - Forward email to mobile
   - Tap link
   - Complete survey on mobile

### Survey Results Analysis

**Founder access:**

1. **Google Forms:**
   - View responses in Forms interface
   - Export to Google Sheets for analysis
   - Set up email notifications for new responses
2. **Typeform:**
   - View responses in Typeform dashboard
   - Export to CSV or connect to analytics
   - Email notifications built-in

**Analytics insights:**
- Track response rate (% of customers who complete survey)
- Identify most common emotional responses
- Extract memorable story elements from open text
- Use insights to improve product copy and marketing

### Dependency on Story 6.2

**Story 6.2 already added placeholder** for Day 3 survey link in order confirmation email.

**In this story:**
- Replace placeholder with actual link
- Finalize copy
- Test end-to-end

**Timeline:** Story 6.2 must be complete before 6.6 can add the real link.

### Project Structure Notes

**No codebase files modified** - external survey tool and Shopify email template only.

**Configuration steps:**
1. Create survey in external tool
2. Get survey link
3. Update Shopify notification template (from Story 6.2)

**Alignment with architecture:**
- ✅ No custom survey handling in Hydrogen
- ✅ Uses external tool (Typeform/Google Forms)
- ✅ Simple email link integration

### Survey Copy Best Practices

**DO:**
- Use warm, personal language
- Ask about emotions/experience, not just product
- Keep survey short (2 minutes max)
- Thank respondent at end

**DON'T:**
- Ask for rating scales (1-5) - not brand-aligned
- Make survey required
- Ask demographic questions unless necessary
- Use corporate/formal language

### References

- [Source: epics.md lines 1310-1333 - Story 6.6 requirements]
- [Source: epics.md lines 82-87 - FR37-40: Post-purchase communication]
- [Source: 6-2-configure-order-confirmation-email.md - Email template setup]
- [Google Forms](https://forms.google.com)
- [Typeform](https://www.typeform.com)
- [UTM Parameter Guide](https://support.google.com/analytics/answer/1033863)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A - External survey tool + Shopify email template

### Completion Notes List

_To be filled by Dev agent during implementation_

**Configuration checklist:**
- [ ] Survey tool selected (Google Forms or Typeform)
- [ ] Survey created with 2 questions
- [ ] Emotional response options configured
- [ ] UTM tracking parameters added
- [ ] Survey link added to order confirmation email
- [ ] End-to-end test completed
- [ ] Mobile test verified
- [ ] Founder access configured
- [ ] Survey link documented

### File List

**No files modified** - External survey tool + Shopify admin configuration only

**External tools configured:**
- Google Forms or Typeform survey

**Shopify Admin areas modified:**
- Settings → Notifications → Order confirmation template (updated from Story 6.2)

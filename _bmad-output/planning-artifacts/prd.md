---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments:
  - product-brief-isla-suds-2026-01-23.md
  - ux-design-specification.md
documentCounts:
  briefs: 1
  research: 0
  uxDesign: 1
  projectDocs: 0
classification:
  projectType: web_app
  domain: retail_ecommerce
  complexity: low
  projectContext: greenfield
workflowType: 'prd'
date: 2026-01-24
author: Bubbles
status: complete
---

# Product Requirements Document - Isla Suds

**Author:** Bubbles
**Date:** 2026-01-24
**Version:** 1.0

---

## Executive Summary

**Isla Suds** is a Shopify Hydrogen e-commerce storefront for an artisanal goat milk soap brand with 4 handcrafted products. The site serves two audiences: B2C consumers seeking an immersive, sensory-rich shopping experience, and B2B wholesale partners needing frictionless reordering.

**Core Bet:** Anti-aggressive commerce. No pop-ups, no fake urgency, no dark patterns. The hypothesis is that intentional buyers convert through genuine desire, not manipulation.

**Innovation:** The "sensory gap solution" - texture reveals with macro photography and scent narratives that transport users emotionally, bridging the gap between physical and digital product experience.

**MVP Scope:** Immersive landing, 4 product pages with texture reveals, variety pack bundle, Shopify checkout, B2B wholesale portal, and manual post-purchase follow-up.

**Phases:** MVP delivers core B2C/B2B experience → Growth adds automation, gift features, and social proof → Vision expands to subscriptions and national reach.

**Success Metrics:** 80% market-to-online customer adoption, 0 manual handling for wholesale reorders (invoices remain manual for MVP), 60%+ texture reveal engagement, 70%+ emotional success in post-purchase surveys.

---

_This PRD defines the complete capability contract for Isla Suds. UX designers, architects, and developers should treat this as the authoritative source for what to build._

---

## Success Criteria

### User Success

| Metric                         | Target                                                           | How We'll Know                |
| ------------------------------ | ---------------------------------------------------------------- | ----------------------------- |
| **Emotional resonance**        | Time on site > 3 min + Products explored ≥ 2                     | Analytics                     |
| **"Wow" moment achieved**      | Texture reveal triggered on 60%+ of sessions                     | Event tracking                |
| **Customer delight confirmed** | Positive feedback mentions texture/story                         | Post-purchase survey (3 days) |
| **Emotional success ratio**    | 70%+ choose emotional response over "just satisfied"             | Post-purchase survey          |
| **Story recall rate**          | 50%+ mention specific story details (Isla, family recipe, local) | Post-purchase survey          |
| **Purchase confidence**        | <5% cart abandonment citing "want to see in person"              | Exit surveys                  |
| **Wholesale efficiency**       | Reorder in <60 seconds                                           | Portal usage timing           |
| **Wholesale adoption**         | 100% of 3 partners on portal                                     | Track reorder source          |

### Business Success

| Metric                              | Current    | Target                                             | How We'll Track                 |
| ----------------------------------- | ---------- | -------------------------------------------------- | ------------------------------- |
| **Manual order handling**           | 2 hrs/week | 0 phone/text wholesale orders + 0 manual inventory | Founder time log                |
| **Market customer online adoption** | 0%         | 80%                                                | Booth code + checkout survey    |
| **Weekly online orders**            | 0          | Baseline established                               | Shopify dashboard               |
| **Wholesale portal errors**         | N/A        | 0                                                  | Portal error logs               |
| **Referral tracking**               | N/A        | Baseline MVP → 20% post-MVP                        | Share link clicks + conversions |

### Technical Success

| Metric                         | Target                                     |
| ------------------------------ | ------------------------------------------ |
| **Core Web Vitals**            | All pass (LCP <2.5s, FID <100ms, CLS <0.1) |
| **Texture reveal latency**     | <100ms on mobile                           |
| **Mobile responsiveness**      | 100% fluid 320px–2560px                    |
| **Accessibility**              | WCAG 2.1 AA                                |
| **Uptime (Hydrogen frontend)** | 99.5%                                      |

### Measurable Outcomes

| Timeframe    | What Success Looks Like                                               |
| ------------ | --------------------------------------------------------------------- |
| **Launch**   | Site live, wholesale partners onboarded, first non-market order       |
| **30 days**  | 100% wholesale portal adoption, baseline metrics established          |
| **90 days**  | 50%+ market customers using site, manual handling near-zero           |
| **6 months** | 80% market-to-online, 70%+ emotional success ratio, 50%+ story recall |

## Product Scope

### MVP - Minimum Viable Product

- Immersive landing with parallax + story fragments
- 4 product pages with texture reveals (<100ms)
- Variety pack bundle
- Full B2C checkout (Shopify)
- B2B wholesale portal (Shopify native)
- Attribution tracking (booth code + checkout survey)
- Post-purchase email with emotional survey + story recall question
- "Tell a friend" share link (baseline tracking)
- Mobile-first, desktop-enhanced

### Growth Features (Post-MVP)

- Professional photography
- Email capture + automation
- Customer reviews
- Referral program (target: 20% bring someone new)
- Expanded bundles

### Vision (Future)

- Subscription model
- Expanded wholesale network
- Product line expansion

## User Journeys

### Journey 1: Sarah Discovers Her People (B2C Primary - Success Path)

**The Setup:**
Sarah is scrolling her phone at 9:47 PM. Kids are finally asleep. She has 20 minutes before she collapses. A friend shared a link - "you HAVE to try this soap."

**Opening Scene:**
The page loads. Full-bleed warmth. Four colorful soap bricks floating against cream. No pop-up. No "SIGN UP FOR 10% OFF" assault. Just... space. She exhales slightly without realizing it.

**Rising Action:**
She hovers on the purple one. It lifts. The texture fills her screen - she can see the actual lavender buds pressed into the bar. Copy fades in: _"Close your eyes. A field at dusk. Your shoulders drop."_

She lingers. Taps the yellow one next. Lemongrass. _"Morning sun. The first deep breath of a clear day."_ She's not shopping anymore. She's... somewhere else. A tiny vacation.

A subtle element appears: _"Named for our daughter. Made in our kitchen."_

These are her people.

**Climax:**
She taps "Get the Collection." All four. She doesn't need to decide. The cart drawer slides in - clean, no upsells, no "customers also bought." Just her soap, ready to go.

**Resolution:**
Checkout takes 90 seconds. Confirmation email arrives with warmth, not marketing.

**The First Use (Day 3):**
The soap arrived yesterday. Tonight, after the kids are in bed, she unwraps the lavender mint. The bathroom fills with scent before she even turns on the water. The lather is creamy - richer than anything from a bottle. Her skin feels _different_ after.

She stands there an extra 30 seconds. This is hers.

**The Story Invitation (Day 4):**
Email arrives: "How was your first shower with Isla Suds?" Not a survey blast - a genuine question. Options that feel human: "I slept better" / "I felt like myself again" / "I'm already running low."

She taps "I slept better." And then texts her friend: _"okay you were right about that soap."_

### Journey 2: Sarah Hits a Snag (B2C Error Recovery)

**The Setup:**
Sarah's ready to check out. She's in the zone. Collection in cart.

**Opening Scene:**
She taps "Complete Order." Spinner. Then... card declined.

**The Isla Suds Way:**
A gentle message appears: _"Something didn't go through. Your cart is safe - let's try again."_

No red. No alarm. Just a warm nudge.

**Rising Action:**
She double-checks the card number. Typo in the expiration. Fixes it. Taps again.

**Resolution:**
Order confirmed. She never felt like she was _in trouble_. The site handled it like a friend would.

### Journey 3: Sarah Buys a Gift (B2C Edge Case)

**The Setup:**
Sarah's mother-in-law has a birthday. She's impossible to shop for. But she _does_ appreciate "the finer things."

**Opening Scene:**
Sarah returns to the site. She knows what she wants - but which scent for someone else? She hovers on Rosemary Sea Salt. _"Salt air. Herbs in the window. Home."_ That's her mother-in-law's aesthetic exactly.

**Rising Action:**
She adds two bars. At checkout, she pauses. Shipping address is different from billing. She needs to make sure there's no price on the packing slip.

**Climax:**
The checkout has a "This is a gift" checkbox. Clean. No price on receipt. Gift message optional.

**Resolution:**
Mother-in-law texts a week later: "Where did you find this? It's gorgeous." Sarah forwards the link.

### Journey 4: Jim Reorders in 47 Seconds (B2B Primary)

**The Setup:**
Jim's general store. Tuesday morning. He's stocking shelves and notices the Isla Suds display is running low. He's got 10 minutes before the lunch rush.

**Opening Scene:**
He pulls out his phone. Types the URL from memory. Login page loads. Email, password, done.

**Partner Acknowledgment:**
Dashboard appears. A simple line at the top: _"Isla Suds is in 3 local stores. Thanks for being one of them, Jim."_

He doesn't dwell on it. But it lands.

**Rising Action:**
Front and center: "YOUR LAST ORDER" - 12x Lavender, 12x Lemongrass, 6x Lavender Mint, 6x Rosemary Sea Salt. Total: $XXX.

One button: **Reorder**.

**Climax:**
He taps it. Confirmation: _"Another batch heading to [Jim's General Store]. Your customers are lucky."_

47 seconds.

**Resolution:**
Thursday, the box arrives. He restocks the display. A customer asks, "Do you have more of that goat milk soap?" He says yes.

### Journey 5: Maria Checks Invoice History (B2B Edge Case)

**The Setup:**
Maria manages purchasing for 4 convenience store locations. End of quarter. She needs invoices for expense reporting.

**Opening Scene:**
She logs into the wholesale portal. She doesn't need to reorder - she needs paperwork.

**Rising Action:**
She taps "Order History." A clean table shows past orders with dates, totals, and "Download Invoice" buttons.

**Climax:**
She downloads Q4 invoices as PDFs. Clean, professional, with her store's info and itemized totals.

**Resolution:**
Expense report done in 5 minutes. She didn't have to email the founder asking for receipts.

### Journey 6: The Founder Checks the Dashboard (Admin)

**The Setup:**
Friday afternoon. The founder opens Shopify to see how the week went.

**Opening Scene:**
Dashboard shows: 7 B2C orders this week. 1 wholesale reorder (Jim). Revenue graph trending up slightly.

**Rising Action:**
She drills into orders. All fulfilled automatically. Inventory levels look fine - she'll need to make more Lavender Mint next week.

She checks the post-purchase survey results. 4 responses. "How did buying from Isla Suds make you feel?" - 3 of 4 selected "Like I supported someone real."

**Climax:**
Story recall question: 2 of 4 mentioned "named after her daughter." The story is landing.

**Resolution:**
She closes the laptop. The site is working. She didn't touch a single manual order this week.

### Journey Requirements Summary

| Journey              | Key Capabilities Needed                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sarah - Primary**  | Constellation layout, texture reveals, story fragments, collection bundle, cart drawer, clean checkout, warm confirmation, Day 3 story invitation email |
| **Sarah - Error**    | Warm error messaging, cart persistence, easy retry, tone consistency                                                                                    |
| **Sarah - Gift**     | Gift checkout option, separate addresses, price-hidden packing, gift message, easy sharing                                                              |
| **Jim - Reorder**    | B2B login, partner acknowledgment, last-order dashboard, one-click reorder, personalized confirmation                                                   |
| **Maria - Invoices** | Order history, downloadable PDF invoices, professional formatting                                                                                       |
| **Founder - Admin**  | Shopify analytics, inventory view, survey response tracking                                                                                             |

## Innovation & Strategic Differentiation

### The Core Bet: Anti-Aggressive Commerce

Isla Suds bets against the e-commerce optimization playbook. No pop-ups, no exit-intent modals, no fake urgency, no scarcity messaging. The hypothesis: for intentional buyers who've opted out of corporate, the _absence_ of manipulation is a differentiator that builds trust and compounds through word-of-mouth.

**This is a strategic choice, not a UX preference.**

### The Sensory Gap Solution

Artisanal e-commerce struggles with a fundamental problem: products that must be touched and smelled to be appreciated. Isla Suds solves this through:

1. **Texture reveals** - Macro photography showing visible botanicals (the _source_ of the scent)
2. **Scent narratives** - Copy that describes _where the scent takes you_, not ingredient lists ("A field at dusk" not "lavender essential oil")
3. **Atmosphere shifts** - Subtle background changes that reinforce the sensory territory

**This pattern is the core conversion mechanism. Protect it.**

### The Moat: Radical Specificity

Competitors can copy the code. They cannot copy:

- A product named after a real daughter
- A real family recipe passed down
- Wholesale partners named Jim and Maria
- The conviction to say no to dark patterns

**Authenticity at this level is un-copyable.**

### Design Principle: Farmers Market Energy

The north star for all experience decisions: Does this feel like the booth? Real people, real quality, no pressure, permission to explore.

## Web App Specific Requirements

### Project-Type Overview

Shopify Hydrogen storefront (React + Remix SPA) with custom immersive frontend and Shopify-managed checkout/payments. No PWA, no native features, no CLI.

### Browser & Device Support

| Requirement          | Specification                                                        |
| -------------------- | -------------------------------------------------------------------- |
| **Target browsers**  | Modern evergreen (Chrome, Safari, Firefox, Edge - latest 2 versions) |
| **IE11**             | Not supported                                                        |
| **Mobile browsers**  | Safari iOS, Chrome Android                                           |
| **Minimum viewport** | 320px (iPhone SE)                                                    |
| **Maximum viewport** | 2560px+ (ultrawide)                                                  |

### Responsive Design

| Breakpoint                | Behavior                                                           |
| ------------------------- | ------------------------------------------------------------------ |
| **<640px (Mobile)**       | 2-column grid, no rotations, touch-optimized, native scroll        |
| **640–1024px (Tablet)**   | 2-column grid, subtle rotations, touch + hover                     |
| **1024–1440px (Desktop)** | Organic constellation, full rotations, Lenis scroll                |
| **1440–2560px (Large)**   | Expanded spacing, fluid gaps                                       |
| **>2560px (Ultrawide)**   | Constellation spreads, gallery-like spacing, text max-width capped |

### Performance Targets

| Metric             | Target         | Verification                  |
| ------------------ | -------------- | ----------------------------- |
| **LCP**            | <2.5s          | Lighthouse CI in pipeline     |
| **FID**            | <100ms         | Lighthouse CI in pipeline     |
| **CLS**            | <0.1           | Lighthouse CI in pipeline     |
| **Texture reveal** | <100ms         | Custom Performance API timing |
| **Total bundle**   | <200KB gzipped | size-limit in CI              |

### SEO Strategy

| Aspect           | Approach                                       |
| ---------------- | ---------------------------------------------- |
| **Priority**     | Secondary to experience                        |
| **Meta**         | Product pages with proper titles, descriptions |
| **Schema**       | Product schema for rich results                |
| **Crawlability** | Hydrogen SSR ensures content is indexable      |
| **Sitemap**      | Auto-generated via Shopify                     |

### Accessibility Level

| Requirement             | Specification                                 |
| ----------------------- | --------------------------------------------- |
| **Target**              | WCAG 2.1 AA                                   |
| **Keyboard navigation** | Full support                                  |
| **Screen readers**      | Semantic HTML, ARIA where needed              |
| **Focus indicators**    | Visible, styled to match brand                |
| **Animations**          | Respect prefers-reduced-motion                |
| **Color contrast**      | 4.5:1 minimum for text                        |
| **Verification**        | axe-core in CI + manual screen reader testing |
| **Implementation**      | Radix UI primitives for complex components    |

### Implementation Stack

| Layer                 | Technology                                                                           |
| --------------------- | ------------------------------------------------------------------------------------ |
| **Platform**          | Shopify Hydrogen (React + Remix)                                                     |
| **Hosting**           | Shopify Oxygen (primary) - Vercel as fallback                                        |
| **Styling**           | Tailwind CSS + CVA                                                                   |
| **Component styling** | Radix primitives styled via CVA + Tailwind using data-state selectors                |
| **Typography**        | Fraunces (Variable) + CSS clamp()                                                    |
| **Scroll**            | Lenis (desktop), native (mobile)                                                     |
| **Animation**         | Framer Motion + Intersection Observer (scroll-linked via IO for Lenis compatibility) |
| **Accessibility**     | Radix UI primitives                                                                  |

### Image Delivery Strategy

| Asset Type         | Delivery                                             |
| ------------------ | ---------------------------------------------------- |
| **Product images** | Shopify CDN (automatic)                              |
| **Custom assets**  | Cloudinary or equivalent for hero/atmospheric images |
| **Format**         | WebP/AVIF with fallbacks                             |
| **Loading**        | Lazy loading for below-fold content                  |
| **Texture macros** | Optimized but high-quality - critical for UX         |

### Performance Verification Pipeline

| Check                     | Tool                     | When          |
| ------------------------- | ------------------------ | ------------- |
| **Core Web Vitals**       | Lighthouse CI            | Every deploy  |
| **Bundle size**           | size-limit / bundlewatch | Every PR      |
| **Accessibility**         | axe-core                 | Every deploy  |
| **Texture reveal timing** | Custom Performance API   | Dev + staging |

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP - prove the sensory gap solution works and the anti-aggressive commerce bet pays off.

**Core Hypothesis:** Intentional buyers will convert without manipulation tactics if the experience creates genuine desire.

**Resource Requirements:** Solo founder + developer(s). Content (copy, photos) is founder-owned and must exist pre-dev.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**

- Sarah - Primary (discover → explore → buy)
- Jim - Reorder (login → one-click → done)
- Founder - Admin (Shopify native)

**Must-Have Capabilities:**

| Category            | Features                                                                         |
| ------------------- | -------------------------------------------------------------------------------- |
| **Core Experience** | Immersive landing, parallax, story fragments, constellation layout               |
| **Products**        | 4 product pages with texture reveals (<100ms), scent narratives                  |
| **Bundle**          | Variety pack (all 4) with one-click add                                          |
| **B2C Checkout**    | Shopify-managed (default error handling)                                         |
| **B2B Portal**      | Wholesale login, last-order dashboard, one-click reorder, partner acknowledgment |
| **Tracking**        | Booth code attribution, checkout survey, share link baseline                     |
| **Post-Purchase**   | Manual founder email at Day 3 (personal touch, on-brand)                         |
| **B2B Invoices**    | Manual (founder sends on request)                                                |

### Post-MVP Features

**Phase 2 (Growth):**

| Category             | Features                                           |
| -------------------- | -------------------------------------------------- |
| **Gift Experience**  | Price-hidden packing slip, gift message            |
| **Error Polish**     | Custom warm error messaging                        |
| **B2B Automation**   | Auto-generated downloadable invoices               |
| **Email Automation** | Klaviyo/Mailchimp integration, automated sequences |
| **Social Proof**     | Customer reviews                                   |
| **Referral**         | Formal program (20% target)                        |
| **Photography**      | Professional upgrade                               |

**Phase 3 (Vision):**

| Category             | Features                      |
| -------------------- | ----------------------------- |
| **Subscription**     | Recurring delivery            |
| **Expansion**        | New products, seasonal scents |
| **Wholesale Growth** | More partners, tiered pricing |
| **National Reach**   | Shipping optimization         |

### Decision Triggers

| Metric                  | Threshold                         | Action                                           |
| ----------------------- | --------------------------------- | ------------------------------------------------ |
| **Add-to-cart rate**    | <5% after 30 days                 | Review texture reveal engagement                 |
| **Checkout completion** | <50% of carts                     | Check Shopify analytics for dropoff points       |
| **Return visit rate**   | <10%                              | Story isn't landing - review scent narratives    |
| **Texture reveal rate** | <60% of sessions                  | Core UX failing - investigate mobile performance |
| **Wholesale reorder**   | Partner not reordering in 60 days | Personal outreach                                |
| **Story recall**        | <30% in surveys                   | Strengthen narrative fragments                   |

### Pre-Development Dependencies

| Asset                        | Owner   | Must Exist Before Sprint 1        |
| ---------------------------- | ------- | --------------------------------- |
| **Scent narratives (4)**     | Founder | Written, reviewed, final          |
| **Texture macro photos (4)** | Founder | Shot or sourced, optimized        |
| **Story fragments (3-4)**    | Founder | Copy for scattered elements       |
| **Hero imagery**             | Founder | Landing page visuals              |
| **Wholesale partner info**   | Founder | Jim/Maria details, typical orders |
| **Shopify store setup**      | Founder | Products, pricing, collections    |
| **Booth attribution code**   | Founder | Decided (e.g., "FARMSTAND")       |

### Risk Mitigation Strategy

| Risk Type     | Risk                                     | Mitigation                                                   |
| ------------- | ---------------------------------------- | ------------------------------------------------------------ |
| **Technical** | Texture reveal performance on mobile     | Test on low-end devices early. Fallback: simpler animation.  |
| **Technical** | Lenis + Framer Motion integration        | Prototype scroll first. Fallback: native scroll + IO only.   |
| **Market**    | Anti-aggressive approach doesn't convert | Decision triggers above. Test subtle additions if needed.    |
| **Resource**  | Solo founder stretched thin              | MVP is lean. Manual emails sustainable for early volume.     |
| **Content**   | Copy/photos not ready                    | Pre-dev dependencies checklist. No dev start without assets. |
| **B2B**       | Wholesale portal friction                | 3 partners = direct feedback loop. Iterate based on input.   |

## Functional Requirements

### Product Discovery & Exploration

- **FR1:** Visitors can view all 4 products in a constellation layout on the home page
- **FR2:** Visitors can explore products in any order (non-linear discovery)
- **FR3:** Visitors can trigger a texture reveal by hovering (desktop) or tapping (mobile) on a product
- **FR4:** Visitors can view macro texture photography within the reveal state
- **FR5:** Visitors can read scent narrative copy for each product within the reveal state
- **FR6:** Visitors can close/dismiss a texture reveal and return to constellation view
- **FR7:** Visitors can discover story fragments scattered throughout the page during scroll
- **FR8:** Visitors can view a collection prompt after exploring 2+ products
- **FR9:** Visitors can add the variety pack directly from the collection prompt

### Product Information

- **FR10:** Visitors can view product name, price, and brief description for each product
- **FR11:** Visitors can view the variety pack bundle as a distinct purchasable option
- **FR12:** Visitors can understand the "all 4 soaps" value proposition of the bundle

### Cart & Checkout (B2C)

- **FR13:** Visitors can add individual products to cart via a button within the texture reveal state
- **FR14:** Visitors can add the variety pack bundle to cart
- **FR15:** Visitors can view cart contents via a slide-out cart drawer
- **FR16:** Visitors can modify cart quantities within the drawer
- **FR17:** Visitors can remove items from cart
- **FR18:** Visitors can proceed to Shopify checkout from cart drawer
- **FR19:** Visitors can complete purchase via Shopify-managed checkout
- **FR20:** Customers can receive order confirmation email after purchase
- **FR21:** Returning visitors can view their previously added cart items (cart persists across sessions)
- **FR22:** Visitors can retry payment after a failed attempt without re-entering cart items

### Wholesale Portal (B2B)

- **FR23:** Wholesale partners can log in to a dedicated wholesale portal
- **FR24:** Wholesale partners can view their last order summary on the dashboard
- **FR25:** Wholesale partners can reorder their last order with one click
- **FR26:** Wholesale partners can view a personalized partner acknowledgment message
- **FR27:** Wholesale partners can view their order history
- **FR28:** Wholesale partners can request invoices (manual fulfillment for MVP)
- **FR29:** Wholesale partners receive wholesale pricing automatically when logged in

### Attribution & Analytics

- **FR30:** Visitors can enter a booth attribution code at checkout (e.g., "FARMSTAND")
- **FR31:** Visitors can answer "How did you find us?" survey at checkout
- **FR32:** Visitors can access a shareable link to send to friends
- **FR33:** System can track share link clicks and conversions
- **FR34:** System can track texture reveal events per session
- **FR35:** System can track products explored per session
- **FR36:** System can track time on site

### Post-Purchase Communication

- **FR37:** Customers can receive a Day 3 post-purchase email from founder
- **FR38:** Customers can respond to "How was your first shower?" question in email
- **FR39:** Customers can select emotional response options (e.g., "I slept better")
- **FR40:** Customers can respond to story recall question in survey

### Content & Navigation

- **FR41:** Visitors can view the hero section with brand logo and tagline
- **FR42:** Visitors can scroll to discover the full page experience
- **FR43:** Visitors can access sticky header after scrolling past hero
- **FR44:** Visitors can access cart from sticky header
- **FR45:** Visitors can navigate to About page
- **FR46:** Visitors can navigate to Contact page
- **FR47:** Visitors can navigate to Wholesale portal login
- **FR48:** Visitors can view footer with navigation links

### Accessibility & Preferences

- **FR49:** Visitors can navigate entire site via keyboard
- **FR50:** Visitors can use screen readers to access all content
- **FR51:** Visitors with reduced motion preferences see simplified animations

## Non-Functional Requirements

### Performance

| Requirement                        | Target                   | Rationale                             |
| ---------------------------------- | ------------------------ | ------------------------------------- |
| **NFR1:** Largest Contentful Paint | <2.5s                    | Core Web Vital - perceived load speed |
| **NFR2:** First Input Delay        | <100ms                   | Core Web Vital - interactivity        |
| **NFR3:** Cumulative Layout Shift  | <0.1                     | Core Web Vital - visual stability     |
| **NFR4:** Texture reveal response  | <100ms after interaction | Core UX moment must feel instant      |
| **NFR5:** Cart drawer open         | <200ms                   | Responsive feedback for add-to-cart   |
| **NFR6:** Total JS bundle          | <200KB gzipped           | Mobile data budget                    |
| **NFR7:** Time to Interactive      | <3.5s on 4G              | Mobile users on slower connections    |

### Accessibility

| Requirement                            | Target                                            | Rationale                          |
| -------------------------------------- | ------------------------------------------------- | ---------------------------------- |
| **NFR8:** WCAG compliance              | 2.1 AA                                            | Stated commitment + legal baseline |
| **NFR9:** Keyboard navigation          | 100% of interactive elements                      | Users who can't use mouse          |
| **NFR10:** Screen reader compatibility | All content accessible                            | Blind/low-vision users             |
| **NFR11:** Focus indicators            | Visible on all focusable elements                 | Keyboard navigation clarity        |
| **NFR12:** Color contrast              | 4.5:1 minimum for text                            | Low-vision readability             |
| **NFR13:** Reduced motion              | Animations simplified when prefers-reduced-motion | Motion-sensitive users             |
| **NFR14:** Touch targets               | Minimum 44x44px on mobile                         | Motor impairment + fat fingers     |

### Integration

| Requirement                       | Specification                                          | Rationale                      |
| --------------------------------- | ------------------------------------------------------ | ------------------------------ |
| **NFR15:** Shopify Storefront API | Must support all cart/checkout operations              | Core commerce functionality    |
| **NFR16:** Shopify B2B app        | Must integrate for wholesale pricing/portal            | B2B journey depends on it      |
| **NFR17:** Analytics events       | Must fire reliably for all tracked interactions        | Success metrics depend on data |
| **NFR18:** Image CDN              | Must serve optimized images (WebP/AVIF with fallbacks) | Performance depends on it      |

### Reliability

| Requirement                     | Target                                                                                          | Rationale                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------- |
| **NFR19:** Frontend uptime      | 99.5% (Shopify Oxygen SLA)                                                                      | Customers expect site to work |
| **NFR20:** Cart persistence     | Survive browser close/reopen                                                                    | Don't lose customer's work    |
| **NFR21:** Graceful degradation | If Lenis or Framer Motion fails, users can browse, add to cart, and checkout without animations | Core commerce must work       |

### UX Tone & Brand Consistency

| Requirement                     | Specification                                                | Rationale                    |
| ------------------------------- | ------------------------------------------------------------ | ---------------------------- |
| **NFR22:** Error messaging tone | Warm, non-accusatory ("Your cart is safe - let's try again") | Farmers market energy        |
| **NFR23:** Loading states       | Subtle, brand-aligned (no harsh spinners)                    | Maintain calm atmosphere     |
| **NFR24:** Empty cart state     | Friendly message guiding user back to products               | No dead ends                 |
| **NFR25:** System feedback      | Confirmation feels personal, not transactional               | Reinforce brand relationship |
| **NFR27:** Order confirmation   | Brand-warm messaging ("Your soap is on its way")             | Checkout is a moment         |

### Privacy & Compliance

| Requirement                | Specification                                          | Rationale                              |
| -------------------------- | ------------------------------------------------------ | -------------------------------------- |
| **NFR26:** GDPR compliance | Privacy policy, explicit email opt-in, right to delete | Personal data requires lawful handling |

---

## Next Steps

### Immediate (Pre-Architecture)

1. **Founder completes pre-development dependencies** - Scent narratives, texture photos, story fragments, hero imagery must be ready before development
2. **Shopify store setup** - Products, pricing, collections configured in Shopify admin
3. **Architecture phase begins** - Technical architecture document based on this PRD

### Architecture Phase

- Technology stack validation (Hydrogen + Oxygen + Lenis + Framer Motion compatibility)
- B2B portal integration approach via Shopify B2B app
- Analytics implementation plan for custom events
- Image delivery strategy confirmation (Cloudinary vs alternatives)
- Performance budget allocation per page

### Development Phase

- Epic breakdown by capability area
- Story creation with acceptance criteria tied to FRs
- Sprint planning prioritizing MVP core journeys (Sarah Primary, Jim Reorder)
- Testing strategy aligned with NFRs

---

_Document Complete. Ready for Architecture phase._

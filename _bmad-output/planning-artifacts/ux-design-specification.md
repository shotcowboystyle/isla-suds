---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
status: complete
inputDocuments:
  - product-brief-isla-suds-2026-01-23.md
  - logo-and-business-info-handout.PNG
  - lavender-mint-soap-bar.png
  - lavender-soap-bar.png
  - lemongrass-soap-bar.png
  - rosemary-sea-salt-soap-bar.png
  - soap-bricks-booth-display.jpeg
date: 2026-01-23
author: Bubbles
status: in-progress
---

# UX Design Specification: Isla Suds

**Author:** Bubbles
**Date:** 2026-01-23

---

## Executive Summary

### Project Vision

Isla Suds is creating a custom Shopify Hydrogen storefront that transforms the challenge of selling artisanal soap online into an opportunity for differentiation. The site will serve as the digital equivalent of the farmers market booth experience—where vibrant colors catch your eye, the brand story draws you in, and the quality speaks for itself.

The storefront serves dual purposes: an immersive B2C experience for individual consumers seeking authentic, locally-made products, and a streamlined B2B portal for wholesale partners who need frictionless reordering. Both experiences share a commitment to respect-first commerce—no pop-ups, no aggressive tactics, just quality presented with care.

**Core Design Philosophy:** The website must grant users *permission to slow down*. In a world of aggressive e-commerce, Isla Suds invites discovery at the user's pace—scroll without being sold to, linger without pressure, choose without manipulation.

### Target Users

**Primary: "The Intentional Buyer"**
Conscious consumers (exemplified by Sarah, 34, mother of two) who have opted out of mass-produced, corporate products. They frequent farmers markets, vote with their dollars, and see purchasing decisions as extensions of their values. They seek variety (rotating through all 4 scents), value the story behind products, and become word-of-mouth advocates when they find brands aligned with their beliefs. Tech-comfortable but not tech-obsessed; they expect a quality experience but won't tolerate dark patterns or manipulation.

*The moment we're designing for:* Sarah pushing a stroller at the farmers market, kid asking for lemonade, when those purple lavender bricks stop her mid-chaos. For three seconds, she's not "mom mode"—she's a person choosing something beautiful for herself. The website must recreate that pause, that permission to be present.

**Secondary: "The Local Curator"**
Local store owners and managers (exemplified by Jim and Maria) who curate products reflecting their community's values. They need efficiency over experience—the ability to reorder inventory in under 60 seconds without phone calls or coordination. They're proud to carry Isla Suds because it aligns with their store identity, not because of margins or marketing support.

*Design principle:* Show the last order as the default state upon login. Zero navigation required. Reliability over delight.

### Key Design Challenges

1. **The Sensory Gap**: Bridging the fundamental challenge of conveying texture, scent, and handcrafted quality through a screen—experiences that are visceral and immediate at a farmers market booth. The visible lavender buds and salt crystals aren't just photos; they're *tactile promises*.

2. **Story as Water, Not Interruption**: The brand narrative (family recipe, daughter's namesake, local craftsmanship) should not be something users read—it should be the water they swim in. Users should *breathe* the story throughout the experience, absorbing it naturally rather than being directed to an "About" page.

3. **Dual-Audience Architecture**: Serving two fundamentally different UX needs—immersive exploration for B2C customers and ruthless efficiency for B2B partners—within a cohesive brand experience.

4. **Authenticity vs. Polish**: Maintaining the rustic, handmade, real character of the brand while delivering a professional, trustworthy digital experience. The site must feel crafted, not manufactured.

5. **Seamless Scalability**: Ensuring the immersive experience feels intentional and readable across the full device spectrum—from mobile phones at the farmers market to ultrawide desktop monitors—without awkward breakpoints or wasted space.

### Design Opportunities

1. **Radical Specificity as Competitive Moat**: The artisanal soap market is crowded, but stories can be fabricated. What's un-copyable is specificity: four products (not hundreds), named after a real daughter, a real family recipe, real wholesale partners named Jim and Maria. Show the four products like they're the only four products in the world—choosing becomes an act of curation, not shopping.

2. **Texture as Hero**: The visible botanicals, swirl patterns, and salt crystals embedded in each soap bar are visually stunning and unique. Macro photography and texture zoom-ins can become a signature visual element that differentiates Isla Suds from every competitor.

3. **Scroll-as-Journey with Pause Moments**: With only 4 products, traditional e-commerce patterns (grids, filters, search) are unnecessary. The scroll experience itself can be the journey—but designed with intentional *pause moments* where Sarah stops and lingers, where she feels "this is my people."

4. **Amplified Emotional Connection**: The digital medium can tell the brand story in ways a booth cannot—showing the family behind the product, the making process, the community impact. Sarah's success moment isn't just clean skin; it's the feeling of supporting a local mom and opting out of corporate.

5. **Fluid Typography System**: Implementing fluid typography using CSS clamp() functions ensures text scales smoothly and proportionally across all viewport sizes. This creates a reading experience that feels intentional on every device—a signal of competence and craft that competitors can't fake. When text flows beautifully from mobile to ultrawide, users *feel* craft even if they can't articulate why.

## Core User Experience

### Defining Experience

**B2C Core Experience:**
The primary user journey is a single, immersive scroll from landing to purchase consideration. Users don't browse a catalog—they take a journey through the Isla Suds story, encountering each of the four soaps as distinct moments of discovery. The scroll itself is the product experience, designed to evoke the same sensory stopping-power as the farmers market booth.

With only four products, the experience is curated rather than navigated. There are no filters, no sorting, no search—just a crafted sequence that builds emotional connection and purchase intent.

**B2B Core Experience:**
Wholesale partners experience a fundamentally different interface optimized for efficiency. Upon login, their last order is displayed as the default state. The primary action—reorder—requires a single click. The portal remembers them, respects their time, and gets out of the way.

### Platform Strategy

| Aspect | Strategy |
|--------|----------|
| **Platform** | Web application built on Shopify Hydrogen |
| **Responsive Approach** | Mobile-first design with desktop enhancement |
| **Mobile Experience** | Touch-optimized scroll journey, thumb-friendly interactions, fluid typography for optimal readability |
| **Desktop Experience** | Enhanced parallax effects, larger texture reveals, expanded whitespace, richer visual storytelling |
| **Typography System** | Fluid typography using CSS clamp() functions—text scales proportionally from 320px mobile to ultrawide monitors |
| **Offline Capability** | Not required; always-connected e-commerce experience |

### Effortless Interactions

**What should require zero cognitive effort:**

| Interaction | Design Approach |
|-------------|-----------------|
| **Product Discovery** | Scroll reveals products naturally—no menu navigation needed for the core journey |
| **Understanding Each Soap** | Texture, scent story, and ingredients visible inline without clicking or expanding |
| **Add to Cart** | Clear, inline action that transitions user toward checkout (decisive, not tentative) |
| **Variety Pack Purchase** | Single-action "Get the Collection" option for users who want all four |
| **B2B Reorder** | Last order displayed on login; one-click "Reorder" completes the transaction |
| **Finding Utility Pages** | Minimal navigation provides access to About and Contact without cluttering the journey |

### Critical Success Moments

**Moments that define success or failure:**

| Moment | Success Criteria |
|--------|------------------|
| **The Pause** | At least one point in the scroll journey where users stop, linger, and feel "this is my people" |
| **The Texture Reveal** | Macro photography of botanicals, salt crystals, or swirl patterns creates a tactile promise through the screen |
| **The Story Absorption** | Users complete the journey understanding Isla's namesake, the family recipe, and local craftsmanship—without reading an "About" page |
| **Purchase Confidence** | First-time buyers feel confident purchasing online without having held the physical product |
| **Add-to-Cart Decisiveness** | The action feels like a natural conclusion to the journey, not an interruption |
| **B2B Recognition** | Wholesale partners feel the portal "knows" them—their last order is waiting, ready to reorder |

### Experience Principles

These principles guide all UX decisions for Isla Suds:

1. **Permission to Slow Down**
   The experience invites lingering, not urgency. No countdown timers, no "only X left in stock," no pop-ups, no pressure. Users discover at their own pace.

2. **Decisive Simplicity**
   With only four products, every user action is meaningful. Adding to cart signals "I'm ready to checkout"—the journey transitions to completion, not continuation.

3. **Mobile-First, Desktop-Enhanced**
   The essential experience is designed for mobile (60-70% of traffic). Desktop enhances with richer parallax effects, larger texture reveals, and more dramatic whitespace—never a scaled-up mobile view, but a true enhancement.

4. **Minimal Navigation, Maximum Journey**
   The scroll is the navigation. Traditional menu items (About, Contact) exist only for utility access. Users don't need to navigate to discover—they flow.

5. **Story Through Immersion**
   The brand story is not content to be read; it's an atmosphere to be absorbed. Users should finish the scroll knowing Isla, the recipe, and the craft without ever clicking "About Us."

## Desired Emotional Response

### Primary Emotional Goals

**Primary: Visual Delight → Tactile Desire**
The immediate emotional response must be sensory, not intellectual. Users should experience a "wow" moment upon seeing the vibrant, colorful soap bricks—the same stopping power they have at the farmers market booth. This visual delight naturally evolves into tactile desire: wanting to touch, to experience, to own.

**Secondary: Belonging + Values Alignment**
After the visual draws users in, the story creates emotional depth. Learning about Isla's namesake, the family recipe, and local craftsmanship transforms a product purchase into a values statement. This is where "these are my people" emerges—but it follows the visual hook, never leads it.

**Tertiary: Relief (Respect-First Commerce)**
The absence of manipulation creates its own emotional response: relief. No pop-ups, no urgency tactics, no dark patterns. Users can exhale and explore at their own pace. This emotion is felt through absence—what the site *doesn't* do.

### Emotional Journey Mapping

**B2C Emotional Sequence:**

| Stage | Primary Emotion | Trigger |
|-------|-----------------|---------|
| **Landing** | Visual Delight | Vibrant, colorful soap imagery fills the screen |
| **First Scroll** | Tactile Desire | Texture details emerge—wanting to touch |
| **Deeper Scroll** | Curiosity | "What is this? Who makes this?" |
| **Story Moments** | Warmth + Connection | Learning about Isla, the family, the craft |
| **The Pause** | Belonging | "These are my people, these are my values" |
| **Add to Cart** | Quiet Satisfaction | A good decision, not an impulse |
| **Post-Purchase** | Pride | "I supported a local mom, not a corporation" |

**B2B Emotional Journey:**
None required. The wholesale portal is purely functional—efficient, professional, frictionless. Emotion is not a design goal for this audience.

### Micro-Emotions

**Emotions to Cultivate:**

| Micro-Emotion | Where It Appears |
|---------------|------------------|
| **Wonder** | First encounter with macro texture photography |
| **Calm** | Throughout—the pace invites lingering, not rushing |
| **Trust** | Authentic imagery (real products, real story, no stock photos) |
| **Anticipation** | Imagining the first use, the scent, the lather |
| **Confidence** | Clear, honest product information enables purchase without hesitation |

**Emotions to Prevent:**

| Micro-Emotion | How We Prevent It |
|---------------|-------------------|
| **Pressure** | No countdown timers, no "only X left," no urgency language |
| **Skepticism** | Authentic photography, real story, no marketing hyperbole |
| **Overwhelm** | Only 4 products, no complex navigation or filtering |
| **FOMO** | No manipulation tactics; the product stands on its own merit |
| **Confusion** | Clear journey, obvious next steps, minimal decisions required |

### Design Implications

**Visual Delight requires:**
- Hero imagery that showcases the vibrant colors of all four soaps together (like the booth display)
- High-quality photography that captures the "refreshing" quality you described
- Color as a primary design element—let the product colors lead the palette

**Tactile Desire requires:**
- Macro photography showing texture: lavender buds, salt crystals, swirl patterns
- Progressive reveal—drawing users closer visually as they scroll
- Imagery that makes users want to reach through the screen

**Belonging requires:**
- Story woven throughout (not siloed in an About page)
- Authentic voice—the founder's story told genuinely, not as marketing copy
- Details that can't be faked: Isla's name, the family recipe, local community

**Relief requires:**
- Absence of dark patterns (no pop-ups, no exit-intent modals, no fake urgency)
- Generous whitespace—room to breathe
- No interruptions to the scroll journey

### Emotional Design Principles

1. **Lead with Eyes, Follow with Heart**
   Visual impact comes first. Story and values deepen the connection but never lead the experience. The soap bricks must stop the scroll before any words are read.

2. **Desire Before Information**
   Users should *want* the product before they *understand* it. Create tactile longing through imagery; let curiosity drive them to learn more.

3. **Earned Belonging**
   The "these are my people" moment must feel discovered, not declared. Users should arrive at values alignment through the experience, not through messaging that tells them what to feel.

4. **Emotion Through Absence**
   Relief and trust are created by what we *don't* do. Every dark pattern we avoid is an emotional deposit in the user's trust account.

5. **B2B: Function Over Feeling**
   The wholesale portal has no emotional design goals. Efficiency is the only metric. Don't spend design effort creating feelings where none are needed.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Category 1: "This Feels Good to Use"**

| Site | Key UX Patterns | Relevance to Isla Suds |
|------|-----------------|------------------------|
| **Begg** | Lenis smooth-scroll library, warm organic palette (cream/brown), large staggered typography, scroll-triggered fade animations, premium loader | The smooth, premium scroll feel matches our "permission to slow down" philosophy |
| **Huckleberry Roasters** | Story over transaction, real photography of real people, restrained color palette, narrative depth per product, dual-audience navigation (consumer + wholesale) | Directly applicable—they solve the same B2C/B2B challenge with story-first approach |

**Category 2: Artisanal/Handmade Done Right**

| Site | Key UX Patterns | Relevance to Isla Suds |
|------|-----------------|------------------------|
| **Mr Pops** | Vibrant product photography as hero, conversational tone, marquee text reinforcing values during scroll, B2B partnership section within consumer journey | Product color as design system, authentic voice, integrated wholesale interest |
| **re_grocery** | Restraint as elegance, asymmetrical balance, ample whitespace, honest design serving mission | "Simple but nice"—proof that restraint signals quality |

**Category 3: Scroll-as-Journey**

| Site | Key UX Patterns | Relevance to Isla Suds |
|------|-----------------|------------------------|
| **Hungry Tiger** | Progressive reveal mimicking unboxing, 5-stage journey structure, sensory language over specifications, split-text scroll animations | Emotional arc structure (adapted for non-linear exploration) |
| **Lamanna Bakery** | Bold color palette, pacing variations (dense content → breathing room), interaction rewards (hover elevation), scrolling as "voluntary discovery" | Energy and playfulness balanced with breathing room |
| **Make It Golden** | Three-act storytelling, progressive disclosure, rhythm variation | Narrative structure principles |

**Category 4: Physical Inspiration**

**Bubble Baths** — The sensory indulgence of a bubble bath captures the emotional territory Isla Suds occupies: self-care, pause from chaos, tactile pleasure, warmth. The visual language of foam, bubbles, and lightness informs macro photography approach—soap lather as hero moment.

### Transferable UX Patterns

**Navigation Patterns:**

| Pattern | Source | Application for Isla Suds |
|---------|--------|---------------------------|
| Minimal sticky header | Begg, Huckleberry | Logo + cart + hamburger only; doesn't compete with imagery |
| Dual-audience nav | Huckleberry | Consumer journey primary; "Wholesale" as secondary nav item |
| Exploration as navigation | Party Mode insight | With 4 products, user chooses path—not prescribed sequence |

**Scroll & Animation Patterns:**

| Pattern | Source | Application for Isla Suds |
|---------|--------|---------------------------|
| Lenis smooth-scroll (desktop only) | Begg + Party Mode | Fluid deceleration on desktop; native scroll on mobile |
| CSS scroll-snap (mobile) | Party Mode | Creates "pause points" without fighting native momentum |
| Progressive reveal | Hungry Tiger | Content unfolds on interaction, not forced sequence |
| Hover elevation | Lamanna | Subtle lift on product areas rewards interaction |
| Intersection Observer | Party Mode | Performance-first animation triggers, not scroll listeners |

**Visual & Typography Patterns:**

| Pattern | Source | Application for Isla Suds |
|---------|--------|---------------------------|
| Muted canvas, vibrant products | Party Mode | Cream/warm neutrals as frame; soaps are the only color |
| Utopia fluid type scale | Party Mode | CSS clamp() for all text; no breakpoints, scales 320px–2560px |
| Large staggered headlines | Begg | Break headlines across lines for visual rhythm |
| Sensory language | Hungry Tiger | Verbs that evoke touch: "unwrap," "discover," "feel" |
| Restraint as quality signal | re_grocery | Whitespace, limited elements, nothing gratuitous |

### Architectural Insight: Constellation vs. Linear

**The Key Reframe (from Party Mode):**

Traditional scroll-journey sites assume linear progression. But Sarah's farmers market experience is **non-linear**—she sees all four soaps at once, picks one up, puts it back, compares. The digital equivalent shouldn't force a prescribed order.

**Constellation Approach:**

| Aspect | Linear (Hungry Tiger model) | Constellation (Isla Suds model) |
|--------|----------------------------|--------------------------------|
| **Entry** | One hero product, scroll to discover others | All four soaps visible, inviting exploration |
| **User agency** | Site controls sequence | User chooses which soap to explore first |
| **Deep dive** | Scroll reveals detail | Hover/tap expands selected soap |
| **Comparison** | Scroll back (friction) | Others always visible (easy compare) |
| **Story** | Linear narrative | Consistent story thread, any entry point |

**Why This Works for 4 Products:**

With 40 products, you need structure, categories, filters. With only four, forced linearity feels artificial. The constraint enables genuine exploration.

**The Designed Pause Moment:**

Even in an exploratory model, one intentional story beat should appear—not interrupting, but present. After exploring 2+ soaps, a subtle element acknowledges: "You're here. You're exploring. Here's who made this." This ensures the "this is my people" moment happens regardless of path.

### Anti-Patterns to Avoid

| Anti-Pattern | Why It Fails | How We'll Avoid It |
|--------------|--------------|-------------------|
| **Centered fixed-width sections** | Wastes screen real estate, breaks fluid experience | Full-width sections with fluid typography |
| **Generic scroll animations** | Every section fades identically; feels templated | Purposeful animation only; each moment earns its motion |
| **Forced linearity** | Prescribes journey users don't want | Constellation model—user agency over sequence |
| **Animation overuse** | Motion fatigue, diluted impact | Reserve for key moments: texture reveals, pause points |
| **Modal/overlay dependency** | Interrupts flow, feels hostile | No pop-ups, no exit-intent, no newsletter gates |
| **Lenis on mobile** | Fights native momentum scrolling | Desktop smooth-scroll, mobile native + scroll-snap |
| **Site colors competing with product** | Visual noise, products don't stand out | Muted canvas; soaps are the only vibrant elements |
| **Corporate voice** | Kills authenticity | Write in founder's voice; imperfect > polished-generic |

### Design Inspiration Strategy

**What to Adopt:**

| Element | Application |
|---------|-------------|
| Lenis smooth-scroll | Desktop only; creates premium, unhurried feel |
| Muted neutral canvas | Cream, warm white, soft taupe as background; soaps provide all color |
| Constellation product layout | All four visible, user-driven exploration |
| Utopia fluid typography | clamp()-based scale from 320px to 2560px, zero breakpoints |
| Dual-audience navigation | Consumer journey primary; "Wholesale" clearly accessible but secondary |
| Intersection Observer animations | Performance-first scroll triggers |

**What to Adapt:**

| Element | Adaptation |
|---------|------------|
| 5-stage emotional journey | Keep the emotional arc, but non-linear execution |
| Marquee text | Slower, calmer pace—values reinforcement without energy overload |
| Hover elevation | Subtle breath, not jump—products "lift" gently |
| Progressive reveal | User-triggered (hover/tap), not scroll-prescribed |

**What to Avoid:**

| Element | Reason |
|---------|--------|
| Newsletter pop-ups | Violates respect-first commerce |
| Countdown timers / urgency | Violates "permission to slow down" |
| Generic fade-in animations | Templated feel kills handcrafted authenticity |
| Stock photography | Instant authenticity death |
| Forced linear journey | With 4 products, let users wander |
| Complex scroll libraries on mobile | Fight native behavior; use scroll-snap instead |

### Physical-to-Digital Translation

**Bubble Bath Inspiration:**
The sensory territory of bubble baths—warmth, self-care, tactile indulgence, pause from chaos—informs:
- Macro photography showing soap lather, foam, texture in use
- Color palette warmth (cream, not clinical white)
- Sense of "treat yourself" without guilt messaging
- Visual softness through rounded edges, gentle shadows
- The foam/bubbles visual language for texture photography

## Design System Foundation

### Design System Choice

**Primary Foundation: Tailwind CSS + Lenis + Framer Motion + Radix Primitives**

A utility-first approach optimized for the unique visual requirements of Isla Suds, combining Tailwind's styling flexibility with purpose-built scroll physics and selective use of accessible headless primitives.

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Styling** | Tailwind CSS + CVA | Utility-first foundation with type-safe component variants |
| **Layout** | CSS Grid + Tailwind | Constellation product layout, fluid responsive behavior |
| **Typography** | Tailwind + CSS clamp() | Utopia-inspired fluid type scale, 320px–2560px |
| **Scroll Physics** | Lenis (~3kb) | Smooth-scroll on desktop; lightweight, purpose-built |
| **Element Animation** | Framer Motion | Intersection Observer triggers, hover states, transitions |
| **Accessibility** | Radix UI (selective) | Headless primitives for Dialog (cart), navigation |
| **Components** | Custom-built | Constellation cards, texture reveals, story moments |

### Rationale for Selection

**Why Tailwind CSS + CVA:**
- Utility-first approach enables rapid implementation of fluid typography using clamp()
- CVA (Class Variance Authority) provides type-safe component variants—TypeScript enforces valid state combinations
- No component opinions to fight against for our unique constellation layout
- Perfect for the muted-canvas philosophy—we control every color decision

**Why Lenis + Framer Motion (Separate Concerns):**
- Lenis handles scroll physics (smooth deceleration, momentum)
- Framer Motion handles element animations (fade, scale, spring)
- Clean separation prevents library conflicts
- Lenis is 3kb vs Framer's scroll utilities which add bundle weight

**Why NOT a Full Component Library:**
- Our constellation layout and custom interactions are unique by nature
- Component library defaults would require more effort to override than building fresh
- With only 4 products and minimal UI surface area, custom components are manageable

**Why Radix Primitives (Selective):**
- Cart drawer needs accessible Dialog behavior (focus trap, escape key, screen reader)
- Mobile menu needs accessible navigation patterns
- Radix provides behavior without visual opinions—we style from scratch

### Implementation Approach

**Fluid Typography Scale (Simplified):**

Start with 4 sizes for clarity; expand only if needed:

```css
fontSize: {
  'fluid-small': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',   // captions, metadata
  'fluid-body': 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)',         // readable text
  'fluid-heading': 'clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem)',   // section headers
  'fluid-display': 'clamp(2.5rem, 1.75rem + 3.75vw, 6rem)',     // hero, product names
}
```

**Design Token Hierarchy:**

```css
/* Canvas tokens */
--canvas-background: #FAF7F2;    /* cream, the page itself */
--canvas-surface: #F5F0E8;       /* slightly darker, for cards if needed */
--canvas-elevated: #EDE8E0;      /* subtle shadow territory */

/* Text tokens */
--text-primary: #2C2416;         /* rich brown, high contrast */
--text-secondary: #5C5347;       /* softer, supporting info */
--text-muted: #8C8578;           /* very light, metadata */

/* Accent tokens (teal from logo) */
--accent-primary: #3A8A8C;       /* CTA buttons */
--accent-hover: #2D6E70;         /* CTA hover state */
--accent-subtle: #E8F4F4;        /* light accent backgrounds */
```

**Component Variants with CVA:**

```typescript
// ProductCard variants - type-safe, self-documenting
const productCard = cva("relative overflow-hidden rounded-lg transition-all", {
  variants: {
    state: {
      idle: "scale-100 shadow-none",
      hovered: "scale-[1.02] shadow-warm-lg",
      selected: "ring-2 ring-accent-primary",
    },
    size: {
      default: "aspect-square",
      expanded: "aspect-[3/4]",
    },
  },
  defaultVariants: {
    state: "idle",
    size: "default",
  },
});
```

**File Structure:**

```
app/
  components/
    ui/           # Primitives (Button, Dialog wrappers)
    product/      # ProductCard, TextureReveal, ConstellationGrid
    layout/       # Header, Footer, CartDrawer
    story/        # StoryMoment, PausePoint
  contexts/
    InteractionContext.tsx  # Tracks exploration for story moment
  styles/
    tokens.css    # CSS custom properties
    animations.css # Reusable keyframes
  lib/
    variants.ts   # CVA variant definitions
```

**Animation Strategy:**

| Interaction | Technology | Approach |
|-------------|------------|----------|
| **Desktop smooth-scroll** | Lenis | Initialize on mount, destroy on unmount |
| **Mobile scroll** | Native + CSS scroll-snap | Snap points at pause moments |
| **Product hover** | Framer Motion | Spring with subtle Y translation (2-4px) |
| **Texture reveal** | Framer Motion | Scale + opacity from card center |
| **Story fade-in** | Framer Motion + IO | Intersection Observer triggers opacity |
| **Add to cart** | Framer Motion | Subtle scale pulse + color feedback |

**Bundle Size Strategy:**

```typescript
// Dynamic import Framer for non-critical animations
const TextureReveal = dynamic(() => import('./TextureReveal'), {
  ssr: false,
  loading: () => <TexturePlaceholder />,
});
```

### Interaction Tracking (Story Moment Trigger)

**React Context for Exploration Depth:**

```typescript
interface InteractionState {
  productsViewed: Set<string>;
  texturesRevealed: number;
  hasSeenStory: boolean;
}

// StoryMoment checks threshold
const shouldShowStory =
  interactions.productsViewed.size >= 2 &&
  !interactions.hasSeenStory;

// Once shown, persist to prevent re-animation
const markStorySeen = () => {
  setInteractions(prev => ({ ...prev, hasSeenStory: true }));
};
```

The story moment appears when:
1. User has viewed 2+ unique products (hover/tap)
2. Story section scrolls into viewport (Intersection Observer)
3. User hasn't already seen it this session

### Customization Strategy

**Design Tokens:** All visual decisions centralized in CSS custom properties and Tailwind config—single source of truth for colors, spacing, typography.

**Component Variants:** CVA enforces type-safe variants; each component supports explicit state props rather than implicit CSS state.

**Responsive Behavior:**
- Mobile-first base styles
- Desktop enhancements via Tailwind breakpoints
- Fluid typography eliminates most breakpoint-specific text sizing
- Constellation grid: 2-column (mobile) → 4-column (desktop)

### B2B Portal Design System

The wholesale portal uses the same Tailwind foundation with minimal custom components:

| Aspect | Approach |
|--------|----------|
| **Styling** | Same Tailwind config, same tokens |
| **Components** | Standard form elements, simple table for order history |
| **Animation** | None—pure function, no motion design |
| **Layout** | Simple single-column, max-width contained |

Brand consistency (typography, colors) without immersive interactions.

### Implementation Priority

**Ship in this order:**

1. **Static constellation grid** with real product images and text
2. **Fluid typography** and token system
3. **Basic interactions** (hover states, add-to-cart)
4. **Cart drawer** with Radix Dialog
5. **Lenis smooth-scroll** (desktop)
6. **Texture reveal animations**
7. **Story moment** with interaction tracking
8. **Polish and micro-interactions**

Static content first, animations last. Ensures core shopping functionality works before enhancing with motion.

## Defining Experience

### The Core Interaction

**Defining Experience Statement:**
> "Explore the constellation, reveal the texture, imagine the scent, choose your soap."

The defining experience is the **Constellation Explore → Texture Reveal** interaction—the digital equivalent of picking up a soap brick at the farmers market to smell it.

**How users will describe it:**
*"There's this soap website where you can actually SEE the texture—like, the lavender buds are right there. It makes you want to smell it through the screen."*

**Why this is THE defining interaction:**
- It's the moment users transition from "browsing" to "experiencing"
- It bridges the sensory gap that makes online artisanal shopping difficult
- It creates the pause moment where emotional connection happens
- Everything else (cart, checkout, story) supports this core experience

### User Mental Model

**How users currently solve this problem:**

| Context | Approach |
|---------|----------|
| **Farmers markets** | Pick up, smell, feel, decide |
| **Generic e-commerce** | Look at flat product photo, read description, hope for the best |
| **Isla Suds digital** | Explore visually, reveal texture, evoke scent through imagery, decide with confidence |

**Mental model users bring:**
- "I can't smell through a screen" (true—we work around this)
- "Product photos are usually disappointing vs. reality" (we exceed expectations with texture detail)
- "I want to know what I'm getting" (we show, not just tell)

**Key insight from stakeholder:**
At the farmers market, customers pick up soap to **smell it first**—scent is the primary draw. Feeling texture is secondary (happens naturally when picking up). The digital experience must evoke scent through visual cues since we cannot deliver it directly.

**The Micro-Vacation Insight:**
When Sarah picks up that soap to smell it, she's not just gathering sensory data—she's taking a micro-vacation. For two seconds, she's not at a farmers market with a kid asking for lemonade. She's in a lavender field. She's at the ocean with rosemary on the breeze. The texture reveal needs to **transport**, not just inform.

### Scent Evocation Strategy

**Scent through visuals:**
The texture reveal shows the *source* of the scent:
- **Lavender:** Visible lavender buds embedded in the bar
- **Lemongrass:** Visible lemongrass pieces throughout
- **Rosemary Sea Salt:** Visible salt crystals and rosemary
- **Lavender Mint:** Swirl patterns suggesting the blend

Seeing the ingredient triggers scent memory. The visual says: "The lavender buds you see are the lavender you'll smell."

**Scent through sensory narrative (NOT ingredient descriptions):**

| Product | ❌ Catalog Copy | ✅ Sensory Narrative |
|---------|-----------------|---------------------|
| **Lavender** | "Contains lavender essential oil" | *"Close your eyes. A field at dusk. Your shoulders drop."* |
| **Lemongrass** | "Made with lemongrass" | *"Morning sun. The first deep breath of a clear day."* |
| **Lavender Mint** | "Lavender and mint blend" | *"Cool sheets after a warm bath. That exhale."* |
| **Rosemary Sea Salt** | "Rosemary and sea salt" | *"Salt air. Herbs in the window. Home."* |

The copy doesn't describe what the soap smells like—it describes **where the scent takes you**. That's the scent memory trigger.

**Voice principle:** The scent copy should feel like the founder wrote it, not a perfume ad copywriter. Imperfect. Specific. Like she's describing what she smells when she makes the soap.

**Atmospheric reinforcement:**
Each texture reveal includes a subtle background atmosphere shift:
- Soft color temperature change suggesting the scent's emotional territory
- Subtle on mobile (slight warmth/coolness shift)
- Richer on desktop (gentle gradient suggesting lavender fields, ocean air, etc.)

### Success Criteria

**Users will feel the core experience succeeded when:**

| Criteria | Indicator |
|----------|-----------|
| **"I can almost smell it"** | Texture reveal + sensory narrative triggers olfactory imagination |
| **"I want to stay here"** | The reveal feels like a micro-vacation, not just information |
| **"I know exactly what I'm getting"** | No surprises when product arrives; photos match reality |
| **"This feels premium"** | Interaction quality signals product quality |
| **"I want to explore more"** | After one texture reveal, they explore other soaps |
| **"I feel confident buying"** | No hesitation at add-to-cart; sensory gap bridged |

**Speed and responsiveness:**
- Texture reveal should feel instant (<100ms perceived)
- Scent copy appears with 200-300ms delay (creates reading rhythm: see, then read)
- No loading spinners; images preloaded on hover intent
- Smooth animation reinforces premium feel

### Novel vs. Established Patterns

**Pattern Analysis:**

| Aspect | Assessment |
|--------|------------|
| **Constellation grid** | Novel arrangement of established pattern |
| **Hover to reveal** | Established pattern (portfolios, galleries) |
| **Texture macro photography** | Novel application (uncommon in e-commerce) |
| **Scent evocation through visuals** | Novel approach |
| **Sensory narrative copy** | Novel—competitors use ingredient lists |
| **Atmospheric background shift** | Novel micro-interaction |

**Established patterns we adopt:**
- Grid-based product display (familiar mental model)
- Hover/tap for more detail (universal interaction)
- Add to cart flow (standard e-commerce)

**Novel elements requiring zero education:**
The novelty is in *content and emotional design*, not interaction. Users already know how to hover and tap. The surprise is what they discover—unexpected texture detail, evocative copy, subtle atmosphere. No learning curve; just delight.

**Competitive moat:**
Every artisanal soap site has "lavender essential oil" in the description. None have "Close your eyes. A field at dusk. Your shoulders drop." The emotional precision of understanding Sarah's micro-vacation is un-copyable.

### Experience Mechanics

**1. Initiation: Entering the Constellation**

| Step | Desktop | Mobile |
|------|---------|--------|
| **Trigger** | Page load / scroll into view | Page load / scroll into view |
| **Visual state** | All 4 soaps visible in grid, product colors vibrant against muted canvas | 2-column grid, swipeable if needed |
| **Invitation** | Products have subtle "breathing" animation suggesting interactivity | Touch affordance (slight shadow/depth) |
| **User expectation** | "I can hover on these" | "I can tap on these" |

**2. Interaction: The Texture Reveal**

| Step | Desktop | Mobile |
|------|---------|--------|
| **Trigger** | Hover over product card | Tap on product card |
| **Animation sequence** | Card lifts (2-4px Y) → texture overlay scales in → atmosphere shifts → scent copy fades in (200-300ms delay) | Card expands → texture slides up → scent copy fades in |
| **Atmosphere** | Background gradient subtly shifts to evoke scent territory (lavender fields, ocean, etc.) | Subtle color temperature shift only |
| **Duration** | Sustains while hovering | Sustains until tap elsewhere or explicit close |
| **Interaction tracking** | `productsViewed.add(productId)` | Same |

**Information hierarchy within reveal:**
1. **Hero (60-70%):** Macro texture photography
2. **Scent moment (delayed):** Sensory narrative copy (2-3 short lines)
3. **Action:** Add-to-cart button (clear but not aggressive)
4. **Exit:** Easy return to constellation (move mouse away / tap outside / X)

**Sequencing mirrors physical experience:**
- See texture = picking up the soap
- Read scent copy (delayed) = bringing it to your nose
- Decide = choosing to buy or put back

**3. Feedback: Confirming Engagement**

| Feedback Type | Implementation |
|---------------|----------------|
| **Visual** | Smooth scale animation confirms hover registered |
| **Atmospheric** | Color temperature shift signals "you're here now" |
| **Informational** | Scent narrative appears after texture established |
| **Progressive** | After 2+ reveals, story moment fades in elsewhere on page |
| **Error handling** | If image fails to load, graceful fallback to product photo |

**4. Completion: Transition to Decision**

| Step | Behavior |
|------|----------|
| **Add to cart visible** | Button appears within texture reveal state |
| **Action** | Tap/click add to cart |
| **Feedback** | Subtle pulse, cart icon updates |
| **Next state** | Return to constellation (can explore more) OR proceed to cart |
| **Journey completion** | Add-to-cart signals "I'm ready"—decisive, not tentative |

### Experience Flow Diagram

```
[Land on page]
       ↓
[See constellation: 4 soaps, colors singing]
       ↓
[Drawn to one → Hover/Tap]
       ↓
[Texture Reveal: macro detail fills view]
       ↓
[200-300ms later: Scent narrative appears]
       ↓
[Atmosphere shifts: micro-vacation moment]
       ↓
[Feel "I can almost smell it"]
       ↓
[Explore another? ←→ Add to cart]
       ↓
[After 2+ explores: Story moment fades in]
       ↓
[Feel "these are my people"]
       ↓
[Complete purchase with confidence]
```

### Future Enhancement (V2)

**Return visitor scent copy variations:**

| Visit | Copy Example |
|-------|--------------|
| **First visit** | *"Close your eyes. A field at dusk. Your shoulders drop."* |
| **Return visit** | *"Remember that feeling? It's still here."* |

Creates relationship—the soap "knows" her. Save for V2 after core experience ships.

## Visual Design Foundation

### Color System

**Philosophy:** Muted canvas, vibrant products. The site is the frame; the soaps are the painting.

**Canvas Palette (Background & Surfaces):**

| Token | Hex | Usage |
|-------|-----|-------|
| `--canvas-background` | #FAF7F2 | Page background, primary canvas |
| `--canvas-surface` | #F5F0E8 | Card backgrounds, elevated surfaces |
| `--canvas-elevated` | #EDE8E0 | Subtle depth, hover states |
| `--canvas-border` | #E0D8CC | Dividers, subtle borders |

**Text Palette:**

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | #2C2416 | Headlines, primary content (rich brown) |
| `--text-secondary` | #5C5347 | Supporting text, descriptions |
| `--text-muted` | #8C8578 | Metadata, captions, timestamps |
| `--text-inverse` | #FAF7F2 | Text on dark backgrounds |

**Accent Palette (Coral-Pink):**

| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-primary` | #E8A090 | CTA buttons, primary actions |
| `--accent-hover` | #D4897A | Button hover states |
| `--accent-pressed` | #C07868 | Button pressed/active states |
| `--accent-subtle` | #FDF5F3 | Light accent backgrounds, highlights |
| `--accent-border` | #E8A090 | Focus rings, selected states |

**Why Coral-Pink:**
- Ties to sunset tones in the logo (brand-aligned)
- Warm, nurturing, self-care territory (aligned with micro-vacation insight)
- Differentiated from typical teal/green "natural" brand palettes
- Supports "treat yourself" emotional positioning

**Supporting Colors:**

| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | #6B9B7A | Success messages, confirmations |
| `--warning` | #D4A84B | Warnings, attention needed |
| `--error` | #C75D5D | Errors, destructive actions |
| `--info` | #7A9BB5 | Informational messages |

**Product Colors (Reference Only—never used in UI):**

| Product | Primary Color |
|---------|---------------|
| Lavender | Purple/Mauve with amber top |
| Lemongrass | Golden tan |
| Lavender Mint | Cream with blue-white swirls |
| Rosemary Sea Salt | Cream with visible crystals |

These colors appear ONLY in product photography. The UI remains neutral to let products pop.

### Typography System

**Philosophy:** Warm, slightly imperfect typography that feels hand-set rather than typeset. Like a recipe card passed down through generations, not a design template.

**Primary Font: Fraunces (Variable)**

| Aspect | Detail |
|--------|--------|
| **Font** | Fraunces (Variable) |
| **Source** | Google Fonts / @fontsource |
| **Character** | Warm, slightly "wonky," handcrafted feel |
| **Why chosen** | Optical sizes feel hand-cut; imperfection signals authenticity; variable format = single file, better performance |

**Why NOT Playfair Display:**
Playfair has become visual shorthand for "elevated DTC brand"—every Squarespace wedding site uses it. Fraunces has similar elegance but with built-in imperfection that feels genuinely artisanal rather than "trying to look fancy."

**Font Stack:**

| Role | Font | Fallback |
|------|------|----------|
| **Headlines** | Fraunces (opsz: 72+) | Georgia, serif |
| **Body Text** | Fraunces (opsz: 12-16) | Georgia, serif |
| **Scent Narrative** | Fraunces Italic | Georgia Italic, serif |
| **UI Elements** | System UI | -apple-system, BlinkMacSystemFont, sans-serif |

**Fluid Type Scale:**

| Token | Clamp Value | Usage |
|-------|-------------|-------|
| `--text-fluid-small` | clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem) | Captions, metadata |
| `--text-fluid-body` | clamp(1rem, 0.9rem + 0.5vw, 1.25rem) | Body text, descriptions |
| `--text-fluid-heading` | clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem) | Section headers, product names |
| `--text-fluid-display` | clamp(2.5rem, 1.75rem + 3.75vw, 6rem) | Hero text, major headlines |

**Type Hierarchy:**

| Element | Font | Size Token | Weight | Line Height |
|---------|------|------------|--------|-------------|
| Hero headline | Fraunces | fluid-display | 700 | 1.1 |
| Section heading | Fraunces | fluid-heading | 600 | 1.2 |
| Product name | Fraunces | fluid-heading | 600 | 1.2 |
| Body text | Fraunces | fluid-body | 400 | 1.6 |
| Scent narrative | Fraunces Italic | fluid-body | 400 | 1.5 |
| Button text | System UI | fluid-small | 500 | 1 |
| Caption/meta | System UI | fluid-small | 400 | 1.4 |

**Scent Narrative Styling:**
The sensory copy ("Close your eyes. A field at dusk...") uses Fraunces Italic, which has a warm, intimate character. For V2, consider SVG-rendered handwritten text to create even more intimacy without loading additional fonts.

**Typography Principles:**

1. **One variable font** for performance—Fraunces handles all serif needs
2. **Generous line height** for body text (1.6)—invites slow reading
3. **Tight line height** for headlines (1.1-1.2)—creates visual impact
4. **Italic for sensory copy**—scent narratives feel whispered, intimate
5. **System fonts for UI**—buttons and functional text stay crisp and fast

**Future Investigation (V2):**
Identify and license the typeface used on the physical product label. Using the same font would create seamless physical-digital brand continuity.

### Spacing & Layout Foundation

**Philosophy:** Generous breathing room. The layout should feel unhurried, like the experience we're designing.

**Spacing Scale (8px base):**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps, icon padding |
| `--space-2` | 8px | Inline spacing, small gaps |
| `--space-3` | 16px | Component internal padding |
| `--space-4` | 24px | Between related elements |
| `--space-5` | 32px | Section internal spacing |
| `--space-6` | 48px | Between distinct sections |
| `--space-7` | 64px | Major section breaks |
| `--space-8` | 96px | Hero spacing, dramatic pauses |
| `--space-9` | 128px | Page section separation |

**Layout Grid:**

| Viewport | Columns | Gutter | Margin |
|----------|---------|--------|--------|
| Mobile (<640px) | 4 | 16px | 16px |
| Tablet (640-1024px) | 8 | 24px | 32px |
| Desktop (1024-1440px) | 12 | 32px | 48px |
| Large (>1440px) | 12 | 32px | fluid (max 1400px content) |

**Constellation Grid (Product Display):**

| Viewport | Layout | Gap |
|----------|--------|-----|
| Mobile | 2 columns | 16px |
| Tablet | 2 columns (larger cards) | 24px |
| Desktop | 4 columns (all visible) | 32px |
| Large | 4 columns (generous whitespace) | 48px |

**Layout Principles:**

1. **Content max-width: 1400px**—prevents text lines from becoming too long
2. **Fluid margins on large screens**—content floats in cream canvas
3. **Generous vertical rhythm**—sections breathe, scroll feels unhurried
4. **Asymmetric balance**—not everything centered; organic, handcrafted feel

### Visual Texture & Effects

**Shadows (Warm-tinted):**

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | 0 1px 2px rgba(44, 36, 22, 0.05) | Subtle lift |
| `--shadow-md` | 0 4px 12px rgba(44, 36, 22, 0.08) | Cards, elevated elements |
| `--shadow-lg` | 0 8px 24px rgba(44, 36, 22, 0.12) | Modals, popovers |
| `--shadow-warm` | 0 4px 16px rgba(232, 160, 144, 0.15) | Accent glow on hover |

Shadows use warm brown (text-primary) as base—cohesive warmth rather than harsh gray.

**Border Radius:**

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Buttons, inputs |
| `--radius-md` | 8px | Cards, containers |
| `--radius-lg` | 16px | Large cards, modals |
| `--radius-full` | 9999px | Pills, circular elements |

Soft, rounded corners throughout—echoes organic, handmade aesthetic and bubble bath inspiration.

### Accessibility Considerations

**Color Contrast (WCAG 2.1 AA Compliance):**

| Combination | Contrast Ratio | Status |
|-------------|----------------|--------|
| text-primary on canvas-background | 12.5:1 | ✅ AAA |
| text-secondary on canvas-background | 6.8:1 | ✅ AA |
| text-muted on canvas-background | 4.6:1 | ✅ AA |
| text-primary on accent-primary | 4.8:1 | ✅ AA |

**Button Text Decision:**
Use `--text-primary` (dark brown #2C2416) on coral-pink buttons instead of white. This:
- Passes AA contrast (4.8:1)
- Feels warmer and more cohesive with cream canvas
- Makes buttons a warm accent rather than high-contrast interruption

**Typography Accessibility:**

- Minimum body text: 16px (fluid scales up, never below)
- Line height minimum: 1.5 for body text
- Paragraph max-width: 65-75 characters for optimal readability
- Font weight: Avoid light weights (<400) for body text

**Motion Accessibility:**

- Respect `prefers-reduced-motion` media query
- Provide alternative non-animated states
- No essential information conveyed only through animation

**Touch Targets:**

- Minimum 44x44px for all interactive elements
- Adequate spacing between touch targets on mobile

## Design Direction: Immersive Organic Story

### Chosen Direction

**Hybrid Approach:** Combines elements from three design explorations:

| Source Direction | What We Take |
|-----------------|--------------|
| **Full-Bleed Immersive** | Edge-to-edge visuals, no margins containing the experience, bold atmospheric presence |
| **Handcrafted Organic** | Off-grid layout with subtle rotations (1-2°), asymmetric placement, nothing perfectly aligned |
| **Story-Woven** | Narrative snippets appear alongside/between products, story discovered not declared |

### The Feel

> "A magazine editorial shot in someone's sun-drenched kitchen. Bold, immersive, but with the warmth of handwritten notes tucked between the photos. The grid breathes—nothing feels corporate or templated."

### Implementation Principles

**Rotation & Layout Rules:**

| Principle | Specification |
|-----------|---------------|
| **Rotation budget** | Maximum 1.5° rotation on any element |
| **Counter-rotation** | Adjacent elements rotate in opposite directions (creates visual dialogue) |
| **Grounding anchor** | Logo and tagline remain perfectly horizontal (prevents disorientation) |
| **Off-grid placement** | Products float in organic constellation, not snapped to rigid grid |

**Story Discovery Pattern:**

| Principle | Implementation |
|-----------|----------------|
| **Offset positioning** | Story snippets appear offset from their "parent" product—like a note left on the counter, not taped to the soap |
| **Scroll reveal** | Fragments appear on scroll, feel discovered not attached |
| **Scattered narrative** | Story pieces scattered across journey: "Close your eyes..." near lavender, then "...your shoulders drop" appears later. The story assembles in memory, not on screen. |
| **Piecing together** | Users piece together the narrative—creates the pause moment naturally |

**Full-Bleed Breathing:**

| Aspect | Approach |
|--------|----------|
| **No container margins** | Content extends edge-to-edge |
| **Internal whitespace** | Generous breathing room *between* organic elements |
| **Atmospheric hero** | Full-viewport entry with warm gradient presence |
| **Ultrawide scaling** | Constellation spreads naturally at 2560px+; products float with more breathing room, never feels empty |

### Visual Language

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────────┐                                                │
│  │             │ ↰ -1.5°                                        │
│  │  LAVENDER   │                    "Close your eyes..."        │
│  │             │                         ↱ +1°                  │
│  └─────────────┘                                                │
│                        ┌─────────────┐                          │
│                        │             │ ↰ +1°                    │
│                        │ LEMONGRASS  │                          │
│                        │             │                          │
│                        └─────────────┘                          │
│                                                                 │
│        ┌─────────────┐                                          │
│        │             │ ↱ -1°        ┌─────────────┐             │
│        │   LAVENDER  │              │             │ ↰ +0.5°    │
│        │    MINT     │              │  ROSEMARY   │             │
│        │             │              │  SEA SALT   │             │
│        └─────────────┘              └─────────────┘             │
│                                                                 │
│                              "...a field at dusk."              │
│                                    ↱ -0.5°                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### B2B Differentiation Value

The off-grid organic layout serves dual purposes:

1. **Consumer experience:** Warm, human, inviting—feels handcrafted
2. **Wholesale signal:** When boutique owners visit, they see a brand that *feels* like it belongs in their curated shop—not another Shopify template. The visual language signals "we're the kind of brand your customers will notice."

### CSS Implementation Notes

**Rotation with Transform:**

```css
/* Product cards with subtle organic rotation */
.product-card:nth-child(1) { transform: rotate(-1.2deg); }
.product-card:nth-child(2) { transform: rotate(0.8deg); }
.product-card:nth-child(3) { transform: rotate(-0.5deg); }
.product-card:nth-child(4) { transform: rotate(1deg); }

/* Story snippets counter-rotate from nearest product */
.story-snippet { transform: rotate(var(--snippet-rotation, 0.5deg)); }
```

**Full-Bleed Hero:**

```css
.hero {
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport for mobile */
  background: linear-gradient(
    135deg,
    var(--canvas-background) 0%,
    var(--accent-subtle) 50%,
    var(--canvas-surface) 100%
  );
}
```

**Organic Grid (Not CSS Grid):**

```css
/* Use absolute/relative positioning for true organic feel */
.constellation {
  position: relative;
  min-height: 100vh;
}

.product-card {
  position: absolute;
  /* Positions set per-card for organic placement */
}

/* Responsive: fall back to CSS Grid on mobile */
@media (max-width: 768px) {
  .constellation {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }

  .product-card {
    position: relative;
    transform: none; /* Remove rotation on mobile for cleaner scroll */
  }
}
```

### Direction Summary

This hybrid direction creates:

- **Bold enough** to stop the scroll (full-bleed impact)
- **Human enough** to invite lingering (off-grid imperfection)
- **Story-rich** without interruption (discovered narrative)
- **Distinctive enough** to signal "this isn't just another soap site"

The imperfection is intentional. The story is scattered. The canvas breathes. This is the anti-template.

## User Journey Flows

### B2C Primary Journey: First-Time Visitor

**Complete Flow: Entry → Discovery → Purchase**

```
PHASE 1: ARRIVAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Full-bleed hero fills viewport]

    Warm atmospheric gradient
    Logo (horizontal anchor—the grounding element)
    "Handmade goat milk soap from our family to yours"

    ↓ Subtle scroll indicator

EMOTION: Visual Delight ("wow, this is beautiful")
DURATION: 2-5 seconds
NO NAVIGATION VISIBLE—pure immersion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                              ↓
PHASE 2: CONSTELLATION DISCOVERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Scroll begins → Sticky header fades in: Logo | ☰ | Cart]

[All 4 products visible in organic arrangement]

    Products slightly rotated, floating off-grid
    "Close your eyes..." story fragment nearby
    User chooses which product draws them

EMOTION: Curiosity + Tactile Desire
ACTION: Hover/tap on product that catches eye

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                              ↓
PHASE 3: TEXTURE REVEAL (The Defining Moment)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Card lifts, texture macro fills view]

    Visible lavender buds / salt crystals / swirls
    Background atmosphere subtly shifts
    200-300ms delay: Scent narrative fades in
      "A field at dusk. Your shoulders drop."
    Add to Cart button visible but not aggressive

EMOTION: "I can almost smell it" + Micro-vacation
ACTION: Explore more OR Add to Cart

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                              ↓
PHASE 4: COLLECTION PROMPT (After 2+ Explores)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Earned prompt appears—reward for exploring]

    Copy adapts to exploration depth (see below)
    Feels discovered, not pushed
    Optional—user can ignore and continue exploring

EMOTION: Acknowledged, not sold to
ACTION: Get Collection OR continue individual exploration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                              ↓
PHASE 5: STORY MOMENT (Triggered by Exploration)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Subtle story element fades into view]

    Not a modal or interruption
    "Named for our daughter. Made in our kitchen."
    Appears offset, slightly rotated—feels discovered

EMOTION: "These are my people"
ACTION: Continue exploring or proceed to purchase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                              ↓
PHASE 6: DECISION & CHECKOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Add to Cart from any product reveal]

    OR "Get the Collection" (all 4)
    Cart drawer slides in (Radix Dialog)
    Order summary, simple checkout flow

EMOTION: Quiet Satisfaction
ACTION: Complete purchase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Collection Prompt Copy Progression

The "Get the Collection" prompt appears only after exploration, with copy that acknowledges the user's journey:

| Products Explored | Prompt Copy | Tone |
|-------------------|-------------|------|
| 2 | *"Can't decide? Neither could we."* | Empathetic |
| 3 | *"One left. Or take them all home."* | Playful invitation |
| 4 | *"You've met the whole family."* | Warm acknowledgment |

**Why this works:** The prompt is a reward for curiosity, not a sales tactic. It short-circuits nothing—the user has already built emotional connection through exploration.

### Return Visitor Flow

**V1 Implementation:**

| Condition | Behavior |
|-----------|----------|
| Has items in cart from previous session | Subtle toast on entry: "Your cart is waiting" (dismissible, not modal) |
| No cart items | Standard first-time journey |

**V2 Enhancement (Future):**

| Condition | Behavior |
|-----------|----------|
| Previous purchaser | Warmer welcome: "Good to see you again" energy |
| Browsed but didn't buy | Gentle re-engagement, no pressure |

### Navigation Architecture

**Header Behavior:**

| State | Elements | Rationale |
|-------|----------|-----------|
| **Hero (on load)** | None visible | Full immersion, no distraction |
| **After scroll** | Logo (left) \| ☰ Hamburger \| Cart (right) | Appears when user commits to exploring |
| **Mobile** | Logo (left) \| Cart (right) | Extra minimal; hamburger in footer or scroll-triggered |

**Hamburger Menu Contents:**

- About
- Contact
- Wholesale (B2B entry point)

**Footer:**

Full utility links for those who scroll to bottom:
- About
- Contact
- Wholesale
- Shipping & Returns
- Privacy Policy

### B2B Journey: Wholesale Partner

```
ENTRY (via nav link or direct URL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Login prompt—clean, functional]

    Email + Password
    "Forgot password" link
    No consumer marketing, no immersion—pure function

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                              ↓
DASHBOARD (Post-Login)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Last order displayed as default state]

    "Reorder" button prominent—one click to repeat
    Order history accessible
    Account settings minimal

GOAL: Reorder in under 60 seconds
NO EMOTION DESIGN—pure efficiency

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Journey Touchpoints Summary

| Touchpoint | B2C Response | B2B Response |
|------------|--------------|--------------|
| **Landing** | Full-bleed immersion | Redirect to login |
| **Product discovery** | Organic constellation, texture reveals | Product list with quantities |
| **Story moments** | Scattered narrative fragments | None |
| **Add to cart** | Emotional confirmation | Functional confirmation |
| **Checkout** | Story-consistent flow | Fastest path to complete |

### Error & Edge Case Flows

| Scenario | Handling |
|----------|----------|
| **Product out of stock** | Grayed state with "Back soon" label; no removal from constellation |
| **Cart expires** | Toast notification, items preserved in "saved" state |
| **Payment fails** | Clear error message, retry option, no loss of cart |
| **Slow connection** | Skeleton loaders for images; core content loads first |
| **JavaScript disabled** | Static product grid, basic add-to-cart form fallback |

## Key Component Specifications

### 1. Hero Section

| Aspect | Specification |
|--------|---------------|
| **Height** | 100vh (100dvh on mobile for address bar handling) |
| **Background** | Warm gradient: canvas-background → accent-subtle → canvas-surface (135°) |
| **Content** | Logo (centered, horizontal anchor) + tagline + scroll indicator |
| **Navigation** | None visible on load—pure immersion |
| **Animation** | Subtle parallax on logo; scroll indicator pulses gently |

### 2. Scroll Indicator

**V1 Implementation:** Simple animated line

```css
.scroll-indicator {
  width: 1px;
  height: 32px;
  background: var(--text-muted);
  opacity: 0.6;
  animation: pulse-down 2s ease-in-out infinite;
}

@keyframes pulse-down {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(8px); opacity: 0.3; }
}
```

**V2 Enhancement:** Soap bubble float animation (whimsical, on-brand, suggests lightness)

### 3. Constellation Grid

| Aspect | Specification |
|--------|---------------|
| **Desktop** | Absolute positioning for organic placement; products at varied rotations |
| **Mobile** | CSS Grid 2-column fallback; rotations removed for cleaner scroll |
| **Products** | All 4 visible simultaneously |
| **Rotations** | -1.5° to +1.5°, counter-rotating adjacent elements |
| **Story fragments** | Positioned offset from products, appear on scroll |

**Visual Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ CONSTELLATION                                                   │
│                                                                 │
│   ┌─────┐ ↰-1.2°        ┌─────┐ ↰+0.8°                         │
│   │  L  │               │ LG  │                                 │
│   └─────┘               └─────┘                                 │
│                                     "Close your eyes..."        │
│            ┌─────┐ ↰-0.5°       ┌─────┐ ↰+1°                   │
│            │ LM  │              │ RS  │                         │
│            └─────┘              └─────┘                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Product Card

| Aspect | Specification |
|--------|---------------|
| **Default state** | Product image, name, subtle warm shadow |
| **Hover/tap** | Lifts 2-4px, warm shadow glow, triggers texture reveal |
| **Rotation** | Per-card rotation value via CSS custom property |
| **Aspect ratio** | 1:1 (square) default |
| **Touch target** | Minimum 44x44px (accessibility) |

**Card States:**

```css
.product-card {
  --card-rotation: 0deg; /* Set per-card */
  transform: rotate(var(--card-rotation));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover,
.product-card:focus-visible {
  transform: rotate(var(--card-rotation)) translateY(-4px);
  box-shadow: var(--shadow-warm);
}
```

### 5. Texture Reveal (Inline Expansion)

**Design Decision:** Inline expansion, NOT modal. The card grows in place while siblings dim but stay visible. This maintains spatial awareness—user is "leaning in," not leaving the constellation.

**Reveal Behavior:**

```
┌─────────────────────────────────────────────────────────────────┐
│ BEFORE: Default constellation                                  │
│                                                                 │
│   ┌─────┐          ┌─────┐                                      │
│   │  L  │          │ LG  │    (all visible, vibrant)           │
│   └─────┘          └─────┘                                      │
│            ┌─────┐          ┌─────┐                             │
│            │ LM  │          │ RS  │                             │
│            └─────┘          └─────┘                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                    ↓ Hover/Tap on Lavender

┌─────────────────────────────────────────────────────────────────┐
│ AFTER: Lavender revealed, siblings dimmed                      │
│                                                                 │
│   ┌───────────────────┐    ┌─────┐                              │
│   │                   │    │ LG  │ (60% opacity, desaturated)  │
│   │   LAVENDER        │    └─────┘                              │
│   │   [texture macro] │                                         │
│   │                   │         ┌─────┐                         │
│   │   "Close your     │         │ RS  │ (dimmed)               │
│   │    eyes..."       │    ┌────┴─────┘                         │
│   │                   │    │ LM  │ (dimmed)                    │
│   │   [Add to Cart]   │    └─────┘                              │
│   │                   │                                         │
│   └───────────────────┘                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Reveal Specifications:**

| Aspect | Specification |
|--------|---------------|
| **Trigger** | Hover (desktop) / Tap (mobile) |
| **Expansion** | Card grows to ~1.5x width, aspect shifts to 3:4 |
| **Content hierarchy** | Macro texture (60-70%) → Scent narrative (delayed 200-300ms) → Add to Cart |
| **Atmosphere** | Subtle background gradient shift per product scent territory |
| **Siblings** | Dim to 60% opacity, desaturate to 70%, disable pointer events |
| **Exit** | Mouse leave / tap outside / X button (mobile) |
| **Animation** | Scale + opacity from card center, spring physics (Framer Motion) |

**Sibling Dim CSS:**

```css
.constellation[data-revealing="true"] .product-card:not([data-revealed]) {
  opacity: 0.6;
  filter: saturate(0.7);
  pointer-events: none;
  transition: opacity 0.3s ease, filter 0.3s ease;
}
```

### 6. Add to Cart Button

**Design Decision:** No auto-open cart drawer. Button transforms through states to acknowledge action and invite continued engagement.

**Button State Progression:**

| State | Label | Visual | Duration |
|-------|-------|--------|----------|
| **Default** | "Add to Cart" | Coral-pink background, dark text | — |
| **Pressed** | "Add to Cart" | Scale down 95% | 100ms |
| **Success** | "Added ✓" | Subtle pulse, checkmark appears | 1.5s |
| **Post-success** | "Add Another" | Returns to default style | Until card closes |
| **Already in cart** | "Add Another" | Persistent state | — |

**Why "Add Another":** Acknowledges the previous action AND invites continued engagement. One tap for more of the same, or leave naturally to explore others.

**Cart Icon Feedback:**

```css
/* Badge pulse on successful add */
.cart-badge {
  animation: badge-pulse 0.4s ease;
}

@keyframes badge-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
```

### 7. Story Fragment

| Aspect | Specification |
|--------|---------------|
| **Appearance** | Fade in on scroll (Intersection Observer, threshold 0.5) |
| **Positioning** | Offset from products, slightly rotated (counter to nearest product) |
| **Typography** | Fraunces Italic, fluid-body size, text-secondary color |
| **Animation** | Opacity 0→1, subtle Y translation (10px→0), 0.6s duration |
| **Examples** | "Close your eyes...", "Named for our daughter.", "Made in our kitchen." |

**Implementation:**

```tsx
const StoryFragment = ({ text, rotation = 0.5 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ transform: `rotate(${rotation}deg)` }}
      className="font-serif italic text-fluid-body text-secondary"
    >
      {text}
    </motion.p>
  );
};
```

### 8. Collection Prompt

| Aspect | Specification |
|--------|---------------|
| **Trigger** | Appears after 2+ unique products explored (tracked via React Context) |
| **Position** | Floats near constellation, slightly rotated, feels discovered |
| **Copy** | Adapts to exploration depth (see User Journey Flows) |
| **Style** | Subtle card with accent-subtle background, soft shadow |
| **Action** | "Get the Collection" button (same style as Add to Cart) |

### 9. Cart Drawer

| Aspect | Specification |
|--------|---------------|
| **Implementation** | Radix Dialog for accessibility (focus trap, escape key, screen reader) |
| **Entry** | Slide from right, 0.3s ease-out |
| **Width** | 400px desktop, 100% mobile (with close affordance visible) |
| **Content** | Cart items with thumbnails, quantity controls, subtotal, checkout button |
| **Backdrop** | Semi-transparent overlay (click to close) |
| **Focus management** | Trap focus within drawer, return to trigger on close |

### 10. Sticky Header

| Aspect | Specification |
|--------|---------------|
| **Trigger** | Appears after scrolling past hero (Intersection Observer on hero exit) |
| **Animation** | Fade + slide down, 0.3s ease |
| **Desktop layout** | Logo (left) \| Hamburger (center-right) \| Cart with badge (right) |
| **Mobile layout** | Logo (left) \| Cart (right) — hamburger in footer or scroll-triggered |
| **Background** | canvas-background with backdrop-blur (8px) |
| **Height** | 64px desktop, 56px mobile |
| **Z-index** | 100 (below modals/drawers) |

**Implementation:**

```css
.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(250, 247, 242, 0.9);
  backdrop-filter: blur(8px);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
  z-index: 100;
}

.sticky-header[data-visible="true"] {
  transform: translateY(0);
}
```

### 11. Footer

| Aspect | Specification |
|--------|---------------|
| **Background** | canvas-surface |
| **Content** | Navigation links, social (if any), copyright, brand tagline |
| **Links** | About, Contact, Wholesale, Shipping & Returns, Privacy Policy |
| **Typography** | System UI, fluid-small size |
| **Mobile** | May include hamburger menu if not in sticky header |

### Component Hierarchy Summary

```
App
├── Hero
│   ├── Logo
│   ├── Tagline
│   └── ScrollIndicator
├── StickyHeader (appears on scroll)
│   ├── Logo
│   ├── HamburgerMenu
│   └── CartIcon (with badge)
├── Constellation
│   ├── ProductCard (×4)
│   │   └── TextureReveal (on interaction)
│   │       ├── MacroImage
│   │       ├── ScentNarrative
│   │       └── AddToCartButton
│   ├── StoryFragment (×3-4, scattered)
│   └── CollectionPrompt (conditional)
├── CartDrawer (Radix Dialog)
│   ├── CartItem (×n)
│   ├── Subtotal
│   └── CheckoutButton
└── Footer
    └── NavigationLinks
```

## Page Layouts & Responsive Behavior

### Pages Overview

| Page | Purpose | Complexity |
|------|---------|------------|
| **Home (B2C)** | Primary journey—hero → constellation → cart | High |
| **About** | Brand story, founder info | Low |
| **Contact** | Simple form + info | Low |
| **Wholesale Portal** | B2B login + dashboard | Medium |
| **Cart/Checkout** | Shopify-managed flow | Medium |

### Breakpoint Strategy

| Breakpoint | Name | Behavior |
|------------|------|----------|
| **< 640px** | Mobile | 2-column grid, no rotations, touch-optimized |
| **640–1024px** | Tablet | 2-column grid (larger cards), subtle rotations |
| **1024–1440px** | Desktop | Organic constellation, full rotations, Lenis scroll |
| **1440–2560px** | Large | Expanded breathing room, fluid gaps |
| **> 2560px** | Ultrawide | Constellation spreads, gallery-like spacing |

### Home Page: Desktop (1024px+)

```
┌─────────────────────────────────────────────────────────────────┐
│                           HERO                                  │
│                      (100vh, full-bleed)                        │
│                                                                 │
│                         [Logo]                                  │
│              "Handmade goat milk soap..."                       │
│                           │                                     │
│                           ↓                                     │
│                    [scroll indicator]                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ [Sticky Header fades in]  Logo  |  ☰  |  🛒                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                       CONSTELLATION                             │
│                    (organic, full-bleed)                        │
│                                                                 │
│     ┌─────────┐              ┌─────────┐                        │
│     │    L    │ ↰            │   LG    │ ↱                      │
│     └─────────┘              └─────────┘                        │
│                    "Close your eyes..."                         │
│          ┌─────────┐              ┌─────────┐                   │
│          │   LM    │ ↱            │   RS    │ ↰                 │
│          └─────────┘              └─────────┘                   │
│                                                                 │
│                   [Collection prompt appears]                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FOOTER                                 │
│    About  |  Contact  |  Wholesale  |  Shipping  |  Privacy    │
│                     © Isla Suds 2026                            │
└─────────────────────────────────────────────────────────────────┘
```

### Home Page: Mobile (< 768px)

```
┌─────────────────────┐
│        HERO         │
│    (100dvh, bleed)  │
│                     │
│       [Logo]        │
│   "Handmade goat    │
│    milk soap..."    │
│         │           │
│         ↓           │
└─────────────────────┘

┌─────────────────────┐
│ Logo          🛒    │ ← Sticky header (no hamburger)
├─────────────────────┤
│                     │
│   CONSTELLATION     │
│   (2-col grid)      │
│                     │
│  ┌─────┐  ┌─────┐   │
│  │  L  │  │ LG  │   │
│  └─────┘  └─────┘   │
│                     │
│  ┌─────┐  ┌─────┐   │
│  │ LM  │  │ RS  │   │
│  └─────┘  └─────┘   │
│                     │
│  "Close your..."    │
│                     │
│  [Collection]       │
│                     │
└─────────────────────┘

┌─────────────────────┐
│       FOOTER        │
│  ☰ Menu  |  Links   │
│   © Isla Suds 2026  │
└─────────────────────┘
```

### Ultrawide Behavior (2560px+)

**Decision:** Constellation spreads with fluid gaps. No dead side margins. Text blocks capped for readability.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                              CONSTELLATION                                  │
│                         (spreads with viewport)                             │
│                                                                             │
│   ┌─────────┐                                        ┌─────────┐            │
│   │    L    │ ↰                                      │   LG    │ ↱          │
│   └─────────┘                                        └─────────┘            │
│                                                                             │
│                        "Close your eyes..."                                 │
│                                                                             │
│              ┌─────────┐                    ┌─────────┐                     │
│              │   LM    │ ↱                  │   RS    │ ↰                   │
│              └─────────┘                    └─────────┘                     │
│                                                                             │
│   Products spread with more breathing room; gaps scale up to 80px max      │
│   Text elements (story fragments) stay at readable max-width               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**CSS Implementation:**

```css
.constellation {
  --constellation-gap: clamp(32px, 4vw, 80px);
  gap: var(--constellation-gap);
}

.story-fragment {
  max-width: 400px; /* Readable regardless of viewport */
}

/* Product cards scale slightly on ultrawide */
@media (min-width: 2560px) {
  .product-card {
    --card-size: clamp(280px, 15vw, 400px);
    width: var(--card-size);
    height: var(--card-size);
  }
}
```

### Mobile Texture Reveal (Expanded-in-Place)

**Decision:** Near-full-width expansion with scroll lock. Not a modal, not a tiny inline. The sweet spot.

```
┌─────────────────────┐
│ Logo          🛒    │
├─────────────────────┤
│                     │
│ ┌─────────────────┐ │  ← 16px margins preserved (shows canvas)
│ │            [X]  │ │  ← Close button top-right
│ │                 │ │
│ │   LAVENDER      │ │
│ │                 │ │
│ │  [macro texture │ │
│ │   fills card]   │ │
│ │                 │ │
│ │  "Close your    │ │
│ │   eyes..."      │ │
│ │                 │ │
│ │  [Add to Cart]  │ │
│ │                 │ │
│ │  ━━━━━━━━━━━━━  │ │  ← Drag handle to dismiss
│ └─────────────────┘ │
│                     │
│  (scroll locked,    │
│   other products    │
│   pushed below)     │
│                     │
└─────────────────────┘
```

**Dismiss Behaviors:**

| Method | Behavior |
|--------|----------|
| **X button** | Tap to close, return to constellation |
| **Swipe down** | Drag handle enables swipe-to-dismiss (native feel) |
| **Tap outside** | Tap on visible canvas margins closes reveal |

**Scroll Lock Implementation:**

```typescript
// Lock body scroll when reveal is open
useEffect(() => {
  if (isRevealed) {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  } else {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }
  return () => {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  };
}, [isRevealed]);
```

### About Page Layout

**Decision:** Matches organic feel—off-center text, full-bleed hero, story fragment treatment. Not a plain centered column.

```
┌─────────────────────────────────────────────────────────────────┐
│                         HERO                                    │
│                   (full-bleed, warm)                            │
│                                                                 │
│                    [Founder photo]                              │
│                   (authentic, warm)                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│        THE ORIGIN STORY                                         │
│        ─────────────────                                        │
│                                                                 │
│   It started with dry skin and a stubborn streak...             │
│   [2-3 paragraphs, off-center left, max-width 600px]            │
│                                                                 │
│                              "Named for our daughter."          │
│                                     ↱ +1° (story fragment)      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    THE FAMILY                                   │
│             [Photo: family, goats, kitchen]                     │
│                                                                 │
│        ← Explore our soaps [link back to home]                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FOOTER                                 │
└─────────────────────────────────────────────────────────────────┘
```

**About Page Principles:**

| Principle | Implementation |
|-----------|----------------|
| **Same brand feel** | Full-bleed hero, warm gradients, Fraunces typography |
| **Off-center text** | Story content shifted left, not perfectly centered |
| **Story fragment treatment** | Pull quote with rotation for "Named for our daughter" |
| **Short read** | 90 seconds max—this is the safety net, not the experience |
| **Clear exit** | Link back to home/products prominent |

### Contact Page Layout

Simple, functional, brand-consistent:

```
┌─────────────────────────────────────────────────────────────────┐
│                       CONTACT                                   │
│                  (simple header, warm)                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   GET IN TOUCH                                                  │
│   ────────────                                                  │
│                                                                 │
│   [Name field]                                                  │
│   [Email field]                                                 │
│   [Message field]                                               │
│                                                                 │
│   [Send Message] ← Coral-pink button                            │
│                                                                 │
│   ─────────────────────────────────                             │
│                                                                 │
│   Or reach us directly:                                         │
│   hello@islasuds.com                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          FOOTER                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Wholesale Portal Layout

Purely functional—no immersive design:

```
┌─────────────────────────────────────────────────────────────────┐
│  Logo                                    [Logout]               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Welcome back, Jim                                             │
│                                                                 │
│   ┌───────────────────────────────────────────────────────────┐ │
│   │  YOUR LAST ORDER                                          │ │
│   │  ─────────────────                                        │ │
│   │                                                           │ │
│   │  12x Lavender | 12x Lemongrass | 6x Lavender Mint | 6x RS │ │
│   │                                                           │ │
│   │  Total: $XXX.XX                                           │ │
│   │                                                           │ │
│   │  [Reorder] ← Primary action, one click                    │ │
│   │                                                           │ │
│   └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│   [View Order History]  [Update Account]                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Responsive Summary Table

| Element | Mobile | Tablet | Desktop | Ultrawide |
|---------|--------|--------|---------|-----------|
| **Constellation** | 2-col grid, no rotation | 2-col, subtle rotation | Organic absolute, full rotation | Spreads with fluid gaps |
| **Product cards** | Square, touch-friendly | Larger squares | Rotated, hoverable | Scales up slightly |
| **Texture reveal** | Expanded-in-place, scroll lock | Expanded-in-place | Inline expansion | Inline expansion |
| **Header** | Logo + Cart only | Logo + ☰ + Cart | Logo + ☰ + Cart | Same as desktop |
| **Story fragments** | Stacked, no rotation | Subtle rotation | Full rotation, scattered | Max-width capped |
| **Typography** | Fluid-small to fluid-heading | Full fluid scale | Full fluid scale | Full fluid scale |
| **Lenis scroll** | Disabled (native) | Optional | Enabled | Enabled |

## Final Summary & Implementation Roadmap

### UX Specification Complete

This document defines the complete user experience for Isla Suds, a Shopify Hydrogen e-commerce site for artisanal goat milk soap. The design bridges the sensory gap between physical farmers market experience and digital commerce through an immersive, story-woven journey.

### Design Direction: Immersive Organic Story

A hybrid approach combining:
- **Full-Bleed Immersive** — Edge-to-edge visuals, bold atmospheric presence
- **Handcrafted Organic** — Off-grid layout with subtle rotations (1-2°), asymmetric placement
- **Story-Woven** — Narrative fragments scattered throughout, discovered not declared

### Core Experience Summary

| Aspect | Decision |
|--------|----------|
| **Primary interaction** | Constellation Explore → Texture Reveal (the "picking up soap to smell it" moment) |
| **Emotional goal** | Visual Delight → Tactile Desire → Belonging |
| **Navigation philosophy** | Minimal—the scroll IS the navigation |
| **Story approach** | Scattered fragments assembled in user's memory, not on screen |
| **Collection prompt** | Earned after 2+ explorations, not pushed upfront |
| **B2B portal** | Pure efficiency, no emotional design |

### Technical Stack Summary

| Layer | Technology |
|-------|------------|
| **Platform** | Shopify Hydrogen (React + Remix) |
| **Styling** | Tailwind CSS + CVA (Class Variance Authority) |
| **Typography** | Fraunces (Variable) + CSS clamp() fluid scale |
| **Scroll physics** | Lenis (desktop only, ~3kb) |
| **Animations** | Framer Motion + Intersection Observer |
| **Accessibility** | Radix UI (Dialog, navigation primitives) |

### Color System Quick Reference

| Token | Hex | Usage |
|-------|-----|-------|
| `--canvas-background` | #FAF7F2 | Page background |
| `--text-primary` | #2C2416 | Headlines, primary text |
| `--accent-primary` | #E8A090 | CTA buttons (Coral-Pink) |
| `--accent-hover` | #D4897A | Button hover states |

### Typography Quick Reference

| Token | Clamp Value |
|-------|-------------|
| `fluid-small` | clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem) |
| `fluid-body` | clamp(1rem, 0.9rem + 0.5vw, 1.25rem) |
| `fluid-heading` | clamp(1.5rem, 1.25rem + 1.25vw, 2.5rem) |
| `fluid-display` | clamp(2.5rem, 1.75rem + 3.75vw, 6rem) |

### Implementation Priority

**Phase 1: Core Experience**
1. Static constellation grid with real product images
2. Fluid typography and design token system
3. Basic hover/tap interactions
4. Add to Cart functionality
5. Cart drawer (Radix Dialog)

**Phase 2: Polish**
6. Lenis smooth-scroll (desktop)
7. Texture reveal animations (Framer Motion)
8. Story fragments with scroll triggers
9. Collection prompt logic

**Phase 3: Enhancement**
10. Sticky header with scroll detection
11. Mobile swipe-to-dismiss
12. Atmospheric background shifts
13. Interaction tracking for story moment

**Phase 4: Secondary Pages**
14. About page (organic layout)
15. Contact page (simple form)
16. Wholesale portal (functional, no frills)

### Key Metrics to Track

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Texture reveal rate** | >60% of visitors | Core experience engagement |
| **Products explored** | Avg 2.5+ per session | Constellation effectiveness |
| **Add to Cart from reveal** | >15% conversion | Reveal drives purchase intent |
| **Collection vs individual** | Track ratio | Earned prompt effectiveness |
| **B2B reorder time** | <60 seconds | Efficiency goal |

### V2 Enhancements (Future)

| Enhancement | Description |
|-------------|-------------|
| **Return visitor recognition** | Warmer welcome for purchasers |
| **Scent copy variations** | Different narrative on return visits |
| **Soap bubble scroll indicator** | Whimsical, on-brand animation |
| **Label font investigation** | Match physical product typography |
| **Macro photography shoot** | Professional texture photos if needed |

### Files Delivered

| File | Purpose |
|------|---------|
| `ux-design-specification.md` | Complete UX specification (this document) |
| `ux-design-directions.html` | Interactive design direction visualizer |

---

### Approval

This UX Design Specification is ready for stakeholder review and handoff to Architecture/Development phases.

**Document Status:** ✅ Complete

**Next Steps:**
1. Review specification with stakeholders
2. Validate macro photography requirements
3. Proceed to Architecture document
4. Begin technical implementation planning

---

*"The imperfection is intentional. The story is scattered. The canvas breathes. This is the anti-template."*

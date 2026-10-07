# DESIGN.md: how Isla Suds looks, moves and talks

Read this before you touch any storefront UI. It records the design language the owner
approved in October 2026 across the homepage, `/partners`, the product page, the collection
page, `/about` and the nav menu. It is a set of rules plus the reasons behind them, so you can
extend the site without drifting from it.

`CLAUDE.md` covers the stack and architecture. This file covers style, voice, imagery, motion
and the patterns that implement them.

---

## 1. The brand in one breath

**Silly, sticker-loud, sunny, warm, a little absurd, and premium.** Bright photography of real
soap in slightly ridiculous situations (a goat delivering crates, a rubber duck inspecting a
bar, a woman in a suds wig), set with condensed all-caps type on tilted sticker labels.

- **Audience:** mostly women. The humour is warm and kind, never snarky, never edgy.
- **Mascot:** the goat (it's on the label). It shows up on every page, usually doing a job.
- **Premium** means real photography quality, precise layout and motion that responds to the
  visitor. It never means minimal or beige. The owner rejected a deadpan, museum-like direction
  as too cold.
- The owner **likes the silliness** and wants it enhanced, not toned down.

---

## 2. Truth rules (hard, never break)

These come from the owner and protect the brand legally and ethically.

| Never | Write instead |
|---|---|
| "unscented", "fragrance-free" | **"no added fragrance"** (the bars use essential oils) |
| New "organic" or "gluten-free facility" claims | Nothing. Both are unverified. Product titles that already say "Organic" are the owner's call |
| Invented reviews, testimonials, customer names or quotes | Real reviews only. Generated people may appear as comedy, never as named customers |
| Invented statistics or counters | Real numbers only. No number, no counter |
| AI-generated faces posing as the family, the founder or customers | Hands, animals, objects, places. The goat and the duck are fine |
| Text baked into generated images | Real HTML text over the image |
| Em dashes in visible copy | A period, comma, colon or parentheses |

**The true story** (owner, 2026-10-07), for any About-style copy:

- **True:**
  - A family recipe, handed down. Keep it vague: no era, no named relative.
  - Made by hand in our home kitchen, cut with a wire, cured six weeks on wooden racks.
  - Goat milk from a nearby farm.
  - It started with one farmers market booth, then two, then local shops asked to stock it.
  - Isla is the maker's young daughter, and she's why: they wanted something gentle enough for
    her skin.
- **Not true:**
  - A founder named "Sarah", a corporate-job or maternity-leave origin story.
  - A grandmother's Depression-era lard recipe.
  - Honey, clays or botanicals in the bars.
- **Voice:** "we", with no founder name.
- **Products:** four live bars at $10, 6 oz:
  - Eucalyptus
  - Lavender
  - Lemongrass
  - Rosemary Sea Salt
- **Ingredients:** coconut oil, palm oil, castor oil, olive oil, shea butter, goat milk and
  essential oils (`app/content/ingredients.ts`).
- **Wholesale terms** (approved to publish): 20% partner discount ($8 vs $10), 6-bar minimum.
  Kept in `TERMS` in `app/content/partners.ts`.
- **Stockists:** Odd Duck Market (North Charleston, Summerville) and Sewee Outpost (Awendaw).
  Kept in `app/content/stores.ts`.
- **Clips that are not customers:** the homepage "suds in the wild" phone clips
  (`app/assets/video/f1-f7.mp4`) are Midjourney generations. Never caption them as customers.

**Copy lives in `app/content/*.ts`**, not in components. `app/content/about.test.ts` is the
model: a test that fails if a false claim, "unscented" or an em dash comes back.

---

## 3. Voice

- Short, warm, a little cheeky. One joke per moment, and the joke is about soap, goats or
  bath time, never about the customer.
- Concrete over vague: "Cured six weeks" beats "crafted with care".
- Headlines are statements in sticker boxes: "Four bars.", "Made by hand. Then we wait.",
  "One table. Then two. Then shops."
- Small sticker asides carry the jokes: "Booth staff. Unpaid. Mostly napping.", "Delivery by
  goat not guaranteed.", "Head of Quality: one rubber duck, hired by Isla."
- **Avoid** marketing filler ("artisanal", "curated", "elevate your routine").
- **Avoid** a "scroll to explore" nudge, section counters like `01 / 06`, and an eyebrow over
  every heading. One eyebrow per page at most.

---

## 4. Visual language

### Colour (`app/styles/tailwind.css` `@theme`)

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#55bcbc` aqua | grounds, secondary stickers, buttons |
| `--color-secondary` | `#fcf4e1` cream | the paper colour: sticker boxes, copy bubbles, light grounds |
| `--color-accent` | `#ea5d5d` coral | loud grounds, stamps, primary buttons, ink |
| `--color-accent-secondary` | `#fcca75` butter | pill stickers, highlights, tape |
| `--color-black` | `#292934` | type, sticker outlines, hard shadows |
| `--color-teal-dark` | `hsl(180 50% 30%)` | focus rings and small text on light grounds |
| Scent colours | `--color-lavender`, `--color-lemongrass`, `--color-eucalyptus`, `--color-sea-salt(-dark)` | per-bar accents, via `SCENTS[id].color` |

**Every section gets its own ground.** Pages change ground act to act (coral, then cream, then
aqua, then near-black `#14161d`, then photo) instead of one colour all the way down.

**Contrast fixes are local.** Put a cream bubble or scrim behind the text, never a full-frame
dark overlay.

### Type

- **Display:** `--font-sans`, Antonio. Bold, uppercase, condensed. Headlines, stickers, buttons,
  numbers.
- **Body:** `--font-paragraph`, HelveticaNeue. Usually bold at 1.05 to 1.4rem in copy bubbles.
- **Handwriting** is only for in-world artifacts (the About recipe card and polaroid captions):
  - Homemade Apple, an older cursive
  - Caveat, our ballpoint in blue `#1f3fa8`
  - Both are self-hosted subsets in `public/fonts/`.
- **Gotcha:** the global `h1`/`h2` styles set `font-size` in vw and `letter-spacing: -0.35vw`.
  Every component heading must set its own `font-size`, `line-height` and `letter-spacing`
  (usually `0` to `-0.01em`), or small headings crush and big ones break mid-word.
- **Long names** (10+ characters, like "Lemongrass") need a smaller size class so they never
  split.

### The sticker vocabulary

Reuse these shapes. They are what make a page look like Isla Suds.

| Element | Recipe |
|---|---|
| **Label box** (section headings) | `background: var(--color-secondary)` (or aqua or coral), `outline: 3px solid var(--color-black)`, `transform: rotate(-2deg)`, Antonio uppercase, `padding: 0 .15em .08em` |
| **Pill sticker** (jokes, tags) | butter background, `2px` black border, `border-radius: 999px`, Antonio uppercase ~1rem, `rotate(6-8deg)` |
| **Stamp box** (one emphasised phrase in a headline) | cream background, a vw-based outline in coral, coral text, `rotate(-2.5deg)`; or inverted (coral background, cream text) |
| **Copy bubble** | `rgb(252 244 225 / .9-.95)`, `border-radius: 14px`, `padding: 10-16px`, bold body text |
| **Chunky button** | `3px` black border, pill radius, Antonio uppercase, hard offset shadow `0 4-5px 0 var(--color-black)`. Hover/focus: `rotate(-3deg) scale(1.05)` or lift `translateY(-4px)` with springy `cubic-bezier(.34,1.56,.64,1)` |
| **LiquidButton** | `app/components/ui/LiquidButton.tsx`, the big CTA on the homepage and partners page |
| **Ink stamp** (APPROVED) | coral border and text, `mix-blend-mode: multiply`, `rotate(-12deg to -14deg)` |
| **Polaroids, snapshots, tape** | white frame, soft two-layer shadow, a butter tape strip `rgb(252 202 117 / .72)` rotated over the top edge |

**Layout:**
- Vary the anchor act to act (lead, trail, split, centre). Not everything centred.
- Tilt things a few degrees, but keep body text level.
- Tap targets are at least 44px.

---

## 5. Imagery

### World and style

Photographic, bright, warm daylight, true colour. Never clay, low-poly, cartoon or moody dark.
Every generated image starts with this **style preamble, verbatim** (it is what makes separate
generations look like one shoot):

```
Playful premium commercial photography for a small-batch goat milk soap brand. Bright,
saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp
micro-texture; shallow depth of field; medium-format clarity; joyful and slightly
absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter
yellow. No added text, no watermark.
```

### What is real and what is reference

- **Real bar photos**, the reference for every soap in every image:
  - `scrollcraft/builds/isla-home/refs/{eucalyptus,lavender,lemongrass,rosemary}.jpg`
  - Cutouts in `app/assets/images/home/bar-*.webp`
  - Always pass the bars as `--ref` so the soap looks like Isla's.
- **Real display photo:** `wholesale-hero-background.*` (and `about/shop-display.webp`) is a
  real Isla display. It shows a "Lavender Mint" bar that is no longer sold, so never caption it
  with flavours.
- **The goat:** for a consistent goat, pass `scrollcraft/builds/isla-menu/out/home.png` as
  `--ref`. This is the white goat with grey-brown markings, a long beard and curved horns from
  the nav menu.
- **Cutout angles:** the bar cutouts are shot at angles. `SCENTS[id].barRot` (a `--bar-rot` CSS
  variable) turns each one so its label reads upright.

### Pipeline (the scroll-craft skill: `.claude/skills/scroll-craft`)

1. Generate a still:
   `node .claude/skills/scroll-craft/scripts/kie.mjs still "<preamble>\n\n<scene>" out/x.png --ar 16:9 --ref <bar or goat ref>`
   - Allowed aspect ratios include 16:9, 3:4, 4:3, 1:1 and 3:2, but **not 4:5**.
   - Write a script per batch in `scrollcraft/builds/<name>/tools/`, and keep raw outputs in
     `out/`.
2. **Look at every frame before using it.** Reroll anything with baked-in text, wrong bars,
   faces or missing limbs. Never write "headline" in a prompt: the model paints lettering.
3. Cut out with `node <build>/tools/kiejob.mjs recraft/remove-background out/x-cut.png '{"image":"@out/x.png"}'`,
   then `magick … -trim`.
4. Encode with `cwebp -q 80` (`-alpha_q 90` for cutouts).
   - Plates: 1920 wide desktop, plus a 1100×1530 portrait crop for phones.
   - Menu panels: 1200 wide at 3:4.
   - Typical files are 30 to 110 KB. No multi-MB PNGs.
5. **Video:**
   - Clips: `kie.mjs shot`. Use `--tail` to pin the last frame, for loops or a known end state.
   - Encode with `encode.sh` (dense GOP) for anything scrubbed.
   - Posters are the clip's own first and last frames.
   - Strip all audio.
6. Put files in `app/assets/images/<page>/` or `app/assets/video/…`.
   - **Create the file before you import it.** A missing asset import crashes MiniOxygen for
     every route.
7. Record the brief and spend in `scrollcraft/builds/<name>/BRIEF.md`.

### Heroes are layered

A premium hero is never one flat photo with text on it. It has a background plate, a subject on
a real contact point (bars on a counter, a loaf on a counter, a bar floating over a ledge), the
headline between planes, and a near foreground plane (foam, botanicals, a blurred bar). Each
moves at its own rate on scroll and leans toward the pointer.

---

## 6. Motion system

### Stack and rules

- GSAP with ScrollTrigger, SplitText and `@gsap/react` `useGSAP`.
- Lenis smooth scroll on desktop only (≥1024px, `lerp: 0.09`, `app/lib/scroll.ts`). Touch keeps
  native scrolling.
- **Tokens:** `app/lib/motion/tokens.ts`:
  - `REVEAL_START` / `REVEAL_END`
  - `ENTER_EASE`
  - `*_STAGGER`
  - `SCRUB_REVEAL .4` / `SCRUB_SCENE .5` / `SCRUB_PIN .8`
  - `DESKTOP_QUERY`, `MOTION_QUERY`, `REDUCED_MOTION_QUERY`
  - `PIN_PRIORITY`
  - Import these; don't invent new numbers.
- **Guard plugin registration:**
  `if (typeof document !== 'undefined') { GSAP.registerPlugin(...) }`. Oxygen evaluates every
  module in a worker where top-level timers fail the deploy.
- **All motion lives inside `GSAP.matchMedia().add(MOTION_QUERY, ...)`.**
  - **The CSS default is the final state**, so reduced motion and no-JS see a complete page.
  - The timeline sets the start state with `fromTo`.
  - Under `prefers-reduced-motion`, collapse sticky stages to `height: auto`.
- Animate only `transform`, `opacity`, `clip-path`, `filter` and CSS variables. No
  `transition: all`, and no animating `width`, `height`, `top` or `left`.

### Patterns to reuse

| Pattern | Where | Notes |
|---|---|---|
| **Layered hero planes** | `app/lib/motion/hero-planes.ts`: `useHeroTravel` (scroll, `[data-travel]`), `useHeroLean` (pointer, `[data-lean]`) | Shared by the homepage, partners, product and about heroes. Nest `data-travel` › `data-lean` › `data-hop` so the transforms never fight |
| **Cover box** | Partners `Hero.module.css`, about `AboutHero.module.css` | An aspect-ratio box sized with `cqw`/`cqh` (`container-type: size`) that covers like `object-fit: cover`, so overlays positioned in % stay glued to the art. **Centre it with `calc`, not `translate`** |
| **Sticky stage + scrub** (preferred over GSAP `pin`) | Product `Lather.tsx`, about `RecipeCard.tsx` / `Inspection.tsx` | A tall section with a `position: sticky; height: 100svh` stage and one scrubbed timeline from `top top` to `bottom bottom`. Works because `<main>` is `overflow-x: clip`. If you must `pin`, add a `PIN_PRIORITY` entry |
| **Preloader-gated entrance** | Partners/about heroes | Markup ships `data-hero-state="pending"`; CSS hides the animated bits with a 6s `visibility` failsafe; the entrance runs after `usePreloader().preloaderComplete` and `document.fonts.ready` |
| **Traveler / docks** | Product `Traveler.tsx` + `Dock.tsx` | One fixed element flies between live `[data-dock]` rects |
| **Sideways track** | About `MarketTrack.tsx` | Desktop sets the section height from the track width (on `refreshInit`) and scrubs `x`. Phones and reduced motion get a native scroll-snap strip |
| **Draw-on SVG** | About recipe card, inspection ticks | `pathLength={1}`, CSS `stroke-dasharray: 1 2`, animate `strokeDashoffset` from `1.05` to `0`. No `vector-effect: non-scaling-stroke` (it breaks the dash maths and leaves dots) |
| **Handwriting reveal** | About recipe card | `clip-path: inset(0 100% 0 0)` to `inset(0)` per line, at writing speed |
| **Card-to-product glide** | `ScentCard` + PDP `Traveler` | View Transitions via `<Link viewTransition>` with a shared `view-transition-name: bar-<handle>`. Timing lives in `app/styles/app.css`; reduced motion disables it |
| **Scrubbed video** | Product `Lather.tsx`, homepage video | Lerp the playhead on the GSAP ticker; seek only when it moved; IntersectionObserver lazy-load; muted play-then-pause to prime iOS |

### Gotchas that have already bitten

- **GSAP folds CSS `translate` and `rotate` into its own transform.** Put static CSS
  tilts/offsets on a wrapper and let GSAP own the inner element's transform.
- **A staggered `fromTo` inside a scrubbed timeline only pre-renders the first target's start
  state.** Call `GSAP.set(targets, startState)` before building the timeline, or later items
  show early.
- **SplitText with `autoSplit: true`** re-splits on resize and font load. Rebuild the timeline
  in `onSplit`.
- **Sections whose height you set in JS** must re-measure on `ScrollTrigger`'s `refreshInit`.
- **Don't put state** (venue, scent) in the dependencies of a hook that creates ScrollTriggers.
  Stack variants in one grid cell (`grid-area: 1/1`, inactive `visibility: hidden`) so switching
  never changes page height.
- **Use `strip.scrollTo`, not `scrollIntoView`**, inside horizontally scrolling strips (it
  fights Lenis).

---

## 7. Page structure: every page is a different page

Each scroll page is designed with the scroll-craft skill and logged in
`scrollcraft/FINGERPRINTS.md`. A new page must differ from **every** registered page on at
least 4 of these 6:

- grammar
- nav treatment
- hero device
- act sequence
- close pattern
- signature move

Every page also needs:

- a feeling curve
- one engineered **peak** (the longest span, with a quiet beat before it)
- one bespoke **signature** interaction
- a close that resolves and holds, rather than fading into the footer

| Route | Grammar | Signature | Peak | Close |
|---|---|---|---|---|
| `/` | Sticker book, distinct scenes | A real bar in the corner wears down as you scroll | Play-hole irises open into the suds-wig bath video | The sliver of bar lands by "Find a store" |
| `/partners` | Configurator pitch | Pick-your-shop: one control restyles every act | Shop doors part and a goat delivers the crates | The real application form, inline |
| `/products/$handle` | Docked journey (one template, four scents) | One traveling bar flies dock to dock | Scrubbed lather grows into a foam goat | Buy box with quantity |
| `/collections/$handle` | Shelf (not a scroll-craft build, not in the registry) | Pick-by-mood chips | None (a listing); cards glide into the PDP | "Can't pick? Take all 4." add-all |
| `/about` | Family scrapbook (keepsakes in time order) | The recipe card writes itself in three hands | Rubber-duck inspection, stamp slams APPROVED | Fridge door with the stamped card |

Briefs live in `scrollcraft/builds/<name>/BRIEF.md`. Read the matching one before changing a
page.

**Nav menu:** `app/components/HeaderMenu.tsx`. On hover each link shows its own goat scene
(`menu-{home,shop,stores,wholesale,about,contact}.webp`), all one goat in the bright style. New
links get a new goat scene, not stock art.

**The wholesale portal** (`/wholesale/*`) is a working tool. It deliberately stays free of the
motion stack and the silliness. Keep it plain, fast and clear.

---

## 8. Accessibility (non-negotiable)

- One `h1` per page, as a real sentence. Real text for everything that matters: card notes,
  checklists and stickers are markup, not images.
- **Decorative images:** `alt=""` and `aria-hidden`. Story images get real alt text.
- **Repeated copies** (the fridge's copy of the recipe card) are `aria-hidden`.
- **Live state changes** get `aria-live="polite"`: "Lavender it is.", venue lines.
- **Toggles:** `aria-pressed` and `aria-expanded`. Prefer native controls (radios in a
  `fieldset`, `<input type="range">`, `<select>`, `<details>`, `<dialog>`).
- **Focus:** visible `:focus-visible` outlines (`--color-teal-dark` on light, cream on dark).
- **Reduced motion:** every act lands on its final frame, with no pinned or sticky dead scroll
  and no hidden essential content.

---

## 9. Performance

- WebP everywhere. Hero plates are around 30 to 90 KB. Lazy-load below the fold.
- Server-render the hero image (`decoding="async"`). After the preloader, idle-preload the next
  likely images with `preloadImage`/`preloadImages` from `~/lib/shopify/preload` (skip when
  `saveData` is on).
- Preload fonts that would otherwise swap mid-animation, from the route's `links` export.
- Videos: `preload="none"` until near the viewport, muted, `playsInline`, phone-specific encodes.
- All sections render eagerly, because ScrollTrigger measures the whole document. Don't defer
  sections above a trigger.

---

## 10. Commerce bits

- **Add to cart:** `app/components/cart/AddToCartButton.tsx` (Hydrogen `CartForm`).
  - Pass `disabled={available ? undefined : true}` so the button keeps its own busy state.
  - Build lines from the selected or first variant.
- **Prices:** `formatMoney` (`app/utils/format-money.ts`).
- **Scent data:** `SCENTS`, `findScent`, `scentForHandle` and `BAR_FACTS` in
  `app/content/product-page.ts`. Per-scent art, mood chip, joke line, colour and rotation all
  live there.
- **Shopify descriptions** can carry pasted junk like `[ppl-ai-file-upload…]`. Run them through
  `splitDescription`.

---

## 11. Verify before you call it done

1. `npx tsc --noEmit`, `npx eslint <files>`, `npx vitest run app`.
2. Playwright specs in `tests/e2e/` (`collection-page`, `product-page`, `partners-layout`,
   `about-page`, …). Wait for the preloader to detach before interacting.
3. **Look at it.** Scroll pages have no single state, so shoot sweeps and read them:
   - `node scripts/shoot-about.mjs <url> <outDir> 1440 900 [--reduced-motion]`
   - `node scrollcraft/builds/isla-about/tools/shot.mjs <url> <prefix> <w> <h> <stops…>`
     - A stop is `N%` of the page, a pixel value, or `"<css>:<0..1>"`, meaning that far through
       one element's scroll span.
   - `node scrollcraft/builds/isla-menu/tools/hover.mjs <w> <h> <prefix>` (nav menu hovers)
   - Check 1440×900, 390×844 and reduced motion. Check tablet (~900px) when layouts switch at
     768 or 1024.
4. **Feel check:** scroll it cold, write one word per act, and compare with the brief's feeling
   curve. When they disagree, fix the page, not the brief.
5. Say what wasn't covered. Headless Chrome is not a real phone: video decode, autoplay, Low
   Power Mode and touch scrolling need a device.

Commit only when asked.

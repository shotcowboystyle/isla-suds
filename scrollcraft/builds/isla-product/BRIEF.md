# Isla Suds product page: "The bar that goes everywhere"

**Interviewed 2026-10-07** (four owner decisions, marked OWNER). Everything else authored
from the request and the homepage/partners briefs (marked AUTHORED). Built into the live
route `app/routes/products.$handle.tsx`, one template for all four bars.

## The request (OWNER, verbatim)

> review the design/scroll of the item detail page (ie., http://localhost:3000/products/eucalyptus).
> I think I have way too much going on there's no connection from section to section. ensure the
> same sillyness style is applied. use /scroll-craft to enhance the page to a premium page that
> sells the soap bar with a bit of sillyness.

## Owner decisions
- Peak: **the lather becomes a foam goat**.
- Thread: **a traveling bar** that docks into each act.
- Assets: **per-scent hero and per-scent peak** for all four bars.
- Cut: **testimonials, store map, marquee** go; ingredients and benefits fold into the story;
  close on the buy box with a one-line "also in stores" link.

## Review of the old page (why it felt disconnected)
Hero (small bar on flat colour) → ingredient orbit → rotating "why you'll love" wheel with
01-04 cards → curved "only the best" → word marquee → homepage testimonials → store map.
Seven unrelated devices, three of them copied from the homepage, no thread. Bugs: Add to
Cart disabled when in stock and built from `variants` the query never fetches (adds
nothing); "fragrance-free" claims; title "Hydrogen | …"; low-res bar photo.

## Eight topics
1. Vibe: same family as home/partners: silly, sticker-loud, sunny, premium product photo. AUTHORED.
2. Journey: AUTHORED, below. 3. Energy: confident open, calm craft, a beat of quiet, loud peak, warm close. AUTHORED.
4. Peak: OWNER (foam goat). 5. Signature: OWNER (traveling bar). 6. Range: playful.
7. Distinct scenes joined by one object. 8. Assets: real bar photos as refs, home cutouts and
   botanicals, real crate photo; per-scent scenes and clips generated.

## Feeling curve

| # | Act | Feeling | Cause | Device |
|---|---|---|---|---|
| 1 | Hero + buy | Desire | The bar floats over its own scent world (eucalyptus steam room, lavender sill...), botanicals drifting in front, price and Add to Cart right there | layered parallax |
| 2 | Cut by hand | Trust | The bar flies down and lands as the freshly cut slice beside its loaf | dock + flow |
| 3 | What's inside | Curiosity | The bar parks in the middle of its six ingredients; tap any to read it | dock + interactive ring |
| 4 | Quiet → PEAK | Hilarity | Dark, the bar alone under a tap; scroll scrubs the water, lather builds, the foam grows into a goat that blinks | sticky stage + scrubbed video |
| 5 | Meet the others | Appetite | The bar slides into its spot on a shelf with the other three | dock + shelf |
| 6 | Yours for $10 | Resolve | The bar lands in the buy box; quantity, Add to Cart, also in stores | dock + live input |

**Peak sentence:** "You scroll and the soap starts lathering, and the foam just keeps going
until it's a goat. It blinked at me."

**Tell-someone:** "It's the soap page where the bar follows you down the page and ends up as
a foam goat under the tap."

**Authored silence:** the first beat of act 4: dark stage, bar under a dry tap, nothing else.

## Style preamble (verbatim, same as home and partners)

```
Playful premium commercial photography for a small-batch goat milk soap brand. Bright,
saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp
micro-texture; shallow depth of field; medium-format clarity; joyful and slightly
absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter
yellow. No added text, no watermark.
```

## Build notes

- The traveler is one fixed image; each act has a `[data-dock]` box. Every frame the bar
  sits on the last dock above the screen's middle and flies (arc + flip) toward the next,
  reading live rects, so pin-free sticky scenes and per-breakpoint layouts need no tuning.
  At the `tap` dock it fades and the lather clip's own bar takes over.
- Per-scent `barRot` turns each bar's art so its label reads upright (the cutouts are shot
  at different angles); docks read it from a `--bar-rot` CSS variable.
- Lather clips are pinned head = tap still, tail = foam-goat still (`--tail`), so every scent
  ends on a goat. Encoded with the dense-GOP scrub encode; posters are the clips' own
  first and last frames.
- Shopify descriptions are 1,000-2,100 characters and eucalyptus contains pasted citation
  junk; the page strips bracketed tokens and shows a two-sentence lede plus a native
  disclosure with the rest.

## Feel check (2026-10-07, cold pass on eucalyptus, lavender, rosemary sweeps)

| Act | Intended | Felt | Change made |
|---|---|---|---|
| Hero | Desire | Desire | label rotation per scent; long names sized down so "Lemongrass" never splits |
| Cut by hand | Trust | Trust | Shopify description trimmed to a lede + disclosure (it was a wall of text) |
| Inside | Curiosity | Curiosity | none |
| Lather (peak) | Hilarity | Anticipation in the dark, then hilarity | none; 420svh, the longest span |
| Siblings | Appetite | Appetite | none |
| Buy box | Resolve | Resolve | sticky pill made compact so it stops covering panels |

## Spend
kie.ai balance 8,272 before, 7,606 after: **666 credits debited** (17 stills plus 3 rerolls, 4 ten-second clips).

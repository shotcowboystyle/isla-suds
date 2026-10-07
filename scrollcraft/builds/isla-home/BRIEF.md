# Isla Suds landing page: enhancement brief

**Partially interviewed, 2026-10-07.** Four decisions came from the owner directly
(marked OWNER). The rest are authored from the request, the live page, and earlier
owner decisions in project memory (marked AUTHORED). This is an enhancement of the
live Hydrogen homepage (`app/routes/_index.tsx`), not a standalone HTML build, so the
scrollcraft engine is not used: the page keeps its GSAP + Lenis stack.

## The request (OWNER, verbatim)

> I like the current sillyness of the website and would just like to enhance it,
> mainly the videos and images, but other enhancements would be looked at that would
> take the current design to the next level of a premium awwwards winning landing page

## The eight topics

1. **Vibe.** AUTHORED from the live page: *silly, sticker-loud, sunny, warm, a little
   absurd.* Condensed all-caps display type, tilted sticker label boxes, drips, a
   woman in a suds wig. References (authored): a Wes Anderson bathroom, a kids'
   bubble-bath bottle from the 80s, a Saturday-morning cereal ad.
2. **Journey.** OWNER: *keep order, upgrade all.* Hero, Message, Products, Ingredients,
   Benefits, Video, Testimonials, Local stores, Footer.
3. **Energy curve.** AUTHORED. Loud open, warm middle, a deliberate drop to near
   silence in Benefits, the loudest moment at the bath video, then a warm landing.
4. **Feeling + the one moment.** OWNER chose the moment: *the suds-wig bath lady.*
   Stage feelings authored below.
5. **One thing no other site does.** OWNER chose the seed: *the bar wears down.*
6. **Range.** OWNER (implicitly, "keep the silliness"): playful / maximalist. Not
   premium-minimal.
7. **One world or distinct scenes.** Distinct scenes, inherited from the current page.
8. **Assets.** OWNER: *generate everything new.* The testimonial clips are Midjourney
   generations, not customers (OWNER fyi). Real Isla Suds bar photos in
   `app/assets/images/*-bar.webp` are the brand reference for every product shot.

## Hard rules carried in from earlier owner decisions

- Never "unscented" or "fragrance-free". The bars use essential oils: say **"no added
  fragrance"**.
- "Organic" and "gluten-free facility" are unverified. Do not add new claims.
- No invented reviews. Generated people may appear as comedy, never as named customers
  with quotes.
- Audience skews female; humour warm, not snarky.

## Feeling curve (written before the score)

| # | Act | Feeling | What causes it |
|---|---|---|---|
| 1 | Hero | Delight | The preloader pops and real Isla bars burst out into a layered aqua sky, near bars sailing past the headline, far bars drifting slow |
| 2 | Message | Recognition | "Feel great in your own skin" fills word by word while the little bar in the corner loses its paper band |
| 3 | Products | Appetite | Four bars travel sideways, each landing crisp and huge on its own colour |
| 4 | Ingredients | Trust | A drip opens onto a sunlit bath ledge; the whole ingredient list fits on a few chips |
| 5 | Benefits | Anticipation | Dark ground, four stickers slap down one at a time, then only a small spinning "play" hole remains. **Authored silence.** |
| 6 | Video | **Hilarity (PEAK)** | The hole irises open into a sunlit bubble bath and a woman in a towering suds wig grins straight at you |
| 7 | Suds in the wild | Belonging | Phones fan out: everyone else having the same ridiculous bath |
| 8 | Local stores | Resolve | The bar you've been using all page lands as a sliver next to "Find a store" |

## The peak

> "You scroll into this tiny spinning play button and it blows open into a woman in a
> bubble bath wearing a giant suds wig, just grinning at you."

Lives in act 6. It gets the video budget (the only new clip), the silence of act 5
in front of it, and the longest pin on the page.

## Signature move: the bar that gets used up

A real Isla lavender bar rides along in the bottom corner the whole way down. It
starts new and banded, loses its band as the story starts, and wears smaller and
rounder as you scroll: photographic wear stages crossfaded off scroll progress, not a
CSS shrink. Scroll fast and it sheds bubbles. The bath scene takes the biggest bite
out of it. At the close it is a sliver, and it lands beside the store CTA with one
line: *down to a sliver? time for a new one.*

## Tell-someone sentence

> It's the site where you use up a bar of soap just by scrolling, and the bubble bath
> nearly finishes it off.

## Authored silence

End of act 5: a dark viewport holding only the small spinning play hole, roughly half
a viewport-height, before the iris starts. Not dead scroll.

## Style preamble (verbatim in every prompt)

```
Playful premium commercial photography for a small-batch goat milk soap brand. Bright,
saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp
micro-texture; shallow depth of field; medium-format clarity; joyful and slightly
absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter
yellow. No added text, no watermark.
```

## Exceptions taken

- **Botanical props** (`botanicals-*.webp`, product-card hover art) use the preamble
  minus its palette sentence. With the palette in, the generator kept adding coral and
  yellow chips to props on white. Scenes and product shots use the full preamble.

## Feel check (2026-10-07, cold pass on the final desktop sweep)

| Act | Intended | Felt | Change made |
|---|---|---|---|
| Hero | Delight | Delight | none |
| Message | Recognition | Recognition | none |
| Products | Appetite | Appetite | none (HD bars carry it) |
| Ingredients | Trust | Calm, then trust | paragraph moved onto a label so it stops fighting the jar |
| Benefits | Anticipation | Dead air on first pass | silence hold cut from 0.18 to 0.08 of the pin; sticker scrub shortened |
| Video | Hilarity (peak) | Hilarity | badge moved off her face; punchline moved clear of the corner bar |
| Suds happen | Belonging | Play | accepted: play is close enough and keeps the curve moving |
| Stores | Resolve | Resolve | none |

Peak check: the bath iris is the largest visual change on the sheet and holds the most
scroll (350% pin, products ~300%, testimonials 200%).

## Spend

kie.ai balance 9,168 before, 8,633 after: **535 credits debited** across 20 stills,
2 clips, 14 background removals and rerolls.

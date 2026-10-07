# Isla Suds stores page: "Postcards from the goat"

**Interviewed 2026-10-07** (three owner decisions, marked OWNER). Everything else is authored from
the request, DESIGN.md and the earlier briefs (marked AUTHORED). Built into the live route
`app/routes/locations.tsx`; the scrollcraft engine is not used (GSAP + Lenis stack).

## The request (OWNER, verbatim)

> give the stores page (`/locations`) the same "sillyness" treatment. separate the 2 odd duck
> locations and make every store it's own individual item. fold the store logos in to each store
> items "card".

## Owner decisions

- **Concept:** "Postcards". Each shop is a vintage postcard, address side up: the shop's logo is
  the postage stamp, a postmark carries the town and hours, the address sits on the address
  lines, the goat scribbles a note. A "Greetings from" picture side peeks out behind; tap to flip.
  A goat pin hops between the shops on the map as you scroll.
- **Tabs:** drop them. Keep a restyled map; replace the product grid with one "shop online" card.
- **Assets:** generate new photos with kie.ai.

## Eight topics

1. Vibe: same family as the site (silly, sticker-loud, sunny, premium photography). References
   (authored): a 1950s large-letter postcard, a gas-station postcard spinner, a Lowcountry road trip.
2. Journey: AUTHORED: wish you were here; here are the three shops; can't make it, we'll mail it.
3. Energy: sunny open, a steady browse with one moving thing (the goat on the map), a warm close.
4. Feeling + moment: authored below; the goat hopping shop to shop on the map is the moment.
5. One thing no other site does: each stockist is a postcard from the mascot, and the mascot
   road-trips the real map to whichever postcard you're reading. AUTHORED from the OWNER concept.
6. Range: playful / maximalist.
7. Distinct scenes: a postcard hero, the postcard rack with the map, a postcard to you.
8. Assets: real store logos and real store data (`app/content/stores.ts`); photos generated.

## Truth rules carried in

- Store names, addresses, phones, hours and websites come only from `app/content/stores.ts`.
- Picture sides are generic sunny Lowcountry scenes (palmettos, azaleas, a marsh boardwalk),
  never presented as the shops themselves. No shop signs, no lettering, no people.
- Town notes stay light and true (Summerville calls itself the birthplace of sweet tea).
- No invented counts: "three shops" is the length of the data.

## Grammar: Stockist atlas (new)

A list of real places paired with a live map that is the page's navigation: the map follows the
reading position (desktop sticky, phone sticky strip), and tapping a pin scrolls to that place.
Each place is one artifact (here a postcard). The close is addressed to the visitor.
**Bans:** pinned scrub scenes, video, horizontal pans, counters/stats, section counters, centred
copy in every act, any decoration hiding an address, a phone number or directions.

Why not the eight: filmic, continuous world and cutlist need a long scroll a store finder must
not have; editorial and poster have nothing to argue; split stage has no two sides; gallery has
no map spine; live surface bans the photographic hero.

## Fingerprint gate (4 of 6 needed against every row)

| Row | Grammar | Nav | Hero | Sequence | Close | Signature | Differs |
|---|---|---|---|---|---|---|---|
| isla-home | ✓ | ✓ (sticky map navigation) | ✓ | ✓ | ✗ (both end near a map/store) | ✓ | 5 |
| isla-partners | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 6 |
| isla-product | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 6 |
| isla-about | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 6 |
| isla-contact | ✓ | ✓ | ✓ (the hero is itself a framed postcard, not a reception scene) | ✓ | ✓ | ✓ | 6 |

Passes.

## Journey and feeling curve (written before the score)

| # | Beat | Feeling | What causes it |
|---|---|---|---|
| 1 | Wish you were here | Sunny grin | The hero is a giant postcard picture side: live oaks and Spanish moss, a goat tourist in sunglasses holding up a postcard, palmettos in front |
| 2 | **The postcard rack (PEAK)** | Delight, then "oh, that one's close to me" | Each shop arrives as a postcard (its logo is the stamp); on the map the goat hops to that shop and the route draws behind him |
| 3 | Can't make it | Looked after | A last postcard addressed to "You", from the goat: we'll mail the soap |

**Peak sentence:** "Every shop is a postcard from the goat with the shop's logo as the stamp, and
the little goat on the map hops to whichever one you're reading."

**Tell-someone:** "It's the store page where a goat sends you postcards from every shop and then
road-trips the map to each one."

**Authored silence:** none.

## Signature move: the goat's road trip

A photographic goat-head pin sits on a real, tinted OpenStreetMap. As each postcard reaches the
middle of the screen, the goat hops along an arc to that shop and a dashed coral route extends
behind him, so after the last postcard the map shows his whole trip. Tapping a shop pin scrolls to
its postcard. Reduced motion: the goat jumps without the arc; the route still draws.

## Score

| # | Act | Device | Span (desktop) |
|---|---|---|---|
| 1 | Postcard hero | framed layered planes (plate / headline / goat / palmettos) + pointer lean + scroll travel | 1vh |
| 2 | Postcard rack + map | flow (postcards deal in) + sticky live map with the bespoke hop + flip-on-tap | ~2.6vh |
| 3 | A postcard to you | flow + chunky CTAs | ~0.8vh |

About 4.4vh plus the footer. The rack is the longest span by a wide margin.

## Style preamble (verbatim, same as every other build)

```
Playful premium commercial photography for a small-batch goat milk soap brand. Bright,
saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp
micro-texture; shallow depth of field; medium-format clarity; joyful and slightly
absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter
yellow. No added text, no watermark.
```

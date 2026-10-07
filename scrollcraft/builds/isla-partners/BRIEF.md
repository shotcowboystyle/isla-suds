# Isla Suds /partners: "Pick your shop"

**Interviewed 2026-10-07** (four decisions from the owner: peak, signature, terms, crate
photo). Remaining topics authored from the request and the homepage brief
(`../isla-home/BRIEF.md`), marked AUTHORED. Built into the live Hydrogen route
`app/routes/partners.tsx`; the scrollcraft engine is not used.

## The request (OWNER, verbatim)

> use the same sillyness style and apply it to the `/partners` page, which is a page
> upselling retailers to by wholesale and stock their shelves. about the only thing worth
> keeping is the copy, the page concept is not done, and doesn't have any "sillyness", you
> can modify they copy, but concept out, and enhance the page inline with the new home page.

## Eight topics
1. Vibe: same as homepage (silly, sticker-loud, sunny, warm). AUTHORED.
2. Journey: AUTHORED, see the curve below.
3. Energy: quick and bright, a dip into a dark shopfront, loudest at the goat, calm close. AUTHORED.
4. Peak: OWNER chose the goat delivery.
5. Signature seed: OWNER chose the pick-your-shop switcher.
6. Range: playful / maximalist, matching home.
7. Distinct scenes.
8. Assets: real crate display photo (OWNER confirmed real), real bar photos, homepage bar
   cutouts; everything else generated.

## Style preamble (verbatim, same as homepage)

```
Playful premium commercial photography for a small-batch goat milk soap brand. Bright,
saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp
micro-texture; shallow depth of field; medium-format clarity; joyful and slightly
absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter
yellow. No added text, no watermark.
```

### Owner decisions (interviewed 2026-10-07)
- Peak: **a goat makes the delivery** (label mascot is a goat).
- Signature: **pick-your-shop switcher** that restyles the whole page around the chosen venue.
- Publish real terms: **20% partner discount ($8/bar vs $10 retail), 6-bar minimum.**
- The crate photo (`wholesale-hero-background.*`) is a **real Isla display**: use it as proof.
- Carried from earlier decisions: say "no added fragrance" (never unscented/fragrance-free),
  no invented reviews or stats, humour warm not snarky, audience skews female.

## Brief, curve, peak (goes into `scrollcraft/builds/isla-partners/BRIEF.md`)

**Tell-someone:** "It's the wholesale page where you pick what kind of shop you run, the
whole page turns into your shop, and then a goat shows up with your delivery."

**Grammar:** *Configurator pitch* (new): one control at the top decides the venue; a sticky
venue chip is the page's nav; acts are short because it is a B2B pitch; the close is a
real input (the application), not a button island. Bans: full-bleed scrub hero, pinned
type acts, more than one long pin (the peak), section counters.

**Fingerprint gate vs `isla-home`:** grammar (configurator vs sticker book), nav (sticky
venue chip vs bar only), hero (venue-switch plates vs burst), sequence, close (inline form
vs map sliver), signature: differs on 6/6.

| # | Act | Feeling | Cause | Device |
|---|---|---|---|---|
| 1 | Hero + switcher | Recognition ("that's my shop") | Tap Gym: plate wipes to a locker-room sink, bars hop onto the counter, the joke changes | layered parallax + bespoke switch |
| 2 | Before/after | Guilty laugh | Your sad generic pump soap under flickery light, then the divider sweeps and it's an Isla display | split stage (scroll-driven divider, draggable) |
| 3 | It sells itself (almost) | Trust | The REAL crate photo, real stockists, real price, real ingredients | flow + price-tag stickers |
| 4 | Suds slinger perks | Appetite | Price tags on strings that swing as you scroll; real terms on them | flow grid + velocity swing |
| 5 | Silence → PEAK | Hilarity | Dark shopfront, sign flips CLOSED→OPEN, doors part, a goat wheels in a hand truck of Isla crates; sticker: "Delivery by goat not guaranteed." | pin + door-split reveal + video |
| 6 | Become a Suds Seller | Resolve | The application itself, prefilled with your shop type; success lands a sticker | live input |

Authored silence: ~0.4vh of dark shopfront with just the CLOSED sign before act 5 opens.
Total ~9-10vh desktop (shorter than home; outside the 13.6-13.8vh band).

## Copy (kept lines marked KEEP)

- Hero: "GET STARTED / SELLING ISLA SUDS" (KEEP). Switcher label "Pick your shop". Venue lines:
  Grocery "Right between the oat milk and the cereal nobody admits buying." ·
  Gym "The only thing in the locker room that's gentle." ·
  Office "Retire the pink pump soap. Nobody will miss it." ·
  Café "Pairs well with a cortado and clean hands." ·
  Hotel "Guests will 'accidentally' pack it." ·
  Spa "Gentle enough for your most sensitive regulars." ·
  Restaurant "A five-star restroom, one tiny bar."
- Act 2: "Your {venue}'s soap situation" → "ADD SOME SUDS TO YOUR SHELVES" (KEEP) + the
  "Searching for a soap that stands out?..." paragraph (KEEP, trimmed; "freshest scents"
  becomes "essential oils, no added fragrance").
- Act 3: "IT SELLS ITSELF (ALMOST)". Goat milk, essential oils with no added fragrance,
  handmade in small batches from a family recipe, $10 on your shelf. "Already on shelves at
  Odd Duck Market (North Charleston, Summerville) and Sewee Outpost (Awendaw)." Crate photo
  caption: "A real Isla Suds display: whole loaves, cut by hand." (No flavour names: the
  photo shows Lavender Mint, which is not a current bar.)
- Act 4: "SUDS SLINGER PERKS" (KEEP). Tags: Join the team (KEEP copy) · Connect with fans
  (KEEP) · Share and shine (KEEP) · Start small: 6 bars minimum · Partner pricing: 20% off,
  you pay $8, they pay $10 · Reorder in one click (partner portal, invoices on request).
- Act 5 punchline: "Delivery by goat not guaranteed."
- Act 6: "BECOME A / SUDS SELLER" (KEEP from register page) + "We'll get back to you within
  1-2 business days." (real, from the success state).
- No em dashes (the old verticals line uses them; it becomes the switcher).


## Build notes

- The goat scene uses a sticky stage inside a 500svh (desktop) / 320svh (phone) section
  instead of a GSAP pin: `<main>` is `overflow-x: clip`, so sticky works and there is no
  pin spacer for other triggers to measure around.
- Bars on the counters are the REAL bar photos (`lavender-bar.webp`, `lemongrass-bar.webp`,
  `rosemary-sea-salt-bar.webp`), not the homepage's tilted floating cutouts: real bars
  standing up read correctly on a counter. Counter height per venue lives in
  `content/partners.ts` (`counter`), measured off each plate; all are on the counter surface.
- The 10s goat clip drifted (goat turned grey, shelves morphed) after ~6s; the extended cut
  is trimmed to the clean first 5.5s. The 5s loop uses tail = head for a seamless loop.

## Feel check (2026-10-07, cold pass on the final sweeps)

| Act | Intended | Felt | Change made |
|---|---|---|---|
| Hero + switcher | Recognition | Delight, then recognition on the switch | bars moved to the counter front on deep counters so phones stay clear of the CTA; cream wash behind copy for busy rooms |
| Before/after | Guilty laugh | Guilty laugh | none |
| Sells itself | Trust | Trust | venue chip moved off the photo caption |
| Perk tags | Appetite | Appetite, playful | none |
| Goat | Hilarity (peak) | Anticipation in the dark, then hilarity | none; peak holds 4 viewports, the longest span by far |
| Apply | Resolve | Resolve | grid fixed so the form sits beside the title |

## Spend

kie.ai balance 8,633 before, 8,272 after: **361 credits debited** (15 stills, 2 clips;
no background removal needed).

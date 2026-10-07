# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| isla-home (enhancement of live Hydrogen homepage) | Distinct-scenes sticker book, playful maximalist (inherited: owner kept section order) | Existing fixed bar: wordmark, menu, Find in stores, account, cart | Layered photographic cutout planes (sky, far bars, copy, mid bars, foam, near bar), burst-from-centre entrance, pointer lean | Hero / word-fill type / pinned horizontal rail / drip reveal + parallax plate / sticker slap / pinned iris peak / pinned card fan / map close; 8 acts, ~19.5vh desktop | Map with the used-up bar landing as a sliver beside the store CTA | A real bar in the corner wears down through photographic stages as you scroll, sheds bubbles when you scroll fast, lands as a sliver at the close | Photographic aqua/cream studio + sunlit bathroom | 3000 |
| isla-partners (live /partners route) | Configurator pitch: one control decides the venue and restyles every act | Sticky venue chip (native select) bottom corner, plus site bar | Venue-switch room plates with real bars standing on the counter, hop-and-wipe on switch, pointer lean | Hero switcher / scroll-driven before-after split / real-proof flow / swinging price tags / dark shopfront then sticky door-split peak / inline application; 6 acts, ~12vh desktop | The real application form inline, prefilled with the venue | Pick-your-shop: the chosen venue changes the room, the joke, the before/after heading, the delivery order label and the form | Photographic venue interiors + real crate photo | 3000 |
| isla-product (live /products/$handle, one template, four scents) | Docked journey: one object visits a dock in every act; acts are the object's story (world, origin, inside, test, family, purchase) | Sticky buy pill (name, price, add to cart) plus site bar | Per-scent layered still life: scent-world plate, bar floating over the ledge, botanicals in front | Hero buy / cut-board dock / ingredient-ring dock / sticky scrubbed lather peak / sibling shelf dock / buy-box dock; 6 acts, ~10.5vh desktop | Buy box with quantity, the bar perched on it, stores line | The traveling bar: one fixed bar flies (arc + flip) dock to dock and hands off to the lather clip's own bar under the tap | Photographic per-scent bathrooms, cutting boards, sink | 3000 |
| isla-about (live /about route) | Family scrapbook: each act is one keepsake in time order (recipe card, polaroids, market snapshots, inspection report, fridge) | Site bar only | Layered kitchen plate: loaf on the counter, a goat that pops up inside the window clip after the headline lands, foam foreground, pointer lean | Hero / sticky recipe-card writing / polaroid flow + count / sticky lateral market track / quiet why, dark silence, then sticky inspection peak with stamp slam / fridge close; 6 acts, ~13vh desktop | Fridge door: the finished recipe card, stamped APPROVED, under a goat magnet, with magnet CTAs | The family recipe card writes itself in three hands: an older cursive, our ballpoint notes, Isla's crayon goat | Photographic home kitchen, farm, market, desk, fridge (no faces) | 3000 |
| isla-contact (live /contact route) | Front desk: the visitor's message is the spine (call comes in, the visitor fills a real form, the outcome is the close) | Site bar only | Layered reception: aqua wall / "Ring ring." type tucked behind the goat's ear / goat with handset / desk + phone; ring entrance rattles the phone and shakes the letters; pointer lean | Hero / desk (pinned notes swing in + the memo slip form) / sent state; 2 acts + an event, ~2.2vh desktop | The taken message: the goat in a photo-booth card holding a slip with the sender's name, plus reply time and "leave another" | The "While You Were Out" slip: typing writes in blue ballpoint, tick boxes draw pen ticks, and on send the slip tears off the pad along its perforation and flies into the goat's hoof | Photographic aqua reception wall, cream desk, coral rotary phone | 3002 |
| isla-stores (live /locations route) | Postcard rack: one postcard per shop, the retailer's logo is the stamp, a live map rides alongside | Site bar only | Framed postcard picture side: live-oak plate / split headline + counted sticker / goat tourist with a written card / blurred palmettos, plus a landing entrance and pointer lean | Hero / postcard rack with sticky map / close; 3 acts, ~4.4vh desktop | A postcard addressed to "You": we'll mail you a bar, with a stockist line | The goat's road trip: a goat-head pin hops along an arc to the shop you're reading and a dashed route trails behind him; postcards flip to "Greetings from" | Aqua rack, cream postcards, tinted OpenStreetMap, butter close | 3002 |

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **isla-about** took: the family-scrapbook grammar (acts as keepsakes in time order), the self-writing recipe card in three hands, the duck-inspection peak (lamp reveal, lens sweep, checklist ticks, stamp slam with a shake), and the fridge-door close.
- **isla-product** took: the docked-journey grammar, the dock-to-dock traveling object with a video hand-off, the head/tail-pinned scrubbed transformation peak (object turns into a mascot), and the sticky buy pill.
- **isla-partners** took: the configurator grammar (one venue control regrades the page), the hop-and-wipe venue hero, the sticky door-split peak with a CLOSED/OPEN sign flip, and the inline-application close.
- **isla-stores** took: the postcard rack (one card per shop with the shop's logo as the stamp, flip to a picture side), and the mascot road-tripping a live map to whichever card is being read.
- **isla-contact** took: the front-desk grammar (short page, the visitor's own input is the spine, the close is that input's outcome), the ringing-phone hero entrance, and the tear-off phone-message slip that lands in the mascot's hoof with the visitor's name on it.
- **isla-footer** (site-wide component, no row) took: the bathtub-bookend close (the preloader's tub slides back up at the bottom of every page with the foamy wordmark rising out of the bath), pop-the-bubbles with a visitor pop counter, and the "See you in the tub." sign-off.
- **isla-home** took: the used-up-object signature (a persistent product that changes state with scroll progress and lands in the close); the burst-from-centre layered hero; the iris-into-peak-video act with a punchline sticker.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.

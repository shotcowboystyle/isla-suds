# Isla Suds about page: "The family scrapbook"

**Interviewed 2026-10-07** (six owner decisions, marked OWNER). Everything else authored from the
request and the home/partners/product briefs (marked AUTHORED). Built into the live route
`app/routes/about.tsx`.

## The request (OWNER, verbatim)

> review the design/scroll of the about page (ie., http://localhost:3000/about). ensure the same
> sillyness style is applied. use /scroll-craft to enhance the page to a premium page that tells
> the story of isla suds with a bit of sillyness.

## Owner decisions
- **True story facts:** "Kitchen-made, 6-week cure" (made by hand in the home kitchen, wire-cut,
  cured six weeks on wooden racks, goat milk from a nearby farm) and "Market booth to shops" (one
  farmers market booth, then two, then wholesale orders from local shops).
- **Not true:** the "Sarah left corporate / maternity leave" story and "Grandma's Depression lard
  recipe". Removed, along with honey, clays and botanicals (not ingredients).
- **Recipe:** "Family recipe, keep vague": passed down in the family, no era, no named relative.
- **Isla's skin:** "True, she's why". Keep "If we wouldn't use it on Isla's skin, we don't sell it."
- **Peak:** "Isla's duck inspects".
- **Signature:** "Recipe card rewrites".
- **People:** "No faces, generated". No AI people posing as the family.

## Review of the old page
Six acts in time order (hero, word-ink inheritance, sideways corporate heading, pinned cure,
pull quote, coral close). Sound structure, but ~10 paragraphs on flat colour with two images, no
jokes, no stickers. The hero splash (`menu-about-us.webp`) holds a red bar that is not an Isla
bar. Copy was mostly untrue, had two em dashes, and the timeline didn't fit a 2.5-year-old Isla.

## Eight topics
1. Vibe: the same family as home/partners/product: silly, sticker-loud, sunny, premium photo. AUTHORED.
2. Journey: AUTHORED from the true facts, in time order (below).
3. Energy: warm open, nostalgic, steady craft, momentum, a beat of dark silence, loud peak, warm close. AUTHORED.
4. Peak: OWNER (duck inspection). 5. Signature: OWNER (recipe card rewrites).
6. Range: playful. 7. Distinct scenes (keepsakes), not one world. AUTHORED.
8. Assets: real bar photos as refs, the real crate display photo, the home foam cutout; everything else generated with no faces. OWNER + AUTHORED.

## Grammar: Family scrapbook (new)
Each chapter is one physical keepsake, in time order: recipe card, polaroids, market snapshots,
inspection report, fridge door. Media is always an artifact with a handwritten or sticker note.
Bans: full-bleed video, pinned type crossfades, section counters, stats, centred copy in every
act. Nav: site bar only. Close: the fridge door.

## Feeling curve

| # | Act | Feeling | Cause | Device |
|---|---|---|---|---|
| 1 | Hero | Warmth + a grin | Sunny home kitchen, loaf on the counter, headline between planes; a goat pops up in the window | layered parallax + pointer lean |
| 2 | The recipe | Nostalgia, then delight | The old card writes itself in an older cursive; our ballpoint adds notes; Isla's crayon goat lands last | sticky stage + stroke draw |
| 3 | Made by hand | Trust | Taped polaroids settle in (farm goat, pour, wire-cut, racks); a big 6 weeks counts up | flow + in + count |
| 4 | Market to shops | Pride, momentum | Lateral trip: one booth (goat staffing it), two booths, the real shop display + stockist logos | pan |
| 5 | Silence, then PEAK | Anticipation, then hilarity + tenderness | Why-Isla copy; dark screen, one line; lamp on; duck in tiny glasses; lens sweeps the bar; checklist ticks; stamp slams APPROVED; the promise rises | sticky stage + reveal + stamp slam |
| 6 | Close | Belonging | Fridge door: the finished card, stamped, under a goat magnet; magnet CTAs | flow + hover |

**Peak sentence:** "A rubber duck in tiny glasses inspects the soap and stamps it APPROVED, and
then it says if they wouldn't use it on their daughter they don't sell it."

**Tell-someone:** "It's the about page where a rubber duck inspects the soap and stamps it
approved for their toddler, and the family recipe card gets scribbled on by three generations."

**Authored silence:** the first beat of act 5: near-black, one line, "Every batch still has to
pass one inspection."

## Style preamble (verbatim, same as home, partners and product)

```
Playful premium commercial photography for a small-batch goat milk soap brand. Bright,
saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp
micro-texture; shallow depth of field; medium-format clarity; joyful and slightly
absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter
yellow. No added text, no watermark.
```

## Owner to review
The recipe card's older lines ("lye + water (go slow!)", "warm the oils", "stir till it traces",
"pour, cover, wait") are generic cold-process steps written to look like the family card, not a
transcription. Swap in the real wording any time in `app/content/about.ts`.

## Score

| # | Act | Device | Span (desktop) |
|---|---|---|---|
| 1 | Kitchen hero | layered parallax (plate + loaf + window-clipped goat / headline / foam) + pointer lean | 1vh |
| 2 | Recipe card | sticky stage, scrubbed clip-path handwriting + SVG stroke draw | 2.6vh |
| 3 | Made by hand | flow: polaroids dealt in, one-shot count to 6 | ~1.6vh |
| 4 | Market | pan: sticky track (desktop), native swipe strip (phone, reduced motion) | ~2vh |
| 5 | Why + inspection (peak) | quiet intro, then sticky stage: silence, lamp reveal, lens sweep, ticks, stamp slam + shake, promise | ~0.9vh + 4vh |
| 6 | Fridge close | flow + magnet CTAs | 1vh |

About 13vh desktop with the peak's 4vh the longest span; 6 acts. Reduced motion lands every act on
its final frame (about 6.6vh).

## Feel check (2026-10-07, cold pass on desktop, phone and tablet sweeps)

| Act | Intended | Felt | Change made |
|---|---|---|---|
| Hero | Warmth + a grin | Charmed (the goat's grin lands a beat after the headline) | loaf scaled down so it sits on the counter instead of in the window |
| Recipe | Nostalgia, then delight | Delight | staggered lines showed early (GSAP renders only the first staggered start state); set start states explicitly; "Isla's edit" moved off the last note |
| Made by hand | Trust | Trust | none |
| Market | Pride, momentum | Momentum | reduced motion on desktop wraps the frames instead of a sideways strip |
| Peak | Anticipation, then hilarity + tenderness | Anticipation in the dark, laugh at the stamp, then the promise | bar and duck now dim with the room; quote box hidden until it rises and enlarged |
| Close | Belonging | Resolved | none |

## Spend
kie.ai balance 7,606 before, 7,331.5 after: **274.5 credits** (16 stills including 3 rerolls, 6 cutouts; no video).

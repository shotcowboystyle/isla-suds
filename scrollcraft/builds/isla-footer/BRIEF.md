# Isla Suds site footer: the bath-time close

**Self-authored under explicit creative delegation, 2026-10-07.** The owner set the goal
and floated an idea, then deferred: *"merely a suggestion and defer to your creative
insights."* One decision came from the owner directly (marked OWNER); the rest are
AUTHORED from the request, DESIGN.md and the four earlier briefs. This is a site-wide
component (`app/components/Footer.tsx`, rendered by `PageLayout` after every route),
not a page build, so the scrollcraft engine is not used and no registry row is added.

## The request (OWNER, verbatim)

> The footer section needs some love and some refinement to be inline with our newest
> "sillyness" style. The content feels uneven and the `#SOAP_IS_DOPE` hashtag reads weird
> due to the underscores (its nothing married to any brand or anything, added because it
> sounded cool). Also it lacks any character or feeling where as it should, it's the end
> of the scroll experience and should end on a high, firmly re-inforcing everything that
> came before it, and ending the certainly leaves a smile on the visitor's face [...]
> A thought I had as a possible addition, is including the bathtub and logo from the
> preloader, just the top part of the bathtoom rim and soap bubbles, slides up from the
> bottom and attached to the bottom, with the logo, and a few animated bubbles floating
> up through the footer.

## Decisions

- **Sign-off (OWNER chose):** "See you / [in the tub.]", with `#SoapIsDope` kept,
  re-cased so it reads as words, as a small butter pill sticker.
- **Bookend (AUTHORED, from the owner's idea):** the visit opens with the preloader tub
  launching the foamy wordmark on `#292934`; it closes with the same tub sliding back up
  on the same ground, the wordmark rising out of the foam.
- **Signature move (AUTHORED):** pop the bubbles. Hover (mouse) or tap; a pill counts the
  visitor's own pops ("3 popped. So relaxing.", then "Okay. Back to the bath.").
- **Even content (AUTHORED):** two balanced rows (sign-off with newsletter card; nav with
  socials), then the tub. Legal line printed on the tub's front panel.
- **Copy rules:** DESIGN.md truth and voice rules; newsletter filler replaced; copy lives
  in `app/content/footer.ts` with a test.

## Feeling curve (the footer's two beats)

| # | Beat | Feeling | What causes it |
|---|---|---|---|
| 1 | Sign-off | Warm goodbye | "SEE YOU" then the coral "IN THE TUB." sticker and the hashtag slap on |
| 2 | Finale (one viewport) | Delight, then resolve | The promised tub slides up, the foamy wordmark bobs out of the bath, bubbles drift up and pop under your cursor |

## The peak (of the footer)

> "At the very bottom the bathtub from the loading screen comes back up with the logo in
> it, and you can pop the bubbles. I popped like twenty."

## Tell-someone sentence

> It's the site that starts with a bathtub and ends with one, and you can pop the bubbles.

## Authored silence

None. The dark gap between the links row and the wordmark on desktop is not dead: the
bubbles travel through it.

## Feel check (2026-10-07, cold pass on the final sweeps)

| Beat | Intended | Felt | Change made |
|---|---|---|---|
| Sign-off | Warm goodbye | Warm goodbye | "SEE YOU" was centred by the global h2; left-aligned it |
| Finale | Delight, then resolve | First pass: the end frame cropped half the headline under the header, which read as a page that stopped, not one that finished | Links + tub became a `100svh` finale, so the last frame is whole: links, bubbles, wordmark in the tub, legal |
| Finale | Delight | First pass: bubbles read as grey ball bearings on the dark ground | Clear centre, bright rim, glints and a faint butter sheen |

## Performance notes (found during verification)

- `feDropShadow` on 28 SVG shapes made every frame of the foam slosh and wordmark rise a
  full filtered repaint. Shadows are now offset copies.
- `var()` inside `@keyframes` kept the bubble rise on the main thread and re-rasterised the
  bubbles every frame (steady state 33 fps vs 60 without them, headless). Keyframes now hold
  literal values (two sway sets, one per breakpoint), no scale.
- The wordmark is its own SVG layer with `will-change: transform`, so rising is composited.
- Headless (software raster) after the fixes: steady 60 fps; entrance ~1.85 s desktop,
  ~2.6 s mobile against a nominal 1.7 s. **Not verified on a real phone.**

## Spend

None. No generated assets: the tub, foam and wordmark are the preloader's own vectors
(`app/components/bathtub-shapes.ts`).

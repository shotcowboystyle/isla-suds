# Isla Suds contact page: "The goat takes a message"

**Interviewed 2026-10-07** (three owner decisions, marked OWNER). Everything else is authored from
the request, DESIGN.md, the nav menu art and the earlier briefs (marked AUTHORED). Built into the
live route `app/routes/contact.tsx`; the scrollcraft engine is not used (GSAP + Lenis stack).

## The request (OWNER, verbatim)

> apply the same "sillyness" to the contact page. currently it's just a simple contact form and
> does not add any character or emotional joy to the page, nothing that would encourage the user
> to want to fill out the form. Add premium, fun elements to the page so that it matches the
> feeling of the other pages as a premium awwwards contact page.

## Owner decisions

- **Concept:** "Goat takes a message". The goat on the coral rotary phone (already the nav menu's
  contact image, `menu-contact.webp`) is the receptionist. The form is a retro "While You Were
  Out" phone memo; subjects are its tick boxes; on send the slip tears off and the goat holds it up.
- **Assets:** generate new photos with kie.ai.
- **Reply time:** "within 24-48 hours" is true. Keep it.

## Eight topics

1. Vibe: same family as the rest of the site: silly, sticker-loud, sunny, premium photography.
   References (authored): a 70s office reception desk, a pink phone-message pad, a Wes Anderson
   front desk. AUTHORED.
2. Journey: the phone rings, the goat answers; you see what to expect; you fill in the slip;
   the goat takes it. AUTHORED from the concept.
3. Energy: loud open (ringing), calm middle (reassurance, then writing), one pop at the send.
4. Feeling + the one moment: OWNER chose the moment (the slip tears off and the goat holds it).
   Stage feelings authored below.
5. One thing no other site does: you fill in a real phone-message slip by hand, and the goat
   ends up holding it with your name on it. AUTHORED from the OWNER concept.
6. Range: playful / maximalist, like the rest of the site.
7. Distinct scenes: a reception scene, then the desk. Not one world.
8. Assets: the nav menu photo is the look reference; everything new is generated (OWNER).

## Truth rules carried in

- Reply within 24-48 hours: true (OWNER). Email fallback `contact@islasuds.com` (existing copy).
- No invented reviews, numbers or people. The goat is the only character.
- "We" voice, no founder name. No em dashes. One joke per moment, about soap, goats or bath time.

## Grammar: Front desk (new)

The page is a reception desk and the visitor's message is the spine. The hero is the call coming
in, the middle is the visitor's own input on a real working form, and the ending is the outcome
of that input (the message handed over), not a CTA. Nav: site bar only. Close: the taken message.
**Bans:** pinned scrub scenes, video, horizontal pans, counters/stats, section counters, centred
copy in every act, any decoration that hides or delays a form control.

Why not the eight defined grammars: filmic one-shot, continuous world and rhythmic cutlist need
a long scroll a contact page shouldn't have; chaptered editorial and typographic poster have
nothing to argue; gallery has nothing to browse; split stage has no two sides; live surface bans
the photographic hero and display type the brand runs on.

## Fingerprint gate (4 of 6 needed against every row)

| Row | Grammar | Nav | Hero device | Sequence | Close | Signature | Differs |
|---|---|---|---|---|---|---|---|
| isla-home | ✓ | ✓ (no store CTA bar treatment beyond site bar) | ✓ | ✓ | ✓ | ✓ | 6 |
| isla-partners | ✓ | ✓ | ✓ | ✓ | ✗ (both end on a real form) | ✓ | 5 |
| isla-product | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 6 |
| isla-about | ✓ | ✗ (site bar only) | ✓ (ringing phone + type behind the goat, not a window pop) | ✓ | ✓ | ✓ | 5 |

Passes.

## Journey and feeling curve (written before the score)

| # | Beat | Feeling | What causes it |
|---|---|---|---|
| 1 | The call | Amused curiosity | The coral phone rattles, "RING RING." shakes in, and the goat's already got the handset to its ear, grinning |
| 2 | What to expect | At ease | Notes pinned up beside the pad swing in: reply in 24-48 hours, order help, shops, email |
| 3 | The slip | Playful focus | A pink "While You Were Out" slip: what you type comes out in blue ballpoint, ticking a box draws a pen tick |
| 4 | **PEAK** (on send) | Delight | The slip tears off the pad along its perforation, flies up, and the goat pops up holding it, your name on it |
| 5 | Resolve | Looked after | "Message taken." stays: who'll write back, and when |

**Peak sentence:** "You fill out this little pink phone-message slip, hit send, it rips off the pad
and a goat pops up holding it with your name on it."

**Tell-someone:** "It's the contact page where a goat on a rotary phone takes your message, and
you get to watch him take it."

**Authored silence:** none. The page is short on purpose.

## Signature move: the message slip

A real form dressed as a phone-message slip. Typing writes in blue ballpoint (Caveat, the
site's in-world hand), tick boxes draw a pen tick, the order-number line only appears for order
help. On a successful send the slip tears off along its perforation and flies to the goat, who
holds up a slip with the visitor's own name on it (HTML over the photo, never baked in).

## Score

| # | Act | Device | Span (desktop) |
|---|---|---|---|
| 1 | Reception hero | layered planes (wall / headline / goat / desk + phone) + pointer lean + ring entrance + scroll travel | 1vh |
| 2-3 | The desk | flow: pinned notes swing in on scroll; input-driven slip (bespoke) | ~1.2vh |
| 4-5 | Message taken | event, not scroll: tear + flight + goat reveal (bespoke) | in place |

About 2.2vh plus the footer. Three device families plus two bespoke moves.

## Style preamble (verbatim, same as every other build)

```
Playful premium commercial photography for a small-batch goat milk soap brand. Bright,
saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp
micro-texture; shallow depth of field; medium-format clarity; joyful and slightly
absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter
yellow. No added text, no watermark.
```

## Generated assets (`app/assets/images/contact/`)

| File | What | Source |
|---|---|---|
| `wall.webp`, `wall-m.webp` | Aqua plaster wall, window-light shadows (clean plate, 16:9 and 9:16) | kie still, ref: nav `menu-contact.webp` |
| `goat-phone.webp` | The goat, coral handset to its ear, cord hanging down | kie still (same ref) + recraft cutout |
| `desk.webp` | Cream desk, coral rotary phone base, succulent; base cord erased above the cradle so it never meets the goat's | kie still + cutout + alpha mask |
| `goat-slip.webp` | Same goat, holding a blank pink slip square to camera; the visitor's name is HTML on top (slip at 58.3% / 48.2%, 24.1% wide, -0.7deg) | kie still, ref: the goat + cutout |

No rerolls needed. Generation scripts: `tools/waveA.sh`, `tools/waveB.sh`.

## Feel check (2026-10-07, cold pass on the final desktop and phone sweeps)

| Beat | Intended | Felt | Change made |
|---|---|---|---|
| The call | Amused curiosity | "Ha." The goat with the handset lands it | none |
| What to expect | At ease | Reassured | coral note deepened to #b8383a so its small cream text clears 4.5:1 |
| The slip | Playful focus | Inviting: typing in blue ballpoint is the hook | memo labels moved to a deeper printed red (5:1 on the pink) |
| Peak | Delight | Delight: the goat holding a slip that says "From: Sam" | first pass showed the goat's card before he arrived, and on phones the result sat above the viewport: card now pops in during the tear and the result sits at the bottom of the cell, where Send was |
| Resolve | Looked after | Done, then the site footer's tub | none |

## Verification notes

- Desktop 1440x900, phone 390x844 and reduced-motion sweeps: `scripts/shoot-contact.mjs` (sends are intercepted with an encoded single-fetch success, so no email leaves).
- axe on the live page: clean apart from the shared header's logo alt (not this page).
- Flows checked in Chrome: tab order, send, focus to "Message taken.", slip inert while taken, "Leave another message" restores a blank slip and the aside, inline email error with `aria-invalid`, required-fields alert with the email fallback (real server, 400s only).
- Found and fixed on the way: Resend reports failures in `error` instead of throwing, so the old and new page both showed success for an email that never sent (`app/lib/email.server.ts`, regression test added).
- **One real test email may have gone out** during the first sweep (before the intercept matched single fetch): name "Sam", sam@example.com, subject Order Support, order #1042, about a lavender bar.
- Not verified: a real phone (touch, iOS rendering), a live Resend failure end to end.

## Spend

kie.ai balance 6,962 before, 6,833 after: **129 credits** (5 stills, 3 cutouts, no rerolls, no video).

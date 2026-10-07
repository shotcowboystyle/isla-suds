#!/usr/bin/env bash
# Wave 1: per-scent hero plates, cut plates, tap-start stills, plus one shelf plate.
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
R=../isla-home/refs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."
LEDGE="A smooth stone ledge runs across the lower third of the frame; the right half of the ledge is completely empty and in focus. The left half of the frame is calm and softly blurred for a headline. No soap, no bottles, no text, no logos, no people."

hero() { node $K still "$P

$2 $LEDGE" out/hero-$1.png --ar 16:9 > out/hero-$1.log 2>&1 & }
hero eucalyptus "A steamy spa shower nook: pale sage green tiles, a fat bundle of fresh eucalyptus hanging from the shower head, soft drifting steam and morning light."
hero lavender "A sunny bathroom windowsill: lilac tiles, a tall window open onto rows of blooming purple lavender fields, a little vase of lavender at the far left edge."
hero lemongrass "A bright cheerful kitchen-garden sink corner: butter yellow tiles, a bowl of lemons and a pot of fresh lemongrass at the far left edge, sunshine."
hero rosemary "A breezy seaside cottage bathroom: white wood panelling, a round window showing a blue sea, a terracotta pot of rosemary and a jar of coarse sea salt at the far left edge."

cut() { node $K still "$P

A warm wooden cutting board on a kitchen counter, seen at a three-quarter angle from slightly above. On it lies a whole long handmade soap loaf made of exactly the same soap as the reference bar: $2. The loaf has been sliced into a few thick bars at one end with a soap cutter lying beside it. To the right of the cut bars there is a clear empty gap on the board where one more freshly cut bar would sit. No labels, no paper bands, no text, no people. Soft aqua wall behind, out of focus." out/cut-$1.png --ar 16:9 --ref $R/$3.jpg > out/cut-$1.log 2>&1 & }
cut eucalyptus "pale creamy beige with soft swirls" eucalyptus
cut lavender "soft lavender purple flecked with dried lavender buds and a dark speckled edge" lavender
cut lemongrass "warm caramel tan with a slightly rustic surface" lemongrass
cut rosemary "warm sandy tan with a crust of coarse sea salt along the top edge" rosemary

tap() { node $K still "$P

Close-up of a white porcelain sink basin with a polished brass tap at the top centre of the frame, a thin steady stream of water falling from it. Directly under the stream, resting on the flat edge of the basin in the centre of the frame, sits exactly the soap bar from the reference, unwrapped with no paper band and no label, its colour and texture unchanged, just getting wet. Soft aqua tiles behind, out of focus. Centred composition with space above and around the bar." out/tap-$1.png --ar 16:9 --ref $R/$2.jpg > out/tap-$1.log 2>&1 & }
tap eucalyptus eucalyptus
tap lavender lavender
tap lemongrass lemongrass
tap rosemary rosemary

node $K still "$P

A long, warm wooden wall shelf seen straight-on against a soft aqua painted wall, morning light from the left. The shelf is completely empty along its whole length. A small trailing plant at the far left end and a folded cream towel at the far right end. No soap, no bottles, no text, no logos." out/shelf.png --ar 16:9 > out/shelf.log 2>&1 &

wait; echo done

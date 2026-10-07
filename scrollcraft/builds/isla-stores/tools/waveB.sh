#!/usr/bin/env bash
# Wave B: rerolls (plate-m and Summerville added soap and gift boxes that aren't Isla's), cutouts.
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."
NOSIGNS="No people, no animals, no cars, no shop signs, no lettering, no logos, no writing anywhere. No soap, no boxes, no packages, no products of any kind."

node $K still "$P

A sunny South Carolina Lowcountry road trip view: a quiet sandy country lane running away under an avenue of huge old live oak trees draped in soft grey Spanish moss, bright warm morning sun breaking through the leaves, a clear aqua-blue sky. The top third of the frame is open soft sky and gently blurred moss, calm and even. The lane and its grassy verges are completely empty all the way to the bottom edge. $NOSIGNS" out/plate-m2.png --ar 9:16 > out/plate-m2.log 2>&1 &

node $K still "$P

A sunny Southern porch in spring: a white wooden porch rail in the foreground holding one single tall glass of iced sweet tea with a lemon wedge and nothing else on the rail, behind it a garden bursting with bright pink azaleas under tall pine trees, dappled morning sunlight. $NOSIGNS" out/pc-summerville2.png --ar 3:2 > out/pc-summerville2.log 2>&1 &

for n in goat palmetto; do
  node tools/kiejob.mjs recraft/remove-background out/$n-cut.png "{\"image\":\"@out/$n.png\"}" > out/$n-cut.log 2>&1 &
done
wait; echo done

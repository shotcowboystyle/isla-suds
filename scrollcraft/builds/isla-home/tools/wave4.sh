#!/usr/bin/env bash
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."
LAYOUT="The pieces float in mid-air, scattered only around the four corners and edges of the frame, sharp and fully in frame, with the whole centre of the frame completely empty. Only the named botanicals in their natural colours: no soap, no confetti, no flakes, no petals, no coloured specks, nothing else. Plain seamless pure white studio backdrop, no shadows."
node $K still "$P

Fresh botanicals: several sprigs of purple lavender in bloom and a few loose dried lavender buds. $LAYOUT" out/el-lavender.png --ar 16:9 > out/el-lavender.log 2>&1 &
node $K still "$P

Fresh botanicals: a few stalks of fresh green lemongrass, two lemon halves and a couple of thin lemon slices. $LAYOUT" out/el-lemongrass.png --ar 16:9 > out/el-lemongrass.log 2>&1 &
node $K still "$P

Fresh botanicals: several sprigs of green rosemary and a few chunky crystals of coarse white sea salt. $LAYOUT" out/el-rosemary.png --ar 16:9 > out/el-rosemary.log 2>&1 &
node $K still "$P

Fresh botanicals: several sprigs of silvery green round eucalyptus leaves and a few single loose leaves. $LAYOUT" out/el-eucalyptus.png --ar 16:9 > out/el-eucalyptus.log 2>&1 &
wait
for n in lavender lemongrass rosemary eucalyptus; do
  node tools/kiejob.mjs recraft/remove-background out/elcut-$n.png "{\"image\":\"@out/el-$n.png\"}" > out/elcut-$n.log 2>&1 &
done
wait; echo done

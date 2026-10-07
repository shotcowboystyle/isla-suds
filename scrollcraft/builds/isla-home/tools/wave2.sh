#!/usr/bin/env bash
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."

for n in lavender lemongrass rosemary eucalyptus; do
  node tools/kiejob.mjs recraft/remove-background out/cut-$n.png "{\"image\":\"@out/bar-$n.png\"}" > out/cut-$n.log 2>&1 &
done

node $K still "$P

The same handmade lavender soap bar as the reference, same purple colour, same speckled texture, same three-quarter angle and tilt, but brand new and unwrapped: the kraft paper band and the label have been removed, so the bare soap is visible on every side. Crisp sharp corners. Whole bar centred with generous empty margin. Plain seamless light grey studio backdrop, no props." out/wear-1.png --ar 3:4 --ref out/bar-lavender.png > out/wear-1.log 2>&1 &

node $K still "$P

A wide clump of thick, glossy, pure white soap foam and lather piled in soft billows along the bottom of the frame, with a few loose clear bubbles above it, photographed against a pure black background with nothing else in frame. The foam is pure white with no colour flecks, brightly lit and sharply detailed; the black is completely clean." out/foam2.png --ar 16:9 > out/foam2.log 2>&1 &

node $K still "$P

A sunlit white marble bath ledge seen at eye level. On it sit two bare, unwrapped handmade goat milk soap bars with no packaging and no labels, one lavender purple flecked with dried buds and one pale cream, resting on a little cloud of fresh white lather, beside a small corked glass bottle of goat milk, a sprig of lavender, a few green eucalyptus leaves and a natural sea sponge. Soft bubbles float in the air. Background is a soft aqua tiled wall, out of focus. The left third of the frame is calm and uncluttered; the objects cluster in the centre and right." out/ingredients2.png --ar 16:9 > out/ingredients2.log 2>&1 &

node $K shot "The woman laughs and gently wiggles her head so the tall suds wig wobbles and sways like jelly, a couple of small bubbles float up out of the foam, she keeps holding the soap bar beside her cheek and keeps grinning into the camera. Very slow, subtle camera push-in. One single continuous take, no cuts, no camera shake." out/bath.png out/bath.mp4 --dur 10 > out/bath-clip.log 2>&1 &

wait
echo done

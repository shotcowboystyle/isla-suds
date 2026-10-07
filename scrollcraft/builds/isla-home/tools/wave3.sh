#!/usr/bin/env bash
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."
BASE="The same lavender soap bar as the reference, same purple colour and speckled texture, same three-quarter angle and tilt, centred with generous empty margin, plain seamless light grey studio backdrop, no props."

node $K still "$P

$BASE It has been used for a couple of weeks: about two thirds of its original size, every corner and edge worn smooth and rounded, the surface glossy and slightly wet with a few tiny bubbles clinging to it." out/wear-2.png --ar 3:4 --ref out/wear-1.png > out/wear-2.log 2>&1 &

node $K still "$P

$BASE It is nearly used up: a small rounded pebble of soap about one third of its original size, soft oval shape with no corners left, glossy wet surface with a few tiny bubbles clinging to it." out/wear-3.png --ar 3:4 --ref out/wear-1.png > out/wear-3.log 2>&1 &

node $K still "$P

$BASE It is completely used up: only a thin, flat, translucent sliver of soap remains, a small curved oval wafer, glossy and wet, a couple of tiny bubbles on it." out/wear-4.png --ar 3:4 --ref out/wear-1.png > out/wear-4.log 2>&1 &

node $K shot "The woman laughs and gently wiggles her head so the tall suds wig wobbles and sways like jelly, a few small bubbles float up out of the foam, then she settles back into exactly the same pose, still holding the soap bar beside her cheek and grinning into the camera. Very slow, subtle motion. One single continuous take, no cuts, no camera shake." out/bath.png out/bath-loop.mp4 --tail out/bath.png --dur 5 > out/bath-loop.log 2>&1 &

wait; echo done

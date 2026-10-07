#!/usr/bin/env bash
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
R=../isla-home/refs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."
COUNTER="The camera looks slightly down at a clean empty counter. The counter top fills only the bottom third of the frame, its front edge close to the bottom of the frame; the top two thirds of the frame show the room behind, softly out of focus. The centre of the counter top is completely empty. No soap, no bottles, no dispensers, no text, no signs, no logos, no people."
gen() { node $K still "$P

$2 $COUNTER" out/plate-$1.png --ar 16:9 > out/plate-$1.log 2>&1 & }
gen grocery "Inside a bright, friendly neighbourhood grocery store: a warm wooden checkout counter, colourful produce stands and shelves of jars behind."
gen gym "Inside a sunny boutique gym locker room: a white quartz vanity counter, mint-green lockers and a rolled towel behind."
gen office "Inside a cheerful modern office break room: a light wood kitchen counter, big windows, plants and a coffee machine behind."
gen cafe "Inside a cosy café restroom: a butcher-block vanity counter, terracotta and cream patterned tiles and a round mirror behind."

node $K still "$P

Exactly the same photo as the first reference image: same camera angle, same counter, same mirror edge, same framing. Only two things change: the light is now warm golden sunshine instead of fluorescent, and the lonely pink pump bottle is gone. In its place, in the centre of the counter, sits a small neat display of three handmade goat milk soap bars exactly like the other reference images, kraft paper bands and white goat labels, one lavender purple and two cream, stacked on a little wooden tray." out/after.png --ar 16:9 --ref out/before.png --ref $R/lavender.jpg --ref $R/rosemary.jpg > out/after.log 2>&1 &

node $K shot "The little goat trots happily forward toward the camera pulling the wooden wagon, the soap boxes wobble, the shopkeeper behind the counter laughs and claps. Gentle, slow camera pull-back. One single continuous take, no cuts." out/goat.png out/goat-full.mp4 --dur 10 > out/goat-full.log 2>&1 &

node $K shot "The little goat proudly wiggles its ears and nods its head, its tail wags, the shopkeeper laughs and bounces with her hands up, then everyone settles back into exactly the same pose. Subtle, gentle motion, the camera stays still. One single continuous take, no cuts." out/goat.png out/goat-loop.mp4 --tail out/goat.png --dur 5 > out/goat-loop.log 2>&1 &

wait; echo done

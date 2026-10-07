#!/usr/bin/env bash
# Wave 2: foam-goat end frames (image-to-image from each tap still), then the
# lather clips pinned head = tap, tail = goat, so the goat is guaranteed.
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."
for s in eucalyptus lavender lemongrass rosemary; do
  node $K still "$P

Exactly the same photo as the reference: same white sink, same brass tap, same aqua tiles, same framing and light, the tap still running. Now a big, fluffy, glossy white soap-lather sculpture shaped like a cute little goat stands on the sink edge where the soap bar was, made entirely of creamy foam and bubbles, with two small foam horns, floppy foam ears and big friendly dark eyes. The same soap bar peeks out from the foam at its front hooves. A few bubbles drift in the air." out/goat-$s.png --ar 16:9 --ref out/tap-$s.png > out/goat-$s.log 2>&1 &
done
wait
for s in eucalyptus lavender lemongrass rosemary; do
  node $K shot "Water keeps running onto the soap bar and a creamy white lather starts to foam up around it, growing bigger and bigger, bubbling and rising, until the foam shapes itself into a fluffy goat sculpture that blinks. The camera stays perfectly still. One single continuous take, no cuts." out/tap-$s.png out/lather-$s.mp4 --tail out/goat-$s.png --dur 10 > out/lather-$s.log 2>&1 &
done
wait; echo done

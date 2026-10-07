#!/usr/bin/env bash
# Wave B: cutouts for the hero, and the peak goat holding a blank slip (ref: the hero goat).
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."
GREY="Isolated on a plain seamless light grey studio backdrop with generous empty margin on every side. No text."

for n in goat desk; do
  node tools/kiejob.mjs recraft/remove-background out/$n-cut.png "{\"image\":\"@out/$n.png\"}" > out/$n-cut.log 2>&1 &
done

node $K still "$P

Exactly the same cheerful white goat with grey cheek markings, amber eyes and long curved horns as in the reference photo, no telephone now. It proudly holds up one small blank pale pink paper note slip in its front hoof, at chin height to the right of its face, the note held flat and square-on to the camera like showing it off, the paper completely blank with nothing written on it. Big delighted grin straight at the camera. Cropped flat across the chest by the bottom edge of the frame, head, horns, both ears and the whole note fully inside the frame. $GREY" out/goat-slip.png --ar 1:1 --ref out/goat.png > out/goat-slip.log 2>&1 &
wait; echo done

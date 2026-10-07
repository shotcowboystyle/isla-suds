#!/usr/bin/env bash
# Wave A: wall plates, the goat on the phone, the desk with the phone base. Cutout subjects on grey.
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."
GREY="Isolated on a plain seamless light grey studio backdrop with generous empty margin on every side. No text."
EMPTY="No people, no animals, no furniture, no objects, no text, no frames, no posters, no writing anywhere."

still() { # name ar prompt [refs...]
  local name=$1 ar=$2 prompt=$3; shift 3
  local refs=(); for r in "$@"; do refs+=(--ref "$r"); done
  node $K still "$P

$prompt" out/$name.png --ar $ar "${refs[@]}" > out/$name.log 2>&1 &
}

still wall 16:9 "A plain, smooth soft aqua teal plaster wall filling the whole frame, seen straight-on, exactly the colour and texture of the wall in the reference photo. Bright late-morning sunlight comes through an unseen window at the upper right and casts soft diagonal shadows of the window frame across the right half of the wall. The left half of the wall is evenly lit and calm. $EMPTY" refs/goat-phone.jpg
still wall-m 9:16 "A plain, smooth soft aqua teal plaster wall filling the whole frame, seen straight-on, exactly the colour and texture of the wall in the reference photo. Bright late-morning sunlight comes through an unseen window at the upper right and casts soft diagonal shadows of the window frame across the upper part of the wall. The lower half of the wall is evenly lit and calm. $EMPTY" refs/goat-phone.jpg
still goat 1:1 "The same cheerful white goat with grey cheek markings, amber eyes and long curved horns as in the reference photo, holding the same coral red rotary telephone handset to its ear with one front hoof, grinning straight at the camera with its tongue slightly out, as if it has just answered the phone and is delighted to hear from you. The coiled coral handset cord hangs straight down out of the bottom of the frame. Cropped flat across the chest by the bottom edge of the frame, head, horns and both ears fully inside the frame. $GREY" refs/goat-phone.jpg
still desk 16:9 "A cream painted wooden writing desk seen straight-on at eye level, cropped so only the desk top surface and the top drawer front are visible, running the full width of the frame. On the right side of the desk top sits the same coral red rotary telephone base as in the reference photo, its handset missing from the cradle, the coiled coral cord rising up out of the top of the frame. On the far left of the desk top, a tiny potted succulent in a white pot. The rest of the desk top is empty. $GREY" refs/goat-phone.jpg
wait; echo done

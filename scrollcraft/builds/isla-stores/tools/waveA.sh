#!/usr/bin/env bash
# Wave A: hero plates, the goat tourist, palmetto foreground, three postcard picture sides.
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."
GREY="Isolated on a plain seamless light grey studio backdrop with generous empty margin on every side. No text."
NOSIGNS="No people, no animals, no cars, no shop signs, no lettering, no logos, no writing anywhere."

still() { # name ar prompt [refs...]
  local name=$1 ar=$2 prompt=$3; shift 3
  local refs=(); for r in "$@"; do refs+=(--ref "$r"); done
  node $K still "$P

$prompt" out/$name.png --ar $ar "${refs[@]}" > out/$name.log 2>&1 &
}

still plate 16:9 "A sunny South Carolina Lowcountry road trip view: a quiet sandy country lane running away under an avenue of huge old live oak trees draped in soft grey Spanish moss, bright warm morning sun breaking through the leaves, a clear aqua-blue sky. The left third of the frame is open soft sky and gently blurred leaves, calm and even. The lane in the lower middle is empty. $NOSIGNS"
still plate-m 9:16 "A sunny South Carolina Lowcountry road trip view: a quiet sandy country lane running away under an avenue of huge old live oak trees draped in soft grey Spanish moss, bright warm morning sun breaking through the leaves, a clear aqua-blue sky. The top third of the frame is open soft sky and gently blurred moss, calm and even. The lane in the lower middle is empty. $NOSIGNS"
still goat 1:1 "Exactly the same cheerful white goat with grey cheek markings, amber eyes and long curved horns as in the reference photo, now a delighted tourist on vacation: round retro coral sunglasses on its nose and a little woven straw sun hat perched between its horns. It holds up one blank cream postcard in its front hoof beside its face, the card square-on to the camera and completely blank. Big grin. Cropped flat across the chest by the bottom edge of the frame, head, horns, hat, both ears and the whole postcard fully inside the frame. $GREY" out/ref-goat.png
still palmetto 3:2 "Two glossy green sabal palmetto fronds fanning out from the lower left, crisp and sunlit, seen from the front. $GREY No trunk, no other plants."
still pc-ncharleston 3:2 "A cheerful sunny Southern street scene in the Charleston area: a row of pastel painted low brick shopfronts in soft aqua, butter yellow and coral with white trim and striped awnings, tall palmetto trees along the sidewalk, bright blue sky. Seen from across the street, straight-on. All windows and awnings plain. $NOSIGNS"
still pc-summerville 3:2 "A sunny Southern porch in spring: a white wooden porch rail in the foreground holding one tall glass of iced sweet tea with a lemon wedge, behind it a garden bursting with bright pink azaleas under tall pine trees, dappled morning sunlight. $NOSIGNS"
still pc-awendaw 3:2 "A wide golden-hour view across a South Carolina salt marsh: a weathered wooden boardwalk running out over bright green spartina grass to the water, a single white egret standing in the shallows, soft clouds over a warm aqua sky. $NOSIGNS"
wait; echo done

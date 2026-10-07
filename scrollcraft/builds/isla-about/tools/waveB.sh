#!/usr/bin/env bash
# Wave B: rerolls (kitchen had baked-in text, loaf came out rainbow), the two-booth frame, cutouts.
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
R=../isla-home/refs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."

node $K still "$P

A sunny, cheerful home kitchen seen straight-on at counter height. A warm butcher-block counter runs across the bottom fifth of the frame. Just right of centre, above the counter, a large open window with a white wooden frame and a deep white sill looks out onto a green garden, a wooden fence and bright blue sky; the window opening is empty and clear. The counter directly under the window is completely empty and in focus. Soft aqua painted cabinets and plain cream tiles around the window; a crock of wooden spoons and a folded linen towel at the far right edge. The left third of the frame is plain, calm, softly blurred aqua cabinet doors with nothing on them. No people, no animals, no soap, no lettering, no signs, no posters, no writing anywhere." out/kitchen2.png --ar 16:9 > out/kitchen2.log 2>&1 &

node $K still "$P

A long handmade lavender soap loaf resting in an open wooden loaf mold with its sides folded down. The whole loaf is one solid soft lavender purple colour all the way through, flecked with dried lavender buds on top, exactly like the reference bar's soap: no swirls, no other colours. Two thick freshly cut purple bars stand upright at one end of the loaf. Three-quarter view from slightly above. No labels, no paper bands, no text. Isolated on a plain seamless light grey studio backdrop with generous empty margin on every side." out/loaf2.png --ar 4:3 --ref $R/lavender.jpg > out/loaf2.log 2>&1 &

node $K still "$P

The same outdoor farmers market scene as the reference, same light, same camera, same striped canopy and the same proud goat behind the table, but now there are two identical folding tables with cream tablecloths side by side under a wider canopy, both covered in little wooden crates of handmade soap bars, each with a blank kraft paper sign with nothing written on it. No people, no faces, no text, no logos." out/booth2.png --ar 16:9 --ref out/booth1.png > out/booth2.log 2>&1 &

for n in goat card duck stamp magnet; do
  node tools/kiejob.mjs recraft/remove-background out/$n-cut.png "{\"image\":\"@out/$n.png\"}" > out/$n-cut.log 2>&1 &
done

wait; echo done

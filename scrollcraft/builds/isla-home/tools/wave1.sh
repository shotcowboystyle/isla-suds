#!/usr/bin/env bash
# Wave 1 stills. Preamble is verbatim from BRIEF.md.
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."

BAR="Studio product photograph of exactly this handmade soap bar from the reference: identical soap colour and texture, identical kraft paper band, identical white label with the goat and palm tree illustration, label artwork unchanged and sharp. The bar floats in mid-air in a three-quarter view from slightly above, tilted about 12 degrees, whole bar in frame with generous empty margin on every side, centred. Plain seamless light grey studio backdrop, no props, no shadow on the ground."

for n in lavender lemongrass rosemary eucalyptus; do
  node $K still "$P

$BAR" out/bar-$n.png --ar 3:4 --ref refs/$n.jpg > out/bar-$n.log 2>&1 &
done

node $K still "$P

An empty dreamy sky made of soft aqua teal studio light, fading to warm cream near the bottom. Dozens of soap bubbles of different sizes drift through the air, most of them softly out of focus, a few crisp with rainbow sheen. A low rolling bank of thick creamy white soap foam runs along the very bottom edge of the frame like clouds. The centre of the frame is calm and open for a headline. No objects, no people, no soap bars." out/hero-plate.png --ar 16:9 > out/hero-plate.log 2>&1 &

node $K still "$P

An empty dreamy sky made of soft aqua teal studio light, fading to warm cream near the bottom. Dozens of soap bubbles of different sizes drift through the air, most of them softly out of focus, a few crisp with rainbow sheen. A low rolling bank of thick creamy white soap foam runs along the very bottom edge of the frame like clouds. The upper half of the frame is calm and open for a headline. No objects, no people, no soap bars." out/hero-plate-m.png --ar 9:16 > out/hero-plate-m.log 2>&1 &

node $K still "$P

A wide clump of thick, glossy, creamy white soap foam and lather, piled in soft billows along the bottom of the frame, with a few loose bubbles above it, photographed against a pure black background with nothing else in frame. The foam is brightly lit and sharply detailed; the black is completely clean." out/foam.png --ar 16:9 > out/foam.log 2>&1 &

node $K still "$P

A joyful woman in her late thirties sits in a deep white clawfoot bathtub overflowing with thick white bubble-bath foam. Her hair is completely hidden under an enormous, comically tall wig sculpted entirely out of soap suds, with two playful peaks like bunny ears. She holds a small handmade lavender soap bar with a kraft paper band up beside her cheek and grins straight into the camera, delighted. Sunlit bathroom with pale aqua tiles and a tall window letting in warm morning light, a little soft steam. The woman sits in the centre third of the frame, the foam fills the lower third, and there is clean wall above her head." out/bath.png --ar 16:9 --ref refs/lavender.jpg > out/bath.log 2>&1 &

node $K still "$P

A sunlit marble bath ledge seen at eye level. On it sit two handmade goat milk soap bars with kraft paper bands and white goat labels, one lavender purple and one pale cream, resting on a little cloud of fresh white lather, beside a small glass bottle of goat milk, a sprig of lavender, a few green eucalyptus leaves and a natural sea sponge. Soft bubbles float in the air. Background is a soft aqua tiled wall, out of focus. The left half of the frame is calm and uncluttered for a headline; the objects cluster on the right half." out/ingredients.png --ar 16:9 --ref refs/lavender.jpg > out/ingredients.log 2>&1 &

wait
echo done

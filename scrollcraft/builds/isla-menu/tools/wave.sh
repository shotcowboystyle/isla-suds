#!/usr/bin/env bash
# Menu hover images. `home` first (wave 1); every other scene refs it so it is the same goat (wave 2).
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
R=../isla-home/refs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."
RULES="Portrait composition with the goat centred. No people, no faces other than the goat, no lettering, no signs with writing, no logos."
GOAT="The same white goat with grey-brown markings, long beard and curved horns as the reference photo."
BARS="unwrapped handmade soap bars that look exactly like the reference bars (soft lavender purple with buds, pale creamy beige, warm caramel tan, sandy tan with sea salt)"

still() { # name prompt [refs...]
  local name=$1 prompt=$2; shift 2
  local refs=(); for r in "$@"; do refs+=(--ref "$r"); done
  node $K still "$P

$prompt $RULES" out/$name.png --ar 3:4 "${refs[@]}" > out/$name.log 2>&1 &
}

if [ "$1" = "1" ]; then
  still home "A white goat with grey-brown markings, a long wispy beard and curved horns peeks its head around a pale aqua shower curtain in a bright, sunny bathroom, a fluffy blob of soap foam sitting on top of its head and foam on its beard, looking at the camera with a curious, slightly smug expression. Below, a glossy white clawfoot tub overflows with thick white foam. Cream tiles, morning sunlight through a window."
else
  H=out/home.png
  still shop "$GOAT It stands behind a little wooden shop counter like a proud shopkeeper, front hooves on the counter, in a sunny cream and coral corner shop. On the counter sits a neat display of $BARS, and a small brass counter bell. Shelves softly blurred behind." $H $R/lavender.jpg $R/eucalyptus.jpg
  still stores "$GOAT It is browsing a bright, cheerful neighbourhood market shelf, sniffing one of the $BARS stacked on the wooden shelf in front of it, a little wicker shopping basket hooked over one horn. Aqua painted shelving, potted plants, morning light." $H $R/lavender.jpg $R/lemongrass.jpg
  still wholesale "$GOAT It proudly wheels a red hand truck stacked high with plain kraft cardboard crates full of $BARS up to the open back door of a sunny little shop, very pleased with itself. Aqua door, cream brick wall, blue sky." $H $R/lavender.jpg $R/eucalyptus.jpg
  still about "$GOAT It wears a cream linen apron and stands at a sunny home kitchen butcher-block counter, looking very focused, beside a long lavender soap loaf in a wooden mold (soft lavender purple flecked with buds, like the reference bar) and a single blank vintage recipe index card with nothing written on it. Aqua kitchen cabinets, a window with a garden view." $H $R/lavender.jpg
  still contact "$GOAT It sits at a little cream wooden desk holding the receiver of a coral vintage rotary telephone to its ear with one hoof, looking delighted mid-conversation, the phone's curly cord dangling. Soft aqua wall, a small potted plant, warm sunlight." $H
fi
wait; echo done

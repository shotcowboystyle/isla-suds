#!/usr/bin/env bash
# Wave A: every still for /about. Cutout subjects go on a plain grey backdrop for wave B.
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
R=../isla-home/refs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."
GREY="Isolated on a plain seamless light grey studio backdrop with generous empty margin on every side. No props, no text."
NOPEOPLE="No people, no faces, no text, no logos."
HANDS="Only hands and forearms are visible, cropped by the frame; no faces, no heads, no text, no logos."

still() { # name ar prompt [refs...]
  local name=$1 ar=$2 prompt=$3; shift 3
  local refs=(); for r in "$@"; do refs+=(--ref "$r"); done
  node $K still "$P

$prompt" out/$name.png --ar $ar "${refs[@]}" > out/$name.log 2>&1 &
}

# Hero
still kitchen 16:9 "A sunny, cheerful home kitchen seen straight-on at counter height. A warm butcher-block counter runs across the bottom fifth of the frame. Just right of centre, above the counter, a large open window with a white wooden frame and a deep white sill looks out onto a green garden, a wooden fence and bright blue sky; the window opening is empty and clear. The counter directly under the window is completely empty and in focus. Soft aqua painted cabinets and cream tiles around the window; a crock of wooden spoons and a folded linen towel at the far right edge. The left third of the frame is calm and softly blurred aqua cabinetry for a headline. $NOPEOPLE No animals, no soap."
still loaf 4:3 "A long handmade soap loaf resting in an open wooden loaf mold with its sides folded down, made of exactly the same soap as the reference bar: soft lavender purple flecked with dried lavender buds and a dark speckled edge. Two thick freshly cut bars stand upright at one end of the loaf. Three-quarter view from slightly above. No labels, no paper bands. $GREY" $R/lavender.jpg
still goat 1:1 "A cheerful white and tan goat poking its head and neck up into frame from below, looking straight at the camera with a goofy delighted grin, ears sticking out sideways. Cropped flat at the chest by the bottom edge of the frame. $GREY"

# Act 2: the recipe card
still card 3:2 "A single blank vintage recipe index card, completely unlined and unwritten, aged warm cream paper with soft foxing and slightly worn corners, a faint round coffee ring stain near the lower right corner, two short strips of translucent tape across the top corners. Perfectly flat, top-down, card straight and filling most of the frame. Absolutely no writing, no lines, no text. $GREY"

# Act 3: polaroids
still farm 1:1 "A friendly dairy goat standing in a sunny green pasture beside a weathered wooden fence, looking at the camera with a cheeky expression, a small red barn soft in the background, golden morning light. $NOPEOPLE"
still pour 1:1 "Close-up of two hands pouring creamy ivory soap batter in a thick ribbon from a stainless steel pitcher into a paper-lined wooden loaf mold on a butcher-block kitchen counter, sunny kitchen, aqua cabinets softly blurred behind. $HANDS"
still wirecut 1:1 "Close-up of two hands pressing a wooden-framed wire soap cutter down through a long handmade soap loaf on a wooden board, a row of thick neat bars already cut, made of exactly the same soap as the reference bar: pale creamy beige with soft swirls. Sunny kitchen, aqua tiles softly blurred behind. $HANDS" $R/eucalyptus.jpg
still racks 1:1 "Rows of unwrapped handmade soap bars standing on edge with gaps between them on slatted wooden curing racks in a bright kitchen corner, made of exactly the same soaps as the reference bars (soft lavender purple with buds, pale creamy beige, warm caramel tan, sandy tan with sea salt). Airy, neat, morning light from a window. No labels, no paper bands. $NOPEOPLE" $R/lavender.jpg $R/eucalyptus.jpg $R/lemongrass.jpg

# Act 4: the market
still booth1 16:9 "An outdoor farmers market on a sunny Saturday morning, seen straight-on. In the centre, one small folding table with a cream linen tablecloth holds neat little wooden crates of unwrapped handmade soap bars made of exactly the same soaps as the reference bars. A blank kraft paper sign with nothing written on it hangs on the front of the tablecloth. Behind the table, a white and tan goat stands with its front hooves on the table edge like a proud shopkeeper. A coral and cream striped canopy overhead; other market tents and greenery softly blurred behind. $NOPEOPLE" $R/lavender.jpg $R/eucalyptus.jpg

# Act 5: the inspection desk (lamp on; the dark state is CSS)
still desk 16:9 "A tidy little inspection desk seen at desk height, straight-on. A warm honey wooden desktop runs across the bottom third of the frame. On the left, a vintage brass desk lamp is switched on and angled down, casting a warm pool of light onto the centre of the desk. The centre of the desk inside the pool of light is completely empty and in focus. Soft aqua painted wall behind with a little framed botanical print far right, slightly blurred. $NOPEOPLE No soap, no animals, no paper."
still duck 1:1 "A classic glossy yellow rubber duck wearing tiny round wire-rimmed spectacles perched on its orange beak, looking very serious and official, three-quarter view facing left. $GREY"
still stamp 1:1 "A vintage wooden office rubber stamp with a round turned honey wooden handle and a rectangular wooden base, seen from the side and slightly above, upright. $GREY"

# Act 6: the fridge
still fridge 16:9 "Straight-on close-up of a cream retro refrigerator door that fills the whole frame, a chrome handle along the far right edge, a few colourful fruit-shaped magnets scattered near the top left and bottom right corners. The middle of the door is completely empty, clean and evenly lit. Warm morning daylight. $NOPEOPLE"
still magnet 1:1 "A small glossy ceramic fridge magnet shaped like a happy goat's head, white and tan with little horns and a big smile, seen straight-on. $GREY"

wait; echo done

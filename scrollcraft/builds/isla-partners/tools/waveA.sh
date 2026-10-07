#!/usr/bin/env bash
# Wave A: venue plates, before plate, door plate, goat still. Preamble verbatim from BRIEF.md.
cd "$(dirname "$0")/.."
K=../../../.claude/skills/scroll-craft/scripts/kie.mjs
P="Playful premium commercial photography for a small-batch goat milk soap brand. Bright, saturated, true-to-life colour; soft directional daylight with a gentle fill; crisp micro-texture; shallow depth of field; medium-format clarity; joyful and slightly absurd, never cartoonish. Palette: soft aqua teal, warm cream, coral red, butter yellow. No added text, no watermark."
COUNTER="Straight-on, eye-level view. A clean empty counter surface runs horizontally across the whole frame; its front edge sits about seventy percent of the way down the frame. The central half of the counter top is completely empty. No soap, no bottles, no dispensers, no text, no signs, no logos, no people. The upper part of the frame is softly out of focus."

gen() { node $K still "$P

$2 $COUNTER" out/plate-$1.png --ar 16:9 > out/plate-$1.log 2>&1 & }
gen grocery "Inside a bright, friendly neighbourhood grocery store: a warm wooden display shelf at the end of an aisle, colourful produce and jars far behind in soft focus."
gen gym "Inside a sunny boutique gym locker room: a white quartz vanity counter, a chrome tap at the far right edge, mint-green lockers behind in soft focus."
gen office "Inside a cheerful modern office break room: a light wood kitchen counter, a few mugs and a plant pushed to the far edges, big windows behind in soft focus."
gen cafe "Inside a cosy café restroom: a butcher-block vanity counter, terracotta and cream patterned tiles behind in soft focus, a small vase of flowers at the far left edge."
gen hotel "Inside a boutique hotel bathroom: a white marble vanity counter, neatly rolled white towels at the far right edge, pale aqua wallpaper behind in soft focus."
gen spa "Inside a calm day spa treatment room: a smooth pale stone counter, a eucalyptus sprig and a candle at the far edges, warm wood slats behind in soft focus."
gen restaurant "Inside a stylish restaurant restroom: a polished marble counter, deep green glossy tiles and a brass sconce behind in soft focus."

node $K still "$P

This one shot is deliberately drab and a little sad, for comedy: a generic shop restroom counter under flat, greenish fluorescent light, beige laminate, a smudged mirror edge. In the exact centre of the counter stands one lonely generic pink plastic pump soap bottle with no label. $COUNTER" out/before.png --ar 16:9 > out/before.log 2>&1 &

node $K still "$P

A charming small shop front seen straight-on from outside: a pair of closed wooden double doors painted soft aqua with tall glass panes, round brass knobs meeting exactly in the centre of the frame, the two doors together filling the entire frame edge to edge and top to bottom. The glass shows only warm blurred light from inside. No text, no signs, no logos, no people." out/door.png --ar 16:9 > out/door.log 2>&1 &

node $K still "$P

Inside a sunny little boutique shop with aqua walls and wooden shelves: a small white goat wearing a tiny red delivery cap stands proudly in the centre of the frame, harnessed to a little wooden wagon piled high with plain kraft-paper boxes and handmade soap bars wrapped in kraft paper bands. Behind the wooden counter a delighted woman shopkeeper throws both hands up, laughing. The goat faces the camera. Generous floor space in the lower third. No text, no logos, no signs." out/goat.png --ar 16:9 > out/goat.log 2>&1 &

wait; echo done

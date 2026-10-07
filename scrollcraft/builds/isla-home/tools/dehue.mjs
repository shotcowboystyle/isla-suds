// Clear alpha on pixels in a hue band (stray coloured chips the generator added).
//   node dehue.mjs in.png out.png <hueRanges e.g. "0-28,330-360,38-62"> [minSat=0.35]
import sharp from 'sharp';
const [inp, out, ranges, minSat = '0.35'] = process.argv.slice(2);
const bands = ranges.split(',').map((r) => r.split('-').map(Number));
const {data, info} = await sharp(inp).ensureAlpha().raw().toBuffer({resolveWithObject: true});
const kill = new Uint8Array(info.width * info.height);
for (let i = 0, p = 0; i < data.length; i += 4, p++) {
  const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const s = max === 0 ? 0 : d / max;
  if (s < +minSat || data[i + 3] === 0) continue;
  let h = d === 0 ? 0 : max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  if (bands.some(([a, z]) => h >= a && h <= z)) kill[p] = 1;
}
// Grow the mask by 3px so anti-aliased chip edges go too.
const W = info.width, H = info.height, R = 3;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  let hit = false;
  for (let dy = -R; dy <= R && !hit; dy++) for (let dx = -R; dx <= R && !hit; dx++) {
    const xx = x + dx, yy = y + dy;
    if (xx >= 0 && yy >= 0 && xx < W && yy < H && kill[yy * W + xx]) hit = true;
  }
  if (hit) data[(y * W + x) * 4 + 3] = 0;
}
await sharp(data, {raw: info}).png().toFile(out);
console.log(out);

/**
 * Writes the small srcset variants for the home hero bars and the used-up bar.
 *
 * The sources are encoded for the largest slot they fill, but most slots show
 * them at a fraction of that: hero bars at 6-22vw, the wear stages at 120px.
 * Re-run after replacing a source: `node scripts/resize-home-images.mjs`.
 * Quality matches DESIGN.md §5 (cwebp -q 80 -alpha_q 90 for cutouts).
 */
/* eslint-disable no-console -- this script's entire output is its console log */
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve('app/assets/images/home');

const jobs = [
  ...['rosemary', 'lemongrass', 'eucalyptus', 'lavender'].map((name) => ({name: `bar-${name}`, width: 480})),
  ...[0, 1, 2, 3, 4].map((n) => ({name: `wear-${n}`, width: 240})),
];

for (const {name, width} of jobs) {
  const out = path.join(dir, `${name}-${width}.webp`);
  const info = await sharp(path.join(dir, `${name}.webp`))
    .resize({width, withoutEnlargement: true})
    .webp({quality: 80, alphaQuality: 90, effort: 6})
    .toFile(out);
  console.log(`${path.basename(out)}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
}

/* eslint-enable no-console */

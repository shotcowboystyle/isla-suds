/**
 * Stores page: walks the scroll at even stops (the goat should hop as each
 * postcard crosses the middle), then flips the first postcard.
 * Throwaway verification tool:
 *   `node scripts/shoot-stores.mjs [origin] [out] [width] [height] [--reduced-motion]`
 */
/* eslint-disable no-console -- this script's entire output is its console log */
import {mkdir, rm} from 'node:fs/promises';
import {chromium} from 'playwright-core';

const origin = process.argv[2] ?? 'http://isla-suds.localhost:1355';
const out = process.argv[3] ?? 'lab/stores';
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const reducedMotion = process.argv.includes('--reduced-motion') ? 'reduce' : 'no-preference';
const STOPS = 8;

await rm(out, {recursive: true, force: true});
await mkdir(out, {recursive: true});

const browser = await chromium.launch({channel: 'chrome'});
const page = await browser.newPage({viewport: {width, height}, reducedMotion, deviceScaleFactor: 1});
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && !/nonce|Content Security/.test(m.text()) && errors.push(m.text()));

await page.goto(`${origin}/locations`, {waitUntil: 'load', timeout: 90000});
await page.waitForTimeout(6500); // preloader + hero entrance

const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
console.log(`scrollable: ${total}px @ ${width}x${height} (reduced-motion: ${reducedMotion})`);
for (let i = 0; i <= STOPS; i++) {
  const y = Math.round((total * i) / STOPS);
  await page.evaluate((to) => window.scrollTo({top: to, behavior: 'instant'}), y);
  await page.waitForTimeout(1600);
  const goat = await page.evaluate(() => {
    const el = document.querySelector('.store-map-goat');
    return el ? el.style.transform : 'no goat';
  });
  await page.screenshot({path: `${out}/${String(i).padStart(2, '0')}-${y}.png`, timeout: 90000});
  console.log(`${i} y=${y} goat: ${goat}`);
}

const first = page.locator('ol li').first();
await first.scrollIntoViewIfNeeded();
await page.evaluate(() => window.scrollBy(0, -120));
await first.getByRole('button', {name: /flip/i}).click();
await page.waitForTimeout(1200);
await page.screenshot({path: `${out}/flipped.png`, timeout: 90000});

console.log(errors.length ? `errors:\n${errors.join('\n')}` : 'no errors');
await browser.close();
/* eslint-enable no-console */

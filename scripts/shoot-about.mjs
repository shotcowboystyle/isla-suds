/**
 * Scroll-position contact sheet for /about.
 *
 * A scroll page has no single state, so a screenshot of the top proves almost
 * nothing. This walks the page in fractions of its scroll height and shoots
 * each stop. Throwaway verification tool: `node scripts/shoot-about.mjs [url]`.
 */
/* eslint-disable no-console -- this script's entire output is its console log */
import {mkdir, rm} from 'node:fs/promises';
import {chromium} from 'playwright-core';

const url = process.argv[2] ?? 'http://localhost:3002/about';
const out = process.argv[3] ?? 'lab/about';
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const reducedMotion = process.argv.includes('--reduced-motion') ? 'reduce' : 'no-preference';
const STOPS = 14;

await rm(out, {recursive: true, force: true});
await mkdir(out, {recursive: true});

const browser = await chromium.launch({channel: 'chrome'});
const page = await browser.newPage({viewport: {width, height}, reducedMotion, deviceScaleFactor: 1});

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(url, {waitUntil: 'networkidle'});
await page.waitForTimeout(1500);

const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
console.log(`scrollable: ${total}px @ ${width}x${height} (reduced-motion: ${reducedMotion})`);

for (let i = 0; i <= STOPS; i++) {
  const y = Math.round((total * i) / STOPS);
  await page.evaluate((to) => window.scrollTo({top: to, behavior: 'instant'}), y);
  await page.waitForTimeout(900);
  await page.screenshot({path: `${out}/${String(i).padStart(2, '0')}-${y}.png`});
}

console.log(errors.length ? `console errors:\n${errors.join('\n')}` : 'no console errors');
await browser.close();

/* eslint-enable no-console */

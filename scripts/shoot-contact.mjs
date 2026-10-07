/**
 * Contact page: hero, desk, and the sent state (the goat holding the slip).
 * Throwaway verification tool:
 *   `node scripts/shoot-contact.mjs [origin] [out] [width] [height] [--reduced-motion]`
 */
/* eslint-disable no-console -- this script's entire output is its console log */
import {mkdir, rm} from 'node:fs/promises';
import {chromium} from 'playwright-core';

const origin = process.argv[2] ?? 'http://localhost:3000';
const out = process.argv[3] ?? 'lab/contact';
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const reducedMotion = process.argv.includes('--reduced-motion') ? 'reduce' : 'no-preference';
const STOPS = 6;

await rm(out, {recursive: true, force: true});
await mkdir(out, {recursive: true});

const browser = await chromium.launch({channel: 'chrome'});
const page = await browser.newPage({viewport: {width, height}, reducedMotion, deviceScaleFactor: 1});
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

// Never let the send reach the action (it emails the owner). Answer the
// single-fetch POST with an encoded success instead (turbo-stream of
// {data: {success: true, name: 'Sam'}}).
await page.route(
  (url) => url.pathname === '/contact.data',
  (route) =>
    route.request().method() === 'POST'
      ? route.fulfill({
          status: 200,
          contentType: 'text/x-script',
          body: '[{"_1":2},"data",{"_3":4,"_5":6},"success",true,"name","Sam"]',
        })
      : route.continue(),
);
let posted = 0;
page.on('request', (r) => r.method() === 'POST' && r.url().includes('/contact') && posted++);

await page.goto(`${origin}/contact`, {waitUntil: 'networkidle'});
await page.waitForTimeout(6000); // preloader + hero entrance

const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
console.log(`scrollable: ${total}px @ ${width}x${height} (reduced-motion: ${reducedMotion})`);
for (let i = 0; i <= STOPS; i++) {
  const y = Math.round((total * i) / STOPS);
  await page.evaluate((to) => window.scrollTo({top: to, behavior: 'instant'}), y);
  await page.waitForTimeout(1200);
  await page.screenshot({path: `${out}/${String(i).padStart(2, '0')}-${y}.png`});
}

// Fill the slip in and send it.
await page.locator('#slip-name').scrollIntoViewIfNeeded();
await page.fill('#slip-name', 'Sam');
await page.fill('#slip-email', 'sam@example.com');
await page.locator('label:has-text("Order help")').click();
await page.fill('#slip-order', '#1042');
await page.fill(
  '#slip-message',
  'My lavender bar arrived looking like it had a rough trip. Still smells amazing though.',
);
await page.evaluate(() =>
  document.querySelector('form[aria-labelledby="slip-title"]').scrollIntoView({block: 'center'}),
);
await page.waitForTimeout(500);
await page.screenshot({path: `${out}/filled.png`});
await page.click('button[type="submit"]:has-text("goat")');
await page.waitForTimeout(700);
await page.screenshot({path: `${out}/sending.png`});
await page.waitForTimeout(3000);
await page.evaluate(() => document.querySelector('[class*="taken"]')?.scrollIntoView({block: 'center'}));
await page.waitForTimeout(600);
await page.screenshot({path: `${out}/taken.png`});

console.log(`contact POSTs intercepted: ${posted}`);
console.log(errors.length ? `console errors:\n${errors.join('\n')}` : 'no console errors');
await browser.close();
/* eslint-enable no-console */

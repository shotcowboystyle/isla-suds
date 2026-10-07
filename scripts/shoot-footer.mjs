/**
 * Footer close, shot at the bottom of several routes. The footer is the last
 * screen of every page, so each route ends on it with different content above.
 * Throwaway verification tool:
 *   `node scripts/shoot-footer.mjs [origin] [out] [width] [height] [--reduced-motion]`
 */
/* eslint-disable no-console -- this script's entire output is its console log */
import {mkdir, rm} from 'node:fs/promises';
import {chromium} from 'playwright-core';

const origin = process.argv[2] ?? 'http://localhost:3000';
const out = process.argv[3] ?? 'lab/footer';
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const reducedMotion = process.argv.includes('--reduced-motion') ? 'reduce' : 'no-preference';
const ROUTES = ['/', '/about', '/collections/frontpage', '/contact'];

await rm(out, {recursive: true, force: true});
await mkdir(out, {recursive: true});

const browser = await chromium.launch({channel: 'chrome'});
const page = await browser.newPage({viewport: {width, height}, reducedMotion, deviceScaleFactor: 1});

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

for (const route of ROUTES) {
  const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
  await page.goto(origin + route, {waitUntil: 'networkidle'});
  await page.waitForTimeout(4500); // preloader

  const bottom = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  // Approach the end in steps so scroll-triggered entrances fire like a real visit.
  for (const f of [0.8, 0.9, 0.97, 1]) {
    await page.evaluate((to) => window.scrollTo({top: to, behavior: 'instant'}), Math.round(bottom * f));
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(2200);
  await page.screenshot({path: `${out}/${name}-end.png`});

  const footerTop = await page.evaluate(() => {
    const f = document.querySelector('footer');
    return f ? Math.round(f.getBoundingClientRect().top + window.scrollY) : 0;
  });
  await page.evaluate((to) => window.scrollTo({top: to, behavior: 'instant'}), Math.max(0, footerTop - height * 0.35));
  await page.waitForTimeout(1500);
  await page.screenshot({path: `${out}/${name}-enter.png`});

  const logo = await page.evaluate(() => {
    const g = document.querySelector('footer [data-logo]');
    if (!g) return null;
    const b = g.getBBox();
    return {x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1)};
  });
  console.log(`${route}: scroll ${bottom}px, footer at ${footerTop}, logo bbox ${JSON.stringify(logo)}`);
}

console.log(errors.length ? `console errors:\n${errors.join('\n')}` : 'no console errors');
await browser.close();

/* eslint-enable no-console */

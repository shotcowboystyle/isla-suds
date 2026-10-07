// Open the nav menu and screenshot the image panel for each hovered link: node hover.mjs <w> <h> <outPrefix>
import {chromium} from 'playwright-core';
const [w, h, out] = process.argv.slice(2);
const browser = await chromium.launch({channel: 'chrome'});
const page = await browser.newPage({viewport: {width: +w, height: +h}});
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto('http://localhost:3000/', {waitUntil: 'networkidle'});
await page.waitForTimeout(6000);
await page.locator('button[aria-label="Toggle menu"]').first().click({force: true});
await page.waitForTimeout(3000);
const links = page.locator('div.fixed.inset-0 nav[role=navigation] a');
const n = await links.count();
for (let i = 0; i < n; i++) {
  await links.nth(i).hover();
  await page.waitForTimeout(250);
  const src = await page.locator('img[aria-hidden="true"].object-cover').getAttribute('src');
  const done = await page.locator('img[aria-hidden="true"].object-cover').evaluate((img) => img.complete);
  console.log(i, (await links.nth(i).textContent()).trim(), src, done ? 'loaded' : 'NOT LOADED');
  await page.screenshot({path: `${out}-${i}.png`});
}
console.log(errors.length ? errors.join('\n') : 'no errors');
await browser.close();

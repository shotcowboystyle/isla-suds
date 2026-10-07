// Targeted stills: node shot.mjs <url> <outPrefix> <w> <h> <stop>...
//   stop = px | N% of page | "<css>:<p>" (p = 0..1 through that element's scroll span)
import {chromium} from 'playwright-core';
const [url, out, w, h, ...stops] = process.argv.slice(2);
const browser = await chromium.launch({channel: 'chrome'});
const page = await browser.newPage({viewport: {width: +w, height: +h}, reducedMotion: process.env.RM ? 'reduce' : 'no-preference'});
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && !/nonce|Warning:/.test(m.text()) && errors.push(m.text()));
await page.goto(url, {waitUntil: 'networkidle'});
await page.waitForTimeout(+(process.env.WAIT ?? 5500));
let i = 0;
for (const stop of stops) {
  const top = await page.evaluate((s) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (s.endsWith('%')) return Math.round((max * parseFloat(s)) / 100);
    if (/^\d+$/.test(s)) return +s;
    const cut = s.lastIndexOf(':');
    const sel = s.slice(0, cut);
    const p = s.slice(cut + 1);
    const el = document.querySelector(sel);
    const r = el.getBoundingClientRect();
    const start = r.top + scrollY;
    return Math.round(start + (r.height - innerHeight) * +p);
  }, stop);
  console.log(stop, '->', top);
  await page.evaluate((t) => window.scrollTo({top: t, behavior: 'instant'}), top);
  await page.waitForTimeout(1200);
  await page.screenshot({path: `${out}-${String(i++).padStart(2, '0')}.png`});
}
console.log(errors.length ? errors.join('\n') : 'no errors');
await browser.close();

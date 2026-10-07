import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {MOTION_QUERY} from '~/lib/motion/tokens';
import styles from './Traveler.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

/** Box size the bar image is drawn at before scaling to a dock. */
const BASE = 240;

/** Fraction of each leg the bar spends parked at either end before it flies. */
const PARK = 0.18;

/** Docks where another element takes over drawing the bar (the lather video). */
const HANDOFF = new Set(['tap']);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const flight = GSAP.parseEase('power2.inOut');

export interface TravelLeg {
  from: number;
  to: number;
  t: number;
}

/**
 * Which two docks the bar is between, and how far along. `centers` are the
 * docks' vertical centres in viewport px, in page order; the bar sits at the
 * last dock above the middle of the screen and flies toward the next one.
 */
export function travelLeg(centers: number[], middle: number): TravelLeg {
  const next = centers.findIndex((c) => c > middle);
  if (next === -1) return {from: centers.length - 1, to: centers.length - 1, t: 0};
  if (next === 0) return {from: 0, to: 0, t: 0};
  const from = next - 1;
  const raw = (middle - centers[from]) / (centers[next] - centers[from]);
  const t = GSAP.utils.clamp(0, 1, (raw - PARK) / (1 - 2 * PARK));
  return {from, to: next, t};
}

/**
 * The signature move: one bar that travels down the page and docks into every
 * act (`[data-dock]`): over its scent world, beside the loaf it was cut from,
 * in the middle of its ingredients, under the tap, on the shelf with its
 * siblings, and finally in the buy box. It flips on the way between docks.
 */
export function Traveler({src, baseRot = 0, handle}: {src: string; baseRot?: number; handle: string}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const mm = GSAP.matchMedia();

    mm.add(MOTION_QUERY, () => {
      const docks = Array.from(document.querySelectorAll<HTMLElement>('[data-dock]'));
      if (!docks.length) return;
      docks.forEach((dock) => (dock.dataset.live = ''));

      const render = () => {
        const rects = docks.map((dock) => dock.getBoundingClientRect());
        const leg = travelLeg(
          rects.map((r) => r.top + r.height / 2),
          window.innerHeight / 2,
        );
        const e = flight(leg.t);
        const a = rects[leg.from];
        const b = rects[leg.to];
        const moving = leg.from !== leg.to;

        const cx = lerp(a.left + a.width / 2, b.left + b.width / 2, e);
        const cy =
          lerp(a.top + a.height / 2, b.top + b.height / 2, e) -
          (moving ? Math.sin(Math.PI * e) * window.innerHeight * 0.1 : 0);
        const size = lerp(a.width, b.width, e);
        const rotA = Number(docks[leg.from].dataset.dockRot) || 0;
        const rotB = Number(docks[leg.to].dataset.dockRot) || 0;
        const flip = moving ? (leg.from % 2 ? -360 : 360) * e : 0;

        // Fade out as it reaches a hand-off dock, fade back in as it leaves.
        let opacity = 1;
        if (HANDOFF.has(docks[leg.to].dataset.dock ?? '') && moving)
          opacity = 1 - GSAP.utils.clamp(0, 1, (e - 0.75) / 0.25);
        if (HANDOFF.has(docks[leg.from].dataset.dock ?? '')) opacity = moving ? GSAP.utils.clamp(0, 1, e / 0.25) : 0;

        el.style.transform = `translate3d(${cx - BASE / 2}px, ${cy - BASE / 2}px, 0) rotate(${lerp(rotA, rotB, e) + flip}deg) scale(${size / BASE})`;
        el.style.opacity = String(opacity);
      };

      const trigger = ScrollTrigger.create({start: 0, end: 'max', onUpdate: render, onRefresh: render});
      render();

      return () => {
        trigger.kill();
        docks.forEach((dock) => delete dock.dataset.live);
      };
    });

    return () => mm.revert();
  });

  return (
    <div
      ref={ref}
      className={styles['traveler']}
      aria-hidden="true"
      // Shared with the collection card's bar, so opening a card glides the bar here.
      style={{viewTransitionName: `bar-${handle}`}}
    >
      <img
        src={src}
        alt=""
        width={1000}
        height={1000}
        decoding="async"
        className={styles['img']}
        style={{rotate: `${baseRot}deg`}}
      />
    </div>
  );
}

import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Wear0 from '~/assets/images/home/wear-0.webp';
import Wear1 from '~/assets/images/home/wear-1.webp';
import Wear2 from '~/assets/images/home/wear-2.webp';
import Wear3 from '~/assets/images/home/wear-3.webp';
import Wear4 from '~/assets/images/home/wear-4.webp';
import {MOTION_QUERY} from '~/lib/motion/tokens';
import styles from './UsedUpBar.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

/** Banded and new, unwrapped, worn round, a pebble, a sliver. */
const STAGES = [Wear0, Wear1, Wear2, Wear3, Wear4];

/** How big the bar is at each stage, relative to new. */
const STAGE_SCALE = [1, 1, 0.82, 0.64, 0.56];

/** Scroll velocity (px/s) above which the bar sheds bubbles. */
const SHED_VELOCITY = 1400;
const MAX_BUBBLES = 10;

/**
 * Where on the page each wear stage is reached, measured off the story's own
 * sections so the schedule follows the layout (pin spacers included) instead
 * of a fixed scroll fraction. Each anchor is `[scrollY, wear]`.
 */
function measureAnchors(): [number, number][] | null {
  const vh = window.innerHeight;
  const top = (selector: string) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    // A pinned element reports its fixed position mid-pin; its spacer doesn't.
    const box = el.closest('.pin-spacer') ?? el;
    return box.getBoundingClientRect().top + window.scrollY;
  };

  const message = top('[data-wear-at="message"]');
  const products = top('[data-wear-at="products"]');
  const video = top('[data-wear-at="video"]');
  const testimonials = top('[data-wear-at="testimonials"]');
  const stores = top('[data-wear-at="stores"]');
  if ([message, products, video, testimonials, stores].includes(null)) return null;

  return [
    [message! - vh * 0.85, 0],
    [message! - vh * 0.35, 1],
    [products!, 1],
    // The bath takes the biggest bite: the whole video scene is one step.
    [video!, 2],
    [testimonials! - vh * 0.5, 3],
    [stores! - vh, 4],
  ];
}

export function interpolate(anchors: [number, number][], y: number) {
  if (y <= anchors[0][0]) return anchors[0][1];
  for (let i = 1; i < anchors.length; i++) {
    const [y1, w1] = anchors[i];
    if (y <= y1) {
      const [y0, w0] = anchors[i - 1];
      return w0 + ((w1 - w0) * (y - y0)) / Math.max(1, y1 - y0);
    }
  }
  return anchors[anchors.length - 1][1];
}

/**
 * The signature move: a real Isla bar rides in the corner and gets used up as
 * the visitor scrolls. At the close it lands, as a sliver, in the slot beside
 * the store CTA (`[data-sliver-slot]` in LocalStores).
 */
export function UsedUpBar() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const body = bodyRef.current;
      if (!root || !body) return;

      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        const stages = Array.from(body.querySelectorAll<HTMLImageElement>('img'));
        const slot = document.querySelector<HTMLElement>('[data-sliver-slot]');
        let anchors: [number, number][] | null = null;
        let landFrom = 0;
        let landTo = 0;
        let lastShed = 0;
        let bubbles = 0;
        const landEase = GSAP.parseEase('power2.inOut');

        const measure = () => {
          anchors = measureAnchors();
          if (slot) {
            const slotTop = slot.getBoundingClientRect().top + window.scrollY;
            landFrom = slotTop - window.innerHeight * 0.95;
            landTo = slotTop - window.innerHeight * 0.55;
          }
        };

        const shed = () => {
          if (bubbles >= MAX_BUBBLES) return;
          bubbles++;
          const bubble = document.createElement('span');
          bubble.className = styles['bubble'];
          const size = GSAP.utils.random(6, 16);
          bubble.style.width = bubble.style.height = `${size}px`;
          bubble.style.left = `${GSAP.utils.random(15, 85)}%`;
          root.appendChild(bubble);
          bubble
            .animate(
              [
                {transform: 'translate(0, 0) scale(0.4)', opacity: 0},
                {opacity: 1, offset: 0.15},
                {
                  transform: `translate(${GSAP.utils.random(-40, 40)}px, ${GSAP.utils.random(-140, -80)}px) scale(1)`,
                  opacity: 0,
                },
              ],
              {duration: GSAP.utils.random(800, 1300), easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)'},
            )
            .finished.then(() => {
              bubble.remove();
              bubbles--;
            })
            .catch(() => {
              // Safe to continue: the animation was cancelled because the bubble left the DOM.
            });
        };

        const render = (self: ScrollTrigger) => {
          if (!anchors) return;
          const y = self.scroll();
          const wear = interpolate(anchors, y);

          // Crossfade only around each half-step, so two different shapes are
          // never both half-visible for long.
          stages.forEach((img, i) => {
            img.style.opacity = String(GSAP.utils.clamp(0, 1, 1.5 - Math.abs(wear - i) * 2));
          });

          const lower = Math.floor(wear);
          const scale = GSAP.utils.interpolate(
            STAGE_SCALE[lower],
            STAGE_SCALE[Math.min(lower + 1, STAGE_SCALE.length - 1)],
            wear - lower,
          );

          // Appear once the visitor starts scrolling, so the hero stays clean.
          const appear = GSAP.utils.clamp(0, 1, y / (window.innerHeight * 0.3));

          // Landing: fly from the corner into the slot, then ride along with it.
          const land = slot ? landEase(GSAP.utils.clamp(0, 1, (y - landFrom) / (landTo - landFrom))) : 0;
          let x = 0;
          let ty = 0;
          let s = scale;
          if (land > 0 && slot) {
            const from = root.getBoundingClientRect();
            const to = slot.getBoundingClientRect();
            x = (to.left + to.width / 2 - (from.left + from.width / 2)) * land;
            ty = (to.top + to.height / 2 - (from.top + from.height / 2)) * land;
            s = GSAP.utils.interpolate(scale, to.width / from.width, land);
          }

          body.style.transform = `translate3d(${x}px, ${ty}px, 0) scale(${s})`;
          root.style.opacity = String(appear);

          const velocity = Math.abs(self.getVelocity());
          const now = performance.now();
          if (velocity > SHED_VELOCITY && land === 0 && appear === 1 && now - lastShed > 90) {
            lastShed = now;
            shed();
          }
        };

        if (slot) slot.dataset.live = '';

        const trigger = ScrollTrigger.create({
          start: 0,
          end: 'max',
          onRefresh: (self) => {
            measure();
            render(self);
          },
          onUpdate: render,
        });

        return () => {
          trigger.kill();
          if (slot) delete slot.dataset.live;
        };
      });

      return () => mm.revert();
    },
    {scope: rootRef},
  );

  return (
    <div ref={rootRef} className={styles['used-bar']} aria-hidden="true">
      <div ref={bodyRef} className={styles['body']}>
        {STAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            width={420}
            height={420}
            decoding="async"
            className={styles['stage']}
            style={{opacity: i === 0 ? 1 : 0}}
          />
        ))}
      </div>
    </div>
  );
}

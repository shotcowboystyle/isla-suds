import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import CratePhoto from '~/assets/images/partners/crate-display.webp';
import {TERMS} from '~/content/partners';
import {LOCATIONS_PAGE} from '~/content/stores';
import {MOTION_QUERY, REVEAL_END, REVEAL_START, SCRUB_REVEAL} from '~/lib/motion/tokens';
import styles from './SellsItself.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

const REASONS = [
  'Goat milk, gentle on sensitive skin',
  'Essential oils, no added fragrance',
  'Handmade in small batches from a family recipe',
  'Made in the Lowcountry, sold by neighbors',
];

export function SellsItself() {
  const sectionRef = useRef<HTMLElement>(null);

  // The reasons stick on one at a time, like labels slapped on a crate.
  useGSAP(
    () => {
      const mm = GSAP.matchMedia();
      mm.add(MOTION_QUERY, () => {
        GSAP.from('[data-reason]', {
          opacity: 0,
          scale: 1.6,
          rotation: (i) => (i % 2 ? 10 : -10),
          ease: 'back.out(2)',
          stagger: 0.25,
          scrollTrigger: {trigger: '[data-reasons]', start: REVEAL_START, end: REVEAL_END, scrub: SCRUB_REVEAL},
        });
        GSAP.from('[data-crate]', {
          yPercent: 12,
          rotation: -6,
          ease: 'none',
          scrollTrigger: {trigger: sectionRef.current, start: 'top bottom', end: 'center center', scrub: SCRUB_REVEAL},
        });
      });
      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  const stockists = LOCATIONS_PAGE.stores.map(
    (store) => `${store.name} (${store.locations.map((location) => location.city).join(', ')})`,
  );

  return (
    <section ref={sectionRef} className={styles['section']} aria-labelledby="sells-title">
      <figure data-crate className={styles['crate']}>
        <img
          src={CratePhoto}
          alt="Isla Suds bars in a wooden display crate with whole soap loaves standing behind them"
          width={1600}
          height={1200}
          loading="lazy"
          className={styles['crate-img']}
        />
        <figcaption className={styles['caption']}>A real Isla Suds display: whole loaves, cut by hand.</figcaption>
      </figure>

      <div className={styles['copy']}>
        <h2 id="sells-title" className={styles['title']}>
          It sells itself <span className={styles['aside']}>(almost)</span>
        </h2>

        <ul data-reasons className={styles['reasons']}>
          {REASONS.map((reason) => (
            <li key={reason} data-reason className={styles['reason']}>
              {reason}
            </li>
          ))}
          <li data-reason className={styles['price']}>
            <span className={styles['price-amount']}>${TERMS.retail}</span>
            <span className={styles['price-note']}>on your shelf</span>
          </li>
        </ul>

        <p className={styles['stockists']}>
          Already on shelves at <strong>{stockists.join(' and ')}</strong>.
        </p>
      </div>
    </section>
  );
}

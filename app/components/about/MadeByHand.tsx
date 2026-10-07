import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Farm from '~/assets/images/about/farm.webp';
import Pour from '~/assets/images/about/pour.webp';
import Racks from '~/assets/images/about/racks.webp';
import WireCut from '~/assets/images/about/wirecut.webp';
import {ABOUT_PAGE} from '~/content/about';
import {MOTION_QUERY, REVEAL_START} from '~/lib/motion/tokens';
import styles from './MadeByHand.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

const {made} = ABOUT_PAGE;
const PHOTOS: Record<string, string> = {farm: Farm, pour: Pour, wirecut: WireCut, racks: Racks};

/**
 * Act 3: how it is made, as four taped polaroids, then the one real number on
 * the page. The polaroids get dealt onto the table; the six counts up once.
 */
export function MadeByHand() {
  const sectionRef = useRef<HTMLElement>(null);
  const weeksRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const weeks = weeksRef.current;
      if (!section || !weeks) return;
      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        GSAP.fromTo(
          '[data-polaroid]',
          {y: 120, rotation: (i) => (i % 2 ? 14 : -14), opacity: 0},
          {
            y: 0,
            rotation: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'back.out(1.6)',
            stagger: 0.12,
            scrollTrigger: {trigger: '[data-polaroids]', start: REVEAL_START},
          },
        );

        const counter = {weeks: 0};
        weeks.textContent = '0';
        GSAP.to(counter, {
          weeks: made.cureWeeks,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            weeks.textContent = String(Math.round(counter.weeks));
          },
          scrollTrigger: {trigger: weeks, start: 'top 85%'},
        });

        return () => {
          weeks.textContent = String(made.cureWeeks);
        };
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section ref={sectionRef} className={styles['made']} aria-labelledby="made-title">
      <h2 id="made-title" className={styles['heading']}>
        {made.heading}
      </h2>

      <ul data-polaroids className={styles['polaroids']}>
        {made.photos.map((photo) => (
          <li key={photo.key} className={styles['slot']}>
            <figure data-polaroid className={styles['polaroid']}>
              <img src={PHOTOS[photo.key]} alt={photo.alt} width={900} height={900} loading="lazy" decoding="async" />
              <figcaption className={styles['caption']}>{photo.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className={styles['cure']}>
        <p className={styles['count']}>
          <span ref={weeksRef} className={styles['number']}>
            {made.cureWeeks}
          </span>{' '}
          <span className={styles['unit']}>weeks</span>
        </p>
        <p className={styles['cure-body']}>{made.cureBody}</p>
      </div>
    </section>
  );
}

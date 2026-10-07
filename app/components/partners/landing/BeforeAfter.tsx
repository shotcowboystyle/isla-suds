import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import AfterImage from '~/assets/images/partners/after.webp';
import BeforeImage from '~/assets/images/partners/before.webp';
import {VENUES, VENUE_IDS, type VenueId} from '~/content/partners';
import {MOTION_QUERY, REDUCED_MOTION_QUERY} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './BeforeAfter.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * Before and after. The divider is a real range input, so it works by drag,
 * keyboard and screen reader. Scroll sweeps it across until the visitor grabs
 * it; from then on it's theirs.
 */
export function BeforeAfter({venue}: {venue: VenueId}) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);

  const setSplit = (value: number) => frameRef.current?.style.setProperty('--split', `${value}%`);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const range = rangeRef.current;
      if (!section || !range) return;

      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        const sweep = {value: 0};
        const tween = GSAP.to(sweep, {
          value: 100,
          ease: 'power1.inOut',
          scrollTrigger: {trigger: frameRef.current, start: 'top 75%', end: 'bottom 45%', scrub: 0.6},
          onUpdate: () => {
            range.value = String(Math.round(sweep.value));
            setSplit(sweep.value);
          },
        });

        // Setting `value` from code fires no event, so any of these means a person.
        const takeOver = () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
        const events = ['pointerdown', 'keydown', 'input'] as const;
        events.forEach((type) => range.addEventListener(type, takeOver, {once: true}));
        return () => events.forEach((type) => range.removeEventListener(type, takeOver));
      });

      mm.add(REDUCED_MOTION_QUERY, () => {
        range.value = '50';
        setSplit(50);
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section ref={sectionRef} className={styles['section']} aria-labelledby="before-after-title">
      <h2 id="before-after-title" className={styles['title']}>
        <span className={styles['title-stack']}>
          {VENUE_IDS.map((id) => (
            <span
              key={id}
              className={cn(styles['title-variant'], id === venue && styles['is-active'])}
              aria-hidden={id !== venue}
            >
              Your {VENUES[id].possessive}&apos;s soap situation
            </span>
          ))}
        </span>
      </h2>

      <div ref={frameRef} className={styles['frame']} style={{'--split': '0%'} as React.CSSProperties}>
        <img
          src={BeforeImage}
          alt="Before: one lonely pink pump bottle on a drab counter"
          width={2000}
          height={1111}
          loading="lazy"
          className={styles['img']}
        />
        <img
          src={AfterImage}
          alt="After: Isla Suds bars on a little wooden tray in warm light"
          width={2000}
          height={1111}
          loading="lazy"
          className={cn(styles['img'], styles['after'])}
        />
        <span className={cn(styles['tag'], styles['tag-before'])} aria-hidden="true">
          Before
        </span>
        <span className={cn(styles['tag'], styles['tag-after'])} aria-hidden="true">
          After
        </span>
        <span className={styles['divider']} aria-hidden="true" />
        <input
          ref={rangeRef}
          type="range"
          min={0}
          max={100}
          defaultValue={0}
          onInput={(e) => setSplit(Number(e.currentTarget.value))}
          aria-label="Compare before and after: drag to reveal the Isla Suds shelf"
          className={styles['range']}
        />
      </div>

      <div className={styles['pitch']}>
        <h3 className={styles['sticker']}>Add some suds to your shelves</h3>
        <p className={styles['body']}>
          Searching for a soap that stands out? Look no further. Isla Suds brings your customers goat milk and essential
          oils, with no added fragrance. It&apos;s time to upgrade your inventory with a brand people truly love.
        </p>
      </div>
    </section>
  );
}

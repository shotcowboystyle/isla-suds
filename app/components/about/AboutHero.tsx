import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import SplashPlate from '~/assets/images/menu-about-us.webp';
import {ABOUT_PAGE} from '~/content/about';
import {ENTER_EASE, MOTION_QUERY, SCRUB_SCENE} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './AboutHero.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

const {lead, stamp, trail} = ABOUT_PAGE.hero.titleParts;

export function AboutHero() {
  const heroRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const hero = heroRef.current;
      const sky = skyRef.current;
      const copy = copyRef.current;

      if (!hero || !sky || !copy) return;

      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        // Both plates move as one. Splitting their transforms is what turns
        // "foam in front of the words" back into "a rectangle over the words".
        const plates = GSAP.utils.toArray<HTMLElement>(`.${styles['plate']}`, hero);
        const lines = GSAP.utils.toArray<HTMLElement>(`.${styles['line']}`, hero);
        const stampBox = hero.querySelector(`.${styles['stamp']}`);

        const parallax = GSAP.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: SCRUB_SCENE,
            invalidateOnRefresh: true,
          },
        });

        parallax
          .to(sky, {yPercent: -6, ease: 'none'}, 0)
          .to(plates, {yPercent: -16, ease: 'none'}, 0)
          .to(copy, {yPercent: -34, ease: 'none'}, 0);

        // Entrance is time-based, not scrubbed: nothing has been scrolled yet.
        // The stamp wipes rather than scales so its type never squashes.
        const entrance = GSAP.timeline()
          .from(lines, {yPercent: 16, opacity: 0, duration: 1.1, ease: ENTER_EASE, stagger: 0.12})
          .from(
            stampBox,
            {clipPath: 'inset(0% 100% 0% 0%)', duration: 0.7, ease: 'circ.out'},
            '-=0.75',
          );

        return () => {
          parallax.scrollTrigger?.kill();
          parallax.kill();
          entrance.kill();
        };
      });

      return () => mm.revert();
    },
    {scope: heroRef},
  );

  return (
    <header ref={heroRef} className={styles['hero']}>
      <div ref={skyRef} className={styles['sky']} aria-hidden="true" />

      <div className={cn(styles['plate'], styles['plate-back'])} aria-hidden="true">
        <img src={SplashPlate} alt="" width={1408} height={768} decoding="async" />
      </div>

      {/* Outside `.copy` on purpose: it holds still while the headline travels. */}
      <p className={styles['eyebrow']}>{ABOUT_PAGE.hero.subtitle}</p>

      <div ref={copyRef} className={styles['copy']}>
        <h1 className={styles['title']}>
          <span className={styles['line']}>
            {lead} <span className={styles['stamp']}>{stamp}</span>,
          </span>
          <span className={cn(styles['line'], styles['line-trail'])}>{trail}</span>
        </h1>
      </div>

      {/* The bottom of the same splash, lifted in front of the headline. */}
      <div className={cn(styles['plate'], styles['plate-front'])} aria-hidden="true">
        <img src={SplashPlate} alt="" width={1408} height={768} decoding="async" />
      </div>

      <div className={styles['horizon']} aria-hidden="true" />
    </header>
  );
}

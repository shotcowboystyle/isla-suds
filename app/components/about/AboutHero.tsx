import {useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import Goat from '~/assets/images/about/goat.webp';
import KitchenMobile from '~/assets/images/about/kitchen-m.webp';
import Kitchen from '~/assets/images/about/kitchen.webp';
import Loaf from '~/assets/images/about/loaf.webp';
import Foam from '~/assets/images/home/hero-foam.webp';
import {ABOUT_PAGE} from '~/content/about';
import {usePreloader} from '~/contexts/preloader-context';
import {prefersReducedMotion} from '~/lib/motion';
import {useHeroLean, useHeroTravel} from '~/lib/motion/hero-planes';
import {CHAR_STAGGER, ENTER_EASE, MOTION_QUERY} from '~/lib/motion/tokens';
import styles from './AboutHero.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

const {hero} = ABOUT_PAGE;

/** The kitchen (loaf and goat ride with it, they live in it), the headline, the foam. */
const SCROLL_TRAVEL = {plate: 8, copy: -14, foam: -45};
const POINTER_LEAN = {plate: 6, copy: 12, foam: 30};

/**
 * Act 1: our kitchen. The headline sits between the room and the foam; once it
 * lands, a goat pops up in the window to see what's going on, and ducks back
 * down as you scroll away.
 */
export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const {preloaderComplete} = usePreloader();

  useHeroTravel(sectionRef, containerRef, SCROLL_TRAVEL);
  useHeroLean(sectionRef, POINTER_LEAN);

  // The goat ducks out of the window as the hero leaves.
  useGSAP(
    () => {
      const mm = GSAP.matchMedia();
      mm.add(MOTION_QUERY, () => {
        GSAP.to('[data-duck]', {
          yPercent: 105,
          ease: 'power2.in',
          scrollTrigger: {trigger: sectionRef.current, start: 'top top', end: '45% top', scrub: true},
        });
      });
      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  // Entrance, handed off from the preloader. The markup ships `data-hero-state="pending"`.
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title || !preloaderComplete) return;

    if (prefersReducedMotion()) {
      section.dataset.heroState = 'ready';
      return;
    }

    let cancelled = false;
    let ctx: gsap.Context | undefined;

    void document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = GSAP.context(() => {
        const split = SplitText.create('[data-line]', {type: 'words,chars', mask: 'chars', autoSplit: true});
        GSAP.timeline()
          .fromTo('[data-eyebrow]', {opacity: 0, y: 12}, {opacity: 1, y: 0, duration: 0.5, ease: ENTER_EASE}, 0)
          .fromTo(
            split.chars,
            {yPercent: 120},
            {yPercent: 0, duration: 0.8, stagger: CHAR_STAGGER, ease: ENTER_EASE},
            0.05,
          )
          .fromTo(
            '[data-stamp]',
            {clipPath: 'inset(0% 100% 0% 0%)'},
            {clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'circ.out'},
            0.45,
          )
          .fromTo('[data-loaf]', {y: -60, opacity: 0}, {y: 0, opacity: 1, duration: 0.7, ease: 'bounce.out'}, 0.3)
          // Then, a beat later, somebody is curious.
          .fromTo('[data-goat]', {yPercent: 105}, {yPercent: 0, duration: 0.55, ease: 'back.out(2.2)'}, 1.35)
          .to('[data-goat]', {
            keyframes: [
              {rotation: -9, duration: 0.18},
              {rotation: 7, duration: 0.2},
              {rotation: 0, duration: 0.35, ease: 'elastic.out(1, 0.4)'},
            ],
          });
        section.dataset.heroState = 'ready';
      }, section);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [preloaderComplete]);

  return (
    <header ref={sectionRef} data-hero-state="pending" className={styles['hero']}>
      <div ref={containerRef} className={styles['container']}>
        <div data-travel="plate" className={styles['plate-travel']} aria-hidden="true">
          <div data-lean="plate" className={styles['plate-box']}>
            <picture className={styles['plate']}>
              <source media="(max-width: 767px)" srcSet={KitchenMobile} width={1100} height={1530} />
              <img src={Kitchen} alt="" width={1920} height={1080} decoding="async" />
            </picture>

            {/* The window opening clips the goat, so the sill hides it until it pops up. */}
            <div className={styles['window']}>
              <div data-duck className={styles['duck']}>
                <img data-goat src={Goat} alt="" width={830} height={900} decoding="async" className={styles['goat']} />
              </div>
            </div>

            <img data-loaf src={Loaf} alt="" width={1100} height={784} decoding="async" className={styles['loaf']} />
          </div>
        </div>

        <div data-travel="copy" className={styles['copy']}>
          <div data-lean="copy" className={styles['copy-inner']}>
            <p data-eyebrow className={styles['eyebrow']}>
              {hero.eyebrow}
            </p>
            <h1 ref={titleRef} className={styles['title']}>
              <span data-line className={styles['line']}>
                {hero.lead}{' '}
                <span data-stamp className={styles['stamp']}>
                  {hero.stamp}
                </span>
              </span>{' '}
              <span data-line className={styles['line']}>
                {hero.trail}
              </span>
            </h1>
          </div>
        </div>

        <div data-travel="foam" className={styles['foam']} aria-hidden="true">
          <div data-lean="foam">
            <img src={Foam} alt="" width={2400} height={858} decoding="async" />
          </div>
        </div>
      </div>
    </header>
  );
}

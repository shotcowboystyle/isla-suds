import {useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import Logo from '~/assets/images/isla-suds-logo-stacked.svg';
import GoatTourist from '~/assets/images/stores/goat-tourist.webp';
import Palmetto from '~/assets/images/stores/palmetto.webp';
import PlateMobile from '~/assets/images/stores/plate-m.webp';
import Plate from '~/assets/images/stores/plate.webp';
import {LOCATIONS_PAGE, STORE_POSTCARDS} from '~/content/stores';
import {usePreloader} from '~/contexts/preloader-context';
import {prefersReducedMotion} from '~/lib/motion';
import {useHeroLean, useHeroTravel} from '~/lib/motion/hero-planes';
import {CHAR_STAGGER, ENTER_EASE} from '~/lib/motion/tokens';
import styles from './StoresHero.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

const {hero, stores} = LOCATIONS_PAGE;

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const count = STORE_POSTCARDS.length;
/** Real counts only: both lines are built from the store data. */
const SHELVES = `${NUMBER_WORDS[count] ?? count} shop${count === 1 ? '' : 's'} around Charleston.`;
const WHERE = `${stores
  .map((store) => `${store.name} (${store.locations.map((l) => l.city).join(' and ')})`)
  .join(', and ')}. Pick the closest and go sniff a bar.`;

/** Plate at the back, the headline, the goat tourist, palmettos in front. */
const SCROLL_TRAVEL = {plate: 8, copy: -14, goat: -6, palm: -30};
const POINTER_LEAN = {plate: 6, copy: 10, goat: 18, palm: 32};

/**
 * Act 1: the hero is the picture side of a giant postcard, dropped onto the
 * table. A goat on vacation holds up a card of his own: wish you were here.
 */
export function StoresHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {preloaderComplete} = usePreloader();

  useHeroTravel(sectionRef, containerRef, SCROLL_TRAVEL);
  useHeroLean(sectionRef, POINTER_LEAN);

  // Entrance, handed off from the preloader. The markup ships `data-hero-state="pending"`.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !preloaderComplete) return;

    if (prefersReducedMotion()) {
      section.dataset.heroState = 'ready';
      return;
    }

    let cancelled = false;
    let ctx: gsap.Context | undefined;

    void document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = GSAP.context(() => {
        const split = SplitText.create('[data-line]', {type: 'chars', mask: 'chars', autoSplit: true, aria: 'none'});
        GSAP.timeline()
          // The postcard lands on the table.
          .fromTo(
            '[data-card]',
            {y: 90, rotation: -7, opacity: 0},
            {y: 0, rotation: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.3)'},
            0,
          )
          .fromTo(
            split.chars,
            {yPercent: 120},
            {yPercent: 0, duration: 0.7, stagger: CHAR_STAGGER, ease: ENTER_EASE},
            0.35,
          )
          // The goat strolls in from the side, with a hop.
          .fromTo(
            '[data-goat]',
            {xPercent: 60, opacity: 0},
            {xPercent: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.6)'},
            0.7,
          )
          .to(
            '[data-goat]',
            {keyframes: {y: [0, -22, 0], rotation: [0, -4, 0]}, duration: 0.5, ease: 'power1.inOut'},
            1.45,
          )
          .fromTo(
            '[data-sticker]',
            {scale: 1.5, opacity: 0, rotation: -10},
            {scale: 1, opacity: 1, rotation: 0, duration: 0.55, ease: 'back.out(2.4)'},
            1.3,
          )
          .fromTo('[data-body]', {opacity: 0, y: 16}, {opacity: 1, y: 0, duration: 0.6, ease: ENTER_EASE}, 1.55)
          // Ends on the stamp's resting 6deg tilt (GSAP owns the transform from here).
          .fromTo(
            '[data-stamp]',
            {scale: 1.6, opacity: 0, rotation: 26},
            {scale: 1, opacity: 1, rotation: 6, duration: 0.5, ease: 'back.out(2)'},
            1.7,
          );
        section.dataset.heroState = 'ready';
      }, section);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [preloaderComplete]);

  return (
    <header ref={sectionRef} data-hero-state="pending" className={styles.hero}>
      <div data-card className={styles.card}>
        <div ref={containerRef} className={styles.container}>
          <div data-travel="plate" className={styles['plate-travel']} aria-hidden="true">
            <div data-lean="plate" className={styles.plate}>
              <picture>
                <source media="(max-width: 767px)" srcSet={PlateMobile} width={900} height={1620} />
                <img src={Plate} alt="" width={1600} height={900} decoding="async" />
              </picture>
            </div>
          </div>

          <div data-travel="copy" className={styles.copy}>
            <div data-lean="copy">
              <h1 className={styles.title}>
                {/* Screen readers get one clean copy; the split letters are visual only. */}
                <span className="sr-only">
                  {hero.srLead} {hero.lines.join(' ')}
                </span>
                {hero.lines.map((line) => (
                  <span key={line} data-line aria-hidden="true" className={styles.line}>
                    {line}
                  </span>
                ))}
              </h1>
              <p className={styles['sticker-tilt']}>
                <span data-sticker className={styles.sticker}>
                  {SHELVES}
                </span>
              </p>
              <p data-body className={styles.body}>
                {WHERE}
              </p>
            </div>
          </div>

          <div data-travel="goat" className={styles['goat-travel']} aria-hidden="true">
            <div data-lean="goat">
              <div data-goat className={styles.goat}>
                <img src={GoatTourist} alt="" width={900} height={1142} decoding="async" />
                {/* Written over the photo, never baked into it. */}
                <p className={styles['goat-card']}>{hero.goatCard}</p>
              </div>
            </div>
          </div>

          <div data-travel="palm" className={styles['palm-travel']} aria-hidden="true">
            <div data-lean="palm">
              <img src={Palmetto} alt="" width={800} height={549} decoding="async" className={styles.palm} />
            </div>
          </div>
        </div>

        <span data-stamp className={styles.stamp} aria-hidden="true">
          <img src={Logo} alt="" width={180} height={140} />
        </span>
      </div>
    </header>
  );
}

import {useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import Desk from '~/assets/images/contact/desk.webp';
import GoatPhone from '~/assets/images/contact/goat-phone.webp';
import WallMobile from '~/assets/images/contact/wall-m.webp';
import Wall from '~/assets/images/contact/wall.webp';
import {CONTACT_PAGE} from '~/content/contact';
import {usePreloader} from '~/contexts/preloader-context';
import {prefersReducedMotion} from '~/lib/motion';
import {useHeroLean, useHeroTravel} from '~/lib/motion/hero-planes';
import {CHAR_STAGGER, ENTER_EASE} from '~/lib/motion/tokens';
import styles from './ContactHero.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

const {hero} = CONTACT_PAGE;

/** Wall at the back, the headline, the goat, the desk and phone in front. */
const SCROLL_TRAVEL = {plate: 8, copy: -14, goat: -6, desk: -26};
const POINTER_LEAN = {plate: 6, copy: 10, goat: 16, desk: 28};

/** Two rings, then the goat's already got it. */
const RINGS = [0.45, 1.15];

/**
 * Act 1: the call. The phone on the desk rattles twice, "Ring ring." shakes
 * in, and the goat (headline tucked behind its ear) has the handset, grinning.
 */
export function ContactHero() {
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
        const split = SplitText.create('[data-lead]', {type: 'chars', mask: 'chars', autoSplit: true, aria: 'none'});
        const tl = GSAP.timeline();

        tl.fromTo(
          split.chars,
          {yPercent: 120},
          {yPercent: 0, duration: 0.7, stagger: CHAR_STAGGER, ease: ENTER_EASE},
          0,
        );

        RINGS.forEach((at, i) => {
          // The letters and the phone rattle together; a ring sticker pops off the phone.
          tl.to(
            split.chars,
            {
              keyframes: {rotation: [0, -9, 8, -6, 5, 0]},
              duration: 0.42,
              stagger: {each: 0.015, from: 'random'},
              ease: 'none',
            },
            at,
          )
            .to(
              '[data-desk]',
              {
                keyframes: {x: [0, -5, 5, -4, 4, 0], rotation: [0, -0.5, 0.5, -0.4, 0.3, 0]},
                duration: 0.42,
                ease: 'none',
              },
              at,
            )
            .fromTo(`[data-ring="${i}"]`, {scale: 0, opacity: 1}, {scale: 1, duration: 0.4, ease: 'back.out(3)'}, at)
            .to(`[data-ring="${i}"]`, {opacity: 0, y: -16, duration: 0.35, ease: 'power1.in'}, at + 0.75);
        });

        tl.fromTo(
          '[data-sticker]',
          {scale: 1.5, opacity: 0, rotation: -10},
          {scale: 1, opacity: 1, rotation: 0, duration: 0.55, ease: 'back.out(2.4)'},
          1.7,
        )
          .fromTo('[data-body]', {opacity: 0, y: 18}, {opacity: 1, y: 0, duration: 0.6, ease: ENTER_EASE}, 1.95)
          // The goat leans into the call.
          .to('[data-goat]', {keyframes: {rotation: [0, -4, 2, 0]}, duration: 0.9, ease: 'power1.inOut'}, 1.75);

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
      <div ref={containerRef} className={styles.container}>
        <div data-travel="plate" className={styles['plate-travel']} aria-hidden="true">
          <div data-lean="plate" className={styles.plate}>
            <picture>
              <source media="(max-width: 767px)" srcSet={WallMobile} width={1100} height={1956} />
              <img src={Wall} alt="" width={1920} height={1080} decoding="async" />
            </picture>
          </div>
        </div>

        <div data-travel="copy" className={styles.copy}>
          <div data-lean="copy">
            <h1 className={styles.title}>
              {/* Screen readers get one clean copy; the split, shaking letters are visual only. */}
              <span className="sr-only">
                {hero.srLead} {hero.lead}{' '}
              </span>
              <span data-lead aria-hidden="true" className={styles.lead}>
                {hero.lead}
              </span>{' '}
              <span className={styles['sticker-tilt']}>
                <span data-sticker className={styles.sticker}>
                  {hero.sticker}
                </span>
              </span>
            </h1>
            <p data-body className={styles.body}>
              {hero.body}
            </p>
          </div>
        </div>

        <div data-travel="goat" className={styles['goat-travel']} aria-hidden="true">
          <div data-lean="goat">
            <img data-goat src={GoatPhone} alt="" width={1000} height={1322} decoding="async" className={styles.goat} />
          </div>
        </div>

        <div data-travel="desk" className={styles['desk-travel']} aria-hidden="true">
          <div data-lean="desk" className={styles['desk-box']}>
            <img data-desk src={Desk} alt="" width={1600} height={766} decoding="async" className={styles.desk} />
            {RINGS.map((at, i) => (
              <span key={at} data-ring={i} className={styles.ring}>
                {hero.ring}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

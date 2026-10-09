import {useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {SplitText} from 'gsap/SplitText';
import {BAR_FACTS, type Scent} from '~/content/product-page';
import {usePreloader} from '~/contexts/preloader-context';
import {prefersReducedMotion} from '~/lib/motion';
import {useHeroLean, useHeroTravel} from '~/lib/motion/hero-planes';
import {CHAR_STAGGER, ENTER_EASE} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import {BuyControls} from './BuyControls';
import {Dock} from './Dock';
import styles from './Hero.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(SplitText, useGSAP);
}

/** Plate and dock travel together (the bar must stay over its ledge); botanicals fly past. */
const SCROLL_TRAVEL = {plate: 8, near: -45};
const POINTER_LEAN = {plate: 6, near: 30};

interface HeroProps {
  scent: Scent;
  title: string;
  price: string;
  selectedVariant: {id: string; availableForSale: boolean} | null | undefined;
}

export function Hero({scent, title, price, selectedVariant}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const {preloaderComplete} = usePreloader();

  useHeroTravel(sectionRef, containerRef, SCROLL_TRAVEL);
  useHeroLean(sectionRef, POINTER_LEAN);

  // Entrance, handed off from the preloader (same gate as the other heroes).
  useEffect(() => {
    const section = sectionRef.current;
    const name = nameRef.current;
    if (!section || !name || !preloaderComplete) return;
    if (prefersReducedMotion()) {
      section.dataset.heroState = 'ready';
      return;
    }
    let cancelled = false;
    let ctx: gsap.Context | undefined;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = GSAP.context(() => {
        // Words first, so a line can only break between words, never inside "Lemongrass".
        const split = SplitText.create(name, {type: 'words,chars', mask: 'chars', autoSplit: true, aria: 'none'});
        GSAP.timeline()
          .fromTo(split.chars, {yPercent: 120}, {yPercent: 0, duration: 0.8, stagger: CHAR_STAGGER, ease: ENTER_EASE})
          .fromTo(
            '[data-hero-rest]',
            {y: 20, opacity: 0},
            {y: 0, opacity: 1, duration: 0.6, ease: ENTER_EASE, stagger: 0.08},
            0.25,
          )
          .fromTo(
            '[data-hero-near]',
            {yPercent: 30, opacity: 0},
            {yPercent: 0, opacity: 1, duration: 1.1, ease: 'power3.out'},
            0,
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
    <section
      ref={sectionRef}
      data-hero-state="pending"
      className={styles['hero']}
      aria-labelledby="product-title"
      style={{'--scent': scent.color} as React.CSSProperties}
    >
      <div ref={containerRef} className={styles['container']}>
        <div data-travel="plate" className={styles['plate-travel']}>
          <div data-lean="plate" className={styles['plate-box']}>
            <picture className={styles['plate']}>
              <source media="(max-width: 767px)" srcSet={scent.heroMobile} width={1360} height={1520} />
              <img src={scent.hero} alt="" width={2400} height={1333} />
            </picture>
            <Dock id="hero" rot={-10} src={scent.bar} className={styles['dock']} />
          </div>
        </div>

        <div className={styles['copy']}>
          <h1 id="product-title" className={styles['title']}>
            {/* Spaces keep the three spans from fusing into one word in text extraction. */}
            <span className="sr-only">{scent.name}</span>{' '}
            <span ref={nameRef} aria-hidden="true" className={cn(styles['name'], scent.name.length >= 10 && styles['name-long'])}>
              {scent.name}
            </span>{' '}
            <span data-hero-rest className={styles['full-title']}>
              {title}
            </span>
          </h1>

          <p data-hero-rest className={styles['line']}>
            {scent.line}
          </p>

          <div data-hero-rest className={styles['buy']}>
            <p className={styles['price']}>
              <span className={styles['price-amount']}>{price}</span>
              <span className={styles['price-note']}>{BAR_FACTS.weight} bar</span>
            </p>
            <BuyControls selectedVariant={selectedVariant} />
          </div>
        </div>

        <div data-travel="near" className={styles['near']} aria-hidden="true">
          <div data-lean="near">
            <img data-hero-near src={scent.botanicals} alt="" width={1400} height={787} decoding="async" />
          </div>
        </div>
      </div>
    </section>
  );
}

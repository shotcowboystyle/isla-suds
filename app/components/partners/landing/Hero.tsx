import {useEffect, useRef, useState} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {SplitText} from 'gsap/SplitText';
import BarEucalyptus from '~/assets/images/home/bar-eucalyptus.webp';
import BarLavender from '~/assets/images/lavender-bar.webp';
import BarLemongrass from '~/assets/images/lemongrass-bar.webp';
import BarRosemary from '~/assets/images/rosemary-sea-salt-bar.webp';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {VENUES, VENUE_IDS, type VenueId} from '~/content/partners';
import {usePreloader} from '~/contexts/preloader-context';
import {prefersReducedMotion} from '~/lib/motion';
import {useHeroLean, useHeroTravel} from '~/lib/motion/hero-planes';
import {CHAR_STAGGER, ENTER_EASE} from '~/lib/motion/tokens';
import {preloadImage} from '~/lib/shopify/preload';
import {cn} from '~/utils/cn';
import styles from './Hero.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(SplitText, useGSAP);
}

/** Real bar photos, standing on the venue's counter, left to right. */
const COUNTER_BARS = [
  {src: BarRosemary, slot: 'rosemary', w: 827, h: 1193},
  {src: BarLavender, slot: 'lavender', w: 827, h: 1193},
  {src: BarLemongrass, slot: 'lemongrass', w: 827, h: 1193},
];

/** Plate + counter travel together (the bars must stay on the counter); the near bar flies. */
const SCROLL_TRAVEL = {plate: 8, near: -60};
const POINTER_LEAN = {plate: 6, near: 34};

const isMobilePlate = () => window.matchMedia('(max-width: 767px)').matches;
const plateFor = (id: VenueId) => (isMobilePlate() ? VENUES[id].plateMobile : VENUES[id].plate);

interface HeroProps {
  venue: VenueId;
  onChoose: (venue: VenueId) => void;
  onApply: () => void;
}

export function Hero({venue, onChoose, onApply}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stickerRef = useRef<HTMLSpanElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const switchId = useRef(0);
  const {preloaderComplete} = usePreloader();

  // Plates are only rendered once chosen, so venues nobody picks never download.
  const [visited, setVisited] = useState<VenueId[]>([venue]);
  const [front, setFront] = useState<VenueId>(venue);

  useHeroTravel(sectionRef, containerRef, SCROLL_TRAVEL);
  useHeroLean(sectionRef, POINTER_LEAN);

  const {contextSafe} = useGSAP({scope: sectionRef});

  // The bars hop: squash, jump, land, squash, wobble. `overwrite` lets a
  // chip-masher interrupt a hop mid-air without stacking tweens.
  const hop = contextSafe(() => {
    if (prefersReducedMotion()) return;
    GSAP.to('[data-hop]', {
      keyframes: [
        {scaleX: 1.12, scaleY: 0.86, duration: 0.08},
        {y: '-55%', scaleX: 0.93, scaleY: 1.1, duration: 0.3, ease: 'power2.out'},
        {y: 0, scaleX: 1, scaleY: 1, duration: 0.26, ease: 'power2.in'},
        {scaleX: 1.14, scaleY: 0.82, duration: 0.07},
        {scaleX: 1, scaleY: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)'},
      ],
      stagger: 0.06,
      overwrite: true,
    });
    GSAP.to('[data-shadow]', {
      keyframes: [
        {scale: 0.55, opacity: 0.35, duration: 0.38, ease: 'power2.out'},
        {scale: 1, opacity: 1, duration: 0.33, ease: 'power2.in'},
      ],
      stagger: 0.06,
      overwrite: true,
    });
  });

  const choose = (id: VenueId) => {
    if (id === venue) return;
    onChoose(id);
    if (!visited.includes(id)) setVisited((list) => [...list, id]);
    hop();

    const strip = stripRef.current;
    const chip = strip?.querySelector<HTMLElement>(`[data-chip="${id}"]`);
    if (strip && chip && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({left: chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth'});
    }
  };

  // Wipe the new venue in once its plate has decoded. The bars are already in
  // the air by then, so the room changes under them and they land in it.
  useEffect(() => {
    if (venue === front) return;
    const id = ++switchId.current;
    const plate = sectionRef.current?.querySelector<HTMLElement>(`[data-venue="${venue}"]`);
    const img = plate?.querySelector('img');
    if (!plate || !img) return;

    const reveal = () => {
      if (id !== switchId.current) return;
      if (prefersReducedMotion()) {
        setFront(venue);
        return;
      }
      GSAP.fromTo(
        plate,
        {clipPath: 'inset(0% 0% 0% 100%)'},
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete: () => {
            if (id === switchId.current) setFront(venue);
          },
        },
      );
    };

    img.decode().then(reveal, reveal);
  }, [venue, front]);

  // Once the preloader is gone, warm up the other rooms in the background.
  useEffect(() => {
    if (!preloaderComplete) return;
    const saveData = (navigator as Navigator & {connection?: {saveData?: boolean}}).connection?.saveData;
    if (saveData) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const handle = idle(() => VENUE_IDS.forEach((id) => preloadImage(plateFor(id), {fetchpriority: 'low'})));
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(handle);
  }, [preloaderComplete]);

  // Entrance, handed off from the preloader: the bars drop onto the counter,
  // the headline assembles. The markup ships `data-hero-state="pending"`.
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const sticker = stickerRef.current;
    if (!section || !title || !sticker || !preloaderComplete) return;

    if (prefersReducedMotion()) {
      section.dataset.heroState = 'ready';
      return;
    }

    let cancelled = false;
    let ctx: gsap.Context | undefined;

    void document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = GSAP.context(() => {
        const split = SplitText.create(title, {type: 'chars', mask: 'chars', autoSplit: true, aria: 'none'});
        const tl = GSAP.timeline();
        tl.fromTo(
          '[data-hop]',
          {y: '-160%', autoAlpha: 0},
          {y: 0, autoAlpha: 1, duration: 0.9, ease: 'bounce.out', stagger: 0.09},
        )
          .fromTo(
            '[data-shadow]',
            {scale: 0.3, opacity: 0},
            {scale: 1, opacity: 1, duration: 0.9, ease: 'bounce.out', stagger: 0.09},
            0,
          )
          .fromTo(
            split.chars,
            {yPercent: 120},
            {yPercent: 0, duration: 0.8, stagger: CHAR_STAGGER, ease: ENTER_EASE},
            0.1,
          )
          .fromTo(sticker, {opacity: 0, width: 0}, {opacity: 1, width: 'auto', duration: 0.5, ease: 'circ.out'}, 0.35)
          .fromTo(
            '[data-hero-rest]',
            {y: 20, opacity: 0},
            {y: 0, opacity: 1, duration: 0.6, ease: ENTER_EASE, stagger: 0.08},
            0.55,
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
      aria-labelledby="partners-hero-title"
    >
      <div ref={containerRef} className={styles['container']}>
        <div data-travel="plate" className={styles['plate-travel']} aria-hidden="true">
          <div data-lean="plate" className={styles['plate-box']}>
            {visited.map((id) => (
              <picture
                key={id}
                data-venue={id}
                className={styles['plate']}
                style={
                  id === front
                    ? {zIndex: 1}
                    : id === venue
                      ? {zIndex: 2, clipPath: 'inset(0% 0% 0% 100%)'}
                      : {zIndex: 0, visibility: 'hidden'}
                }
              >
                <source media="(max-width: 767px)" srcSet={VENUES[id].plateMobile} width={1360} height={1520} />
                <img src={VENUES[id].plate} alt="" width={2400} height={1333} decoding="async" />
              </picture>
            ))}

            <div
              className={styles['counter']}
              style={{'--counter': `${VENUES[venue].counter}%`} as React.CSSProperties}
            >
              {COUNTER_BARS.map((bar) => (
                <div key={bar.slot} className={cn(styles['bar'], styles[`bar-${bar.slot}`])}>
                  <span data-shadow className={styles['bar-shadow']} />
                  <div data-hop className={styles['bar-hop']}>
                    <img src={bar.src} alt="" width={bar.w} height={bar.h} decoding="async" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles['copy']}>
          <h1 id="partners-hero-title" className={styles['title']}>
            <span className="sr-only">Get started</span>
            <span ref={titleRef} aria-hidden="true" className={styles['title-line']}>
              Get started
            </span>
            <span ref={stickerRef} className={styles['sticker']}>
              <span className={styles['sticker-text']}>Selling Isla Suds</span>
            </span>
          </h1>

          <fieldset data-hero-rest className={styles['switcher']}>
            <legend className={styles['switcher-legend']}>Pick your shop</legend>
            <div ref={stripRef} className={styles['chips']}>
              {VENUE_IDS.map((id) => (
                <label
                  key={id}
                  data-chip={id}
                  className={styles['chip']}
                  onPointerEnter={() => preloadImage(plateFor(id))}
                >
                  <input
                    type="radio"
                    name="partners-venue"
                    value={id}
                    checked={venue === id}
                    onChange={() => choose(id)}
                    onFocus={() => preloadImage(plateFor(id))}
                    className={styles['chip-input']}
                  />
                  <span className={styles['chip-label']}>{VENUES[id].label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div data-hero-rest className={styles['lines']} aria-live="polite">
            {VENUE_IDS.map((id) => (
              <p
                key={id}
                className={cn(styles['line'], id === venue && styles['line-active'])}
                aria-hidden={id !== venue}
              >
                {VENUES[id].line}
              </p>
            ))}
          </div>

          <div data-hero-rest>
            <LiquidButton text="Apply today" onClick={onApply} backgroundColor="var(--color-accent)" />
          </div>
        </div>

        <div data-travel="near" className={styles['near']} aria-hidden="true">
          <div data-lean="near">
            <img src={BarEucalyptus} alt="" width={1100} height={875} decoding="async" />
          </div>
        </div>
      </div>
    </section>
  );
}

import {useRef} from 'react';
import {Link} from 'react-router';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import BoothOne from '~/assets/images/about/booth-one.webp';
import BoothTwo from '~/assets/images/about/booth-two.webp';
import ShopDisplay from '~/assets/images/about/shop-display.webp';
import {ABOUT_PAGE} from '~/content/about';
import {LOCATIONS_PAGE} from '~/content/stores';
import {DESKTOP_QUERY, MOTION_QUERY, SCRUB_SCENE} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './MarketTrack.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

const {market} = ABOUT_PAGE;
const FRAMES: Record<string, {src: string; width: number; height: number}> = {
  one: {src: BoothOne, width: 1600, height: 900},
  two: {src: BoothTwo, width: 1600, height: 900},
  shops: {src: ShopDisplay, width: 1600, height: 1200},
};
const STORES = LOCATIONS_PAGE.stores;

/**
 * Act 4: growing up, told sideways. One booth, two booths, the shops. On a
 * desktop the stage sticks and the wheel drives the track left; everywhere
 * else it is a native swipe strip.
 */
export function MarketTrack() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const mm = GSAP.matchMedia();

      mm.add(`${DESKTOP_QUERY} and ${MOTION_QUERY}`, () => {
        const travel = () => Math.max(0, track.scrollWidth - window.innerWidth);
        // The section is exactly as tall as the trip is long.
        const measure = () => section.style.setProperty('--travel', `${travel()}px`);
        section.dataset.panning = '';
        measure();
        ScrollTrigger.addEventListener('refreshInit', measure);

        GSAP.to(track, {
          x: () => -travel(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: SCRUB_SCENE,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', measure);
          delete section.dataset.panning;
          section.style.removeProperty('--travel');
        };
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section ref={sectionRef} className={styles['market']} aria-labelledby="market-title">
      <div className={styles['stage']}>
        <h2 id="market-title" className={styles['heading']}>
          {market.heading}
        </h2>

        <ol ref={trackRef} className={styles['track']}>
          {market.frames.map((frame) => {
            const image = FRAMES[frame.key];
            return (
              <li key={frame.key} className={cn(styles['frame'], styles[`frame-${frame.key}`])}>
                <figure className={styles['snapshot']}>
                  <img
                    src={image.src}
                    alt={frame.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                  />
                  {frame.key === 'one' ? <p className={styles['goat-sticker']}>{market.goatSticker}</p> : null}
                </figure>
                <p className={styles['line']}>{frame.line}</p>
              </li>
            );
          })}

          <li className={cn(styles['frame'], styles['frame-stores'])}>
            <p className={styles['stores-lead']}>
              {market.storesLead} {STORES.map((store) => store.name).join(' and ')}.
            </p>
            <div className={styles['logos']}>
              {STORES.map((store) => (
                <img
                  key={store.name}
                  src={store.logo}
                  alt={store.name}
                  width={store.logoSize?.width}
                  height={store.logoSize?.height}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <Link to={market.link.href} prefetch="intent" className={styles['link']}>
              {market.link.label}
            </Link>
          </li>
        </ol>
      </div>
    </section>
  );
}

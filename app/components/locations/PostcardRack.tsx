import {useCallback, useRef, useState, type CSSProperties} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {LOCATIONS_PAGE, STORE_POSTCARDS} from '~/content/stores';
import {useIsDesktop} from '~/hooks/use-is-desktop';
import {MOTION_QUERY, REVEAL_START} from '~/lib/motion/tokens';
import {getLenis} from '~/lib/scroll';
import {LocationsMap} from './LocationsMap';
import {Postcard} from './Postcard';
import styles from './PostcardRack.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

const {rack} = LOCATIONS_PAGE;

/** Stamp colour per retailer, so the two Odd Ducks match and Sewee stands apart. */
const STAMP_BG: Record<string, string> = {
  'Odd Duck Market': 'var(--color-accent-secondary)',
  'Sewee Outpost': '#9fd8d5',
};

const directionsUrl = (lat: number, lng: number) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/**
 * Act 2: one postcard per shop, its logo as the stamp. The map rides along
 * (sticky), and the goat on it hops to whichever postcard you're reading.
 */
export function PostcardRack() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const {isDesktop, isLoading} = useIsDesktop();

  useGSAP(
    () => {
      const cards = GSAP.utils.toArray<HTMLElement>('[data-postcard]');

      // The postcard crossing the middle of the screen is the one the goat drives to.
      cards.forEach((card, i) =>
        ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          end: 'bottom 40%',
          onToggle: (self) => self.isActive && setActive(i),
        }),
      );

      const mm = GSAP.matchMedia();
      mm.add(MOTION_QUERY, () => {
        cards.forEach((card) => {
          GSAP.fromTo(
            card,
            {y: 70, rotation: -5, opacity: 0},
            {
              y: 0,
              rotation: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'back.out(1.5)',
              scrollTrigger: {trigger: card, start: REVEAL_START, toggleActions: 'play none none reverse'},
            },
          );
        });
      });
      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  // A pin on the map was picked: bring its postcard to the middle of the screen.
  const pick = useCallback((index: number) => {
    const card = document.getElementById(STORE_POSTCARDS[index].id);
    if (!card) return;
    setActive(index);
    const lenis = getLenis();
    if (lenis) {
      void lenis.scrollTo(card, {offset: -window.innerHeight * 0.2});
    } else {
      card.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  }, []);

  return (
    <section ref={sectionRef} className={styles.rack} aria-labelledby="rack-heading">
      <div className={styles.head}>
        <h2 id="rack-heading" className={styles['heading-tilt']}>
          <span className={styles.heading}>{rack.heading}</span>
        </h2>
        <p className={styles['aside-tilt']}>
          <span className={styles.aside}>{rack.aside}</span>
        </p>
      </div>

      <div className={styles.layout}>
        <ol className={styles.cards}>
          {STORE_POSTCARDS.map((stop, i) => (
            <li
              key={stop.id}
              id={stop.id}
              className={styles.slot}
              style={{'--tilt': `${i % 2 ? 1.4 : -1.4}deg`} as CSSProperties}
            >
              <div data-postcard>
                <Postcard
                  note={stop.note}
                  heading={
                    <>
                      {stop.storeName}
                      <span>{stop.city}</span>
                    </>
                  }
                  stamp={{
                    src: stop.logo ?? '',
                    width: stop.logoSize?.width,
                    height: stop.logoSize?.height,
                    background: STAMP_BG[stop.storeName] ?? 'var(--color-accent-secondary)',
                  }}
                  postmark={{ring: `${stop.city} · ${stop.state}`, centre: stop.hours?.split(' ').pop()}}
                  picture={{
                    src: stop.postcard,
                    greetings: rack.greetings,
                    town: stop.city,
                    flip: rack.flip,
                    flipBack: rack.flipBack,
                  }}
                  actions={
                    <>
                      <a href={directionsUrl(stop.lat, stop.lng)} target="_blank" rel="noopener noreferrer">
                        {rack.directions}
                        <span className="sr-only">
                          {' '}
                          to {stop.storeName}, {stop.city} (opens in a new tab)
                        </span>
                      </a>
                      {stop.phone && (
                        <a href={telHref(stop.phone)}>
                          {rack.call}
                          <span className="sr-only">
                            {' '}
                            {stop.storeName}, {stop.city}
                          </span>
                        </a>
                      )}
                      {stop.website && (
                        <a href={stop.website} target="_blank" rel="noopener noreferrer">
                          {rack.website}
                          <span className="sr-only"> ({stop.storeName}, opens in a new tab)</span>
                        </a>
                      )}
                    </>
                  }
                >
                  <p>{stop.address}</p>
                  <p>
                    {stop.city}, {stop.state} {stop.zip}
                  </p>
                  {stop.hours && (
                    <p>
                      <span className={styles.label}>{rack.open}</span> {stop.hours}
                    </p>
                  )}
                  {stop.phone && <p>{stop.phone}</p>}
                </Postcard>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles['map-col']}>
          {!isLoading && (
            <LocationsMap
              key={String(isDesktop)}
              stops={STORE_POSTCARDS}
              active={active}
              onPick={pick}
              interactive={isDesktop}
              label={rack.mapLabel}
            />
          )}
        </div>
      </div>
    </section>
  );
}

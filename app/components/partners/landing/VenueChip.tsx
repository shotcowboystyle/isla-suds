import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {VENUES, VENUE_IDS, type VenueId} from '~/content/partners';
import styles from './VenueChip.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

interface VenueChipProps {
  venue: VenueId;
  onChoose: (venue: VenueId) => void;
}

/**
 * The page's navigation: once the hero has scrolled away, a small sticker in
 * the corner keeps the chosen shop on screen and lets the visitor change it
 * without scrolling back up. Hidden again over the application.
 */
export function VenueChip({venue, onChoose}: VenueChipProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = rootRef.current;
    const hero = document.querySelector('[aria-labelledby="partners-hero-title"]');
    if (!root || !hero) return;

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: 'bottom 60%',
      endTrigger: '#apply',
      end: 'top bottom',
      onToggle: (self) => root.toggleAttribute('data-visible', self.isActive),
    });

    return () => trigger.kill();
  });

  return (
    <div ref={rootRef} className={styles['chip']}>
      <label htmlFor="venue-chip" className={styles['label']}>
        Your shop
      </label>
      <select
        id="venue-chip"
        value={venue}
        onChange={(e) => onChoose(e.target.value as VenueId)}
        className={styles['select']}
      >
        {VENUE_IDS.map((id) => (
          <option key={id} value={id}>
            {VENUES[id].label}
          </option>
        ))}
      </select>
    </div>
  );
}

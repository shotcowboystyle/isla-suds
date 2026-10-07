import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {BuyControls} from './BuyControls';
import styles from './StickyBuy.module.css';
import type {Scent} from '~/content/product-page';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

interface StickyBuyProps {
  scent: Scent;
  price: string;
  selectedVariant: {id: string; availableForSale: boolean} | null | undefined;
}

/** Buying never needs a scroll back up: a sticker-pill once the hero has gone, hidden over the buy box. */
export function StickyBuy({scent, price, selectedVariant}: StickyBuyProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = ref.current;
    const hero = document.querySelector('[aria-labelledby="product-title"]');
    if (!root || !hero) return;
    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: 'bottom 40%',
      endTrigger: '#buy',
      end: 'top bottom',
      onToggle: (self) => root.toggleAttribute('data-visible', self.isActive),
    });
    return () => trigger.kill();
  });

  return (
    <div ref={ref} className={styles['pill']}>
      <p className={styles['name']}>
        {scent.name} <span className={styles['price']}>{price}</span>
      </p>
      <BuyControls selectedVariant={selectedVariant} className={styles['controls']} />
    </div>
  );
}

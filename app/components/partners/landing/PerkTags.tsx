import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {PERKS} from '~/content/partners';
import {MOTION_QUERY} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './PerkTags.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * The perks, as price tags on a string. Scrolling swings them (harder the
 * faster you go), brushing one with the pointer flicks it, and they settle
 * back like pendulums when you stop.
 */
export function PerkTags({onApply}: {onApply: () => void}) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        const tags = Array.from(section.querySelectorAll<HTMLElement>('[data-tag]'));
        const swings = tags.map((el, i) => ({
          to: GSAP.quickTo(el, 'rotation', {duration: 1.2, ease: 'elastic.out(1, 0.3)'}),
          k: (i % 2 ? -1 : 1) * GSAP.utils.random(0.7, 1.3),
        }));
        const settle = GSAP.delayedCall(0.14, () => {
          swings.forEach((s) => {
            s.to(0);
          });
        }).pause();

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const deg = GSAP.utils.clamp(-14, 14, self.getVelocity() / -220);
            swings.forEach((s) => {
              s.to(deg * s.k);
            });
            settle.restart(true);
          },
        });

        const flicks = tags.map((el, i) => {
          const onMove = (e: PointerEvent) => {
            swings[i].to(GSAP.utils.clamp(-16, 16, e.movementX * 0.9));
            settle.restart(true);
          };
          el.addEventListener('pointermove', onMove);
          return () => el.removeEventListener('pointermove', onMove);
        });

        return () => {
          trigger.kill();
          settle.kill();
          flicks.forEach((off) => off());
        };
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section ref={sectionRef} className={styles['section']} aria-labelledby="perks-title">
      <h2 id="perks-title" className={styles['title']}>
        Suds slinger perks
      </h2>

      <div className={styles['string']} aria-hidden="true" />

      <ul className={styles['tags']}>
        {PERKS.map((perk, index) => (
          <li key={perk.title} className={styles['hanger']}>
            <div data-tag className={cn(styles['tag'], styles[`tone-${index % 3}`])}>
              <h3 className={styles['tag-title']}>{perk.title}</h3>
              {perk.price && (
                <p className={styles['tag-price']}>
                  <del aria-label={`Retail $${perk.price.sell}`}>${perk.price.sell}</del>
                  <ins aria-label={`You pay $${perk.price.pay}`}>${perk.price.pay}</ins>
                </p>
              )}
              <p className={styles['tag-body']}>{perk.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles['cta']}>
        <LiquidButton text="Apply today" onClick={onApply} backgroundColor="var(--color-accent)" />
      </div>
    </section>
  );
}

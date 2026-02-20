import {forwardRef, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {cn} from '~/utils/cn';
import styles from './PerksSection.module.css';

if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export function PerksSection() {
  const perks = [
    {
      number: '01',
      title: 'JOIN THE TEAM',
      description:
        'Become part of a growing network of retailers who prioritize quality and sustainability. We support our partners with marketing materials and dedicated service.',
    },
    {
      number: '02',
      title: 'CONNECT WITH FANS',
      description:
        'Isla Suds customers are loyal and enthusiastic. Bring them into your store by offering their favorite products locally.',
    },
    {
      number: '03',
      title: 'SHARE AND SHINE',
      description:
        'We love to shout out our partners on social media. Let us help drive traffic to your location and grow together.',
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !titleRef.current) {
        return;
      }

      const titleSplit = SplitText.create(titleRef.current, {type: 'chars'});

      const tl = gsap.timeline({
        delay: 2,
      });

      tl.to(containerRef.current, {
        opacity: 1,
        y: 0,
        ease: 'power1.inOut',
      }).from(
        titleSplit.chars,
        {
          yPercent: 200,
          stagger: 0.02,
          ease: 'power2.out',
        },
        '-=0.5',
      );
    },
    {dependencies: [containerRef, titleRef]},
  );

  return (
    <section ref={containerRef} className={cn(styles['statement-section'])}>
      <div className={cn(styles['heading-text-wrapper'])}>
        <h2 ref={titleRef} className={cn(styles['heading-text'])}>
          Suds Slinger Perks
        </h2>
        {/* Decorative images flanking the text would go here, absolute positioned */}
      </div>

      <div className={styles['brand-core-cards']}>
        {perks.map((perk, index) => (
          <div key={index} className={cn(styles['brand-core-card'], styles[`card-${index + 1}`])}>
            <div className={styles['title-wrapper']}>
              <div className={styles['title-number']}>{perk.number}</div>
              <h3 className={styles['title-text']}>{perk.title}</h3>
            </div>
            <p className={styles['paragraph']}>{perk.description}</p>
          </div>
        ))}
      </div>

      <div className={styles['button-wrapper']}>
        <LiquidButton href="/wholesale/register" text="APPLY TODAY" className="mt-16" backgroundColor="#D99E5C" />
      </div>
    </section>
  );
}

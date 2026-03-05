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
      id: 1,
      number: '01',
      title: 'JOIN THE TEAM',
      description: (
        <>
          Become part of a growing network of retailers who prioritize quality and sustainability.
          <br />
          We support our partners with marketing materials and dedicated service.
        </>
      ),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 2,
      number: '02',
      title: 'CONNECT WITH FANS',
      description: (
        <>
          Isla Suds customers are loyal and enthusiastic. Bring them into your store by offering their favorite products
          locally.
        </>
      ),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      id: 3,
      number: '03',
      title: 'SHARE AND SHINE',
      description: (
        <>
          We love to shout out our partners on social media. Let us help drive traffic to your location and grow
          together.
        </>
      ),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
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
          <div key={perk.id} className={cn(styles['brand-core-card'], styles[`card-${index + 1}`])}>
            <div className={styles['title-wrapper']}>
              <div className={styles['title-number']}>{perk.number}</div>
              <h3 className={styles['title-text']}>{perk.title}</h3>
            </div>
            <div className={styles['icon-wrapper']}>{perk.icon}</div>
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

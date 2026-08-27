import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import DripImage from '~/assets/images/slider-dip.png';
import {VideoCard} from '~/components/VideoCard';
import {testimonialsData} from '~/content/testimonials';
import {DESKTOP_QUERY, MOTION_QUERY, PIN_PRIORITY, SCRUB_PIN} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './Testimonials.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

export const TestimonialsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const text3Ref = useRef<HTMLHeadingElement>(null);

  // Card stack and heading drift share one pinned timeline.
  //
  // They used to be two triggers on the same element, one of them pinning. The
  // pin inserts a pin-spacer, which moves the positions the other trigger had
  // already measured — so the headings drifted against a scroll span that no
  // longer matched the pin. One timeline, one scroll space, no conflict.
  useGSAP(
    () => {
      const container = scrollContainerRef.current;
      const cards = cardsContainerRef.current;
      const text1 = text1Ref.current;
      const text2 = text2Ref.current;
      const text3 = text3Ref.current;

      if (!container || !cards || !text1 || !text2 || !text3) {
        return;
      }

      const mm = GSAP.matchMedia();

      mm.add({isDesktop: DESKTOP_QUERY, allowMotion: MOTION_QUERY}, (context) => {
        const {isDesktop, allowMotion} = context.conditions as {isDesktop: boolean; allowMotion: boolean};
        if (!allowMotion) return;

        const cardElements = GSAP.utils.toArray<HTMLElement>(cards.querySelectorAll('.animated-video-card'));

        const sceneTl = GSAP.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '+=200%',
            scrub: SCRUB_PIN,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: PIN_PRIORITY.testimonials,
          },
        });

        // Headings drift apart across the whole pinned span.
        sceneTl
          .to(text1, {xPercent: 70, ease: 'none', duration: 1}, 0)
          .to(text2, {xPercent: 25, ease: 'none', duration: 1}, 0)
          .to(text3, {xPercent: -50, ease: 'none', duration: 1}, 0);

        // Cards settle into the stack one after another.
        const cardDuration = 0.5;
        const spacing = 0.3;

        cardElements.forEach((card, index) => {
          const translation = testimonialsData[index]?.translation;
          if (!translation) return;

          sceneTl.to(
            card,
            {
              yPercent: translation.y,
              ...(isDesktop && {xPercent: translation.x}),
              duration: cardDuration,
              ease: 'power4.inOut',
            },
            index * spacing,
          );
        });
      });

      return () => mm.revert();
    },
    {scope: scrollContainerRef},
  );

  return (
    <div ref={scrollContainerRef} className={styles['testimonials-section']}>
      <div className={styles['testimonials-section-wrapper']}>
        <div ref={cardsContainerRef} className={styles['social-sticky-wrapper']}>
          {testimonialsData.map((testimonial, index) => (
            <VideoCard
              key={testimonial.name}
              // cardData={{...testimonial, translation: testimonial.translation ?? null}}
              cardData={testimonial}
              index={index}
            />
          ))}
        </div>

        <div className={styles['social-text-wrapper']}>
          <h1 ref={text1Ref} className={styles['social-heading']}>
            What&apos;s
          </h1>

          <h1 ref={text2Ref} className={cn(styles['social-heading'], styles['social-heading-2'])}>
            everyone
          </h1>

          <h1 ref={text3Ref} className={cn(styles['social-heading'], styles['social-heading-3'])}>
            Saying
          </h1>
        </div>
      </div>

      <div className={styles['drip-background-image-wrapper']}>
        <img
          src={DripImage}
          loading="lazy"
          alt=""
          width={1920}
          height={292}
          className={styles['drip-background-image']}
        />
      </div>
    </div>
  );
};

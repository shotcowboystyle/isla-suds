import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {useIsMobile} from '~/hooks/use-is-mobile';
import styles from './Testimonials.module.css';
import DripImage from '../../assets/images/slider-dip.png?responsive';
import {testimonialsData} from '../../content/testimonials';
import {cn} from '../../utils/cn';
import {Picture} from '../Picture';
import {LiquidButton} from '../ui/LiquidButton';
import {VideoCard} from '../VideoCard';

export const TestimonialsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const {isMobile, isLoading} = useIsMobile();

  useGSAP(
    () => {
      if (~isLoading) {
        gsap.set(scrollContainerRef.current, {
          marginTop: isMobile ? '0' : '-140vh',
        });
        const headingTl = gsap.timeline({
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: 'top bottom',
            end: '200% top',
            scrub: true,
          },
        });

        headingTl
          .to('#testimonials-text-1', {
            xPercent: 70,
          })
          .to(
            '#testimonials-text-2',
            {
              xPercent: 25,
            },
            '<',
          )
          .to(
            '#testimonials-text-3',
            {
              xPercent: -50,
            },
            '<',
          );

        const cardsTl = gsap.timeline({
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: '10% top',
            end: '200% top',
            scrub: 1.5,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        cardsTl.from('.animated-video-card', {
          yPercent: 150,
          stagger: 0.2,
          ease: 'power1.inOut',
        });
      }
    },
    {dependencies: [isMobile, isLoading], revertOnUpdate: true},
  );

  return (
    <div ref={scrollContainerRef} className={styles['testimonials-section']}>
      <div className={styles['testimonials-section-wrapper']}>
        <div ref={cardsContainerRef} className={styles['social-sticky-wrapper']}>
          {testimonialsData.map((testimonial, index) => (
            <VideoCard
              key={testimonial.name}
              cardData={{...testimonial, translation: testimonial.translation ?? null}}
              index={index}
            />
          ))}
        </div>

        <div className={styles['social-text-wrapper']}>
          <h1 id="testimonials-text-1" className={styles['social-heading-1']}>
            What’s
          </h1>

          <h1 id="testimonials-text-2" className={cn(styles['social-heading-2'], 'text-light-brown')}>
            everyone
          </h1>

          <h1 id="testimonials-text-3" className={styles['social-heading-2']}>
            Saying
          </h1>
        </div>
      </div>

      <LiquidButton text="Explore All" href="/collections/all" />

      <div className={styles['drip-background-image-wrapper']}>
        <Picture src={DripImage} loading="lazy" alt="" className={styles['drip-background-image']} />
      </div>
    </div>
  );
};

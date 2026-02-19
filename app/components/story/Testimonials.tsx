import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import DripImage from '~/assets/images/slider-dip.png?responsive';
import {Picture} from '~/components/Picture';
import {VideoCard} from '~/components/VideoCard';
import {testimonialsData} from '~/content/testimonials';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {cn} from '~/utils/cn';
import styles from './Testimonials.module.css';

export const TestimonialsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const text3Ref = useRef<HTMLHeadingElement>(null);

  const {isMobile, isLoading} = useIsMobile();

  useGSAP(
    () => {
      if (isLoading || !scrollContainerRef.current || !text1Ref.current || !text2Ref.current || !text3Ref.current) {
        return;
      }

      gsap.set(scrollContainerRef.current, {
        // marginTop: isMobile ? '0' : '-140vh',
        marginTop: 0,
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
        .to(text1Ref.current, {
          xPercent: 70,
        })
        .to(
          text2Ref.current,
          {
            xPercent: 25,
          },
          '<',
        )
        .to(
          text3Ref.current,
          {
            xPercent: -50,
          },
          '<',
        );
    },
    {dependencies: [scrollContainerRef, text1Ref, text2Ref, text3Ref, isMobile, isLoading]},
  );

  useGSAP(
    () => {
      if (isLoading || !scrollContainerRef.current) {
        return;
      }

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

      // Animate each card sequentially with duration and spacing
      const cardDuration = 0.5; // Duration for each card animation
      const spacing = 0.3; // Gap between each card animation start

      testimonialsData.forEach((testimonial, index) => {
        cardsTl.to(
          `.animated-video-card:nth-child(${index + 1})`,
          {
            yPercent: testimonial.translation.y,
            ...(!isMobile && {xPercent: testimonial.translation.x}),
            // stagger: 0.2,
            duration: cardDuration,
            ease: 'power4.inOut',
          },
          index * spacing,
        );
      });
      // cardsTl.from('.animated-video-card', {
      //   yPercent: 150,
      //   stagger: 0.2,
      //   duration: 0.5,
      //   ease: 'power4.inOut',
      // });
    },
    {dependencies: [scrollContainerRef, isLoading, isMobile]},
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
          <h1 ref={text1Ref} className={styles['social-heading-1']}>
            What&apos;s
          </h1>

          <h1 ref={text2Ref} className={cn(styles['social-heading-2'])}>
            everyone
          </h1>

          <h1 ref={text3Ref} className={styles['social-heading-3']}>
            Saying
          </h1>
        </div>
      </div>

      <div className={styles['drip-background-image-wrapper']}>
        <Picture src={DripImage} loading="lazy" alt="" className={styles['drip-background-image']} />
      </div>
    </div>
  );
};

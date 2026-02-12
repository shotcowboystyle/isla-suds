import {forwardRef, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {SplitText} from 'gsap/all';
import HeroMobileBackgroundImage from '~/assets/images/hero-mobile-2.png?responsive';
import HeroVideoThumbnail from '~/assets/images/hero-video-thumbnail.png?responsive';
import HeroVideo from '~/assets/video/soap-bar-blast.mp4';
import {Picture} from '~/components/Picture';
import styles from '~/components/story/HeroSection.module.css';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {HERO_CONTENT, HERO_TAGLINE_START, HERO_TAGLINE_END} from '~/content/story';
import {cn} from '~/utils/cn';

interface HeroSectionProps {
  className?: string;
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(function HeroSection({className}, ref) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Ensure the video freezes at the final frame
  const handleVideoEnd = () => {
    const vid = videoRef.current;
    if (!vid) {
      return;
    }

    vid.pause();
    vid.currentTime = vid.duration;
  };

  useGSAP(
    () => {
      const titleSplit = SplitText.create('#hero-text-1', {type: 'chars'});

      const tl = gsap.timeline({
        delay: 2,
      });

      tl.to('#hero-section', {
        opacity: 1,
        y: 0,
        ease: 'power1.inOut',
      })
        .from(
          '#hero-clipped-box',
          {
            opacity: 0,
            duration: 1,
            width: 0,
            ease: 'circ.out',
          },
          '-=0.5',
        )
        .from(
          titleSplit.chars,
          {
            yPercent: 200,
            stagger: 0.02,
            ease: 'power2.out',
          },
          '-=0.5',
        )
        .from(
          '#hero-paragraph',
          {
            y: 20,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.3',
        )
        .from(
          '#hero-button',
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4',
        );

      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      heroTl.to('#hero-section', {
        rotate: 7,
        scale: 0.9,
        yPercent: 30,
        ease: 'power1.inOut',
      });
    },
    {dependencies: [], revertOnUpdate: true},
  );

  return (
    <section
      ref={ref}
      data-testid="hero-section"
      className={cn(styles['hero-section'], 'snap-start', className)}
      aria-label="Hero section"
    >
      <div id="hero-section" className={styles['hero-section-container']}>
        <div className={styles['hero-section-content']}>
          <div className={styles['letter-animation']}>
            <h1 id="hero-text-1" className={styles['hero-text']}>
              {HERO_TAGLINE_START}
            </h1>
          </div>

          <div id="hero-clipped-box" className={styles['clipped-box']}>
            <h1 className={styles['heading-1']}>{HERO_TAGLINE_END}</h1>
          </div>

          <p id="hero-paragraph" className={styles['paragraph']}>
            {HERO_CONTENT}
          </p>

          <LiquidButton id="hero-button" href="/products" text="Shop Now" />
        </div>

        <Picture src={HeroMobileBackgroundImage} loading="eager" fetchPriority="high" alt="" className={styles['hero-mobile']} />

        <div id="home-hero-video" className={styles['home-hero-video-wrapper']}>
          <video
            ref={videoRef}
            src={HeroVideo}
            playsInline={true}
            muted={true}
            autoPlay={true}
            preload="auto"
            onEnded={handleVideoEnd}
            poster={HeroVideoThumbnail as unknown as string}
            className="size-full object-cover"
          />
        </div>
      </div>
    </section>
  );
});

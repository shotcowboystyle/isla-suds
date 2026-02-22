import {forwardRef, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
if (typeof document !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}
import HeroMobileBackgroundImage from '~/assets/images/hero-mobile-2.png?responsive';
import HeroVideoThumbnailUrl from '~/assets/images/hero-video-thumbnail.png';
import HeroVideo from '~/assets/video/soap-bar-blast.mp4';
import {Picture} from '~/components/Picture';
import styles from '~/components/story/HeroSection.module.css';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {HERO_CONTENT, HERO_TAGLINE_START, HERO_TAGLINE_END} from '~/content/story';
import {usePreloader} from '~/contexts/preloader-context';
import {cn} from '~/utils/cn';

interface HeroSectionProps {
  className?: string;
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(function HeroSection({className}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const clippedBox1Ref = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const {preloaderComplete} = usePreloader();

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
      if (!containerRef.current || !text1Ref.current || !clippedBox1Ref.current || !preloaderComplete) {
        return;
      }

      const titleSplit = SplitText.create(text1Ref.current, {type: 'chars'});

      const tl = gsap.timeline({
        delay: 2,
      });

      tl.to(containerRef.current, {
        opacity: 1,
        y: 0,
        ease: 'power1.inOut',
      })
        .from(
          clippedBox1Ref.current,
          {
            opacity: 0,
            duration: 0.5,
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
          paragraphRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.3',
        )
        .from(
          buttonRef.current,
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
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      heroTl.to(containerRef.current, {
        rotate: 7,
        scale: 0.9,
        yPercent: 30,
        ease: 'power1.inOut',
      });
    },
    {dependencies: [containerRef, text1Ref, clippedBox1Ref, paragraphRef, buttonRef, preloaderComplete]},
  );

  return (
    <section
      ref={ref}
      data-testid="hero-section"
      // className={cn(styles['hero-section'], 'snap-start', className)}
      className={cn(styles['hero-section'], className)}
      aria-label="Hero section"
    >
      <div ref={containerRef} className={styles['hero-section-container']}>
        <div className={styles['hero-section-content']}>
          <div className={styles['letter-animation']}>
            <h1 ref={text1Ref} className={styles['hero-text']}>
              {HERO_TAGLINE_START}
            </h1>
          </div>

          <div ref={clippedBox1Ref} className={styles['clipped-text-box']}>
            <h1 className={styles['clipped-text']}>{HERO_TAGLINE_END}</h1>
          </div>

          <p ref={paragraphRef} className={styles['paragraph']}>
            {HERO_CONTENT}
          </p>

          <div className="flex items-center justify-center mt-12">
            <LiquidButton ref={buttonRef} href="/collections/frontpage" text="Shop Now" />
          </div>
        </div>

        <Picture
          src={HeroMobileBackgroundImage}
          loading="eager"
          fetchpriority="high"
          alt=""
          className="hero-image-mobile"
        />

        <div id="home-hero-video" className="hero-video-wrapper">
          <video
            ref={videoRef}
            src={HeroVideo}
            playsInline={true}
            muted={true}
            autoPlay={true}
            preload="none"
            onEnded={handleVideoEnd}
            poster={HeroVideoThumbnailUrl}
            width={1920}
            height={1080}
            className="size-full object-cover"
          />
        </div>
      </div>
    </section>
  );
});

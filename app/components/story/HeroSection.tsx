import {forwardRef, useRef, useEffect} from 'react';
import HeroMobileBackgroundImage from '~/assets/images/hero-mobile-2.webp';
import HeroVideoThumbnailUrl from '~/assets/images/hero-video-thumbnail.webp';
import HeroVideo from '~/assets/video/soap-bar-blast.mp4';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {HERO_CONTENT, HERO_TAGLINE_START, HERO_TAGLINE_END} from '~/content/story';
import {usePreloader} from '~/contexts/preloader-context';
import {cn} from '~/utils/cn';
import styles from './HeroSection.module.css';

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
  };

  // Lazy-load GSAP for scroll parallax — keeps GSAP out of the critical bundle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let ctx: {revert(): void} | undefined;

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{default: gsap}, {ScrollTrigger}]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            })
            .to(container, {
              rotate: 7,
              scale: 0.9,
              yPercent: 30,
              ease: 'power1.inOut',
            });
        });
      },
    );

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  // Lazy-load GSAP for entrance animations (waits for preloader)
  useEffect(() => {
    const text1 = text1Ref.current;
    const clippedBox1 = clippedBox1Ref.current;
    const paragraph = paragraphRef.current;
    const button = buttonRef.current;
    const video = videoRef.current;
    if (!text1 || !clippedBox1 || !preloaderComplete || !video) return;

    let cancelled = false;
    let ctx: {revert(): void} | undefined;

    void Promise.all([import('gsap'), import('gsap/SplitText')]).then(([{default: gsap}, {SplitText}]) => {
      if (cancelled) return;
      gsap.registerPlugin(SplitText);

      video.play().catch(() => {
        // Safe to continue: autoplay may be blocked by browser policy
      });

      ctx = gsap.context(() => {
        const titleSplit = SplitText.create(text1, {type: 'chars'});

        gsap
          .timeline()
          .from(clippedBox1, {
            opacity: 0,
            duration: 0.5,
            width: 0,
            ease: 'circ.out',
          })
          .from(titleSplit.chars, {
            yPercent: 200,
            stagger: 0.02,
            ease: 'power2.out',
          })
          .from(paragraph, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
          })
          .from(button, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out',
          });
      });
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [preloaderComplete]);

  return (
    <section
      ref={ref}
      data-testid="hero-section"
      className={cn(styles['hero-section'], 'snap-start', className)}
      aria-label="Hero section"
    >
      <div ref={containerRef} className={styles['hero-section-container']}>
        <div className={styles['hero-section-content']}>
          <div className={styles['letter-animation']}>
            <h1 ref={text1Ref} className={cn(styles['hero-text'], 'split-text')}>
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

        {/* eslint-disable react/no-unknown-property */}
        <img
          src={HeroMobileBackgroundImage}
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
          alt=""
          width={1296}
          height={928}
          className="hero-image-mobile"
        />
        {/* eslint-enable react/no-unknown-property */}

        <div id="home-hero-video" className="hero-video-wrapper">
          <video
            ref={videoRef}
            src={HeroVideo}
            autoPlay={false}
            playsInline={true}
            muted={true}
            // preload="none"
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

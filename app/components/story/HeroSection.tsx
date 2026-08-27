import {useRef, useEffect} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import HeroMobileBackgroundImage from '~/assets/images/hero-mobile-2.webp';
import HeroVideoThumbnailUrl from '~/assets/images/hero-video-thumbnail.webp';
import HeroVideo from '~/assets/video/soap-bar-blast.mp4';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {HERO_CONTENT, HERO_TAGLINE_START, HERO_TAGLINE_END} from '~/content/story';
import {usePreloader} from '~/contexts/preloader-context';
import {prefersReducedMotion} from '~/lib/motion';
import {CHAR_STAGGER, ENTER_EASE, MOTION_QUERY, SCRUB_SCENE} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './HeroSection.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({className}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
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

  // Scroll parallax — the hero recedes as the story begins.
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        GSAP.to(container, {
          rotate: 4,
          scale: 0.94,
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom top',
            scrub: SCRUB_SCENE,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  // Entrance choreography, handed off from the preloader.
  //
  // The markup ships as `data-hero-state="pending"`, which hides the animated
  // copy in CSS. Nothing paints in its final position, so there is no flash of
  // finished text before the timeline takes over. The attribute only flips to
  // "ready" once the start states are set.
  useEffect(() => {
    const section = sectionRef.current;
    const text1 = text1Ref.current;
    const clippedBox1 = clippedBox1Ref.current;
    const paragraph = paragraphRef.current;
    const button = buttonRef.current;
    const video = videoRef.current;
    if (!section || !text1 || !clippedBox1 || !paragraph || !button || !preloaderComplete) return;

    if (prefersReducedMotion()) {
      section.dataset.heroState = 'ready';
      return;
    }

    let cancelled = false;
    let ctx: gsap.Context | undefined;

    // Splitting before the webfont resolves measures fallback glyphs, which
    // leaves every char box in the wrong place once Antonio swaps in.
    void document.fonts.ready.then(() => {
      if (cancelled) return;

      video?.play().catch(() => {
        // Safe to continue: autoplay may be blocked by browser policy
      });

      ctx = GSAP.context(() => {
        const titleSplit = SplitText.create(text1, {
          type: 'chars',
          mask: 'chars',
          autoSplit: true,
        });

        const tl = GSAP.timeline({paused: true});

        tl.fromTo(
          clippedBox1,
          {opacity: 0, width: 0},
          {opacity: 1, width: 'auto', duration: 0.5, ease: 'circ.out'},
        )
          .fromTo(
            titleSplit.chars,
            {yPercent: 120},
            {yPercent: 0, duration: 0.8, stagger: CHAR_STAGGER, ease: ENTER_EASE},
          )
          .fromTo(paragraph, {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.6, ease: ENTER_EASE})
          .fromTo(button, {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.6, ease: ENTER_EASE});

        // Start states are committed — safe to reveal, then play.
        section.dataset.heroState = 'ready';
        tl.play();
      }, section);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [preloaderComplete]);

  return (
    <section
      ref={sectionRef}
      data-testid="hero-section"
      data-hero-state="pending"
      className={cn(styles['hero-section'], className)}
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

          <div ref={buttonRef} className={cn(styles['cta'], 'flex items-center justify-center mt-12')}>
            <LiquidButton href="/collections/frontpage" text="Shop Now" />
          </div>
        </div>

        {/* Mobile hero — display:none from 992px up. `loading="lazy"` keeps
            desktop from downloading an image it never paints; on mobile the
            element is in the viewport so it still fetches during initial load,
            and the preloader covers the page for long enough that the slightly
            lower priority is never visible. */}
        <img
          src={HeroMobileBackgroundImage}
          loading="lazy"
          decoding="async"
          alt=""
          width={1296}
          height={928}
          className="hero-image-mobile"
        />

        <div id="home-hero-video" className="hero-video-wrapper">
          {/* The poster carries the hero until the preloader hands off and
              .play() runs, so there is nothing to gain from preloading. */}
          <video
            ref={videoRef}
            src={HeroVideo}
            autoPlay={false}
            playsInline={true}
            muted={true}
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
}

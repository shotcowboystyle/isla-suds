import {useEffect, useRef, useState} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {cn} from '~/utils/cn';
import {LogoStackedBubbles} from './LogoStackedBubbles';
import styles from './Preloader.module.css';

interface PreloaderProps {
  initialDelay?: number;
  minDisplayTime?: number;
  onComplete?: () => void;
}

export function Preloader({initialDelay = 0, minDisplayTime = 2500, onComplete}: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Check if window is already loaded
    if (document.readyState === 'complete') {
      setIsPageLoaded(true);
    } else {
      const handleLoad = () => setIsPageLoaded(true);
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Resume timeline when page is loaded
  useEffect(() => {
    if (isPageLoaded && timelineRef.current) {
      timelineRef.current.play();
    }
  }, [isPageLoaded]);

  useGSAP(
    () => {
      // 1. Responsive Scaling
      const handleResize = () => {
        if (!containerRef.current) return;
        const windowWidth = window.innerWidth;
        const baseWidth = 300; // Visual width of the hand
        const targetWidth = windowWidth * 0.75; // Reduced width (was 0.9)
        const maxScale = 10; // Allow it to scale up significantly on desktop

        let scale = targetWidth / baseWidth;
        scale = Math.min(scale, maxScale);

        gsap.set(containerRef.current, {scale});
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      // 2. Main Timeline
      const tl = gsap.timeline({
        paused: false, // Start playing immediately
        onComplete: () => {
          // We do NOT hide it here yet, because the exit animation is part of the timeline
          // Actually, the exit animation is at the end of the timeline
        },
      });

      timelineRef.current = tl;

      // Ensure initial state prevents FOUC
      tl.set(containerRef.current, {yPercent: 100, autoAlpha: 1});
      tl.set('.logo-wrapper', {y: 100, autoAlpha: 0});

      // 2. Bathtub Entrance (The hand slides up)
      tl.to(containerRef.current, {
        yPercent: 0, // Fully viewable at bottom
        duration: 1, // Slower to allow elastic bounce to be visible
        ease: 'elastic.out(1, 0.5)',
        delay: initialDelay / 1000,
      });

      // 3. Logo Float Up (animate wrapper)
      tl.to(
        '.logo-wrapper',
        {
          y: -55, // Float up, but stay connected visually
          startAt: {y: 20},
          autoAlpha: 1,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)',
        },
        '-=0.5',
      );

      // Add a pause to the timeline to wait for content to load
      tl.add(() => {
        // We check the ref here to be safe, though closure capture of 'isPageLoaded' might be stale?
        // Actually, if we use the state 'isPageLoaded', it matches the initial render closure.
        // We can check the DOM readyState or use a ref.
        if (document.readyState !== 'complete') {
          tl.pause();
        }
      });

      // 5. Exit Animation - Quick Fade Out
      tl.to(
        containerRef.current,
        {
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power1.out',
          // Ensure we respect minDisplayTime from the START of the timeline
          // minDisplayTime includes the entrance animation + wait time
          // If we want the preloader to show for AT LEAST minDisplayTime:
          // We can just add a delay here relative to the start time (0)
        },
        `>${Math.max(0, minDisplayTime / 1000 - 2.2)}`,
      ); // Approx duration of previous animations is ~2.2s

      tl.call(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      });

      // 3. Bubbles Animation
      const bubbles = gsap.utils.toArray<HTMLElement>('.bubble');
      bubbles.forEach((bubble) => {
        const delay = gsap.utils.random(0, 2);
        const duration = gsap.utils.random(1.5, 3);
        const repeatDelay = gsap.utils.random(0.5, 1.5);

        gsap.to(bubble, {
          y: -100 - gsap.utils.random(0, 100),
          opacity: 0,
          scale: 1.5,
          duration, // Shorthand
          repeat: -1,
          repeatDelay, // Shorthand
          delay, // Shorthand
          ease: 'power1.out',
          startAt: {y: 0, opacity: 1, scale: 0.5},
        });

        gsap.to(bubble, {
          x: '+=20',
          duration: gsap.utils.random(0.5, 1),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      return () => {
        window.removeEventListener('resize', handleResize);
        tl.kill();
      };
    },
    {scope: containerRef},
  );

  if (!isVisible) return null;

  return (
    <div className={styles.app} style={{position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#292934'}}>
      <div className={styles.outerContainer}>
        <div ref={containerRef} className={styles.container} style={{opacity: 0}}>
          <div className={cn(styles.logoWrapper, 'logo-wrapper')} style={{opacity: 0}}>
            <LogoStackedBubbles className={styles.logo} />
            <div className={cn(styles.logoFoam, styles.lf1)}></div>
            <div className={cn(styles.logoFoam, styles.lf2)}></div>
            <div className={cn(styles.logoFoam, styles.lf3)}></div>
          </div>
          <div className={cn(styles.deco, styles.d1)}></div>
          <div className={cn(styles.deco, styles.d2)}></div>
          <div className={cn(styles.deco, styles.d3)}></div>
          <div className={cn(styles.deco, styles.d4)}></div>
          <div className={cn(styles.deco, styles.d5)}></div>
          <div className={cn(styles.deco, styles.d6)}></div>
          <div className={cn(styles.deco, styles.d7)}></div>
          <div className={cn(styles.deco, styles.d8)}></div>
          <div className={cn(styles.deco, styles.d9)}></div>
          <div className={cn(styles.deco, styles.d10)}></div>
          <div className={styles['bathtub-body']}>
            <div className={styles['bathtub-hand']}>
              <div className={cn(styles.foam, styles.f1)}></div>
              <div className={cn(styles.foam, styles.f2)}></div>
              <div className={cn(styles.foam, styles.f5)}></div>
              <div className={cn(styles.foam, styles.f6)}></div>
              <div className={cn(styles.foam, styles.f7)}></div>
              <div className={cn(styles.foam, styles.f8)}></div>
              <div className={cn(styles.foam, styles.f9)}></div>
              <div className={cn(styles.foam, styles.f10)}></div>
            </div>
            <div className={cn(styles.foam, styles.f3)}></div>
            <div className={cn(styles.foam, styles.f4)}></div>
            <div className={cn(styles['bathtub-body-s'])}></div>
            <div className={cn(styles['bathtub-foot'])}></div>
            <div className={cn(styles['bathtub-foot-right'])}></div>
            <div className={cn(styles['bathtub-shadow'])}></div>
            <div className={cn(styles['bathtub-shadow-small'])}></div>
            <div className={cn(styles['bathtub-shadow-foot'])}></div>
            <div className={cn(styles['bathtub-shadow-foot-right'])}></div>
          </div>
          {/* Bubbles - Using class 'bubble' for targeting */}
          <div className={cn(styles.bubble, styles['bubble-left'], styles.bubble1, 'bubble')}></div>
          <div className={cn(styles.bubble, styles['bubble-left'], styles.bubble2, 'bubble')}></div>
          <div className={cn(styles.bubble, styles['bubble-left'], styles.bubble3, 'bubble')}></div>
          <div className={cn(styles.bubble, styles['bubble-right'], styles.bubble4, 'bubble')}></div>
          <div className={cn(styles.bubble, styles['bubble-right'], styles.bubble5, 'bubble')}></div>
          <div className={cn(styles.bubble, styles['bubble-right'], styles.bubble6, 'bubble')}></div>
          <div className={cn(styles.bubble, styles['bubble-right'], styles.bubble7, 'bubble')}></div>
          <div className={cn(styles.bubble, styles['bubble-right'], styles.bubble8, 'bubble')}></div>
          <div className={cn(styles.bubble, styles['bubble-right'], styles.bubble9, 'bubble')}></div>
        </div>
      </div>
    </div>
  );
}

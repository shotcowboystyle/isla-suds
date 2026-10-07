import {useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {MOTION_QUERY} from '~/lib/motion/tokens';
import {Dock} from './Dock';
import styles from './Lather.module.css';
import type {Scent} from '~/content/product-page';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

/** Share of the scene spent in the dark before the water runs, and holding the goat at the end. */
const SILENCE = 0.12;
const HOLD = 0.18;

/**
 * The peak. The traveling bar lands under the tap and hands off to the clip's
 * own bar; scrolling scrubs the clip, so the visitor runs the water: lather
 * builds and keeps building until it is a goat.
 */
export function Lather({scent}: {scent: Scent}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch the clip only as the scene approaches; it is the heaviest thing here.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        video.preload = 'auto';
        video.load();
        // A muted play-then-pause primes the decoder so seeking works on iOS.
        video.addEventListener(
          'loadeddata',
          () => {
            void video
              .play()
              .then(() => video.pause())
              .catch(() => {
                // Safe to continue: scrubbing still seeks; autoplay may just be refused.
              });
          },
          {once: true},
        );
        observer.disconnect();
      },
      {rootMargin: '150% 0px'},
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [scent]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section || !video) return;
      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        let target = 0;
        let current = 0;

        // Ease the playhead toward the scroll position instead of jumping, and
        // only seek when it actually moved: seeking is the expensive part.
        const tick = () => {
          if (!video.duration) return;
          current += (target - current) * 0.2;
          if (Math.abs(video.currentTime - current) > 0.02) video.currentTime = current;
        };
        GSAP.ticker.add(tick);

        GSAP.timeline({
          defaults: {ease: 'none'},
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.4,
            onUpdate: (self) => {
              const p = GSAP.utils.clamp(0, 1, (self.progress - SILENCE) / (1 - SILENCE - HOLD));
              target = p * (video.duration || 0);
            },
          },
        })
          // Authored silence: only the bar under the tap, in the dark.
          .to({}, {duration: SILENCE * 0.6})
          .to('[data-lather-dark]', {opacity: 0, duration: SILENCE * 0.4})
          .fromTo('[data-lather-copy]', {opacity: 0, y: 30}, {opacity: 1, y: 0, duration: 0.08}, '<')
          .to({}, {duration: 1 - SILENCE - HOLD - 0.08})
          .fromTo(
            '[data-lather-punch]',
            {opacity: 0, scale: 1.8, rotation: -12},
            {opacity: 1, scale: 1, rotation: -3, duration: 0.06, ease: 'back.out(2.2)'},
          )
          .to({}, {duration: HOLD - 0.06});

        return () => GSAP.ticker.remove(tick);
      });

      return () => mm.revert();
    },
    {scope: sectionRef, dependencies: [scent]},
  );

  return (
    <section ref={sectionRef} className={styles['scene']} aria-labelledby="lather-title">
      <div className={styles['stage']}>
        <div className={styles['frame']}>
          <video ref={videoRef} muted playsInline preload="none" poster={scent.tapPoster} className={styles['video']}>
            <source src={scent.latherMobile} media="(max-width: 767px)" type="video/mp4" />
            <source src={scent.lather} type="video/mp4" />
          </video>
          <img src={scent.goatPoster} alt="" width={1920} height={1066} loading="lazy" className={styles['still']} />
          <Dock id="tap" className={styles['dock']} />
        </div>

        <div data-lather-dark className={styles['dark']} aria-hidden="true" />

        <div data-lather-copy className={styles['copy']}>
          <h2 id="lather-title" className={styles['title']}>
            The lather test
          </h2>
          <p className={styles['line']}>Goat milk makes a rich, creamy lather. Sometimes it makes a goat.</p>
        </div>

        <p data-lather-punch className={styles['punch']}>
          Goat not included. Lather is.
        </p>
      </div>
    </section>
  );
}

import {useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import DoorImage from '~/assets/images/partners/door.webp';
import GoatFullPoster from '~/assets/images/partners/goat-full-poster.webp';
import GoatPoster from '~/assets/images/partners/goat-poster.webp';
import GoatFull from '~/assets/video/goat-full.mp4';
import GoatLoopMobile from '~/assets/video/goat-loop-m.mp4';
import GoatLoop from '~/assets/video/goat-loop.mp4';
import {VENUES, VENUE_IDS, type VenueId} from '~/content/partners';
import {prefersReducedMotion} from '~/lib/motion';
import {MOTION_QUERY} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './GoatDelivery.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * The peak. A dark shopfront with only the CLOSED sign lit (authored silence),
 * then the lights come on, the sign flips, the doors part, and a goat in a
 * delivery cap is standing there with a wagon full of soap.
 *
 * The stage is `position: sticky` inside a tall section rather than a GSAP pin:
 * <main> uses `overflow-x: clip`, so sticky works, and there is no pin spacer
 * for later triggers to measure around.
 */
export function GoatDelivery({venue}: {venue: VenueId}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fullRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion()) {
      // No autoplay under reduced motion; the visitor can press play.
      video.controls = true;
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            // Safe to continue: autoplay may be blocked by browser policy; the poster stays.
          });
        } else {
          video.pause();
        }
      },
      {threshold: 0.2},
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        GSAP.timeline({
          defaults: {ease: 'none'},
          scrollTrigger: {trigger: section, start: 'top top', end: 'bottom bottom', scrub: 0.6},
        })
          // Authored silence: only the sign is lit.
          .to({}, {duration: 0.12})
          .to('[data-goat-lights]', {opacity: 0, duration: 0.1, ease: 'power1.in'})
          .to('[data-goat-sign-inner]', {rotationY: 180, duration: 0.1, ease: 'back.out(2)'}, '<0.02')
          .addLabel('open', '+=0.04')
          .to('[data-door="left"]', {xPercent: -50, duration: 0.32, ease: 'power2.inOut'}, 'open')
          .to('[data-door="right"]', {xPercent: 50, duration: 0.32, ease: 'power2.inOut'}, 'open')
          .to('[data-goat-sign]', {yPercent: -180, duration: 0.22, ease: 'power2.in'}, 'open+=0.06')
          .fromTo('[data-goat-video]', {scale: 1.12}, {scale: 1, duration: 0.32, ease: 'power2.out'}, 'open')
          .fromTo(
            '[data-goat-sticker]',
            {opacity: 0, scale: 1.8, rotation: (i) => (i ? 12 : -12)},
            {opacity: 1, scale: 1, rotation: 0, duration: 0.1, ease: 'back.out(2.2)', stagger: 0.04},
          )
          // Hold the full frame so the joke gets read.
          .to({}, {duration: 0.2});
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  const openFullCut = () => {
    dialogRef.current?.showModal();
    void fullRef.current?.play().catch(() => {
      // Safe to continue: the native controls are there to press play.
    });
  };

  return (
    <section ref={sectionRef} className={styles['scene']} aria-labelledby="goat-title">
      <div className={styles['stage']}>
        <video
          ref={videoRef}
          data-goat-video
          muted
          loop
          playsInline
          preload="none"
          poster={GoatPoster}
          width={1920}
          height={1066}
          className={styles['video']}
        >
          <source src={GoatLoopMobile} media="(max-width: 767px)" type="video/mp4" />
          <source src={GoatLoop} type="video/mp4" />
        </video>

        <h2 id="goat-title" className="sr-only">
          Delivery day: a goat in a cap brings the order in a little wagon
        </h2>

        <p data-goat-sticker className={styles['order']}>
          <span className={styles['order-label']}>Order for</span>
          <span className={styles['order-stack']}>
            {VENUE_IDS.map((id) => (
              <span
                key={id}
                className={cn(styles['order-variant'], id === venue && styles['is-active'])}
                aria-hidden={id !== venue}
              >
                Your {VENUES[id].possessive}
              </span>
            ))}
          </span>
        </p>

        <p data-goat-sticker className={styles['punchline']}>
          Delivery by goat not guaranteed.
        </p>

        <button type="button" onClick={openFullCut} className={styles['watch']} aria-haspopup="dialog">
          Watch the full delivery
        </button>

        <div className={styles['doors']} aria-hidden="true">
          <div data-door="left" className={cn(styles['door'], styles['door-left'])}>
            <img src={DoorImage} alt="" width={2400} height={1333} loading="lazy" decoding="async" />
          </div>
          <div data-door="right" className={cn(styles['door'], styles['door-right'])}>
            <img src={DoorImage} alt="" width={2400} height={1333} loading="lazy" decoding="async" />
          </div>
        </div>
        <div data-goat-lights className={styles['lights']} aria-hidden="true" />

        <div data-goat-sign className={styles['sign']} aria-hidden="true">
          <span className={styles['sign-string']} />
          <span data-goat-sign-inner className={styles['sign-inner']}>
            <span className={cn(styles['sign-face'], styles['sign-closed'])}>Closed</span>
            <span className={cn(styles['sign-face'], styles['sign-open'])}>Open</span>
          </span>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className={styles['full-cut']}
        aria-label="The full goat delivery"
        onClose={() => fullRef.current?.pause()}
      >
        <video
          ref={fullRef}
          src={GoatFull}
          poster={GoatFullPoster}
          controls
          muted
          playsInline
          preload="none"
          width={1280}
          height={710}
          className={styles['full-cut-video']}
        />
        <button type="button" onClick={() => dialogRef.current?.close()} className={styles['full-cut-close']}>
          Close
        </button>
      </dialog>
    </section>
  );
}

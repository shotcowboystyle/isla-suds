import {useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import PinVideoPoster from '~/assets/images/pin-video-poster.webp';
import LightboxButtonImage from '~/assets/images/play.svg';
import PlayIcon from '~/assets/images/polygon-3.svg';
import PinVideo from '~/assets/video/pin-video.mp4';
import {DESKTOP_QUERY, MOTION_QUERY, PIN_PRIORITY, SCRUB_PIN} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './VideoSection.module.css';

GSAP.registerPlugin(ScrollTrigger, useGSAP);

export const VideoSection = () => {
  const stickyCircleWrapper = useRef<HTMLDivElement>(null);
  const stickyCircleElement = useRef<HTMLDivElement>(null);
  const stickyCircleVideoWrapper = useRef<HTMLDivElement>(null);
  const cursorElement = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  // Only the breakpoint's visible video ever intersects, so the hidden one
  // never plays and — with preload="none" — never downloads.
  useEffect(() => {
    const videos = [desktopVideoRef.current, mobileVideoRef.current].filter(Boolean) as HTMLVideoElement[];
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            void video.play().catch(() => {
              // Safe to continue: autoplay may be blocked by browser policy
            });
          } else {
            video.pause();
          }
        });
      },
      {threshold: 0.25},
    );
    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, []);

  // Pinned scene: the circle opens out to full frame as the section holds.
  useGSAP(
    () => {
      const wrapper = stickyCircleWrapper.current;
      const circle = stickyCircleElement.current;
      const videoWrapper = stickyCircleVideoWrapper.current;

      if (!wrapper || !circle || !videoWrapper) {
        return;
      }

      const mm = GSAP.matchMedia();

      mm.add(`${DESKTOP_QUERY} and ${MOTION_QUERY}`, () => {
        GSAP.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: '+=300%',
            scrub: SCRUB_PIN,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: PIN_PRIORITY.videoSection,
          },
        })
          .to(circle, {clipPath: 'circle(100% at 50% 50%)', ease: 'none'}, 'sameTime')
          .to(videoWrapper, {scale: 1, ease: 'none'}, 'sameTime');
      });

      return () => mm.revert();
    },
    {scope: stickyCircleWrapper},
  );

  return (
    <div ref={stickyCircleWrapper}>
      {/* CSS handles mobile/desktop visibility via .effect-wrapper media queries.
         Always render to avoid layout shift from JS hydration toggle. */}
      <div className={styles['effect-wrapper']} data-speed="auto">
        <div className={styles['effect-wrapper-inner']}>
          <div className={styles['cursor-wrapper']}>
            <div ref={cursorElement} className={styles['cursor']}>
              <div
                ref={stickyCircleElement}
                style={{clipPath: 'circle(6% at 50% 50%)'}}
                className={styles['cursor-image']}
              >
                <button className={styles['lightbox-link']} aria-label="open lightbox" aria-haspopup="dialog">
                  <div className={styles['chug-club-lightbox-button']}>
                    <img
                      src={LightboxButtonImage}
                      loading="lazy"
                      alt=""
                      width={151}
                      height={151}
                      className={cn(styles['lightbox-button-image'], 'spin-circle')}
                    />

                    <div className={styles['lightbox-static-image-wrapper']}>
                      <img
                        src={PlayIcon}
                        loading="lazy"
                        alt=""
                        width={25}
                        height={28}
                        className={styles['lightbox-static-image']}
                      />
                    </div>
                  </div>
                </button>

                <div ref={stickyCircleVideoWrapper} className={cn(styles['background-video-wrapper'], 'size-full')}>
                  <video
                    ref={desktopVideoRef}
                    playsInline
                    muted
                    loop
                    preload="none"
                    poster={PinVideoPoster}
                    src={PinVideo}
                    width={1920}
                    height={1080}
                    data-object-fit="cover"
                    className="absolute object-cover size-full -inset-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={cn(styles['cursor-image'], styles['cursor-image-mobile'])}>
        <button className={styles['lightbox-link']} aria-label="open lightbox" aria-haspopup="dialog">
          <div className={styles['chug-club-lightbox-button']}>
            <img
              src={LightboxButtonImage}
              loading="lazy"
              alt=""
              width={151}
              height={151}
              className={styles['lightbox-button-image']}
            />
            <div className={styles['lightbox-static-image-wrapper']}>
              <img
                src={PlayIcon}
                loading="lazy"
                alt=""
                width={25}
                height={28}
                className={styles['lightbox-static-image']}
              />
            </div>
          </div>
        </button>

        <div className={cn(styles['background-video-wrapper'], 'size-full')}>
          <video
            ref={mobileVideoRef}
            loop
            muted
            playsInline
            preload="none"
            poster={PinVideoPoster}
            data-object-fit="cover"
            src={PinVideo}
            width={1920}
            height={1080}
            className="absolute inset-0 object-cover size-full"
          />
        </div>
      </div>
    </div>
  );
};

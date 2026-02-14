import {useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {useIsMobile} from '~/hooks/use-is-mobile';
import styles from './VideoSection.module.css';
import PinVideoPoster from '../../assets/images/pin-video-poster.webp';
import LightboxButtonImage from '../../assets/images/play.svg';
import PlayIcon from '../../assets/images/polygon-3.svg';
import PinVideo from '../../assets/video/pin-video.mp4';
import {cn} from '../../utils/cn';

export const VideoSection = () => {
  const {isMobile, isLoading} = useIsMobile();

  const stickyCircleWrapper = useRef<HTMLDivElement>(null);
  const stickyCircleElement = useRef<HTMLDivElement>(null);
  const cursorElement = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = isMobile ? mobileVideoRef.current : desktopVideoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play();
        } else {
          videoEl.pause();
        }
      },
      {threshold: 0.25},
    );
    observer.observe(videoEl);
    return () => observer.disconnect();
  }, [isMobile, isLoading]);

  useGSAP(
    () => {
      if (
        isLoading ||
        isMobile ||
        !stickyCircleWrapper.current ||
        !stickyCircleElement.current ||
        !cursorElement.current
      ) {
        return;
      }

      const videoTl = gsap.timeline({
        scrollTrigger: {
          trigger: stickyCircleWrapper.current,
          start: 'top top',
          end: '100% top',
          scrub: 1,
          // pin: stickyCircleElement.current,
          pin: true,
        },
      });

      videoTl.to(stickyCircleElement.current, {
        duration: 0.5,
        clipPath: 'circle(100% at 50% 50%)',
      });
      // .to(cursorElement.current, {
      //   duration: 0.5,
      //   width: '150vw',
      //   height: '150vw',
      // })
    },
    {dependencies: [stickyCircleWrapper, stickyCircleElement, cursorElement, isLoading, isMobile]},
  );

  return (
    <div>
      {!isLoading && !isMobile && (
        <div className={styles['effect-wrapper']} data-speed="auto">
          <div className={styles['effect-wrapper-inner']}>
            <div ref={stickyCircleWrapper} className={styles['cursor-wrapper']}>
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
                        className={cn(styles['lightbox-button-image'], 'spin-circle')}
                      />

                      <div className={styles['lightbox-static-image-wrapper']}>
                        <img src={PlayIcon} loading="lazy" alt="" className={styles['lightbox-static-image']} />
                      </div>
                    </div>
                  </button>

                  <div className={cn(styles['background-video-wrapper'], 'size-full')}>
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
          <div className="spacer"></div>
        </div>
      )}

      {!isLoading && isMobile && (
        <div className={cn(styles['cursor-image'], styles['cursor-image-mobile'])}>
          <button className={styles['lightbox-link']} aria-label="open lightbox" aria-haspopup="dialog">
            <div className={styles['chug-club-lightbox-button']}>
              <img src={LightboxButtonImage} loading="lazy" alt="" className={styles['lightbox-button-image']} />
              <div className={styles['lightbox-static-image-wrapper']}>
                <img src={PlayIcon} loading="lazy" alt="" className={styles['lightbox-static-image']} />
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
      )}
    </div>
  );
};

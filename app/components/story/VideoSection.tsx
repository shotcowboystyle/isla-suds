import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {useIsMobile} from '~/hooks/use-is-mobile';
import styles from './VideoSection.module.css';
import LightboxButtonImage from '../../assets/images/play.svg';
import PlayIcon from '../../assets/images/polygon-3.svg';
import PinVideo from '../../assets/video/pin-video.mp4';
import {cn} from '../../utils/cn';

export const VideoSection = () => {
  const {isMobile, isLoading} = useIsMobile();
  const stickyCircleWrapper = useRef<HTMLDivElement | null>(null);
  const stickyCircleElement = useRef<HTMLDivElement | null>(null);
  const cursorElement = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!isLoading && !isMobile) {
        const videoTl = gsap.timeline({
          scrollTrigger: {
            trigger: stickyCircleWrapper.current,
            start: 'top top',
            end: '200% top',
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
      }
    },
    {dependencies: [isLoading, isMobile], revertOnUpdate: true},
  );

  return (
    <div>
      {!isLoading && !isMobile && (
        <div className={styles['effect-wrapper']}>
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
                      playsInline
                      muted
                      loop
                      autoPlay
                      src={PinVideo}
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
              autoPlay
              loop
              muted
              playsInline
              data-object-fit="cover"
              src={PinVideo}
              className="absolute inset-0 object-cover size-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

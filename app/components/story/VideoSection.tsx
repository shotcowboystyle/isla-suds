import {useEffect, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import BathFullPoster from '~/assets/images/home/bath-full-poster.webp';
import BathPosterMobile from '~/assets/images/home/bath-poster-m.webp';
import BathPoster from '~/assets/images/home/bath-poster.webp';
import LightboxButtonImage from '~/assets/images/play.svg';
import PlayIcon from '~/assets/images/polygon-3.svg';
import BathFull from '~/assets/video/bath-full.mp4';
import BathLoopMobile from '~/assets/video/bath-loop-m.mp4';
import BathLoop from '~/assets/video/bath-loop.mp4';
import {DESKTOP_QUERY, MOTION_QUERY, PIN_PRIORITY, REDUCED_MOTION_QUERY, SCRUB_PIN} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './VideoSection.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

const PUNCHLINE = 'Side effects may include suds hair';

export const VideoSection = () => {
  const stickyCircleWrapper = useRef<HTMLDivElement>(null);
  const effectWrapper = useRef<HTMLDivElement>(null);
  const stickyCircleElement = useRef<HTMLDivElement>(null);
  const stickyCircleVideoWrapper = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const punchlineRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fullVideoRef = useRef<HTMLVideoElement>(null);

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

  const openFullCut = () => {
    dialogRef.current?.showModal();
    void fullVideoRef.current?.play().catch(() => {
      // Safe to continue: the visitor can press play on the native controls.
    });
  };

  const closeFullCut = () => dialogRef.current?.close();

  // Pinned scene: a beat of silence on the small spinning badge, then the
  // circle opens out to full frame, the badge steps aside so her face is clear,
  // and the punchline lands.
  useGSAP(
    () => {
      const wrapper = stickyCircleWrapper.current;
      const circle = stickyCircleElement.current;
      const videoWrapper = stickyCircleVideoWrapper.current;
      const badge = badgeRef.current;
      const punchline = punchlineRef.current;

      if (!wrapper || !circle || !videoWrapper || !badge || !punchline) {
        return;
      }

      const mm = GSAP.matchMedia();

      mm.add(`${DESKTOP_QUERY} and ${MOTION_QUERY}`, () => {
        GSAP.timeline({
          defaults: {ease: 'none'},
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: '+=350%',
            scrub: SCRUB_PIN,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: PIN_PRIORITY.videoSection,
          },
        })
          // Authored silence: the badge alone in the dark.
          .to({}, {duration: 0.08})
          .to(circle, {clipPath: 'circle(100% at 50% 50%)', duration: 0.5, ease: 'power1.in'}, 'open')
          .to(videoWrapper, {scale: 1, duration: 0.5, ease: 'power1.in'}, 'open')
          .to(
            badge,
            {
              // Over the red towel, where the white ring still reads.
              x: () => window.innerWidth * -0.36,
              y: () => window.innerHeight * -0.1,
              scale: 0.6,
              duration: 0.35,
              ease: 'power2.inOut',
            },
            'open+=0.2',
          )
          .fromTo(punchline, {opacity: 0, width: 0}, {opacity: 1, width: 'auto', duration: 0.12, ease: 'circ.out'}, '>')
          // Hold on the full frame so the punchline gets read.
          .to({}, {duration: 0.2});
      });

      // Wherever the pin doesn't run (tablet widths, reduced motion) the scene
      // would sit on its 6% dot forever. Show the finished frame instead, and
      // drop the negative margin that only exists to absorb the pin spacer.
      mm.add(`(min-width: 768px) and (not ${DESKTOP_QUERY}), (min-width: 768px) and ${REDUCED_MOTION_QUERY}`, () => {
        GSAP.set(circle, {clipPath: 'circle(100% at 50% 50%)'});
        GSAP.set(videoWrapper, {scale: 1});
        GSAP.set(badge, {x: window.innerWidth * -0.36, y: window.innerHeight * -0.1, scale: 0.6});
        GSAP.set(punchline, {opacity: 1});
        if (effectWrapper.current) GSAP.set(effectWrapper.current, {marginBottom: 0});
      });

      return () => mm.revert();
    },
    {scope: stickyCircleWrapper},
  );

  const badge = (
    <div ref={badgeRef} className={styles['chug-club-lightbox-button']}>
      <img
        src={LightboxButtonImage}
        loading="lazy"
        alt=""
        width={151}
        height={151}
        className={cn(styles['lightbox-button-image'], 'spin-circle')}
      />
      <div className={styles['lightbox-static-image-wrapper']}>
        <img src={PlayIcon} loading="lazy" alt="" width={25} height={28} className={styles['lightbox-static-image']} />
      </div>
    </div>
  );

  return (
    <div ref={stickyCircleWrapper} data-wear-at="video">
      {/* CSS handles mobile/desktop visibility via .effect-wrapper media queries.
         Always render to avoid layout shift from JS hydration toggle. */}
      <div ref={effectWrapper} className={styles['effect-wrapper']}>
        <div className={styles['effect-wrapper-inner']}>
          <div className={styles['cursor-wrapper']}>
            <div className={styles['cursor']}>
              <div
                ref={stickyCircleElement}
                style={{clipPath: 'circle(6% at 50% 50%)'}}
                className={styles['cursor-image']}
              >
                <button
                  type="button"
                  onClick={openFullCut}
                  className={styles['lightbox-link']}
                  aria-label="Play the full bath video"
                  aria-haspopup="dialog"
                >
                  {badge}
                </button>

                <div ref={punchlineRef} className={styles['punchline']}>
                  <p className={styles['punchline-text']}>{PUNCHLINE}</p>
                </div>

                <div ref={stickyCircleVideoWrapper} className={cn(styles['background-video-wrapper'], 'size-full')}>
                  <video
                    ref={desktopVideoRef}
                    playsInline
                    muted
                    loop
                    preload="none"
                    poster={BathPoster}
                    src={BathLoop}
                    width={1920}
                    height={1066}
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
        <button
          type="button"
          onClick={openFullCut}
          className={styles['lightbox-link']}
          aria-label="Play the full bath video"
          aria-haspopup="dialog"
        >
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

        <div className={cn(styles['punchline'], styles['punchline-mobile'])}>
          <p className={styles['punchline-text']}>{PUNCHLINE}</p>
        </div>

        <div className={cn(styles['background-video-wrapper'], 'size-full')}>
          <video
            ref={mobileVideoRef}
            loop
            muted
            playsInline
            preload="none"
            poster={BathPosterMobile}
            data-object-fit="cover"
            src={BathLoopMobile}
            width={720}
            height={1280}
            className="absolute inset-0 object-cover size-full"
          />
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className={styles['full-cut']}
        aria-label="The full bath video"
        onClose={() => fullVideoRef.current?.pause()}
      >
        <video
          ref={fullVideoRef}
          src={BathFull}
          poster={BathFullPoster}
          controls
          muted
          playsInline
          preload="none"
          width={1280}
          height={712}
          className={styles['full-cut-video']}
        />
        <button type="button" onClick={closeFullCut} className={styles['full-cut-close']}>
          Close
        </button>
      </dialog>
    </div>
  );
};

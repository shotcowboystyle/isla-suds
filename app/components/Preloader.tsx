import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {holdScrollRefresh} from '~/lib/motion/refresh';
import {getLenis} from '~/lib/scroll';
import {LETTERS, OVER_RIM_FOAM, UNDER_RIM_FOAM} from './bathtub-shapes';
import styles from './Preloader.module.css';

interface PreloaderProps {
  initialDelay?: number;
  minDisplayTime?: number;
  onComplete?: () => void;
  /**
   * Dev-only: freeze all animations at this point in their timeline (ms) so the
   * scene can be inspected frame by frame. When set, the internal load/pop
   * timers are skipped and the parent controls playback via `forcePopping`.
   */
  scrubMs?: number;
  /**
   * Dev-only: force the popping/exit state immediately (used with `scrubMs` to
   * preview the exit choreography without waiting for the min-display timer).
   */
  forcePopping?: boolean;
}

/**
 * Foam circles participate in the landing follow-through. Larger circles carry
 * more mass so they travel less, and the stagger radiates outward from the
 * tub's centre line (x = 150).
 */
const foamAmplitude = (r: number) => (r <= 10 ? '-6px' : r <= 15 ? '-4.5px' : '-3px');
const foamDelay = (cx: number) => `${Math.round(Math.abs(cx - 150) * 1.2)}ms`;

const foamStyle = (cx: number, r: number) =>
  ({'--foam-amp': foamAmplitude(r), '--foam-del': foamDelay(cx)}) as CSSProperties;

/** Hold before the portal opens — must match --enter-hold in the stylesheet. */
const ENTER_HOLD_MS = 260;
/** Everything after the hold: portal, launch, settle, wordmark. */
const ENTER_BODY_MS = 1190;
const ENTRANCE_MS = ENTER_HOLD_MS + ENTER_BODY_MS;
/** Sink, portal close, burst, floor fade, overlay fade. */
const EXIT_MS = 900;
/**
 * When the overlay starts fading (must match the overlay-fade delay in the
 * stylesheet). `onComplete` fires here so the hero entrance plays while the
 * overlay lifts instead of after it is gone.
 */
const OVERLAY_FADE_MS = 700;

export function Preloader({
  minDisplayTime = ENTRANCE_MS,
  onComplete,
  scrubMs,
  forcePopping,
}: PreloaderProps) {
  const isScrubMode = scrubMs !== undefined;
  const [isVisible, setIsVisible] = useState(true);
  const [autoPopping, setAutoPopping] = useState(false);
  const [autoEntering, setAutoEntering] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const isPopping = isScrubMode ? Boolean(forcePopping) : autoPopping;
  const isEntering = isScrubMode
    ? !forcePopping && scrubMs < ENTRANCE_MS
    : autoEntering;

  useEffect(() => {
    if (isScrubMode) return;

    const timer = setTimeout(() => setAutoEntering(false), ENTRANCE_MS);
    return () => clearTimeout(timer);
  }, [isScrubMode]);

  // Pop as soon as the entrance has played. Waiting for `window.load` (every
  // image and video on the page) or a fixed minimum held the hero hidden for
  // seconds and dominated LCP / Speed Index.
  useEffect(() => {
    if (isScrubMode) return;

    const timer = setTimeout(() => setAutoPopping(true), minDisplayTime);
    return () => clearTimeout(timer);
  }, [minDisplayTime, isScrubMode]);

  // The overlay is a fixed layer, not a scroll lock — without this the page
  // scrolls freely behind it and the hero is already gone when it lifts.
  //
  // `overflow: hidden` on the root also collapses the scrollable height to
  // zero, which clamps every ScrollTrigger start to 0. So the re-measure has to
  // happen here, in the cleanup, strictly after the overflow is restored — not
  // alongside the unmount, where it would race the style change and re-measure
  // a page that is still locked.
  useEffect(() => {
    if (isScrubMode || !isVisible) return;

    getLenis()?.stop();
    const releaseRefresh = holdScrollRefresh();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      getLenis()?.start();
      releaseRefresh();
    };
  }, [isScrubMode, isVisible]);

  useEffect(() => {
    if (isScrubMode) return;
    if (!autoPopping) return;

    const fadeTimer = setTimeout(() => onCompleteRef.current?.(), OVERLAY_FADE_MS);
    const exitTimer = setTimeout(() => setIsVisible(false), EXIT_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(exitTimer);
    };
  }, [autoPopping, isScrubMode]);

  if (!isVisible) return null;

  const wrapperClass = [
    styles.preloaderWrapper,
    isEntering && styles.entering,
    isPopping && styles.popping,
    isScrubMode && styles.scrubbed,
  ]
    .filter(Boolean)
    .join(' ');

  const wrapperStyle = isScrubMode
    ? ({'--scrub-time': `${scrubMs}ms`} as CSSProperties)
    : undefined;

  return (
    <div
      className={wrapperClass}
      style={wrapperStyle}
      role="status"
      aria-label="Loading"
    >
      <svg
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-140 -240 620 480"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="tubGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c7eff7" />
            <stop offset="65%" stopColor="#c7eff7" />
            <stop offset="100%" stopColor="#98c0c7" />
          </linearGradient>

          <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c7eff7" />
          </linearGradient>

          <radialGradient id="foamGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c7eff7" />
          </radialGradient>

          <radialGradient id="bubbleGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.7)" />
            <stop offset="40%" stopColor="rgba(255, 255, 255, 0.15)" />
            <stop offset="90%" stopColor="rgba(199, 239, 247, 0.3)" />
            <stop offset="100%" stopColor="rgba(199, 239, 247, 0.8)" />
          </radialGradient>

          <filter id="foamShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#c1dade" floodOpacity="1" />
          </filter>

          <radialGradient id="bubbleFoamGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#c7eff7" />
          </radialGradient>

          <filter id="bubbleFoamShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="2" stdDeviation="0.4" floodColor="#7a9ba3" floodOpacity="0.65" />
          </filter>

          <linearGradient id="horizonGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#292934" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Dark water opening in the white floor */}
          <radialGradient id="portalGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1b3d3e" />
            <stop offset="70%" stopColor="#206060" />
            <stop offset="100%" stopColor="#2c7b7c" />
          </radialGradient>

          {/* Everything above the floor line. Applied to the untransformed
              .clipHost so the rect stays in scene space while the tub travels. */}
          <clipPath id="portalClip" clipPathUnits="userSpaceOnUse">
            <rect x="-3000" y="-240" width="6000" height="388" />
          </clipPath>
        </defs>

        {/* 0. Floor (drawn very wide so overflow: visible carries it edge-to-edge) */}
        <rect x="-3000" y="110" width="6000" height="500" fill="#ffffff" className={styles.floorRect} />
        <rect x="-3000" y="106" width="6000" height="4" fill="url(#horizonGrad)" className={styles.floorRect} />

        {/* 1. Portal — opens before the tub arrives, closes behind it */}
        <g className={styles.portal}>
          <ellipse cx="150" cy="148" rx="150" ry="31.7" fill="url(#portalGrad)" />
          <ellipse cx="150" cy="148" rx="138" ry="29.2" fill="#14494a" opacity="0.55" />
        </g>

        {/* 2. Shadows — fade in on impact, not before */}
        <g className={styles.shadowGroup}>
          <ellipse cx="150" cy="148" rx="150" ry="31.7" fill="#eceff3" />
          <ellipse cx="150" cy="148" rx="125" ry="21.1" fill="#d9dde6" />
          <ellipse cx="78" cy="147" rx="20" ry="6.3" fill="#c8ccd4" />
          <ellipse cx="218" cy="147" rx="20" ry="6.3" fill="#c8ccd4" />
        </g>

        {/* 3. Deco circles */}
        <circle cx="-93" cy="75" r="5" fill="rgba(255, 255, 255, 0.2)" className={`${styles.deco} ${styles.d1}`} />
        <circle cx="-63" cy="-61" r="5" fill="rgba(255, 255, 255, 0.2)" className={`${styles.deco} ${styles.d2}`} />
        <circle cx="-115.5" cy="-132.5" r="7.5" fill="rgba(255, 255, 255, 0.2)" className={`${styles.deco} ${styles.d3}`} />
        <circle cx="-27.5" cy="-117.5" r="2.5" fill="#ffffff" className={`${styles.deco} ${styles.d4}`} />
        <circle cx="13.5" cy="-218.5" r="2.5" fill="rgba(255, 255, 255, 0.2)" className={`${styles.deco} ${styles.d5}`} />
        <circle cx="323" cy="-201" r="5" fill="rgba(255, 255, 255, 0.2)" className={`${styles.deco} ${styles.d6}`} />
        <circle cx="347.5" cy="-105.5" r="7.5" fill="rgba(255, 255, 255, 0.2)" className={`${styles.deco} ${styles.d7}`} />
        <circle cx="423" cy="-1" r="5" fill="rgba(255, 255, 255, 0.2)" className={`${styles.deco} ${styles.d8}`} />
        <circle cx="421.5" cy="66.5" r="2.5" fill="rgba(255, 255, 255, 0.2)" className={`${styles.deco} ${styles.d9}`} />
        <circle cx="461.5" cy="-140.5" r="2.5" fill="rgba(255, 255, 255, 0.2)" className={`${styles.deco} ${styles.d10}`} />

        {/* 4. Bathtub — clipHost holds the portal clip in scene space,
               launcher owns travel + squash, bathtub hosts the idle transform */}
        <g className={styles.clipHost} clipPath="url(#portalClip)">
          <g className={styles.launcher}>
            <g className={styles.bathtub}>
              {/* Logo Group popping out from inside the bathtub */}
              <g className={styles.logoGroup}>
                {LETTERS.map(({id, d, transform}) => (
                  <path key={id} className={styles.logoPath} d={d} transform={transform} />
                ))}
              </g>

              {/* Feet */}
              <g transform="translate(70, 110) rotate(15, 12.5, 12.5)">
                <rect x="0" y="0" width="25" height="25" fill="#c7eff7" />
                <circle cx="12.5" cy="27.5" r="12.5" fill="#c7eff7" />
              </g>
              <g transform="translate(200, 110) rotate(-15, 12.5, 12.5)">
                <rect x="0" y="0" width="25" height="25" fill="#bee6ee" />
                <circle cx="12.5" cy="27.5" r="12.5" fill="#bee6ee" />
              </g>

              {/* Outer Tub */}
              <path
                d="M 0,0 H 300 V 37.5 A 105 87.5 0 0 1 195 125 H 105 A 105 87.5 0 0 1 0 37.5 V 0 Z"
                fill="url(#tubGrad)"
              />

              {/* Inner Cutout (White) */}
              <path
                d="M 0,0 H 255 V 21.25 A 102 85 0 0 1 153 106.25 H 102 A 102 85 0 0 1 0 21.25 V 0 Z"
                fill="#ffffff"
              />

              {/* Under-rim Foam */}
              {UNDER_RIM_FOAM.map(({cx, cy, r}) => (
                <circle
                  key={`under-${cx}`}
                  className={styles.foam}
                  style={foamStyle(cx, r)}
                  cx={cx}
                  cy={cy}
                  r={r}
                  filter="url(#foamShadow)"
                  fill="url(#foamGrad)"
                />
              ))}

              {/* Tub Rim Shadow & Rim */}
              <rect x="-14" y="-13.5" width="324" height="20" rx="10" ry="10" fill="#c1dade" />
              <rect x="-14" y="-15" width="324" height="20" rx="10" ry="10" fill="url(#rimGrad)" />

              {/* Over-rim Foam */}
              {OVER_RIM_FOAM.map(({cx, cy, r}) => (
                <circle
                  key={`over-${cx}`}
                  className={styles.foam}
                  style={foamStyle(cx, r)}
                  cx={cx}
                  cy={cy}
                  r={r}
                  filter="url(#foamShadow)"
                  fill="url(#foamGrad)"
                />
              ))}

              {/* Rising Bubbles Left */}
              <circle cx="10" cy="-30" r="10" fill="url(#bubbleGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" className={`${styles.bubble} ${styles.b1}`} />
              <circle cx="25" cy="-60" r="5" fill="url(#bubbleGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" className={`${styles.bubble} ${styles.b2}`} />
              <circle cx="-5" cy="-90" r="7.5" fill="url(#bubbleGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" className={`${styles.bubble} ${styles.b3}`} />

              {/* Rising Bubbles Right */}
              <circle cx="270" cy="-30" r="10" fill="url(#bubbleGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" className={`${styles.bubble} ${styles.b4}`} />
              <circle cx="290" cy="-65" r="5" fill="url(#bubbleGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" className={`${styles.bubble} ${styles.b5}`} />
              <circle cx="255" cy="-100" r="10" fill="url(#bubbleGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" className={`${styles.bubble} ${styles.b6}`} />
              <circle cx="280" cy="-135" r="7.5" fill="url(#bubbleGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" className={`${styles.bubble} ${styles.b7}`} />
              <circle cx="265" cy="-170" r="5" fill="url(#bubbleGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" className={`${styles.bubble} ${styles.b8}`} />
              <circle cx="300" cy="-205" r="5" fill="url(#bubbleGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" className={`${styles.bubble} ${styles.b9}`} />
            </g>
          </g>
        </g>

        {/* 5. Particle burst — authored centred on (150, 140) so each shape can
               use transform-box: fill-box and translate relative to itself */}
        <g className={styles.burst}>
          <path
            className={`${styles.particle} ${styles.p1}`}
            fill="#ffffff"
            d="M150 135.5 L151.111 138.471 L154.28 138.609 L151.798 140.584 L152.645 143.641 L150 141.89 L147.355 143.641 L148.202 140.584 L145.72 138.609 L148.889 138.471 Z"
          />
          <circle className={`${styles.particle} ${styles.p2}`} cx="150" cy="140" r="4" fill="#c7eff7" />
          <rect
            className={`${styles.particle} ${styles.p3}`}
            x="146"
            y="136"
            width="8"
            height="8"
            rx="2"
            fill="#fed775"
          />
          <path
            className={`${styles.particle} ${styles.p4}`}
            fill="#e8a090"
            d="M150 135.5 L154.5 140 L150 144.5 L145.5 140 Z"
          />
          <path
            className={`${styles.particle} ${styles.p5}`}
            fill="#ffffff"
            d="M150 136.6 L150.839 138.845 L153.234 138.949 L151.358 140.441 L151.998 142.75 L150 141.428 L148.002 142.75 L148.642 140.441 L146.766 138.949 L149.161 138.845 Z"
          />
          <circle className={`${styles.particle} ${styles.p6}`} cx="150" cy="140" r="2.5" fill="#c7eff7" />
          <path
            className={`${styles.particle} ${styles.p7}`}
            fill="#fed775"
            d="M146 135.5 L154 140 L146 144.5 Z"
          />
          <path
            className={`${styles.particle} ${styles.p8}`}
            fill="#e8a090"
            d="M150 135.5 L154.5 144.5 L145.5 144.5 Z"
          />
          <path
            className={`${styles.particle} ${styles.p9}`}
            fill="#ffffff"
            d="M147.6 134 h4.8 v3.6 h3.6 v4.8 h-3.6 v3.6 h-4.8 v-3.6 h-3.6 v-4.8 h3.6 Z"
          />
        </g>
      </svg>
    </div>
  );
}

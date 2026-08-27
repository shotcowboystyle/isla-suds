import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {requestScrollRefresh} from '~/lib/motion/refresh';
import {getLenis} from '~/lib/scroll';
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

const LETTERS: ReadonlyArray<{id: string; d: string; transform: string}> = [
  {
    id: 'isla-i',
    d: 'M264.746 134.818c-2.037-.178-2.554-2.494-2.138-4.163.508-2.817 1.495-5.536 1.772-8.4 1.026-8.288.986-16.727-.179-24.998-.296-2.723-1.354-5.292-1.675-8.005-.41-2.071 1.848-2.905 3.516-2.885 3.16-.158 6.357-.27 9.504.122 2.245.004 2.804 2.447 2.117 4.189-.783 2.944-1.688 5.872-1.948 8.925-.844 8.038-.746 16.206.511 24.195.333 2.892 1.771 5.57 1.804 8.499-.012 2.08-2.399 2.532-4.044 2.611-3.075.168-6.168.097-9.24-.09z',
    transform: 'translate(-242.635 -70.137)',
  },
  {
    id: 'isla-a',
    d: 'M344.64 134.918c-3.91-1.004-7.313-4.21-7.885-8.306-.684-4.174.495-9.014 4.204-11.446 4.71-3.125 10.561-3.246 16.011-3.517 2.157.327 3.602-1.6 2.55-3.545-.389-2.394-2.118-4.684-4.648-5.006-2.815-.55-5.596 1.485-6.264 4.2-1.774 3.812-8.33 3.874-10.036-.02-1.069-2.9.62-6.066 3.085-7.65 4.644-3.08 10.55-3.732 15.973-2.996 4.36.628 9.114 2.729 10.824 7.093 1.656 4.312 1.488 9.03 1.778 13.569.242 2.963-.004 6.109 1.231 8.882.973 1.541 2.729 2.807 2.64 4.832-.079 2.952-3.357 4.444-5.958 4.258-2.935-.088-6.053-1.683-7.163-4.511-1.09-.22-2.486 2.13-3.865 2.58-3.745 2.043-8.343 2.69-12.477 1.583zm11.043-7.515c2.635-1.025 3.93-3.89 3.962-6.576.703-2.411-1.894-3.729-3.933-3.568-3.145-.022-6.866 1.127-8.207 4.245-1.242 2.65.79 5.738 3.487 6.346 1.551.436 3.238.222 4.69-.447z',
    transform: 'translate(-258.635 -66.137)',
  },
  {
    id: 'isla-l',
    d: 'M319.896 134.59c-2.239-.364-2.407-3.095-1.759-4.826 1.52-4.97 1.547-10.21 1.758-15.357.109-6.91.258-13.868-.65-20.735-.419-2.46-1.547-5.009-.79-7.508 1.087-2.202 3.866-2.484 5.946-3.24 1.829-.398 4.111-1.518 5.78-.169 1.31 1.903.807 4.394.803 6.566-.431 5.357-.93 10.716-.839 16.097.084 7.33.26 14.711 1.55 21.944.336 2.046 1.819 4.313.526 6.3-1.4-1.537-3.734 1.055-5.601 1.283-2.237.014-4.53.142-6.724-.355z',
    transform: 'translate(-253.635 -66.137)',
  },
  {
    id: 'isla-s',
    d: 'M294.53 135.364c-4.169-.499-8.749-1.777-11.362-5.312-1.596-2.16-1.876-5.731.47-7.482 2.703-2.097 7.133-.994 8.53 2.14 1.487 3.152 5.61 5.144 8.89 3.601 2.188-.998 2.804-4.577.628-5.915-3.737-2.352-8.25-3-12.083-5.177-3.233-1.706-6.597-4.357-7.016-8.245-.324-4.209 2.26-8.367 6.022-10.201 5.169-2.612 11.361-2.956 16.905-1.424 3.025.881 6.36 2.774 7.021 6.122.585 2.403-.866 5.182-3.405 5.638-2.66.654-5.447-.97-6.596-3.377-1.715-2.719-6.118-3.907-8.482-1.386-1.404 1.442-.957 3.934.902 4.735 5.093 2.914 11.461 3.196 16.041 7.079 2.797 2.457 3.215 6.6 2.63 10.062-.814 4.373-4.727 7.426-8.855 8.503-3.32.94-6.83 1.01-10.24.64z',
    transform: 'translate(-248.635 -66.137)',
  },
  {
    id: 'suds-s1',
    d: 'M270.413 194.186c-4.991-.74-10.356-2.964-12.863-7.613-1.67-3.04-1.076-7.744 2.435-9.197 3.235-1.452 6.983.721 8.26 3.812 2.01 4.466 7.964 7.182 12.446 4.766 3.13-1.722 3.48-6.946.29-8.801-4.45-2.817-9.84-3.585-14.372-6.261-4.253-2.293-8.501-5.969-8.95-11.086-.376-4.9 2.232-9.924 6.6-12.253 6.093-3.366 13.595-3.787 20.218-1.868 3.836 1.141 7.95 3.766 8.561 8.048.588 2.975-1.152 6.546-4.404 6.902-3.159.499-5.887-1.96-6.908-4.763-2.01-3.983-8.018-5.737-11.458-2.582-2.166 2.1-2.007 6.317.836 7.779 5.458 3.19 12.006 4.005 17.283 7.585 3.375 2.037 5.76 5.654 5.94 9.633.624 4.978-1.53 10.274-5.846 12.978-5.289 3.461-11.986 3.765-18.068 2.92z',
    transform: 'translate(-233.635 -76.137)',
  },
  {
    id: 'suds-d',
    d: 'M351.203 194.205c-6.557-1.279-10.954-7.435-12.179-13.703-1.244-6.198-.227-13.013 3.359-18.284 4-5.777 12.319-8.469 18.69-5.092 1.498 1.522 3.998 2.03 3.4-.943.018-3.358-1.55-6.532-1.366-9.884.374-2.862 3.701-3.579 6.012-4.219 2.029-.387 4.739-1.49 6.336.357 1.238 2.616.219 5.61.098 8.36-.97 10.556-1.41 21.259.044 31.791.213 2.77 1.601 5.303 1.72 8.07.151 2.218-2.098 3.528-4.073 3.509-2.412.06-5.687.232-6.978-2.278-.3-1.433-1.304-2.689-2.36-.891-3.324 3.144-8.307 4.076-12.703 3.207zm9.277-9.02c3.418-2.187 4.114-6.71 4.1-10.46-.155-3.654-.97-7.906-4.17-10.135-2.817-1.784-6.58-.447-8.373 2.163-3.232 4.389-3.623 10.741-1.047 15.521 1.857 3.156 6.178 4.866 9.49 2.912z',
    transform: 'translate(-249.635 -76.137)',
  },
  {
    id: 'suds-u',
    d: 'M312.16 194.217c-3.807-.547-7.795-2.24-9.708-5.778-2.6-4.804-2.716-10.427-3.004-15.753-.17-3.638-.438-7.276-1.049-10.868-.274-1.86.093-4.26 2.122-4.963 2.416-.844 5.068-.786 7.583-.537 2.11.165 2.66 2.505 2.552 4.256-.147 6.445-1.706 12.952-.341 19.367.47 2.539 2.144 5.213 4.913 5.556 2.357.518 4.969-.55 6.066-2.75 2.033-3.931 1.818-8.537 1.578-12.83-.148-3.424-1.077-6.778-1.046-10.208-.148-2.104 1.935-3.247 3.783-3.275 2.413-.169 4.999-.614 7.3.343 1.912 1.026 1.45 3.536 1.304 5.318-.537 5.68-.813 11.38-1.277 17.062-.567 4.988-2.428 10.352-6.848 13.187-4.095 2.65-9.28 2.647-13.928 1.873z',
    transform: 'translate(-241.635 -76.137)',
  },
  {
    id: 'suds-s2',
    d: 'M392.313 194.27c-4.08-.612-8.475-2.394-10.582-6.16-1.27-2.154-.795-5.314 1.484-6.588 2.785-1.77 6.968-.654 8.28 2.446 1.274 2.454 4.116 4.306 6.928 3.506 1.581-.493 3.864-1.4 3.832-3.37-.543-2.052-2.751-2.981-4.47-3.883-4.159-1.79-8.672-2.993-12.292-5.836-2.514-1.814-4.35-4.89-3.781-8.067.46-3.46 2.614-6.604 5.718-8.216 5.14-2.753 11.408-3.144 16.973-1.553 3.206.939 6.64 3.126 7.154 6.699.535 2.328-1.24 4.688-3.575 5.016-2.494.567-5.246-.722-6.332-3.057-1.616-2.54-5.46-4.013-8.048-2.06-1.648 1.393-1.488 4.485.588 5.399 4.916 2.505 10.78 2.903 15.274 6.292 2.522 1.822 3.268 5.093 3.176 8.042.14 4.059-2.293 7.968-5.94 9.724-4.404 2.251-9.59 2.318-14.387 1.666z',
    transform: 'translate(-257.835 -76.137)',
  },
];

/**
 * Foam circles participate in the landing follow-through. Larger circles carry
 * more mass so they travel less, and the stagger radiates outward from the
 * tub's centre line (x = 150).
 */
const foamAmplitude = (r: number) => (r <= 10 ? '-6px' : r <= 15 ? '-4.5px' : '-3px');
const foamDelay = (cx: number) => `${Math.round(Math.abs(cx - 150) * 1.2)}ms`;

const foamStyle = (cx: number, r: number) =>
  ({'--foam-amp': foamAmplitude(r), '--foam-del': foamDelay(cx)}) as CSSProperties;

const UNDER_RIM_FOAM: ReadonlyArray<{cx: number; cy: number; r: number}> = [
  {cx: 166, cy: -14, r: 10},
  {cx: 181, cy: -14, r: 10},
  {cx: 134, cy: -14, r: 10},
  {cx: 119, cy: -14, r: 10},
];

const OVER_RIM_FOAM: ReadonlyArray<{cx: number; cy: number; r: number}> = [
  // Right cluster
  {cx: 126, cy: -15, r: 10},
  {cx: 143, cy: -20, r: 15},
  {cx: 199, cy: -18, r: 10},
  {cx: 221, cy: -22, r: 20},
  {cx: 254, cy: -15, r: 20},
  {cx: 269, cy: -35, r: 20},
  {cx: 285, cy: -13, r: 20},
  {cx: 261, cy: -22, r: 10},
  // Left cluster
  {cx: 174, cy: -15, r: 10},
  {cx: 157, cy: -20, r: 15},
  {cx: 101, cy: -18, r: 10},
  {cx: 79, cy: -22, r: 20},
  {cx: 46, cy: -15, r: 20},
  {cx: 31, cy: -35, r: 20},
  {cx: 15, cy: -13, r: 20},
  {cx: 39, cy: -22, r: 10},
];

/** Hold before the portal opens — must match --enter-hold in the stylesheet. */
const ENTER_HOLD_MS = 260;
/** Everything after the hold: portal, launch, settle, wordmark. */
const ENTER_BODY_MS = 1190;
const ENTRANCE_MS = ENTER_HOLD_MS + ENTER_BODY_MS;
/** Sink, portal close, burst, floor fade, overlay fade. */
const EXIT_MS = 900;
/**
 * Ceiling on the wait for `window.load`. That event waits on every image and
 * video on the page, so on a slow connection it can hold the overlay long past
 * the point where the content behind it is usable.
 */
const MAX_LOAD_WAIT_MS = 5000;

export function Preloader({
  minDisplayTime = 2500,
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

  useEffect(() => {
    if (isScrubMode) return;
    const startTime = Date.now();
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    let popped = false;

    const triggerPop = () => {
      if (popped) return;
      popped = true;

      const elapsed = Date.now() - startTime;
      // A fast load must still let the entrance play out — the exit is the
      // entrance's counterpart, not a replacement for it.
      const remaining = Math.max(0, minDisplayTime - elapsed, ENTRANCE_MS - elapsed);

      timers.push(setTimeout(() => setAutoPopping(true), remaining));
    };

    if (document.readyState === 'complete') {
      triggerPop();
    } else {
      window.addEventListener('load', triggerPop);
      timers.push(setTimeout(triggerPop, MAX_LOAD_WAIT_MS));
    }

    return () => {
      window.removeEventListener('load', triggerPop);
      timers.forEach(clearTimeout);
    };
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
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      getLenis()?.start();
      requestScrollRefresh();
    };
  }, [isScrubMode, isVisible]);

  useEffect(() => {
    if (isScrubMode) return;
    if (!autoPopping) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onCompleteRef.current?.();
    }, EXIT_MS);

    return () => clearTimeout(timer);
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

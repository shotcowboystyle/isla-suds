import {useCallback, useRef, useState, type CSSProperties, type ReactNode} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {FOOTER} from '~/content/footer';
import {MOTION_QUERY} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import {LETTERS, OVER_RIM_FOAM, UNDER_RIM_FOAM} from './bathtub-shapes';
import styles from './FooterBath.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

/**
 * Bubbles that float up out of the tub. `x` is % across the tub, `left` picks
 * the sway direction, `rest` is the height (vh) a bubble sits at when motion is
 * reduced. Negative delays start
 * them mid-flight so the footer never opens on an empty tub.
 */
const BUBBLES = [
  {x: 9, size: 30, dur: 9, delay: -2, left: false, rest: 6},
  {x: 17, size: 16, dur: 7, delay: -5.5, left: true, rest: 24},
  {x: 26, size: 40, dur: 11, delay: -7, left: false, rest: 14},
  {x: 37, size: 14, dur: 8, delay: -1, left: true, rest: 34},
  {x: 63, size: 20, dur: 9.5, delay: -4, left: false, rest: 30},
  {x: 74, size: 36, dur: 10, delay: -8.5, left: true, rest: 10},
  {x: 84, size: 18, dur: 7.5, delay: -3, left: false, rest: 22},
  {x: 92, size: 26, dur: 8.5, delay: -6, left: true, rest: 4},
] as const;

type BubbleSpec = (typeof BUBBLES)[number];

/** Foam closer to the tub's centre line (x = 150) sloshes first. */
const sloshDelay = (_: number, el: Element) => Math.abs(Number((el as SVGElement).dataset.cx) - 150) * 0.0012;

/**
 * The footer's closing image: the preloader's bathtub slides back up from the
 * bottom edge, the foamy wordmark rises out of the bath, and bubbles float up
 * through the footer. Hover (mouse) or tap a bubble to pop it.
 *
 * `children` sit on the tub's front panel as real text.
 */
export function FooterBath({children}: {children: ReactNode}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [pops, setPops] = useState(0);
  const countPop = useCallback(() => setPops((n) => n + 1), []);

  useGSAP(
    () => {
      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        // Bubbles only rise while the footer is on screen.
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: 'top bottom',
          toggleClass: {targets: rootRef.current, className: styles.bubbling},
        });

        // CSS default is the landed tub; this builds the entrance from below.
        // `clamp()` keeps the start reachable on pages too short to scroll.
        GSAP.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'clamp(top 95%)',
            toggleActions: 'play none none reverse',
          },
        })
          .fromTo('[data-tub]', {yPercent: 100}, {yPercent: 0, duration: 0.9, ease: 'back.out(1.4)'})
          .fromTo(
            '[data-foam]',
            {y: 0},
            {y: -6, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1, stagger: sloshDelay},
            '-=0.3',
          )
          .fromTo('[data-logo]', {yPercent: 100}, {yPercent: 0, duration: 0.8, ease: 'back.out(1.8)'}, '-=0.45')
          .fromTo(
            '[data-pill]',
            {scale: 0, rotate: -25},
            {scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2.4)'},
            '-=0.3',
          );
      });

      return () => mm.revert();
    },
    {scope: rootRef},
  );

  return (
    <div ref={rootRef} className={styles.bath}>
      <div data-tub className={styles.tub}>
        <div className={styles.stage}>
          {/* Wordmark sits inside the tub, behind the rim, like the preloader's. It is
              its own SVG so rising out of the bath is a composited transform rather
              than a repaint of the whole tub every frame. The clip hides it below
              the rim line. */}
          <div className={styles['logo-clip']}>
            <svg
              data-logo
              className={cn(styles.svg, styles.logo)}
              viewBox="-20 -150 340 160"
              preserveAspectRatio="xMidYMax meet"
              aria-hidden="true"
              focusable="false"
            >
              {/* Own IDs: the preloader's gradients share the page for its first seconds. */}
              <defs>
                <radialGradient id="footer-letter-grad" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#c7eff7" />
                </radialGradient>
              </defs>
              <g transform="translate(138 -45) scale(1.18) translate(-77.5 -95)">
                {/* Offset copy instead of feDropShadow: filters make every repaint slow. */}
                <g fill="#7a9ba3" stroke="#7a9ba3" strokeWidth="1.5" strokeLinejoin="round" opacity="0.65">
                  {LETTERS.map(({id, d, transform}) => (
                    <path key={id} d={d} transform={`translate(1 2) ${transform}`} />
                  ))}
                </g>
                {LETTERS.map(({id, d, transform}) => (
                  <path
                    key={id}
                    d={d}
                    transform={transform}
                    fill="url(#footer-letter-grad)"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    paintOrder="stroke markers fill"
                  />
                ))}
              </g>
            </svg>
          </div>

          <svg
            className={cn(styles.svg, styles.rim)}
            viewBox="-20 -150 340 160"
            preserveAspectRatio="xMidYMax meet"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient id="footer-tub-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#c7eff7" />
                <stop offset="65%" stopColor="#c7eff7" />
                <stop offset="100%" stopColor="#98c0c7" />
              </linearGradient>
              <linearGradient id="footer-rim-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#c7eff7" />
              </linearGradient>
              <radialGradient id="footer-foam-grad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#c7eff7" />
              </radialGradient>
            </defs>

            {/* Top of the tub body; the front panel below the SVG continues it. */}
            <rect x="0" y="0" width="300" height="10" fill="url(#footer-tub-grad)" />
            <rect x="0" y="0" width="255" height="10" fill="#ffffff" />

            {UNDER_RIM_FOAM.map((foam) => (
              <Foam key={`under-${foam.cx}`} {...foam} />
            ))}

            <rect x="-14" y="-13.5" width="324" height="20" rx="10" fill="#c1dade" />
            <rect x="-14" y="-15" width="324" height="20" rx="10" fill="url(#footer-rim-grad)" />

            {OVER_RIM_FOAM.map((foam) => (
              <Foam key={`over-${foam.cx}`} {...foam} />
            ))}
          </svg>

          {/* Decorative: nothing essential hides behind a bubble. */}
          <div className={styles.bubbles} aria-hidden="true">
            {BUBBLES.map((bubble) => (
              <Bubble key={bubble.x} bubble={bubble} onPop={countPop} />
            ))}
          </div>

          <div className={styles['pill-tilt']} aria-hidden="true">
            <span data-pill className={styles.pill}>
              <span key={pops} className={styles['pill-text']}>
                {FOOTER.pops(pops)}
              </span>
            </span>
          </div>
        </div>

        <div className={styles.front}>{children}</div>
      </div>
    </div>
  );
}

function Foam({cx, cy, r}: {cx: number; cy: number; r: number}) {
  return (
    <g data-foam data-cx={cx}>
      <circle cx={cx + 1} cy={cy + 2} r={r} fill="#c1dade" />
      <circle cx={cx} cy={cy} r={r} fill="url(#footer-foam-grad)" />
    </g>
  );
}

function Bubble({bubble, onPop}: {bubble: BubbleSpec; onPop: () => void}) {
  // Each pop remounts the bubble (new key) so it rises again from the foam.
  const [generation, setGeneration] = useState(0);
  // A tapped bubble keeps catching pointer events until it's gone, so the tap's
  // trailing click can't fall through to a link underneath. A hovered one lets
  // clicks through straight away.
  const [popped, setPopped] = useState<'hover' | 'tap' | null>(null);

  const pop = (by: 'hover' | 'tap') => {
    if (popped) return;
    setPopped(by);
    onPop();
  };

  const vars = {
    '--x': `${bubble.x}%`,
    '--size': `${bubble.size}px`,
    '--dur': `${bubble.dur}s`,
    '--delay': generation === 0 ? `${bubble.delay}s` : '0s',
    '--rest': `${bubble.rest}vh`,
  } as CSSProperties;

  return (
    <span
      key={generation}
      className={cn(styles.rise, bubble.left && styles['sway-left'], popped && styles.frozen)}
      style={vars}
    >
      <span
        className={cn(styles.bubble, popped && styles.popped, popped === 'tap' && styles.tapped)}
        onPointerEnter={(event) => event.pointerType === 'mouse' && pop('hover')}
        onPointerDown={(event) => pop(event.pointerType === 'mouse' ? 'hover' : 'tap')}
        onAnimationEnd={(event) => {
          if (!popped || event.target !== event.currentTarget) return;
          setPopped(null);
          setGeneration((n) => n + 1);
        }}
      />
    </span>
  );
}

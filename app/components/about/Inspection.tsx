import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import DeskMobile from '~/assets/images/about/desk-m.webp';
import Desk from '~/assets/images/about/desk.webp';
import Duck from '~/assets/images/about/duck.webp';
import StampTool from '~/assets/images/about/stamp.webp';
import Bar from '~/assets/images/home/bar-eucalyptus.webp';
import {ABOUT_PAGE} from '~/content/about';
import {MOTION_QUERY} from '~/lib/motion/tokens';
import styles from './Inspection.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

const {isla} = ABOUT_PAGE;

function DeskPlate({className, lit = false}: {className: string; lit?: boolean}) {
  return (
    <picture className={className} data-lit={lit ? '' : undefined}>
      <source media="(max-width: 767px)" srcSet={DeskMobile} width={1100} height={1530} />
      <img src={Desk} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
    </picture>
  );
}

/**
 * Act 5: why, then the peak. A quiet paragraph, a dark room, one line. The lamp
 * clicks on, the Head of Quality (a rubber duck) runs the inspection, the
 * stamp comes down, and the promise the whole company is named after lands.
 */
export function Inspection() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scene = sceneRef.current;
      if (!scene) return;
      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        const quote = SplitText.create('[data-quote]', {type: 'words', mask: 'words'});

        // A staggered fromTo only renders its first target's start state up
        // front; set the rest so no box is ticked before the inspection.
        GSAP.set('[data-tick]', {strokeDashoffset: 1.05});
        GSAP.set(quote.words, {yPercent: 110});

        const tl = GSAP.timeline({
          defaults: {ease: 'none'},
          scrollTrigger: {
            trigger: scene,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        tl
          // Authored silence: the dark room and one line.
          .fromTo('[data-silence]', {opacity: 0, y: 20}, {opacity: 1, y: 0, duration: 0.04}, 0.02)
          .to('[data-silence]', {opacity: 0, duration: 0.03}, 0.13)
          // The lamp clicks on.
          .fromTo(
            '[data-lit]',
            {clipPath: 'circle(0% at 29% 30%)'},
            {clipPath: 'circle(150% at 29% 30%)', duration: 0.08, ease: 'power2.in'},
            0.12,
          )
          .fromTo(
            '[data-items]',
            {filter: 'brightness(0.2)'},
            {filter: 'brightness(1)', duration: 0.08, ease: 'power2.in'},
            0.12,
          )
          .fromTo(
            '[data-duck]',
            {xPercent: 600, rotation: 12},
            {xPercent: 0, rotation: 0, duration: 0.07, ease: 'back.out(1.4)'},
            0.18,
          )
          .fromTo(
            '[data-report]',
            {y: 60, rotation: 9, opacity: 0},
            {y: 0, rotation: -2, opacity: 1, duration: 0.07, ease: 'power3.out'},
            0.22,
          )
          // The inspection: the lens sweeps the bar while the boxes get ticked.
          .fromTo('[data-lens]', {opacity: 0, '--lx': 8}, {opacity: 1, duration: 0.03}, 0.3)
          .to('[data-lens]', {'--lx': 92, duration: 0.28, ease: 'sine.inOut'}, 0.32)
          .to('[data-lens]', {opacity: 0, duration: 0.03}, 0.6)
          .fromTo('[data-tick]', {strokeDashoffset: 1.05}, {strokeDashoffset: 0, duration: 0.03, stagger: 0.07}, 0.36)
          // The stamp comes down, hard.
          .fromTo('[data-tool]', {yPercent: -260, opacity: 1}, {yPercent: 0, duration: 0.06, ease: 'power3.in'}, 0.62)
          .fromTo(
            '[data-ink]',
            {scale: 1.6, opacity: 0},
            {scale: 1, opacity: 0.9, duration: 0.02, ease: 'back.out(3)'},
            0.68,
          )
          .to('[data-shake]', {keyframes: {x: [0, -14, 11, -7, 4, 0], y: [0, 6, -4, 2, 0, 0]}, duration: 0.04}, 0.68)
          .to('[data-duck]', {keyframes: {yPercent: [0, -28, 0, -8, 0]}, duration: 0.05}, 0.68)
          .to('[data-tool]', {yPercent: -260, opacity: 0, duration: 0.05, ease: 'power2.out'}, 0.71)
          // The promise.
          .fromTo(
            '[data-quote-box]',
            {scaleX: 0, opacity: 0},
            {scaleX: 1, opacity: 1, duration: 0.03, ease: 'power3.out'},
            0.73,
          )
          .fromTo(quote.words, {yPercent: 110}, {yPercent: 0, duration: 0.02, stagger: 0.009, ease: 'power2.out'}, 0.75)
          .fromTo(
            '[data-caption]',
            {scale: 0, rotation: -30},
            {scale: 1, rotation: 6, duration: 0.04, ease: 'back.out(2.5)'},
            0.86,
          )
          .to({}, {duration: 0.1});

        return () => quote.revert();
      });

      return () => mm.revert();
    },
    {scope: sceneRef},
  );

  return (
    <section className={styles['isla']} aria-labelledby="isla-title">
      <div className={styles['intro']}>
        <h2 id="isla-title" className={styles['heading']}>
          {isla.heading}
        </h2>
        <p className={styles['body']}>{isla.body}</p>
      </div>

      <div ref={sceneRef} className={styles['scene']}>
        <div className={styles['stage']}>
          <div data-shake className={styles['frame']}>
            <DeskPlate className={styles['plate-dark']} />
            <DeskPlate className={styles['plate-lit']} lit />

            <div data-items className={styles['items']}>
              <div className={styles['bar']}>
                <img src={Bar} alt="" width={1100} height={875} loading="lazy" decoding="async" />
                <div data-lens className={styles['lens']} aria-hidden="true">
                  <div className={styles['glass']}>
                    <img src={Bar} alt="" width={1100} height={875} loading="lazy" decoding="async" />
                  </div>
                </div>
              </div>

              <img
                data-duck
                src={Duck}
                alt="A rubber duck in tiny glasses"
                width={806}
                height={900}
                loading="lazy"
                decoding="async"
                className={styles['duck']}
              />
            </div>
            <p data-caption className={styles['caption']}>
              {isla.caption}
            </p>
          </div>

          <p data-silence className={styles['silence']}>
            {isla.silence}
          </p>

          <div className={styles['board']}>
            <div data-report className={styles['report']}>
              <p className={styles['report-title']}>Inspection report</p>
              <ul className={styles['checklist']}>
                {isla.checklist.map((item) => (
                  <li key={item} className={styles['check']}>
                    <svg viewBox="0 0 24 24" className={styles['box']} aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="3" />
                      <path data-tick pathLength={1} d="M6 12.5 L10.5 17 L19 6" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <span data-ink className={styles['ink']}>
                {isla.stamp}
              </span>
              <img
                data-tool
                src={StampTool}
                alt=""
                width={545}
                height={700}
                loading="lazy"
                className={styles['tool']}
              />
            </div>

            <blockquote data-quote-box className={styles['quote']}>
              <p data-quote>{isla.quote}</p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

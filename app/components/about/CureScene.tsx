import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import CuringBar from '~/assets/images/lavender-bar.webp';
import {ABOUT_PAGE} from '~/content/about';
import {DESKTOP_QUERY, MOBILE_QUERY, MOTION_QUERY, SCRUB_PIN, SCRUB_SCENE} from '~/lib/motion/tokens';
import styles from './CureScene.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

const {heading, content, cureWeeks} = ABOUT_PAGE.craftsmanship;

/** Week zero: soft, wet, over-saturated, slumped under its own weight. */
const RAW = {
  filter: 'blur(7px) saturate(155%) drop-shadow(0 4vh 5vh rgba(0, 0, 0, 0.6))',
  scaleX: 1.07,
  scaleY: 0.9,
  rotate: -3,
};

/** Week six: hard edges, true colour, a shadow that sits tight under the bar. */
const CURED = {
  filter: 'blur(0px) saturate(100%) drop-shadow(0 1.1vh 1.6vh rgba(0, 0, 0, 0.45))',
  scaleX: 1,
  scaleY: 1,
  rotate: 0,
};

export function CureScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLImageElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const weekRef = useRef<HTMLSpanElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const bar = barRef.current;
      const rail = railRef.current;
      const week = weekRef.current;
      const steps = stepsRef.current;
      const figure = figureRef.current;

      if (!section || !stage || !bar || !rail || !week || !steps || !figure) return;

      const stepEls = GSAP.utils.toArray<HTMLElement>('p', steps);
      const mm = GSAP.matchMedia();

      /**
       * One timeline, two ways of paying for it. On desktop the scene pins and
       * the cure gets its own stretch of scroll; on touch it plays as the
       * section passes, because pinning a full-height scene on a phone costs
       * more than it returns.
       */
      const cure = (trigger: ScrollTrigger.Vars) => {
        const counter = {weeks: 0};

        const tl = GSAP.timeline({scrollTrigger: {...trigger, invalidateOnRefresh: true}});

        tl.fromTo(bar, RAW, {...CURED, ease: 'none'}, 0)
          .fromTo(rail, {scaleY: 0}, {scaleY: 1, ease: 'none'}, 0)
          .to(
            counter,
            {
              weeks: cureWeeks,
              ease: 'none',
              snap: {weeks: 1},
              onUpdate: () => {
                week.textContent = String(Math.round(counter.weeks));
              },
            },
            0,
          )
          .fromTo(
            stepEls,
            {opacity: 0, yPercent: 18},
            {opacity: 1, yPercent: 0, ease: 'power2.out', duration: 0.26, stagger: 0.26},
            0.05,
          );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      };

      mm.add(`${DESKTOP_QUERY} and ${MOTION_QUERY}`, () =>
        cure({
          trigger: stage,
          start: 'top top',
          end: '+=240%',
          scrub: SCRUB_PIN,
          pin: true,
          anticipatePin: 1,
        }),
      );

      // Triggered off the figure, not the section: on a phone the bar sits in
      // the middle of a tall column, and a section-length trigger finishes the
      // cure before the bar has come into view at all.
      mm.add(`${MOBILE_QUERY} and ${MOTION_QUERY}`, () =>
        cure({trigger: figure, start: 'top 88%', end: 'bottom 25%', scrub: SCRUB_SCENE}),
      );

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section ref={sectionRef} className={styles['cure']}>
      <div ref={stageRef} className={styles['stage']}>
        <div className={styles['rail']} aria-hidden="true">
          <div ref={railRef} className={styles['rail-fill']} />
        </div>

        <div className={styles['grid']}>
          <h2 className={styles['heading']}>{heading}</h2>

          <figure ref={figureRef} className={styles['bar']}>
            <img
              ref={barRef}
              src={CuringBar}
              alt="A cured bar of Isla Suds lavender goat milk soap"
              width={827}
              height={1193}
              loading="lazy"
              decoding="async"
            />

            {/* Decorative: the paragraph beside it already says six weeks. */}
            <figcaption className={styles['week']} aria-hidden="true">
              Week
              <span ref={weekRef} className={styles['week-number']}>
                {cureWeeks}
              </span>
            </figcaption>
          </figure>

          <div ref={stepsRef} className={styles['steps']}>
            {content.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

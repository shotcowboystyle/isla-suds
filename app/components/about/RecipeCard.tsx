import {useId, useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import CardPaper from '~/assets/images/about/card.webp';
import {ABOUT_PAGE} from '~/content/about';
import {MOTION_QUERY, SCRUB_SCENE} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './RecipeCard.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, useGSAP);
}

const {recipe} = ABOUT_PAGE;

/** A toddler's goat, in crayon. Each stroke draws on its own. */
const GOAT_STROKES = [
  'M40 70 C40 45 120 40 140 62 C155 80 130 100 90 98 C55 97 38 90 40 70',
  'M60 95 L56 125 M80 98 L81 128 M110 97 L113 126 M130 90 L136 120',
  'M140 35 C155 25 175 35 170 52 C166 66 145 68 138 55 C134 47 135 40 140 35',
  'M145 32 C142 20 148 12 152 10 M160 30 C163 18 170 14 174 14',
  'M154 44 L156 46 M150 57 C155 61 161 60 164 55 M40 68 C30 62 28 55 34 52',
];

/**
 * The family recipe card. Three hands on one card: the older cursive is the
 * recipe, our ballpoint is the notes, Isla's crayon is the goat. Real text, so
 * it reads (and translates) as a list. `stamped` is the finished card the
 * fridge holds at the close.
 */
export function RecipeCardFace({stamped = false, className}: {stamped?: boolean; className?: string}) {
  const {card} = recipe;
  const crayon = `crayon${useId().replace(/:/g, '')}`;

  return (
    <div data-card className={cn(styles['card'], className)}>
      <img src={CardPaper} alt="" width={1600} height={971} className={styles['paper']} />

      <div className={styles['writing']}>
        <p data-ink="older" className={styles['title']}>
          {card.title}
        </p>

        <ol className={styles['lines']}>
          {card.lines.map((line) => (
            <li key={line.older} className={styles['line']}>
              <span data-ink="older" className={styles['older']}>
                {line.older}
              </span>
              {line.note ? (
                <ins data-ink="note" className={styles['note']}>
                  {line.note}
                </ins>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      {/* Our ballpoint loop around the last note; decorative. */}
      <svg className={styles['loop']} viewBox="0 0 200 60" aria-hidden="true">
        <path
          data-draw="note"
          pathLength={1}
          d="M30 12 C70 -2 175 2 190 24 C200 44 140 58 80 55 C30 52 6 40 10 26 C14 14 40 8 60 8"
        />
      </svg>

      <div className={styles['isla']}>
        <p data-ink="label" className={styles['isla-label']}>
          {card.isla}
        </p>
        <svg className={styles['arrow']} viewBox="0 0 60 40" aria-hidden="true">
          <path data-draw="label" pathLength={1} d="M4 32 C18 34 36 28 52 10 M52 10 L42 12 M52 10 L51 21" />
        </svg>
        <svg className={styles['goat']} viewBox="0 0 200 140" role="img" aria-label="A crayon drawing of a goat">
          <defs>
            <filter id={crayon}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
              <feDisplacementMap in="SourceGraphic" scale="3" />
            </filter>
          </defs>
          <g filter={`url(#${crayon})`}>
            {GOAT_STROKES.map((d) => (
              <path key={d} data-draw="crayon" pathLength={1} d={d} />
            ))}
          </g>
        </svg>
      </div>

      {stamped ? (
        <span className={styles['stamp']} aria-hidden="true">
          {ABOUT_PAGE.isla.stamp}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Act 2: the signature. The stage sticks while the scroll writes the card:
 * the older hand first, line by line, then our notes, then Isla's goat.
 */
export function RecipeAct() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        // A staggered fromTo only renders its first target's start state up
        // front, so the rest would show written before the hand gets there.
        GSAP.set('[data-ink="older"]', {clipPath: 'inset(-20% 100% -20% 0%)'});
        GSAP.set('[data-ink="note"]', {clipPath: 'inset(-30% 100% -30% 0%)'});
        GSAP.set('[data-draw="crayon"]', {strokeDashoffset: 1.05});

        const tl = GSAP.timeline({
          defaults: {ease: 'none'},
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: SCRUB_SCENE,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          '[data-card]',
          {yPercent: 40, rotation: -9, opacity: 0},
          {yPercent: 0, rotation: -2, opacity: 1, duration: 0.08, ease: 'power2.out'},
          0,
        );

        // A hand writes left to right; the clip opens at that speed.
        tl.fromTo(
          '[data-ink="older"]',
          {clipPath: 'inset(-20% 100% -20% 0%)'},
          {clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.065, stagger: 0.075},
          0.1,
        ).fromTo(
          '[data-ink="note"]',
          {clipPath: 'inset(-30% 100% -30% 0%)'},
          {clipPath: 'inset(-30% -5% -30% 0%)', duration: 0.055, stagger: 0.07},
          0.5,
        );
        tl.fromTo('[data-draw="note"]', {strokeDashoffset: 1.05}, {strokeDashoffset: 0, duration: 0.05}, 0.72)
          .fromTo(
            '[data-ink="label"]',
            {clipPath: 'inset(-30% 100% -30% 0%)'},
            {clipPath: 'inset(-30% -5% -30% 0%)', duration: 0.03},
            0.79,
          )
          .fromTo('[data-draw="label"]', {strokeDashoffset: 1.05}, {strokeDashoffset: 0, duration: 0.03}, 0.81)
          .fromTo(
            '[data-draw="crayon"]',
            {strokeDashoffset: 1.05},
            {strokeDashoffset: 0, duration: 0.025, stagger: 0.022},
            0.83,
          )
          .to({}, {duration: 0.06});
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section ref={sectionRef} className={styles['act']} aria-labelledby="recipe-title">
      <div className={styles['stage']}>
        <div className={styles['copy']}>
          <h2 id="recipe-title" className={styles['heading']}>
            {recipe.heading}
          </h2>
          <p className={styles['body']}>{recipe.body}</p>
          <p className={styles['sticker']}>{recipe.sticker}</p>
        </div>

        <RecipeCardFace className={styles['act-card']} />
      </div>
    </section>
  );
}

import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {ABOUT_PAGE} from '~/content/about';
import {
  ENTER_EASE,
  MOTION_QUERY,
  REDUCED_MOTION_QUERY,
  REVEAL_START,
  SCRUB_REVEAL,
  SCRUB_SCENE,
  WORD_STAGGER,
} from '~/lib/motion/tokens';
import styles from './AboutChapters.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/** Where the ink starts before the scroll brings it up to `INK`. */
const INK_DIM = '#a4625f';
const INK = '#faeade';

/**
 * Act 2 — the inheritance.
 *
 * The frame never moves. The only thing that happens is ink arriving, word by
 * word, under the reader's own wheel. Deliberately the stillest act on the page,
 * because act 3 directly after it does nothing but travel.
 */
export function ChapterInheritance() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const heading = headingRef.current;
      const body = bodyRef.current;

      if (!section || !heading || !body) return;

      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        // `autoSplit` re-splits on font load and on resize, throwing away the
        // nodes the timeline tweens. Rebuild whenever either split re-runs.
        const splits: {heading?: SplitText; body?: SplitText} = {};
        let tl: gsap.core.Timeline | undefined;

        const build = () => {
          const {heading: headingSplit, body: bodySplit} = splits;
          if (!headingSplit || !bodySplit) return;

          tl?.scrollTrigger?.kill();
          tl?.kill();

          // Bottom-relative end: the copy fills the section's whole height, so
          // a top-relative end finishes with the last paragraph below the fold.
          tl = GSAP.timeline({
            scrollTrigger: {
              trigger: section,
              start: REVEAL_START,
              end: 'bottom 70%',
              scrub: SCRUB_REVEAL,
              invalidateOnRefresh: true,
            },
          });

          tl.fromTo(
            headingSplit.words,
            {color: INK_DIM},
            {color: INK, ease: 'power1.in', stagger: WORD_STAGGER * 2.5},
          ).fromTo(
            bodySplit.words,
            {color: INK_DIM},
            {color: INK, ease: 'none', stagger: WORD_STAGGER * 0.22},
            '-=0.35',
          );
        };

        splits.heading = SplitText.create(heading, {type: 'words', autoSplit: true, onSplit: build});
        splits.body = SplitText.create(body, {type: 'words', aria: 'none', autoSplit: true, onSplit: build});
        build();

        return () => {
          tl?.scrollTrigger?.kill();
          tl?.kill();
          splits.heading?.revert();
          splits.body?.revert();
        };
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section ref={sectionRef} className={styles['inheritance']}>
      <div className={styles['inner']}>
        <p className={styles['marker']}>{ABOUT_PAGE.recipeHeritage.marker}</p>

        <h2 ref={headingRef} className={styles['inheritance-heading']}>
          {ABOUT_PAGE.recipeHeritage.heading}
        </h2>

        <div ref={bodyRef} className={styles['inheritance-body']}>
          {ABOUT_PAGE.recipeHeritage.content.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Act 3 — the turn.
 *
 * A heading wider than the viewport that the wheel drags sideways, so the
 * sentence is read by travelling rather than by looking. The three paragraphs
 * trail it at three different rates, which is what keeps the act reading as
 * lateral movement instead of a fade-in.
 */
export function ChapterTurn() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const heading = headingRef.current;
      const rule = ruleRef.current;
      const body = bodyRef.current;

      if (!section || !heading || !rule || !body) return;

      const columns = GSAP.utils.toArray<HTMLElement>('p', body);
      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        // Single line only while it is being dragged sideways; `mm.revert()`
        // puts it back to wrapping.
        GSAP.set(heading, {whiteSpace: 'nowrap'});

        const pan = GSAP.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: SCRUB_SCENE,
            invalidateOnRefresh: true,
          },
        });

        pan
          .fromTo(heading, {xPercent: 8}, {xPercent: -46, ease: 'none'}, 0)
          .fromTo(
            columns,
            {xPercent: 6},
            {xPercent: -6, ease: 'none', stagger: {each: 0.08, from: 'start'}},
            0,
          );

        const enter = GSAP.timeline({
          scrollTrigger: {
            trigger: section,
            start: REVEAL_START,
            end: 'center 60%',
            scrub: SCRUB_REVEAL,
            invalidateOnRefresh: true,
          },
        });

        enter
          .fromTo(rule, {scaleX: 0}, {scaleX: 1, ease: 'none'}, 0)
          .fromTo(columns, {yPercent: 30, opacity: 0}, {yPercent: 0, opacity: 1, ease: ENTER_EASE, stagger: 0.12}, 0);

        return () => {
          pan.scrollTrigger?.kill();
          pan.kill();
          enter.scrollTrigger?.kill();
          enter.kill();
        };
      });

      mm.add(REDUCED_MOTION_QUERY, () => {
        GSAP.set(rule, {scaleX: 1});
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section ref={sectionRef} className={styles['turn']}>
      <h2 ref={headingRef} className={styles['turn-heading']}>
        {ABOUT_PAGE.founderStory.heading}
      </h2>

      <div ref={ruleRef} className={styles['rule']} aria-hidden="true" />

      <div ref={bodyRef} className={styles['turn-body']}>
        {ABOUT_PAGE.founderStory.content.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

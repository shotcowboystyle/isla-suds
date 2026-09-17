import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import StoreMap from '~/assets/images/store-map.svg';
import {LiquidButton} from '~/components/ui/LiquidButton';
import {
  CHAR_STAGGER,
  ENTER_EASE,
  MOTION_QUERY,
  REDUCED_MOTION_QUERY,
  REVEAL_END,
  REVEAL_START,
  SCRUB_REVEAL,
  WORD_STAGGER,
} from '~/lib/motion/tokens';
import styles from './LocalStores.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export function LocalStores() {
  const sectionRef = useRef<HTMLElement>(null);
  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const clippedBoxRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const heading1 = heading1Ref.current;
      const clippedBox = clippedBoxRef.current;
      const paragraph = paragraphRef.current;

      if (!section || !heading1 || !clippedBox || !paragraph) {
        return;
      }

      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        // `autoSplit` re-splits on font load and on resize. Rebuild the timeline
        // when that happens so the scrubbed trigger never points at dead nodes.
        const splits: {heading?: SplitText; paragraph?: SplitText} = {};
        let contentTl: gsap.core.Timeline | undefined;

        const build = () => {
          const {heading: heading1Split, paragraph: paragraphSplit} = splits;
          if (!heading1Split || !paragraphSplit) return;

          contentTl?.scrollTrigger?.kill();
          contentTl?.kill();

          contentTl = GSAP.timeline({
            scrollTrigger: {
              trigger: section,
              start: REVEAL_START,
              end: REVEAL_END,
              scrub: SCRUB_REVEAL,
              invalidateOnRefresh: true,
            },
          });

          contentTl
            .fromTo(
              heading1Split.chars,
              {yPercent: 100},
              {yPercent: 0, stagger: CHAR_STAGGER, ease: ENTER_EASE},
            )
            .fromTo(
              clippedBox,
              {opacity: 0, width: 0},
              {opacity: 1, width: 'auto', duration: 0.5, ease: 'circ.out'},
              '-=0.5',
            )
            .fromTo(
              paragraphSplit.words,
              {yPercent: 300, rotate: 3},
              {
                yPercent: 0,
                rotate: 0,
                ease: 'power1.inOut',
                duration: 1,
                stagger: WORD_STAGGER * 0.2,
              },
              '-=0.5',
            );
        };

        splits.heading = SplitText.create(heading1, {
          type: 'chars',
          mask: 'chars',
          autoSplit: true,
          onSplit: build,
        });
        splits.paragraph = SplitText.create(paragraph, {
          type: 'words',
          aria: 'none',
          autoSplit: true,
          onSplit: build,
        });

        build();

        return () => {
          contentTl?.scrollTrigger?.kill();
          contentTl?.kill();
          splits.heading?.revert();
          splits.paragraph?.revert();
        };
      });

      mm.add(REDUCED_MOTION_QUERY, () => {
        GSAP.set(clippedBox, {opacity: 1, width: 'auto'});
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section ref={sectionRef} className={styles['map-section-wrapper']}>
      <div className={styles['map-section-inner']}>
        <div className={styles['map-section-info']}>
          <div className={styles['heading-text-wrapper']}>
            <h2 ref={heading1Ref} className={styles['heading-text']}>
              Right Around
            </h2>
          </div>

          <div ref={clippedBoxRef} className={styles['clipped-text-box']}>
            <h1 className={styles['clipped-text']}>the corner</h1>
          </div>

          <div className={styles['paragraph-text-wrapper']}>
            <p ref={paragraphRef} className={styles['paragraph-text']}>
              Buy our soaps at your local store or get them delivered (to your door).
            </p>
          </div>

          <LiquidButton href="/locations" text="Find a Store" />
        </div>

        <img
          src={StoreMap}
          loading="lazy"
          width="1840"
          height="775"
          alt="Store Map"
          className={styles['background-image']}
        />
      </div>
    </section>
  );
}

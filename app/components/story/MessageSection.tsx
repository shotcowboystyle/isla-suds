import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {MOTION_QUERY, REDUCED_MOTION_QUERY, REVEAL_START, WORD_STAGGER} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './MessageSection.module.css';

GSAP.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Colour the copy settles into as it reveals. */
const INK = '#faeade';

export const MessageSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const clippedBox1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const text1 = text1Ref.current;
      const clippedBox1 = clippedBox1Ref.current;
      const text2 = text2Ref.current;
      const paragraph = paragraphRef.current;

      if (!section || !text1 || !clippedBox1 || !text2 || !paragraph) {
        return;
      }

      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        const text1Splitted = SplitText.create(text1, {type: 'words', autoSplit: true});
        const text2Splitted = SplitText.create(text2, {type: 'words', autoSplit: true});
        const splittedParagraph = SplitText.create(paragraph, {
          type: 'words, lines',
          linesClass: 'paragraph-line',
          aria: 'none',
          autoSplit: true,
        });

        const masterTl = GSAP.timeline({
          scrollTrigger: {
            trigger: section,
            start: REVEAL_START,
            once: true,
          },
        });

        masterTl
          .to(text1Splitted.words, {
            color: INK,
            ease: 'power1.in',
            stagger: WORD_STAGGER * 3,
          })
          .fromTo(
            clippedBox1,
            {opacity: 0, width: 0},
            {opacity: 1, width: 'auto', duration: 0.5, ease: 'circ.out'},
            '-=0.3',
          )
          .to(
            text2Splitted.words,
            {
              color: INK,
              ease: 'power1.in',
              stagger: WORD_STAGGER * 3,
            },
            '-=0.5',
          )
          .fromTo(
            splittedParagraph.words,
            {yPercent: 300, rotate: 3},
            {yPercent: 0, rotate: 0, ease: 'power1.inOut', stagger: WORD_STAGGER * 0.6},
            '-=0.5',
          );

        return () => {
          text1Splitted.revert();
          text2Splitted.revert();
          splittedParagraph.revert();
        };
      });

      mm.add(REDUCED_MOTION_QUERY, () => {
        GSAP.set([text1, text2], {color: INK});
        GSAP.set(clippedBox1, {opacity: 1, width: 'auto'});
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section data-speed="0.5" data-lag="0.5">
      <div ref={sectionRef} className={styles['message-section-wrapper']}>
        <div className={styles['text-wrapper']} data-lag="0.5">
          <div className={styles['grid']}>
            <div className={styles['heading-text-wrapper']}>
              <h1 ref={text1Ref} className={cn(styles['heading-text'])}>
                Freshen up and feel great in your
              </h1>
            </div>

            <div className={styles['clipped-text-wrapper']}>
              <div className={styles['clipped-text-inner']}>
                <div className={styles['clipped-text-content-wrapper']}>
                  <div ref={clippedBox1Ref} className={styles['clipped-text-content']}>
                    <h1 className={cn(styles['clipped-text'])}>own skin</h1>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles['heading-text-wrapper']}>
              <h1 ref={text2Ref} className={cn(styles['heading-text'])}>
                and glow with every cleanse from Isla Suds
              </h1>
            </div>
          </div>

          <p ref={paragraphRef} className={cn(styles['paragraph'])}>
            Unscented goat milk soap is a gentle, nourishing bar, thoughtfully crafted for your sensitive, reactive, and
            fragrance-intolerant skin.
          </p>
        </div>
      </div>
    </section>
  );
};

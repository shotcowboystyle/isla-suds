import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {SplitText} from 'gsap/SplitText';
import {useIsMobile} from '~/hooks/use-is-mobile';
import {cn} from '~/utils/cn';
import styles from './MessageSection.module.css';

export const MessageSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const clippedBox1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const {isMobile, isLoading} = useIsMobile();

  useGSAP(
    () => {
      if (
        isLoading ||
        !sectionRef.current ||
        !text1Ref.current ||
        !clippedBox1Ref.current ||
        !text2Ref.current ||
        !paragraphRef.current
      ) {
        return;
      }

      const text1Splitted = SplitText.create(text1Ref.current, {
        type: 'words',
      });

      const text2Splitted = SplitText.create(text2Ref.current, {
        type: 'words',
      });

      const splittedParagraph = SplitText.create(paragraphRef.current, {
        type: 'words, lines',
        linesClass: 'paragraph-line',
        aria: 'none',
      });

      gsap.to(text1Splitted.words, {
        color: '#faeade',
        ease: 'power1.in',
        stagger: 1,
        scrollTrigger: {
          trigger: text1Ref.current,
          start: isMobile ? 'top 65%' : 'top center',
          end: '30% center',
          scrub: true,
        },
      });

      gsap.to(text2Splitted.words, {
        color: '#faeade',
        ease: 'power1.in',
        stagger: 1,
        scrollTrigger: {
          trigger: text2Ref.current,
          start: isMobile ? 'top 65%' : 'top center',
          end: '30% center',
          scrub: true,
        },
      });

      const revealTl = gsap.timeline({
        delay: 0.5,
        scrollTrigger: {
          trigger: text1Ref.current,
          start: isMobile ? 'top 70%' : 'top 60%',
        },
      });

      revealTl.from(clippedBox1Ref.current, {
        duration: 1,
        opacity: 0,
        width: 0,
        ease: 'circ.inOut',
      });

      const paragraphTl = gsap.timeline({
        scrollTrigger: {
          trigger: paragraphRef.current,
          start: 'top 80%',
        },
      });

      paragraphTl.from(splittedParagraph.words, {
        yPercent: 300,
        rotate: 3,
        ease: 'power1.inOut',
        duration: 1,
        stagger: 0.03,
      });
    },
    {dependencies: [sectionRef, text1Ref, clippedBox1Ref, text2Ref, paragraphRef, isLoading, isMobile]},
  );

  return (
    <section ref={sectionRef} className={styles['message-section-wrapper']} data-speed="0.5" data-lag="0.5">
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
    </section>
  );
};

import {useRef} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {SplitText} from 'gsap/SplitText';
// import {useIsMobile} from '~/hooks/use-is-mobile';
import styles from './MessageSection.module.css';

// gsap.registerPlugin(ScrollTrigger, SplitText);

// const interludeTextStyles = `text-faint-text text-center text-[9rem] max-md:text-[6.5rem] max-sm:text-[4.5rem] leading-none font-bold tracking-[-0.04em] uppercase`;

export const MessageSection = () => {
  const messageContentRef = useRef<HTMLDivElement>(null);
  // const {isMobile, isLoading} = useIsMobile();

  useGSAP(
    () => {
      const text1Splitted = SplitText.create('#message-heading-start', {
        type: 'words',
      });

      const text2Splitted = SplitText.create('#message-heading-end', {
        type: 'words',
      });

      const splittedParagraph = SplitText.create('#message-paragraph', {
        type: 'words, lines',
        linesClass: 'paragraph-line',
        aria: 'none',
      });

      gsap.to(text1Splitted.words, {
        color: '#faeade',
        ease: 'power1.in',
        stagger: 1,
        scrollTrigger: {
          trigger: '#message-heading-start',
          start: 'top center',
          end: '30% center',
          scrub: true,
        },
      });

      gsap.to(text2Splitted.words, {
        color: '#faeade',
        ease: 'power1.in',
        stagger: 1,
        scrollTrigger: {
          trigger: '#message-heading-end',
          start: 'top center',
          end: '30% center',
          scrub: true,
        },
      });

      const revealTl = gsap.timeline({
        delay: 1,
        scrollTrigger: {
          trigger: '#message-clipped-text',
          start: 'top 100%',
        },
      });

      revealTl.from('#message-clipped-text', {
        duration: 1,
        opacity: 0,
        width: 0,
        ease: 'circ.inOut',
      });

      const paragraphTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#message-paragraph',
          start: 'top center',
        },
      });

      paragraphTl.from(splittedParagraph.words, {
        yPercent: 300,
        rotate: 3,
        ease: 'power1.inOut',
        duration: 1,
        stagger: 0.01,
      });

      // const tl = gsap.timeline({
      //   scrollTrigger: {
      //     trigger: '#message-content',
      //     start: isMobile ? 'top 80%' : 'top 60%',
      //     end: isMobile ? 'bottom bottom' : 'bottom 70%',
      //     scrub: true,
      //     invalidateOnRefresh: true,
      //   },
      // });

      // tl.to(text1Splitted.words, {
      //   color: '#faeade',
      //   stagger: 1,
      //   duration: 2,
      //   ease: 'power2.out',
      // })
      //   .from(
      //     '#message-clipped-text',
      //     {
      //       opacity: 0,
      //       width: 0,
      //       ease: 'power3.inOut',
      //       duration: 10,
      //     },
      //     '<=2',
      //   )
      //   .to(
      //     text2Splitted.words,
      //     {
      //       color: '#faeade',
      //       stagger: 1,
      //       duration: 2,
      //       ease: 'power2.out',
      //     },
      //     '+=1',
      //   )
      //   .from(
      //     splittedParagraph.words,
      //     {
      //       yPercent: 200,
      //       rotate: 5,
      //       stagger: 0.2,
      //       ease: 'power2.out',
      //       duration: 2,
      //     },
      //     '+=1',
      //   );
    },
    // {dependencies: [isMobile], revertOnUpdate: true},
  );

  return (
    <section>
      <div id="message-content" className={styles['message-section-wrapper']}>
        <div className={styles['text-wrapper']}>
          <div className={styles['grid']}>
            <div data-message-text-start className={styles['heading-text-wrapper']}>
              <h1 id="message-heading-start" className={styles['heading-text']}>
                Freshen up and feel great in your
              </h1>
            </div>

            <div className={styles['clipped-text-wrapper']}>
              <div className={styles['clipped-text-inner']}>
                <div className={styles['clipped-text-content-wrapper']}>
                  <div id="message-clipped-text" className={styles['clipped-text-content']}>
                    <h1 className={styles['clipped-text']}>own skin</h1>
                  </div>
                </div>
              </div>
            </div>

            <div data-message-text-end className={styles['heading-text-wrapper']}>
              <h1 id="message-heading-end" className={styles['heading-text']}>
                and glow with every cleanse from Isla Suds
              </h1>
            </div>
          </div>

          <div id="paragraph-wrapper" className={styles['paragraph-wrapper']}>
            <p id="message-paragraph" className={styles['paragraph']}>
              Unscented goat milk soap is a gentle, nourishing bar, thoughtfully crafted for your sensitive, reactive,
              and fragrance-intolerant skin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

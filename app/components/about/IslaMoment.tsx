import {useRef} from 'react';
import {Link} from 'react-router';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SplitText} from 'gsap/SplitText';
import {ABOUT_PAGE} from '~/content/about';
import {ENTER_EASE, MOTION_QUERY, REVEAL_START, SCRUB_REVEAL, WORD_STAGGER} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './IslaMoment.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

const {heading, content, pullQuote} = ABOUT_PAGE.islaNameSake;

/**
 * The quote is lifted out of the second paragraph to carry the page's peak, so
 * the paragraph renders without it. Screen readers get the sentence once, in
 * the blockquote, where it is also the largest thing on the page.
 */
const setup = [content[0], content[1].replace(pullQuote, '').trim()].filter(Boolean);

/**
 * Act 5 — the peak.
 *
 * Longest span, least happening. The acts before it get loud; this one earns
 * its size by being the only place on the page where the type is quiet.
 */
export function IslaMoment() {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const body = bodyRef.current;
      const quote = quoteRef.current;

      if (!section || !body || !quote) return;

      const mm = GSAP.matchMedia();

      mm.add(MOTION_QUERY, () => {
        const paragraphs = GSAP.utils.toArray<HTMLElement>('p', body);

        const enter = GSAP.timeline({
          scrollTrigger: {
            trigger: body,
            start: REVEAL_START,
            end: 'bottom 60%',
            scrub: SCRUB_REVEAL,
            invalidateOnRefresh: true,
          },
        });

        enter.fromTo(
          paragraphs,
          {yPercent: 24, opacity: 0},
          {yPercent: 0, opacity: 1, ease: ENTER_EASE, stagger: 0.2},
        );

        // `autoSplit` re-splits on font load and resize; rebuild when it does.
        const splits: {quote?: SplitText} = {};
        let peak: gsap.core.Timeline | undefined;

        const build = () => {
          const {quote: quoteSplit} = splits;
          if (!quoteSplit) return;

          peak?.scrollTrigger?.kill();
          peak?.kill();

          // The slowest reveal on the page. The span is roughly a full
          // viewport, so the sentence arrives at about a word per scroll beat.
          peak = GSAP.timeline({
            scrollTrigger: {
              trigger: quote,
              start: 'top 88%',
              end: 'bottom 55%',
              scrub: SCRUB_REVEAL,
              invalidateOnRefresh: true,
            },
          });

          peak.fromTo(
            quoteSplit.words,
            {yPercent: 108},
            {yPercent: 0, ease: 'power2.out', stagger: WORD_STAGGER * 3},
          );
        };

        splits.quote = SplitText.create(quote, {type: 'words', mask: 'words', autoSplit: true, onSplit: build});
        build();

        return () => {
          enter.scrollTrigger?.kill();
          enter.kill();
          peak?.scrollTrigger?.kill();
          peak?.kill();
          splits.quote?.revert();
        };
      });

      return () => mm.revert();
    },
    {scope: sectionRef},
  );

  return (
    <section ref={sectionRef} className={styles['isla']}>
      <div className={styles['isla-inner']}>
        <h2 className={styles['isla-heading']}>{heading}</h2>

        <div ref={bodyRef} className={styles['isla-body']}>
          {setup.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <blockquote className={styles['quote']}>
          <p ref={quoteRef}>{pullQuote}</p>
        </blockquote>
      </div>
    </section>
  );
}

/** Act 6 — the close. Resolves in the home page's voice and holds. */
export function AboutClose() {
  const {close} = ABOUT_PAGE;

  return (
    <section className={styles['close']}>
      <div className={styles['close-inner']}>
        <h2 className={styles['close-heading']}>
          {close.heading}, <span className={styles['stamp']}>{close.stamp}</span>
        </h2>

        <p className={styles['close-body']}>{close.body}</p>

        <div className={styles['actions']}>
          <Link to={close.primary.href} className={cn(styles['cta'], styles['cta-primary'])}>
            {close.primary.label}
          </Link>
          <Link to={close.secondary.href} className={cn(styles['cta'], styles['cta-secondary'])}>
            {close.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

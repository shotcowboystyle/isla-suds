import React, {useMemo, useRef, Fragment} from 'react';
import {useGSAP} from '@gsap/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {cn} from '~/utils/cn';
import styles from './JumboMarquee.module.css';

gsap.registerPlugin(ScrollTrigger);

interface JumboMarqueeProps {
  text: string;
  color: string;
  className?: string;
}

export function JumboMarquee({text, color, className = ''}: JumboMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const words = text.split(',').filter(Boolean);
  const wordCount = words.length;

  useGSAP(
    () => {
      const oddLines = gsap.utils.toArray<HTMLElement>(`.js-marq-odd .${styles['big-marq-text']}`);
      const evenLines = gsap.utils.toArray<HTMLElement>(`.js-marq-even .${styles['big-marq-text']}`);

      // Odd rows: left-to-right (Start far left at -5%, animate to 0)
      gsap.fromTo(
        oddLines,
        {xPercent: -5},
        {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      );

      // Even rows: right-to-left (Start at 0, animate far left to -5%)
      gsap.fromTo(
        evenLines,
        {xPercent: 10},
        {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      );
    },
    {scope: containerRef},
  );

  // Decide exactly 1 accented word per row. We have 6 rows.
  // Generate a shuffled array of indices up to `wordCount`. If there are less than 6 words, we repeat the shuffle.
  const rowAccents = useMemo(() => {
    let pool: number[] = [];
    const accents: number[] = [];

    for (let i = 0; i < 6; i++) {
      if (pool.length === 0) {
        pool = Array.from({length: wordCount}).map((_, i) => i);
        for (let j = pool.length - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          [pool[j], pool[k]] = [pool[k], pool[j]];
        }
      }
      accents.push(pool.pop()!);
    }
    return accents;
  }, [wordCount]);

  return (
    <section ref={containerRef} className={cn(styles['behind-section'], className)}>
      {/* <svg
        // ref={sectionArc}
        className={cn(styles['arc'], styles['arc-top'])}
        width="1517"
        height="93"
        viewBox="0 0 1517 93"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 92.0674C528.5 -28.9327 977.5 -32.4328 1516.5 92.0674H0Z" className={`fill-${color}`}></path>
      </svg> */}

      <div className={styles['big-marquee-block']}>
        {Array.from({length: 8}).map((_, rowIndex) => {
          const isOddRow = rowIndex % 2 === 0; // 0, 2, 4 map to 'is-odd' historically
          const accentWordIndex = rowAccents[rowIndex];

          return (
            <div
              key={rowIndex}
              className={cn(
                styles['big-marq-text-block'],
                isOddRow ? styles['is-odd'] : styles['is-even'],
                isOddRow ? 'js-marq-odd' : 'js-marq-even',
                // Force flex-start so xPercent animations don't pull right-aligned text off screen on start
                'justify-start!',
              )}
            >
              <div className={styles['big-marq-text']}>
                {/* Tile horizontally 4 times */}
                {Array.from({length: 4}).map((_, tileIndex) => (
                  <span key={tileIndex} className={`pl-4 m4-2 left-${tileIndex * 3} inline-flex flex-nowrap shrink-0`}>
                    {words.map((word, wordIndex) => (
                      <Fragment key={wordIndex}>
                        <span
                          className={cn(
                            'whitespace-pre pr-4 ml-2',
                            wordIndex === accentWordIndex && cn(styles['span-text'], styles['text-orange']),
                          )}
                        >
                          {word.trim()}
                        </span>
                        <span className="separator">{' • '}</span>
                      </Fragment>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles['large-circle']}></div>
    </section>
  );
}

import React, {useRef, Fragment} from 'react';
import {useGSAP} from '@gsap/react';
import GSAP from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SCRUB_SCENE} from '~/lib/motion/tokens';
import {cn} from '~/utils/cn';
import styles from './JumboMarquee.module.css';

if (typeof document !== 'undefined') {
  GSAP.registerPlugin(ScrollTrigger);
}

const ROW_COUNT = 5;
const TILES_PER_ROW = 4;

/** Accents per repeated tile. Two keeps one in view on every row at once. */
const ACCENTS_PER_TILE = 2;

/**
 * Which words in a row's tile get the accent colour.
 *
 * Two per tile, placed half a tile apart, so a row always has an accent on
 * screen — one per tile is too sparse at this type size and leaves most rows
 * plain. Strides of 2 (down the rows) and 3 (across the tiles) are co-prime with
 * the five-word list, so every tile accents a different stretch of text and each
 * row offsets the whole set: the accents read as a diagonal rather than as one
 * word repeating in a vertical column.
 *
 * Deterministic on purpose. The previous version called `Math.random()` inside a
 * `useMemo`, so the server and the client disagreed on every render, and it only
 * generated six entries for eight rows — the last two rows had no accent at all.
 */
export function accentIndicesFor(row: number, tile: number, wordCount: number): number[] {
  if (wordCount <= 0) return [];

  const first = (row * 2 + tile * 3) % wordCount;
  const step = Math.max(1, Math.round(wordCount / ACCENTS_PER_TILE));

  return Array.from({length: Math.min(ACCENTS_PER_TILE, wordCount)}, (_, n) => (first + n * step) % wordCount);
}

interface JumboMarqueeProps {
  text: string;
  className?: string;
}

export function JumboMarquee({text, className = ''}: JumboMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const words = text.split(',').filter(Boolean);
  const wordCount = words.length;

  useGSAP(
    () => {
      const oddLines = GSAP.utils.toArray<HTMLElement>(`.js-marq-odd .${styles['big-marq-text']}`);
      const evenLines = GSAP.utils.toArray<HTMLElement>(`.js-marq-even .${styles['big-marq-text']}`);

      // Equal and opposite, so the rows read as counter-drift rather than as two
      // unrelated slides. Rows are tiled four times over, so there is plenty of
      // width either side of the viewport to travel into.
      const drift = {
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: SCRUB_SCENE,
        },
      } as const;

      GSAP.fromTo(oddLines, {xPercent: -6}, {xPercent: 3, ...drift});
      GSAP.fromTo(evenLines, {xPercent: 6}, {xPercent: -3, ...drift});
    },
    {scope: containerRef},
  );

  return (
    <section ref={containerRef} className={cn(styles['behind-section'], className)}>
      <div className={styles['big-marquee-block']}>
        {Array.from({length: ROW_COUNT}).map((_, rowIndex) => {
          const isOddRow = rowIndex % 2 === 0; // 0, 2, 4 map to 'is-odd' historically

          return (
            <div
              key={rowIndex}
              className={cn(
                styles['big-marq-text-block'],
                isOddRow ? styles['is-odd'] : styles['is-even'],
                isOddRow ? 'js-marq-odd' : 'js-marq-even',
              )}
            >
              <div className={styles['big-marq-text']}>
                {Array.from({length: TILES_PER_ROW}).map((_, tileIndex) => {
                  const accented = accentIndicesFor(rowIndex, tileIndex, wordCount);

                  return (
                    <span key={tileIndex} className="pl-4 inline-flex flex-nowrap shrink-0">
                      {words.map((word, wordIndex) => (
                        <Fragment key={wordIndex}>
                          <span
                            className={cn(
                              'whitespace-pre pr-4 ml-2',
                              accented.includes(wordIndex) && cn(styles['span-text'], styles['text-orange']),
                            )}
                          >
                            {word.trim()}
                          </span>
                          <span aria-hidden="true">{' • '}</span>
                        </Fragment>
                      ))}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles['large-circle']}></div>
    </section>
  );
}
